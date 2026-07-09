import sharp from "sharp";
import type { PackLayout } from "./pack.js";

export async function renderAtlas(layout: PackLayout): Promise<Buffer> {
  const composites = layout.sprites.map((sprite) => ({
    input: Buffer.isBuffer(sprite.pngBuffer) ? sprite.pngBuffer : Buffer.from(sprite.pngBuffer),
    left: sprite.x,
    top: sprite.y,
  }));

  return sharp({
    create: {
      width: layout.width,
      height: layout.height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png()
    .toBuffer();
}
