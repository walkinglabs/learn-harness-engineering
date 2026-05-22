import { Utterance } from '../../types';

interface Props {
  utterance: Utterance;
  highlighted: boolean;
}

export function UtteranceRow({ utterance, highlighted }: Props) {
  return (
    <div
      id={utterance.id}
      style={{
        padding: '10px 12px',
        borderBottom: '1px solid #253144',
        background: highlighted ? '#263b5e' : 'transparent',
      }}
    >
      <div style={{ fontSize: 12, color: '#9fb2cc', marginBottom: 4 }}>
        {formatMs(utterance.startMs)} - {utterance.speaker}
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.5 }}>{utterance.text}</div>
    </div>
  );
}

function formatMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}
