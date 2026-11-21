import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { vi } from 'vitest';
import { PersistenceService } from '../src/services/persistence-service';
import { DocumentService } from '../src/services/document-service';
import { IndexingService } from '../src/services/indexing-service';
import { QaService } from '../src/services/qa-service';
import type { QAResponse } from '../src/shared/types';

export const SAMPLE_DOCS_DIR = path.resolve(__dirname, '../data/sample-documents');

export interface Services {
  dataDir: string;
  persistence: PersistenceService;
  documentService: DocumentService;
  indexingService: IndexingService;
  qaService: QaService;
}

/** A fresh, empty directory under the OS temp dir. */
export function makeTempDir(prefix = 'kb-test-'): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

export function removeDir(dir: string): void {
  fs.rmSync(dir, { recursive: true, force: true });
}

/**
 * Wire the services exactly as src/main/main.ts does, against a data
 * directory. Calling it twice on the same directory simulates an app restart.
 */
export function createServices(dataDir: string): Services {
  const persistence = new PersistenceService(dataDir);
  const documentService = new DocumentService(persistence);
  const indexingService = new IndexingService(persistence);
  const qaService = new QaService(persistence, indexingService);
  return { dataDir, persistence, documentService, indexingService, qaService };
}

/** Write a source file that a user would pick in the import dialog. */
export function writeSourceFile(dir: string, filename: string, content: string): string {
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, content, 'utf-8');
  return filePath;
}

/** `count` paragraphs of `size` characters each, separated by blank lines. */
export function paragraphs(count: number, size: number, word = 'lorem'): string {
  const para = (i: number) => `${word}${i} `.repeat(Math.ceil(size / (word.length + 2))).slice(0, size).trim();
  return Array.from({ length: count }, (_, i) => para(i)).join('\n\n');
}

/**
 * QaService.ask() waits a random 100–500 ms to simulate latency. Fake only
 * setTimeout so the suite runs fast and deterministically, while Date keeps
 * real time for timestamps.
 */
export async function askNow(qa: QaService, question: string): Promise<QAResponse> {
  vi.useFakeTimers({ toFake: ['setTimeout'] });
  try {
    const pending = qa.ask(question);
    await vi.runAllTimersAsync();
    return await pending;
  } finally {
    vi.useRealTimers();
  }
}

/** Parse every JSON log line a console spy received. */
export function loggedEntries(spy: { mock: { calls: unknown[][] } }): Array<Record<string, unknown>> {
  return spy.mock.calls.map(([line]) => JSON.parse(String(line)) as Record<string, unknown>);
}
