import { CircleAlert } from 'lucide-react';
import { useId } from 'react';

/** Rótulo + controle + dica + erro, com tudo ligado por id para leitores de tela. */
function Moldura({ id, rotulo, dica, erro, className = '', children }) {
  const idDica = dica ? `${id}-dica` : undefined;
  const idErro = erro ? `${id}-erro` : undefined;
  const descricao = [idDica, idErro].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="rotulo">
        {rotulo}
      </label>
      {children({ id, 'aria-describedby': descricao, 'aria-invalid': erro ? true : undefined })}
      {dica && !erro && (
        <p id={idDica} className="text-sm text-tinta-suave">
          {dica}
        </p>
      )}
      {erro && (
        <p id={idErro} className="flex items-start gap-1.5 text-sm font-medium text-ameixa">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {erro}
        </p>
      )}
    </div>
  );
}

/** `sufixo`: elemento opcional dentro do campo, à direita (ex.: botão de mostrar senha). */
export function CampoTexto({ rotulo, dica, erro, className, id, sufixo, ...props }) {
  const gerado = useId();
  return (
    <Moldura id={id ?? gerado} rotulo={rotulo} dica={dica} erro={erro} className={className}>
      {(acessibilidade) =>
        sufixo ? (
          <div className="relative">
            <input className="entrada pr-12" {...acessibilidade} {...props} />
            <div className="absolute inset-y-0 right-1 flex items-center">{sufixo}</div>
          </div>
        ) : (
          <input className="entrada" {...acessibilidade} {...props} />
        )
      }
    </Moldura>
  );
}

export function CampoSelecao({ rotulo, dica, erro, className, id, children, ...props }) {
  const gerado = useId();
  return (
    <Moldura id={id ?? gerado} rotulo={rotulo} dica={dica} erro={erro} className={className}>
      {(acessibilidade) => (
        <select className="entrada appearance-auto" {...acessibilidade} {...props}>
          {children}
        </select>
      )}
    </Moldura>
  );
}

/** Mensagem de erro geral do formulário, anunciada assim que aparece. */
export function AlertaFormulario({ children }) {
  if (!children) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-[4px] border border-ameixa/40 bg-ameixa/8 px-3.5 py-3 text-sm font-medium text-ameixa"
    >
      <CircleAlert className="mt-0.5 size-4.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </div>
  );
}
