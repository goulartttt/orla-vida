import { Sparkles } from 'lucide-react';
import { useEntrarDemo } from '../hooks/useEntrarDemo.js';
import { Botao } from './ui/Botao.jsx';
import { Folha } from './ui/Folha.jsx';

/** Moldura comum de Entrar e Criar conta: texto + atalho da conta demo + formulário. */
export function AcessoLayout({ titulo, descricao, tipoDocumento, children }) {
  const demo = useEntrarDemo();

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_27rem] lg:gap-16 lg:py-20">
      <div className="flex flex-col gap-6">
        <h1 className="condensado text-[clamp(2.8rem,7vw,4.8rem)] leading-[0.9] font-extrabold tracking-[-0.02em]">
          {titulo}
        </h1>
        <p className="max-w-[40ch] text-lg text-tinta-suave">{descricao}</p>

        <div className="mt-2 flex max-w-md flex-col gap-3 rounded-[6px] border-2 border-dashed border-fio-forte px-5 py-5">
          <p className="font-semibold">Só quer conhecer o sistema?</p>
          <p className="text-tinta-suave">
            A conta demo entra na hora, sem cadastro, e já tem uma cotação e uma apólice de exemplo.
          </p>
          <Botao variante="sol" icone={Sparkles} carregando={demo.carregando} onClick={demo.entrar} className="self-start">
            Entrar com conta demo
          </Botao>
        </div>
      </div>

      <Folha tipo={tipoDocumento} className="self-start">
        <div className="p-6 sm:p-8">{children}</div>
      </Folha>
    </div>
  );
}
