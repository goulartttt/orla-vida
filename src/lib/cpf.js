export const somenteDigitos = (valor) => String(valor ?? '').replace(/\D/g, '');

function digitoVerificador(base) {
  let soma = 0;
  for (let i = 0; i < base.length; i++) soma += Number(base[i]) * (base.length + 1 - i);
  const resto = (soma * 10) % 11;
  return resto === 10 ? 0 : resto;
}

export function cpfValido(valor) {
  const cpf = somenteDigitos(valor);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  return digitoVerificador(cpf.slice(0, 9)) === Number(cpf[9]) && digitoVerificador(cpf.slice(0, 10)) === Number(cpf[10]);
}

/** Formata enquanto a pessoa digita: 52998 → 529.98 → … → 529.982.247-25 */
export function mascararDigitacao(valor) {
  const d = somenteDigitos(valor).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}
