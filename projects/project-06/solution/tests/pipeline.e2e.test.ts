import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { askNow, createServices, makeTempDir, removeDir, SAMPLE_DOCS_DIR, Services } from './helpers';

const SCANNER = path.resolve(__dirname, '../scripts/cleanup-scanner.sh');

// The cleanup scanner shells out to python3; skip the scanner checks where it
// is not installed rather than report a false failure.
const hasPython = spawnSync('python3', ['--version']).status === 0;

/** Run scripts/cleanup-scanner.sh against a data directory and return its report. */
function scan(dataDir: string): string {
  const result = spawnSync('bash', [SCANNER, dataDir], { encoding: 'utf-8' });
  expect(result.status, result.stderr).toBe(0);
  return result.stdout;
}

let root: string;
let dataDir: string;
let s: Services;

beforeEach(() => {
  root = makeTempDir();
  dataDir = path.join(root, 'knowledge-base-data');
  s = createServices(dataDir);
});

afterEach(() => removeDir(root));

function importSamples() {
  return fs
    .readdirSync(SAMPLE_DOCS_DIR)
    .sort()
    .map(name => s.documentService.importDocument(path.join(SAMPLE_DOCS_DIR, name)));
}

describe('full pipeline with the bundled sample documents', () => {
  it('imports, indexes and answers with citations to the right document', async () => {
    const docs = importSamples();
    expect(docs.map(d => d.filename)).toEqual(['design-notes.md', 'meeting-summary.txt', 'retrieval-plan.md']);

    const status = await s.indexingService.startIndexing();
    expect(status).toMatchObject({ status: 'ready', currentIndexed: 3, totalDocuments: 3 });

    const response = await askNow(s.qaService, 'What did the meeting decide about retrieval?');
    expect(response.confidence).toBe(0.85);
    expect(response.citations.length).toBeGreaterThan(0);
    expect(response.citations.length).toBeLessThanOrEqual(2);

    const titles = new Set(docs.map(d => d.title));
    for (const citation of response.citations) {
      expect(titles).toContain(citation.documentTitle);
      const chunk = s.indexingService
        .getChunksForDocument(citation.documentId)
        .find(c => c.index === citation.chunkIndex);
      expect(chunk?.content.startsWith(citation.excerpt)).toBe(true);
    }
  });

  it('survives an app restart with documents, index, history and feedback intact', async () => {
    importSamples();
    await s.indexingService.startIndexing();
    const answer = await askNow(s.qaService, 'How is the index chunked?');
    s.qaService.submitFeedback(answer.timestamp, 'How is the index chunked?', 'positive');

    const restarted = createServices(dataDir);

    expect(restarted.documentService.listDocuments()).toEqual(s.documentService.listDocuments());
    expect(restarted.indexingService.getStatus()).toMatchObject({ status: 'ready', currentIndexed: 3 });
    expect(restarted.qaService.getHistory()).toHaveLength(1);
    expect(restarted.qaService.getFeedback()).toHaveLength(1);
  });

  it('returns to a clean, empty state after reset', async () => {
    importSamples();
    await s.indexingService.startIndexing();
    await askNow(s.qaService, 'design');

    s.persistence.resetAll();
    const fresh = createServices(dataDir);

    expect(fresh.documentService.listDocuments()).toEqual([]);
    expect(fresh.indexingService.getAllChunks()).toEqual([]);
    expect(fresh.qaService.getHistory()).toEqual([]);
    expect(fresh.indexingService.getStatus()).toMatchObject({ status: 'idle', totalDocuments: 0 });
  });

  it('imports 10+ files in under a second (docs/PRODUCT.md target)', () => {
    const sources = Array.from({ length: 12 }, (_, i) => {
      const file = path.join(root, `bulk-${i}.md`);
      fs.writeFileSync(file, `# Doc ${i}\n\n${'text '.repeat(200)}`);
      return file;
    });

    const start = performance.now();
    for (const file of sources) s.documentService.importDocument(file);
    const elapsedMs = performance.now() - start;

    expect(s.documentService.listDocuments()).toHaveLength(12);
    expect(elapsedMs).toBeLessThan(1000);
  });
});

describe.runIf(hasPython)('data directory stays consistent (scripts/cleanup-scanner.sh)', () => {
  it('is clean after single-document and batch indexing plus Q&A', async () => {
    const [first] = importSamples();
    await s.indexingService.startIndexing(first.id);
    await s.indexingService.startIndexing();
    await askNow(s.qaService, 'retrieval plan');

    const report = scan(dataDir);
    expect(report).toContain('Result: CLEAN (0 issues found)');
  });

  it('leaves no orphaned content or dangling chunks after a delete', async () => {
    const [first] = importSamples();
    await s.indexingService.startIndexing();
    s.documentService.deleteDocument(first.id);

    const report = scan(dataDir);
    expect(report).not.toMatch(/ORPHANED:/);
    expect(report).not.toMatch(/DANGLING:/);
    expect(report).not.toMatch(/INCONSISTENT:/);
  });
});
