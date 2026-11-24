/// <reference types="react" />
/// <reference types="react-dom" />

declare global {
  interface Window {
    knowledgeBase: {
      documents: {
        list: () => Promise<import('../shared/types').Document[]>;
        import: (filePath: string) => Promise<import('../shared/types').Document>;
        pickAndImport: () => Promise<import('../shared/types').ImportResult>;
        get: (id: string) => Promise<import('../shared/types').Document | null>;
        delete: (id: string) => Promise<boolean>;
      };
      indexing: {
        start: (documentId?: string) => Promise<import('../shared/types').AppStatus>;
        status: () => Promise<import('../shared/types').AppStatus>;
        chunks: (documentId: string) => Promise<import('../shared/types').Chunk[]>;
      };
      qa: {
        ask: (question: string) => Promise<import('../shared/types').QAResponse>;
        history: () => Promise<import('../shared/types').QAHistory[]>;
        clearHistory: () => Promise<void>;
      };
      feedback: {
        submit: (qaTimestamp: string, question: string, rating: 'positive' | 'negative', comment?: string) => Promise<import('../shared/types').FeedbackEntry>;
        list: () => Promise<import('../shared/types').FeedbackEntry[]>;
      };
      app: {
        resetData: () => Promise<{ success: boolean }>;
      };
    };
  }
}

export {};
