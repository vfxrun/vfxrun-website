import type { PackLayout } from "../pack.js";

export async function renderAtlasBrowser(layout: PackLayout): Promise<Uint8Array> {
  const canvas = document.createElement("canvas");
  canvas.width = layout.width;
  canvas.height = layout.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D unavailable");

  for (const sprite of layout.sprites) {
    const bytes =
      sprite.pngBuffer instanceof Uint8Array ? sprite.pngBuffer : new Uint8Array(sprite.pngBuffer);
    const blob = new Blob([Uint8Array.from(bytes)], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    try {
      const image = await loadImage(url);
      ctx.drawImage(image, sprite.x, sprite.y);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  return canvasToPngBytes(canvas);
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to decode sprite PNG"));
    image.src = url;
  });
}

function canvasToPngBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to encode atlas PNG"));
        return;
      }
      void blob.arrayBuffer().then((buffer) => resolve(new Uint8Array(buffer)));
    }, "image/png");
  });
}
