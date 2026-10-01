const TONS = {
  // Carimbo cheio: amarelo-sol com tinta escura (contratada, vigente).
  sol: 'bg-sol text-sol-tinta',
  // Carimbo leve: só um véu de amarelo (em aberto, começa em breve, obrigatória).
  'sol-claro': 'bg-sol/30 text-tinta',
  // Encerrado: sem cor, como um carimbo antigo.
  apagado: 'text-tinta-suave',
  // Sobre a capa verde: tinta amarelo-sol, sem preenchimento.
  capa: 'text-sol',
};

/** Inclinação estável derivada do texto: cada carimbo "bate" num ângulo próprio. */
function inclinacao(texto) {
  let soma = 0;
  for (const letra of String(texto)) soma = (soma * 31 + letra.charCodeAt(0)) % 997;
  return `${(soma % 7) - 4}deg`;
}

/** Carimbo de status, como os de borracha usados em documentos. */
export function Carimbo({ tom = 'sol', bater = false, className = '', style, children }) {
  return (
    <span
      className={`carimbo ${TONS[tom]} ${bater ? 'bater' : ''} ${className}`}
      style={{ '--inclinacao': inclinacao(children), ...style }}
    >
      {children}
    </span>
  );
}
