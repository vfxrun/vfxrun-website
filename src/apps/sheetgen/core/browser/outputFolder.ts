import type { WebPackFile } from "./packWeb.js";

const OUTPUT_PICKER_ID = "sheetgen-output";

export function supportsOutputDirectoryPicker(): boolean {
  return typeof window.showDirectoryPicker === "function";
}

export async function ensureDirectoryWritePermission(
  directory: FileSystemDirectoryHandle,
): Promise<PermissionState> {
  const query = directory.queryPermission?.({ mode: "readwrite" });
  if (query) {
    const state = await query;
    if (state === "granted") return state;
  }
  const request = directory.requestPermission?.({ mode: "readwrite" });
  if (!request) {
    throw new Error("当前浏览器不支持写入所选文件夹");
  }
  return request;
}

export async function pickOutputDirectory(
  previous?: FileSystemDirectoryHandle | null,
): Promise<FileSystemDirectoryHandle | null> {
  if (!supportsOutputDirectoryPicker()) {
    return null;
  }

  const handle = await window.showDirectoryPicker({
    mode: "readwrite",
    id: OUTPUT_PICKER_ID,
    startIn: previous ?? "documents",
  });
  const permission = await ensureDirectoryWritePermission(handle);
  if (permission !== "granted") {
    throw new Error("未获得写入该文件夹的权限");
  }
  return handle;
}

async function writeFileToDirectory(
  directory: FileSystemDirectoryHandle,
  name: string,
  blob: Blob,
): Promise<void> {
  const fileHandle = await directory.getFileHandle(name, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
}

export async function savePackToDirectory(
  directory: FileSystemDirectoryHandle,
  files: WebPackFile[],
): Promise<void> {
  for (const file of files) {
    await writeFileToDirectory(directory, file.name, file.blob);
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function downloadPackFiles(files: WebPackFile[]): Promise<void> {
  if (files.length === 1) {
    downloadBlob(files[0].blob, files[0].name);
    return;
  }

  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.name, file.blob);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, "sheetgen-export.zip");
}

export type ExportDestination = "directory" | "download";

export interface ExportPackOptions {
  requireDirectory?: boolean;
}

export async function exportPackFiles(
  files: WebPackFile[],
  directory: FileSystemDirectoryHandle | null,
  options: ExportPackOptions = {},
): Promise<ExportDestination> {
  const { requireDirectory = false } = options;

  if (directory) {
    const permission = await ensureDirectoryWritePermission(directory);
    if (permission === "granted") {
      await savePackToDirectory(directory, files);
      return "directory";
    }
    if (requireDirectory) {
      throw new Error("无法写入所选文件夹，请重新选择 Output folder 并允许写入权限");
    }
  } else if (requireDirectory) {
    throw new Error("请先选择导出文件夹（Output folder）");
  }

  await downloadPackFiles(files);
  return "download";
}

export function formatOutputDirectoryLabel(handle: FileSystemDirectoryHandle | null, storedName: string): string {
  const name = handle?.name || storedName.trim();
  if (!name) return "";
  return name;
}
