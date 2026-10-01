# Sistema original (Seguro X) e o que mudou

Este documento registra a lógica do projeto que deu origem à Orla Vida, para referência histórica. O projeto original usava a identidade visual e os textos de uma empresa real; **nada disso foi reaproveitado**, e nenhum dado dessa empresa aparece aqui.

## Como o sistema original funcionava

Um front em React (Create React App, Bootstrap) consumia uma API em Express com MongoDB e JWT.

**Fluxo:** cadastro → login → cotação → proposta → apólice.

| Tela antiga | Endpoint antigo | O que fazia |
| --- | --- | --- |
| Cadastro / Login | `POST /users/cadastro`, `POST /users/login` | Conta com nome, username e senha; o token JWT ficava no `localStorage` |
| Criação de cotação | `GET /coberturas`, `POST /cotacao/cadastro` | Nome, CPF, início e fim de vigência (5 a 10 anos), **uma** cobertura e valor de risco |
| Lista de cotações | `GET /listaCotacao` | Lista com selo "Efetivado" |
| Editar / visualizar cotação | `GET /obterDadosCotacao/:n`, `POST /salvarEdicao` | Um único componente para os dois modos |
| Proposta | `GET /proposta/:n`, `POST /apolice` | Forma de pagamento à vista ou 2 a 12x |
| Lista e detalhe de apólices | `GET /listaApolice`, `GET /obterDadosApolice/:num` | Número no formato `APO.AAAA.MM.NNNN` |

## Problemas encontrados e como a Orla Vida resolve

| No original | Na Orla Vida |
| --- | --- |
| "Pagamento" cobrava o **valor de risco** (o capital segurado), e à vista saía 5% mais caro | Prêmio = capital × taxa; à vista tem 5% de **desconto** |
| `uid` único em cotação e apólice: **cada usuário só podia ter uma cotação** | Várias cotações por usuário; a regra de duplicidade vale só para apólices com vigências sobrepostas |
| Qualquer usuário logado lia a cotação ou a apólice de outro, sabendo o número | Toda busca filtra pelo dono; quem não é dono recebe 404 |
| Número da apólice com "00" fixo antes do mês (`2023.0010` em outubro) | `ORL-AAAA-MM-NNNNNN` com mês de dois dígitos e contador atômico |
| Numeração por `countDocuments() + 1`, sujeita a colisão | Contador atômico no MongoDB |
| Token JWT no `localStorage`, exposto a XSS | Cookie `httpOnly` via proxy no mesmo domínio |
| CPF salvo em texto puro | CPF cifrado com AES-256-GCM + índice HMAC; mascarado nas telas |
| Validação do valor de risco recebia o nome da cobertura em vez do valor | Validação no cliente e no servidor, com mensagens por campo |
| Só uma cobertura por cotação | Várias coberturas, cada uma com o próprio capital |
| Larguras fixas em pixels, sem versão para celular | Layout pensado primeiro para o celular, com barra de abas no rodapé |
| Labels soltas, login por `onClick` e sem foco gerenciado | Formulários acessíveis, foco gerenciado e avisos anunciados |
| Create React App (descontinuado) e dependências sem uso | Vite, dependências enxutas, testes de unidade, de API e ponta a ponta |
