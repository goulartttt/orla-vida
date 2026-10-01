import { FileText, LayoutDashboard, LogOut, NotebookPen } from 'lucide-react';
import { Suspense } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useSessao } from '../../contexto/Sessao.jsx';
import { Carregando } from '../ui/Estados.jsx';
import { Logo } from '../marca/Logo.jsx';
import { AlternarTema, AvisoFicticio, PularParaConteudo } from './Partes.jsx';

const ITENS = [
  { to: '/painel', rotulo: 'Painel', icone: LayoutDashboard },
  { to: '/cotacoes', rotulo: 'Cotações', icone: NotebookPen },
  { to: '/apolices', rotulo: 'Apólices', icone: FileText },
];

function BotaoSair() {
  const { sair } = useSessao();
  const navegar = useNavigate();
  return (
    <button
      type="button"
      onClick={async () => {
        await sair();
        toast.success('Você saiu da sua conta.');
        navegar('/');
      }}
      className="inline-flex min-h-11 items-center gap-2 rounded-[4px] px-3 hover:bg-capa-funda"
    >
      <LogOut className="size-4.5" aria-hidden />
      <span className="estreito font-semibold">Sair</span>
    </button>
  );
}

export function LayoutApp() {
  const { usuario } = useSessao();

  return (
    <div className="flex min-h-dvh flex-col pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0">
      <PularParaConteudo />
      <AvisoFicticio />
      <header className="nao-imprimir na-capa bg-capa text-capa-tinta">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-5 py-3 sm:px-8">
          <Link to="/painel" className="mr-4 rounded-[4px]" aria-label="Orla Vida, ir para o painel">
            <Logo />
          </Link>

          <nav aria-label="Principal" className="hidden flex-1 items-center gap-1 md:flex">
            {ITENS.map(({ to, rotulo }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `estreito rounded-[4px] px-3.5 py-2 font-semibold transition-colors ${
                    isActive ? 'bg-capa-tinta text-capa' : 'hover:bg-capa-funda'
                  }`
                }
              >
                {rotulo}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <span className="mr-2 hidden flex-col items-end leading-tight lg:flex">
              <span className="font-semibold">{usuario?.nome}</span>
              {usuario?.demo && <span className="text-xs text-capa-suave">conta demo · apagada em 24 h</span>}
            </span>
            <AlternarTema />
            <BotaoSair />
          </div>
        </div>
      </header>

      <main id="conteudo" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8 sm:py-10">
        <Suspense fallback={<Carregando texto="Carregando página…" />}>
          <Outlet />
        </Suspense>
      </main>

      {/* No celular, a navegação vira uma barra de abas no rodapé, ao alcance do polegar. */}
      <nav
        aria-label="Principal"
        className="nao-imprimir fixed inset-x-0 bottom-0 z-30 border-t border-fio bg-folha pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="grid grid-cols-3">
          {ITENS.map(({ to, rotulo, icone: Icone }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex min-h-[4.25rem] flex-col items-center justify-center gap-1 estreito text-[0.8rem] font-semibold ${
                    isActive ? 'text-mar' : 'text-tinta-suave'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icone className="size-5.5" aria-hidden strokeWidth={isActive ? 2.4 : 1.8} />
                    {rotulo}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
