import { contextBridge, ipcRenderer } from 'electron';
import {
  AnalysisFeedbackInput,
  ImportTranscriptInput,
  IPC_CHANNELS,
} from '../shared/types';

const api = {
  listSessions: () => ipcRenderer.invoke(IPC_CHANNELS.LIST_SESSIONS),
  importTranscript: (input: ImportTranscriptInput) =>
    ipcRenderer.invoke(IPC_CHANNELS.IMPORT_TRANSCRIPT, input),
  getTranscript: (sessionId: string) => ipcRenderer.invoke(IPC_CHANNELS.GET_TRANSCRIPT, sessionId),
  analyzeSession: (sessionId: string) => ipcRenderer.invoke(IPC_CHANNELS.ANALYZE_SESSION, sessionId),
  getReport: (sessionId: string) => ipcRenderer.invoke(IPC_CHANNELS.GET_REPORT, sessionId),
  saveFeedback: (input: AnalysisFeedbackInput) =>
    ipcRenderer.invoke(IPC_CHANNELS.SAVE_FEEDBACK, input),
  getStatus: () => ipcRenderer.invoke(IPC_CHANNELS.GET_STATUS),
};

contextBridge.exposeInMainWorld('interviewCoach', api);
