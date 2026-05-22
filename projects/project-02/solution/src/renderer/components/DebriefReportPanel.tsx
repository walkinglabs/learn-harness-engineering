import { AnalysisFeedbackInput, AnalysisReport } from '../../types';
import { EmptyState } from './EmptyState';
import { FollowUpChainView } from './FollowUpChainView';
import { ProjectEvidenceGapList } from './ProjectEvidenceGapList';
import { RiskItemList } from './RiskItemList';
import { SpeechIssueList } from './SpeechIssueList';
import { TechnicalGapList } from './TechnicalGapList';
import { TrainingPlanPanel } from './TrainingPlanPanel';

interface Props {
  report: AnalysisReport | null;
  onEvidenceClick: (utteranceId: string) => void;
  onFeedback: (input: Omit<AnalysisFeedbackInput, 'sessionId' | 'reportId'>) => void;
}

export function DebriefReportPanel({ report, onEvidenceClick, onFeedback }: Props) {
  if (!report) {
    return <EmptyState title="No debrief report" body="Run analysis to generate timestamped findings." />;
  }

  return (
    <aside style={{ overflow: 'auto', background: '#151c29' }}>
      <div style={{ padding: '10px 12px', borderBottom: '1px solid #263244', color: '#b8c7dc', fontSize: 13 }}>
        Debrief Report
      </div>
      <FollowUpChainView chains={report.followUpChains} onEvidenceClick={onEvidenceClick} />
      <TechnicalGapList gaps={report.technicalGaps} onEvidenceClick={onEvidenceClick} />
      <ProjectEvidenceGapList gaps={report.projectEvidenceGaps} onEvidenceClick={onEvidenceClick} />
      <SpeechIssueList issues={report.speechIssues} onEvidenceClick={onEvidenceClick} />
      <RiskItemList risks={report.riskItems} onEvidenceClick={onEvidenceClick} onFeedback={onFeedback} />
      <TrainingPlanPanel tasks={report.trainingPlan} />
    </aside>
  );
}
