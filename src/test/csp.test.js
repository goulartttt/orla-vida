// @vitest-environment node
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// A CSP do vercel.json libera só o script inline do index.html, pelo hash dele.
// Se o script mudar, o hash precisa mudar junto; senão o tema para de funcionar em produção.
describe('Content-Security-Policy', () => {
  it('o hash da CSP corresponde ao script inline do index.html', () => {
    const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
    const vercel = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'));
    const csp = vercel.headers[0].headers.find((h) => h.key === 'Content-Security-Policy').value;

    const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    expect(scripts).toHaveLength(1);
    const hash = createHash('sha256').update(scripts[0]).digest('base64');
    expect(csp).toContain(`'sha256-${hash}'`);
  });
});
