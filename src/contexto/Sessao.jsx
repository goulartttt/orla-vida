import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { aoExpirarSessao, api } from '../lib/api.js';

const SessaoContexto = createContext(null);

export function ProvedorSessao({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    api
      .obter('/auth/me')
      .then((dados) => ativo && setUsuario(dados.usuario))
      .catch(() => ativo && setUsuario(null))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(
    () =>
      aoExpirarSessao(() => {
        setUsuario(null);
        toast.info('Sua sessão expirou. Entre novamente para continuar.', { id: 'sessao-expirada' });
      }),
    [],
  );

  const entrar = useCallback(async (credenciais) => {
    const { usuario: logado } = await api.enviar('/auth/login', credenciais);
    setUsuario(logado);
    return logado;
  }, []);

  const cadastrar = useCallback(async (dados) => {
    const { usuario: criado } = await api.enviar('/auth/cadastro', dados);
    setUsuario(criado);
    return criado;
  }, []);

  const entrarComDemo = useCallback(async () => {
    const { usuario: demo } = await api.enviar('/auth/demo');
    setUsuario(demo);
    return demo;
  }, []);

  const sair = useCallback(async () => {
    await api.enviar('/auth/logout').catch(() => {});
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({ usuario, carregando, entrar, cadastrar, entrarComDemo, sair }),
    [usuario, carregando, entrar, cadastrar, entrarComDemo, sair],
  );

  return <SessaoContexto.Provider value={valor}>{children}</SessaoContexto.Provider>;
}

// eslint-disable-next-line react/only-export-components
export function useSessao() {
  const contexto = useContext(SessaoContexto);
  if (!contexto) throw new Error('useSessao precisa estar dentro de <ProvedorSessao>.');
  return contexto;
}
