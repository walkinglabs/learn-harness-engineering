import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/types';

const api = {
  documents: {
    list: () => ipcRenderer.invoke(IPC_CHANNELS.LIST_DOCUMENTS),
    import: (filePath: string) => ipcRenderer.invoke(IPC_CHANNELS.IMPORT_DOCUMENT, filePath),
    pick: () => ipcRenderer.invoke(IPC_CHANNELS.PICK_DOCUMENTS),
    get: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.GET_DOCUMENT, id),
    delete: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.DELETE_DOCUMENT, id),
  },
  indexing: {
    start: (documentId?: string) => ipcRenderer.invoke(IPC_CHANNELS.START_INDEXING, documentId),
    status: () => ipcRenderer.invoke(IPC_CHANNELS.GET_INDEXING_STATUS),
    chunks: (documentId: string) => ipcRenderer.invoke(IPC_CHANNELS.GET_CHUNKS, documentId),
  },
  qa: {
    ask: (question: string) => ipcRenderer.invoke(IPC_CHANNELS.ASK_QUESTION, question),
    history: () => ipcRenderer.invoke(IPC_CHANNELS.GET_HISTORY),
  },
};

contextBridge.exposeInMainWorld('knowledgeBase', api);
