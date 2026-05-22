import { useCallback, useEffect, useState } from 'react';
import { AnalysisFeedbackInput, AnalysisReport, AppStatus, InterviewSession, Utterance } from '../types';
import { DebriefReportPanel } from './components/DebriefReportPanel';
import { EmptyState } from './components/EmptyState';
import { InterviewSessionSidebar } from './components/InterviewSessionSidebar';
import { StatusBar } from './components/StatusBar';
import { TranscriptTimeline } from './components/TranscriptTimeline';

const SAMPLE_TRANSCRIPT = `[00:02] interviewer: 介绍一下你最近做的订单系统项目。
[00:15] candidate: 嗯，这个项目主要是我们做了一个订单服务。
[00:38] interviewer: 你具体负责哪一块？
[00:45] candidate: 我参与后端开发，主要写了一些接口。
[01:05] interviewer: 指标提升是多少，怎么验证的？
[01:12] candidate: 当时效果还不错，具体指标我记不太清。
[01:35] interviewer: 如果 Redis 故障，幂等怎么兜底？
[01:44] candidate: 这个线上应该没问题，我们没有特别展开。`;

export function App() {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null);
  const [utterances, setUtterances] = useState<Utterance[]>([]);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [highlightedUtteranceId, setHighlightedUtteranceId] = useState<string | null>(null);
  const [status, setStatus] = useState<AppStatus>({
    sessionsLoaded: 0,
    analyzedSessions: 0,
    lastActivity: '',
    warnings: 0,
  });

  const refresh = useCallback(async () => {
    const nextSessions = await window.interviewCoach.listSessions();
    const nextStatus = await window.interviewCoach.getStatus();
    setSessions(nextSessions);
    setStatus(nextStatus);
    if (!selectedSession && nextSessions.length > 0) {
      setSelectedSession(nextSessions[0]);
    }
  }, [selectedSession]);

  useEffect(() => {
    refresh().catch(error => console.error('Failed to refresh sessions:', error));
  }, [refresh]);

  useEffect(() => {
    if (!selectedSession) return;
    Promise.all([
      window.interviewCoach.getTranscript(selectedSession.id),
      window.interviewCoach.getReport(selectedSession.id),
    ])
      .then(([nextUtterances, nextReport]) => {
        setUtterances(nextUtterances);
        setReport(nextReport);
      })
      .catch(error => console.error('Failed to load session:', error));
  }, [selectedSession]);

  const importSample = useCallback(async () => {
    const session = await window.interviewCoach.importTranscript({
      title: `Backend Mock ${sessions.length + 1}`,
      roleTarget: 'Backend Engineer',
      interviewType: 'project-deep-dive',
      transcriptText: SAMPLE_TRANSCRIPT,
    });
    setSelectedSession(session);
    await refresh();
  }, [refresh, sessions.length]);

  const analyzeSelected = useCallback(async () => {
    if (!selectedSession) return;
    const nextReport = await window.interviewCoach.analyzeSession(selectedSession.id);
    const nextUtterances = await window.interviewCoach.getTranscript(selectedSession.id);
    setReport(nextReport);
    setUtterances(nextUtterances);
    await refresh();
  }, [refresh, selectedSession]);

  const saveFeedback = useCallback(
    async (input: Omit<AnalysisFeedbackInput, 'sessionId' | 'reportId'>) => {
      if (!selectedSession || !report) return;
      await window.interviewCoach.saveFeedback({
        ...input,
        sessionId: selectedSession.id,
        reportId: report.id,
      });
      await refresh();
    },
    [refresh, report, selectedSession]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#10151f', color: '#eef2f7' }}>
      <header style={{ padding: '12px 20px', borderBottom: '1px solid #263244', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 18, margin: 0 }}>Interview Debrief Coach</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={importSample}>Import Sample Transcript</button>
          <button onClick={analyzeSelected} disabled={!selectedSession}>Analyze</button>
        </div>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: '280px minmax(360px, 1fr) minmax(360px, 420px)', minHeight: 0, flex: 1 }}>
        <InterviewSessionSidebar
          sessions={sessions}
          selectedId={selectedSession?.id ?? null}
          onSelect={setSelectedSession}
        />
        {selectedSession ? (
          <TranscriptTimeline
            utterances={utterances}
            highlightedUtteranceId={highlightedUtteranceId}
          />
        ) : (
          <EmptyState title="No interview selected" body="Import a transcript to start a local debrief." />
        )}
        <DebriefReportPanel
          report={report}
          onEvidenceClick={setHighlightedUtteranceId}
          onFeedback={saveFeedback}
        />
      </main>

      <StatusBar status={status} />
    </div>
  );
}
