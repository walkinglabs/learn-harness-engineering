import { useEffect, useState } from 'react';
import { Document, Chunk } from '../../shared/types';

interface Props {
  document: Document;
  onRefresh?: () => void;
}

export function DocumentDetail({ document: doc, onRefresh }: Props) {
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [showChunks, setShowChunks] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);

  useEffect(() => {
    window.knowledgeBase.indexing.chunks(doc.id).then(setChunks);
  }, [doc.id, doc.status, doc.chunks]);

  const handleIndex = async () => {
    setIsIndexing(true);
    try {
      await window.knowledgeBase.indexing.start(doc.id);
      if (onRefresh) onRefresh();
    } finally {
      setIsIndexing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete "${doc.title}"? This cannot be undone.`)) {
      await window.knowledgeBase.documents.delete(doc.id);
      if (onRefresh) onRefresh();
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
        {doc.title}
      </h2>
      <div style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>
        <div>Filename: {doc.filename}</div>
        <div>Imported: {new Date(doc.importedAt).toLocaleString()}</div>
        <div>Size: {(doc.size / 1024).toFixed(1)} KB</div>
        <div>Status: <span style={{ color: doc.status === 'indexed' ? '#5cb85c' : doc.status === 'error' ? '#d9534f' : '#f0ad4e' }}>{doc.status}</span></div>
        {doc.chunks !== undefined && <div>Chunks: {doc.chunks}</div>}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setShowChunks(!showChunks)}
          style={{
            padding: '6px 12px',
            background: '#0f3460',
            color: '#e0e0e0',
            border: '1px solid #1a1a4e',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          {showChunks ? 'Hide' : 'Show'} Chunks ({chunks.length})
        </button>
        {doc.status !== 'indexed' && (
          <button
            onClick={handleIndex}
            disabled={isIndexing}
            style={{
              padding: '6px 12px',
              background: isIndexing ? '#333' : '#533483',
              color: isIndexing ? '#888' : '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: isIndexing ? 'not-allowed' : 'pointer',
              fontSize: '12px',
            }}
          >
            {isIndexing ? 'Indexing...' : 'Index Document'}
          </button>
        )}
        <button
          onClick={handleDelete}
          style={{
            padding: '6px 12px',
            background: '#5a2d2d',
            color: '#d9534f',
            border: '1px solid #7a3d3d',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Delete
        </button>
      </div>

      {showChunks && (
        <div>
          {chunks.map(chunk => (
            <div
              key={chunk.id}
              style={{
                padding: '10px',
                marginBottom: '8px',
                background: '#1a1a3e',
                borderRadius: '4px',
                borderLeft: '3px solid #533483',
                fontSize: '13px',
                lineHeight: 1.5,
              }}
            >
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
                Chunk {chunk.index} ({chunk.metadata.charCount} chars, {chunk.metadata.wordCount} words)
              </div>
              {chunk.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
