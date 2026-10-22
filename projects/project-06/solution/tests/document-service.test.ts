import * as fs from 'fs';
import * as path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createServices, makeTempDir, removeDir, Services, writeSourceFile } from './helpers';

let root: string;
let s: Services;

beforeEach(() => {
  root = makeTempDir();
  s = createServices(path.join(root, 'data'));
});

afterEach(() => removeDir(root));

describe('DocumentService.importDocument', () => {
  it('stores metadata, the original copy and the text content', () => {
    const source = writeSourceFile(root, 'design-notes.md', '# Design\n\nLayered architecture.');
    const doc = s.documentService.importDocument(source);

    expect(doc).toMatchObject({
      title: 'design-notes',
      filename: 'design-notes.md',
      size: fs.statSync(source).size,
      status: 'imported',
    });
    expect(doc.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(new Date(doc.importedAt).toISOString()).toBe(doc.importedAt);

    expect(s.documentService.listDocuments()).toEqual([doc]);
    expect(s.documentService.getDocumentContent(doc.id)).toBe('# Design\n\nLayered architecture.');
    expect(fs.existsSync(path.join(s.persistence.getDocumentsDir(), 'design-notes.md'))).toBe(true);
  });

  it('gives every import its own id', () => {
    const a = s.documentService.importDocument(writeSourceFile(root, 'a.txt', 'A'));
    const b = s.documentService.importDocument(writeSourceFile(root, 'b.txt', 'B'));

    expect(a.id).not.toBe(b.id);
    expect(s.documentService.listDocuments().map(d => d.id)).toEqual([a.id, b.id]);
  });

  it('only strips the last extension from the title', () => {
    const doc = s.documentService.importDocument(writeSourceFile(root, 'v1.2.notes.md', 'x'));
    expect(doc.title).toBe('v1.2.notes');
  });

  it('rejects a path that does not exist and stores nothing', () => {
    expect(() => s.documentService.importDocument(path.join(root, 'ghost.md'))).toThrow(/File not found/);
    expect(s.documentService.listDocuments()).toEqual([]);
    expect(s.documentService.hasPersistedData()).toBe(false);
  });

  it('accepts a file of exactly 10 MB', () => {
    const source = path.join(root, 'limit.txt');
    fs.writeFileSync(source, Buffer.alloc(10 * 1024 * 1024, 'a'));

    expect(() => s.documentService.importDocument(source)).not.toThrow();
  });

  it('rejects a file over 10 MB and stores nothing', () => {
    const source = path.join(root, 'big.txt');
    fs.writeFileSync(source, Buffer.alloc(10 * 1024 * 1024 + 1, 'a'));

    expect(() => s.documentService.importDocument(source)).toThrow(/File too large: big\.txt.*Maximum size is 10 MB/);
    expect(s.documentService.listDocuments()).toEqual([]);
    expect(s.persistence.listFiles('documents')).toEqual([]);
  });

  // Open issue: the original copy is stored under its filename, so two
  // documents named the same share one file and deleting either removes the
  // other's copy. Fixing it changes the on-disk layout, so it is left out of
  // this change.
  it.todo('keeps a separate original copy for two documents with the same filename');
});

describe('DocumentService lookups and updates', () => {
  it('getDocument() returns null for an unknown id', () => {
    expect(s.documentService.getDocument('nope')).toBeNull();
  });

  it('updateDocument() merges fields and persists them', () => {
    const doc = s.documentService.importDocument(writeSourceFile(root, 'a.md', 'A'));
    const updated = s.documentService.updateDocument(doc.id, { status: 'indexed', chunks: 3 });

    expect(updated).toEqual({ ...doc, status: 'indexed', chunks: 3 });
    expect(s.documentService.getDocument(doc.id)).toEqual(updated);
  });

  it('updateDocument() returns null for an unknown id', () => {
    expect(s.documentService.updateDocument('nope', { status: 'error' })).toBeNull();
  });
});

describe('DocumentService.deleteDocument', () => {
  it('removes the metadata, the original copy and the content file', () => {
    const doc = s.documentService.importDocument(writeSourceFile(root, 'a.md', 'Alpha'));
    const other = s.documentService.importDocument(writeSourceFile(root, 'b.md', 'Beta'));

    expect(s.documentService.deleteDocument(doc.id)).toBe(true);

    expect(s.documentService.listDocuments()).toEqual([other]);
    expect(s.persistence.listFiles('documents')).toEqual(['b.md']);
    expect(s.persistence.exists(`content/${doc.id}.txt`)).toBe(false);
    expect(s.documentService.getDocumentContent(other.id)).toBe('Beta');
  });

  it('returns false for an unknown id and changes nothing', () => {
    const doc = s.documentService.importDocument(writeSourceFile(root, 'a.md', 'Alpha'));

    expect(s.documentService.deleteDocument('nope')).toBe(false);
    expect(s.documentService.listDocuments()).toEqual([doc]);
  });
});
