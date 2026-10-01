import { data, doisDigitos, reais } from '../../lib/formatar.js';

/**
 * Canhotos do carnê: uma tira por parcela, separadas por picote.
 * `fileira`: todos numa única linha (no celular, duas colunas), como um carnê destacável.
 * `marcado`: destaca os valores que acabaram de mudar.
 */
export function Canhotos({ canhotos, marcado = false, limite, fileira = false, className = '' }) {
  const visiveis = limite ? canhotos.slice(0, limite) : canhotos;
  const restantes = canhotos.length - visiveis.length;
  const grade = fileira
    ? 'grid-cols-2 sm:grid-flow-col sm:grid-cols-none sm:auto-cols-fr'
    : 'grid-cols-[repeat(auto-fill,minmax(7.25rem,1fr))]';

  return (
    <ol
      className={`grid overflow-hidden rounded-[4px] border border-fio bg-folha-funda ${grade} ${className}`}
      aria-label={`Carnê com ${canhotos.length} ${canhotos.length === 1 ? 'parcela' : 'parcelas'}`}
    >
      {visiveis.map((c) => (
        <li
          key={c.numero}
          className={`relative -mr-px -mb-px flex min-w-0 flex-col gap-1 border-r border-b border-dashed border-fio-forte py-2.5 ${
            fileira ? 'px-2.5' : 'px-3'
          }`}
        >
          <span className="rotulo text-[0.66rem]!">
            {c.total === 1 ? 'Parcela única' : `Parcela ${doisDigitos(c.numero)}/${doisDigitos(c.total)}`}
          </span>
          <span className={`self-start text-[1.05rem] leading-tight font-semibold ${marcado ? 'marcado' : ''}`}>
            {reais(c.valorCentavos)}
          </span>
          <span className="text-xs text-tinta-suave">
            {fileira ? (
              <>
                <span className="sr-only">vence em </span>
                {data(c.vencimento).replace(/\/\d{2}(\d{2})$/, '/$1')}
              </>
            ) : (
              `vence ${data(c.vencimento)}`
            )}
          </span>
        </li>
      ))}
      {restantes > 0 && (
        <li className="flex items-center justify-center px-3 py-2.5 text-sm font-semibold text-tinta-suave">
          + {restantes} {restantes === 1 ? 'parcela' : 'parcelas'}
        </li>
      )}
    </ol>
  );
}
