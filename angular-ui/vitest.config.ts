import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/services/**/*.spec.ts'],
    exclude: [
      'node_modules/',
      'dist/',
      'src/app/**/*.spec.ts',
      '*.electron.spec.mjs',
      'database/*.electron.spec.mjs',
    ],
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/*.spec.js',
        '**/*.test.js',
        '*.electron.spec.mjs',
        'database/*.electron.spec.mjs',
        'src/main.ts',
        'src/main.server.ts',
        'src/server.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.ts', '.js', '.mjs', '.html', '.css'],
  },
});
