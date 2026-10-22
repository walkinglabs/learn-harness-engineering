import * as fs from 'fs';
import * as path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PersistenceService } from '../src/services/persistence-service';
import { makeTempDir, removeDir, writeSourceFile } from './helpers';

let root: string;
let dataDir: string;
let persistence: PersistenceService;

beforeEach(() => {
  root = makeTempDir();
  dataDir = path.join(root, 'knowledge-base-data');
  persistence = new PersistenceService(dataDir);
});

afterEach(() => removeDir(root));

describe('PersistenceService', () => {
  it('creates the data, documents and index directories on construction', () => {
    expect(fs.existsSync(dataDir)).toBe(true);
    expect(fs.existsSync(persistence.getDocumentsDir())).toBe(true);
    expect(fs.existsSync(persistence.getIndexDir())).toBe(true);
  });

  it('round-trips JSON, creating nested directories as needed', () => {
    const value = { a: 1, list: ['x', 'y'], nested: { ok: true } };
    persistence.writeJson('deep/nested/file.json', value);

    expect(persistence.readJson('deep/nested/file.json')).toEqual(value);
  });

  it('returns null for a JSON file that does not exist', () => {
    expect(persistence.readJson('missing.json')).toBeNull();
  });

  it('returns null instead of throwing for a corrupt JSON file', () => {
    fs.writeFileSync(path.join(dataDir, 'broken.json'), '{ not json');

    expect(persistence.readJson('broken.json')).toBeNull();
  });

  it('round-trips text and returns null for a missing text file', () => {
    persistence.writeText('content/doc.txt', 'hola mundo');

    expect(persistence.readText('content/doc.txt')).toBe('hola mundo');
    expect(persistence.readText('content/missing.txt')).toBeNull();
  });

  it('copies files into documents/ and deletes them again', () => {
    const source = writeSourceFile(root, 'notes.md', '# Notes');
    const dest = persistence.copyFileToDocuments(source, 'notes.md');

    expect(fs.readFileSync(dest, 'utf-8')).toBe('# Notes');
    expect(persistence.listFiles('documents')).toEqual(['notes.md']);

    persistence.deleteFromDocuments('notes.md');
    expect(persistence.listFiles('documents')).toEqual([]);
  });

  it('ignores deletion of a document file that does not exist', () => {
    expect(() => persistence.deleteFromDocuments('ghost.md')).not.toThrow();
  });

  it('lists nothing for a directory that does not exist', () => {
    expect(persistence.listFiles('nope')).toEqual([]);
  });

  it('resetAll() wipes every file and recreates the empty layout', () => {
    persistence.writeJson('documents-meta.json', [{ id: '1' }]);
    persistence.writeText('content/1.txt', 'text');

    persistence.resetAll();

    expect(persistence.exists('documents-meta.json')).toBe(false);
    expect(persistence.exists('content/1.txt')).toBe(false);
    expect(fs.existsSync(persistence.getDocumentsDir())).toBe(true);
    expect(fs.existsSync(persistence.getIndexDir())).toBe(true);
  });
});
