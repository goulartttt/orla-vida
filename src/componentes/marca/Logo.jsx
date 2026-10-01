/**
 * Marca da Orla Vida: um sol sobre a curva de uma enseada, que também lembra
 * duas mãos em concha protegendo. Desenhada à mão em SVG.
 */
export function SimboloOrla({ className = 'size-8', titulo }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role={titulo ? 'img' : undefined}
      aria-hidden={titulo ? undefined : true}
      aria-label={titulo}
    >
      <circle cx="16" cy="11.6" r="4.6" fill="var(--sol)" />
      <path
        d="M5 15.4c2.4 0 3.4 2.9 4.9 5.4 1.7 2.8 3.6 4.2 6.1 4.2s4.4-1.4 6.1-4.2c1.5-2.5 2.5-5.4 4.9-5.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ className = '', tamanho = 'normal' }) {
  const grande = tamanho === 'grande';
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <SimboloOrla className={grande ? 'size-11' : 'size-8'} />
      <span
        className={`condensado leading-none font-extrabold tracking-[-0.01em] ${grande ? 'text-3xl' : 'text-[1.45rem]'}`}
      >
        Orla<span className="font-medium"> Vida</span>
      </span>
    </span>
  );
}
