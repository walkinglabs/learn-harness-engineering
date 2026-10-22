import * as path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { askNow, createServices, makeTempDir, removeDir, Services, writeSourceFile } from './helpers';

let root: string;
let s: Services;

beforeEach(() => {
  root = makeTempDir();
  s = createServices(path.join(root, 'data'));
});

afterEach(() => removeDir(root));

async function importAndIndex(files: Record<string, string>) {
  const docs = Object.entries(files).map(([name, content]) =>
    s.documentService.importDocument(writeSourceFile(root, name, content)),
  );
  await s.indexingService.startIndexing();
  return docs;
}

describe('QaService.ask without an index', () => {
  it('answers with no citations, confidence 0.3 and a prompt to index first', async () => {
    const response = await askNow(s.qaService, 'How does the system work?');

    expect(response.citations).toEqual([]);
    expect(response.confidence).toBe(0.3);
    expect(response.answer).toMatch(/import and index documents/);
  });

  it('still uses a matching mock pattern when nothing is indexed', async () => {
    const response = await askNow(s.qaService, 'Tell me about the architecture');

    expect(response.citations).toEqual([]);
    expect(response.answer).toMatch(/^The system uses a layered architecture/);
  });
});

describe('QaService.ask retrieval', () => {
  it('cites the chunk that contains the question keywords', async () => {
    const [kafka] = await importAndIndex({
      'kafka.md': 'Kafka partitions keep ordering per key.',
      'gardening.md': 'Tomatoes need full sun and regular watering.',
    });

    const response = await askNow(s.qaService, 'How do Kafka partitions handle ordering?');

    expect(response.confidence).toBe(0.85);
    expect(response.citations).toEqual([
      {
        documentId: kafka.id,
        documentTitle: 'kafka',
        chunkIndex: 0,
        excerpt: 'Kafka partitions keep ordering per key.',
      },
    ]);
  });

  it('returns at most two citations, best keyword overlap first', async () => {
    const [three, , two] = await importAndIndex({
      'three.md': 'alpha beta gamma',
      'one.md': 'alpha only',
      'two.md': 'alpha beta',
    });

    const response = await askNow(s.qaService, 'alpha beta gamma');

    expect(response.citations.map(c => c.documentId)).toEqual([three.id, two.id]);
  });

  it('ignores words of two characters or fewer when matching', async () => {
    await importAndIndex({ 'a.md': 'is it on to me' });

    const response = await askNow(s.qaService, 'is it on to me');

    expect(response.citations).toEqual([]);
    expect(response.confidence).toBe(0.3);
  });

  it('matches case-insensitively', async () => {
    const [doc] = await importAndIndex({ 'a.md': 'ELECTRON preload bridge' });

    const response = await askNow(s.qaService, 'electron PRELOAD');

    expect(response.citations.map(c => c.documentId)).toEqual([doc.id]);
  });

  it('truncates citation excerpts to 200 characters', async () => {
    await importAndIndex({ 'long.md': `needle ${'x'.repeat(400)}` });

    const response = await askNow(s.qaService, 'needle');

    expect(response.citations[0].excerpt).toHaveLength(200);
  });

  it('builds the fallback answer from the top citation when no pattern matches', async () => {
    await importAndIndex({ 'zebra.md': 'Zebras have stripes.' });

    const response = await askNow(s.qaService, 'zebras stripes');

    expect(response.answer).toMatch(/^Based on the available documents, the most relevant information comes from "zebra"/);
  });

  it('never cites a document after it is deleted', async () => {
    const [gone, kept] = await importAndIndex({
      'gone.md': 'Raft elects a leader per term.',
      'kept.md': 'Raft replicates the log to followers.',
    });
    s.documentService.deleteDocument(gone.id);

    const response = await askNow(s.qaService, 'raft leader log');

    expect(response.citations.map(c => c.documentId)).toEqual([kept.id]);
  });
});

describe('QaService history and feedback', () => {
  it('appends every question and response to the history, in order', async () => {
    const first = await askNow(s.qaService, 'first question');
    const second = await askNow(s.qaService, 'second question');

    expect(s.qaService.getHistory()).toEqual([
      { question: 'first question', response: first },
      { question: 'second question', response: second },
    ]);
  });

  it('clearHistory() empties the history', async () => {
    await askNow(s.qaService, 'something');
    s.qaService.clearHistory();

    expect(s.qaService.getHistory()).toEqual([]);
  });

  it('stores feedback entries with all fields', () => {
    const entry = s.qaService.submitFeedback('2026-10-16T12:00:00.000Z', 'q?', 'negative', 'wrong doc');

    expect(entry).toMatchObject({
      qaTimestamp: '2026-10-16T12:00:00.000Z',
      question: 'q?',
      rating: 'negative',
      comment: 'wrong doc',
    });
    expect(entry.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(s.qaService.getFeedback()).toEqual([entry]);
  });

  it('defaults the feedback comment to an empty string', () => {
    expect(s.qaService.submitFeedback('t', 'q', 'positive').comment).toBe('');
  });
});
