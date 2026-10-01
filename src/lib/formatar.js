const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const moedaInteira = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const porcentagem = new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 2 });
const dataHoraBr = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

/** Centavos → "R$ 1.234,56" */
export const reais = (centavos) => moeda.format(centavos / 100);

/** Reais inteiros → "R$ 300.000" */
export const reaisInteiros = (valor) => moedaInteira.format(valor);

/** Fração → "0,3%" */
export const taxa = (fracao) => porcentagem.format(fracao);

/** "2026-10-01" → "01/10/2026" */
export function data(iso) {
  if (!iso) return '';
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

export const dataHora = (instante) => dataHoraBr.format(new Date(instante));

export const doisDigitos = (n) => String(n).padStart(2, '0');

export const plural = (n, singular, pluralForma) => `${n} ${n === 1 ? singular : pluralForma}`;
