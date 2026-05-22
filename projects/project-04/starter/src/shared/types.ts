export * from '../types';

export const IPC_CHANNELS = {
  LIST_SESSIONS: 'interview:sessions:list',
  IMPORT_TRANSCRIPT: 'interview:transcript:import',
  GET_TRANSCRIPT: 'interview:transcript:get',
  ANALYZE_SESSION: 'interview:session:analyze',
  GET_REPORT: 'interview:report:get',
  SAVE_FEEDBACK: 'interview:feedback:save',
  GET_STATUS: 'interview:status',
} as const;
