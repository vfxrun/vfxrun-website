import { listImagesInNode, type FolderTreeNode } from "./folderTree.js";

export type PreviewMode = "empty" | "atlas" | "animation";

export function isRootNode(node: FolderTreeNode, rootDirs: string | string[]): boolean {
  const roots = Array.isArray(rootDirs) ? rootDirs : [rootDirs];
  return roots.includes(node.path) || node.relativePath === "";
}

export function isSmartFolderRoot(node: FolderTreeNode, rootDirs: string[]): boolean {
  return rootDirs.includes(node.path);
}

/** Images directly inside this folder (not nested subfolders). */
export function listDirectImages(node: FolderTreeNode): FolderTreeNode[] {
  if (node.type === "image") return [node];
  if (node.type !== "folder") return [];

  return node.children
    .filter((child) => child.type === "image")
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}

const SEQUENCE_PATTERN = /(?:^|[_-])(\d+)\.[^.]+$/i;

export function isAnimationSequence(images: FolderTreeNode[]): boolean {
  if (images.length < 2) return false;
  return images.every((image) => SEQUENCE_PATTERN.test(image.name));
}

export interface PreviewSelection {
  mode: PreviewMode;
  frames: FolderTreeNode[];
  highlightPaths: string[];
  focusPath: string | null;
}

export function resolvePreviewMode(
  node: FolderTreeNode | null,
  rootDirs: string | string[],
): PreviewSelection {
  if (!node) {
    return { mode: "atlas", frames: [], highlightPaths: [], focusPath: null };
  }

  if (isRootNode(node, rootDirs)) {
    return { mode: "atlas", frames: [], highlightPaths: [], focusPath: null };
  }

  if (node.type === "image") {
    return { mode: "atlas", frames: [], highlightPaths: [node.path], focusPath: node.path };
  }

  const direct = listDirectImages(node);
  if (direct.length >= 2 && isAnimationSequence(direct)) {
    return { mode: "animation", frames: direct, highlightPaths: [], focusPath: null };
  }

  const allImages = listImagesInNode(node);
  return {
    mode: "atlas",
    frames: [],
    highlightPaths: allImages.map((image) => image.path),
    focusPath: null,
  };
}
