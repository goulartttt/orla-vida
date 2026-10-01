import { SimboloOrla } from '../marca/Logo.jsx';

/**
 * Folha de documento: o recipiente principal do app. Tem um cabeçalho de
 * formulário (tipo do documento e número) e o aviso de documento fictício.
 */
export function Folha({ tipo, numero, acoes, className = '', children, as: Tag = 'section', ...resto }) {
  return (
    <Tag className={`folha ${className}`} {...resto}>
      {(tipo || numero || acoes) && (
        <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-fio px-5 py-3 sm:px-7">
          <SimboloOrla className="size-6 text-mar" />
          <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3">
            {tipo && <span className="rotulo text-tinta!">{tipo}</span>}
            <span className="rotulo">Documento fictício</span>
          </div>
          {numero && <span className="estreito text-sm font-semibold tracking-wide">{numero}</span>}
          {acoes}
        </header>
      )}
      {children}
    </Tag>
  );
}

/** Campo de documento: rótulo pequeno em cima, valor embaixo, como num formulário impresso. */
export function CampoDocumento({ rotulo, children, className = '' }) {
  return (
    <div className={`flex min-w-0 flex-col gap-0.5 ${className}`}>
      <dt className="rotulo">{rotulo}</dt>
      <dd className="truncate text-[1.02rem] font-medium">{children}</dd>
    </div>
  );
}

export function Picote({ className = '' }) {
  return <div className={`picote ${className}`} role="presentation" />;
}
