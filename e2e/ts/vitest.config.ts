import { defineConfig } from 'vitest/config';

// This file's existence, not its contents, stops Vitest walking up to the
// repository config. Keep the glob broad -- a single-file list silently ignores
// any spec added later -- Vitest's default exclude keeps node_modules out.
export default defineConfig({
  test: {
    include: ['**/*.spec.ts'],
  },
});
