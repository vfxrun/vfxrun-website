/// <reference types="vite/client" />

interface Window {
  showDirectoryPicker?: (options?: {
    mode?: "read" | "readwrite";
    id?: string;
    startIn?: "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos" | FileSystemHandle;
  }) => Promise<FileSystemDirectoryHandle>;
}

interface FileSystemHandlePermissionDescriptor {
  mode?: "read" | "readwrite";
}

interface FileSystemDirectoryHandle {
  readonly name: string;
  queryPermission?: (
    descriptor?: FileSystemHandlePermissionDescriptor,
  ) => Promise<PermissionState>;
  requestPermission?: (
    descriptor?: FileSystemHandlePermissionDescriptor,
  ) => Promise<PermissionState>;
  getFileHandle: (
    name: string,
    options?: { create?: boolean },
  ) => Promise<FileSystemFileHandle>;
}

interface FileSystemFileHandle {
  createWritable: () => Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream extends WritableStream {
  write: (data: Blob | BufferSource | string) => Promise<void>;
  close: () => Promise<void>;
}
