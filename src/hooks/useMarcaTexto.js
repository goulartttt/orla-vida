import { useEffect, useRef, useState } from 'react';

/**
 * Recebe um objeto { chave: valor } e devolve o conjunto de chaves cujo valor
 * mudou na última interação. Elas ficam "marcadas" até a próxima mudança.
 */
export function useMarcaTexto(valores) {
  const chave = JSON.stringify(valores);
  const anterior = useRef(valores);
  const [marcados, setMarcados] = useState(() => new Set());

  useEffect(() => {
    const atuais = JSON.parse(chave);
    // Um valor que acabou de aparecer (antes indefinido) não é "mudança": é só o carregamento.
    const mudaram = Object.keys(atuais).filter(
      (k) => anterior.current[k] !== undefined && anterior.current[k] !== null && anterior.current[k] !== atuais[k],
    );
    anterior.current = atuais;
    setMarcados(new Set(mudaram));
  }, [chave]);

  return marcados;
}

/** Texto para região aria-live, atualizado só depois que a pessoa para de mexer. */
export function useAnuncioAtrasado(texto, atrasoMs = 600) {
  const [anuncio, setAnuncio] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setAnuncio(texto), atrasoMs);
    return () => clearTimeout(timer);
  }, [texto, atrasoMs]);
  return anuncio;
}
