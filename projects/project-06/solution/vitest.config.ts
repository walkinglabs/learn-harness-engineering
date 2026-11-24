import { defineConfig } from 'vitest/config';

// vite.config.ts sets root to src/renderer for the UI bundle, so the test
// runner needs its own config rooted at the project directory.
export default defineConfig({
  test: {
    root: '.',
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    setupFiles: ['tests/setup.ts'],
    restoreMocks: true,
  },
});
