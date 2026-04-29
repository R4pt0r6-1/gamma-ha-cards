import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    emptyOutDir: true,
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'gamma-ha-cards.js',
    },
    outDir: 'dist',
    sourcemap: true,
  },
});
