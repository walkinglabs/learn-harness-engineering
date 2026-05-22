import { describe, expect, it } from 'vitest';
import { checkSafetyBoundaries } from './safety-boundary-checker';
import { AnalysisReport } from '../types';

const baseReport: AnalysisReport = {
  id: 'report-1',
  sessionId: 'session-1',
  createdAt: '2026-05-22T00:00:00.000Z',
  followUpChains: [],
  technicalGaps: [],
  projectEvidenceGaps: [],
  speechIssues: [],
  riskItems: [],
  trainingPlan: [],
};

describe('checkSafetyBoundaries', () => {
  it('rejects hiring decisions and lie-detection language', () => {
    const result = checkSafetyBoundaries({
      ...baseReport,
      riskItems: [
        {
          id: 'risk-1',
          sessionId: 'session-1',
          title: 'Do not hire',
          severity: 'high',
          reason: 'The candidate is lying and should be rejected.',
          evidenceUtteranceIds: ['utt-1'],
          recommendedTrainingTaskIds: ['task-1'],
        },
      ],
    });

    expect(result.ok).toBe(false);
    expect(result.violations).toContain('Forbidden hiring decision or screening language found.');
    expect(result.violations).toContain('Forbidden lie detection language found.');
  });

  it('rejects risk items without evidence', () => {
    const result = checkSafetyBoundaries({
      ...baseReport,
      riskItems: [
        {
          id: 'risk-1',
          sessionId: 'session-1',
          title: 'Missing evidence',
          severity: 'medium',
          reason: 'This risk has no evidence.',
          evidenceUtteranceIds: [],
          recommendedTrainingTaskIds: [],
        },
      ],
    });

    expect(result.ok).toBe(false);
    expect(result.violations).toContain('Risk item risk-1 has no evidence utterances.');
  });

  it('does not scan internal ids when checking prohibited language', () => {
    const result = checkSafetyBoundaries({
      ...baseReport,
      id: 'report-lie-1',
      sessionId: 'session-nationality-1',
      riskItems: [
        {
          id: 'risk-liar-1',
          sessionId: 'session-1',
          title: 'Evidence gap',
          severity: 'medium',
          reason: 'The answer needs a transcript-backed example.',
          evidenceUtteranceIds: ['utt-age-1'],
          recommendedTrainingTaskIds: ['task-rejected-1'],
        },
      ],
    });

    expect(result.ok).toBe(true);
  });
});
