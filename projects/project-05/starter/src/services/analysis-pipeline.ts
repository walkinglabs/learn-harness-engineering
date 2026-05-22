import { AnalysisReport } from '../types';
import { analyzeProjectEvidenceGaps } from './project-evidence-gap-analyzer';
import { analyzeRisks } from './risk-analyzer';
import { checkSafetyBoundaries } from './safety-boundary-checker';
import { segmentQuestionChains } from './question-chain-segmenter';
import { analyzeSpeechIssues } from './speech-metrics';
import { analyzeTechnicalGaps } from './technical-gap-analyzer';
import { parseTranscript } from './transcript-parser';
import { generateTrainingPlan } from './training-plan-generator';
import { createId } from './id';

export interface AnalyzeTranscriptInput {
  sessionId: string;
  transcript: string;
}

export function analyzeTranscript(input: AnalyzeTranscriptInput) {
  const parse = parseTranscript(input.transcript, input.sessionId);
  const followUpChains = segmentQuestionChains(parse.utterances);
  const technicalGaps = analyzeTechnicalGaps(parse.utterances, followUpChains);
  const projectEvidenceGaps = analyzeProjectEvidenceGaps(parse.utterances, followUpChains);
  const speechIssues = analyzeSpeechIssues(parse.utterances);
  const riskItems = analyzeRisks({
    chains: followUpChains,
    technicalGaps,
    projectEvidenceGaps,
    speechIssues,
  });
  const trainingPlan = generateTrainingPlan(riskItems);

  for (const risk of riskItems) {
    risk.recommendedTrainingTaskIds = trainingPlan
      .filter(task => task.sourceRiskItemIds.includes(risk.id))
      .map(task => task.id);
  }

  const report: AnalysisReport = {
    id: createId('report'),
    sessionId: input.sessionId,
    createdAt: new Date().toISOString(),
    followUpChains,
    technicalGaps,
    projectEvidenceGaps,
    speechIssues,
    riskItems,
    trainingPlan,
  };

  const safety = checkSafetyBoundaries(report);
  if (!safety.ok) {
    throw new Error(`Safety boundary violation: ${safety.violations.join('; ')}`);
  }

  return { parse, report };
}
