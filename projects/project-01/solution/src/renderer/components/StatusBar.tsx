import { AppStatus } from '../../shared/types';

interface Props {
  status: AppStatus;
  dataLocal: boolean;
}

export function StatusBar({ status, dataLocal }: Props) {
  return (
    <footer className="status-bar">
      <span className={`status-dot ${status.indexStatus}`} />
      <span>{status.indexStatus === 'ready' ? 'Library ready' : status.indexStatus === 'indexing' ? 'Indexing library' : 'Waiting for documents'}</span>
      <span className="status-separator">·</span>
      <span>{status.documentsLoaded} document{status.documentsLoaded === 1 ? '' : 's'}</span>
      {dataLocal && <span className="local-pill">⌂ Stored locally</span>}
    </footer>
  );
}
