# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 19 + JavaScript (TypeScript proibido por decisão do dono), Vite, Tailwind CSS v4, react-router, zod, sonner, lucide-react. API própria em repositório separado (`orla-vida-api`, Express + MongoDB). Deploy na Vercel com proxy `/api` para a API.

## Users

- **Dentro da ficção:** pessoa adulta (18 a 70 anos) que quer proteger a família financeiramente. Ela simula um seguro de vida, escolhe coberturas e capitais, define beneficiários, escolhe como pagar e contrata. Depois consulta e imprime a apólice.
- **Fora da ficção (público real):** recrutadores e potenciais clientes avaliando o portfólio do autor, quase sempre pela conta demo, em desktop ou celular, com poucos minutos de atenção.

## Product Purpose

Projeto de portfólio que simula uma seguradora de vida digital de ponta a ponta: cotação → proposta → apólice. Sucesso = um visitante entra com a conta demo, entende o fluxo sem instrução e sai com a impressão de um produto real, bem construído, seguro e acessível.

## Positioning

Seguradora de vida digital, fictícia, em que o próprio cliente monta o seguro sozinho, com cálculo transparente do prêmio em tempo real e linguagem sem juridiquês.

## Operating Context

- Fluxo principal: Home → Criar conta / Entrar / Conta demo → Painel → Nova cotação (segurado → coberturas → revisão) → Proposta (pagamento + beneficiários) → Apólice (detalhe e impressão).
- Cotações abertas podem ser editadas ou excluídas; efetivadas viram apólice imutável.
- A conta demo é temporária (24 h) e vem com uma cotação aberta e uma apólice de exemplo.

## Capabilities and Constraints

- Coberturas (catálogo fictício): Morte por qualquer causa (obrigatória), Invalidez permanente total por acidente, Antecipação por doença terminal, Assistência funeral. Cada uma tem capital mínimo/máximo e taxa anual fictícia; adicionais não podem ter capital maior que a principal.
- Prêmio anual = soma de capital × taxa. Vigência de 1 ano, início entre hoje e 60 dias. Segurado de 18 a 70 anos.
- Pagamento: à vista com 5% de desconto, ou de 2 a 12x sem juros com parcela mínima de R$ 20,00.
- Beneficiários: 1 a 5, percentuais inteiros somando 100%.
- Número da apólice: `ORL-AAAA-MM-NNNNNN`.
- Valores em dinheiro trafegam em centavos; datas como `AAAA-MM-DD` no fuso de Brasília.
- CPF sempre mascarado nas listas e apólices; completo só ao editar uma cotação aberta.
- Sessão por cookie httpOnly; o front nunca vê nem guarda token.
- Somente português do Brasil.

## Brand Commitments

- Nome: **Orla Vida**, empresa fictícia. Todo o site deve deixar claro que é um projeto de portfólio fictício.
- Tom de voz: acolhedor e direto, tratando por "você", frases curtas, termos de seguro explicados em linguagem simples.
- Proibido reutilizar qualquer elemento do projeto anterior (nome, logo, imagens, textos, paleta vermelho/laranja), que usava a identidade de uma empresa real.
- Sem fotos de pessoas.

## Evidence on Hand

Nenhuma prova real existe: não há clientes, depoimentos, números de mercado, prêmios, parceiros, CNPJ, SUSEP, endereços ou contatos. Nada disso pode ser inventado. Dados de exemplo devem ser obviamente fictícios ("Cliente Exemplo", CPFs de teste gerados por algoritmo).

## Product Principles

1. Transparência: o usuário sempre vê como o valor é calculado antes de decidir.
2. Nada de fingir ser real: ficção assumida, sem provas sociais inventadas.
3. Cada tela tem uma tarefa clara e um próximo passo óbvio.
4. Segurança e privacidade visíveis no produto (CPF mascarado, sessão segura), não só no código.
5. Funciona bem no celular tanto quanto no desktop.

## Accessibility & Inclusion

WCAG 2.2 AA: contraste, navegação completa por teclado, foco visível, labels associadas, mensagens de erro anunciadas, respeito a `prefers-reduced-motion`. Temas claro e escuro.
