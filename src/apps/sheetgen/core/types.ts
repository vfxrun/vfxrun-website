import type { ExportEngine } from "./engines.js";

export interface Margin {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface TpsheetSprite {
  filename: string;
  region: Region;
  margin: Margin;
}

export interface TpsheetTexture {
  image: string;
  size: { w: number; h: number };
  sprites: TpsheetSprite[];
}

export interface TpsheetDocument {
  textures: TpsheetTexture[];
  meta: {
    app: string;
    version: string;
    smartupdate: string;
  };
}

export interface ProcessedSprite {
  filename: string;
  absolutePath: string;
  originalWidth: number;
  originalHeight: number;
  width: number;
  height: number;
  margin: Margin;
  pngBuffer: Buffer | Uint8Array;
}

export interface PackOptions {
  atlasName: string;
  borderPadding: number;
  spacing: number;
  trimTransparent: boolean;
  maxAtlasSize: number;
  exportSpriteFrames: boolean;
  exportEngines: ExportEngine[];
  excludedDirs?: string[];
}

export interface PackResult {
  atlasPath: string;
  tpsheetPath?: string;
  spriteFramesPath?: string;
  exportPaths: string[];
  animations: string[];
  atlasWidth: number;
  atlasHeight: number;
  spriteCount: number;
  engines: ExportEngine[];
  tpsheet: TpsheetDocument;
}

export const DEFAULT_PACK_OPTIONS: PackOptions = {
  atlasName: "atlas",
  borderPadding: 3,
  spacing: 0,
  trimTransparent: false,
  maxAtlasSize: 4096,
  exportSpriteFrames: true,
  exportEngines: ["godot"],
};
