/** Cross-boundary type definitions shared between main, preload, and renderer. */

export interface Document {
  id: string;
  title: string;
  filename: string;
  importedAt: string;
  size: number;
  status: 'imported' | 'indexing' | 'indexed' | 'error';
  chunks?: number;
}

export interface Chunk {
  id: string;
  documentId: string;
  content: string;
  index: number;
  metadata: Record<string, string>;
}

export interface Citation {
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  excerpt: string;
}

export interface QAResponse {
  answer: string;
  citations: Citation[];
  confidence: number;
  timestamp: string;
}

export interface QAHistory {
  question: string;
  response: QAResponse;
}

export interface FeedbackEntry {
  id: string;
  qaTimestamp: string;
  question: string;
  rating: 'positive' | 'negative';
  comment: string;
  submittedAt: string;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Citation[];
  confidence?: number;
  followUpSuggestions?: string[];
}

export interface AppStatus {
  documentsLoaded: number;
  currentIndexed?: number;
  indexStatus: 'idle' | 'indexing' | 'ready' | 'error';
  lastActivity: string;
}

/** Result of picking files in the native dialog and importing each one. */
export interface ImportResult {
  imported: Document[];
  failed: Array<{ filePath: string; error: string }>;
  canceled: boolean;
}

/** IPC channel names -- single source of truth. */
export const IPC_CHANNELS = {
  // Document operations
  LIST_DOCUMENTS: 'documents:list',
  IMPORT_DOCUMENT: 'documents:import',
  PICK_AND_IMPORT_DOCUMENTS: 'documents:pick-and-import',
  GET_DOCUMENT: 'documents:get',
  DELETE_DOCUMENT: 'documents:delete',

  // Indexing
  START_INDEXING: 'indexing:start',
  GET_INDEXING_STATUS: 'indexing:status',
  GET_CHUNKS: 'indexing:chunks',

  // Q&A
  ASK_QUESTION: 'qa:ask',
  GET_HISTORY: 'qa:history',
  CLEAR_HISTORY: 'qa:clear-history',

  // Feedback
  SUBMIT_FEEDBACK: 'feedback:submit',
  GET_FEEDBACK: 'feedback:list',

  // Clean state
  RESET_DATA: 'app:reset',

  // App status
  GET_STATUS: 'app:status',
} as const;
