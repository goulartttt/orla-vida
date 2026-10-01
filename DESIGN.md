---
name: Orla Vida
description: Seguradora de vida fictícia em forma de carnê de cooperativa litorânea, com papel vivo e cálculo à vista.
colors:
  fundo: "oklch(0.955 0.019 86)"
  folha: "oklch(0.988 0.009 90)"
  folha-funda: "oklch(0.935 0.02 88)"
  tinta: "oklch(0.27 0.045 228)"
  tinta-suave: "oklch(0.44 0.04 222)"
  fio: "oklch(0.83 0.025 205)"
  fio-forte: "oklch(0.62 0.03 215)"
  capa: "oklch(0.4 0.072 176)"
  capa-funda: "oklch(0.33 0.06 182)"
  capa-tinta: "oklch(0.965 0.02 92)"
  capa-suave: "oklch(0.87 0.035 150)"
  capa-fio: "oklch(0.55 0.06 172)"
  mar: "oklch(0.42 0.08 174)"
  mar-forte: "oklch(0.35 0.07 178)"
  petroleo: "oklch(0.38 0.06 228)"
  sol: "oklch(0.86 0.15 92)"
  sol-forte: "oklch(0.8 0.16 88)"
  sol-tinta: "oklch(0.25 0.045 228)"
  ameixa: "oklch(0.46 0.15 345)"
  marca: "oklch(0.91 0.13 96)"
typography:
  display:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.1rem, 9vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.88
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 66"
  headline:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 5vw, 3.6rem)"
    fontWeight: 800
    lineHeight: 0.95
    fontVariation: "'wdth' 66"
  title:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 6vw, 3.8rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 66"
  figure:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1
    fontFeature: "'tnum'"
    fontVariation: "'wdth' 66"
  body:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "'tnum'"
  button:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    letterSpacing: "0.015em"
    fontVariation: "'wdth' 78"
  label:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 650
    letterSpacing: "0.09em"
    fontVariation: "'wdth' 78"
  stamp:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.12em"
    fontVariation: "'wdth' 70"
rounded:
  marca-texto: "2px"
  controle: "4px"
  entrada: "4px 4px 2px 2px"
  documento: "6px"
  trilho: "999px"
spacing:
  calha: "20px"
  calha-larga: "32px"
  folha: "20px"
  folha-larga: "28px"
  secao: "80px"
  container: "72rem"
components:
  button-sol:
    backgroundColor: "{colors.sol}"
    textColor: "{colors.sol-tinta}"
    typography: "{typography.button}"
    rounded: "{rounded.controle}"
    padding: "0 20px"
    height: "44px"
  button-sol-hover:
    backgroundColor: "{colors.sol-forte}"
  button-mar:
    backgroundColor: "{colors.mar}"
    textColor: "{colors.folha}"
    typography: "{typography.button}"
    rounded: "{rounded.controle}"
    padding: "0 20px"
    height: "44px"
  button-mar-hover:
    backgroundColor: "{colors.mar-forte}"
  button-contorno:
    backgroundColor: "{colors.folha}"
    textColor: "{colors.tinta}"
    typography: "{typography.button}"
    rounded: "{rounded.controle}"
    padding: "0 20px"
    height: "44px"
  button-contorno-hover:
    backgroundColor: "{colors.folha-funda}"
  button-capa:
    textColor: "{colors.capa-tinta}"
    typography: "{typography.button}"
    rounded: "{rounded.controle}"
    padding: "0 20px"
    height: "44px"
  button-capa-hover:
    backgroundColor: "{colors.capa-funda}"
  button-perigo:
    backgroundColor: "{colors.ameixa}"
    textColor: "{colors.folha}"
    typography: "{typography.button}"
    rounded: "{rounded.controle}"
    padding: "0 20px"
    height: "44px"
  entrada:
    backgroundColor: "{colors.folha}"
    textColor: "{colors.tinta}"
    typography: "{typography.body}"
    rounded: "{rounded.entrada}"
    padding: "10px 12px"
    height: "46px"
  entrada-desabilitada:
    backgroundColor: "{colors.folha-funda}"
    textColor: "{colors.tinta-suave}"
  folha:
    backgroundColor: "{colors.folha}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.documento}"
  canhotos:
    backgroundColor: "{colors.folha-funda}"
    rounded: "{rounded.controle}"
    padding: "10px 12px"
  carimbo-sol:
    backgroundColor: "{colors.sol}"
    textColor: "{colors.sol-tinta}"
    typography: "{typography.stamp}"
    rounded: "{rounded.controle}"
  carimbo-apagado:
    textColor: "{colors.tinta-suave}"
    typography: "{typography.stamp}"
    rounded: "{rounded.controle}"
  carimbo-capa:
    textColor: "{colors.sol}"
    typography: "{typography.stamp}"
    rounded: "{rounded.controle}"
  nav-capa-ativo:
    backgroundColor: "{colors.capa-tinta}"
    textColor: "{colors.capa}"
    typography: "{typography.button}"
    rounded: "{rounded.controle}"
    padding: "8px 14px"
  aviso-ficticio:
    backgroundColor: "{colors.sol}"
    textColor: "{colors.sol-tinta}"
    padding: "6px 16px"
---

# Design System: Orla Vida

## Overview

**Creative North Star: "O Carnê da Cooperativa"**

A Orla Vida é um carnê de cooperativa de cidade litorânea posto para funcionar na tela. Seguro de vida é papel (cotação, proposta, apólice, carnê), e o sistema mostra esse papel vivo e legível em vez de fotos de família, escudos ou gradientes de fintech. A capa verde-mar ocupa regiões inteiras (cabeçalho, hero, chamada final, rodapé); sobre ela pousam folhas cor de areia escritas em tinta azul-petróleo, com carimbos amarelo-sol, picotes tracejados e canhotos destacáveis.

A densidade é a de um formulário impresso: campos rotulados em versalete condensado, valores em algarismos tabulares, fios de 1px dividindo tudo, um único grotesco variável (Archivo) que se estreita para rótulos e títulos e se abre para o texto corrido. O que muda (prêmio, parcela, total) fica marcado com marca-texto amarelo até a próxima interação. O tema escuro é o mar à noite: puxado para o verde da capa, nunca para o cinza.

A identidade recusa vermelho e laranja por compromisso de marca (paleta do projeto anterior) e não usa fotos de pessoas. A única curva orgânica do sistema é a linha de costa, presente só na marca e no fio que separa a capa da areia.

**Key Characteristics:**
- Capa verde-mar em blocos de largura total; folhas de areia como recipiente de todo conteúdo.
- Um só tipo (Archivo Variable) em três larguras: 66% para títulos e números, 78% para rótulos e botões, 100% para texto.
- Algarismos tabulares em todo o corpo; valores grandes condensados e extra-negritos.
- Vocabulário de papelaria: rótulo, picote, canhoto, carimbo inclinado, marca-texto.
- Cantos quase retos (4px nos controles, 6px nas folhas).
- Amarelo-sol é o único acento quente; erro é ameixa, nunca vermelho.

## Colors

Uma paleta de papelaria litorânea: areia e tinta petróleo para o documento, verde-mar para a capa, amarelo-sol para o que é oficial ou acabou de mudar. Todos os valores são OKLCH; o tema escuro redefine os mesmos nomes sob `[data-tema='escuro']` (valores no sidecar).

### Primary
- **Verde-Mar da Capa** (`capa`): a capa do carnê. Cabeçalhos, hero da Home, chamada final e cabeçalho da apólice. Sempre em região inteira, nunca como botão pequeno.
- **Capa Funda** (`capa-funda`): rodapé e estado hover de itens sobre a capa.
- **Tinta da Capa / Capa Suave / Fio da Capa** (`capa-tinta`, `capa-suave`, `capa-fio`): texto principal, texto secundário e contornos sobre a capa.
- **Verde-Mar de Ação** (`mar`, `mar-forte` no hover): botão de ação padrão, links de texto, preenchimento da régua, checkboxes, ícones de destaque, cursor de texto e foco das entradas.

### Secondary
- **Amarelo-Sol** (`sol`, `sol-forte` no hover): o acento oficial. Botão primário de conversão, carimbo cheio de status vigente, faixa de aviso fictício, polegar da régua, ponto do sol na marca, seleção de texto e anel de foco sobre a capa e no tema escuro. Texto sobre o sol é sempre `sol-tinta`.
- **Marca-Texto** (`marca`): o véu amarelo atrás de valores que acabaram de mudar. No escuro vira sol translúcido (32%).

### Tertiary
- **Ameixa** (`ameixa`): erro de validação, alerta de formulário e ação destrutiva. Substitui o vermelho.
- **Petróleo** (`petroleo`): azul de tinta reservado para detalhes de documento; usado com parcimônia.

### Neutral
- **Areia** (`fundo`): o fundo da página, e a cor dos furos do picote.
- **Papel** (`folha`): superfície de toda folha, campo e menu de abas no celular.
- **Papel Envelhecido** (`folha-funda`): faixas de seção alternadas, tira de canhotos, campos somente-leitura, rodapé da apólice.
- **Tinta Petróleo** (`tinta`) e **Tinta Suave** (`tinta-suave`): texto principal e secundário (dicas, legendas, rótulos).
- **Fio** (`fio`) e **Fio Forte** (`fio-forte`): divisores de 1px e bordas; o forte faz tracejados, contornos de botão e a linha de base das entradas.

### Named Rules
**The Sem Vermelho Rule.** Vermelho e laranja não existem neste sistema. Erro e perigo usam ameixa; alerta usa o texto, não a cor.

**The Sol É Oficial Rule.** Amarelo-sol marca o que vale (conversão principal, status vigente, aviso fictício, valor que mudou). Um sol por região de decisão; nunca como fundo de seção.

**The Capa Inteira Rule.** A capa verde ocupa regiões de borda a borda. Dentro dela, o foco vira sol (`--anel`) e os furos do picote viram verde (`--furo`); uma folha pousada na capa volta ao anel normal.

## Typography

**Display Font:** Archivo Variable com eixo de largura (com ui-sans-serif, system-ui)
**Body Font:** Archivo Variable (mesma família)

**Character:** Um grotesco só, como num anuário de design: condensado e extra-negrito, ele é título de documento e valor em destaque; estreito e em versalete, é rótulo de formulário; em largura normal, é texto corrido acolhedor. Algarismos tabulares sempre, para que números troquem sem deslocar o layout.

### Hierarchy
- **Display** (800, clamp(3.1rem, 9vw, 6rem), 0.88, largura 66%): só o título do hero na capa.
- **Headline** (800, clamp(2.2rem, 5vw, 3.6rem), 0.95, largura 66%): títulos de seção da Home.
- **Title** (800, clamp(2.4rem, 6vw, 3.8rem), 0.92, largura 66%): título de página da área logada; termina com ponto final.
- **Figure** (800, 2.25 a 3rem, 1, largura 66%, tabular): valores protagonistas (capital, prêmio anual, total por ano).
- **Body** (400, 1rem, 1.55, tabular): texto corrido, até 52 a 60ch; introduções em 1.125 a 1.25rem.
- **Button** (600, 0.95rem, 0.015em, largura 78%): botões, abas e itens de navegação.
- **Label** (650, 0.72rem, 0.09em, maiúsculas, largura 78%, `tinta-suave`): o rótulo de campo, cabeçalho de tabela e tipo de documento.
- **Stamp** (800, 0.78rem, 0.12em, maiúsculas, largura 70%): exclusivo do carimbo.

### Named Rules
**The Três Larguras Rule.** Use as utilidades `condensado` (66%, com word-spacing 0.12em para devolver o espaço entre palavras) e `estreito` (78%); não invente larguras intermediárias. A exceção registrada é o carimbo (70%).

**The Rótulo Nomeia Campo Rule.** O rótulo em versalete sempre nomeia o valor ou o campo logo abaixo (como num formulário impresso). Nunca é sobretítulo decorativo acima de um título de seção.

## Layout

Container central de 72rem com calhas de 20px no celular e 32px a partir de `sm`. Seções da Home respiram 80px na vertical e alternam areia e papel envelhecido, separadas por fios de 1px; a capa do hero termina na linha de costa (SVG ondulado com fio `capa-fio`). O hero divide-se em título à esquerda e a Apólice Viva (até 29rem) à direita a partir de `lg`; no celular empilha.

Dentro das folhas, o cabeçalho de formulário tem 12px de altura interna e 20/28px laterais; o corpo usa os mesmos 20/28px. Dados de documento organizam-se em grade de três colunas de campos rotulados no desktop e colapsam no celular. Tabelas viram cartões em grade de duas colunas abaixo de `md`, com rótulos inline.

Na área logada, a navegação fica na capa do topo no desktop e vira barra de três abas fixa no rodapé (68px, área segura respeitada) abaixo de `md`. Alvos de toque têm no mínimo 44px.

Impressão: A4 com margem de 14mm, só o documento, tinta escura sobre branco, sem sombras, sem bordas de folha e sem nada marcado `.nao-imprimir`.

## Elevation & Depth

Papel sobre mesa. A profundidade é quase toda tonal (areia, papel, papel envelhecido) e por fios de 1px; a única sombra estrutural é a da folha, uma linha de contato de 1px mais uma sombra longa e difusa, como papel apoiado. Nada flutua além disso, exceto o botão sol, que ganha um leve relevo de tecla.

### Shadow Vocabulary
- **Sombra da Folha** (`box-shadow: 0 1px 0 oklch(0.27 0.045 228 / 0.06), 0 18px 34px -22px oklch(0.27 0.045 228 / 0.45)`; no escuro `0 1px 0 oklch(0 0 0 / 0.3), 0 20px 40px -24px oklch(0 0 0 / 0.8)`): toda folha de documento.
- **Relevo do Sol** (`box-shadow: 0 1px 0 oklch(0.25 0.045 228 / 0.3), 0 10px 20px -12px oklch(0.25 0.045 228 / 0.6)`): só o botão primário amarelo.
- **Sombra do Polegar** (`0 0 0 2px var(--mar), 0 6px 14px -6px oklch(0.25 0.045 228 / 0.7)`): o sol da régua.

### Named Rules
**The Papel Apoiado Rule.** Sombra é só a da folha. Cartões, linhas de lista e campos ficam planos e se separam por fio, tracejado ou tom.

## Shapes

Cantos quase retos, de papelaria: 4px em botões, campos, carimbos, tiras de canhoto e itens de navegação; 6px nas folhas e no estado vazio. A entrada tem o canto inferior mais fechado (4px em cima, 2px embaixo) e uma linha de base de 2px, como um campo para preencher à caneta. O único elemento redondo é a régua (trilho de 999px e polegar circular, o sol). O tracejado é forma de sistema: picote com furos de 3.5px a cada 14px sobre tracejado de 10px, divisões entre canhotos, separadores internos de folha e a moldura de 2px do estado vazio. Curva livre só na linha de costa.

## Components

### Buttons
Tecla de balcão: firme, retangular, sem floreio.
- **Shape:** cantos de 4px; alturas de 36, 44 e 52px (pequeno, normal, grande), padding lateral de 14, 20 e 28px.
- **Sol (primário de conversão):** fundo `sol`, texto `sol-tinta`, relevo do sol; hover `sol-forte`.
- **Mar (ação padrão):** fundo `mar`, texto `folha`; hover `mar-forte`.
- **Contorno:** papel com borda `fio-forte`; hover papel envelhecido.
- **Capa:** transparente com borda `capa-fio` sobre a capa; hover `capa-funda`.
- **Texto:** link sublinhado em `mar`, sublinhado engrossa no hover.
- **Perigo:** fundo `ameixa`, texto `folha`.
- **Estados:** 150ms com `ease-saida`; afunda 1px ao pressionar; carregando troca o ícone por um spinner e aplica `aria-busy`; desabilitado a 60%.

### Inputs / Fields
- **Style:** papel, borda de 1px `fio` com base de 2px `fio-forte`, cantos 4/2px, 46px de altura; rótulo em versalete acima, dica em `tinta-suave` abaixo.
- **Hover:** a linha de base escurece para `tinta-suave`.
- **Focus:** borda inteira `mar` com halo de 3px de `mar` a 25%, sem contorno externo.
- **Error / Disabled:** erro pinta a linha de base em `ameixa` e mostra a mensagem com ícone; somente-leitura e desabilitado em papel envelhecido com tinta suave.

### Cards / Containers (Folha)
- **Corner Style:** 6px.
- **Background:** `folha`, borda de 1px `fio`, Sombra da Folha.
- **Header:** cabeçalho de formulário com o símbolo da Orla em `mar`, tipo do documento em rótulo de tinta plena, "Documento fictício" em rótulo suave e número do documento à direita.
- **Internal Padding:** 20px, 28px a partir de `sm`.

### Carimbo
Status como carimbo de borracha.
- **Style:** borda de 2px e contorno de 1px afastado 2px, ambos `currentColor`; tipo Stamp.
- **Tons:** `sol` (cheio, vigente/contratada), `sol-claro` (véu de sol a 30%, em aberto/obrigatória), `apagado` (só tinta suave, encerrado), `capa` (tinta sol sem fundo, sobre a capa).
- **Inclinação:** cada carimbo tem ângulo próprio entre -4° e +2°, derivado do texto (estável entre renderizações); em tabelas densas pode ser zerado.
- **Movimento:** ao mudar de status, "bate" (escala 1.5 → 0.96 → 1 com giro de 6°, 520ms).

### Picote e Canhotos
- **Picote:** faixa de 14px com furos na cor `--furo` (areia por padrão, verde sobre a capa) sobre tracejado `fio-forte`. Separa o corpo da folha do carnê.
- **Canhotos:** tira em papel envelhecido com borda `fio` e cantos de 4px; cada parcela é uma célula com divisões tracejadas, rótulo "Parcela 01/12", valor em 1.05rem semi-negrito e vencimento. Em fileira, mostra até três e um resumo "+ N parcelas"; no celular, duas colunas.

### Marca-Texto
O valor que acabou de mudar recebe uma faixa `marca` cobrindo de 12% a 92% da altura da linha, com 2px de canto, e a mantém até a próxima interação.

### Régua
Controle deslizante de capital: trilho de 8px arredondado que se preenche de `mar` até o valor; polegar de 30px em `sol` com aro de 3px de papel e anel de 2px `mar`. Cresce 12% ao arrastar; no foco ganha anel de 6px na cor `--anel`.

### Navigation
- **Topo (capa):** logo condensado à esquerda; itens em Button sobre a capa, hover `capa-funda`, ativo em papel invertido (`capa-tinta` com texto `capa`).
- **Celular (área logada):** barra de três abas em papel com fio superior; ícone lucide de 22px e rótulo estreito de 0.8rem; ativo em `mar` com traço mais grosso, inativo em `tinta-suave`.
- **Aviso fictício:** faixa amarela fina em todas as páginas, acima do cabeçalho, nunca impressa.

### Apólice Viva (assinatura)
A folha de simulação do hero: régua de capital com valor em Figure, lista de coberturas com cadeado na obrigatória e checkboxes `mar` nas adicionais, prêmio anual grande, picote e carnê em fileira com controle de parcelas. Cada recálculo marca com marca-texto o que mudou e anuncia o novo valor para leitores de tela com atraso.

### Foco
Anel de 3px com 2px de afastamento na cor `--anel`: `mar-forte` no claro, `sol` no escuro e sobre a capa. Títulos que recebem foco programático na troca de página não mostram anel.

## Do's and Don'ts

### Do:
- **Do** pôr todo conteúdo em folhas de papel (`folha`, 6px, Sombra da Folha) e separar o que há dentro com fios de 1px e tracejados.
- **Do** usar a capa verde em regiões de borda a borda e aplicar `.na-capa` nelas, para que foco e picote mudem de cor.
- **Do** rotular cada valor com o rótulo em versalete estreito (0.72rem, 650, 0.09em) e escrever números em algarismos tabulares.
- **Do** destacar com marca-texto amarelo o valor que acabou de mudar, e animar troca de status só com o "bater" do carimbo.
- **Do** desligar `bater` e `surgir` (e qualquer pulso de carregamento) sob `prefers-reduced-motion`; elas só existem dentro de `no-preference`.
- **Do** manter o aviso de projeto fictício visível em toda página e a marca "Documento fictício" em toda folha.
- **Do** garantir que cada página imprima limpa: A4, tinta escura, sem navegação.

### Don't:
- **Don't** usar vermelho ou laranja, nem para erro; erro é ameixa.
- **Don't** usar fotos de pessoas.
- **Don't** usar gradientes de fintech nem fundos decorativos; o único gradiente é funcional (picote, marca-texto, trilho da régua).
- **Don't** introduzir uma segunda família tipográfica ou larguras de Archivo fora de 66%, 70% (carimbo) e 78%.
- **Don't** arredondar além de 6px, exceto o trilho e o polegar da régua.
- **Don't** adicionar sombras além da da folha, do relevo do botão sol e do polegar da régua.
- **Don't** usar o rótulo em versalete como sobretítulo acima de títulos de seção.
- **Don't** escurecer o tema escuro para cinza neutro; o fundo noturno puxa para o verde da capa.
