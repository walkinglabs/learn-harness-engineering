import { AnalysisReport } from '../types';

export interface SafetyBoundaryResult {
  ok: boolean;
  violations: string[];
}

export function checkSafetyBoundaries(report: AnalysisReport): SafetyBoundaryResult {
  const violations: string[] = [];
  const reviewText = [
    ...report.followUpChains.map(item => `${item.topic} ${item.summary}`),
    ...report.technicalGaps.map(item => item.explanation),
    ...report.projectEvidenceGaps.map(item => item.explanation),
    ...report.speechIssues.map(item => item.explanation),
    ...report.riskItems.map(item => `${item.title} ${item.reason}`),
    ...report.trainingPlan.map(item => `${item.title} ${item.instructions}`),
  ].join('\n').toLowerCase();

  if (/do not hire|reject|rejected|hire\/reject|hiring decision|screen out|录用|拒绝|淘汰/.test(reviewText)) {
    violations.push('Forbidden hiring decision or screening language found.');
  }
  if (/\b(lying|lie|liar|dishonest)\b|撒谎|造假|不真实/.test(reviewText)) {
    violations.push('Forbidden lie detection language found.');
  }
  if (/\b(age|gender|race|religion|disability|nationality)\b|年龄|性别|种族|宗教|残疾|国籍/.test(reviewText)) {
    violations.push('Forbidden protected attribute inference found.');
  }
  if (/\b(emotion|angry|anxious|personality)\b|情绪|焦虑|人格|性格/.test(reviewText)) {
    violations.push('Forbidden emotion or personality judgment found.');
  }

  for (const risk of report.riskItems) {
    if (risk.evidenceUtteranceIds.length === 0) {
      violations.push(`Risk item ${risk.id} has no evidence utterances.`);
    }
  }

  return { ok: violations.length === 0, violations };
}
