import { ArrowRight, Cookie, EyeOff, LockKeyhole, UsersRound } from 'lucide-react';
import { ApoliceViva } from '../componentes/ApoliceViva.jsx';
import { Botao } from '../componentes/ui/Botao.jsx';
import { Carimbo } from '../componentes/ui/Carimbo.jsx';
import { ErroCarregamento } from '../componentes/ui/Estados.jsx';
import { Folha } from '../componentes/ui/Folha.jsx';
import { useCatalogo } from '../hooks/useCatalogo.js';
import { useEntrarDemo } from '../hooks/useEntrarDemo.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { reais, reaisInteiros, taxa } from '../lib/formatar.js';
import { premioCoberturaCentavos } from '../lib/premio.js';

/** Linha de costa: a borda orgânica entre a capa verde e a areia. */
function LinhaDaOrla({ cor = 'var(--fundo)' }) {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 -bottom-px h-[clamp(2.5rem,6vw,5rem)] w-full"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0 30C140 18 230 50 380 42S640 10 800 24 1080 62 1240 40 1400 24 1440 28"
        fill="none"
        stroke="var(--capa-fio)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      <path d="M0 46C120 32 220 66 360 54S600 20 760 36 1040 72 1200 48 1380 34 1440 40V80H0Z" fill={cor} />
    </svg>
  );
}

function Capa() {
  const { catalogo, erro, carregando, tentarDeNovo } = useCatalogo();
  const demo = useEntrarDemo();

  return (
    <section className="na-capa relative overflow-hidden bg-capa text-capa-tinta">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-10 pb-24 sm:px-8 lg:grid-cols-[1fr_minmax(0,29rem)] lg:items-center lg:gap-14 lg:pt-14 lg:pb-32">
        <div className="surgir">
          <h1 className="condensado text-[clamp(3.1rem,9vw,6rem)] leading-[0.88] font-extrabold tracking-[-0.025em]">
            Seu seguro de vida, montado por você.
          </h1>
          <p className="mt-6 max-w-[36ch] text-lg text-capa-suave sm:text-xl">
            Escolha quanto sua família recebe e veja o valor mudar na hora. Sem letra miúda escondida: a conta está
            toda na sua frente.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Botao variante="sol" tamanho="grande" carregando={demo.carregando} onClick={demo.entrar}>
              Entrar com conta demo
            </Botao>
            <Botao variante="capa" tamanho="grande" to="/criar-conta">
              Criar conta
            </Botao>
          </div>
          <p className="mt-4 max-w-[46ch] text-sm text-capa-suave">
            A conta demo já vem com uma cotação e uma apólice de exemplo, e é apagada sozinha em 24 horas.
          </p>
        </div>

        <div className="surgir [animation-delay:120ms]">
          {catalogo && <ApoliceViva catalogo={catalogo} />}
          {carregando && (
            <div className="folha h-[34rem] animate-pulse motion-reduce:animate-none" role="status">
              <span className="sr-only">Carregando simulação…</span>
            </div>
          )}
          {erro && (
            <Folha tipo="Simulação" className="p-6 text-tinta">
              <ErroCarregamento erro={erro} aoTentarDeNovo={tentarDeNovo} className="p-6" />
            </Folha>
          )}
        </div>
      </div>
      <LinhaDaOrla />
    </section>
  );
}

const PASSOS = [
  {
    titulo: 'Cotação',
    texto: 'Você escolhe as coberturas e quanto cada uma paga. A cotação fica salva e pode ser editada quantas vezes quiser.',
    detalhe: (
      <div className="flex flex-col gap-2">
        <div className="h-2.5 w-3/4 rounded-full bg-fio" />
        <div className="h-2.5 w-1/2 rounded-full bg-fio" />
        <Carimbo tom="petroleo" className="mt-2 self-start">
          Em aberto
        </Carimbo>
      </div>
    ),
  },
  {
    titulo: 'Proposta',
    texto: 'Você decide como pagar e quem recebe: até cinco beneficiários, com a porcentagem de cada um.',
    detalhe: (
      <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-sm">
        <dt>Beneficiário A</dt>
        <dd className="font-semibold">60%</dd>
        <dt>Beneficiário B</dt>
        <dd className="font-semibold">40%</dd>
      </dl>
    ),
  },
  {
    titulo: 'Apólice',
    texto: 'Contratou, recebeu: a apólice sai na hora, com número próprio e um carnê pronto para imprimir.',
    detalhe: (
      <div className="flex flex-wrap items-center gap-3">
        <span className="estreito text-sm font-semibold">ORL-2026-10-000001</span>
        <Carimbo tom="mar">Vigente</Carimbo>
      </div>
    ),
  },
];

function ComoFunciona() {
  return (
    <section id="como-funciona" className="scroll-mt-6 px-5 pt-16 pb-20 sm:px-8 sm:pt-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="condensado max-w-[18ch] text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95] font-extrabold">
          Três papéis, do começo ao fim.
        </h2>
        <p className="mt-4 max-w-[52ch] text-lg text-tinta-suave">
          Seguro de vida é papel. Aqui ele é transparente: você acompanha cada documento e sabe sempre em que etapa
          está.
        </p>
        <ol className="mt-12 grid gap-6 md:grid-cols-3 md:gap-0">
          {PASSOS.map((passo, i) => (
            <li
              key={passo.titulo}
              className={`folha relative flex flex-col gap-4 p-6 md:p-7 ${
                ['md:rotate-[-1.2deg]', 'md:z-10 md:-mx-2 md:mt-8', 'md:rotate-[1deg]'][i]
              }`}
            >
              <div className="flex items-baseline justify-between gap-3 border-b border-fio pb-3">
                <h3 className="condensado text-3xl font-extrabold">{passo.titulo}</h3>
                <span className="rotulo">Etapa {i + 1} de 3</span>
              </div>
              <p className="text-tinta-suave">{passo.texto}</p>
              <div className="mt-auto border-t border-dashed border-fio-forte pt-4">{passo.detalhe}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Coberturas() {
  const { catalogo, erro, tentarDeNovo } = useCatalogo();
  const exemplo = catalogo?.coberturas.find((c) => c.obrigatoria);

  return (
    <section id="coberturas" className="scroll-mt-6 border-y border-fio bg-folha-funda px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
            <h2 className="condensado text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95] font-extrabold">
              O que você pode contratar.
            </h2>
            <p className="mt-4 max-w-[56ch] text-lg text-tinta-suave">
              A cobertura principal é obrigatória. As adicionais são opcionais e pagam, no máximo, o mesmo valor da
              principal. Todos os valores e taxas são fictícios.
            </p>
          </div>
          {exemplo && (
            <p className="rounded-[4px] border border-dashed border-fio-forte px-4 py-3 text-sm">
              <span className="rotulo block">Como a conta é feita</span>
              {reaisInteiros(300_000)} × {taxa(exemplo.taxaAnual)} ={' '}
              <strong>{reais(premioCoberturaCentavos(300_000, exemplo.taxaAnual))} por ano</strong> na cobertura
              principal.
            </p>
          )}
        </div>

        {erro && <ErroCarregamento erro={erro} aoTentarDeNovo={tentarDeNovo} className="mt-10" />}
        {catalogo && (
          <Folha tipo="Tabela de coberturas" className="mt-10 overflow-hidden">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Coberturas disponíveis, limites de capital e taxa anual</caption>
              <thead className="hidden md:table-header-group">
                <tr className="border-b border-fio">
                  <th scope="col" className="rotulo px-7 py-3 font-semibold">
                    Cobertura
                  </th>
                  <th scope="col" className="rotulo px-4 py-3 font-semibold">
                    Capital de
                  </th>
                  <th scope="col" className="rotulo px-4 py-3 font-semibold">
                    até
                  </th>
                  <th scope="col" className="rotulo px-7 py-3 text-right font-semibold">
                    Taxa anual
                  </th>
                </tr>
              </thead>
              <tbody>
                {catalogo.coberturas.map((c) => (
                  <tr
                    key={c.codigo}
                    className="grid grid-cols-2 gap-x-4 gap-y-1 border-b border-fio px-5 py-5 last:border-b-0 md:table-row md:px-0"
                  >
                    <th scope="row" className="col-span-2 font-normal md:px-7 md:py-5 md:align-top">
                      <span className="flex flex-wrap items-center gap-2 text-lg font-semibold">
                        {c.nome}
                        {c.obrigatoria && (
                          <Carimbo tom="mar" className="rotate-0! text-[0.65rem]!">
                            Obrigatória
                          </Carimbo>
                        )}
                      </span>
                      <span className="mt-1 block max-w-[52ch] text-tinta-suave">{c.descricao}</span>
                    </th>
                    <td className="md:px-4 md:py-5 md:align-top">
                      <span className="rotulo md:hidden">Capital de </span>
                      {reaisInteiros(c.capitalMinimo)}
                    </td>
                    <td className="md:px-4 md:py-5 md:align-top">
                      <span className="rotulo md:hidden">até </span>
                      {reaisInteiros(c.capitalMaximo)}
                    </td>
                    <td className="col-span-2 font-semibold md:px-7 md:py-5 md:text-right md:align-top">
                      <span className="rotulo font-normal md:hidden">Taxa anual </span>
                      {taxa(c.taxaAnual)} do capital
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Folha>
        )}
      </div>
    </section>
  );
}

const CUIDADOS = [
  {
    icone: LockKeyhole,
    titulo: 'CPF cifrado',
    texto: 'O CPF é guardado com criptografia AES-256. Quem olha o banco de dados vê só um código, não o número.',
  },
  {
    icone: EyeOff,
    titulo: 'Mascarado nas telas',
    texto: 'Nas listas e na apólice, o CPF aparece só pela metade. Completo, só quando você edita uma cotação sua.',
  },
  {
    icone: Cookie,
    titulo: 'Sessão protegida',
    texto: 'Seu acesso fica num cookie que os scripts da página não conseguem ler, e expira em duas horas.',
  },
  {
    icone: UsersRound,
    titulo: 'Cada um vê o seu',
    texto: 'Nenhuma conta enxerga as cotações ou apólices de outra, nem tentando adivinhar o número.',
  },
];

function SeusDados() {
  return (
    <section id="seus-dados" className="px-5 py-20 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_24rem] lg:items-center">
        <div>
          <h2 className="condensado max-w-[16ch] text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95] font-extrabold">
            Seus dados, guardados como deveriam.
          </h2>
          <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {CUIDADOS.map(({ icone: Icone, titulo, texto }) => (
              <li key={titulo} className="flex gap-4">
                <Icone className="mt-1 size-6 shrink-0 text-mar" aria-hidden strokeWidth={1.8} />
                <div>
                  <h3 className="text-lg font-semibold">{titulo}</h3>
                  <p className="mt-1 text-tinta-suave">{texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <Folha tipo="Ficha do segurado" numero="exemplo" className="lg:rotate-[1.2deg]">
          <dl className="flex flex-col gap-5 p-6 sm:p-7">
            <div>
              <dt className="rotulo">Como aparece para você</dt>
              <dd className="mt-1 text-2xl font-semibold tracking-wide">***.982.247-**</dd>
            </div>
            <div>
              <dt className="rotulo">Como fica no banco de dados</dt>
              <dd className="mt-2 flex flex-col gap-1.5" aria-label="Texto cifrado, ilegível">
                <span className="faixa-marcada block h-3.5 w-full" />
                <span className="faixa-marcada block h-3.5 w-11/12" />
                <span className="faixa-marcada block h-3.5 w-2/3" />
              </dd>
            </div>
            <p className="border-t border-dashed border-fio-forte pt-4 text-sm text-tinta-suave">
              CPF de teste, gerado por algoritmo. Não pertence a ninguém.
            </p>
          </dl>
        </Folha>
      </div>
    </section>
  );
}

const DUVIDAS = [
  {
    pergunta: 'A Orla Vida é uma seguradora de verdade?',
    resposta:
      'Não. É uma empresa fictícia, criada para um projeto de portfólio. Nada aqui é um seguro real, nenhum valor é cobrado e nenhuma apólice tem validade.',
  },
  {
    pergunta: 'Como o valor do seguro é calculado?',
    resposta:
      'Cada cobertura tem uma taxa anual. O prêmio de uma cobertura é o capital escolhido multiplicado por essa taxa, e o prêmio total é a soma das coberturas. Você vê a conta mudar enquanto escolhe.',
  },
  {
    pergunta: 'Posso pagar parcelado?',
    resposta:
      'Sim, em até 12 vezes sem juros, desde que cada parcela fique acima de R$ 20,00. À vista, você ganha 5% de desconto.',
  },
  {
    pergunta: 'Quem pode ser beneficiário?',
    resposta:
      'Qualquer pessoa que você escolher, até cinco. Você define a porcentagem de cada uma, e a soma precisa dar 100%.',
  },
  {
    pergunta: 'O que é a conta demo?',
    resposta:
      'Uma conta temporária criada na hora, sem cadastro, com uma cotação e uma apólice de exemplo. Ela e tudo o que você fizer nela são apagados automaticamente em 24 horas.',
  },
  {
    pergunta: 'Quem pode contratar?',
    resposta: 'Pessoas de 18 a 70 anos na data de início do seguro, que vale por um ano a partir da data escolhida.',
  },
];

function Duvidas() {
  return (
    <section id="duvidas" className="scroll-mt-6 border-t border-fio px-5 py-20 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[20rem_1fr]">
        <h2 className="condensado text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95] font-extrabold">Dúvidas frequentes.</h2>
        <div className="divide-y divide-fio border-y border-fio">
          {DUVIDAS.map(({ pergunta, resposta }) => (
            <details key={pergunta} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {pergunta}
                <span
                  className="text-2xl leading-none text-mar transition-transform duration-200 ease-saida group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="max-w-[62ch] pb-6 text-tinta-suave">{resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Fechamento() {
  const demo = useEntrarDemo();
  return (
    <section className="na-capa bg-capa px-5 py-20 text-capa-tinta sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="condensado max-w-[14ch] text-[clamp(2.4rem,6vw,4.4rem)] leading-[0.92] font-extrabold">
            Quer ver por dentro?
          </h2>
          <p className="mt-4 max-w-[46ch] text-lg text-capa-suave">
            Entre com a conta demo e faça o caminho inteiro: crie uma cotação, contrate e imprima a apólice.
          </p>
        </div>
        <Botao variante="sol" tamanho="grande" icone={ArrowRight} carregando={demo.carregando} onClick={demo.entrar}>
          Entrar com conta demo
        </Botao>
      </div>
    </section>
  );
}

export function Home() {
  useTituloPagina(null);
  return (
    <>
      <Capa />
      <ComoFunciona />
      <Coberturas />
      <SeusDados />
      <Duvidas />
      <Fechamento />
    </>
  );
}
