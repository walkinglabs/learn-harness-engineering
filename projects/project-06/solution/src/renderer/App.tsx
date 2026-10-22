import { useState, useCallback, useEffect } from 'react';
import { DocumentList } from './components/DocumentList';
import { QuestionPanel } from './components/QuestionPanel';
import { DocumentDetail } from './components/DocumentDetail';
import { ConversationHistory } from './components/ConversationHistory';
import { StatusBar } from './components/StatusBar';
import { Document, AppStatus, QAResponse } from '../shared/types';

type ViewMode = 'documents' | 'history';

export function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [appStatus, setAppStatus] = useState<AppStatus>({
    documentsLoaded: 0,
    indexStatus: 'idle',
    lastActivity: '',
  });
  const [lastResponse, setLastResponse] = useState<QAResponse | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('documents');

  const refreshDocuments = useCallback(async () => {
    try {
      const docs = await window.knowledgeBase.documents.list();
      setDocuments(docs);
      // Keep the detail panel in sync: show fresh status after indexing,
      // and clear it if the selected document was deleted.
      setSelectedDoc(prev => (prev ? docs.find(d => d.id === prev.id) ?? null : null));
      const status = await window.knowledgeBase.indexing.status();
      setAppStatus(status);
    } catch (err) {
      console.error('Failed to refresh documents:', err);
    }
  }, []);

  useEffect(() => {
    refreshDocuments();
  }, [refreshDocuments]);

  const handleImport = useCallback(async () => {
    try {
      const result = await window.knowledgeBase.documents.pickAndImport();
      if (result.canceled) return;
      await refreshDocuments();
      if (result.imported.length === 1) {
        setSelectedDoc(result.imported[0]);
        setViewMode('documents');
      }
      if (result.failed.length > 0) {
        window.alert(
          'Some files could not be imported:\n\n' +
            result.failed.map(f => `${f.filePath}\n  ${f.error}`).join('\n\n'),
        );
      }
    } catch (err) {
      console.error('Import failed:', err);
      window.alert(`Import failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [refreshDocuments]);

  const handleSelectDocument = useCallback((doc: Document) => {
    setSelectedDoc(doc);
    setViewMode('documents');
  }, []);

  const handleAskQuestion = useCallback(async (question: string) => {
    try {
      const response = await window.knowledgeBase.qa.ask(question);
      setLastResponse(response);
      const status = await window.knowledgeBase.indexing.status();
      setAppStatus(status);
    } catch (err) {
      console.error('Q&A failed:', err);
    }
  }, []);

  const handleResetData = useCallback(async () => {
    if (window.confirm('This will delete all imported documents, indexes, Q&A history, and feedback. Continue?')) {
      await window.knowledgeBase.app.resetData();
      setDocuments([]);
      setSelectedDoc(null);
      setLastResponse(null);
      await refreshDocuments();
    }
  }, [refreshDocuments]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{
        padding: '12px 20px',
        background: '#16213e',
        borderBottom: '1px solid #0f3460',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h1 style={{ fontSize: '18px', fontWeight: 600 }}>Knowledge Base</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setViewMode(viewMode === 'history' ? 'documents' : 'history')}
            style={{
              padding: '6px 14px',
              background: viewMode === 'history' ? '#533483' : '#0f3460',
              color: '#e0e0e0',
              border: '1px solid #1a1a4e',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            {viewMode === 'history' ? 'Documents' : 'History'}
          </button>
          <button
            onClick={handleResetData}
            style={{
              padding: '6px 14px',
              background: '#8b0000',
              color: '#e0e0e0',
              border: '1px solid #660000',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Reset
          </button>
          <button
            onClick={refreshDocuments}
            style={{
              padding: '6px 14px',
              background: '#0f3460',
              color: '#e0e0e0',
              border: '1px solid #1a1a4e',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Refresh
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left panel: Document list */}
        <div style={{
          width: '280px',
          borderRight: '1px solid #0f3460',
          display: 'flex',
          flexDirection: 'column',
          background: '#16213e',
        }}>
          <div style={{
            padding: '10px 16px',
            borderBottom: '1px solid #0f3460',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#a0a0c0' }}>
              Documents ({documents.length})
            </span>
            <button
              onClick={handleImport}
              style={{
                padding: '4px 10px',
                background: '#533483',
                color: '#fff',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              + Import
            </button>
          </div>
          <DocumentList
            documents={documents}
            onSelect={handleSelectDocument}
            selectedId={selectedDoc?.id ?? null}
          />
        </div>

        {/* Right panel: Document detail + Q&A + History */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
            {viewMode === 'history' ? (
              <ConversationHistory />
            ) : (
              <>
                {selectedDoc ? (
                  <DocumentDetail document={selectedDoc} onRefresh={refreshDocuments} />
                ) : (
                  <div style={{ color: '#666', textAlign: 'center', paddingTop: '40px' }}>
                    Select a document or ask a question to get started
                  </div>
                )}
                {lastResponse && (
                  <div style={{
                    marginTop: '16px',
                    padding: '16px',
                    background: '#1a1a3e',
                    borderRadius: '6px',
                    border: '1px solid #0f3460',
                  }}>
                    <div style={{ fontSize: '14px', lineHeight: 1.6 }}>{lastResponse.answer}</div>
                    {lastResponse.citations.length > 0 && (
                      <div style={{ marginTop: '10px', fontSize: '12px', color: '#8888bb' }}>
                        <strong>Citations:</strong>
                        {lastResponse.citations.map((c, i) => (
                          <div key={i} style={{ marginTop: '4px', paddingLeft: '8px', borderLeft: '2px solid #533483' }}>
                            {c.documentTitle} (chunk {c.chunkIndex}): {c.excerpt.substring(0, 100)}...
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#666' }}>
                        Confidence: {(lastResponse.confidence * 100).toFixed(0)}%
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => window.knowledgeBase.feedback.submit(
                            lastResponse.timestamp, '', 'positive'
                          )}
                          style={{
                            padding: '4px 8px',
                            background: '#2d5a2d',
                            color: '#5cb85c',
                            border: '1px solid #3d7a3d',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '14px',
                          }}
                        >
                          Thumbs Up
                        </button>
                        <button
                          onClick={() => window.knowledgeBase.feedback.submit(
                            lastResponse.timestamp, '', 'negative'
                          )}
                          style={{
                            padding: '4px 8px',
                            background: '#5a2d2d',
                            color: '#d9534f',
                            border: '1px solid #7a3d3d',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '14px',
                          }}
                        >
                          Thumbs Down
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <QuestionPanel onAsk={handleAskQuestion} />
        </div>
      </div>

      <StatusBar status={appStatus} />
    </div>
  );
}
