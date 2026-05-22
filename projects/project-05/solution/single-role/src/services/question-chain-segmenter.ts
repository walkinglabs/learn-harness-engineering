import { FollowUpChain, Utterance } from '../types';
import { createId } from './id';

export function segmentQuestionChains(utterances: Utterance[]): FollowUpChain[] {
  const chains: FollowUpChain[] = [];
  const sessionId = utterances[0]?.sessionId ?? 'unknown-session';
  let current: Utterance[] = [];

  for (const utterance of utterances) {
    if (utterance.speaker === 'interviewer') {
      if (current.length > 1) {
        chains.push(toChain(sessionId, current));
      }
      current = [utterance];
      continue;
    }

    if (current.length > 0) {
      current.push(utterance);
    }
  }

  if (current.length > 1) {
    chains.push(toChain(sessionId, current));
  }

  return chains;
}

function toChain(sessionId: string, utterances: Utterance[]): FollowUpChain {
  const question = utterances[0];
  return {
    id: createId('chain'),
    sessionId,
    topic: summarizeTopic(question.text),
    rootQuestionUtteranceId: question.id,
    utteranceIds: utterances.map(utterance => utterance.id),
    depth: utterances.filter(utterance => utterance.speaker === 'interviewer').length,
    trigger: inferTrigger(question.text),
    summary: `Question chain around "${question.text.slice(0, 48)}"`,
  };
}

function summarizeTopic(text: string): string {
  if (/指标|metric|measure|衡量/i.test(text)) return 'Metrics and validation';
  if (/负责|ownership|your role|哪一块/i.test(text)) return 'Ownership';
  if (/故障|failure|兜底|trade.?off|权衡|缓存|redis/i.test(text)) return 'Technical depth';
  return text.slice(0, 32);
}

function inferTrigger(text: string): FollowUpChain['trigger'] {
  if (/负责|ownership|your role|哪一块/i.test(text)) return 'ownership';
  if (/指标|metric|measure|衡量/i.test(text)) return 'metric';
  if (/故障|failure|兜底/i.test(text)) return 'failure-case';
  if (/权衡|trade.?off/i.test(text)) return 'tradeoff';
  if (/怎么|how|具体|detail|redis|cache|缓存/i.test(text)) return 'technical-detail';
  return 'unknown';
}
