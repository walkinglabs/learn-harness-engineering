import { ProjectEvidenceGap } from '../../types';
import { EvidenceChip } from './EvidenceChip';
import { ReportSection } from './FollowUpChainView';

interface Props {
  gaps: ProjectEvidenceGap[];
  onEvidenceClick: (utteranceId: string) => void;
}

export function ProjectEvidenceGapList({ gaps, onEvidenceClick }: Props) {
  return (
    <ReportSection title="Project Evidence Gaps">
      {gaps.map(gap => (
        <div key={gap.id} style={{ marginBottom: 12 }}>
          <strong>{gap.gapType}</strong>
          <div style={{ fontSize: 12, color: '#b8c7dc' }}>{gap.explanation}</div>
          {gap.evidenceUtteranceIds.map(id => <EvidenceChip key={id} utteranceId={id} onClick={onEvidenceClick} />)}
        </div>
      ))}
    </ReportSection>
  );
}
