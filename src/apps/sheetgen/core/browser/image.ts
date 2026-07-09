import type { Margin } from "../types.js";

export interface BrowserImageResult {
  pngBytes: Uint8Array;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  margin: Margin;
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };
    image.src = url;
  });
}

function drawImageToCanvas(image: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D unavailable");
  ctx.drawImage(image, 0, 0);
  return canvas;
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

  return {
    x: trimLeft,
    y: trimTop,
    w: originalWidth,
    h: originalHeight,
  };
}

function findTrimBounds(imageData: ImageData): {
  left: number;
  top: number;
  right: number;
  bottom: number;
} | null {
  const { data, width, height } = imageData;
  let top = height;
  let left = width;
  let bottom = -1;
  let right = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha <= 1) continue;
      if (x < left) left = x;
      if (y < top) top = y;
      if (x > right) right = x;
      if (y > bottom) bottom = y;
    }
  }

  if (right < left || bottom < top) return null;
  return { left, top, right, bottom };
}

function canvasToPngBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to encode PNG"));
        return;
      }
      void blob.arrayBuffer().then((buffer) => resolve(new Uint8Array(buffer)));
    }, "image/png");
  });
}

export async function processImageFile(file: File, trim: boolean): Promise<BrowserImageResult> {
  const image = await loadImageFromFile(file);
  const originalWidth = image.naturalWidth;
  const originalHeight = image.naturalHeight;
  const sourceCanvas = drawImageToCanvas(image);

  if (!trim) {
    const pngBytes = await canvasToPngBytes(sourceCanvas);
    return {
      pngBytes,
      width: originalWidth,
      height: originalHeight,
      originalWidth,
      originalHeight,
      margin: { x: 0, y: 0, w: 0, h: 0 },
    };
  }

  const ctx = sourceCanvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D unavailable");
  const bounds = findTrimBounds(ctx.getImageData(0, 0, originalWidth, originalHeight));
  if (!bounds) {
    const pngBytes = await canvasToPngBytes(sourceCanvas);
    return {
      pngBytes,
      width: originalWidth,
      height: originalHeight,
      originalWidth,
      originalHeight,
      margin: { x: 0, y: 0, w: 0, h: 0 },
    };
  }

  const trimmedWidth = bounds.right - bounds.left + 1;
  const trimmedHeight = bounds.bottom - bounds.top + 1;
  const trimmedCanvas = document.createElement("canvas");
  trimmedCanvas.width = trimmedWidth;
  trimmedCanvas.height = trimmedHeight;
  const trimmedCtx = trimmedCanvas.getContext("2d");
  if (!trimmedCtx) throw new Error("Canvas 2D unavailable");
  trimmedCtx.drawImage(
    sourceCanvas,
    bounds.left,
    bounds.top,
    trimmedWidth,
    trimmedHeight,
    0,
    0,
    trimmedWidth,
    trimmedHeight,
  );

  const pngBytes = await canvasToPngBytes(trimmedCanvas);
  return {
    pngBytes,
    width: trimmedWidth,
    height: trimmedHeight,
    originalWidth,
    originalHeight,
    margin: buildGodotMargin(
      originalWidth,
      originalHeight,
      bounds.left,
      bounds.top,
      trimmedWidth,
      trimmedHeight,
    ),
  };
}

export function pngBytesToDataUrl(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return `data:image/png;base64,${btoa(binary)}`;
}

export async function fileToDataUrl(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const mime = file.type || "image/png";
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return `data:${mime};base64,${btoa(binary)}`;
}
