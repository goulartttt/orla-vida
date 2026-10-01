// Função da Vercel que repassa /api/* para a API (repositório orla-vida-api).
// Assim o site e a API ficam no mesmo domínio e o cookie de sessão (httpOnly,
// SameSite=Lax) funciona em qualquer navegador, inclusive os que bloqueiam
// cookies de terceiros. Variáveis: API_URL (obrigatória) e PROXY_SECRET.

const CABECALHOS_DE_ENTRADA = ['accept', 'content-type', 'cookie', 'user-agent'];
const CABECALHOS_DESCARTADOS = new Set([
  'connection',
  'content-encoding',
  'content-length',
  'keep-alive',
  'set-cookie',
  'transfer-encoding',
]);
const CAMINHO_PERMITIDO = /^[A-Za-z0-9/_.-]*$/;

/**
 * Monta a URL de destino na API. Recusa (devolve null) qualquer caminho que
 * pudesse escapar do domínio da API, como "//outro-site.com" ou "../".
 */
export function montarDestino(caminho, base, busca = '') {
  if (!CAMINHO_PERMITIDO.test(caminho) || caminho.includes('..')) return null;
  const origem = new URL(base);
  const destino = new URL(`/${caminho.replace(/^\/+/, '')}`, origem);
  if (destino.origin !== origem.origin) return null;
  destino.search = busca;
  return destino;
}

async function repassar(request) {
  const base = process.env.API_URL;
  if (!base) return Response.json({ erro: 'O site está sem a configuração da API.' }, { status: 500 });

  const url = new URL(request.url);
  const caminho = url.searchParams.get('caminho') ?? '';
  url.searchParams.delete('caminho');
  const destino = montarDestino(caminho, base, url.searchParams.toString());
  if (!destino) return Response.json({ erro: 'Rota não encontrada.' }, { status: 404 });

  const cabecalhos = new Headers();
  for (const nome of CABECALHOS_DE_ENTRADA) {
    const valor = request.headers.get(nome);
    if (valor) cabecalhos.set(nome, valor);
  }

  // O IP do visitante segue num cabeçalho próprio, "assinado" com um segredo que só
  // o proxy e a API conhecem. Sem isso, a API veria todos com o IP do proxy e o
  // limite de tentativas valeria para todo mundo junto.
  const ip = request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (ip && process.env.PROXY_SECRET) {
    cabecalhos.set('x-orla-ip', ip);
    cabecalhos.set('x-orla-proxy', process.env.PROXY_SECRET);
  }

  const temCorpo = request.method !== 'GET' && request.method !== 'HEAD';
  let resposta;
  try {
    resposta = await fetch(destino, {
      method: request.method,
      headers: cabecalhos,
      body: temCorpo ? await request.arrayBuffer() : undefined,
      redirect: 'manual',
    });
  } catch {
    return Response.json({ erro: 'A API não respondeu. Tente novamente em instantes.' }, { status: 502 });
  }

  const saida = new Headers();
  resposta.headers.forEach((valor, nome) => {
    if (!CABECALHOS_DESCARTADOS.has(nome)) saida.set(nome, valor);
  });
  for (const cookie of resposta.headers.getSetCookie()) saida.append('set-cookie', cookie);

  const semCorpo = resposta.status === 204 || resposta.status === 304;
  return new Response(semCorpo ? null : resposta.body, { status: resposta.status, headers: saida });
}

export { repassar as DELETE, repassar as GET, repassar as PATCH, repassar as POST, repassar as PUT };
