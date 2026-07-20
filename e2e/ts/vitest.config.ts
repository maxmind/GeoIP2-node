import { defineConfig } from 'vitest/config';

// Stops Vitest from walking up to the repository's config.
export default defineConfig({
  test: {
    include: ['index.spec.ts'],
  },
});
