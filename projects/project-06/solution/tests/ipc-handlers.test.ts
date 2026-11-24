import * as fs from 'fs';
import * as path from 'path';
import type { IpcMain } from 'electron';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { registerIpcHandlers } from '../src/main/ipc-handlers';
import { AppStatus, ImportResult, IPC_CHANNELS } from '../src/shared/types';
import { createServices, makeTempDir, removeDir, SAMPLE_DOCS_DIR, Services, writeSourceFile } from './helpers';

type Handler = (event: unknown, ...args: unknown[]) => Promise<unknown>;

/** Stands in for Electron's ipcMain: records handlers and lets tests invoke them. */
class FakeIpcMain {
  handlers = new Map<string, Handler>();

  handle(channel: string, handler: Handler): void {
    if (this.handlers.has(channel)) throw new Error(`Duplicate handler for ${channel}`);
    this.handlers.set(channel, handler);
  }

  invoke(channel: string, ...args: unknown[]): Promise<unknown> {
    const handler = this.handlers.get(channel);
    if (!handler) throw new Error(`No handler for ${channel}`);
    return handler({}, ...args);
  }
}

let root: string;
let s: Services;
let ipc: FakeIpcMain;
/** What the stubbed native file dialog returns next; [] means the user canceled. */
let pickedFiles: string[];

beforeEach(() => {
  root = makeTempDir();
  s = createServices(path.join(root, 'data'));
  ipc = new FakeIpcMain();
  pickedFiles = [];
  registerIpcHandlers(ipc as unknown as IpcMain, s, async () => pickedFiles);
});

afterEach(() => removeDir(root));

describe('registerIpcHandlers', () => {
  it('registers exactly one handler per channel in IPC_CHANNELS', () => {
    expect([...ipc.handlers.keys()].sort()).toEqual(Object.values(IPC_CHANNELS).sort());
  });

  it('routes import, list, get and delete to DocumentService', async () => {
    const source = writeSourceFile(root, 'a.md', 'Alpha');
    const doc = (await ipc.invoke(IPC_CHANNELS.IMPORT_DOCUMENT, source)) as { id: string };

    expect(await ipc.invoke(IPC_CHANNELS.LIST_DOCUMENTS)).toEqual([doc]);
    expect(await ipc.invoke(IPC_CHANNELS.GET_DOCUMENT, doc.id)).toEqual(doc);
    expect(await ipc.invoke(IPC_CHANNELS.DELETE_DOCUMENT, doc.id)).toBe(true);
    expect(await ipc.invoke(IPC_CHANNELS.LIST_DOCUMENTS)).toEqual([]);
  });

  it('propagates import errors to the renderer as a rejected promise', async () => {
    await expect(ipc.invoke(IPC_CHANNELS.IMPORT_DOCUMENT, path.join(root, 'ghost.md'))).rejects.toThrow(/File not found/);
  });

  it('routes chunks and feedback and history to their services', async () => {
    const doc = s.documentService.importDocument(writeSourceFile(root, 'a.md', 'Alpha'));
    await ipc.invoke(IPC_CHANNELS.START_INDEXING);
    await ipc.invoke(IPC_CHANNELS.SUBMIT_FEEDBACK, 't', 'q', 'positive');

    expect(await ipc.invoke(IPC_CHANNELS.GET_CHUNKS, doc.id)).toHaveLength(1);
    expect(await ipc.invoke(IPC_CHANNELS.GET_FEEDBACK)).toMatchObject([{ rating: 'positive', comment: '' }]);
    expect(await ipc.invoke(IPC_CHANNELS.GET_HISTORY)).toEqual([]);
  });

  it('RESET_DATA clears every data file', async () => {
    s.documentService.importDocument(writeSourceFile(root, 'a.md', 'Alpha'));
    await s.indexingService.startIndexing();
    s.qaService.submitFeedback('t', 'q', 'positive');

    expect(await ipc.invoke(IPC_CHANNELS.RESET_DATA)).toEqual({ success: true });
    expect(await ipc.invoke(IPC_CHANNELS.LIST_DOCUMENTS)).toEqual([]);
    expect(await ipc.invoke(IPC_CHANNELS.GET_FEEDBACK)).toEqual([]);
    expect(await ipc.invoke(IPC_CHANNELS.GET_STATUS)).toMatchObject({ indexStatus: 'idle', currentIndexed: 0 });
  });
});

describe('status channels return the AppStatus shape the renderer reads', () => {
  const STATUS_CHANNELS = [IPC_CHANNELS.GET_STATUS, IPC_CHANNELS.GET_INDEXING_STATUS, IPC_CHANNELS.START_INDEXING];

  it.each(STATUS_CHANNELS)('%s has exactly documentsLoaded, currentIndexed, indexStatus, lastActivity', async channel => {
    s.documentService.importDocument(writeSourceFile(root, 'a.md', 'Alpha'));
    s.documentService.importDocument(writeSourceFile(root, 'b.md', 'Beta'));
    await s.indexingService.startIndexing();

    const status = (await ipc.invoke(channel)) as AppStatus;

    expect(Object.keys(status).sort()).toEqual(['currentIndexed', 'documentsLoaded', 'indexStatus', 'lastActivity']);
    expect(status).toMatchObject({ documentsLoaded: 2, currentIndexed: 2, indexStatus: 'ready' });
    expect(new Date(status.lastActivity).toISOString()).toBe(status.lastActivity);
  });

  it('START_INDEXING for one document reports partial progress', async () => {
    const a = s.documentService.importDocument(writeSourceFile(root, 'a.md', 'Alpha'));
    s.documentService.importDocument(writeSourceFile(root, 'b.md', 'Beta'));

    expect(await ipc.invoke(IPC_CHANNELS.START_INDEXING, a.id)).toMatchObject({
      documentsLoaded: 2,
      currentIndexed: 1,
      indexStatus: 'indexing',
    });
  });
});

describe('PICK_AND_IMPORT_DOCUMENTS', () => {
  it('imports every file chosen in the dialog', async () => {
    pickedFiles = fs.readdirSync(SAMPLE_DOCS_DIR).sort().map(name => path.join(SAMPLE_DOCS_DIR, name));

    const result = (await ipc.invoke(IPC_CHANNELS.PICK_AND_IMPORT_DOCUMENTS)) as ImportResult;

    expect(result.canceled).toBe(false);
    expect(result.failed).toEqual([]);
    expect(result.imported.map(d => d.filename)).toEqual(['design-notes.md', 'meeting-summary.txt', 'retrieval-plan.md']);
    expect(s.documentService.listDocuments()).toEqual(result.imported);
  });

  it('reports a canceled dialog and imports nothing', async () => {
    pickedFiles = [];

    const result = (await ipc.invoke(IPC_CHANNELS.PICK_AND_IMPORT_DOCUMENTS)) as ImportResult;

    expect(result).toEqual({ imported: [], failed: [], canceled: true });
    expect(s.documentService.listDocuments()).toEqual([]);
  });

  it('imports the valid files and reports each one that fails', async () => {
    const good = writeSourceFile(root, 'good.md', 'Fine');
    const missing = path.join(root, 'missing.md');
    const big = path.join(root, 'big.txt');
    fs.writeFileSync(big, Buffer.alloc(10 * 1024 * 1024 + 1, 'a'));
    pickedFiles = [missing, good, big];

    const result = (await ipc.invoke(IPC_CHANNELS.PICK_AND_IMPORT_DOCUMENTS)) as ImportResult;

    expect(result.canceled).toBe(false);
    expect(result.imported.map(d => d.filename)).toEqual(['good.md']);
    expect(result.failed).toEqual([
      { filePath: missing, error: expect.stringMatching(/File not found/) },
      { filePath: big, error: expect.stringMatching(/File too large/) },
    ]);
    expect(s.documentService.listDocuments()).toHaveLength(1);
  });
});
