import { IpcMain } from 'electron';
import { InterviewSessionStore } from '../services/interview-session-store';
import { IPC_CHANNELS } from '../shared/types';

export interface Services {
  interviewStore: InterviewSessionStore;
}

export function registerIpcHandlers(ipcMain: IpcMain, services: Services) {
  const { interviewStore } = services;

  ipcMain.handle(IPC_CHANNELS.LIST_SESSIONS, async () => interviewStore.listSessions());

  ipcMain.handle(IPC_CHANNELS.IMPORT_TRANSCRIPT, async (_event, input) =>
    interviewStore.importTranscript(input)
  );

  ipcMain.handle(IPC_CHANNELS.GET_TRANSCRIPT, async (_event, sessionId: string) =>
    interviewStore.getTranscript(sessionId)
  );

  ipcMain.handle(IPC_CHANNELS.ANALYZE_SESSION, async (_event, sessionId: string) =>
    interviewStore.analyzeSession(sessionId)
  );

  ipcMain.handle(IPC_CHANNELS.GET_REPORT, async (_event, sessionId: string) =>
    interviewStore.getReport(sessionId)
  );

  ipcMain.handle(IPC_CHANNELS.SAVE_FEEDBACK, async (_event, input) => {
    interviewStore.saveFeedback(input);
  });

  ipcMain.handle(IPC_CHANNELS.GET_STATUS, async () => interviewStore.getStatus());
}
