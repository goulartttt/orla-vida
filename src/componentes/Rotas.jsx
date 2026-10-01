import { Navigate, Outlet, useLocation } from 'react-router';
import { useSessao } from '../contexto/Sessao.jsx';
import { Carregando } from './ui/Estados.jsx';

function Aguardando() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <Carregando texto="Verificando sua sessão…" />
    </div>
  );
}

/** Só deixa passar quem está logado; os demais vão para /entrar e voltam depois. */
export function RotaProtegida() {
  const { usuario, carregando } = useSessao();
  const local = useLocation();
  if (carregando) return <Aguardando />;
  if (!usuario) return <Navigate to="/entrar" replace state={{ voltarPara: local.pathname }} />;
  return <Outlet />;
}

/** Telas de entrar e criar conta: quem já está logado vai direto para o painel. */
export function RotaVisitante() {
  const { usuario, carregando } = useSessao();
  if (carregando) return <Aguardando />;
  if (usuario) return <Navigate to="/painel" replace />;
  return <Outlet />;
}
