import { defineConfig } from 'vitest/config';

// End-to-end tests launch the built Electron app (run `npm run build` first).
// They are slower than the unit suite and need a display (on headless Linux,
// run under xvfb-run), so they have their own config and npm script.
export default defineConfig({
  test: {
    root: '.',
    include: ['tests-e2e/**/*.e2e.ts'],
    environment: 'node',
    testTimeout: 60_000,
    hookTimeout: 60_000,
    fileParallelism: false,
  },
});
