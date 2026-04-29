import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    emptyOutDir: true,
    lib: {
      entry: 'src/glow-light-card.ts',
      formats: ['es'],
      fileName: () => 'glow-light-card.js',
    },
    outDir: 'dist',
    sourcemap: true,
  },
});
