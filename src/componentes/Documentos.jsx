import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { reais, reaisInteiros } from '../lib/formatar.js';

export function CabecalhoPagina({ titulo, descricao, acoes, voltar }) {
  return (
    <div className="nao-imprimir mb-8 flex flex-col gap-4">
      {voltar && (
        <Link
          to={voltar.para}
          className="inline-flex items-center gap-1.5 self-start rounded-[4px] text-sm font-semibold text-mar hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {voltar.texto}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="condensado text-[clamp(2.4rem,6vw,3.8rem)] leading-[0.92] font-extrabold tracking-[-0.015em]">
            {titulo}
          </h1>
          {descricao && <p className="mt-3 max-w-[60ch] text-lg text-tinta-suave">{descricao}</p>}
        </div>
        {acoes && <div className="flex flex-wrap gap-2">{acoes}</div>}
      </div>
    </div>
  );
}

/** Tabela de coberturas contratadas, com capital e prêmio de cada uma e o total. */
export function TabelaCoberturas({ coberturas, premioAnualCentavos, marcados = new Set() }) {
  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">Coberturas, capital e prêmio anual</caption>
      <thead>
        <tr className="border-b border-fio">
          <th scope="col" className="rotulo py-2 pr-3 font-semibold">
            Cobertura
          </th>
          <th scope="col" className="rotulo hidden px-3 py-2 text-right font-semibold sm:table-cell">
            Capital
          </th>
          <th scope="col" className="rotulo py-2 pl-3 text-right font-semibold">
            Prêmio anual
          </th>
        </tr>
      </thead>
      <tbody>
        {coberturas.map((c) => (
          <tr key={c.codigo} className="border-b border-fio">
            <th scope="row" className="py-3 pr-3 font-medium">
              {c.nome}
              <span className="block text-sm font-normal text-tinta-suave sm:hidden">
                capital de {reaisInteiros(c.capital)}
              </span>
            </th>
            <td className="hidden px-3 py-3 text-right sm:table-cell">{reaisInteiros(c.capital)}</td>
            <td className="py-3 pl-3 text-right font-semibold">
              <span className={marcados.has(c.codigo) ? 'marcado' : ''}>{reais(c.premioAnualCentavos)}</span>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row" className="pt-4 pr-3 text-left">
            <span className="rotulo text-tinta!">Total por ano</span>
          </th>
          <td className="hidden sm:table-cell" />
          <td className="condensado pt-4 pl-3 text-right text-3xl font-extrabold">
            <span className={marcados.has('total') ? 'marcado' : ''}>{reais(premioAnualCentavos)}</span>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
