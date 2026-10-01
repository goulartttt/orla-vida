import { Lock, Minus, Plus } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { useAnuncioAtrasado, useMarcaTexto } from '../hooks/useMarcaTexto.js';
import { hoje } from '../lib/datas.js';
import { reais, reaisInteiros } from '../lib/formatar.js';
import { montarCanhotos, parcelasDisponiveis, premioCoberturaCentavos, simularPagamento } from '../lib/premio.js';
import { Canhotos } from './ui/Canhotos.jsx';
import { Folha, Picote } from './ui/Folha.jsx';

const PASSO_CAPITAL = 10_000;
const CAPITAL_INICIAL = 300_000;

/** Nesta prévia rápida, cada adicional usa metade do capital principal (dentro dos limites dela). */
function capitalAdicional(cobertura, capitalPrincipal) {
  const metade = Math.round(capitalPrincipal / 2 / 1000) * 1000;
  return Math.min(cobertura.capitalMaximo, capitalPrincipal, Math.max(cobertura.capitalMinimo, metade));
}

/**
 * Assinatura da Home: uma apólice que se preenche ao vivo. Mexer no capital,
 * nas coberturas ou nas parcelas recalcula o prêmio e re-picota o carnê.
 */
export function ApoliceViva({ catalogo }) {
  const { coberturas, regras } = catalogo;
  const principal = coberturas.find((c) => c.obrigatoria);
  const adicionais = coberturas.filter((c) => !c.obrigatoria);

  const [capital, setCapital] = useState(CAPITAL_INICIAL);
  const [ativas, setAtivas] = useState(() => new Set(adicionais.slice(0, 1).map((c) => c.codigo)));
  const [parcelasDesejadas, setParcelasDesejadas] = useState(regras.parcelasMaximas);
  const inicio = useMemo(() => hoje(), []);
  const idRegua = useId();

  const itens = [principal, ...adicionais.filter((c) => ativas.has(c.codigo))].map((c) => {
    const capitalItem = c.obrigatoria ? capital : capitalAdicional(c, capital);
    return { ...c, capitalItem, premio: premioCoberturaCentavos(capitalItem, c.taxaAnual) };
  });
  const premioAnual = itens.reduce((total, i) => total + i.premio, 0);
  const maximo = parcelasDisponiveis(premioAnual, regras);
  const parcelas = maximo < 2 ? 1 : Math.min(parcelasDesejadas, maximo);
  const pagamento = simularPagamento(premioAnual, parcelas, regras);
  const canhotos = montarCanhotos(pagamento, inicio);

  const marcados = useMarcaTexto({
    premio: premioAnual,
    parcela: pagamento.valorParcelaCentavos,
    parcelas,
    ...Object.fromEntries(itens.map((i) => [i.codigo, i.premio])),
  });

  const anuncio = useAnuncioAtrasado(
    `Prêmio anual de ${reais(premioAnual)}. ${
      parcelas === 1 ? `À vista: ${reais(pagamento.totalCentavos)}.` : `${parcelas} parcelas de ${reais(pagamento.valorParcelaCentavos)}.`
    }`,
  );

  const alternar = (codigo) =>
    setAtivas((atual) => {
      const nova = new Set(atual);
      if (nova.has(codigo)) nova.delete(codigo);
      else nova.add(codigo);
      return nova;
    });

  const preenchido = ((capital - principal.capitalMinimo) / (principal.capitalMaximo - principal.capitalMinimo)) * 100;

  return (
    <Folha tipo="Simulação" numero="sem compromisso" aria-label="Simulação de seguro de vida" className="text-tinta">
      <div className="flex flex-col gap-5 px-5 pt-5 pb-4 sm:px-7 sm:pt-6">
        <div>
          <label htmlFor={idRegua} className="rotulo">
            Quanto sua família recebe
          </label>
          <output
            htmlFor={idRegua}
            className="condensado block text-[2.6rem] leading-none font-extrabold tracking-[-0.01em] sm:text-5xl"
          >
            {reaisInteiros(capital)}
          </output>
          <input
            id={idRegua}
            type="range"
            className="regua mt-1"
            min={principal.capitalMinimo}
            max={principal.capitalMaximo}
            step={PASSO_CAPITAL}
            value={capital}
            onChange={(e) => setCapital(Number(e.target.value))}
            aria-valuetext={reaisInteiros(capital)}
            style={{ '--preenchido': `${preenchido}%` }}
          />
          <div className="flex justify-between text-xs text-tinta-suave" aria-hidden>
            <span>{reaisInteiros(principal.capitalMinimo)}</span>
            <span>{reaisInteiros(principal.capitalMaximo)}</span>
          </div>
        </div>

        <fieldset>
          <legend className="rotulo mb-1.5">Coberturas</legend>
          <ul className="divide-y divide-fio border-y border-fio">
            {[principal, ...adicionais].map((c) => {
              const item = itens.find((i) => i.codigo === c.codigo);
              const ligado = Boolean(item);
              return (
                <li key={c.codigo} className="flex items-center gap-3 py-2">
                  {c.obrigatoria ? (
                    <span className="flex size-5 shrink-0 items-center justify-center text-mar" title="Obrigatória">
                      <Lock className="size-4" aria-hidden />
                    </span>
                  ) : (
                    <input
                      id={`viva-${c.codigo}`}
                      type="checkbox"
                      checked={ligado}
                      onChange={() => alternar(c.codigo)}
                      className="size-5 shrink-0 accent-[var(--mar)]"
                    />
                  )}
                  <label
                    htmlFor={c.obrigatoria ? undefined : `viva-${c.codigo}`}
                    className={`min-w-0 flex-1 text-[0.95rem] leading-snug ${ligado ? '' : 'text-tinta-suave'}`}
                  >
                    {c.nome}
                    {c.obrigatoria && <span className="sr-only"> (obrigatória)</span>}
                    {ligado && <span className="block text-xs text-tinta-suave">capital de {reaisInteiros(item.capitalItem)}</span>}
                  </label>
                  <span className={`text-right text-sm font-semibold ${ligado ? '' : 'text-tinta-suave'}`}>
                    {ligado ? (
                      <span className={marcados.has(c.codigo) ? 'marcado' : ''}>{reais(item.premio)}</span>
                    ) : (
                      '—'
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="rotulo">Prêmio anual</p>
            <p className="condensado text-4xl leading-none font-extrabold">
              <span className={marcados.has('premio') ? 'marcado' : ''}>{reais(premioAnual)}</span>
            </p>
          </div>
          <p className="max-w-[11rem] text-right text-xs text-tinta-suave">
            valores fictícios, calculados como capital × taxa de cada cobertura
          </p>
        </div>
      </div>

      <Picote />

      <div className="flex flex-col gap-3 px-5 pt-2 pb-5 sm:px-7 sm:pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="rotulo">Seu carnê</p>
          <div className="flex items-center gap-1" role="group" aria-label="Número de parcelas">
            <button
              type="button"
              onClick={() => setParcelasDesejadas(Math.max(1, parcelas - 1))}
              disabled={parcelas <= 1}
              className="inline-flex size-11 items-center justify-center rounded-[4px] border border-fio-forte hover:bg-folha-funda disabled:opacity-40"
              aria-label="Menos parcelas"
            >
              <Minus className="size-4" aria-hidden />
            </button>
            <span className="estreito min-w-[7.5rem] text-center font-semibold">
              <span className={marcados.has('parcelas') ? 'marcado' : ''}>
                {parcelas === 1 ? 'À vista (−5%)' : `${parcelas}× sem juros`}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setParcelasDesejadas(Math.min(maximo, parcelas + 1))}
              disabled={parcelas >= maximo}
              className="inline-flex size-11 items-center justify-center rounded-[4px] border border-fio-forte hover:bg-folha-funda disabled:opacity-40"
              aria-label="Mais parcelas"
            >
              <Plus className="size-4" aria-hidden />
            </button>
          </div>
        </div>
        <Canhotos canhotos={canhotos} limite={5} marcado={marcados.has('parcela')} />
        <p className="sr-only" aria-live="polite">
          {anuncio}
        </p>
      </div>
    </Folha>
  );
}
