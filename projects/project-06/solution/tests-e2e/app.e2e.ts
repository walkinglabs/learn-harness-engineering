import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { _electron as electron, ElectronApplication, Page } from 'playwright-core';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// Drives the built app (dist/) in a real Electron window, so it catches what
// the unit suite cannot: the preload bridge, IPC wiring and the React UI.

const ROOT = path.resolve(__dirname, '..');
const SAMPLES = path.join(ROOT, 'data', 'sample-documents');
const SAMPLE_FILES = ['design-notes.md', 'meeting-summary.txt', 'retrieval-plan.md'].map(f => path.join(SAMPLES, f));

let app: ElectronApplication;
let win: Page;
let userDataDir: string;
const rendererErrors: string[] = [];

/** Make the next native file dialog return `files` without showing it. */
async function stubFileDialog(files: string[]): Promise<void> {
  await app.evaluate(({ dialog }, picked) => {
    dialog.showOpenDialog = (async () => ({ canceled: picked.length === 0, filePaths: picked })) as typeof dialog.showOpenDialog;
  }, files);
}

beforeAll(async () => {
  if (!fs.existsSync(path.join(ROOT, 'dist', 'main', 'main.js'))) {
    throw new Error('dist/ not found: run `npm run build` before `npm run test:e2e`.');
  }
  userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-e2e-'));
  app = await electron.launch({
    executablePath: require('electron') as unknown as string,
    // A fresh profile per run, so the test never sees or touches real data.
    args: [ROOT, `--user-data-dir=${userDataDir}`, ...(process.platform === 'linux' ? ['--no-sandbox'] : [])],
    env: { ...process.env, LOG_LEVEL: 'WARN' },
  });
  win = await app.firstWindow();
  win.on('console', msg => {
    if (msg.type() === 'error') rendererErrors.push(msg.text());
  });
  win.on('dialog', dialog => dialog.accept()); // confirm() on delete
  await win.waitForLoadState('domcontentloaded');
});

afterAll(async () => {
  await app?.close();
  fs.rmSync(userDataDir, { recursive: true, force: true });
});

describe('Knowledge Base app', () => {
  it('exposes the preload bridge to the renderer', async () => {
    const api = await win.evaluate(() => {
      // Runs in the renderer, where globalThis is window.
      const kb = (globalThis as unknown as { knowledgeBase?: Record<string, object> }).knowledgeBase;
      return kb ? Object.fromEntries(Object.entries(kb).map(([k, v]) => [k, Object.keys(v).sort()])) : null;
    });
    expect(api).not.toBeNull();
    expect(api?.documents).toContain('pickAndImport');
  });

  it('stores data in the given profile, not the real one', async () => {
    const dataDir = await app.evaluate(({ app: electronApp }) => electronApp.getPath('userData'));
    expect(path.resolve(dataDir)).toBe(path.resolve(userDataDir));
  });

  it('imports the files picked in the dialog', async () => {
    await stubFileDialog(SAMPLE_FILES);
    await win.getByRole('button', { name: '+ Import' }).click();

    await expect.poll(() => win.getByText('Documents (3)').count()).toBe(1);
    await expect.poll(() => win.getByText('Documents: 3').count()).toBe(1);
  });

  it('does nothing when the dialog is canceled', async () => {
    await stubFileDialog([]);
    await win.getByRole('button', { name: '+ Import' }).click();

    await win.waitForTimeout(300);
    expect(await win.getByText('Documents (3)').count()).toBe(1);
  });

  it('indexes each document and shows Ready in the status bar', async () => {
    for (const title of ['design-notes', 'meeting-summary', 'retrieval-plan']) {
      await win.getByText(title, { exact: true }).first().click();
      await win.getByRole('button', { name: 'Index Document' }).click();
      await expect.poll(() => win.getByText('Status: indexed').count()).toBe(1);
    }
    await expect.poll(() => win.getByText('Index: Ready').count()).toBe(1);
    expect(await win.getByText('Indexed: 3').count()).toBe(1);
  });

  it('answers a question with citations to the imported documents', async () => {
    await win.getByPlaceholder('Ask a question about your documents...').fill('What did the meeting decide about retrieval?');
    await win.getByRole('button', { name: 'Ask' }).click();

    await expect.poll(() => win.getByText('Citations:').count(), { timeout: 5_000 }).toBe(1);
    expect(await win.getByText('Confidence: 85%').count()).toBe(1);
  });

  it('stops citing a document after it is deleted', async () => {
    await win.getByText('meeting-summary', { exact: true }).first().click();
    await win.getByRole('button', { name: 'Delete' }).click();

    await expect.poll(() => win.getByText('Documents (2)').count()).toBe(1);
    expect(await win.getByText('Select a document or ask a question to get started').count()).toBe(1);

    await win.getByPlaceholder('Ask a question about your documents...').fill('meeting summary retrieval decision');
    await win.getByRole('button', { name: 'Ask' }).click();
    await win.waitForTimeout(800);

    const citations = await win.locator('text=/\\(chunk \\d+\\):/').allInnerTexts();
    expect(citations.length).toBeGreaterThan(0);
    for (const citation of citations) {
      expect(citation).not.toContain('meeting-summary');
    }
  });

  it('logged no renderer errors', () => {
    expect(rendererErrors).toEqual([]);
  });
});
