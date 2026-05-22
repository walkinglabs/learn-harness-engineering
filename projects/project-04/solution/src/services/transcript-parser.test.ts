import { describe, expect, it } from 'vitest';
import { parseTranscript } from './transcript-parser';

describe('parseTranscript', () => {
  it('parses timestamped bilingual speaker lines and derives end times', () => {
    const result = parseTranscript(
      [
        '[00:02] interviewer: 介绍一下你最近做的订单系统项目。',
        '[00:15] candidate: 这个项目主要是我们做了一个订单服务。',
        '[00:01:02.500] 面试官: 你具体负责哪一块？',
        '[00:01:10.250] 我: 嗯，主要是参与后端开发。',
      ].join('\n'),
      'session-1'
    );

    expect(result.errors).toEqual([]);
    expect(result.utterances).toMatchObject([
      {
        sessionId: 'session-1',
        speaker: 'interviewer',
        startMs: 2000,
        endMs: 15000,
        text: '介绍一下你最近做的订单系统项目。',
      },
      {
        speaker: 'candidate',
        startMs: 15000,
        endMs: 62500,
        text: '这个项目主要是我们做了一个订单服务。',
      },
      {
        speaker: 'interviewer',
        startMs: 62500,
        endMs: 70250,
        text: '你具体负责哪一块？',
      },
      {
        speaker: 'candidate',
        startMs: 70250,
        endMs: 72250,
        text: '嗯，主要是参与后端开发。',
      },
    ]);
  });

  it('keeps unparseable non-empty lines as errors', () => {
    const result = parseTranscript('[00:01] hr: 讲一下缓存。\nthis line is broken', 'session-2');

    expect(result.utterances).toHaveLength(1);
    expect(result.utterances[0].speaker).toBe('interviewer');
    expect(result.errors).toEqual([
      {
        lineNumber: 2,
        rawLine: 'this line is broken',
        reason: 'Line does not match "[timestamp] speaker: text"',
      },
    ]);
  });
});
