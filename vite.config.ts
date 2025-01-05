import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8', // or 'istanbul'
      exclude: [
        '**/node_modules/**',
        '**/demo.ts',
        '**/index.ts',
        '**/dist/**',
        '**/config/**',
        '**/*.config.{js,ts}',
        '**/*.test.{js,ts,jsx,tsx}',
        '**/*.d.ts',
        '**/vars.helper.ts',
        '**/tests/**'
      ]
    }
  }
});
