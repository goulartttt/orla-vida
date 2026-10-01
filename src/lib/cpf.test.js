import { describe, expect, it } from 'vitest';
import { cpfValido, mascararDigitacao } from './cpf.js';

describe('cpf', () => {
  it('formata enquanto a pessoa digita', () => {
    expect(mascararDigitacao('529')).toBe('529');
    expect(mascararDigitacao('52998')).toBe('529.98');
    expect(mascararDigitacao('5299822')).toBe('529.982.2');
    expect(mascararDigitacao('52998224725999')).toBe('529.982.247-25');
  });

  it('valida pelos dígitos verificadores', () => {
    expect(cpfValido('529.982.247-25')).toBe(true);
    expect(cpfValido('529.982.247-24')).toBe(false);
    expect(cpfValido('000.000.000-00')).toBe(false);
  });
});
