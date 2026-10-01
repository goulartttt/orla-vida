// Mesmas regras de data da API: texto AAAA-MM-DD e "hoje" no horário de Brasília.
const formatoISO = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Sao_Paulo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const hoje = (agora = new Date()) => formatoISO.format(agora);

const partes = (data) => data.split('-').map(Number);
const iso = (d) => d.toISOString().slice(0, 10);

export function somarDias(data, dias) {
  const [ano, mes, dia] = partes(data);
  return iso(new Date(Date.UTC(ano, mes - 1, dia + dias)));
}

/** Soma meses mantendo o dia; se o mês não tiver esse dia, usa o último. */
export function somarMeses(data, meses) {
  const [ano, mes, dia] = partes(data);
  const resultado = new Date(Date.UTC(ano, mes - 1 + meses, 1));
  const ultimoDia = new Date(Date.UTC(resultado.getUTCFullYear(), resultado.getUTCMonth() + 1, 0)).getUTCDate();
  resultado.setUTCDate(Math.min(dia, ultimoDia));
  return iso(resultado);
}

export const somarAnos = (data, anos) => somarMeses(data, anos * 12);

export function idadeEm(nascimento, referencia) {
  const [anoN, mesN, diaN] = partes(nascimento);
  const [anoR, mesR, diaR] = partes(referencia);
  let idade = anoR - anoN;
  if (mesR < mesN || (mesR === mesN && diaR < diaN)) idade--;
  return idade;
}
