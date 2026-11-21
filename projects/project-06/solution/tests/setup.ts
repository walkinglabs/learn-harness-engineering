import { beforeEach, vi } from 'vitest';

// Services log every operation as JSON to the console. Silence that output so
// test results stay readable; the spies still record calls, so tests can
// assert on log entries through console.log / console.warn / console.error.
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
