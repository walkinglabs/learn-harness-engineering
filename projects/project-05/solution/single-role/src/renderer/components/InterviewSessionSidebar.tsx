import { InterviewSession } from '../../types';
import { EmptyState } from './EmptyState';

interface Props {
  sessions: InterviewSession[];
  selectedId: string | null;
  onSelect: (session: InterviewSession) => void;
}

export function InterviewSessionSidebar({ sessions, selectedId, onSelect }: Props) {
  return (
    <aside style={{ overflow: 'auto', borderRight: '1px solid #263244', background: '#151c29' }}>
      <div style={{ padding: '10px 12px', borderBottom: '1px solid #263244', color: '#b8c7dc', fontSize: 13 }}>
        Interview Sessions
      </div>
      {sessions.length === 0 ? (
        <EmptyState title="No sessions" body="Use the import button to create a sample session." compact />
      ) : (
        sessions.map(session => (
          <button
            key={session.id}
            onClick={() => onSelect(session)}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '10px 12px',
              border: 0,
              borderBottom: '1px solid #263244',
              background: selectedId === session.id ? '#263b5e' : 'transparent',
              color: '#eef2f7',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600 }}>{session.title}</div>
            <div style={{ fontSize: 11, color: '#9fb2cc' }}>{session.roleTarget} - {session.status}</div>
          </button>
        ))
      )}
    </aside>
  );
}
