import { useEffect, useRef } from 'react';
import { Botao } from './Botao.jsx';

/**
 * Confirmação de ação destrutiva em <dialog> nativo: prende o foco, fecha com Esc
 * e devolve o foco ao botão que abriu.
 */
export function Confirmacao({ aberto, titulo, children, rotuloConfirmar, carregando, aoConfirmar, aoCancelar }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (aberto && !dialogo.open) dialogo.showModal();
    if (!aberto && dialogo.open) dialogo.close();
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      onCancel={(evento) => {
        evento.preventDefault();
        aoCancelar();
      }}
      aria-labelledby="confirmacao-titulo"
      className="folha m-auto w-[min(28rem,calc(100%-2rem))] p-0 text-tinta backdrop:bg-tinta/45 backdrop:backdrop-blur-[2px]"
    >
      <div className="flex flex-col gap-4 p-6">
        <h2 id="confirmacao-titulo" className="condensado text-2xl font-bold">
          {titulo}
        </h2>
        <div className="text-tinta-suave">{children}</div>
        <div className="mt-2 flex flex-wrap justify-end gap-2">
          <Botao variante="contorno" onClick={aoCancelar} autoFocus>
            Cancelar
          </Botao>
          <Botao variante="perigo" carregando={carregando} onClick={aoConfirmar}>
            {rotuloConfirmar}
          </Botao>
        </div>
      </div>
    </dialog>
  );
}
