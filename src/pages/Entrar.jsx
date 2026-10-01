import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { AcessoLayout } from '../componentes/AcessoLayout.jsx';
import { CampoSenha } from '../componentes/CampoSenha.jsx';
import { Botao } from '../componentes/ui/Botao.jsx';
import { AlertaFormulario, CampoTexto } from '../componentes/ui/Campo.jsx';
import { useSessao } from '../contexto/Sessao.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';

export default function Entrar() {
  useTituloPagina('Entrar');
  const { entrar } = useSessao();
  const navegar = useNavigate();
  const local = useLocation();
  const [dados, setDados] = useState({ email: '', senha: '' });
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [enviando, setEnviando] = useState(false);

  const mudar = (campo) => (e) => setDados((d) => ({ ...d, [campo]: e.target.value }));

  async function enviar(evento) {
    evento.preventDefault();
    setErros({});
    setErroGeral('');
    setEnviando(true);
    try {
      const usuario = await entrar(dados);
      toast.success(`Que bom te ver, ${usuario.nome.split(' ')[0]}.`);
      navegar(local.state?.voltarPara ?? '/painel', { replace: true });
    } catch (erro) {
      setErros(erro.porCampo?.() ?? {});
      setErroGeral(erro.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AcessoLayout
      titulo="Entrar"
      tipoDocumento="Acesso"
      descricao="Acesse suas cotações e apólices. Se ainda não tem conta, criar uma leva menos de um minuto."
    >
      <form onSubmit={enviar} noValidate className="flex flex-col gap-5">
        <AlertaFormulario>{erroGeral}</AlertaFormulario>
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
          autoComplete="current-password"
          required
          value={dados.senha}
          onChange={mudar('senha')}
          erro={erros.senha}
        />
        <Botao type="submit" variante="mar" carregando={enviando} className="mt-1 w-full">
          Entrar
        </Botao>
        <p className="text-center text-tinta-suave">
          Não tem conta?{' '}
          <Link to="/criar-conta" className="font-semibold text-mar underline">
            Criar conta
          </Link>
        </p>
      </form>
    </AcessoLayout>
  );
}
