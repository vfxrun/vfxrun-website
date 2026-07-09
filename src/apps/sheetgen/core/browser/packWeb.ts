import { basename, extname, joinPath } from "../pathUtils.js";
import { finalizeLayout } from "../layout.js";
import { layoutSprites } from "../pack.js";
import { buildTpsheet, formatTpsheet } from "../tpsheet.js";
import {
  exportGenericJson,
  exportPhaserJson,
  exportPixiJson,
  exportCocosPlist,
  exportUnityJson,
  exportUnrealJson,
} from "../exporters/index.js";
import {
  buildSpriteFramesDocument,
  groupSpritesIntoAnimations,
  spriteFramesFileName,
} from "../spriteFrames.js";
import type { ExportEngine } from "../engines.js";
import { engineExportFileName } from "../engines.js";
import { DEFAULT_PACK_OPTIONS, type PackOptions, type PackResult, type ProcessedSprite } from "../types.js";
import { renderAtlasBrowser } from "./atlas.js";
import { collectProjectFiles, type WebProjectRoot } from "./fileTree.js";
import { processImageFile, pngBytesToDataUrl } from "./image.js";
import type { AtlasPreviewResult } from "../atlasPreviewTypes.js";

export interface WebPackFile {
  name: string;
  blob: Blob;
}

export interface WebPackResult {
  files: WebPackFile[];
  packResult: PackResult;
}

function exportFilename(atlasName: string, engine: ExportEngine): string {
  return engineExportFileName(atlasName, engine);
}

function engineContent(engine: ExportEngine, tpsheet: PackResult["tpsheet"], atlasName: string): string | null {
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

async function processWebSprites(
  files: { virtualPath: string; file: File }[],
  trimTransparent: boolean,
): Promise<ProcessedSprite[]> {
  const sprites: ProcessedSprite[] = [];
  for (const item of files) {
    const processed = await processImageFile(item.file, trimTransparent);
    const relative = item.virtualPath.includes("/")
      ? item.virtualPath.slice(item.virtualPath.indexOf("/") + 1)
      : basename(item.virtualPath);
    sprites.push({
      filename: relative.replace(/\\/g, "/"),
      absolutePath: item.virtualPath,
      originalWidth: processed.originalWidth,
      originalHeight: processed.originalHeight,
      width: processed.width,
      height: processed.height,
      margin: processed.margin,
      pngBuffer: processed.pngBytes,
    });
  }
  return sprites;
}

export async function previewPackWeb(
  roots: WebProjectRoot[],
  options: Partial<PackOptions> = {},
): Promise<AtlasPreviewResult> {
  const opts: PackOptions = { ...DEFAULT_PACK_OPTIONS, ...options, exportEngines: ["godot"] };
  const scanned = collectProjectFiles(roots, opts.excludedDirs ?? []);
  if (scanned.length === 0) {
    throw new Error("No image files found in the selected folders");
  }

  const processed = await processWebSprites(
    scanned.map((entry) => ({ virtualPath: entry.virtualPath, file: entry.file })),
    opts.trimTransparent,
  );
  const layout = finalizeLayout(
    layoutSprites(processed, opts.borderPadding, opts.spacing, opts.maxAtlasSize),
    opts.borderPadding,
  );
  const atlasBytes = await renderAtlasBrowser(layout);

  return {
    dataUrl: pngBytesToDataUrl(atlasBytes),
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

export async function packWebProject(
  roots: WebProjectRoot[],
  options: Partial<PackOptions> = {},
): Promise<WebPackResult> {
  const opts: PackOptions = {
    ...DEFAULT_PACK_OPTIONS,
    ...options,
    exportEngines: options.exportEngines?.length ? options.exportEngines : ["godot"],
  };

  const scanned = collectProjectFiles(roots, opts.excludedDirs ?? []);
  if (scanned.length === 0) {
    throw new Error("No image files found in the selected folders");
  }

  const processed = await processWebSprites(
    scanned.map((entry) => ({ virtualPath: entry.virtualPath, file: entry.file })),
    opts.trimTransparent,
  );
  const layout = finalizeLayout(
    layoutSprites(processed, opts.borderPadding, opts.spacing, opts.maxAtlasSize),
    opts.borderPadding,
  );

  const atlasFileName = `${opts.atlasName}.png`;
  const atlasBytes = await renderAtlasBrowser(layout);
  const tpsheet = buildTpsheet(layout, atlasFileName);

  const files: WebPackFile[] = [
    {
      name: atlasFileName,
      blob: new Blob([Uint8Array.from(atlasBytes)], { type: "image/png" }),
    },
  ];

  let tpsheetPath: string | undefined;
  let spriteFramesPath: string | undefined;
  const exportPaths: string[] = [atlasFileName];

  for (const engine of opts.exportEngines) {
    const content = engineContent(engine, tpsheet, opts.atlasName);
    if (!content) continue;
    const fileName = exportFilename(opts.atlasName, engine);
    files.push({ name: fileName, blob: new Blob([content], { type: "text/plain;charset=utf-8" }) });
    exportPaths.push(fileName);
    if (engine === "godot") tpsheetPath = fileName;
  }

  if (opts.exportSpriteFrames && opts.exportEngines.includes("godot")) {
    const sfName = spriteFramesFileName(opts.atlasName);
    const sfContent = buildSpriteFramesDocument(tpsheet, opts.atlasName);
    files.push({ name: sfName, blob: new Blob([sfContent], { type: "text/plain;charset=utf-8" }) });
    spriteFramesPath = sfName;
    exportPaths.push(sfName);
  }

  const animations = groupSpritesIntoAnimations(tpsheet.textures[0].sprites).map((item) => item.name);

  return {
    files,
    packResult: {
      atlasPath: atlasFileName,
      tpsheetPath,
      spriteFramesPath,
      exportPaths,
      animations,
      atlasWidth: layout.width,
      atlasHeight: layout.height,
      spriteCount: layout.sprites.length,
      engines: opts.exportEngines,
      tpsheet,
    },
  };
}
