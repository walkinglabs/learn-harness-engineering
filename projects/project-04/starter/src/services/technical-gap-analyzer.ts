import { FollowUpChain, TechnicalGap, Utterance } from '../types';
import { createId } from './id';

export function analyzeTechnicalGaps(
  utterances: Utterance[],
  chains: FollowUpChain[]
): TechnicalGap[] {
  const gaps: TechnicalGap[] = [];
  const byId = new Map(utterances.map(utterance => [utterance.id, utterance]));

  for (const chain of chains) {
    const chainUtterances = chain.utteranceIds
      .map(id => byId.get(id))
      .filter((utterance): utterance is Utterance => Boolean(utterance));
    const text = chainUtterances.map(utterance => utterance.text).join(' ');
    const candidateEvidence = chainUtterances.find(utterance => utterance.speaker === 'candidate');
    if (!candidateEvidence) continue;

    if (/redis|缓存|cache|故障|兜底|幂等|concurrency|database/i.test(text)) {
      gaps.push({
        id: createId('tech-gap'),
        sessionId: chain.sessionId,
        category: /redis|缓存|cache/i.test(text) ? 'cache' : 'architecture',
        severity: /没有特别展开|不太清楚|看业务情况/.test(text) ? 'high' : 'medium',
        explanation:
          'Technical answer needs clearer implementation detail, failure handling, and validation evidence.',
        evidenceUtteranceIds: [candidateEvidence.id],
      });
    }
  }

  return gaps;
}
