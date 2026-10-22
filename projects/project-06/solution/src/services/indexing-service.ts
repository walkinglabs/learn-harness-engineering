import { v4 as uuidv4 } from 'uuid';
import { Chunk, Document } from '../shared/types';
import { PersistenceService } from './persistence-service';
import { logger } from './logger';

const SERVICE = 'indexing-service';
export const INDEX_META = 'index-meta.json';
export const CHUNKS_DIR = 'chunks';

interface IndexStatus {
  status: 'idle' | 'indexing' | 'ready' | 'error';
  currentIndexed: number;
  totalDocuments: number;
  lastIndexed: string | null;
}

export class IndexingService {
  private persistence: PersistenceService;
  private log = logger.forService(SERVICE);

  constructor(persistence: PersistenceService) {
    this.persistence = persistence;
    this.log.info('IndexingService initialized');
  }

  /** Start indexing documents. If documentId is provided, index only that document. */
  async startIndexing(documentId?: string): Promise<IndexStatus> {
    const startTime = Date.now();
    this.log.info('Indexing started', { documentId: documentId ?? 'all' });

    const status = this.getStatus();

    if (documentId) {
      const content = this.persistence.readText(`content/${documentId}.txt`);
      if (!content) {
        this.log.error('Content not found for single document indexing', { documentId });
        return { ...status, status: 'error' };
      }
      const chunks = this.chunkDocument(documentId, content);
      this.persistence.writeJson(`${CHUNKS_DIR}/${documentId}.json`, chunks);

      // Register the document in the index so status, retrieval and later
      // batch runs all see it as indexed.
      const chunksMeta = this.persistence.readJson<Record<string, string[]>>(INDEX_META) ?? {};
      chunksMeta[documentId] = chunks.map(c => c.id);
      this.persistence.writeJson(INDEX_META, chunksMeta);

      // Update document status to indexed
      const docsMeta = this.persistence.readJson<Document[]>('documents-meta.json') ?? [];
      const docIdx = docsMeta.findIndex(d => d.id === documentId);
      if (docIdx >= 0) {
        docsMeta[docIdx].status = 'indexed';
        docsMeta[docIdx].chunks = chunks.length;
        this.persistence.writeJson('documents-meta.json', docsMeta);
      }

      const duration = Date.now() - startTime;
      this.log.info('Single document indexed', {
        documentId,
        chunkCount: chunks.length,
        contentLength: content.length,
        durationMs: duration,
      });
      return this.getStatus();
    }

    // Index all documents that haven't been indexed yet
    const docsMeta = this.persistence.readJson<Document[]>('documents-meta.json') ?? [];
    const chunksMeta = this.persistence.readJson<Record<string, string[]>>(INDEX_META) ?? {};

    let indexedCount = 0;
    let totalChunks = 0;

    for (const doc of docsMeta) {
      if (chunksMeta[doc.id]) continue;

      const content = this.persistence.readText(`content/${doc.id}.txt`);
      if (!content) {
        this.log.warn('Skipping document -- content not found', { documentId: doc.id });
        continue;
      }

      const chunks = this.chunkDocument(doc.id, content);
      this.persistence.writeJson(`${CHUNKS_DIR}/${doc.id}.json`, chunks);
      chunksMeta[doc.id] = chunks.map(c => c.id);
      totalChunks += chunks.length;
      indexedCount++;

      // Update document status
      doc.status = 'indexed';
      doc.chunks = chunks.length;

      this.log.info('Document indexed in batch', {
        documentId: doc.id,
        filename: doc.filename,
        chunkCount: chunks.length,
        progress: `${indexedCount}/${docsMeta.length}`,
      });
    }

    // Save updated metadata
    this.persistence.writeJson(INDEX_META, chunksMeta);
    this.persistence.writeJson('documents-meta.json', docsMeta);

    const duration = Date.now() - startTime;
    this.log.info('Batch indexing complete', {
      totalDocs: docsMeta.length,
      newlyIndexed: indexedCount,
      totalChunks,
      durationMs: duration,
      throughput: totalChunks > 0 ? `${(totalChunks / (duration / 1000)).toFixed(1)} chunks/sec` : 'N/A',
    });
    return this.getStatus();
  }

  /** Get current indexing status. */
  getStatus(): IndexStatus {
    const docs = this.persistence.readJson<Document[]>('documents-meta.json') ?? [];
    const chunksMeta = this.persistence.readJson<Record<string, string[]>>(INDEX_META) ?? {};

    const currentIndexed = Object.keys(chunksMeta).length;
    const totalDocuments = docs.length;
    const isReady = currentIndexed === totalDocuments && totalDocuments > 0;

    return {
      status: isReady ? 'ready' : currentIndexed > 0 ? 'indexing' : 'idle',
      currentIndexed,
      totalDocuments,
      lastIndexed: new Date().toISOString(),
    };
  }

  /** Get all chunks for a document. */
  getChunksForDocument(documentId: string): Chunk[] {
    const chunks = this.persistence.readJson<Chunk[]>(`${CHUNKS_DIR}/${documentId}.json`) ?? [];
    this.log.debug('Retrieved chunks for document', { documentId, chunkCount: chunks.length });
    return chunks;
  }

  /** Get all chunks across all documents. */
  getAllChunks(): Chunk[] {
    const chunksMeta = this.persistence.readJson<Record<string, string[]>>(INDEX_META) ?? {};
    const allChunks: Chunk[] = [];

    for (const docId of Object.keys(chunksMeta)) {
      const chunks = this.getChunksForDocument(docId);
      allChunks.push(...chunks);
    }

    this.log.debug('Retrieved all chunks', { totalChunks: allChunks.length });
    return allChunks;
  }

  /** Split a document into chunks of ~500 characters at paragraph boundaries. */
  private chunkDocument(documentId: string, content: string): Chunk[] {
    const CHUNK_SIZE = 500;
    const chunks: Chunk[] = [];

    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    this.log.debug('Chunking document', { documentId, paragraphCount: paragraphs.length });

    let buffer = '';
    let chunkIndex = 0;

    for (const para of paragraphs) {
      if (buffer.length + para.length > CHUNK_SIZE && buffer.length > 0) {
        chunks.push(this.createChunk(documentId, chunkIndex++, buffer.trim()));
        buffer = para;
      } else {
        buffer += (buffer ? '\n\n' : '') + para;
      }
    }

    if (buffer.trim()) {
      chunks.push(this.createChunk(documentId, chunkIndex, buffer.trim()));
    }

    return chunks;
  }

  private createChunk(documentId: string, index: number, content: string): Chunk {
    return {
      id: uuidv4(),
      documentId,
      content,
      index,
      metadata: {
        charCount: String(content.length),
        wordCount: String(content.split(/\s+/).length),
      },
    };
  }
}
