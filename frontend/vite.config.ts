import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// The existing code reads REACT_APP_* variables from process.env.
// Expose only those to the browser bundle.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'REACT_APP_');
  const processEnv: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    processEnv[`process.env.${key}`] = JSON.stringify(value);
  }
  return {
    plugins: [react()],
    define: {
      ...processEnv,
      'process.env.REACT_APP_API_URL': JSON.stringify(env.REACT_APP_API_URL ?? ''),
      'process.env.REACT_APP_WS_URL': JSON.stringify(env.REACT_APP_WS_URL ?? ''),
      'process.env.REACT_APP_AI_WS_URL': JSON.stringify(env.REACT_APP_AI_WS_URL ?? ''),
    },
    server: { port: 3000 },
  };
});
