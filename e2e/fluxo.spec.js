import { expect, test } from '@playwright/test';

const capturas = process.env.E2E_CAPTURAS; // pasta para salvar capturas de tela (opcional)

async function capturar(page, info, nome) {
  if (!capturas) return;
  await page.screenshot({ path: `${capturas}/${info.project.name}-${nome}.png`, fullPage: true });
}

test('visitante faz o caminho inteiro com a conta demo', async ({ page }, info) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Seu seguro de vida, montado por você.');

  // A Apólice Viva recalcula ao mexer no capital.
  await page.getByLabel('Quanto sua família recebe').fill('500000');
  const simulacao = page.getByRole('region', { name: 'Simulação de seguro de vida' });
  await expect(simulacao.getByText('R$ 500.000', { exact: true })).toBeVisible();
  await capturar(page, info, 'home');

  await page.getByRole('button', { name: 'Entrar com conta demo' }).first().click();
  await expect(page).toHaveURL(/\/painel$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Olá, Visitante.');
  await expect(page.getByText('Cliente Exemplo')).toBeVisible();
  await capturar(page, info, 'painel');

  // Nova cotação em três etapas.
  await page.getByRole('link', { name: 'Nova cotação' }).click();
  await page.getByLabel('Nome completo').fill('Segurada de Teste');
  await page.getByLabel('CPF').fill('52998224725');
  await page.getByLabel('Data de nascimento').fill('1990-05-20');
  await capturar(page, info, 'cotacao-segurado');
  await page.getByRole('button', { name: 'Continuar para coberturas' }).click();

  await page.getByLabel('Assistência funeral').check();
  await capturar(page, info, 'cotacao-coberturas');
  await page.getByRole('button', { name: 'Revisar cotação' }).click();
  await expect(page.getByText('Segurada de Teste')).toBeVisible();
  await page.getByRole('button', { name: 'Salvar cotação' }).click();
  await expect(page).toHaveURL(/\/cotacoes\/\d+$/);
  await capturar(page, info, 'cotacao-detalhe');

  // Contratar: pagamento + beneficiário + aceite.
  await page.getByRole('link', { name: 'Contratar' }).first().click();
  await page.getByLabel('Nome do beneficiário 1').fill('Beneficiária de Teste');
  await page.getByLabel('Parentesco').selectOption('conjuge');
  await page.getByLabel(/Entendo que a Orla Vida é fictícia/).check();
  await capturar(page, info, 'contratar');
  await page.getByRole('button', { name: 'Emitir apólice' }).click();

  await expect(page).toHaveURL(/\/apolices\/ORL-\d{4}-\d{2}-\d{6}$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Apólice emitida.');
  await expect(page.getByText('Beneficiária de Teste')).toBeVisible();
  await capturar(page, info, 'apolice');

  await page.getByRole('link', { name: 'Apólices' }).first().click();
  await expect(page.getByText('Segurada de Teste')).toBeVisible();
});

test('tema escuro e página não encontrada', async ({ page }, info) => {
  await page.addInitScript(() => localStorage.setItem('orla-tema', 'escuro'));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'escuro');
  const simulacao = page.getByRole('region', { name: 'Simulação de seguro de vida' });
  await expect(simulacao.getByText('R$ 300.000', { exact: true })).toBeVisible();
  await capturar(page, info, 'home-escuro');

  await page.goto('/endereco-que-nao-existe');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Esta página não está no arquivo.');
  await capturar(page, info, '404-escuro');
});

test('área logada exige login', async ({ page }) => {
  await page.goto('/cotacoes');
  await expect(page).toHaveURL(/\/entrar$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Entrar');
});
