import { Utterance } from './interview';

export interface TranscriptParseResult {
  utterances: Utterance[];
  errors: TranscriptParseError[];
}

export interface TranscriptParseError {
  lineNumber: number;
  rawLine: string;
  reason: string;
}

export interface ImportTranscriptInput {
  title: string;
  roleTarget: string;
  interviewType: import('./interview').InterviewType;
  transcriptText: string;
  transcriptPath?: string;
}
