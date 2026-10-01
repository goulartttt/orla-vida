# Orla Vida · front

Interface web da **Orla Vida**, uma seguradora de vida **fictícia** criada como projeto de portfólio. O visitante simula um seguro, monta uma cotação, contrata e imprime a apólice, de ponta a ponta.

> **Aviso:** a Orla Vida não existe. Não há CNPJ, registro, atendimento, contrato ou seguro real. Coberturas, taxas e valores foram inventados para demonstração, e todos os dados de exemplo são fictícios.

A API fica em outro repositório: [orla-vida-api](https://github.com/goulartttt/orla-vida-api).

## O que dá para fazer

- **Simular na Home:** a "Apólice Viva" recalcula o prêmio e o carnê enquanto você mexe no capital, nas coberturas e nas parcelas. O valor que mudou fica destacado.
- **Entrar com a conta demo:** acesso sem cadastro, já com uma cotação e uma apólice de exemplo. A conta é apagada sozinha em 24 horas.
- **Criar conta e entrar**, com sessão segura em cookie.
- **Painel** com o resumo das cotações em aberto e das apólices ativas.
- **Cotação em 3 etapas** (segurado → coberturas → revisão), com várias coberturas e prêmio calculado ao vivo. Cotações em aberto podem ser editadas ou excluídas.
- **Contratar:** escolher entre à vista (5% de desconto) ou 2 a 12 parcelas sem juros, e definir até 5 beneficiários somando 100%.
- **Apólice** com número próprio, carnê de parcelas e versão para impressão.
- **Tema claro e escuro**, layout pensado primeiro para o celular.

## Tecnologias

- React 19 e JavaScript (sem TypeScript)
- Vite 8
- Tailwind CSS 4
- React Router
- Fonte Archivo, hospedada no próprio site
- Ícones Lucide e avisos com Sonner
- Testes com Vitest + Testing Library (unidade) e Playwright (ponta a ponta)
- Lint com oxlint e formatação com Prettier

## Como rodar

Pré-requisitos: Node.js 22 ou mais novo e a [API](https://github.com/goulartttt/orla-vida-api) rodando em `http://localhost:3001`.

```bash
npm install
npm run dev
```

O site abre em `http://localhost:5173`. Em desenvolvimento, as chamadas para `/api` são repassadas para a API local (veja `vite.config.js`). Se a porta 5173 estiver ocupada, use `npm run dev -- --port 5180`.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm test` | Testes de unidade e de componentes |
| `npm run test:e2e` | Testes ponta a ponta (precisam do front e da API rodando) |
| `npm run lint` | Lint com oxlint |
| `npm run format` | Formata o código com Prettier |

Os testes ponta a ponta percorrem o caminho inteiro do visitante no desktop e no celular. Para apontar para outro endereço, use a variável `E2E_URL`. Para salvar capturas de tela, informe uma pasta em `E2E_CAPTURAS`.

## Como o front fala com a API

O navegador chama sempre `/api/...` **no mesmo domínio do site**. Na Vercel, a função [`api/proxy.js`](api/proxy.js) repassa essas chamadas para a API. Isso permite usar um cookie de sessão `httpOnly` e `SameSite=Lax`, que os scripts da página não conseguem ler e que funciona até em navegadores que bloqueiam cookies de terceiros.

O proxy também envia o IP do visitante para a API, assinado com um segredo compartilhado (`PROXY_SECRET`), para que o limite de tentativas de login valha por pessoa e não para todos juntos.

## Segurança no front

- Não existe token no `localStorage`: a sessão fica só no cookie `httpOnly`.
- A Content-Security-Policy em [`vercel.json`](vercel.json) só libera scripts do próprio site, mais o script de tema pelo hash. Um teste confere que o hash continua batendo com o `index.html`.
- Headers `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `HSTS` e `nosniff`.
- O CPF chega mascarado nas listas e na apólice. Completo, só ao editar uma cotação em aberto do próprio usuário.

## Acessibilidade

- Labels ligadas aos campos, erros anunciados e associados por `aria-describedby`
- Foco levado ao título a cada troca de página e link "Pular para o conteúdo"
- Região `aria-live` para os valores recalculados
- Navegação completa por teclado com foco visível
- Contraste AA nos dois temas e respeito a `prefers-reduced-motion`

## Deploy na Vercel

1. Importe este repositório na Vercel (preset **Vite**).
2. Em **Settings → Git**, defina `prd-v1.0` como *Production Branch*. A branch `hml-v1.0` vira o ambiente de homologação.
3. Em **Settings → Environment Variables**, configure:

| Variável | Valor |
| --- | --- |
| `API_URL` | Endereço da API do mesmo ambiente (produção ou homologação) |
| `PROXY_SECRET` | O mesmo valor configurado na API |

## Estrutura

```
api/proxy.js          repasse /api/* → API (função da Vercel)
e2e/                  testes ponta a ponta (Playwright)
src/
  componentes/        peças de interface (folha, carimbo, canhotos, campos…)
  contexto/           sessão do usuário
  hooks/              busca de dados, catálogo, tema, marca-texto
  lib/                API, formatação, datas, CPF e prévia do prêmio
  pages/              uma tela por arquivo
  styles/global.css   tokens de cor e tipografia, temas claro e escuro
docs/                 notas do projeto
PRODUCT.md            o que o produto é e quais regras não podem ser quebradas
```

## Versões

- `hml-v1.0`: homologação, onde tudo é testado primeiro.
- `prd-v1.0`: produção, só recebe o que foi aprovado em homologação.
