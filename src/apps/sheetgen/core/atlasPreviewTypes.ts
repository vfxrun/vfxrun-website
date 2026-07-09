import type { Margin, Region } from "./types.js";

export interface AtlasSpritePreview {
  filename: string;
  absolutePath: string;
  region: Region;
  margin: Margin;
}

export interface AtlasPreviewResult {
  dataUrl: string;
  width: number;
  height: number;
  spriteCount: number;
  sprites: AtlasSpritePreview[];
}

export function sourceBounds(sprite: AtlasSpritePreview): Region | null {
  const { margin, region } = sprite;
  if (margin.w <= 0 || margin.h <= 0) return null;
  if (margin.x === 0 && margin.y === 0 && margin.w === region.w && margin.h === region.h) {
    return null;
  }
  return {
    x: region.x - margin.x,
    y: region.y - margin.y,
    w: margin.w,
    h: margin.h,
  };
}

export function hitTestAtlasSprite(
  atlasX: number,
  atlasY: number,
  sprites: AtlasSpritePreview[],
): AtlasSpritePreview | null {
  for (let index = sprites.length - 1; index >= 0; index -= 1) {
    const sprite = sprites[index];
    const { x, y, w, h } = sprite.region;
    if (atlasX >= x && atlasX < x + w && atlasY >= y && atlasY < y + h) {
      return sprite;
    }
  }
  return null;
}
