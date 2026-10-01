import { Botao } from '../componentes/ui/Botao.jsx';
import { Carimbo } from '../componentes/ui/Carimbo.jsx';
import { Folha } from '../componentes/ui/Folha.jsx';
import { useSessao } from '../contexto/Sessao.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';

export function NaoEncontrada() {
  useTituloPagina('Página não encontrada');
  const { usuario } = useSessao();

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:py-24">
      <Folha tipo="Protocolo" numero="404">
        <div className="flex flex-col items-start gap-5 p-7 sm:p-10">
          <Carimbo tom="petroleo" bater className="text-base!">
            Extraviado
          </Carimbo>
          <h1 className="condensado text-5xl leading-[0.95] font-extrabold">Esta página não está no arquivo.</h1>
          <p className="max-w-[48ch] text-lg text-tinta-suave">
            O endereço pode ter sido digitado errado, ou o documento foi removido. Volte para um lugar conhecido:
          </p>
          <div className="flex flex-wrap gap-3">
            <Botao to="/">Ir para o início</Botao>
            {usuario && (
              <Botao to="/painel" variante="contorno">
                Abrir meu painel
              </Botao>
            )}
          </div>
        </div>
      </Folha>
    </div>
  );
}
