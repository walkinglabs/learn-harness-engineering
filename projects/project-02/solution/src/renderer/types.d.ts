/// <reference types="react" />
/// <reference types="react-dom" />

import {
  AnalysisFeedbackInput,
  AnalysisReport,
  AppStatus,
  ImportTranscriptInput,
  InterviewSession,
  Utterance,
} from '../types';

declare global {
  interface Window {
    interviewCoach: {
      listSessions(): Promise<InterviewSession[]>;
      importTranscript(input: ImportTranscriptInput): Promise<InterviewSession>;
      getTranscript(sessionId: string): Promise<Utterance[]>;
      analyzeSession(sessionId: string): Promise<AnalysisReport>;
      getReport(sessionId: string): Promise<AnalysisReport | null>;
      saveFeedback(input: AnalysisFeedbackInput): Promise<void>;
      getStatus(): Promise<AppStatus>;
    };
  }
}

export {};
