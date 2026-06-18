import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.electron.spec.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage-electron',
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        'coverage-electron/',
        '**/*.electron.spec.js',
      ],
      include: [
        'main.js',
        'preload.js',
        'database/**/*.js',
      ],
    },
  },
});
