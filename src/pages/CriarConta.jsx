import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { AcessoLayout } from '../componentes/AcessoLayout.jsx';
import { CampoSenha } from '../componentes/CampoSenha.jsx';
import { Botao } from '../componentes/ui/Botao.jsx';
import { AlertaFormulario, CampoTexto } from '../componentes/ui/Campo.jsx';
import { useSessao } from '../contexto/Sessao.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';

function validar({ nome, email, senha }) {
  const erros = {};
  if (nome.trim().length < 3) erros.nome = 'Informe o nome completo.';
  if (!/^\S+@\S+\.\S+$/.test(email)) erros.email = 'Informe um e-mail válido.';
  if (senha.length < 8 || !/[A-Za-z]/.test(senha) || !/\d/.test(senha)) {
    erros.senha = 'Use pelo menos 8 caracteres, com letras e números.';
  }
  return erros;
}

export default function CriarConta() {
  useTituloPagina('Criar conta');
  const { cadastrar } = useSessao();
  const navegar = useNavigate();
  const [dados, setDados] = useState({ nome: '', email: '', senha: '' });
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [enviando, setEnviando] = useState(false);

  const mudar = (campo) => (e) => setDados((d) => ({ ...d, [campo]: e.target.value }));

  async function enviar(evento) {
    evento.preventDefault();
    setErroGeral('');
    const locais = validar(dados);
    setErros(locais);
    if (Object.keys(locais).length) return;

    setEnviando(true);
    try {
      const usuario = await cadastrar(dados);
      toast.success(`Conta criada. Boas-vindas, ${usuario.nome.split(' ')[0]}!`);
      navegar('/painel', { replace: true });
    } catch (erro) {
      setErros(erro.porCampo?.() ?? {});
      setErroGeral(erro.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AcessoLayout
      titulo="Criar conta"
      tipoDocumento="Cadastro"
      descricao="Com uma conta você salva cotações, contrata e guarda suas apólices. Tudo fictício, mas funcionando de verdade."
    >
      <form onSubmit={enviar} noValidate className="flex flex-col gap-5">
        <AlertaFormulario>{erroGeral}</AlertaFormulario>
        <CampoTexto
          rotulo="Nome completo"
          autoComplete="name"
          required
          value={dados.nome}
          onChange={mudar('nome')}
          erro={erros.nome}
        />
        <CampoTexto
          rotulo="E-mail"
          type="email"
          autoComplete="email"
          required
          value={dados.email}
          onChange={mudar('email')}
          erro={erros.email}
        />
        <CampoSenha
          rotulo="Senha"
          autoComplete="new-password"
          required
          value={dados.senha}
          onChange={mudar('senha')}
          erro={erros.senha}
          dica="Pelo menos 8 caracteres, com letras e números."
        />
        <Botao type="submit" variante="mar" carregando={enviando} className="mt-1 w-full">
          Criar conta
        </Botao>
        <p className="text-center text-tinta-suave">
          Já tem conta?{' '}
          <Link to="/entrar" className="font-semibold text-mar underline">
            Entrar
          </Link>
        </p>
      </form>
    </AcessoLayout>
  );
}
