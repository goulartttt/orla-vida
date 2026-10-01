import { toast } from 'sonner';

// Todas as chamadas passam por /api no mesmo domínio do site. Assim o cookie de
// sessão (httpOnly) é enviado automaticamente e o front nunca toca no token.
const BASE = '/api';
const AVISO_DEMORA_MS = 4000;

export class ErroApi extends Error {
  constructor(status, mensagem, campos = []) {
    super(mensagem);
    this.status = status;
    this.campos = campos;
  }

  /** Erros por campo, no formato { 'segurado.cpf': 'CPF inválido.' }. */
  porCampo() {
    return Object.fromEntries(this.campos.map((c) => [c.campo, c.mensagem]));
  }
}

const ouvintesSessaoExpirada = new Set();

export function aoExpirarSessao(ouvinte) {
  ouvintesSessaoExpirada.add(ouvinte);
  return () => ouvintesSessaoExpirada.delete(ouvinte);
}

async function requisitar(metodo, caminho, corpo) {
  // Se o servidor estiver "acordando", avisa em vez de deixar a tela parada.
  const aviso = setTimeout(() => {
    toast.loading('Conectando ao servidor, só um instante…', { id: 'demora' });
  }, AVISO_DEMORA_MS);

  let resposta;
  try {
    resposta = await fetch(`${BASE}${caminho}`, {
      method: metodo,
      credentials: 'same-origin',
      headers: corpo === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch {
    throw new ErroApi(0, 'Não foi possível conectar. Verifique sua internet e tente de novo.');
  } finally {
    clearTimeout(aviso);
    toast.dismiss('demora');
  }

  if (resposta.status === 204) return null;

  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    if (resposta.status === 401 && !caminho.startsWith('/auth/')) {
      ouvintesSessaoExpirada.forEach((ouvinte) => ouvinte());
    }
    throw new ErroApi(resposta.status, dados.erro ?? 'Algo deu errado. Tente novamente.', dados.campos ?? []);
  }
  return dados;
}

export const api = {
  obter: (caminho) => requisitar('GET', caminho),
  enviar: (caminho, corpo) => requisitar('POST', caminho, corpo),
  atualizar: (caminho, corpo) => requisitar('PUT', caminho, corpo),
  remover: (caminho) => requisitar('DELETE', caminho),
};
