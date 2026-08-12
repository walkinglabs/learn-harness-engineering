import * as fs from 'fs';
import * as path from 'path';

export class PersistenceService {
  private dataDir: string;
  private documentsDir: string;
  private indexDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    this.documentsDir = path.join(dataDir, 'documents');
    this.indexDir = path.join(dataDir, 'index');
    this.ensureDirectories();
  }

  private ensureDirectories() {
    fs.mkdirSync(this.dataDir, { recursive: true });
    fs.mkdirSync(this.documentsDir, { recursive: true });
    fs.mkdirSync(this.indexDir, { recursive: true });
  }

  /** Read a JSON file, returning null if it doesn't exist. */
  readJson<T>(relativePath: string): T | null {
    const fullPath = path.join(this.dataDir, relativePath);
    if (!fs.existsSync(fullPath)) return null;
    return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  }

  /** Write a JSON file atomically. */
  writeJson<T>(relativePath: string, data: T): void {
    const fullPath = path.join(this.dataDir, relativePath);
    const dir = path.dirname(fullPath);
    fs.mkdirSync(dir, { recursive: true });
    const tempPath = `${fullPath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, fullPath);
  }

  /** Read a text file. */
  readText(relativePath: string): string | null {
    const fullPath = path.join(this.dataDir, relativePath);
    if (!fs.existsSync(fullPath)) return null;
    return fs.readFileSync(fullPath, 'utf-8');
  }

  /** Write a text file. */
  writeText(relativePath: string, content: string): void {
    const fullPath = path.join(this.dataDir, relativePath);
    const dir = path.dirname(fullPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf-8');
  }

  /** Copy a file into the documents directory. */
  copyFileToDocuments(sourcePath: string, filename: string): string {
    const destPath = path.join(this.documentsDir, filename);
    fs.mkdirSync(this.documentsDir, { recursive: true });
    fs.copyFileSync(sourcePath, destPath);
    return destPath;
  }

  /** Delete a file from the documents directory. */
  deleteFromDocuments(filename: string): void {
    const filePath = path.join(this.documentsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  /** Delete a data file if it exists. */
  delete(relativePath: string): void {
    const fullPath = path.join(this.dataDir, relativePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
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
}
