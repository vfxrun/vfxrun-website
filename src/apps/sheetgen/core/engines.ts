export type ExportEngine = "godot" | "unity" | "unreal" | "phaser" | "pixi" | "cocos" | "json";

export interface EngineOption {
  id: ExportEngine;
  label: string;
  description: string;
  extension: string;
}

export const ENGINE_OPTIONS: EngineOption[] = [
  {
    id: "godot",
    label: "Godot",
    description: ".tpsheet + SpriteFrames",
    extension: ".tpsheet",
  },
  {
    id: "unity",
    label: "Unity",
    description: "TexturePacker-style JSON",
    extension: "-unity.json",
  },
  {
    id: "unreal",
    label: "Unreal",
    description: "Paper2D sprite sheet JSON",
    extension: "-unreal.json",
  },
  {
    id: "phaser",
    label: "Phaser",
    description: "Phaser 3 atlas JSON",
    extension: "-phaser.json",
  },
  {
    id: "pixi",
    label: "PixiJS",
    description: "TexturePacker JSON (Spritesheet)",
    extension: "-pixi.json",
  },
  {
    id: "cocos",
    label: "Cocos",
    description: "Cocos2d-x plist (Creator)",
    extension: "-cocos.plist",
  },
  {
    id: "json",
    label: "Generic JSON",
    description: "Universal frame map",
    extension: ".json",
  },
];

export function engineExportFileName(atlasName: string, engine: ExportEngine): string {
  switch (engine) {
    case "godot":
      return `${atlasName}.tpsheet`;
    case "unity":
      return `${atlasName}-unity.json`;
    case "unreal":
      return `${atlasName}-unreal.json`;
    case "phaser":
      return `${atlasName}-phaser.json`;
    case "pixi":
      return `${atlasName}-pixi.json`;
    case "cocos":
      return `${atlasName}-cocos.plist`;
    case "json":
      return `${atlasName}.json`;
  }
}
