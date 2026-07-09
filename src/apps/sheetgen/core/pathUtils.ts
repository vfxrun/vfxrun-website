/** Path helpers that work in Node and the browser (always forward slashes). */

export function normalizePath(value: string): string {
  return value.replace(/\\/g, "/");
}

export function basename(value: string, stripExt?: string): string {
  const normalized = normalizePath(value);
  const name = normalized.slice(normalized.lastIndexOf("/") + 1);
  if (!stripExt) return name;
  return name.endsWith(stripExt) ? name.slice(0, -stripExt.length) : name;
}

export function extname(value: string): string {
  const name = basename(value);
  const index = name.lastIndexOf(".");
  return index >= 0 ? name.slice(index) : "";
}

export function joinPath(...parts: string[]): string {
  return normalizePath(parts.filter(Boolean).join("/")).replace(/\/+/g, "/");
}

export function relativePath(from: string, to: string): string {
  const base = normalizePath(from).split("/").filter(Boolean);
  const target = normalizePath(to).split("/").filter(Boolean);
  let index = 0;
  while (index < base.length && index < target.length && base[index] === target[index]) {
    index += 1;
  }
  const up = base.slice(index).map(() => "..");
  return [...up, ...target.slice(index)].join("/");
}
