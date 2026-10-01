import { lazy, useEffect, useRef } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router';
import { Toaster } from 'sonner';
import { LayoutApp } from './componentes/layout/LayoutApp.jsx';
import { LayoutPublico } from './componentes/layout/LayoutPublico.jsx';
import { RotaProtegida, RotaVisitante } from './componentes/Rotas.jsx';
import { ProvedorSessao } from './contexto/Sessao.jsx';
import { Home } from './pages/Home.jsx';
import { NaoEncontrada } from './pages/NaoEncontrada.jsx';

// A área logada é carregada sob demanda: quem só visita a Home não baixa esse código.
const Entrar = lazy(() => import('./pages/Entrar.jsx'));
const CriarConta = lazy(() => import('./pages/CriarConta.jsx'));
const Painel = lazy(() => import('./pages/Painel.jsx'));
const Cotacoes = lazy(() => import('./pages/Cotacoes.jsx'));
const FormularioCotacao = lazy(() => import('./pages/FormularioCotacao.jsx'));
const DetalheCotacao = lazy(() => import('./pages/DetalheCotacao.jsx'));
const Contratar = lazy(() => import('./pages/Contratar.jsx'));
const Apolices = lazy(() => import('./pages/Apolices.jsx'));
const DetalheApolice = lazy(() => import('./pages/DetalheApolice.jsx'));

/** Ao trocar de página: rola para o topo (ou para a âncora) e leva o foco ao título. */
function GerenciarNavegacao() {
  const { pathname, hash } = useLocation();
  const anterior = useRef(pathname);

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' });
      return;
    }
    // Só move o foco quando a página realmente mudou (não no primeiro carregamento).
    if (anterior.current === pathname) return;
    anterior.current = pathname;
    window.scrollTo(0, 0);
    const titulo = document.querySelector('#conteudo h1');
    if (titulo) {
      titulo.setAttribute('tabindex', '-1');
      titulo.focus({ preventScroll: true });
    }
  }, [pathname, hash]);

  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <ProvedorSessao>
        <GerenciarNavegacao />
        <Toaster
          position="bottom-right"
          mobileOffset={{ bottom: 'calc(5rem + env(safe-area-inset-bottom))' }}
          toastOptions={{
            style: {
              background: 'var(--folha)',
              color: 'var(--tinta)',
              border: '1px solid var(--fio)',
              fontFamily: 'inherit',
            },
          }}
        />
        <Routes>
            <Route element={<LayoutPublico />}>
              <Route index element={<Home />} />
              <Route element={<RotaVisitante />}>
                <Route path="entrar" element={<Entrar />} />
                <Route path="criar-conta" element={<CriarConta />} />
              </Route>
              <Route path="*" element={<NaoEncontrada />} />
            </Route>

            <Route element={<RotaProtegida />}>
              <Route element={<LayoutApp />}>
                <Route path="painel" element={<Painel />} />
                <Route path="cotacoes" element={<Cotacoes />} />
                <Route path="cotacoes/nova" element={<FormularioCotacao />} />
                <Route path="cotacoes/:numero" element={<DetalheCotacao />} />
                <Route path="cotacoes/:numero/editar" element={<FormularioCotacao />} />
                <Route path="cotacoes/:numero/contratar" element={<Contratar />} />
                <Route path="apolices" element={<Apolices />} />
                <Route path="apolices/:numero" element={<DetalheApolice />} />
              </Route>
            </Route>
        </Routes>
      </ProvedorSessao>
    </BrowserRouter>
  );
}
