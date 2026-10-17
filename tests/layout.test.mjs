import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('dialog rules override native modal width caps and explicitly anchor mobile sheets', async () => {
  const css = await readFile(new URL('../assets/style.css', import.meta.url), 'utf8');
  const rules = [...css.matchAll(/(?:^|\n)\s*dialog\s*\{([^}]+)\}/g)].map(m => m[1]);
  assert.equal(rules.length, 2);
  assert.match(rules[0], /position:fixed;/);
  assert.match(rules[0], /inset:0;/);
  assert.match(rules[0], /max-width:none;/);
  assert.match(rules[0], /margin:auto;/);
  assert.match(rules[1], /inset:auto 0 0;/);
  assert.match(rules[1], /width:100%;/);
  assert.match(rules[1], /margin:0 auto;/);
  assert.match(rules[1], /env\(safe-area-inset-bottom\)/);
});
