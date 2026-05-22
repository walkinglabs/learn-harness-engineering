import { AnalysisFeedbackInput } from '../../types';

interface Props {
  itemId: string;
  onFeedback: (input: Omit<AnalysisFeedbackInput, 'sessionId' | 'reportId'>) => void;
}

export function AnalysisFeedbackControls({ itemId, onFeedback }: Props) {
  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
      {(['accurate', 'inaccurate', 'ignored'] as const).map(value => (
        <button key={value} onClick={() => onFeedback({ itemId, value })} style={{ fontSize: 11 }}>
          {value}
        </button>
      ))}
    </div>
  );
}
