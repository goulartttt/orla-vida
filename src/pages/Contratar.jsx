import { Check, Divide, Plus, Stamp, X } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { CabecalhoPagina } from '../componentes/Documentos.jsx';
import { Botao } from '../componentes/ui/Botao.jsx';
import { AlertaFormulario, CampoSelecao, CampoTexto } from '../componentes/ui/Campo.jsx';
import { Canhotos } from '../componentes/ui/Canhotos.jsx';
import { Carregando, ErroCarregamento } from '../componentes/ui/Estados.jsx';
import { CampoDocumento, Folha, Picote } from '../componentes/ui/Folha.jsx';
import { useCatalogo } from '../hooks/useCatalogo.js';
import { useMarcaTexto } from '../hooks/useMarcaTexto.js';
import { useRecurso } from '../hooks/useRecurso.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { api } from '../lib/api.js';
import { data, reais } from '../lib/formatar.js';
import { montarCanhotos, parcelasDisponiveis, simularPagamento } from '../lib/premio.js';
import { PARENTESCOS } from '../lib/rotulos.js';

const novoBeneficiario = (percentual = 100) => ({ id: crypto.randomUUID(), nome: '', parentesco: '', percentual });

function dividirIgualmente(lista) {
  const base = Math.floor(100 / lista.length);
  return lista.map((b, i) => ({ ...b, percentual: base + (i === 0 ? 100 - base * lista.length : 0) }));
}

function validar(beneficiarios, aceite) {
  const erros = {};
  beneficiarios.forEach((b, i) => {
    if (b.nome.trim().length < 3) erros[`beneficiarios.${i}.nome`] = 'Informe o nome completo.';
    if (!b.parentesco) erros[`beneficiarios.${i}.parentesco`] = 'Escolha o parentesco.';
    if (!Number.isInteger(b.percentual) || b.percentual < 1) erros[`beneficiarios.${i}.percentual`] = 'Mínimo de 1%.';
  });
  const soma = beneficiarios.reduce((s, b) => s + (b.percentual || 0), 0);
  if (soma !== 100) erros.beneficiarios = `A soma está em ${soma}%. Ela precisa fechar em 100%.`;
  if (!aceite) erros.aceite = 'Confirme que você entendeu que este seguro é fictício.';
  return erros;
}

function OpcaoPagamento({ nome, valor, selecionada, aoEscolher, titulo, children, desabilitada }) {
  return (
    <label
      className={`flex cursor-pointer gap-3 rounded-[6px] border-2 p-4 transition-colors ${
        selecionada ? 'border-mar bg-mar/6' : 'border-fio hover:border-fio-forte'
      } ${desabilitada ? 'cursor-not-allowed opacity-55' : ''}`}
    >
      <input
        type="radio"
        name={nome}
        value={valor}
        checked={selecionada}
        onChange={aoEscolher}
        disabled={desabilitada}
        className="mt-1 size-4.5 accent-[var(--mar)]"
      />
      <span className="flex flex-1 flex-col gap-1">
        <span className="font-semibold">{titulo}</span>
        {children}
      </span>
    </label>
  );
}

export default function Contratar() {
  const { numero } = useParams();
  useTituloPagina(`Contratar cotação ${numero}`);
  const navegar = useNavigate();
  const { catalogo, erro: erroCatalogo, tentarDeNovo } = useCatalogo();
  const { dados, erro, recarregar } = useRecurso(`/cotacoes/${numero}`);

  // null = "ainda não escolhido": o padrão é derivado do valor da cotação.
  const [formaEscolhida, setForma] = useState(null);
  const [parcelasEscolhidas, setParcelas] = useState(null);
  const [beneficiarios, setBeneficiarios] = useState(() => [novoBeneficiario()]);
  const [aceite, setAceite] = useState(false);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cotacao = dados?.cotacao;
  const regras = catalogo?.regras;
  const maximo = cotacao && regras ? parcelasDisponiveis(cotacao.premioAnualCentavos, regras) : 0;

  const forma = maximo < 2 ? 'avista' : (formaEscolhida ?? 'parcelado');
  const parcelas = Math.min(parcelasEscolhidas ?? maximo, maximo);

  const pagamento =
    cotacao && regras ? simularPagamento(cotacao.premioAnualCentavos, forma === 'avista' ? 1 : parcelas, regras) : null;
  const soma = beneficiarios.reduce((s, b) => s + (b.percentual || 0), 0);
  const marcados = useMarcaTexto({ total: pagamento?.totalCentavos, parcela: pagamento?.valorParcelaCentavos, soma });

  if (erroCatalogo || erro) {
    return <ErroCarregamento erro={erroCatalogo ?? erro} aoTentarDeNovo={erroCatalogo ? tentarDeNovo : recarregar} />;
  }
  if (!cotacao || !regras || !pagamento) return <Carregando />;
  if (cotacao.status === 'efetivada') return <Navigate to={`/apolices/${cotacao.numeroApolice}`} replace />;

  const mudarBeneficiario = (id, mudanca) =>
    setBeneficiarios((lista) => lista.map((b) => (b.id === id ? { ...b, ...mudanca } : b)));

  async function emitir(evento) {
    evento.preventDefault();
    const encontrados = validar(beneficiarios, aceite);
    setErros(encontrados);
    if (Object.keys(encontrados).length) {
      setErroGeral('Falta pouco: corrija os pontos destacados.');
      return;
    }
    setErroGeral('');
    setEnviando(true);
    try {
      const { apolice } = await api.enviar(`/cotacoes/${numero}/efetivar`, {
        pagamento: forma === 'avista' ? { forma } : { forma, parcelas },
        beneficiarios: beneficiarios.map(({ nome, parentesco, percentual }) => ({ nome: nome.trim(), parentesco, percentual })),
      });
      toast.success('Apólice emitida.');
      navegar(`/apolices/${apolice.numero}`, { state: { recemEmitida: true } });
    } catch (e) {
      setErros(e.porCampo?.() ?? {});
      setErroGeral(e.message);
      setEnviando(false);
    }
  }

  const canhotos = montarCanhotos(pagamento, cotacao.inicioVigencia);

  return (
    <>
      <CabecalhoPagina
        titulo="Contratar"
        descricao="Escolha como pagar e quem recebe. A apólice sai assim que você confirmar."
        voltar={{ para: `/cotacoes/${numero}`, texto: `Cotação nº ${numero}` }}
      />

      <form onSubmit={emitir} noValidate className="flex flex-col gap-6">
        <AlertaFormulario>{erroGeral}</AlertaFormulario>

        <Folha tipo="Proposta" numero={`cotação nº ${cotacao.numero}`}>
          <dl className="grid gap-x-8 gap-y-5 border-b border-fio p-6 sm:grid-cols-3 sm:p-8">
            <CampoDocumento rotulo="Segurado">{cotacao.segurado.nome}</CampoDocumento>
            <CampoDocumento rotulo="Vigência">
              {data(cotacao.inicioVigencia)} a {data(cotacao.fimVigencia)}
            </CampoDocumento>
            <CampoDocumento rotulo="Prêmio anual">{reais(cotacao.premioAnualCentavos)}</CampoDocumento>
          </dl>

          <fieldset className="flex flex-col gap-4 p-6 sm:p-8">
            <legend className="condensado float-left mb-2 w-full text-2xl font-extrabold">Como você quer pagar</legend>
            <div className="grid gap-3 md:grid-cols-2">
              <OpcaoPagamento
                nome="forma"
                valor="avista"
                titulo="À vista, com 5% de desconto"
                selecionada={forma === 'avista'}
                aoEscolher={() => setForma('avista')}
              >
                <span className="text-tinta-suave">
                  {reais(Math.round(cotacao.premioAnualCentavos * (1 - regras.descontoAVista)))} de uma vez
                </span>
              </OpcaoPagamento>
              <OpcaoPagamento
                nome="forma"
                valor="parcelado"
                titulo="Parcelado, sem juros"
                selecionada={forma === 'parcelado'}
                aoEscolher={() => setForma('parcelado')}
                desabilitada={maximo < 2}
              >
                <span className="text-tinta-suave">
                  {maximo < 2 ? 'Indisponível: a parcela ficaria abaixo de R$ 20,00.' : `De 2 a ${maximo} parcelas`}
                </span>
              </OpcaoPagamento>
            </div>

            {forma === 'parcelado' && maximo >= 2 && (
              <CampoSelecao
                rotulo="Número de parcelas"
                value={parcelas}
                onChange={(e) => setParcelas(Number(e.target.value))}
                className="max-w-xs"
              >
                {Array.from({ length: maximo - 1 }, (_, i) => i + 2).map((n) => (
                  <option key={n} value={n}>
                    {n}× de {reais(Math.floor(cotacao.premioAnualCentavos / n))}
                  </option>
                ))}
              </CampoSelecao>
            )}

            <p className="text-lg">
              Total: <strong className={marcados.has('total') ? 'marcado' : ''}>{reais(pagamento.totalCentavos)}</strong>
              {pagamento.descontoCentavos > 0 && (
                <span className="text-tinta-suave"> (você economiza {reais(pagamento.descontoCentavos)})</span>
              )}
            </p>
          </fieldset>

          <Picote />
          <div className="px-6 pt-2 pb-6 sm:px-8 sm:pb-8">
            <p className="rotulo mb-2">Seu carnê</p>
            <Canhotos canhotos={canhotos} marcado={marcados.has('parcela')} />
          </div>
        </Folha>

        <Folha tipo="Beneficiários">
          <fieldset className="flex flex-col gap-5 p-6 sm:p-8">
            <legend className="condensado float-left mb-1 w-full text-2xl font-extrabold">Quem recebe</legend>
            <p className="-mt-2 text-tinta-suave">
              Até {regras.beneficiariosMaximos} pessoas. As porcentagens precisam somar 100%.
            </p>

            <ol className="flex flex-col gap-4">
              {beneficiarios.map((b, i) => (
                <li
                  key={b.id}
                  className="grid gap-4 rounded-[6px] border border-fio p-4 sm:grid-cols-[1fr_12rem_7rem_auto] sm:items-start"
                >
                  <CampoTexto
                    rotulo={`Nome do beneficiário ${i + 1}`}
                    value={b.nome}
                    onChange={(e) => mudarBeneficiario(b.id, { nome: e.target.value })}
                    erro={erros[`beneficiarios.${i}.nome`]}
                  />
                  <CampoSelecao
                    rotulo="Parentesco"
                    value={b.parentesco}
                    onChange={(e) => mudarBeneficiario(b.id, { parentesco: e.target.value })}
                    erro={erros[`beneficiarios.${i}.parentesco`]}
                  >
                    <option value="">Escolha</option>
                    {Object.entries(PARENTESCOS).map(([valor, texto]) => (
                      <option key={valor} value={valor}>
                        {texto}
                      </option>
                    ))}
                  </CampoSelecao>
                  <CampoTexto
                    rotulo="Porcentagem"
                    inputMode="numeric"
                    value={Number.isNaN(b.percentual) ? '' : String(b.percentual)}
                    onChange={(e) => {
                      const digitos = e.target.value.replace(/\D/g, '').slice(0, 3);
                      mudarBeneficiario(b.id, { percentual: digitos === '' ? NaN : Number(digitos) });
                    }}
                    erro={erros[`beneficiarios.${i}.percentual`]}
                  />
                  {beneficiarios.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setBeneficiarios((lista) => lista.filter((x) => x.id !== b.id))}
                      className="inline-flex min-h-11 items-center gap-1 self-end rounded-[4px] px-2 font-semibold text-tinta-suave hover:text-ameixa sm:mt-6"
                      aria-label={`Remover beneficiário ${i + 1}`}
                    >
                      <X className="size-4.5" aria-hidden />
                      <span className="sm:sr-only">Remover</span>
                    </button>
                  )}
                </li>
              ))}
            </ol>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <Botao
                  variante="contorno"
                  tamanho="pequeno"
                  icone={Plus}
                  disabled={beneficiarios.length >= regras.beneficiariosMaximos}
                  onClick={() => setBeneficiarios((lista) => dividirIgualmente([...lista, novoBeneficiario(0)]))}
                >
                  Adicionar pessoa
                </Botao>
                {beneficiarios.length > 1 && (
                  <Botao
                    variante="contorno"
                    tamanho="pequeno"
                    icone={Divide}
                    onClick={() => setBeneficiarios((lista) => dividirIgualmente(lista))}
                  >
                    Dividir igualmente
                  </Botao>
                )}
              </div>
              <p
                className={`inline-flex items-center gap-1.5 font-semibold ${soma === 100 ? 'text-mar' : 'text-ameixa'}`}
                aria-live="polite"
              >
                Soma: <span className={marcados.has('soma') ? 'marcado' : ''}>{soma}%</span>
                {soma === 100 ? <Check className="size-4.5" aria-label="fecha em 100%" /> : ' de 100%'}
              </p>
            </div>
            {erros.beneficiarios && <p className="font-medium text-ameixa">{erros.beneficiarios}</p>}
          </fieldset>
        </Folha>

        <div className="folha flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={aceite}
                onChange={(e) => setAceite(e.target.checked)}
                className="mt-1 size-5 shrink-0 accent-[var(--mar)]"
                aria-invalid={erros.aceite ? true : undefined}
                aria-describedby={erros.aceite ? 'erro-aceite' : undefined}
              />
              <span>Entendo que a Orla Vida é fictícia e que esta apólice não tem nenhum valor real.</span>
            </label>
            {erros.aceite && (
              <p id="erro-aceite" className="mt-2 ml-8 text-sm font-medium text-ameixa">
                {erros.aceite}
              </p>
            )}
          </div>
          <Botao type="submit" variante="sol" tamanho="grande" icone={Stamp} carregando={enviando} className="shrink-0">
            Emitir apólice
          </Botao>
        </div>
      </form>
    </>
  );
}
