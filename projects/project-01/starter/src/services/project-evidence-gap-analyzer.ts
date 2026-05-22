import { FollowUpChain, ProjectEvidenceGap, Utterance } from '../types';
import { createId } from './id';

export function analyzeProjectEvidenceGaps(
  utterances: Utterance[],
  chains: FollowUpChain[]
): ProjectEvidenceGap[] {
  const gaps: ProjectEvidenceGap[] = [];
  const byId = new Map(utterances.map(utterance => [utterance.id, utterance]));

  for (const chain of chains) {
    const chainUtterances = chain.utteranceIds
      .map(id => byId.get(id))
      .filter((utterance): utterance is Utterance => Boolean(utterance));
    const questionText = chainUtterances
      .filter(utterance => utterance.speaker === 'interviewer')
      .map(utterance => utterance.text)
      .join(' ');
    const answer = chainUtterances.find(utterance => utterance.speaker === 'candidate');
    if (!answer) continue;

    const gapType = inferGapType(questionText);
    const lacksConcreteEvidence =
      /我们|参与|一些|还不错|不太清楚|没有|大概/.test(answer.text) &&
      !/\d|%|ms|qps|latency|p95|接口|模块|回滚|监控|压测/.test(answer.text);

    if (gapType !== 'unknown' && lacksConcreteEvidence) {
      gaps.push({
        id: createId('project-gap'),
        sessionId: chain.sessionId,
        gapType,
        explanation:
          'This answer has a project evidence gap: it does not state concrete ownership, metrics, implementation detail, or validation evidence.',
        evidenceUtteranceIds: [answer.id],
      });
    }
  }

  return gaps;
}

function inferGapType(text: string): ProjectEvidenceGap['gapType'] {
  if (/负责|哪一块|ownership|your role/i.test(text)) return 'ownership';
  if (/指标|metric|衡量|验证|measure/i.test(text)) return 'metric';
  if (/故障|failure|线上|回滚/i.test(text)) return 'failure-story';
  if (/怎么做|具体|实现|detail/i.test(text)) return 'implementation-detail';
  return 'unknown';
}
