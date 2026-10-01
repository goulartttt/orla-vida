import { defineConfig, devices } from '@playwright/test';

// Testes ponta a ponta. Precisam do front (npm run dev) e da API (orla-vida-api) rodando,
// ou de E2E_URL apontando para um ambiente publicado.
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  reporter: 'list',
  use: {
    baseURL: process.env.E2E_URL ?? 'http://localhost:5173',
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    reducedMotion: 'reduce',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'celular', use: { ...devices['Pixel 7'] } },
  ],
});
