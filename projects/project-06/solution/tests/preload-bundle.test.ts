import { createRequire } from 'module';
import * as esbuild from 'esbuild';
import { describe, expect, it } from 'vitest';
import { IPC_CHANNELS } from '../src/shared/types';

const require = createRequire(import.meta.url);
const { options } = require('../scripts/build-preload.js') as { options: esbuild.BuildOptions };

/** Bundle the preload exactly as `npm run build` does, in memory. */
function bundlePreload(): string {
  const result = esbuild.buildSync({ ...options, write: false, logLevel: 'silent' });
  return result.outputFiles[0].text;
}

describe('preload bundle (Electron sandbox)', () => {
  // A sandboxed preload can only require('electron'). Any other require throws
  // at load time, contextBridge never runs and window.knowledgeBase is
  // undefined: the bug that left the capstone UI disconnected from main.
  it('requires nothing but electron', () => {
    const requires = [...bundlePreload().matchAll(/require\(\s*["']([^"']+)["']\s*\)/g)].map(m => m[1]);
    expect(new Set(requires)).toEqual(new Set(['electron']));
  });

  it('inlines every IPC channel name from shared/types', () => {
    const code = bundlePreload();
    for (const channel of Object.values(IPC_CHANNELS)) {
      expect(code).toContain(channel);
    }
  });

  it('exposes the API under window.knowledgeBase', () => {
    expect(bundlePreload()).toMatch(/exposeInMainWorld\(\s*["']knowledgeBase["']/);
  });
});
