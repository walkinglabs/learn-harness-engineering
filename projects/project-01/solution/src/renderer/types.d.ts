/// <reference types="react" />
/// <reference types="react-dom" />

declare global {
  interface Window {
    knowledgeBase: {
      documents: {
        list: () => Promise<import('../shared/types').Document[]>;
        import: (filePath: string) => Promise<import('../shared/types').Document>;
        pick: () => Promise<import('../shared/types').Document[]>;
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
      };
    };
  }
}

export {};
