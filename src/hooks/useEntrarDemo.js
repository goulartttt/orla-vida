import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useSessao } from '../contexto/Sessao.jsx';

/** Cria (ou reaproveita) a sessão de demonstração e leva ao painel. */
export function useEntrarDemo() {
  const { usuario, entrarComDemo } = useSessao();
  const navegar = useNavigate();
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    if (usuario) {
      navegar('/painel');
      return;
    }
    setCarregando(true);
    try {
      await entrarComDemo();
      toast.success('Conta demo criada. Tudo aqui é de exemplo e some em 24 horas.');
      navegar('/painel');
    } catch (erro) {
      toast.error(erro.message);
    } finally {
      setCarregando(false);
    }
  }

  return { entrar, carregando };
}
