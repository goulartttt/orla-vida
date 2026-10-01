import { ArrowLeft, ArrowRight, Check, Lock } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { CabecalhoPagina, TabelaCoberturas } from '../componentes/Documentos.jsx';
import { Botao } from '../componentes/ui/Botao.jsx';
import { AlertaFormulario, CampoTexto } from '../componentes/ui/Campo.jsx';
import { Carregando, ErroCarregamento, Vazio } from '../componentes/ui/Estados.jsx';
import { CampoDocumento, Folha } from '../componentes/ui/Folha.jsx';
import { useCatalogo } from '../hooks/useCatalogo.js';
import { useMarcaTexto } from '../hooks/useMarcaTexto.js';
import { useRecurso } from '../hooks/useRecurso.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { api } from '../lib/api.js';
import { cpfValido, mascararDigitacao } from '../lib/cpf.js';
import { hoje, idadeEm, somarAnos, somarDias } from '../lib/datas.js';
import { data, reais, reaisInteiros } from '../lib/formatar.js';
import { parcelasDisponiveis, premioCoberturaCentavos } from '../lib/premio.js';

const ETAPAS = ['Segurado', 'Coberturas', 'Revisão'];
const CAPITAL_PADRAO = 200_000;

function formularioInicial(catalogo, cotacao) {
  const contratadas = new Map(cotacao?.coberturas.map((c) => [c.codigo, c.capital]));
  return {
    segurado: {
      nome: cotacao?.segurado.nome ?? '',
      cpf: cotacao?.segurado.cpf ?? '',
      dataNascimento: cotacao?.segurado.dataNascimento ?? '',
    },
    inicioVigencia: cotacao && cotacao.inicioVigencia >= hoje() ? cotacao.inicioVigencia : hoje(),
    coberturas: Object.fromEntries(
      catalogo.coberturas.map((c) => [
        c.codigo,
        {
          ativa: c.obrigatoria || contratadas.has(c.codigo),
          capital: contratadas.get(c.codigo) ?? (c.obrigatoria ? CAPITAL_PADRAO : c.capitalMinimo),
        },
      ]),
    ),
  };
}

function validarSegurado(form, regras) {
  const erros = {};
  const { nome, cpf, dataNascimento } = form.segurado;
  const limite = somarDias(hoje(), regras.diasMaximosParaInicio);

  if (nome.trim().length < 3) erros['segurado.nome'] = 'Informe o nome completo do segurado.';
  if (!cpfValido(cpf)) erros['segurado.cpf'] = 'Confira o CPF: os dígitos verificadores não batem.';
  if (!form.inicioVigencia || form.inicioVigencia < hoje() || form.inicioVigencia > limite) {
    erros.inicioVigencia = `Escolha uma data entre hoje e ${data(limite)}.`;
  }
  if (!dataNascimento) {
    erros['segurado.dataNascimento'] = 'Informe a data de nascimento.';
  } else {
    const idade = idadeEm(dataNascimento, form.inicioVigencia || hoje());
    if (idade < regras.idadeMinima || idade > regras.idadeMaxima) {
      erros['segurado.dataNascimento'] =
        `O segurado precisa ter entre ${regras.idadeMinima} e ${regras.idadeMaxima} anos no início do seguro.`;
    }
  }
  return erros;
}

function validarCoberturas(form, catalogo) {
  const erros = {};
  const principal = catalogo.coberturas.find((c) => c.obrigatoria);
  const capitalPrincipal = form.coberturas[principal.codigo].capital;

  for (const c of catalogo.coberturas) {
    const escolha = form.coberturas[c.codigo];
    if (!escolha.ativa) continue;
    if (escolha.capital < c.capitalMinimo || escolha.capital > c.capitalMaximo) {
      erros[`coberturas.${c.codigo}`] =
        `Escolha um valor entre ${reaisInteiros(c.capitalMinimo)} e ${reaisInteiros(c.capitalMaximo)}.`;
    } else if (!c.obrigatoria && escolha.capital > capitalPrincipal) {
      erros[`coberturas.${c.codigo}`] = `Não pode passar do capital da cobertura principal (${reaisInteiros(capitalPrincipal)}).`;
    }
  }
  return erros;
}

function IndicadorEtapas({ etapa, aoVoltarPara }) {
  return (
    <ol className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-3" aria-label="Etapas da cotação">
      {ETAPAS.map((nome, i) => {
        const feita = i < etapa;
        const atual = i === etapa;
        const conteudo = (
          <>
            <span
              className={`inline-flex size-8 items-center justify-center rounded-full border-2 text-sm font-bold ${
                atual ? 'border-mar bg-mar text-folha' : feita ? 'border-mar text-mar' : 'border-fio-forte text-tinta-suave'
              }`}
            >
              {feita ? <Check className="size-4" aria-hidden /> : i + 1}
            </span>
            <span className={`estreito font-semibold ${atual ? '' : 'text-tinta-suave'}`}>{nome}</span>
          </>
        );
        return (
          <li key={nome} className="flex items-center gap-2" aria-current={atual ? 'step' : undefined}>
            {feita ? (
              <button
                type="button"
                onClick={() => aoVoltarPara(i)}
                className="flex items-center gap-2 rounded-[4px] hover:underline"
                aria-label={`Voltar para a etapa ${i + 1}, ${nome}`}
              >
                {conteudo}
              </button>
            ) : (
              conteudo
            )}
            {i < ETAPAS.length - 1 && <span className="mx-1 h-px w-6 bg-fio-forte sm:w-10" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}

function CampoCapital({ cobertura, escolha, erro, aoMudar }) {
  return (
    <CampoTexto
      rotulo="Capital"
      inputMode="numeric"
      value={escolha.capital ? escolha.capital.toLocaleString('pt-BR') : ''}
      onChange={(e) => aoMudar(Number(e.target.value.replace(/\D/g, '').slice(0, 9)) || 0)}
      dica={`De ${reaisInteiros(cobertura.capitalMinimo)} a ${reaisInteiros(cobertura.capitalMaximo)}`}
      erro={erro}
      className="w-full sm:w-56"
    />
  );
}

export default function FormularioCotacao() {
  const { numero } = useParams();
  const editando = Boolean(numero);
  useTituloPagina(editando ? `Editar cotação ${numero}` : 'Nova cotação');

  const navegar = useNavigate();
  const { catalogo, erro: erroCatalogo, tentarDeNovo } = useCatalogo();
  const existente = useRecurso(editando ? `/cotacoes/${numero}` : null);
  const cotacao = existente.dados?.cotacao;

  // Enquanto a pessoa não mexe, o formulário é derivado do catálogo (e da cotação, ao editar).
  const [editado, setEditado] = useState(null);
  const [etapa, setEtapa] = useState(0);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [salvando, setSalvando] = useState(false);

  const pronto = Boolean(catalogo) && (!editando || Boolean(cotacao));
  const form = editado ?? (pronto ? formularioInicial(catalogo, cotacao) : null);
  const setForm = (atualizar) => setEditado((atual) => atualizar(atual ?? form));

  const coberturasCalculadas = form
    ? catalogo.coberturas
        .filter((c) => form.coberturas[c.codigo].ativa)
        .map((c) => ({
          codigo: c.codigo,
          nome: c.nome,
          capital: form.coberturas[c.codigo].capital,
          premioAnualCentavos: premioCoberturaCentavos(form.coberturas[c.codigo].capital, c.taxaAnual),
        }))
    : [];
  const total = coberturasCalculadas.reduce((soma, c) => soma + c.premioAnualCentavos, 0);
  const marcados = useMarcaTexto({
    total,
    ...Object.fromEntries(coberturasCalculadas.map((c) => [c.codigo, c.premioAnualCentavos])),
  });

  const erroCarga = erroCatalogo ?? existente.erro;
  if (erroCarga) {
    return <ErroCarregamento erro={erroCarga} aoTentarDeNovo={erroCatalogo ? tentarDeNovo : existente.recarregar} />;
  }
  if (editando && cotacao?.status === 'efetivada') {
    return (
      <Vazio
        titulo="Esta cotação já foi contratada"
        acao={<Botao to={`/apolices/${cotacao.numeroApolice}`}>Ver a apólice</Botao>}
      >
        Depois de virar apólice, os dados ficam guardados como foram contratados e não podem mais ser alterados.
      </Vazio>
    );
  }
  if (!form) return <Carregando texto="Preparando o formulário…" />;

  const mudarSegurado = (campo) => (e) =>
    setForm((f) => ({
      ...f,
      segurado: { ...f.segurado, [campo]: campo === 'cpf' ? mascararDigitacao(e.target.value) : e.target.value },
    }));

  const mudarCobertura = (codigo, mudanca) =>
    setForm((f) => ({ ...f, coberturas: { ...f.coberturas, [codigo]: { ...f.coberturas[codigo], ...mudanca } } }));

  function avancar() {
    const encontrados = etapa === 0 ? validarSegurado(form, catalogo.regras) : validarCoberturas(form, catalogo);
    setErros(encontrados);
    if (Object.keys(encontrados).length) {
      setErroGeral('Corrija os campos destacados para continuar.');
      return;
    }
    setErroGeral('');
    setEtapa((e) => e + 1);
  }

  async function salvar() {
    const payload = {
      segurado: { ...form.segurado, nome: form.segurado.nome.trim() },
      coberturas: coberturasCalculadas.map(({ codigo, capital }) => ({ codigo, capital })),
      inicioVigencia: form.inicioVigencia,
    };
    setSalvando(true);
    setErroGeral('');
    try {
      const resposta = editando
        ? await api.atualizar(`/cotacoes/${numero}`, payload)
        : await api.enviar('/cotacoes', payload);
      toast.success(editando ? 'Cotação atualizada.' : `Cotação nº ${resposta.cotacao.numero} salva.`);
      navegar(`/cotacoes/${resposta.cotacao.numero}`);
    } catch (erro) {
      // A API aponta coberturas por posição (coberturas.0.capital); traduzimos para o código.
      const traduzidos = {};
      for (const { campo, mensagem } of erro.campos ?? []) {
        const posicao = campo.match(/^coberturas\.(\d+)/);
        traduzidos[posicao ? `coberturas.${payload.coberturas[Number(posicao[1])]?.codigo}` : campo] = mensagem;
      }
      setErros(traduzidos);
      setErroGeral(erro.message);
      if (Object.keys(traduzidos).some((c) => c.startsWith('segurado') || c === 'inicioVigencia')) setEtapa(0);
      else if (Object.keys(traduzidos).some((c) => c.startsWith('coberturas'))) setEtapa(1);
    } finally {
      setSalvando(false);
    }
  }

  const fim = form.inicioVigencia ? somarAnos(form.inicioVigencia, 1) : null;
  const maxParcelas = parcelasDisponiveis(total, catalogo.regras);

  return (
    <>
      <CabecalhoPagina
        titulo={editando ? `Editar cotação nº ${numero}` : 'Nova cotação'}
        descricao="Três passos: quem é o segurado, o que o seguro cobre e uma revisão antes de salvar."
        voltar={editando ? { para: `/cotacoes/${numero}`, texto: 'Voltar para a cotação' } : { para: '/cotacoes', texto: 'Cotações' }}
      />
      <IndicadorEtapas etapa={etapa} aoVoltarPara={setEtapa} />

      <div className="mb-6">
        <AlertaFormulario>{erroGeral}</AlertaFormulario>
      </div>

      {etapa === 0 && (
        <Folha
          tipo="Dados do segurado"
          as="form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            avancar();
          }}
        >
          <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
            <CampoTexto
              rotulo="Nome completo"
              autoComplete="off"
              value={form.segurado.nome}
              onChange={mudarSegurado('nome')}
              erro={erros['segurado.nome']}
              className="sm:col-span-2"
            />
            <CampoTexto
              rotulo="CPF"
              inputMode="numeric"
              autoComplete="off"
              placeholder="000.000.000-00"
              value={form.segurado.cpf}
              onChange={mudarSegurado('cpf')}
              erro={erros['segurado.cpf']}
              dica="Só números; a pontuação entra sozinha."
            />
            <CampoTexto
              rotulo="Data de nascimento"
              type="date"
              max={hoje()}
              value={form.segurado.dataNascimento}
              onChange={mudarSegurado('dataNascimento')}
              erro={erros['segurado.dataNascimento']}
            />
            <CampoTexto
              rotulo="Início do seguro"
              type="date"
              min={hoje()}
              max={somarDias(hoje(), catalogo.regras.diasMaximosParaInicio)}
              value={form.inicioVigencia}
              onChange={(e) => setForm((f) => ({ ...f, inicioVigencia: e.target.value }))}
              erro={erros.inicioVigencia}
              dica={fim ? `O seguro vale 1 ano, até ${data(fim)}.` : undefined}
            />
          </div>
          <div className="flex justify-end border-t border-fio px-6 py-4 sm:px-8">
            <Botao type="submit" icone={ArrowRight}>
              Continuar para coberturas
            </Botao>
          </div>
        </Folha>
      )}

      {etapa === 1 && (
        <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
          <Folha tipo="Coberturas">
            <ul className="divide-y divide-fio">
              {catalogo.coberturas.map((c) => {
                const escolha = form.coberturas[c.codigo];
                const calculada = coberturasCalculadas.find((x) => x.codigo === c.codigo);
                return (
                  <li key={c.codigo} className={`flex flex-col gap-4 p-6 sm:p-7 ${escolha.ativa ? '' : 'bg-folha-funda/60'}`}>
                    <div className="flex items-start gap-3">
                      {c.obrigatoria ? (
                        <Lock className="mt-1 size-5 shrink-0 text-mar" aria-hidden />
                      ) : (
                        <input
                          id={`cob-${c.codigo}`}
                          type="checkbox"
                          checked={escolha.ativa}
                          onChange={(e) => mudarCobertura(c.codigo, { ativa: e.target.checked })}
                          className="mt-1 size-5 shrink-0 accent-[var(--mar)]"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <label htmlFor={c.obrigatoria ? undefined : `cob-${c.codigo}`} className="text-lg font-semibold">
                          {c.nome}
                          {c.obrigatoria && <span className="rotulo ml-2">obrigatória</span>}
                        </label>
                        <p className="mt-1 max-w-[60ch] text-tinta-suave">{c.descricao}</p>
                      </div>
                    </div>
                    {escolha.ativa && (
                      <div className="flex flex-wrap items-start justify-between gap-4 sm:pl-8">
                        <CampoCapital
                          cobertura={c}
                          escolha={escolha}
                          erro={erros[`coberturas.${c.codigo}`]}
                          aoMudar={(capital) => mudarCobertura(c.codigo, { capital })}
                        />
                        <div className="text-right">
                          <p className="rotulo">Prêmio anual</p>
                          <p className="text-xl font-semibold">
                            <span className={marcados.has(c.codigo) ? 'marcado' : ''}>
                              {reais(calculada.premioAnualCentavos)}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            {erros.coberturas && <p className="px-7 pb-5 font-medium text-ameixa">{erros.coberturas}</p>}
          </Folha>

          <aside className="folha flex flex-col gap-4 p-6 lg:sticky lg:top-6" aria-label="Resumo do valor">
            <p className="rotulo">Prêmio anual estimado</p>
            <p className="condensado text-5xl leading-none font-extrabold">
              <span className={marcados.has('total') ? 'marcado' : ''}>{reais(total)}</span>
            </p>
            <p className="text-sm text-tinta-suave">
              {maxParcelas >= 2
                ? `Em até ${maxParcelas}× de ${reais(Math.floor(total / maxParcelas))} sem juros, ou à vista com 5% de desconto.`
                : 'Para este valor, o pagamento é à vista, com 5% de desconto.'}
            </p>
            <div className="flex flex-col gap-2 border-t border-dashed border-fio-forte pt-4">
              <Botao onClick={avancar} icone={ArrowRight}>
                Revisar cotação
              </Botao>
              <Botao variante="texto" icone={ArrowLeft} onClick={() => setEtapa(0)} className="self-center">
                Voltar
              </Botao>
            </div>
          </aside>
        </div>
      )}

      {etapa === 2 && (
        <Folha tipo="Cotação" numero={editando ? `nº ${numero}` : 'nova'}>
          <dl className="grid gap-x-8 gap-y-5 border-b border-fio p-6 sm:grid-cols-3 sm:p-8">
            <CampoDocumento rotulo="Segurado" className="sm:col-span-3">
              {form.segurado.nome}
            </CampoDocumento>
            <CampoDocumento rotulo="CPF">{form.segurado.cpf}</CampoDocumento>
            <CampoDocumento rotulo="Nascimento">{data(form.segurado.dataNascimento)}</CampoDocumento>
            <CampoDocumento rotulo="Vigência">
              {data(form.inicioVigencia)} a {data(fim)}
            </CampoDocumento>
          </dl>
          <div className="p-6 sm:p-8">
            <TabelaCoberturas coberturas={coberturasCalculadas} premioAnualCentavos={total} />
            <p className="mt-4 text-sm text-tinta-suave">
              Ao salvar, o valor é conferido e calculado de novo pelo servidor. Você ainda pode editar ou excluir a
              cotação depois.
            </p>
          </div>
          <div className="flex flex-wrap justify-between gap-3 border-t border-fio px-6 py-4 sm:px-8">
            <Botao variante="contorno" icone={ArrowLeft} onClick={() => setEtapa(1)}>
              Voltar
            </Botao>
            <Botao variante="sol" icone={Check} carregando={salvando} onClick={salvar}>
              {editando ? 'Salvar alterações' : 'Salvar cotação'}
            </Botao>
          </div>
        </Folha>
      )}
    </>
  );
}
