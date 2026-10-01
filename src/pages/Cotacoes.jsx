import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import { CabecalhoPagina } from '../componentes/Documentos.jsx';
import { Botao } from '../componentes/ui/Botao.jsx';
import { Carimbo } from '../componentes/ui/Carimbo.jsx';
import { Carregando, ErroCarregamento, Vazio } from '../componentes/ui/Estados.jsx';
import { Folha } from '../componentes/ui/Folha.jsx';
import { useRecurso } from '../hooks/useRecurso.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { data, plural, reais } from '../lib/formatar.js';
import { STATUS_COTACAO } from '../lib/rotulos.js';

export default function Cotacoes() {
  useTituloPagina('Cotações');
  const { dados, erro, carregando, recarregar } = useRecurso('/cotacoes');
  const cotacoes = dados?.cotacoes ?? [];

  return (
    <>
      <CabecalhoPagina
        titulo="Cotações"
        descricao="As cotações em aberto podem ser editadas, excluídas ou contratadas."
        acoes={
          <Botao to="/cotacoes/nova" icone={Plus}>
            Nova cotação
          </Botao>
        }
      />

      {carregando && <Carregando />}
      {erro && <ErroCarregamento erro={erro} aoTentarDeNovo={recarregar} />}

      {dados && cotacoes.length === 0 && (
        <Vazio
          titulo="Você ainda não tem cotações"
          acao={
            <Botao to="/cotacoes/nova" icone={Plus}>
              Fazer a primeira cotação
            </Botao>
          }
        >
          Uma cotação é uma simulação salva: você escolhe as coberturas, vê o valor e decide depois se quer contratar.
        </Vazio>
      )}

      {cotacoes.length > 0 && (
        <Folha tipo="Livro de cotações" numero={plural(cotacoes.length, 'registro', 'registros')}>
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Suas cotações</caption>
            <thead className="hidden md:table-header-group">
              <tr className="border-b border-fio">
                {['Nº', 'Segurado', 'Início', 'Prêmio anual', 'Situação'].map((t, i) => (
                  <th
                    key={t}
                    scope="col"
                    className={`rotulo py-3 font-semibold ${i === 0 ? 'pl-7' : 'px-4'} ${i === 3 ? 'text-right' : ''}`}
                  >
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cotacoes.map((c) => {
                const status = STATUS_COTACAO[c.status];
                return (
                  <tr
                    key={c.numero}
                    className="relative grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-b border-fio px-5 py-4 last:border-b-0 hover:bg-folha-funda md:table-row md:px-0"
                  >
                    <td className="estreito order-first text-sm text-tinta-suave md:py-4 md:pl-7 md:text-base md:text-tinta">
                      <span className="md:hidden">Cotação </span>
                      {c.numero}
                    </td>
                    <td className="col-span-2 md:px-4 md:py-4">
                      <Link
                        to={`/cotacoes/${c.numero}`}
                        className="text-lg font-semibold after:absolute after:inset-0 hover:underline md:text-base"
                      >
                        {c.segurado.nome}
                      </Link>
                      <span className="block text-sm text-tinta-suave">
                        {plural(c.coberturas.length, 'cobertura', 'coberturas')} · CPF {c.segurado.cpf}
                      </span>
                    </td>
                    <td className="text-sm text-tinta-suave md:px-4 md:py-4 md:text-base md:text-tinta">
                      <span className="md:hidden">início </span>
                      {data(c.inicioVigencia)}
                    </td>
                    <td className="text-right font-semibold md:px-4 md:py-4">{reais(c.premioAnualCentavos)}</td>
                    <td className="col-span-2 md:px-4 md:py-4">
                      <Carimbo tom={status.tom}>{status.texto}</Carimbo>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Folha>
      )}
    </>
  );
}
