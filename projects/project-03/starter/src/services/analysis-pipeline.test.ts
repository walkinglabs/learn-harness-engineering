import { describe, expect, it } from 'vitest';
import { analyzeTranscript } from './analysis-pipeline';
import { checkSafetyBoundaries } from './safety-boundary-checker';

const transcript = [
  '[00:02] interviewer: 介绍一下你最近做的订单系统项目。',
  '[00:15] candidate: 嗯，这个项目主要是我们做了一个订单服务。',
  '[00:38] interviewer: 你具体负责哪一块？',
  '[00:45] candidate: 我参与后端开发，主要写了一些接口。',
  '[01:05] interviewer: 指标提升是多少，怎么验证的？',
  '[01:12] candidate: 当时效果还不错，具体指标我记不太清。',
  '[01:35] interviewer: 如果 Redis 故障，幂等怎么兜底？',
  '[01:44] candidate: 这个线上应该没问题，我们没有特别展开。',
].join('\n');

describe('analyzeTranscript', () => {
  it('generates evidence-grounded debrief sections from transcript text', () => {
    const output = analyzeTranscript({
      sessionId: 'session-pipeline',
      transcript,
    });

    expect(output.parse.errors).toEqual([]);
    expect(output.report.followUpChains.length).toBeGreaterThan(0);
    expect(output.report.technicalGaps.length).toBeGreaterThan(0);
    expect(output.report.projectEvidenceGaps.length).toBeGreaterThan(0);
    expect(output.report.speechIssues.length).toBeGreaterThan(0);
    expect(output.report.riskItems.length).toBeGreaterThan(0);
    expect(output.report.trainingPlan.length).toBe(output.report.riskItems.length);

    for (const risk of output.report.riskItems) {
      expect(risk.evidenceUtteranceIds.length).toBeGreaterThan(0);
      expect(risk.recommendedTrainingTaskIds.length).toBeGreaterThan(0);
    }

    expect(checkSafetyBoundaries(output.report).ok).toBe(true);
  });
});
