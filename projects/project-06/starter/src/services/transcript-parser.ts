import { Speaker, TranscriptParseResult, Utterance } from '../types';
import { createId } from './id';

const LINE_PATTERN = /^\[([0-9:.]+)\]\s*([^:：]+)\s*[:：]\s*(.+)$/;

const SPEAKER_ALIASES: Record<string, Speaker> = {
  interviewer: 'interviewer',
  '面试官': 'interviewer',
  hr: 'interviewer',
  candidate: 'candidate',
  '候选人': 'candidate',
  me: 'candidate',
  '我': 'candidate',
  unknown: 'unknown',
  '未知': 'unknown',
};

export function parseTranscript(text: string, sessionId: string): TranscriptParseResult {
  const utterances: Utterance[] = [];
  const errors: TranscriptParseResult['errors'] = [];

  text.split(/\r?\n/).forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) return;

    const match = LINE_PATTERN.exec(line);
    if (!match) {
      errors.push({
        lineNumber: index + 1,
        rawLine,
        reason: 'Line does not match "[timestamp] speaker: text"',
      });
      return;
    }

    const startMs = parseTimestamp(match[1]);
    if (startMs === null) {
      errors.push({
        lineNumber: index + 1,
        rawLine,
        reason: 'Invalid timestamp',
      });
      return;
    }

    utterances.push({
      id: createId('utt'),
      sessionId,
      speaker: normalizeSpeaker(match[2]),
      startMs,
      endMs: startMs,
      text: match[3].trim(),
    });
  });

  for (let i = 0; i < utterances.length; i += 1) {
    utterances[i].endMs = utterances[i + 1]?.startMs ?? utterances[i].startMs + 2000;
  }

  return { utterances, errors };
}

function normalizeSpeaker(value: string): Speaker {
  return SPEAKER_ALIASES[value.trim().toLowerCase()] ?? 'unknown';
}

function parseTimestamp(value: string): number | null {
  const parts = value.split(':');
  if (parts.length < 2 || parts.length > 3) return null;

  const seconds = Number(parts[parts.length - 1]);
  const minutes = Number(parts[parts.length - 2]);
  const hours = parts.length === 3 ? Number(parts[0]) : 0;

  if ([seconds, minutes, hours].some(part => Number.isNaN(part))) return null;
  return Math.round(((hours * 60 + minutes) * 60 + seconds) * 1000);
}
