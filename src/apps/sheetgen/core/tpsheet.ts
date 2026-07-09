import md5 from "blueimp-md5";
import type { TpsheetDocument, TpsheetSprite } from "./types.js";
import type { PackLayout, PackedSprite } from "./pack.js";

function toRegion(sprite: PackedSprite): TpsheetSprite["region"] {
  return {
    x: sprite.x,
    y: sprite.y,
    w: sprite.width,
    h: sprite.height,
  };
}

function toMargin(sprite: PackedSprite): TpsheetSprite["margin"] {
  return {
    x: sprite.margin.x,
    y: sprite.margin.y,
    w: sprite.margin.w,
    h: sprite.margin.h,
  };
}

export function buildTpsheet(
  layout: PackLayout,
  imageFileName: string,
): TpsheetDocument {
  const sprites: TpsheetSprite[] = layout.sprites.map((sprite) => ({
    filename: sprite.filename.replace(/\\/g, "/"),
    region: toRegion(sprite),
    margin: toMargin(sprite),
  }));

  const hashInput = sprites
    .map((s) => `${s.filename}:${s.region.x},${s.region.y},${s.region.w},${s.region.h}`)
    .join("|");

  return {
    textures: [
      {
        image: imageFileName,
        size: { w: layout.width, h: layout.height },
        sprites,
      },
    ],
    meta: {
      app: "https://www.codeandweb.com/texturepacker",
      version: "1.0",
      smartupdate: `$TexturePacker:SmartUpdate:${md5(hashInput)}$`,
    },
  };
}

export function formatTpsheet(document: TpsheetDocument): string {
  return `${JSON.stringify(document, null, "\t")}\n`;
}
