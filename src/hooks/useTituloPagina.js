import { useEffect } from 'react';

/** Atualiza o título da aba, importante para leitores de tela anunciarem a troca de página. */
export function useTituloPagina(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} · Orla Vida` : 'Orla Vida · seguro de vida montado por você (projeto fictício)';
  }, [titulo]);
}
