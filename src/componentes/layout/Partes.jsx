import { Moon, Sun } from 'lucide-react';
import { Link } from 'react-router';
import { useTema } from '../../hooks/useTema.js';
import { Logo } from '../marca/Logo.jsx';

export function AlternarTema({ className = '' }) {
  const { tema, alternar } = useTema();
  const escuro = tema === 'escuro';
  return (
    <button
      type="button"
      onClick={alternar}
      className={`inline-flex size-11 items-center justify-center rounded-[4px] transition-colors hover:bg-black/10 ${className}`}
      aria-label={escuro ? 'Usar tema claro' : 'Usar tema escuro'}
      title={escuro ? 'Tema claro' : 'Tema escuro'}
    >
      {escuro ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />}
    </button>
  );
}

/** Faixa fina que deixa claro, em todas as páginas, que a empresa é fictícia. */
export function AvisoFicticio() {
  return (
    <p className="nao-imprimir bg-sol px-4 py-1.5 text-center text-[0.8rem] font-semibold text-sol-tinta estreito tracking-[0.02em]">
      Projeto de portfólio: a Orla Vida é uma empresa fictícia e nenhum seguro real é vendido aqui.
    </p>
  );
}

export function PularParaConteudo() {
  return (
    <a
      href="#conteudo"
      className="sr-only z-50 rounded-[4px] bg-sol px-4 py-2 font-semibold text-sol-tinta focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      Pular para o conteúdo
    </a>
  );
}

export function Rodape() {
  return (
    <footer className="nao-imprimir na-capa bg-capa-funda text-capa-tinta">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-[1.2fr_1fr] sm:px-8">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="max-w-md text-capa-suave">
            A Orla Vida é uma seguradora de vida fictícia, criada como projeto de portfólio. Não existe CNPJ,
            registro, atendimento ou contrato real. Os valores e as coberturas são inventados para demonstração.
          </p>
        </div>
        <nav aria-label="Rodapé" className="flex flex-col gap-2 sm:items-end">
          <Link to="/#como-funciona" className="hover:underline">
            Como funciona
          </Link>
          <Link to="/#coberturas" className="hover:underline">
            Coberturas e valores
          </Link>
          <Link to="/#duvidas" className="hover:underline">
            Dúvidas frequentes
          </Link>
          <Link to="/entrar" className="hover:underline">
            Entrar
          </Link>
        </nav>
      </div>
    </footer>
  );
}
