import { SpeechIssue } from '../../types';
import { EvidenceChip } from './EvidenceChip';
import { ReportSection } from './FollowUpChainView';

interface Props {
  issues: SpeechIssue[];
  onEvidenceClick: (utteranceId: string) => void;
}

export function SpeechIssueList({ issues, onEvidenceClick }: Props) {
  return (
    <ReportSection title="Speech Issues">
      {issues.map(issue => (
        <div key={issue.id} style={{ marginBottom: 12 }}>
          <strong>{issue.issueType}</strong>
          <div style={{ fontSize: 12, color: '#b8c7dc' }}>{issue.explanation}</div>
          {issue.evidenceUtteranceIds.map(id => <EvidenceChip key={id} utteranceId={id} onClick={onEvidenceClick} />)}
        </div>
      ))}
    </ReportSection>
  );
}
