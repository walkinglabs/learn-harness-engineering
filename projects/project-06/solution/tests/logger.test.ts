import { afterEach, describe, expect, it, vi } from 'vitest';
import { loggedEntries } from './helpers';

// The logger singleton reads LOG_LEVEL once, at import time. Each test sets the
// variable and imports a fresh copy of the module.
async function loadLogger(level?: string) {
  if (level === undefined) {
    delete process.env.LOG_LEVEL;
  } else {
    process.env.LOG_LEVEL = level;
  }
  vi.resetModules();
  return import('../src/services/logger');
}

const ORIGINAL_LEVEL = process.env.LOG_LEVEL;

afterEach(() => {
  if (ORIGINAL_LEVEL === undefined) {
    delete process.env.LOG_LEVEL;
  } else {
    process.env.LOG_LEVEL = ORIGINAL_LEVEL;
  }
});

describe('logger', () => {
  it('emits one JSON line with timestamp, level, service and message', async () => {
    const { logger } = await loadLogger();
    logger.info('test-service', 'Something happened', { documentId: 'abc', durationMs: 12 });

    const [entry] = loggedEntries(vi.mocked(console.log));
    expect(entry).toMatchObject({
      level: 'INFO',
      service: 'test-service',
      message: 'Something happened',
      data: { documentId: 'abc', durationMs: 12 },
    });
    expect(new Date(String(entry.timestamp)).toISOString()).toBe(entry.timestamp);
  });

  it('omits the data field when no payload, or an empty one, is given', async () => {
    const { logger } = await loadLogger();
    logger.info('svc', 'no payload');
    logger.info('svc', 'empty payload', {});

    for (const entry of loggedEntries(vi.mocked(console.log))) {
      expect(entry).not.toHaveProperty('data');
    }
  });

  it('routes WARN to console.warn and ERROR to console.error', async () => {
    const { logger } = await loadLogger();
    logger.debug('svc', 'debug line');
    logger.warn('svc', 'warn line');
    logger.error('svc', 'error line');

    expect(loggedEntries(vi.mocked(console.log)).map(e => e.level)).toEqual(['DEBUG']);
    expect(loggedEntries(vi.mocked(console.warn)).map(e => e.level)).toEqual(['WARN']);
    expect(loggedEntries(vi.mocked(console.error)).map(e => e.level)).toEqual(['ERROR']);
  });

  it('drops entries below LOG_LEVEL', async () => {
    const { logger } = await loadLogger('WARN');
    logger.debug('svc', 'dropped');
    logger.info('svc', 'dropped');
    logger.warn('svc', 'kept');
    logger.error('svc', 'kept');

    expect(console.log).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('forService() tags every entry with the service name', async () => {
    const { logger } = await loadLogger();
    const log = logger.forService('indexing-service');
    log.info('a');
    log.debug('b', { n: 1 });

    const entries = loggedEntries(vi.mocked(console.log));
    expect(entries.map(e => e.service)).toEqual(['indexing-service', 'indexing-service']);
    expect(entries[1].data).toEqual({ n: 1 });
  });
});
