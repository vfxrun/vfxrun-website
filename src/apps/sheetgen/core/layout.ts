import type { PackedSprite, PackLayout } from "./pack.js";

export function computeTightAtlasSize(
  sprites: PackedSprite[],
  borderPadding: number,
): { width: number; height: number } {
  let maxRight = borderPadding;
  let maxBottom = borderPadding;

  for (const sprite of sprites) {
    maxRight = Math.max(maxRight, sprite.x + sprite.width);
    maxBottom = Math.max(maxBottom, sprite.y + sprite.height);
  }

  return {
    width: maxRight + borderPadding,
    height: maxBottom + borderPadding,
  };
}

export function finalizeLayout(
  layout: PackLayout,
  borderPadding: number,
): PackLayout {
  const tight = computeTightAtlasSize(layout.sprites, borderPadding);
  return {
    width: tight.width,
    height: tight.height,
    sprites: layout.sprites,
  };
}
