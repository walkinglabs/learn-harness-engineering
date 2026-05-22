export type LogLevel = 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  event: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

export class Logger {
  private entries: LogEntry[] = [];

  log(level: LogLevel, event: string, data?: Record<string, unknown>): LogEntry {
    const entry = { level, event, timestamp: new Date().toISOString(), data };
    this.entries.push(entry);
    return entry;
  }

  list(): LogEntry[] {
    return [...this.entries];
  }
}
