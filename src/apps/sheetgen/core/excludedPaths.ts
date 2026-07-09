/** Cross-platform path helpers for exclude lists (renderer + Node). */

export function normalizePathForCompare(filePath: string): string {
  return filePath.replace(/\\/g, "/").replace(/\/+$/, "").toLowerCase();
}

export function isPathExcluded(absolutePath: string, excludedDirs: string[]): boolean {
  if (excludedDirs.length === 0) return false;

  const normalized = normalizePathForCompare(absolutePath);
  for (const excluded of excludedDirs) {
    const ex = normalizePathForCompare(excluded);
    if (normalized === ex || normalized.startsWith(`${ex}/`)) {
      return true;
    }
  }
  return false;
}

export function isPathUnderRoot(absolutePath: string, rootDir: string): boolean {
  const normalized = normalizePathForCompare(absolutePath);
  const root = normalizePathForCompare(rootDir);
  return normalized === root || normalized.startsWith(`${root}/`);
}

export function pruneExcludedUnderRoot(excludedDirs: string[], removedRoot: string): string[] {
  return excludedDirs.filter((dir) => !isPathUnderRoot(dir, removedRoot));
}

export function toggleExcludedPath(excludedDirs: string[], folderPath: string): string[] {
  const target = normalizePathForCompare(folderPath);
  const exists = excludedDirs.some((dir) => normalizePathForCompare(dir) === target);
  if (exists) {
    return excludedDirs.filter((dir) => normalizePathForCompare(dir) !== target);
  }
  return [...excludedDirs, folderPath];
}
