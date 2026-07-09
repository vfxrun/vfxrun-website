import type { ExportEngine } from "../engines.js";
import type { WebProjectRoot } from "./fileTree.js";

const DB_NAME = "sheetgen-web";
const DB_VERSION = 1;
const SESSION_KEY = "session";
const OUTPUT_HANDLE_KEY = "output-dir";

interface StoredFileEntry {
  virtualPath: string;
  fileName: string;
  blob: Blob;
  lastModified: number;
  mimeType: string;
}

interface StoredProjectRoot {
  id: string;
  label: string;
  entries: StoredFileEntry[];
}

export interface WebSessionSnapshot {
  projectRoots: StoredProjectRoot[];
  excludedFolders: string[];
  outputDirName: string;
  atlasName: string;
  borderPadding: number;
  spacing: number;
  trimTransparent: boolean;
  exportSpriteFrames: boolean;
  exportEngines: ExportEngine[];
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error ?? new Error("无法打开本地存储"));
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("kv")) {
        db.createObjectStore("kv");
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

async function kvGet<T>(key: string): Promise<T | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("kv", "readonly");
    const store = tx.objectStore("kv");
    const request = store.get(key);
    request.onerror = () => reject(request.error ?? new Error("读取本地存储失败"));
    request.onsuccess = () => resolve(request.result as T | undefined);
  });
}

async function kvSet(key: string, value: unknown): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("kv", "readwrite");
    const store = tx.objectStore("kv");
    const request = store.put(value, key);
    request.onerror = () => reject(request.error ?? new Error("写入本地存储失败"));
    request.onsuccess = () => resolve();
  });
}

function serializeProjectRoots(roots: WebProjectRoot[]): StoredProjectRoot[] {
  return roots.map((root) => ({
    id: root.id,
    label: root.label,
    entries: root.entries.map((entry) => ({
      virtualPath: entry.virtualPath,
      fileName: entry.file.name,
      blob: entry.file,
      lastModified: entry.file.lastModified,
      mimeType: entry.file.type || "application/octet-stream",
    })),
  }));
}

function deserializeProjectRoots(stored: StoredProjectRoot[]): WebProjectRoot[] {
  return stored.map((root) => ({
    id: root.id,
    label: root.label,
    entries: root.entries.map((entry) => ({
      virtualPath: entry.virtualPath,
      file: new File([entry.blob], entry.fileName, {
        type: entry.mimeType,
        lastModified: entry.lastModified,
      }),
    })),
  }));
}

export async function saveWebSession(snapshot: {
  projectRoots: WebProjectRoot[];
  excludedFolders: string[];
  outputDirName: string;
  atlasName: string;
  borderPadding: number;
  spacing: number;
  trimTransparent: boolean;
  exportSpriteFrames: boolean;
  exportEngines: ExportEngine[];
}): Promise<void> {
  const data: WebSessionSnapshot = {
    projectRoots: serializeProjectRoots(snapshot.projectRoots),
    excludedFolders: snapshot.excludedFolders,
    outputDirName: snapshot.outputDirName,
    atlasName: snapshot.atlasName,
    borderPadding: snapshot.borderPadding,
    spacing: snapshot.spacing,
    trimTransparent: snapshot.trimTransparent,
    exportSpriteFrames: snapshot.exportSpriteFrames,
    exportEngines: snapshot.exportEngines,
  };
  await kvSet(SESSION_KEY, data);
}

export async function loadWebSession(): Promise<{
  projectRoots: WebProjectRoot[];
  excludedFolders: string[];
  outputDirName: string;
  atlasName: string;
  borderPadding: number;
  spacing: number;
  trimTransparent: boolean;
  exportSpriteFrames: boolean;
  exportEngines: ExportEngine[];
} | null> {
  const data = await kvGet<WebSessionSnapshot>(SESSION_KEY);
  if (!data?.projectRoots?.length) return null;

  return {
    projectRoots: deserializeProjectRoots(data.projectRoots),
    excludedFolders: data.excludedFolders ?? [],
    outputDirName: data.outputDirName ?? "",
    atlasName: data.atlasName ?? "Heroes",
    borderPadding: data.borderPadding ?? 3,
    spacing: data.spacing ?? 0,
    trimTransparent: data.trimTransparent ?? false,
    exportSpriteFrames: data.exportSpriteFrames ?? true,
    exportEngines: data.exportEngines?.length ? data.exportEngines : ["godot"],
  };
}

export async function saveOutputDirectoryHandle(handle: FileSystemDirectoryHandle): Promise<void> {
  await kvSet(OUTPUT_HANDLE_KEY, handle);
}

export async function loadOutputDirectoryHandle(): Promise<FileSystemDirectoryHandle | null> {
  const handle = await kvGet<FileSystemDirectoryHandle>(OUTPUT_HANDLE_KEY);
  return handle ?? null;
}

export async function clearWebSession(): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("kv", "readwrite");
    const store = tx.objectStore("kv");
    store.delete(SESSION_KEY);
    store.delete(OUTPUT_HANDLE_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("清除本地存储失败"));
  });
}
