import { AnalysisFeedbackInput, RiskItem } from '../../types';
import { AnalysisFeedbackControls } from './AnalysisFeedbackControls';
import { EvidenceChip } from './EvidenceChip';
import { ReportSection } from './FollowUpChainView';

interface Props {
  risks: RiskItem[];
  onEvidenceClick: (utteranceId: string) => void;
  onFeedback: (input: Omit<AnalysisFeedbackInput, 'sessionId' | 'reportId'>) => void;
}

export function RiskItemList({ risks, onEvidenceClick, onFeedback }: Props) {
  return (
    <ReportSection title="Risk Items">
      {risks.map(risk => (
        <div key={risk.id} style={{ marginBottom: 12 }}>
          <strong>{risk.title} - {risk.severity}</strong>
          <div style={{ fontSize: 12, color: '#b8c7dc' }}>{risk.reason}</div>
          {risk.evidenceUtteranceIds.map(id => <EvidenceChip key={id} utteranceId={id} onClick={onEvidenceClick} />)}
          <AnalysisFeedbackControls itemId={risk.id} onFeedback={onFeedback} />
        </div>
      ))}
    </ReportSection>
  );
}
