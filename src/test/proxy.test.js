// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { montarDestino } from '../../api/proxy.js';

const API = 'https://orla-vida-api.exemplo.test';

describe('proxy /api', () => {
  it('repassa caminhos normais para a API', () => {
    expect(montarDestino('cotacoes/12/efetivar', API).href).toBe(`${API}/cotacoes/12/efetivar`);
    expect(montarDestino('auth/me', API, 'a=1').href).toBe(`${API}/auth/me?a=1`);
  });

  it('não deixa o caminho escapar para outro domínio (SSRF)', () => {
    expect(montarDestino('/outro-site.test/x', API).origin).toBe(API);
    expect(montarDestino('//outro-site.test/x', API).origin).toBe(API);
    expect(montarDestino('../segredo', API)).toBeNull();
    expect(montarDestino('https://outro-site.test', API)).toBeNull();
    expect(montarDestino('auth/me?x=1', API)).toBeNull();
  });
});
