import {
  FollowUpChain,
  ProjectEvidenceGap,
  RiskItem,
  SpeechIssue,
  TechnicalGap,
} from '../types';
import { createId } from './id';

export function analyzeRisks(input: {
  chains: FollowUpChain[];
  technicalGaps: TechnicalGap[];
  projectEvidenceGaps: ProjectEvidenceGap[];
  speechIssues: SpeechIssue[];
}): RiskItem[] {
  const risks: RiskItem[] = [];

  for (const gap of input.technicalGaps) {
    risks.push({
      id: createId('risk'),
      sessionId: gap.sessionId,
      title: 'Technical depth answer needs stronger evidence',
      severity: gap.severity,
      reason: gap.explanation,
      evidenceUtteranceIds: gap.evidenceUtteranceIds,
      recommendedTrainingTaskIds: [],
    });
  }

  for (const gap of input.projectEvidenceGaps) {
    risks.push({
      id: createId('risk'),
      sessionId: gap.sessionId,
      title: 'Project evidence gap',
      severity: 'medium',
      reason: gap.explanation,
      evidenceUtteranceIds: gap.evidenceUtteranceIds,
      recommendedTrainingTaskIds: [],
    });
  }

  if (input.speechIssues.length > 0) {
    const firstIssue = input.speechIssues[0];
    risks.push({
      id: createId('risk'),
      sessionId: firstIssue.sessionId,
      title: 'Answer structure and delivery need cleanup',
      severity: 'low',
      reason: 'Filler words or vague phrasing make the answer harder to evaluate.',
      evidenceUtteranceIds: firstIssue.evidenceUtteranceIds,
      recommendedTrainingTaskIds: [],
    });
  }

  return risks;
}
