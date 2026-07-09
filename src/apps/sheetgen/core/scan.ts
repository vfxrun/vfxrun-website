import { readdir } from "node:fs/promises";
import path from "node:path";
import { isPathExcluded } from "./excludedPaths.js";
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".bmp"]);

export interface ScannedImage {
  absolutePath: string;
  filename: string;
}

export async function scanImageFolder(rootDir: string): Promise<ScannedImage[]> {
  return scanImageFolders([rootDir]);
}

export async function scanImageFolders(
  rootDirs: string[],
  excludedDirs: string[] = [],
): Promise<ScannedImage[]> {
  const results: ScannedImage[] = [];
  const usePrefix = rootDirs.length > 1;

  for (const rootDir of rootDirs) {
    const images = await scanImageFolderRecursive(rootDir, excludedDirs);
    if (usePrefix) {
      const rootName = path.basename(rootDir) || rootDir;
      for (const image of images) {
        results.push({
          absolutePath: image.absolutePath,
          filename: `${rootName}/${image.filename}`,
        });
      }
      continue;
    }
    results.push(...images);
  }

  results.sort((a, b) => a.filename.localeCompare(b.filename));
  return results;
}

async function scanImageFolderRecursive(
  rootDir: string,
  excludedDirs: string[],
): Promise<ScannedImage[]> {
  const results: ScannedImage[] = [];

  async function walk(current: string): Promise<void> {
    if (isPathExcluded(current, excludedDirs)) return;

    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (isPathExcluded(absolutePath, excludedDirs)) continue;
        await walk(absolutePath);
        continue;
      }
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (!IMAGE_EXTENSIONS.has(ext)) continue;
      const relative = path.relative(rootDir, absolutePath).split(path.sep).join("/");
      results.push({ absolutePath, filename: relative });
    }
  }

  await walk(rootDir);
  return results;
}
