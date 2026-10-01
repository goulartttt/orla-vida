import { Printer } from 'lucide-react';
import { useLocation, useParams } from 'react-router';
import { CabecalhoPagina, TabelaCoberturas } from '../componentes/Documentos.jsx';
import { Logo } from '../componentes/marca/Logo.jsx';
import { Botao } from '../componentes/ui/Botao.jsx';
import { Canhotos } from '../componentes/ui/Canhotos.jsx';
import { Carimbo } from '../componentes/ui/Carimbo.jsx';
import { Carregando, ErroCarregamento } from '../componentes/ui/Estados.jsx';
import { CampoDocumento, Picote } from '../componentes/ui/Folha.jsx';
import { useRecurso } from '../hooks/useRecurso.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { data, dataHora, reais } from '../lib/formatar.js';
import { montarCanhotos } from '../lib/premio.js';
import { FORMA_PAGAMENTO, PARENTESCOS, SITUACAO_APOLICE } from '../lib/rotulos.js';

function Secao({ titulo, children }) {
  return (
    <section className="border-b border-fio px-6 py-6 break-inside-avoid sm:px-10">
      <h2 className="condensado mb-4 text-xl font-extrabold tracking-[0.01em] uppercase">{titulo}</h2>
      {children}
    </section>
  );
}

export default function DetalheApolice() {
  const { numero } = useParams();
  const { state } = useLocation();
  useTituloPagina(`Apólice ${numero}`);
  const { dados, erro, carregando, recarregar } = useRecurso(`/apolices/${numero}`);
  const voltar = { para: '/apolices', texto: 'Apólices' };

  if (carregando) return <Carregando />;
  if (erro) {
    return (
      <>
        <CabecalhoPagina titulo="Apólice" voltar={voltar} />
        <ErroCarregamento erro={erro} aoTentarDeNovo={erro.status === 404 ? undefined : recarregar} />
      </>
    );
  }

  const { apolice } = dados;
  const situacao = SITUACAO_APOLICE[apolice.situacao];
  const { pagamento } = apolice;
  const canhotos = montarCanhotos(pagamento, apolice.inicioVigencia);

  return (
    <>
      <CabecalhoPagina
        titulo={state?.recemEmitida ? 'Apólice emitida.' : 'Apólice'}
        descricao={
          state?.recemEmitida
            ? 'Pronto: o seguro está contratado. Guarde ou imprima este documento.'
            : 'Documento completo do seguro contratado.'
        }
        voltar={voltar}
        acoes={
          <Botao variante="contorno" icone={Printer} onClick={() => window.print()}>
            Imprimir
          </Botao>
        }
      />

      <article className="folha overflow-hidden" aria-labelledby="titulo-apolice">
        <header className="na-capa flex flex-wrap items-start justify-between gap-6 bg-capa px-6 py-7 text-capa-tinta sm:px-10 print:bg-transparent print:text-tinta">
          <div className="flex flex-col gap-4">
            <Logo />
            <div>
              <h2 id="titulo-apolice" className="condensado text-4xl leading-none font-extrabold sm:text-5xl">
                Apólice de seguro de vida
              </h2>
              <p className="estreito mt-2 text-lg font-semibold tracking-wide">{apolice.numero}</p>
            </div>
          </div>
          <Carimbo
            tom={situacao.tom === 'apagado' ? 'apagado' : 'capa'}
            bater={Boolean(state?.recemEmitida)}
            className="text-base! print:text-tinta!"
          >
            {situacao.texto}
          </Carimbo>
        </header>

        <Secao titulo="Segurado">
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-3">
            <CampoDocumento rotulo="Nome">{apolice.segurado.nome}</CampoDocumento>
            <CampoDocumento rotulo="CPF">{apolice.segurado.cpf}</CampoDocumento>
            <CampoDocumento rotulo="Nascimento">{data(apolice.segurado.dataNascimento)}</CampoDocumento>
          </dl>
        </Secao>

        <Secao titulo="Vigência">
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-3">
            <CampoDocumento rotulo="Início">{data(apolice.inicioVigencia)}</CampoDocumento>
            <CampoDocumento rotulo="Fim">{data(apolice.fimVigencia)}</CampoDocumento>
            <CampoDocumento rotulo="Emitida em">{dataHora(apolice.emitidaEm)}</CampoDocumento>
          </dl>
        </Secao>

        <Secao titulo="Coberturas">
          <TabelaCoberturas coberturas={apolice.coberturas} premioAnualCentavos={apolice.premioAnualCentavos} />
        </Secao>

        <Secao titulo="Beneficiários">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Beneficiários e porcentagens</caption>
            <thead>
              <tr className="border-b border-fio">
                <th scope="col" className="rotulo py-2 pr-3 font-semibold">
                  Nome
                </th>
                <th scope="col" className="rotulo px-3 py-2 font-semibold">
                  Parentesco
                </th>
                <th scope="col" className="rotulo py-2 pl-3 text-right font-semibold">
                  Recebe
                </th>
              </tr>
            </thead>
            <tbody>
              {apolice.beneficiarios.map((b) => (
                <tr key={b.nome} className="border-b border-fio last:border-b-0">
                  <th scope="row" className="py-3 pr-3 font-medium">
                    {b.nome}
                  </th>
                  <td className="px-3 py-3">{PARENTESCOS[b.parentesco]}</td>
                  <td className="py-3 pl-3 text-right font-semibold">{b.percentual}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Secao>

        <Secao titulo="Pagamento">
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-3">
            <CampoDocumento rotulo="Forma">
              {pagamento.forma === 'avista'
                ? `${FORMA_PAGAMENTO.avista}, com 5% de desconto`
                : `${pagamento.parcelas}× sem juros`}
            </CampoDocumento>
            <CampoDocumento rotulo="Total">{reais(pagamento.totalCentavos)}</CampoDocumento>
            <CampoDocumento rotulo={pagamento.forma === 'avista' ? 'Desconto' : 'Parcela'}>
              {pagamento.forma === 'avista' ? reais(pagamento.descontoCentavos) : reais(pagamento.valorParcelaCentavos)}
            </CampoDocumento>
          </dl>
        </Secao>

        <div className="break-inside-avoid px-6 pt-4 pb-8 sm:px-10">
          <Picote className="mb-3" />
          <p className="rotulo mb-2">Carnê · destaque na linha picotada</p>
          <Canhotos canhotos={canhotos} />
        </div>

        <footer className="border-t border-fio bg-folha-funda px-6 py-5 text-sm text-tinta-suave sm:px-10 print:bg-transparent">
          Documento fictício, gerado pelo projeto de portfólio Orla Vida a partir da cotação nº {apolice.numeroCotacao}.
          Não tem validade jurídica e não representa nenhum seguro real.
        </footer>
      </article>
    </>
  );
}
