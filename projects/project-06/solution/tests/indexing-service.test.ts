import * as path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createServices, makeTempDir, paragraphs, removeDir, Services, writeSourceFile } from './helpers';

let root: string;
let s: Services;

beforeEach(() => {
  root = makeTempDir();
  s = createServices(path.join(root, 'data'));
});

afterEach(() => removeDir(root));

function importText(filename: string, content: string) {
  return s.documentService.importDocument(writeSourceFile(root, filename, content));
}

describe('chunking', () => {
  it('keeps a short document as a single chunk with char and word counts', async () => {
    const doc = importText('short.md', 'One paragraph.\n\nAnother one here.');
    await s.indexingService.startIndexing();

    const chunks = s.indexingService.getChunksForDocument(doc.id);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toMatchObject({
      documentId: doc.id,
      index: 0,
      content: 'One paragraph.\n\nAnother one here.',
      metadata: { charCount: '33', wordCount: '5' },
    });
  });

  it('packs whole paragraphs into chunks of at most ~500 characters', async () => {
    // Ten paragraphs of 200 characters: two fit in a chunk, a third would not.
    const content = paragraphs(10, 200);
    const doc = importText('long.md', content);
    await s.indexingService.startIndexing();

    const chunks = s.indexingService.getChunksForDocument(doc.id);
    expect(chunks).toHaveLength(5);
    expect(chunks.map(c => c.index)).toEqual([0, 1, 2, 3, 4]);
    for (const chunk of chunks) {
      expect(chunk.content.length).toBeLessThanOrEqual(500);
      expect(chunk.metadata.charCount).toBe(String(chunk.content.length));
    }
  });

  it('never splits a paragraph and loses no text', async () => {
    const content = paragraphs(7, 180, 'word');
    const doc = importText('intact.md', content);
    await s.indexingService.startIndexing();

    const rebuilt = s.indexingService.getChunksForDocument(doc.id).map(c => c.content).join('\n\n');
    expect(rebuilt).toBe(content);
  });

  it('treats blank lines with whitespace as paragraph breaks and drops empty paragraphs', async () => {
    const doc = importText('spaces.txt', 'First\n   \n\n\nSecond\n\t\nThird');
    await s.indexingService.startIndexing();

    expect(s.indexingService.getChunksForDocument(doc.id)[0].content).toBe('First\n\nSecond\n\nThird');
  });

  it('produces no chunks for a whitespace-only document', async () => {
    const doc = importText('blank.txt', '  \n\n  ');
    await s.indexingService.startIndexing();

    expect(s.indexingService.getChunksForDocument(doc.id)).toEqual([]);
  });
});

describe('batch indexing', () => {
  it('indexes every document, marks it indexed and reports ready', async () => {
    const a = importText('a.md', 'Alpha text');
    const b = importText('b.md', 'Beta text');

    const status = await s.indexingService.startIndexing();

    expect(status).toMatchObject({ status: 'ready', currentIndexed: 2, totalDocuments: 2 });
    for (const doc of s.documentService.listDocuments()) {
      expect(doc).toMatchObject({ status: 'indexed', chunks: 1 });
    }
    expect(s.indexingService.getAllChunks().map(c => c.documentId).sort()).toEqual([a.id, b.id].sort());
  });

  it('does not re-index documents that are already indexed', async () => {
    const a = importText('a.md', 'Alpha text');
    await s.indexingService.startIndexing();
    const firstIds = s.indexingService.getChunksForDocument(a.id).map(c => c.id);

    importText('b.md', 'Beta text');
    await s.indexingService.startIndexing();

    expect(s.indexingService.getChunksForDocument(a.id).map(c => c.id)).toEqual(firstIds);
    expect(s.indexingService.getStatus()).toMatchObject({ currentIndexed: 2, totalDocuments: 2 });
  });
});

describe('single-document indexing', () => {
  it('counts the document as indexed in status and retrieval', async () => {
    const a = importText('a.md', 'Alpha text');
    importText('b.md', 'Beta text');

    const status = await s.indexingService.startIndexing(a.id);

    expect(status).toMatchObject({ status: 'indexing', currentIndexed: 1, totalDocuments: 2 });
    expect(s.documentService.getDocument(a.id)).toMatchObject({ status: 'indexed', chunks: 1 });
    expect(s.indexingService.getAllChunks().map(c => c.documentId)).toEqual([a.id]);
  });

  it('is not re-chunked by a later batch run', async () => {
    const a = importText('a.md', 'Alpha text');
    importText('b.md', 'Beta text');
    await s.indexingService.startIndexing(a.id);
    const ids = s.indexingService.getChunksForDocument(a.id).map(c => c.id);

    await s.indexingService.startIndexing();

    expect(s.indexingService.getChunksForDocument(a.id).map(c => c.id)).toEqual(ids);
    expect(s.indexingService.getAllChunks()).toHaveLength(2);
  });

  it('reports an error for an unknown document id', async () => {
    const status = await s.indexingService.startIndexing('nope');
    expect(status.status).toBe('error');
  });
});

describe('status', () => {
  it('is idle with no documents', () => {
    expect(s.indexingService.getStatus()).toMatchObject({ status: 'idle', currentIndexed: 0, totalDocuments: 0 });
  });

  it('is idle when documents are imported but none indexed', () => {
    importText('a.md', 'Alpha');
    expect(s.indexingService.getStatus()).toMatchObject({ status: 'idle', currentIndexed: 0, totalDocuments: 1 });
  });

  it('drops a deleted document from the index and its counts', async () => {
    const a = importText('a.md', 'Alpha text');
    const b = importText('b.md', 'Beta text');
    await s.indexingService.startIndexing();

    s.documentService.deleteDocument(a.id);

    expect(s.indexingService.getStatus()).toMatchObject({ status: 'ready', currentIndexed: 1, totalDocuments: 1 });
    expect(s.indexingService.getAllChunks().map(c => c.documentId)).toEqual([b.id]);
    expect(s.persistence.exists(`chunks/${a.id}.json`)).toBe(false);
  });
});

describe('performance targets (docs/PRODUCT.md)', () => {
  it('indexes at 100+ chunks per second', async () => {
    for (let i = 0; i < 20; i++) importText(`doc-${i}.md`, paragraphs(20, 200));

    const start = performance.now();
    await s.indexingService.startIndexing();
    const seconds = (performance.now() - start) / 1000;

    const chunkCount = s.indexingService.getAllChunks().length;
    expect(chunkCount).toBe(200);
    expect(chunkCount / seconds).toBeGreaterThan(100);
  });
});
