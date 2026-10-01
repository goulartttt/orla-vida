import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { CampoTexto } from './ui/Campo.jsx';

/** Campo de senha com botão para mostrar/ocultar o que foi digitado. */
export function CampoSenha(props) {
  const [visivel, setVisivel] = useState(false);
  return (
    <CampoTexto
      type={visivel ? 'text' : 'password'}
      sufixo={
        <button
          type="button"
          onClick={() => setVisivel((v) => !v)}
          className="inline-flex size-10 items-center justify-center rounded-[4px] text-tinta-suave hover:text-tinta"
          aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={visivel}
        >
          {visivel ? <EyeOff className="size-4.5" aria-hidden /> : <Eye className="size-4.5" aria-hidden />}
        </button>
      }
      {...props}
    />
  );
}
