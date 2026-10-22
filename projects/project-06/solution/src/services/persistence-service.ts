import * as fs from 'fs';
import * as path from 'path';
import { logger } from './logger';

const SERVICE = 'persistence';

export class PersistenceService {
  private dataDir: string;
  private documentsDir: string;
  private indexDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    this.documentsDir = path.join(dataDir, 'documents');
    this.indexDir = path.join(dataDir, 'index');
    this.ensureDirectories();
    logger.info(SERVICE, 'PersistenceService initialized', { dataDir });
  }

  private ensureDirectories(): void {
    const dirs = [this.dataDir, this.documentsDir, this.indexDir];
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        logger.debug(SERVICE, 'Created directory', { dir });
      }
    }
  }

  /** Read a JSON file, returning null if it doesn't exist. */
  readJson<T>(relativePath: string): T | null {
    const fullPath = path.join(this.dataDir, relativePath);
    if (!fs.existsSync(fullPath)) {
      logger.debug(SERVICE, 'File not found (returning null)', { path: relativePath });
      return null;
    }
    try {
      const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      logger.debug(SERVICE, 'Read JSON file', { path: relativePath });
      return data;
    } catch (err) {
      logger.error(SERVICE, 'Failed to parse JSON file', { path: relativePath, error: String(err) });
      return null;
    }
  }

  /** Write a JSON file atomically. */
  writeJson<T>(relativePath: string, data: T): void {
    const fullPath = path.join(this.dataDir, relativePath);
    const dir = path.dirname(fullPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf-8');
    logger.debug(SERVICE, 'Wrote JSON file', { path: relativePath, sizeBytes: Buffer.byteLength(JSON.stringify(data)) });
  }

  /** Read a text file. */
  readText(relativePath: string): string | null {
    const fullPath = path.join(this.dataDir, relativePath);
    if (!fs.existsSync(fullPath)) {
      logger.debug(SERVICE, 'Text file not found', { path: relativePath });
      return null;
    }
    const content = fs.readFileSync(fullPath, 'utf-8');
    logger.debug(SERVICE, 'Read text file', { path: relativePath, length: content.length });
    return content;
  }

  /** Write a text file. */
  writeText(relativePath: string, content: string): void {
    const fullPath = path.join(this.dataDir, relativePath);
    const dir = path.dirname(fullPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf-8');
    logger.debug(SERVICE, 'Wrote text file', { path: relativePath, length: content.length });
  }

  /** Copy a file into the documents directory. */
  copyFileToDocuments(sourcePath: string, filename: string): string {
    const destPath = path.join(this.documentsDir, filename);
    fs.mkdirSync(this.documentsDir, { recursive: true });
    fs.copyFileSync(sourcePath, destPath);
    logger.info(SERVICE, 'Copied file to documents', { source: sourcePath, filename });
    return destPath;
  }

  /** Delete a file from the documents directory. */
  deleteFromDocuments(filename: string): void {
    const filePath = path.join(this.documentsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info(SERVICE, 'Deleted document file', { filename });
    }
  }

  /** Delete a file relative to the data directory. Returns false if it did not exist. */
  deleteFile(relativePath: string): boolean {
    const fullPath = path.join(this.dataDir, relativePath);
    if (!fs.existsSync(fullPath)) return false;
    fs.unlinkSync(fullPath);
    logger.debug(SERVICE, 'Deleted file', { path: relativePath });
    return true;
  }

  /** List all files in a directory. */
  listFiles(relativePath: string): string[] {
    const fullPath = path.join(this.dataDir, relativePath);
    if (!fs.existsSync(fullPath)) return [];
    return fs.readdirSync(fullPath);
  }

  /** Check if a file exists. */
  exists(relativePath: string): boolean {
    return fs.existsSync(path.join(this.dataDir, relativePath));
  }

  /** Get the data directory path. */
  getDataDir(): string {
    return this.dataDir;
  }

  /** Get the documents directory path. */
  getDocumentsDir(): string {
    return this.documentsDir;
  }

  /** Get the index directory path. */
  getIndexDir(): string {
    return this.indexDir;
  }

  /** Delete all stored data and recreate directories. */
  resetAll(): void {
    logger.warn(SERVICE, 'Resetting all data', { dataDir: this.dataDir });
    fs.rmSync(this.dataDir, { recursive: true, force: true });
    this.ensureDirectories();
    logger.info(SERVICE, 'Data reset complete');
  }
}
