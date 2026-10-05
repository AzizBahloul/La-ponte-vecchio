/**
 * Minimal tagged-template renderer.
 * Interpolated values are HTML-escaped unless they come from `html` / `raw`,
 * so mock data can never inject markup by accident.
 */
const RAW = Symbol('raw');

export interface Raw {
  readonly [RAW]: true;
  readonly value: string;
}

export const raw = (value: string): Raw => ({ [RAW]: true, value });

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export const escape = (s: string): string => s.replace(/[&<>"']/g, (c) => ESCAPES[c]);

function serialize(v: unknown): string {
  if (v == null || v === false) return '';
  if (Array.isArray(v)) return v.map(serialize).join('');
  if (typeof v === 'object' && RAW in v) return (v as Raw).value;
  return escape(String(v));
}

export function html(strings: TemplateStringsArray, ...values: unknown[]): Raw {
  let out = strings[0];
  values.forEach((v, i) => {
    out += serialize(v) + strings[i + 1];
  });
  return raw(out);
}

/** Typed querySelector that throws early instead of failing later on `null`. */
export function $<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`Élément introuvable : ${selector}`);
  return el;
}

export const $$ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T[] =>
  Array.from(root.querySelectorAll<T>(selector));
