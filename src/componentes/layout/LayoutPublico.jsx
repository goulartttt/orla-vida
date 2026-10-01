import { Suspense } from 'react';
import { Link, Outlet } from 'react-router';
import { useSessao } from '../../contexto/Sessao.jsx';
import { Carregando } from '../ui/Estados.jsx';
import { Logo } from '../marca/Logo.jsx';
import { AlternarTema, AvisoFicticio, PularParaConteudo, Rodape } from './Partes.jsx';

export function CabecalhoPublico() {
  const { usuario } = useSessao();

  return (
    <header className="na-capa bg-capa text-capa-tinta">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-5 py-4 sm:px-8">
        <Link to="/" className="mr-auto rounded-[4px]" aria-label="Orla Vida, página inicial">
          <Logo />
        </Link>
        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          <a href="/#como-funciona" className="rounded-[4px] px-3 py-2 hover:bg-capa-funda">
            Como funciona
          </a>
          <a href="/#coberturas" className="rounded-[4px] px-3 py-2 hover:bg-capa-funda">
            Coberturas
          </a>
          <a href="/#duvidas" className="rounded-[4px] px-3 py-2 hover:bg-capa-funda">
            Dúvidas
          </a>
        </nav>
        <AlternarTema className="hover:bg-capa-funda!" />
        {usuario ? (
          <Link
            to="/painel"
            className="estreito rounded-[4px] border border-capa-fio px-4 py-2 font-semibold hover:bg-capa-funda"
          >
            Meu painel
          </Link>
        ) : (
          <Link
            to="/entrar"
            className="estreito rounded-[4px] border border-capa-fio px-4 py-2 font-semibold hover:bg-capa-funda"
          >
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}

export function LayoutPublico() {
  return (
    <div className="flex min-h-dvh flex-col">
      <PularParaConteudo />
      <AvisoFicticio />
      <CabecalhoPublico />
      <main id="conteudo" className="flex-1">
        {/* As páginas carregam sob demanda; o cabeçalho continua visível enquanto isso. */}
        <Suspense fallback={<Carregando className="mx-auto max-w-6xl px-5 py-16 sm:px-8" texto="Carregando página…" />}>
          <Outlet />
        </Suspense>
      </main>
      <Rodape />
    </div>
  );
}
