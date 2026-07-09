import sharp from "sharp";
import type { Margin, ProcessedSprite } from "./types.js";

interface TrimResult {
  buffer: Buffer;
  width: number;
  height: number;
  margin: Margin;
}

function buildGodotMargin(
  originalWidth: number,
  originalHeight: number,
  trimLeft: number,
  trimTop: number,
  trimmedWidth: number,
  trimmedHeight: number,
): Margin {
  const wasTrimmed =
    trimLeft !== 0 ||
    trimTop !== 0 ||
    trimmedWidth !== originalWidth ||
    trimmedHeight !== originalHeight;

  if (!wasTrimmed) {
    return { x: 0, y: 0, w: 0, h: 0 };
  }

  // Godot AtlasTexture: margin.position = trim offset, margin.size = original source size.
  return {
    x: trimLeft,
    y: trimTop,
    w: originalWidth,
    h: originalHeight,
  };
}

async function loadWithTrim(filePath: string, trim: boolean): Promise<TrimResult> {
  const originalMeta = await sharp(filePath).metadata();
  const originalWidth = originalMeta.width ?? 0;
  const originalHeight = originalMeta.height ?? 0;

  if (!trim) {
    const buffer = await sharp(filePath).ensureAlpha().png().toBuffer();
    return {
      buffer,
      width: originalWidth,
      height: originalHeight,
      margin: { x: 0, y: 0, w: 0, h: 0 },
    };
  }

  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .trim({ threshold: 1 })
    .png()
    .toBuffer({ resolveWithObject: true });

  const trimLeft = Math.abs(info.trimOffsetLeft ?? 0);
  const trimTop = Math.abs(info.trimOffsetTop ?? 0);
  const trimmedWidth = info.width ?? 0;
  const trimmedHeight = info.height ?? 0;

  return {
    buffer: data,
    width: trimmedWidth,
    height: trimmedHeight,
    margin: buildGodotMargin(
      originalWidth,
      originalHeight,
      trimLeft,
      trimTop,
      trimmedWidth,
      trimmedHeight,
    ),
  };
}

export async function processSprites(
  files: { absolutePath: string; filename: string }[],
  trimTransparent: boolean,
): Promise<ProcessedSprite[]> {
  const sprites: ProcessedSprite[] = [];

  for (const file of files) {
    const originalMeta = await sharp(file.absolutePath).metadata();
    const originalWidth = originalMeta.width ?? 0;
    const originalHeight = originalMeta.height ?? 0;
    const trimmed = await loadWithTrim(file.absolutePath, trimTransparent);

    sprites.push({
      filename: file.filename,
      absolutePath: file.absolutePath,
      originalWidth,
      originalHeight,
      width: trimmed.width,
      height: trimmed.height,
      margin: trimmed.margin,
      pngBuffer: trimmed.buffer,
    });
  }

  return sprites;
}
