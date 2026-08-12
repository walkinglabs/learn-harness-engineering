import { BrowserWindow, dialog, IpcMain, OpenDialogOptions } from 'electron';
import { DocumentService } from '../services/document-service';
import { IndexingService } from '../services/indexing-service';
import { QaService } from '../services/qa-service';
import { IPC_CHANNELS } from '../shared/types';

export interface Services {
  documentService: DocumentService;
  indexingService: IndexingService;
  qaService: QaService;
}

export function registerIpcHandlers(ipcMain: IpcMain, services: Services) {
  const { documentService, indexingService, qaService } = services;

  // Document operations
  ipcMain.handle(IPC_CHANNELS.LIST_DOCUMENTS, async () => {
    return documentService.listDocuments();
  });

  ipcMain.handle(IPC_CHANNELS.IMPORT_DOCUMENT, async (_event, filePath: string) => {
    return documentService.importDocument(filePath);
  });

  ipcMain.handle(IPC_CHANNELS.PICK_DOCUMENTS, async event => {
    const owner = BrowserWindow.fromWebContents(event.sender);
    const options: OpenDialogOptions = {
      title: 'Import documents',
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Text documents', extensions: ['txt', 'md'] }],
    };
    const result = owner
      ? await dialog.showOpenDialog(owner, options)
      : await dialog.showOpenDialog(options);
    if (result.canceled) return [];
    return result.filePaths.map(filePath => documentService.importDocument(filePath));
  });

  ipcMain.handle(IPC_CHANNELS.GET_DOCUMENT, async (_event, id: string) => {
    return documentService.getDocument(id);
  });

  ipcMain.handle(IPC_CHANNELS.DELETE_DOCUMENT, async (_event, id: string) => {
    return documentService.deleteDocument(id);
  });

  // Indexing
  ipcMain.handle(IPC_CHANNELS.START_INDEXING, async (_event, documentId?: string) => {
    return indexingService.startIndexing(documentId);
  });

  ipcMain.handle(IPC_CHANNELS.GET_INDEXING_STATUS, async () => {
    return indexingService.getStatus();
  });

  ipcMain.handle(IPC_CHANNELS.GET_CHUNKS, async (_event, documentId: string) => {
    return indexingService.getChunksForDocument(documentId);
  });

  // Q&A
  ipcMain.handle(IPC_CHANNELS.ASK_QUESTION, async (_event, question: string) => {
    return qaService.ask(question);
  });

  ipcMain.handle(IPC_CHANNELS.GET_HISTORY, async () => {
    return qaService.getHistory();
  });
}
