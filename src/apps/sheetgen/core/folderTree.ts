export interface FolderTreeNode {
  name: string;
  path: string;
  relativePath: string;
  type: "folder" | "image" | "file";
  imageCount: number;
  children: FolderTreeNode[];
}

export function listImagesInNode(node: FolderTreeNode): FolderTreeNode[] {
  if (node.type === "image") return [node];

  const images: FolderTreeNode[] = [];
  for (const child of node.children) {
    images.push(...listImagesInNode(child));
  }
  return images.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

export function listFilesInNode(node: FolderTreeNode): FolderTreeNode[] {
  if (node.type === "image" || node.type === "file") return [node];

  const files: FolderTreeNode[] = [];
  for (const child of node.children) {
    files.push(...listFilesInNode(child));
  }
  return files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}
