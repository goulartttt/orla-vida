import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

// O catálogo de coberturas é público e quase nunca muda: busca uma vez por visita.
let promessa = null;
let emCache = null;

function carregarCatalogo() {
  promessa ??= api
    .obter('/coberturas')
    .then((catalogo) => (emCache = catalogo))
    .catch((erro) => {
      promessa = null;
      throw erro;
    });
  return promessa;
}

export function useCatalogo() {
  const [tentativa, setTentativa] = useState(0);
  const [resultado, setResultado] = useState(() =>
    emCache ? { tentativa: 0, catalogo: emCache, erro: null } : { tentativa: -1, catalogo: null, erro: null },
  );

  useEffect(() => {
    let ativo = true;
    carregarCatalogo()
      .then((catalogo) => ativo && setResultado({ tentativa, catalogo, erro: null }))
      .catch((erro) => ativo && setResultado({ tentativa, catalogo: null, erro }));
    return () => {
      ativo = false;
    };
  }, [tentativa]);

  const pronto = resultado.tentativa === tentativa;
  return {
    catalogo: pronto ? resultado.catalogo : null,
    erro: pronto ? resultado.erro : null,
    carregando: !pronto,
    tentarDeNovo: () => setTentativa((t) => t + 1),
  };
}
