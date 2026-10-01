import { useCallback, useState } from 'react';

const CHAVE = 'orla-tema';

/** O tema inicial é aplicado por um script no index.html (evita piscar). Aqui só alternamos. */
export function useTema() {
  const [tema, setTema] = useState(() => document.documentElement.dataset.tema ?? 'claro');

  const alternar = useCallback(() => {
    setTema((atual) => {
      const proximo = atual === 'escuro' ? 'claro' : 'escuro';
      document.documentElement.dataset.tema = proximo;
      try {
        localStorage.setItem(CHAVE, proximo);
      } catch {
        // Navegação privada ou armazenamento bloqueado: o tema vale só nesta visita.
      }
      return proximo;
    });
  }, []);

  return { tema, alternar };
}
