import { TechnicalGap } from '../../types';
import { EvidenceChip } from './EvidenceChip';
import { ReportSection } from './FollowUpChainView';

interface Props {
  gaps: TechnicalGap[];
  onEvidenceClick: (utteranceId: string) => void;
}

export function TechnicalGapList({ gaps, onEvidenceClick }: Props) {
  return (
    <ReportSection title="Technical Depth Gaps">
      {gaps.map(gap => (
        <div key={gap.id} style={{ marginBottom: 12 }}>
          <strong>{gap.category} - {gap.severity}</strong>
          <div style={{ fontSize: 12, color: '#b8c7dc' }}>{gap.explanation}</div>
          {gap.evidenceUtteranceIds.map(id => <EvidenceChip key={id} utteranceId={id} onClick={onEvidenceClick} />)}
        </div>
      ))}
    </ReportSection>
  );
}
