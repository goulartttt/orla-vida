import { ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router';
import { CabecalhoPagina } from '../componentes/Documentos.jsx';
import { Botao } from '../componentes/ui/Botao.jsx';
import { Carimbo } from '../componentes/ui/Carimbo.jsx';
import { Carregando, ErroCarregamento, Vazio } from '../componentes/ui/Estados.jsx';
import { Folha } from '../componentes/ui/Folha.jsx';
import { useSessao } from '../contexto/Sessao.jsx';
import { useRecurso } from '../hooks/useRecurso.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { data, reais } from '../lib/formatar.js';
import { SITUACAO_APOLICE } from '../lib/rotulos.js';

/** Linha de extrato: rótulo à esquerda, valor à direita, ligados por pontilhado. */
function LinhaExtrato({ rotulo, valor }) {
  return (
    <div className="flex items-baseline gap-3 py-3">
      <dt className="shrink-0">{rotulo}</dt>
      <span className="min-w-6 flex-1 translate-y-[-0.3em] border-b-2 border-dotted border-fio-forte" aria-hidden />
      <dd className="text-xl font-semibold">{valor}</dd>
    </div>
  );
}

export default function Painel() {
  useTituloPagina('Painel');
  const { usuario } = useSessao();
  const { dados, erro, carregando, recarregar } = useRecurso('/painel');
  const primeiroNome = usuario.nome.split(' ')[0];

  return (
    <>
      <CabecalhoPagina
        titulo={`Olá, ${primeiroNome}.`}
        descricao="Aqui está o resumo do seu seguro."
        acoes={
          <Botao to="/cotacoes/nova" icone={Plus}>
            Nova cotação
          </Botao>
        }
      />

      {usuario.demo && (
        <p className="mb-8 rounded-[4px] border border-dashed border-fio-forte px-4 py-3 text-tinta-suave">
          Você está numa <strong className="text-tinta">conta demo</strong>. Tudo aqui é de exemplo e será apagado
          automaticamente em 24 horas. Fique à vontade para criar, editar e contratar.
        </p>
      )}

      {carregando && <Carregando />}
      {erro && <ErroCarregamento erro={erro} aoTentarDeNovo={recarregar} />}

      {dados && (
        <div className="grid gap-8 lg:grid-cols-[22rem_1fr] lg:items-start">
          <Folha tipo="Extrato">
            <dl className="divide-y divide-fio px-6 py-2 sm:px-7">
              <LinhaExtrato rotulo="Cotações em aberto" valor={dados.resumo.cotacoesAbertas} />
              <LinhaExtrato rotulo="Apólices ativas" valor={dados.resumo.apolicesAtivas} />
              <LinhaExtrato rotulo="Prêmio anual ativo" valor={reais(dados.resumo.premioAnualAtivoCentavos)} />
            </dl>
          </Folha>

          <div className="flex flex-col gap-10">
            <section aria-labelledby="titulo-continuar">
              <h2 id="titulo-continuar" className="condensado mb-4 text-3xl font-extrabold">
                Continue de onde parou
              </h2>
              {dados.ultimasCotacoes.length === 0 ? (
                <Vazio
                  titulo="Nenhuma cotação em aberto"
                  acao={
                    <Botao to="/cotacoes/nova" variante="contorno" icone={Plus}>
                      Fazer uma cotação
                    </Botao>
                  }
                >
                  Monte uma cotação em três passos e veja o valor antes de decidir.
                </Vazio>
              ) : (
                <ul className="flex flex-col gap-3">
                  {dados.ultimasCotacoes.map((c) => (
                    <li key={c.numero} className="folha flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
                      <div className="min-w-0 flex-1">
                        <Link to={`/cotacoes/${c.numero}`} className="text-lg font-semibold hover:underline">
                          {c.segurado.nome}
                        </Link>
                        <p className="text-sm text-tinta-suave">
                          Cotação nº {c.numero} · início em {data(c.inicioVigencia)}
                        </p>
                      </div>
                      <p className="font-semibold">{reais(c.premioAnualCentavos)}/ano</p>
                      <Botao to={`/cotacoes/${c.numero}/contratar`} variante="sol" tamanho="pequeno" icone={ArrowRight}>
                        Contratar
                      </Botao>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section aria-labelledby="titulo-apolices">
              <h2 id="titulo-apolices" className="condensado mb-4 text-3xl font-extrabold">
                Suas apólices
              </h2>
              {dados.ultimasApolices.length === 0 ? (
                <p className="text-tinta-suave">Quando você contratar uma cotação, a apólice aparece aqui.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {dados.ultimasApolices.map((a) => (
                    <li key={a.numero} className="folha flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
                      <div className="min-w-0 flex-1">
                        <Link to={`/apolices/${a.numero}`} className="text-lg font-semibold hover:underline">
                          {a.segurado.nome}
                        </Link>
                        <p className="estreito text-sm text-tinta-suave">{a.numero}</p>
                      </div>
                      <Carimbo tom={SITUACAO_APOLICE[a.situacao].tom}>{SITUACAO_APOLICE[a.situacao].texto}</Carimbo>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      )}
    </>
  );
}
