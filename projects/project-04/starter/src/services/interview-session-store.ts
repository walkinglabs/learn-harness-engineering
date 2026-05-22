import * as fs from 'fs';
import * as path from 'path';
import {
  AnalysisFeedbackInput,
  AnalysisReport,
  AppStatus,
  ImportTranscriptInput,
  InterviewSession,
  Utterance,
} from '../types';
import { analyzeTranscript } from './analysis-pipeline';
import { createId } from './id';
import { parseTranscript } from './transcript-parser';

const SESSIONS_FILE = 'sessions.json';
const FEEDBACK_FILE = 'feedback.json';

export class InterviewSessionStore {
  constructor(private readonly dataDir: string) {
    fs.mkdirSync(this.dataDir, { recursive: true });
    fs.mkdirSync(path.join(this.dataDir, 'transcripts'), { recursive: true });
    fs.mkdirSync(path.join(this.dataDir, 'reports'), { recursive: true });
  }

  listSessions(): InterviewSession[] {
    return this.readJson<InterviewSession[]>(SESSIONS_FILE, []);
  }

  importTranscript(input: ImportTranscriptInput): InterviewSession {
    const now = new Date().toISOString();
    const session: InterviewSession = {
      id: createId('session'),
      title: input.title,
      roleTarget: input.roleTarget,
      interviewType: input.interviewType,
      transcriptPath: input.transcriptPath,
      createdAt: now,
      updatedAt: now,
      status: 'parsed',
    };
    const parse = parseTranscript(input.transcriptText, session.id);
    const sessions = this.listSessions();
    sessions.push(session);

    this.writeJson(SESSIONS_FILE, sessions);
    this.writeText(`transcripts/${session.id}.transcript`, input.transcriptText);
    this.writeJson(`transcripts/${session.id}.utterances.json`, parse.utterances);
    this.writeJson(`transcripts/${session.id}.errors.json`, parse.errors);
    return session;
  }

  getTranscript(sessionId: string): Utterance[] {
    return this.readJson<Utterance[]>(`transcripts/${sessionId}.utterances.json`, []);
  }

  analyzeSession(sessionId: string): AnalysisReport {
    const transcript = this.readText(`transcripts/${sessionId}.transcript`);
    if (!transcript) {
      throw new Error(`Transcript not found for session ${sessionId}`);
    }

    this.updateSessionStatus(sessionId, 'analyzing');
    const output = analyzeTranscript({ sessionId, transcript });
    this.writeJson(`reports/${sessionId}.json`, output.report);
    this.writeJson(`transcripts/${sessionId}.utterances.json`, output.parse.utterances);
    this.writeJson(`transcripts/${sessionId}.errors.json`, output.parse.errors);
    this.updateSessionStatus(sessionId, 'analyzed');
    return output.report;
  }

  getReport(sessionId: string): AnalysisReport | null {
    return this.readJson<AnalysisReport | null>(`reports/${sessionId}.json`, null);
  }

  saveFeedback(input: AnalysisFeedbackInput): void {
    const feedback = this.readJson<AnalysisFeedbackInput[]>(FEEDBACK_FILE, []);
    feedback.push(input);
    this.writeJson(FEEDBACK_FILE, feedback);
    this.updateSessionStatus(input.sessionId, 'reviewed');
  }

  getStatus(): AppStatus {
    const sessions = this.listSessions();
    const analyzedSessions = sessions.filter(session =>
      ['analyzed', 'reviewed'].includes(session.status)
    ).length;
    return {
      sessionsLoaded: sessions.length,
      analyzedSessions,
      lastActivity: sessions.at(-1)?.updatedAt ?? '',
      warnings: this.countParseWarnings(sessions),
    };
  }

  private updateSessionStatus(sessionId: string, status: InterviewSession['status']) {
    const sessions = this.listSessions();
    const index = sessions.findIndex(session => session.id === sessionId);
    if (index === -1) return;
    sessions[index] = { ...sessions[index], status, updatedAt: new Date().toISOString() };
    this.writeJson(SESSIONS_FILE, sessions);
  }

  private countParseWarnings(sessions: InterviewSession[]): number {
    return sessions.reduce((count, session) => {
      const errors = this.readJson<unknown[]>(`transcripts/${session.id}.errors.json`, []);
      return count + errors.length;
    }, 0);
  }

  private readJson<T>(relativePath: string, fallback: T): T {
    const fullPath = path.join(this.dataDir, relativePath);
    if (!fs.existsSync(fullPath)) return fallback;
    return JSON.parse(fs.readFileSync(fullPath, 'utf-8')) as T;
  }

  private writeJson(relativePath: string, data: unknown): void {
    const fullPath = path.join(this.dataDir, relativePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf-8');
  }

  private readText(relativePath: string): string | null {
    const fullPath = path.join(this.dataDir, relativePath);
    if (!fs.existsSync(fullPath)) return null;
    return fs.readFileSync(fullPath, 'utf-8');
  }

  private writeText(relativePath: string, text: string): void {
    const fullPath = path.join(this.dataDir, relativePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, text, 'utf-8');
  }
}
