import { AppStatus } from '../../types';

interface Props {
  status: AppStatus;
}

export function StatusBar({ status }: Props) {
  return (
    <footer style={{ padding: '5px 16px', borderTop: '1px solid #263244', fontSize: 11, color: '#9fb2cc', display: 'flex', gap: 16 }}>
      <span>Sessions: {status.sessionsLoaded}</span>
      <span>Analyzed: {status.analyzedSessions}</span>
      <span>Warnings: {status.warnings}</span>
      {status.lastActivity && <span>Last activity: {new Date(status.lastActivity).toLocaleTimeString()}</span>}
    </footer>
  );
}
