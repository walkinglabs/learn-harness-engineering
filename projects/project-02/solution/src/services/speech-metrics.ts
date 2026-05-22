import { SpeechIssue, Utterance } from '../types';
import { createId } from './id';

const FILLER_PATTERN = /\b(um|uh|like)\b|嗯|呃|那个|就是/g;

export function analyzeSpeechIssues(utterances: Utterance[]): SpeechIssue[] {
  const issues: SpeechIssue[] = [];

  for (const utterance of utterances.filter(item => item.speaker === 'candidate')) {
    const fillers = utterance.text.match(FILLER_PATTERN)?.length ?? 0;
    if (fillers > 0) {
      issues.push({
        id: createId('speech'),
        sessionId: utterance.sessionId,
        issueType: 'filler-word',
        metric: fillers,
        explanation: 'Candidate answer includes filler words that weaken structure.',
        evidenceUtteranceIds: [utterance.id],
      });
    }

    if (/还不错|不太清楚|没有特别展开|看业务情况|参与了一部分/.test(utterance.text)) {
      issues.push({
        id: createId('speech'),
        sessionId: utterance.sessionId,
        issueType: 'unclear-structure',
        metric: 1,
        explanation: 'Answer uses vague phrasing instead of a concrete structure.',
        evidenceUtteranceIds: [utterance.id],
      });
    }
  }

  return issues;
}
