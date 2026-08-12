import { useCallback, useEffect, useState } from 'react';
import { AppStatus, Document, QAHistory } from '../shared/types';
import { DocumentList } from './components/DocumentList';
import { QuestionPanel } from './components/QuestionPanel';
import { StatusBar } from './components/StatusBar';

const EMPTY_STATUS: AppStatus = {
  documentsLoaded: 0,
  indexStatus: 'idle',
  lastActivity: '',
};

export function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<QAHistory[]>([]);
  const [status, setStatus] = useState<AppStatus>(EMPTY_STATUS);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [nextDocuments, nextStatus, nextHistory] = await Promise.all([
      window.knowledgeBase.documents.list(),
      window.knowledgeBase.indexing.status(),
      window.knowledgeBase.qa.history(),
    ]);
    setDocuments(nextDocuments);
    setStatus(nextStatus);
    setHistory(nextHistory);
    setSelectedId(current => current && nextDocuments.some(doc => doc.id === current) ? current : nextDocuments[0]?.id ?? null);
  }, []);

  useEffect(() => {
    refresh().catch(error => setNotice(error instanceof Error ? error.message : 'Unable to load the knowledge base.'));
  }, [refresh]);

  const handleImport = useCallback(async () => {
    setNotice(null);
    try {
      const imported = await window.knowledgeBase.documents.pick();
      if (imported.length === 0) return;
      setBusy(true);
      await window.knowledgeBase.indexing.start();
      await refresh();
      setSelectedId(imported[0].id);
      setNotice(`${imported.length} document${imported.length === 1 ? '' : 's'} added and indexed.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Import failed.');
    } finally {
      setBusy(false);
    }
  }, [refresh]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await window.knowledgeBase.documents.delete(id);
      await refresh();
      setNotice('Document removed from this knowledge base.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to remove the document.');
    }
  }, [refresh]);

  const handleAsk = useCallback(async (question: string) => {
    setBusy(true);
    setNotice(null);
    try {
      const response = await window.knowledgeBase.qa.ask(question);
      setHistory(current => [...current, { question, response }]);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to answer that question.');
    } finally {
      setBusy(false);
    }
  }, []);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">K</div>
          <div>
            <strong>Keystone</strong>
            <span>Local knowledge base</span>
          </div>
        </div>

        <div className="library-heading">
          <span>LIBRARY</span>
          <span className="count-badge">{documents.length}</span>
        </div>
        <DocumentList
          documents={documents}
          selectedId={selectedId}
          onSelect={doc => setSelectedId(doc.id)}
          onDelete={handleDelete}
        />
        <div className="sidebar-footer">
          <button className="import-button" type="button" onClick={handleImport} disabled={busy}>
            <span aria-hidden="true">＋</span> Add documents
          </button>
          <p>TXT or Markdown · up to 10 MB</p>
        </div>
      </aside>

      <section className="workspace">
        <header className="workspace-header">
          <div>
            <span className="eyebrow">ASK YOUR LIBRARY</span>
            <h1>What would you like to know?</h1>
          </div>
          <button className="icon-button" type="button" onClick={() => refresh()} aria-label="Refresh library" title="Refresh">↻</button>
        </header>

        <section className="conversation" aria-live="polite">
          {notice && <div className="notice">{notice}</div>}
          {history.length === 0 ? (
            <div className="welcome-card">
              <div className="spark" aria-hidden="true">✦</div>
              <h2>Your documents, ready to talk</h2>
              <p>Add text or Markdown files, then ask a question. Answers stay grounded in your local documents and include source references.</p>
              <div className="suggestions">
                <button type="button" onClick={() => handleAsk('Summarize the key ideas in my documents.')}>Summarize the key ideas</button>
                <button type="button" onClick={() => handleAsk('What decisions are mentioned?')}>Find mentioned decisions</button>
              </div>
            </div>
          ) : (
            <div className="messages">
              {history.map((item, index) => (
                <article className="message-group" key={`${item.response.timestamp}-${index}`}>
                  <div className="question-bubble">{item.question}</div>
                  <div className="answer-card">
                    <div className="answer-label"><span>✦</span> Answer</div>
                    <p>{item.response.answer}</p>
                    {item.response.citations.length > 0 && (
                      <div className="citations">
                        <span>Sources</span>
                        {item.response.citations.map((citation, citationIndex) => (
                          <button key={`${citation.documentId}-${citation.chunkIndex}-${citationIndex}`} type="button" onClick={() => setSelectedId(citation.documentId)}>
                            {citation.documentTitle} · section {citation.chunkIndex + 1}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="confidence">Confidence {Math.round(item.response.confidence * 100)}%</div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <QuestionPanel onAsk={handleAsk} disabled={busy} />
        <StatusBar status={status} dataLocal />
      </section>
    </main>
  );
}
