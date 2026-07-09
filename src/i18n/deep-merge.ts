export type MessageTree = Record<string, string | MessageTree>;

export function deepMergeMessages<T extends MessageTree>(base: T, override: Partial<T>): T {
  const result = { ...base } as T;

  for (const key of Object.keys(override) as (keyof T)[]) {
    const baseVal = base[key];
    const overrideVal = override[key];

    if (typeof overrideVal === 'string') {
      (result as MessageTree)[key as string] = overrideVal;
    } else if (
      overrideVal &&
      typeof overrideVal === 'object' &&
      baseVal &&
      typeof baseVal === 'object'
    ) {
      (result as MessageTree)[key as string] = deepMergeMessages(
        baseVal as MessageTree,
        overrideVal as MessageTree,
      );
    } else if (overrideVal !== undefined) {
      (result as MessageTree)[key as string] = overrideVal as T[keyof T];
    }
  }

  return result;
}

export function flattenMessages(tree: MessageTree, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {};

  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      out[path] = value;
    } else {
      Object.assign(out, flattenMessages(value as MessageTree, path));
    }
  }

  return out;
}
