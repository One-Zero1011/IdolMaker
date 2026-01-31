
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // GitHub Pages 배포를 위한 상대 경로 설정
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // [수정] terser 대신 Vite에 내장되어 별도 설치가 필요 없는 esbuild를 사용합니다.
    minify: 'esbuild',
  },
});
