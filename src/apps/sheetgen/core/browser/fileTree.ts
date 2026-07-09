import { extname, joinPath, normalizePath } from "../pathUtils.js";
import { isPathExcluded } from "../excludedPaths.js";
import type { FolderTreeNode } from "../folderTree.js";

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".bmp"]);

export interface WebFileEntry {
  virtualPath: string;
  file: File;
}

export interface WebProjectRoot {
  id: string;
  label: string;
  entries: WebFileEntry[];
}

function isImagePath(path: string): boolean {
  return IMAGE_EXTENSIONS.has(extname(path).toLowerCase());
}

function countImages(node: FolderTreeNode): number {
  if (node.type === "image") return 1;
  return node.children.reduce((sum, child) => sum + countImages(child), 0);
}

function insertPath(root: FolderTreeNode, parts: string[], file?: File): void {
  if (parts.length === 0) return;

  const [head, ...rest] = parts;
  const currentPath = joinPath(root.path, head);
  if (rest.length === 0) {
    const isImage = file ? isImagePath(file.name) : isImagePath(head);
    root.children.push({
      name: head,
      path: currentPath,
      relativePath: normalizePath(currentPath.slice(root.path.length + 1)),
      type: isImage ? "image" : "file",
      imageCount: isImage ? 1 : 0,
      children: [],
    });
    return;
  }

  let folder = root.children.find((child) => child.name === head && child.type === "folder");
  if (!folder) {
    folder = {
      name: head,
      path: currentPath,
      relativePath: normalizePath(currentPath.slice(root.path.length + 1)),
      type: "folder",
      imageCount: 0,
      children: [],
    };
    root.children.push(folder);
  }
  insertPath(folder, rest, file);
}

function finalizeTree(node: FolderTreeNode): FolderTreeNode {
  if (node.type !== "folder") return node;
  const children = node.children
    .map(finalizeTree)
    .sort((a, b) => {
      if (a.type === "folder" && b.type !== "folder") return -1;
      if (a.type !== "folder" && b.type === "folder") return 1;
      return a.name.localeCompare(b.name);
    });
  return {
    ...node,
    children,
    imageCount: children.reduce((sum, child) => sum + countImages(child), 0),
  };
}

export function buildWebProjectFromFiles(rootId: string, label: string, files: File[]): WebProjectRoot {
  const entries: WebFileEntry[] = [];
  for (const file of files) {
    const relative = normalizePath(file.webkitRelativePath || file.name);
    if (!relative || relative.startsWith("..")) continue;
    entries.push({ virtualPath: joinPath(rootId, relative), file });
  }

  return { id: rootId, label, entries };
}

export function buildTreeFromProjectRoot(root: WebProjectRoot): FolderTreeNode {
  const tree: FolderTreeNode = {
    name: root.label,
    path: root.id,
    relativePath: "",
    type: "folder",
    imageCount: 0,
    children: [],
  };

  for (const entry of root.entries) {
    const relative = normalizePath(entry.virtualPath.slice(root.id.length + 1));
    const parts = relative.split("/").filter(Boolean);
    if (parts.length === 0) continue;
    insertPath(tree, parts, entry.file);
  }

  return finalizeTree(tree);
}

export function collectProjectFiles(
  roots: WebProjectRoot[],
  excludedDirs: string[] = [],
): WebFileEntry[] {
  const results: WebFileEntry[] = [];
  for (const root of roots) {
    for (const entry of root.entries) {
      if (isPathExcluded(entry.virtualPath, excludedDirs)) continue;
      if (!isImagePath(entry.virtualPath)) continue;
      results.push(entry);
    }
  }
  results.sort((a, b) => a.virtualPath.localeCompare(b.virtualPath));
  return results;
}

export function getFileByVirtualPath(
  roots: WebProjectRoot[],
  virtualPath: string,
): File | undefined {
  for (const root of roots) {
    const match = root.entries.find((entry) => entry.virtualPath === virtualPath);
    if (match) return match.file;
  }
  return undefined;
}
