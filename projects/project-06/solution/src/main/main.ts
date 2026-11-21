import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import * as path from 'path';
import { registerIpcHandlers } from './ipc-handlers';
import { DocumentService } from '../services/document-service';
import { QaService } from '../services/qa-service';
import { IndexingService } from '../services/indexing-service';
import { PersistenceService } from '../services/persistence-service';
import { logger } from '../services/logger';

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
      // The preload can only require('electron') in the sandbox, so it is
      // bundled by scripts/build-preload.js.
      sandbox: true,
    },
    title: 'Knowledge Base',
  });

  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  logger.info('main', 'BrowserWindow created', { isDev, dimensions: '1200x800' });
}

/** Native multi-select file dialog limited to the supported formats. */
async function pickDocumentFiles(): Promise<string[]> {
  const options: Electron.OpenDialogOptions = {
    title: 'Import documents',
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Text and Markdown', extensions: ['txt', 'md'] }],
  };
  const result = mainWindow
    ? await dialog.showOpenDialog(mainWindow, options)
    : await dialog.showOpenDialog(options);
  return result.canceled ? [] : result.filePaths;
}

function initializeServices() {
  const dataDir = path.join(app.getPath('userData'), 'knowledge-base-data');
  logger.info('main', 'Initializing services', { dataDir });

  const persistence = new PersistenceService(dataDir);
  const documentService = new DocumentService(persistence);
  const indexingService = new IndexingService(persistence);
  const qaService = new QaService(persistence, indexingService);

  registerIpcHandlers(ipcMain, {
    documentService,
    indexingService,
    qaService,
    persistence,
  }, pickDocumentFiles);

  logger.info('main', 'All services initialized successfully');
}

app.whenReady().then(() => {
  logger.info('main', 'Application ready, initializing...');
  initializeServices();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  logger.info('main', 'All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  logger.info('main', 'Application shutting down');
});
