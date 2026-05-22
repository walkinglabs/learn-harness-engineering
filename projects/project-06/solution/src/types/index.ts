export * from './analysis';
export * from './interview';
export * from './transcript';

export interface AppStatus {
  sessionsLoaded: number;
  analyzedSessions: number;
  lastActivity: string;
  warnings: number;
}
