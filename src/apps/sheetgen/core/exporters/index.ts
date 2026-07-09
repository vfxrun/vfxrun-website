import { basename, extname } from "../pathUtils.js";
import type { TpsheetDocument, TpsheetSprite } from "../types.js";
import { animationNameFromSpritePath } from "../animationNames.js";

function isTrimmed(sprite: TpsheetSprite): boolean {
  return sprite.margin.w !== sprite.region.w || sprite.margin.h !== sprite.region.h;
}

function sourceSize(sprite: TpsheetSprite): { w: number; h: number } {
  if (isTrimmed(sprite)) {
    return { w: sprite.margin.w, h: sprite.margin.h };
  }
  return { w: sprite.region.w, h: sprite.region.h };
}

function spriteSourceSize(sprite: TpsheetSprite): { x: number; y: number; w: number; h: number } {
  const size = sourceSize(sprite);
  if (!isTrimmed(sprite)) {
    return { x: 0, y: 0, w: size.w, h: size.h };
  }
  return { x: sprite.margin.x, y: sprite.margin.y, w: size.w, h: size.h };
}

function cocosOffset(sprite: TpsheetSprite): { x: number; y: number } {
  if (!isTrimmed(sprite)) {
    return { x: 0, y: 0 };
  }
  const { w, h } = sprite.region;
  const source = sourceSize(sprite);
  return {
    x: (source.w - w) / 2 - sprite.margin.x,
    y: (source.h - h) / 2 - sprite.margin.y,
  };
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function exportGenericJson(
  tpsheet: TpsheetDocument,
  atlasName: string,
): string {
  const frames: Record<string, unknown> = {};

  for (const texture of tpsheet.textures) {
    for (const sprite of texture.sprites) {
      const key = basename(sprite.filename, extname(sprite.filename));
      frames[key] = {
        frame: {
          x: sprite.region.x,
          y: sprite.region.y,
          w: sprite.region.w,
          h: sprite.region.h,
        },
        rotated: false,
        trimmed: sprite.margin.w !== sprite.region.w || sprite.margin.h !== sprite.region.h,
        spriteSourceSize: { x: sprite.margin.x, y: sprite.margin.y, w: sprite.margin.w, h: sprite.margin.h },
        sourceSize: { w: sprite.margin.w, h: sprite.margin.h },
        filename: sprite.filename,
        atlas: texture.image,
        animation: animationNameFromSpritePath(sprite.filename),
      };
    }
  }

  const meta = {
    app: "SheetGen",
    version: "0.3.0",
    image: tpsheet.textures.length === 1 ? tpsheet.textures[0].image : `${atlasName}.png`,
    format: "RGBA8888",
    size: tpsheet.textures[0]?.size ?? { w: 0, h: 0 },
    scale: "1",
    textures: tpsheet.textures.map((texture) => ({
      image: texture.image,
      size: texture.size,
    })),
  };

  return `${JSON.stringify({ frames, meta }, null, 2)}\n`;
}

export function exportPhaserJson(
  tpsheet: TpsheetDocument,
  atlasName: string,
): string {
  const frames: Record<string, unknown> = {};

  for (const texture of tpsheet.textures) {
    for (const sprite of texture.sprites) {
      const key = sprite.filename.replace(/\\/g, "/");
      frames[key] = {
        frame: {
          x: sprite.region.x,
          y: sprite.region.y,
          w: sprite.region.w,
          h: sprite.region.h,
        },
        rotated: false,
        trimmed: sprite.margin.w !== sprite.region.w || sprite.margin.h !== sprite.region.h,
        spriteSourceSize: { x: sprite.margin.x, y: sprite.margin.y, w: sprite.margin.w, h: sprite.margin.h },
        sourceSize: { w: sprite.margin.w, h: sprite.margin.h },
      };
    }
  }

  const primary = tpsheet.textures[0];
  const document = {
    textures: tpsheet.textures.map((texture) => ({
      image: texture.image,
      format: "RGBA8888",
      size: texture.size,
      scale: 1,
      frames: texture.sprites.map((sprite) => ({
        filename: basename(sprite.filename),
        frame: sprite.region,
        rotated: false,
        trimmed: sprite.margin.w !== sprite.region.w || sprite.margin.h !== sprite.region.h,
        spriteSourceSize: { x: sprite.margin.x, y: sprite.margin.y, w: sprite.margin.w, h: sprite.margin.h },
        sourceSize: { w: sprite.margin.w, h: sprite.margin.h },
      })),
    })),
    meta: {
      app: "SheetGen",
      version: "0.3.0",
      image: primary?.image ?? `${atlasName}.png`,
    },
  };

  return `${JSON.stringify(document, null, 2)}\n`;
}

export function exportUnityJson(
  tpsheet: TpsheetDocument,
  atlasName: string,
): string {
  const spriteList: unknown[] = [];

  for (const texture of tpsheet.textures) {
    for (const sprite of texture.sprites) {
      spriteList.push({
        filename: basename(sprite.filename),
        frame: {
          x: sprite.region.x,
          y: texture.size.h - sprite.region.y - sprite.region.h,
          w: sprite.region.w,
          h: sprite.region.h,
        },
        rotated: false,
        trimmed: sprite.margin.w !== sprite.region.w || sprite.margin.h !== sprite.region.h,
        spriteSourceSize: { x: sprite.margin.x, y: sprite.margin.y, w: sprite.margin.w, h: sprite.margin.h },
        sourceSize: { w: sprite.margin.w, h: sprite.margin.h },
        pivot: { x: 0.5, y: 0.5 },
        atlas: texture.image,
      });
    }
  }

  const primary = tpsheet.textures[0];
  const document = {
    meta: {
      app: "SheetGen",
      version: "0.3.0",
      image: primary?.image ?? `${atlasName}.png`,
      format: "RGBA8888",
      size: primary?.size ?? { w: 0, h: 0 },
      scale: "1",
      smartupdate: tpsheet.meta.smartupdate,
    },
    frames: Object.fromEntries(
      spriteList.map((entry) => {
        const sprite = entry as { filename: string };
        return [sprite.filename.replace(/\.[^.]+$/, ""), entry];
      }),
    ),
  };

  return `${JSON.stringify(document, null, 2)}\n`;
}

/** Unreal Paper2D / sprite-sheet friendly JSON (Y-up frame coordinates). */
export function exportUnrealJson(
  tpsheet: TpsheetDocument,
  atlasName: string,
): string {
  const frames: Record<string, unknown> = {};

  for (const texture of tpsheet.textures) {
    for (const sprite of texture.sprites) {
      const key = basename(sprite.filename, extname(sprite.filename));
      frames[key] = {
        filename: sprite.filename.replace(/\\/g, "/"),
        frame: {
          x: sprite.region.x,
          y: texture.size.h - sprite.region.y - sprite.region.h,
          w: sprite.region.w,
          h: sprite.region.h,
        },
        sourceSize: { w: sprite.margin.w, h: sprite.margin.h },
        spriteSourceSize: {
          x: sprite.margin.x,
          y: sprite.margin.y,
          w: sprite.margin.w,
          h: sprite.margin.h,
        },
        trimmed: sprite.margin.w !== sprite.region.w || sprite.margin.h !== sprite.region.h,
        pivot: { x: 0.5, y: 0.5 },
        atlas: texture.image,
      };
    }
  }

  const primary = tpsheet.textures[0];
  const document = {
    meta: {
      app: "SheetGen",
      version: "0.3.0",
      image: primary?.image ?? `${atlasName}.png`,
      format: "RGBA8888",
      size: primary?.size ?? { w: 0, h: 0 },
      scale: "1",
    },
    frames,
  };

  return `${JSON.stringify(document, null, 2)}\n`;
}

/** PixiJS Spritesheet / TexturePacker hash JSON. */
export function exportPixiJson(
  tpsheet: TpsheetDocument,
  atlasName: string,
): string {
  const frames: Record<string, unknown> = {};

  for (const texture of tpsheet.textures) {
    for (const sprite of texture.sprites) {
      const key = basename(sprite.filename);
      const trimmed = isTrimmed(sprite);
      const size = sourceSize(sprite);
      const sourceRect = spriteSourceSize(sprite);

      frames[key] = {
        frame: {
          x: sprite.region.x,
          y: sprite.region.y,
          w: sprite.region.w,
          h: sprite.region.h,
        },
        rotated: false,
        trimmed,
        spriteSourceSize: {
          x: sourceRect.x,
          y: sourceRect.y,
          w: size.w,
          h: size.h,
        },
        sourceSize: { w: size.w, h: size.h },
        anchor: { x: 0.5, y: 0.5 },
      };
    }
  }

  const primary = tpsheet.textures[0];
  const document = {
    frames,
    meta: {
      app: "SheetGen",
      version: "0.3.0",
      image: primary?.image ?? `${atlasName}.png`,
      format: "RGBA8888",
      size: primary?.size ?? { w: 0, h: 0 },
      scale: "1",
      smartupdate: tpsheet.meta.smartupdate,
    },
  };

  return `${JSON.stringify(document, null, 2)}\n`;
}

/** Cocos Creator / Cocos2d-x plist (TexturePacker compatible). */
export function exportCocosPlist(
  tpsheet: TpsheetDocument,
  atlasName: string,
): string {
  const primary = tpsheet.textures[0];
  const atlasImage = primary?.image ?? `${atlasName}.png`;
  const atlasSize = primary?.size ?? { w: 0, h: 0 };

  const frameEntries: string[] = [];

  for (const texture of tpsheet.textures) {
    for (const sprite of texture.sprites) {
      const key = basename(sprite.filename);
      const { x, y, w, h } = sprite.region;
      const size = sourceSize(sprite);
      const offset = cocosOffset(sprite);
      const trimmed = isTrimmed(sprite);
      const colorX = trimmed ? sprite.margin.x : 0;
      const colorY = trimmed ? sprite.margin.y : 0;

      frameEntries.push(`            <key>${escapeXml(key)}</key>
            <dict>
                <key>aliases</key>
                <array/>
                <key>spriteOffset</key>
                <string>{${offset.x},${offset.y}}</string>
                <key>spriteSize</key>
                <string>{${size.w},${size.h}}</string>
                <key>spriteSourceSize</key>
                <string>{${size.w},${size.h}}</string>
                <key>textureRect</key>
                <string>{{${x},${y}},{${w},${h}}}</string>
                <key>textureRotated</key>
                <false/>
                <key>sourceColorRect</key>
                <string>{{${colorX},${colorY}},{${w},${h}}}</string>
                <key>sourceSize</key>
                <string>{${size.w},${size.h}}</string>
                <key>offset</key>
                <string>{${offset.x},${offset.y}}</string>
                <key>rotated</key>
                <false/>
                <key>frame</key>
                <string>{{${x},${y}},{${w},${h}}}</string>
            </dict>`);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
    <dict>
        <key>frames</key>
        <dict>
${frameEntries.join("\n")}
        </dict>
        <key>metadata</key>
        <dict>
            <key>format</key>
            <integer>3</integer>
            <key>textureFileName</key>
            <string>${escapeXml(atlasImage)}</string>
            <key>realTextureFileName</key>
            <string>${escapeXml(atlasImage)}</string>
            <key>size</key>
            <string>{${atlasSize.w},${atlasSize.h}}</string>
        </dict>
    </dict>
</plist>
`;
}

export function extraExportFileName(
  atlasName: string,
  format: "json" | "phaser" | "unity" | "unreal" | "pixi" | "cocos",
): string {
  switch (format) {
    case "json":
      return `${atlasName}.json`;
    case "phaser":
      return `${atlasName}-phaser.json`;
    case "unity":
      return `${atlasName}-unity.json`;
    case "unreal":
      return `${atlasName}-unreal.json`;
    case "pixi":
      return `${atlasName}-pixi.json`;
    case "cocos":
      return `${atlasName}-cocos.plist`;
  }
}
