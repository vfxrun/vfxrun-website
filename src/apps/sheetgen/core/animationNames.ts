import type { TpsheetDocument, TpsheetSprite } from "./types.js";

/**
 * Animation names come from folder path only (not PNG filename frame numbers).
 */
export function animationNameFromSpritePath(spriteFilename: string): string {
  const normalized = spriteFilename.replace(/\\/g, "/");
  const parts = normalized.split("/").filter(Boolean);

  if (parts.length < 2) {
    const file = parts[parts.length - 1] ?? spriteFilename;
    return file.replace(/\.[^.]+$/, "");
  }

  const folderParts = parts.slice(0, -1);

  if (folderParts.length >= 3) {
    return `hero_${folderParts.join("_")}`;
  }

  if (folderParts.length === 2) {
    return `${folderParts[0]}_${folderParts[1]}`;
  }

  const stateFolder = folderParts[0];
  const fileBase = parts[parts.length - 1].replace(/\.[^.]+$/, "");
  return `${fileBase}_${stateFolder}`;
}

export function findSpriteAtlasImage(
  tpsheet: TpsheetDocument,
  spriteFilename: string,
): string | undefined {
  for (const texture of tpsheet.textures) {
    if (texture.sprites.some((sprite) => sprite.filename === spriteFilename)) {
      return texture.image;
    }
  }
  return undefined;
}

export interface AnimationGroup {
  name: string;
  sprites: TpsheetSprite[];
}

export function groupSpritesIntoAnimations(sprites: TpsheetSprite[]): AnimationGroup[] {
  const groups = new Map<string, TpsheetSprite[]>();

  for (const sprite of sprites) {
    const name = animationNameFromSpritePath(sprite.filename);
    const list = groups.get(name) ?? [];
    list.push(sprite);
    groups.set(name, list);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, groupSprites]) => ({
      name,
      sprites: groupSprites.sort((a, b) => a.filename.localeCompare(b.filename)),
    }));
}
