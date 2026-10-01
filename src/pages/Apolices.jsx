import { Link } from 'react-router';
import { CabecalhoPagina } from '../componentes/Documentos.jsx';
import { Botao } from '../componentes/ui/Botao.jsx';
import { Carimbo } from '../componentes/ui/Carimbo.jsx';
import { Carregando, ErroCarregamento, Vazio } from '../componentes/ui/Estados.jsx';
import { Folha } from '../componentes/ui/Folha.jsx';
import { useRecurso } from '../hooks/useRecurso.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { data, plural, reais } from '../lib/formatar.js';
import { FORMA_PAGAMENTO, SITUACAO_APOLICE } from '../lib/rotulos.js';

export default function Apolices() {
  useTituloPagina('Apólices');
  const { dados, erro, carregando, recarregar } = useRecurso('/apolices');
  const apolices = dados?.apolices ?? [];

  return (
    <>
      <CabecalhoPagina titulo="Apólices" descricao="Seus seguros contratados. Abra uma apólice para ver os detalhes ou imprimir." />

      {carregando && <Carregando />}
      {erro && <ErroCarregamento erro={erro} aoTentarDeNovo={recarregar} />}

      {dados && apolices.length === 0 && (
        <Vazio titulo="Nenhuma apólice ainda" acao={<Botao to="/cotacoes">Ver minhas cotações</Botao>}>
          A apólice é emitida quando você contrata uma cotação: escolhe a forma de pagamento e os beneficiários.
        </Vazio>
      )}

      {apolices.length > 0 && (
        <Folha tipo="Arquivo de apólices" numero={plural(apolices.length, 'apólice', 'apólices')}>
          <ul className="divide-y divide-fio">
            {apolices.map((a) => {
              const situacao = SITUACAO_APOLICE[a.situacao];
              return (
                <li
                  key={a.numero}
                  className="relative grid gap-x-6 gap-y-2 px-5 py-5 hover:bg-folha-funda sm:grid-cols-[1fr_auto_auto] sm:items-center sm:px-7"
                >
                  <div className="min-w-0">
                    <Link
                      to={`/apolices/${a.numero}`}
                      className="text-lg font-semibold after:absolute after:inset-0 hover:underline"
                    >
                      {a.segurado.nome}
                    </Link>
                    <p className="estreito text-sm text-tinta-suave">
                      {a.numero} · vigência {data(a.inicioVigencia)} a {data(a.fimVigencia)}
                    </p>
                  </div>
                  <p className="text-sm sm:text-right">
                    <span className="font-semibold">{reais(a.pagamento.totalCentavos)}</span>
                    <span className="block text-tinta-suave">
                      {a.pagamento.forma === 'avista'
                        ? FORMA_PAGAMENTO.avista
                        : `${a.pagamento.parcelas}× de ${reais(a.pagamento.valorParcelaCentavos)}`}
                    </span>
                  </p>
                  <Carimbo tom={situacao.tom} className="justify-self-start sm:justify-self-end">
                    {situacao.texto}
                  </Carimbo>
                </li>
              );
            })}
          </ul>
        </Folha>
      )}
    </>
  );
}
