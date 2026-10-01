const TONS = {
  mar: 'text-mar',
  petroleo: 'text-petroleo',
  sol: 'text-tinta bg-sol/70',
  apagado: 'text-tinta-suave opacity-80',
  // Sobre a capa verde: tinta amarelo-sol, sem preenchimento.
  capa: 'text-sol',
};

/** Carimbo de status, como os de borracha usados em documentos. */
export function Carimbo({ tom = 'mar', bater = false, className = '', children }) {
  return <span className={`carimbo ${TONS[tom]} ${bater ? 'bater' : ''} ${className}`}>{children}</span>;
}

/**
 * Filtro SVG que dá ao carimbo uma borda levemente irregular, como tinta de borracha.
 * Montado uma única vez na raiz do app.
 */
export function FiltroCarimbo() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
      <filter id="tinta-carimbo" x="-5%" y="-20%" width="110%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="ruido" />
        <feDisplacementMap in="SourceGraphic" in2="ruido" scale="1.4" />
      </filter>
    </svg>
  );
}
