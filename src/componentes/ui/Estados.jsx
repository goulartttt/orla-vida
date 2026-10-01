import { RotateCcw } from 'lucide-react';
import { Botao } from './Botao.jsx';

export function Carregando({ texto = 'Carregando…', className = '' }) {
  return (
    <div role="status" className={`flex flex-col gap-3 ${className}`}>
      <span className="sr-only">{texto}</span>
      <div className="h-5 w-40 animate-pulse rounded bg-fio/70 motion-reduce:animate-none" />
      <div className="h-4 w-full max-w-md animate-pulse rounded bg-fio/50 motion-reduce:animate-none" />
      <div className="h-4 w-2/3 max-w-sm animate-pulse rounded bg-fio/50 motion-reduce:animate-none" />
    </div>
  );
}

export function ErroCarregamento({ erro, aoTentarDeNovo, className = '' }) {
  return (
    <div role="alert" className={`flex flex-col items-start gap-3 ${className}`}>
      <p className="font-semibold">Não conseguimos carregar esta parte.</p>
      <p className="text-tinta-suave">{erro?.message ?? 'Tente novamente em instantes.'}</p>
      {aoTentarDeNovo && (
        <Botao variante="contorno" tamanho="pequeno" icone={RotateCcw} onClick={aoTentarDeNovo}>
          Tentar de novo
        </Botao>
      )}
    </div>
  );
}

/** Estado vazio com moldura tracejada, como um campo de formulário ainda em branco. */
export function Vazio({ titulo, children, acao }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-[6px] border-2 border-dashed border-fio-forte/70 px-6 py-8 sm:px-8">
      <h2 className="condensado text-2xl font-bold">{titulo}</h2>
      {children && <p className="max-w-prose text-tinta-suave">{children}</p>}
      {acao}
    </div>
  );
}
