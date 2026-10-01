import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api.js';

/**
 * Busca um recurso da API e expõe os três estados que toda tela precisa tratar:
 * carregando, erro e dados. `recarregar` repete a busca (ex.: botão "Tentar de novo").
 *
 * O resultado guarda a "chave" da busca que o produziu; enquanto a chave atual não
 * tem resultado, a tela está carregando. Assim não é preciso marcar "carregando"
 * dentro do efeito (o que causaria uma renderização extra).
 */
export function useRecurso(caminho) {
  const [versao, setVersao] = useState(0);
  const [resultado, setResultado] = useState({ chave: null, dados: null, erro: null });
  const chave = caminho ? `${caminho}#${versao}` : null;

  useEffect(() => {
    if (!chave) return undefined;
    let ativo = true;
    api
      .obter(caminho)
      .then((dados) => ativo && setResultado({ chave, dados, erro: null }))
      .catch((erro) => ativo && setResultado({ chave, dados: null, erro }));
    return () => {
      ativo = false;
    };
  }, [caminho, chave]);

  const recarregar = useCallback(() => setVersao((v) => v + 1), []);
  const pronto = chave !== null && resultado.chave === chave;

  return {
    dados: pronto ? resultado.dados : null,
    erro: pronto ? resultado.erro : null,
    carregando: chave !== null && !pronto,
    recarregar,
  };
}
