import { Document } from '../../shared/types';

interface Props {
  documents: Document[];
  onSelect: (document: Document) => void;
  onDelete: (id: string) => void;
  selectedId: string | null;
}

function fileLabel(filename: string): string {
  return filename.split('.').pop()?.toUpperCase() ?? 'TXT';
}

export function DocumentList({ documents, onSelect, onDelete, selectedId }: Props) {
  if (documents.length === 0) {
    return (
      <div className="empty-library">
        <div aria-hidden="true">▤</div>
        <strong>No documents yet</strong>
        <span>Add your first file below.</span>
      </div>
    );
  }

  return (
    <div className="document-list">
      {documents.map(document => (
        <div className={`document-row ${selectedId === document.id ? 'selected' : ''}`} key={document.id}>
          <button type="button" className="document-main" onClick={() => onSelect(document)}>
            <span className="file-icon">{fileLabel(document.filename)}</span>
            <span className="document-copy">
              <strong>{document.title}</strong>
              <span>{document.chunks ?? 0} sections · {(document.size / 1024).toFixed(1)} KB</span>
            </span>
          </button>
          <button type="button" className="delete-button" onClick={() => onDelete(document.id)} aria-label={`Delete ${document.title}`}>×</button>
        </div>
      ))}
    </div>
  );
}
