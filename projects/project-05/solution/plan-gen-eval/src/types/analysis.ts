export interface FollowUpChain {
  id: string;
  sessionId: string;
  topic: string;
  rootQuestionUtteranceId: string;
  utteranceIds: string[];
  depth: number;
  trigger:
    | 'unclear-answer'
    | 'technical-detail'
    | 'ownership'
    | 'tradeoff'
    | 'metric'
    | 'failure-case'
    | 'unknown';
  summary: string;
}

export interface TechnicalGap {
  id: string;
  sessionId: string;
  category:
    | 'architecture'
    | 'data-structure'
    | 'concurrency'
    | 'database'
    | 'cache'
    | 'message-queue'
    | 'observability'
    | 'performance'
    | 'tradeoff'
    | 'testing'
    | 'unknown';
  severity: 'low' | 'medium' | 'high';
  explanation: string;
  evidenceUtteranceIds: string[];
}

export interface ProjectEvidenceGap {
  id: string;
  sessionId: string;
  gapType:
    | 'ownership'
    | 'metric'
    | 'architecture'
    | 'tradeoff'
    | 'failure-story'
    | 'implementation-detail'
    | 'validation'
    | 'unknown';
  explanation: string;
  evidenceUtteranceIds: string[];
}

export interface SpeechIssue {
  id: string;
  sessionId: string;
  issueType:
    | 'long-pause'
    | 'filler-word'
    | 'repetition'
    | 'interrupted-answer'
    | 'unclear-structure';
  metric: number;
  explanation: string;
  evidenceUtteranceIds: string[];
}

export interface RiskItem {
  id: string;
  sessionId: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  reason: string;
  evidenceUtteranceIds: string[];
  recommendedTrainingTaskIds: string[];
}

export interface TrainingTask {
  id: string;
  sessionId: string;
  title: string;
  taskType:
    | 'rewrite-answer'
    | 'mock-follow-up'
    | 'deep-dive-drill'
    | 'speech-practice'
    | 'project-story';
  instructions: string;
  sourceRiskItemIds: string[];
}

export interface AnalysisReport {
  id: string;
  sessionId: string;
  createdAt: string;
  followUpChains: FollowUpChain[];
  technicalGaps: TechnicalGap[];
  projectEvidenceGaps: ProjectEvidenceGap[];
  speechIssues: SpeechIssue[];
  riskItems: RiskItem[];
  trainingPlan: TrainingTask[];
}

export interface AnalysisFeedbackInput {
  sessionId: string;
  reportId: string;
  itemId: string;
  value: 'accurate' | 'inaccurate' | 'ignored';
}
