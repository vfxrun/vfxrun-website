import { basename, extname } from "./pathUtils.js";
import type { TpsheetDocument, TpsheetSprite } from "./types.js";

export interface AnimationGroup {
  name: string;
  sprites: TpsheetSprite[];
}

function sanitizeId(value: string): string {
  return value.replace(/[^a-zA-Z0-9_]/g, "_");
}

function atlasSubResourceId(spriteFilename: string): string {
  const base = basename(spriteFilename, extname(spriteFilename));
  return `AtlasTexture_${sanitizeId(base)}`;
}

/**
 * Animation names come from folder path only (not PNG filename frame numbers).
 *
 * heroes/elf/mage_01/idle/foo_00.png     -> hero_elf_mage_01_idle
 * heroes/undead/mage_01/active/bar_00.png -> hero_undead_mage_01_active
 * cyclops_soldier_01/active/foo_00.png    -> cyclops_soldier_01_active
 */
export function animationNameFromSpritePath(spriteFilename: string): string {
  const normalized = spriteFilename.replace(/\\/g, "/");
  const parts = normalized.split("/").filter(Boolean);

  if (parts.length < 2) {
    return basename(spriteFilename, extname(spriteFilename));
  }

  const folderParts = parts.slice(0, -1);

  if (folderParts.length >= 3) {
    return `hero_${folderParts.join("_")}`;
  }

  if (folderParts.length === 2) {
    return `${folderParts[0]}_${folderParts[1]}`;
  }

  const stateFolder = folderParts[0];
  const fileBase = basename(parts[parts.length - 1], extname(parts[parts.length - 1]));
  return `${fileBase}_${stateFolder}`;
}

export function groupSpritesIntoAnimations(sprites: TpsheetSprite[]): AnimationGroup[] {
  const groups = new Map<string, TpsheetSprite[]>();

  for (const sprite of sprites) {
    const name = animationNameFromSpritePath(sprite.filename);
    const list = groups.get(name) ?? [];
    list.push(sprite);
    groups.set(name, list);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, groupSprites]) => ({
      name,
      sprites: groupSprites.sort((a, b) => a.filename.localeCompare(b.filename)),
    }));
}

function buildAtlasSubResource(sprite: TpsheetSprite, atlasExtId: string): string {
  const { x, y, w, h } = sprite.region;
  const { x: mx, y: my, w: mw, h: mh } = sprite.margin;
  const id = atlasSubResourceId(sprite.filename);

  return `[sub_resource type="AtlasTexture" id="${id}"]
atlas = ExtResource("${atlasExtId}")
region = Rect2(${x}, ${y}, ${w}, ${h})
margin = Rect2(${mx}, ${my}, ${mw}, ${mh})`;
}

export function buildSpriteFramesDocument(
  tpsheet: TpsheetDocument,
  atlasName: string,
): string {
  const texture = tpsheet.textures[0];
  const sprites = texture?.sprites ?? [];
  const animations = groupSpritesIntoAnimations(sprites);
  const atlasImage = texture?.image ?? `${atlasName}.png`;
  const atlasExtId = "1_atlas";

  const uniqueSprites = [...sprites].sort((a, b) => a.filename.localeCompare(b.filename));
  const subResources = uniqueSprites
    .map((sprite) => buildAtlasSubResource(sprite, atlasExtId))
    .join("\n\n");

  const animationBlocks = animations.map((animation) => {
    const frames = animation.sprites
      .map((sprite) => {
        const id = atlasSubResourceId(sprite.filename);
        return `{
"duration": 1.0,
"texture": SubResource("${id}")
}`;
      })
      .join(",\n");

    return `{
"frames": [${frames ? `\n${frames}\n` : ""}],
"loop": true,
"name": &"${animation.name}",
"speed": 5.0
}`;
  });

  const loadSteps = uniqueSprites.length + 2;

  return `[gd_resource type="SpriteFrames" load_steps=${loadSteps} format=3]

[ext_resource type="Texture2D" path="${atlasImage}" id="${atlasExtId}"]

${subResources}

[resource]
animations = [${animationBlocks.join(",\n")}]
`;
}

export function spriteFramesFileName(atlasName: string): string {
  return `${atlasName}.spriteframes.tres`;
}
