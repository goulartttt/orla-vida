import { describe, expect, it } from 'vitest';
import { montarCanhotos, parcelasDisponiveis, premioCoberturaCentavos, simularPagamento } from './premio.js';

const regras = { descontoAVista: 0.05, parcelasMaximas: 12, parcelaMinimaCentavos: 2000 };

describe('prévia do prêmio (mesma regra da API)', () => {
  it('calcula capital × taxa em centavos', () => {
    expect(premioCoberturaCentavos(300_000, 0.003)).toBe(90_000);
  });

  it('à vista dá 5% de desconto', () => {
    expect(simularPagamento(90_000, 1, regras)).toMatchObject({ forma: 'avista', totalCentavos: 85_500, descontoCentavos: 4_500 });
  });

  it('parcelado divide sem juros e põe a sobra na primeira parcela', () => {
    expect(simularPagamento(10_001, 3, regras)).toMatchObject({
      totalCentavos: 10_001,
      valorParcelaCentavos: 3_333,
      primeiraParcelaCentavos: 3_335,
    });
  });

  it('recusa mais parcelas do que o valor permite', () => {
    expect(parcelasDisponiveis(10_000, regras)).toBe(5);
    expect(simularPagamento(10_000, 6, regras)).toBeNull();
  });

  it('monta um canhoto por parcela, vencendo mês a mês', () => {
    const canhotos = montarCanhotos(simularPagamento(12_000, 3, regras), '2026-01-31');
    expect(canhotos.map((c) => c.vencimento)).toEqual(['2026-01-31', '2026-02-28', '2026-03-31']);
    expect(canhotos.map((c) => c.valorCentavos)).toEqual([4_000, 4_000, 4_000]);
  });
});
