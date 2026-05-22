import { Utterance } from '../../types';
import { EmptyState } from './EmptyState';
import { UtteranceRow } from './UtteranceRow';

interface Props {
  utterances: Utterance[];
  highlightedUtteranceId: string | null;
}

export function TranscriptTimeline({ utterances, highlightedUtteranceId }: Props) {
  if (utterances.length === 0) {
    return <EmptyState title="No transcript loaded" body="Import a timestamped transcript to inspect the timeline." />;
  }

  return (
    <section style={{ minWidth: 0, overflow: 'auto', borderRight: '1px solid #263244' }}>
      <div style={{ padding: '10px 12px', borderBottom: '1px solid #263244', color: '#b8c7dc', fontSize: 13 }}>
        Transcript Timeline
      </div>
      {utterances.map(utterance => (
        <UtteranceRow
          key={utterance.id}
          utterance={utterance}
          highlighted={utterance.id === highlightedUtteranceId}
        />
      ))}
    </section>
  );
}
