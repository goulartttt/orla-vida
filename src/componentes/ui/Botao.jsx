import { LoaderCircle } from 'lucide-react';
import { Link } from 'react-router';

const VARIANTES = {
  sol: 'bg-sol text-sol-tinta hover:bg-sol-forte shadow-[0_1px_0_oklch(0.25_0.045_228/0.3),0_10px_20px_-12px_oklch(0.25_0.045_228/0.6)]',
  mar: 'bg-mar text-folha hover:bg-mar-forte',
  contorno: 'border border-fio-forte bg-folha text-tinta hover:bg-folha-funda',
  capa: 'border border-capa-fio text-capa-tinta hover:bg-capa-funda',
  texto: 'px-1! text-mar underline decoration-1 underline-offset-4 hover:decoration-2',
  perigo: 'bg-ameixa text-folha hover:opacity-90',
};

const TAMANHOS = {
  normal: 'min-h-11 px-5 text-[0.95rem]',
  grande: 'min-h-13 px-7 text-[1.05rem]',
  pequeno: 'min-h-9 px-3.5 text-sm',
};

export function Botao({
  variante = 'mar',
  tamanho = 'normal',
  carregando = false,
  icone: Icone,
  to,
  className = '',
  children,
  disabled,
  ...resto
}) {
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-[4px] font-semibold estreito tracking-[0.015em]',
    'transition-[background-color,box-shadow,translate] duration-150 ease-saida active:translate-y-px',
    'disabled:cursor-not-allowed disabled:opacity-60',
    VARIANTES[variante],
    TAMANHOS[tamanho],
    className,
  ].join(' ');

  const conteudo = (
    <>
      {carregando ? (
        <LoaderCircle className="size-4.5 animate-spin" aria-hidden />
      ) : (
        Icone && <Icone className="size-4.5" aria-hidden strokeWidth={2.2} />
      )}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...resto}>
        {conteudo}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled || carregando}
      aria-busy={carregando || undefined}
      {...resto}
    >
      {conteudo}
    </button>
  );
}
