export type Speaker = 'interviewer' | 'candidate' | 'unknown';

export type InterviewType =
  | 'behavioral'
  | 'technical'
  | 'system-design'
  | 'project-deep-dive'
  | 'mixed';

export interface InterviewSession {
  id: string;
  title: string;
  roleTarget: string;
  interviewType: InterviewType;
  audioPath?: string;
  transcriptPath?: string;
  createdAt: string;
  updatedAt: string;
  status: 'imported' | 'parsed' | 'analyzing' | 'analyzed' | 'reviewed';
}

export interface Utterance {
  id: string;
  sessionId: string;
  speaker: Speaker;
  startMs: number;
  endMs: number;
  text: string;
  confidence?: number;
}
