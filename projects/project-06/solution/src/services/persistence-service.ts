import * as fs from 'fs';
import * as path from 'path';

export class PersistenceService {
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    this.ensureDirectories();
  }

  private ensureDirectories() {
    fs.mkdirSync(this.dataDir, { recursive: true });
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
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf-8');
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

}
