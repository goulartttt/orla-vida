import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ApoliceViva } from './ApoliceViva.jsx';

const catalogo = {
  regras: { descontoAVista: 0.05, parcelasMaximas: 12, parcelaMinimaCentavos: 2000 },
  coberturas: [
    { codigo: 'MORTE', nome: 'Morte', obrigatoria: true, capitalMinimo: 10_000, capitalMaximo: 1_000_000, taxaAnual: 0.003 },
    { codigo: 'EXTRA', nome: 'Extra', obrigatoria: false, capitalMinimo: 10_000, capitalMaximo: 500_000, taxaAnual: 0.001 },
  ],
};

const premioAnual = () => screen.getByText('Prêmio anual').nextElementSibling.textContent.replace(/\s/g, ' ');

describe('ApoliceViva', () => {
  it('recalcula o prêmio ao mexer no capital e marca o valor que mudou', () => {
    render(<ApoliceViva catalogo={catalogo} />);
    // 300.000 × 0,3% + 150.000 × 0,1% = 900 + 150
    expect(premioAnual()).toBe('R$ 1.050,00');

    fireEvent.change(screen.getByLabelText('Quanto sua família recebe'), { target: { value: '500000' } });
    expect(premioAnual()).toBe('R$ 1.750,00');
    expect(screen.getByText('R$ 1.750,00')).toHaveClass('marcado');
  });

  it('liga e desliga coberturas adicionais', () => {
    render(<ApoliceViva catalogo={catalogo} />);
    fireEvent.click(screen.getByLabelText(/Extra/));
    expect(premioAnual()).toBe('R$ 900,00');
  });

  it('troca entre parcelado e à vista e re-picota o carnê', () => {
    render(<ApoliceViva catalogo={catalogo} />);
    const carne = screen.getByRole('list', { name: /Carnê com 12 parcelas/ });
    expect(within(carne).getAllByRole('listitem')).toHaveLength(6); // 5 canhotos + "+ 7 parcelas"

    for (let i = 0; i < 11; i++) fireEvent.click(screen.getByRole('button', { name: 'Menos parcelas' }));
    expect(screen.getByText('À vista (−5%)')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Carnê com 1 parcela' })).toBeInTheDocument();
  });
});
