import { scanImageFolders } from "./scan.js";
import { processSprites } from "./process.js";
import { layoutSprites } from "./pack.js";
import { finalizeLayout } from "./layout.js";
import { renderAtlas } from "./atlas.js";
import { DEFAULT_PACK_OPTIONS, type PackOptions } from "./types.js";
import type { AtlasPreviewResult } from "./atlasPreviewTypes.js";

export type { AtlasPreviewResult, AtlasSpritePreview } from "./atlasPreviewTypes.js";

export async function previewPackAtlas(
  inputDir: string | string[],
  options: Partial<PackOptions> = {},
): Promise<AtlasPreviewResult> {
  const inputDirs = Array.isArray(inputDir) ? inputDir : [inputDir];
  const opts: PackOptions = { ...DEFAULT_PACK_OPTIONS, ...options, exportEngines: ["godot"] };
  const scanned = await scanImageFolders(inputDirs, opts.excludedDirs ?? []);

  if (scanned.length === 0) {
    throw new Error("No image files found in the selected folder");
  }

  const processed = await processSprites(scanned, opts.trimTransparent);
  const layout = finalizeLayout(
    layoutSprites(processed, opts.borderPadding, opts.spacing, opts.maxAtlasSize),
    opts.borderPadding,
  );

  const atlasBuffer = await renderAtlas(layout);

  return {
    dataUrl: `data:image/png;base64,${atlasBuffer.toString("base64")}`,
    width: layout.width,
    height: layout.height,
    spriteCount: layout.sprites.length,
    sprites: layout.sprites.map((sprite) => ({
      filename: sprite.filename.replace(/\\/g, "/"),
      absolutePath: sprite.absolutePath,
      region: { x: sprite.x, y: sprite.y, w: sprite.width, h: sprite.height },
      margin: sprite.margin,
    })),
  };
}
