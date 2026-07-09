import { MaxRectsPacker } from "maxrects-packer";
import type { ProcessedSprite } from "./types.js";

export interface PackedSprite extends ProcessedSprite {
  x: number;
  y: number;
}

export interface PackLayout {
  width: number;
  height: number;
  sprites: PackedSprite[];
}

const ATLAS_SIZES = [256, 512, 1024, 2048, 4096, 8192];

function computeAtlasSize(
  sprites: PackedSprite[],
  borderPadding: number,
): { width: number; height: number } {
  let maxX = 0;
  let maxY = 0;
  for (const sprite of sprites) {
    maxX = Math.max(maxX, sprite.x + sprite.width);
    maxY = Math.max(maxY, sprite.y + sprite.height);
  }
  return {
    width: maxX + borderPadding,
    height: maxY + borderPadding,
  };
}

export function layoutSprites(
  sprites: ProcessedSprite[],
  borderPadding: number,
  spacing: number,
  maxAtlasSize: number,
): PackLayout {
  if (sprites.length === 0) {
    throw new Error("No sprites to pack");
  }

  const candidates = ATLAS_SIZES.filter((size) => size <= maxAtlasSize);
  if (candidates.length === 0) {
    throw new Error(`maxAtlasSize ${maxAtlasSize} is too small`);
  }

  let lastError: Error | null = null;

  for (const size of candidates) {
    try {
      const packer = new MaxRectsPacker(size, size, spacing, {
        smart: true,
        pot: false,
        square: false,
        border: borderPadding,
      });

      for (const sprite of sprites) {
        packer.add(sprite.width, sprite.height, sprite);
      }
      if (packer.bins.length !== 1) {
        throw new Error(`Sprites do not fit in ${size}x${size}`);
      }

      const bin = packer.bins[0];
      const packedSprites: PackedSprite[] = bin.rects.map((rect) => {
        const sprite = rect.data as ProcessedSprite;
        return {
          ...sprite,
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
      });

      const atlasSize = computeAtlasSize(packedSprites, borderPadding);

      return {
        width: atlasSize.width,
        height: atlasSize.height,
        sprites: packedSprites,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw (
    lastError ??
    new Error(
      `Sprites do not fit in a single atlas up to ${maxAtlasSize}x${maxAtlasSize}. Try a larger project export folder or reduce sprite count.`,
    )
  );
}
