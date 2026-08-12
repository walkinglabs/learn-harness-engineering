import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { registerIpcHandlers } from './ipc-handlers';
import { DocumentService } from '../services/document-service';
import { QaService } from '../services/qa-service';
import { IndexingService } from '../services/indexing-service';
import { PersistenceService } from '../services/persistence-service';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'Knowledge Base',
  });

  // In development, load from Vite dev server or built renderer
  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function initializeServices() {
  const dataDir = path.join(app.getPath('userData'), 'knowledge-base-data');
  const persistence = new PersistenceService(dataDir);
  const documentService = new DocumentService(persistence);
  const indexingService = new IndexingService(persistence);
  const qaService = new QaService(persistence, indexingService);

  registerIpcHandlers(ipcMain, {
    documentService,
    indexingService,
    qaService,
  });
}

app.whenReady().then(() => {
  initializeServices();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
