import { ArrowRight, FileText, PencilLine, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { CabecalhoPagina, TabelaCoberturas } from '../componentes/Documentos.jsx';
import { Botao } from '../componentes/ui/Botao.jsx';
import { Carimbo } from '../componentes/ui/Carimbo.jsx';
import { Confirmacao } from '../componentes/ui/Confirmacao.jsx';
import { Carregando, ErroCarregamento } from '../componentes/ui/Estados.jsx';
import { CampoDocumento, Folha } from '../componentes/ui/Folha.jsx';
import { useRecurso } from '../hooks/useRecurso.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { api } from '../lib/api.js';
import { data, dataHora } from '../lib/formatar.js';
import { hoje } from '../lib/datas.js';
import { STATUS_COTACAO } from '../lib/rotulos.js';

export default function DetalheCotacao() {
  const { numero } = useParams();
  useTituloPagina(`Cotação ${numero}`);
  const navegar = useNavigate();
  const { dados, erro, carregando, recarregar } = useRecurso(`/cotacoes/${numero}`);
  const [confirmando, setConfirmando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  async function excluir() {
    setExcluindo(true);
    try {
      await api.remover(`/cotacoes/${numero}`);
      toast.success(`Cotação nº ${numero} excluída.`);
      navegar('/cotacoes');
    } catch (e) {
      toast.error(e.message);
      setExcluindo(false);
      setConfirmando(false);
    }
  }

  const voltar = { para: '/cotacoes', texto: 'Cotações' };
  if (carregando) return <Carregando />;
  if (erro) {
    return (
      <>
        <CabecalhoPagina titulo={`Cotação nº ${numero}`} voltar={voltar} />
        <ErroCarregamento erro={erro} aoTentarDeNovo={erro.status === 404 ? undefined : recarregar} />
      </>
    );
  }

  const { cotacao } = dados;
  const aberta = cotacao.status === 'aberta';
  const status = STATUS_COTACAO[cotacao.status];
  const vencida = aberta && cotacao.inicioVigencia < hoje();

  return (
    <>
      <CabecalhoPagina
        titulo={`Cotação nº ${cotacao.numero}`}
        descricao={
          aberta
            ? 'Confira os dados. Se estiver tudo certo, é só contratar.'
            : 'Esta cotação foi contratada e virou apólice.'
        }
        voltar={voltar}
        acoes={
          aberta ? (
            <>
              <Botao to={`/cotacoes/${numero}/editar`} variante="contorno" icone={PencilLine}>
                Editar
              </Botao>
              <Botao to={`/cotacoes/${numero}/contratar`} variante="sol" icone={ArrowRight}>
                Contratar
              </Botao>
            </>
          ) : (
            <Botao to={`/apolices/${cotacao.numeroApolice}`} icone={FileText}>
              Ver apólice
            </Botao>
          )
        }
      />

      {vencida && (
        <p className="mb-6 rounded-[4px] border border-dashed border-ameixa/60 px-4 py-3 text-ameixa">
          A data de início desta cotação já passou. Edite a cotação e escolha uma nova data antes de contratar.
        </p>
      )}

      <Folha tipo="Cotação" numero={`nº ${cotacao.numero}`} acoes={<Carimbo tom={status.tom}>{status.texto}</Carimbo>}>
        <dl className="grid gap-x-8 gap-y-5 border-b border-fio p-6 sm:grid-cols-3 sm:p-8">
          <CampoDocumento rotulo="Segurado" className="sm:col-span-3">
            {cotacao.segurado.nome}
          </CampoDocumento>
          <CampoDocumento rotulo="CPF">{cotacao.segurado.cpf}</CampoDocumento>
          <CampoDocumento rotulo="Nascimento">{data(cotacao.segurado.dataNascimento)}</CampoDocumento>
          <CampoDocumento rotulo="Vigência">
            {data(cotacao.inicioVigencia)} a {data(cotacao.fimVigencia)}
          </CampoDocumento>
        </dl>
        <div className="p-6 sm:p-8">
          <TabelaCoberturas coberturas={cotacao.coberturas} premioAnualCentavos={cotacao.premioAnualCentavos} />
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-fio px-6 py-4 text-sm text-tinta-suave sm:px-8">
          <span>
            Criada em {dataHora(cotacao.criadaEm)}
            {cotacao.atualizadaEm !== cotacao.criadaEm && ` · alterada em ${dataHora(cotacao.atualizadaEm)}`}
          </span>
          {aberta && (
            <button
              type="button"
              onClick={() => setConfirmando(true)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-[4px] px-2 font-semibold text-ameixa hover:underline"
            >
              <Trash2 className="size-4" aria-hidden />
              Excluir cotação
            </button>
          )}
        </footer>
      </Folha>

      <Confirmacao
        aberto={confirmando}
        titulo={`Excluir a cotação nº ${numero}?`}
        rotuloConfirmar="Excluir"
        carregando={excluindo}
        aoConfirmar={excluir}
        aoCancelar={() => setConfirmando(false)}
      >
        A cotação de {cotacao.segurado.nome} será apagada. Essa ação não pode ser desfeita.
      </Confirmacao>
    </>
  );
}
