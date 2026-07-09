import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { ExportEngine } from "./engines.js";
import { engineExportFileName } from "./engines.js";
import { renderAtlas } from "./atlas.js";
import {
  exportGenericJson,
  exportPhaserJson,
  exportPixiJson,
  exportCocosPlist,
  exportUnityJson,
  exportUnrealJson,
} from "./exporters/index.js";
import { finalizeLayout } from "./layout.js";
import { layoutSprites } from "./pack.js";
import { processSprites } from "./process.js";
import { scanImageFolders } from "./scan.js";
import {
  buildSpriteFramesDocument,
  groupSpritesIntoAnimations,
  spriteFramesFileName,
} from "./spriteFrames.js";
import { buildTpsheet, formatTpsheet } from "./tpsheet.js";
import {
  DEFAULT_PACK_OPTIONS,
  type PackOptions,
  type PackResult,
  type TpsheetDocument,
} from "./types.js";

async function validateExport(
  atlasBuffer: Buffer,
  tpsheet: TpsheetDocument,
): Promise<void> {
  const meta = await sharp(atlasBuffer).metadata();
  const texture = tpsheet.textures[0];

  if (meta.width !== texture.size.w || meta.height !== texture.size.h) {
    throw new Error(
      `Atlas PNG size (${meta.width}x${meta.height}) does not match .tpsheet size (${texture.size.w}x${texture.size.h})`,
    );
  }

  for (const sprite of texture.sprites) {
    const { x, y, w, h } = sprite.region;
    if (w <= 0 || h <= 0) {
      throw new Error(`Invalid region size for ${sprite.filename}: ${w}x${h}`);
    }
    if (x + w > texture.size.w || y + h > texture.size.h) {
      throw new Error(`Region out of bounds for ${sprite.filename}`);
    }

    const extracted = await sharp(atlasBuffer)
      .extract({ left: x, top: y, width: w, height: h })
      .png()
      .toBuffer();
    const extractedMeta = await sharp(extracted).metadata();
    if (extractedMeta.width !== w || extractedMeta.height !== h) {
      throw new Error(`Failed to extract ${sprite.filename} at ${w}x${h}`);
    }
  }
}

function engineContent(
  engine: ExportEngine,
  tpsheet: TpsheetDocument,
  atlasName: string,
): string | null {
  switch (engine) {
    case "godot":
      return formatTpsheet(tpsheet);
    case "unity":
      return exportUnityJson(tpsheet, atlasName);
    case "unreal":
      return exportUnrealJson(tpsheet, atlasName);
    case "phaser":
      return exportPhaserJson(tpsheet, atlasName);
    case "pixi":
      return exportPixiJson(tpsheet, atlasName);
    case "cocos":
      return exportCocosPlist(tpsheet, atlasName);
    case "json":
      return exportGenericJson(tpsheet, atlasName);
    default:
      return null;
  }
}

export async function packFolder(
  inputDir: string | string[],
  outputDir: string,
  options: Partial<PackOptions> = {},
): Promise<PackResult> {
  const inputDirs = Array.isArray(inputDir) ? inputDir : [inputDir];
  const opts: PackOptions = {
    ...DEFAULT_PACK_OPTIONS,
    ...options,
    exportEngines: options.exportEngines?.length ? options.exportEngines : ["godot"],
  };

  const scanned = await scanImageFolders(inputDirs, opts.excludedDirs ?? []);
  if (scanned.length === 0) {
    throw new Error("No image files found in the selected folder");
  }

  const processed = await processSprites(scanned, opts.trimTransparent);
  const layout = finalizeLayout(
    layoutSprites(processed, opts.borderPadding, opts.spacing, opts.maxAtlasSize),
    opts.borderPadding,
  );

  const atlasFileName = `${opts.atlasName}.png`;
  const atlasBuffer = await renderAtlas(layout);
  const tpsheet = buildTpsheet(layout, atlasFileName);

  await validateExport(atlasBuffer, tpsheet);

  await mkdir(outputDir, { recursive: true });
  const atlasPath = path.join(outputDir, atlasFileName);
  await writeFile(atlasPath, atlasBuffer);

  const exportPaths: string[] = [atlasPath];
  let tpsheetPath: string | undefined;
  let spriteFramesPath: string | undefined;

  for (const engine of opts.exportEngines) {
    const content = engineContent(engine, tpsheet, opts.atlasName);
    if (!content) continue;

    const fileName = engineExportFileName(opts.atlasName, engine);
    const filePath = path.join(outputDir, fileName);
    await writeFile(filePath, content, "utf8");
    exportPaths.push(filePath);
    if (engine === "godot") tpsheetPath = filePath;
  }

  if (opts.exportSpriteFrames && opts.exportEngines.includes("godot")) {
    spriteFramesPath = path.join(outputDir, spriteFramesFileName(opts.atlasName));
    await writeFile(spriteFramesPath, buildSpriteFramesDocument(tpsheet, opts.atlasName), "utf8");
    exportPaths.push(spriteFramesPath);
  }

  const animations = groupSpritesIntoAnimations(tpsheet.textures[0].sprites).map((a) => a.name);

  return {
    atlasPath,
    tpsheetPath,
    spriteFramesPath,
    exportPaths,
    animations,
    atlasWidth: layout.width,
    atlasHeight: layout.height,
    spriteCount: layout.sprites.length,
    engines: opts.exportEngines,
    tpsheet,
  };
}

/** @deprecated Use packFolder */
export const packFolderToGodot = packFolder;
