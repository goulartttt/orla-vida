import { somarMeses } from './datas.js';

// Cópia da regra de cálculo da API (orla-vida-api/src/dominio/premio.js), usada só
// para a PRÉVIA ao vivo. O valor oficial é sempre o que a API devolve.
// As regras numéricas (desconto, parcelas, parcela mínima) vêm de GET /coberturas.

export function premioCoberturaCentavos(capital, taxaAnual) {
  return Math.round(capital * taxaAnual * 100);
}

export function parcelasDisponiveis(premioAnualCentavos, regras) {
  return Math.min(regras.parcelasMaximas, Math.floor(premioAnualCentavos / regras.parcelaMinimaCentavos));
}

/** Simula o pagamento. Devolve null quando a combinação não é permitida. */
export function simularPagamento(premioAnualCentavos, parcelas, regras) {
  if (parcelas <= 1) {
    const totalCentavos = Math.round(premioAnualCentavos * (1 - regras.descontoAVista));
    return {
      forma: 'avista',
      parcelas: 1,
      totalCentavos,
      valorParcelaCentavos: totalCentavos,
      primeiraParcelaCentavos: totalCentavos,
      descontoCentavos: premioAnualCentavos - totalCentavos,
    };
  }
  if (parcelas > parcelasDisponiveis(premioAnualCentavos, regras)) return null;

  const valorParcelaCentavos = Math.floor(premioAnualCentavos / parcelas);
  return {
    forma: 'parcelado',
    parcelas,
    totalCentavos: premioAnualCentavos,
    valorParcelaCentavos,
    primeiraParcelaCentavos: premioAnualCentavos - valorParcelaCentavos * (parcelas - 1),
    descontoCentavos: 0,
  };
}

/** Lista de canhotos do carnê: um por parcela, vencendo mês a mês a partir do início. */
export function montarCanhotos(pagamento, inicioVigencia) {
  return Array.from({ length: pagamento.parcelas }, (_, i) => ({
    numero: i + 1,
    total: pagamento.parcelas,
    vencimento: somarMeses(inicioVigencia, i),
    valorCentavos: i === 0 ? pagamento.primeiraParcelaCentavos : pagamento.valorParcelaCentavos,
  }));
}
