/** Collect filesystem paths from a native drag-and-drop event (Electron / Windows). */

function fileUriToPath(uri: string): string | null {
  const trimmed = uri.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;

  if (/^[a-zA-Z]:[\\/]/.test(trimmed) || trimmed.startsWith("\\\\")) {
    return trimmed;
  }

  if (!trimmed.startsWith("file:")) return null;

  try {
    const url = new URL(trimmed);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.startsWith("/") && /^\/[a-zA-Z]:/.test(pathname)) {
      pathname = pathname.slice(1);
    }
    return pathname.replace(/\//g, "\\");
  } catch {
    return null;
  }
}

function addPath(paths: Set<string>, value: string | null | undefined): void {
  if (value && value.trim()) paths.add(value.trim());
}

export function collectDropPaths(event: DragEvent): string[] {
  const paths = new Set<string>();

  for (const file of Array.from(event.dataTransfer.files)) {
    if (window.electronApi?.getPathForFile) {
      try {
        addPath(paths, window.electronApi.getPathForFile(file));
        continue;
      } catch {
        // fall through
      }
    }
    addPath(paths, (file as { path?: string }).path);
  }

  for (const item of Array.from(event.dataTransfer.items)) {
    if (item.kind !== "file") continue;
    const file = item.getAsFile();
    if (!file) continue;
    if (window.electronApi?.getPathForFile) {
      try {
        addPath(paths, window.electronApi.getPathForFile(file));
        continue;
      } catch {
        // fall through
      }
    }
    addPath(paths, (file as { path?: string }).path);
  }

  const uriList = event.dataTransfer.getData("text/uri-list");
  for (const line of uriList.split(/\r?\n/)) {
    addPath(paths, fileUriToPath(line));
  }

  const plain = event.dataTransfer.getData("text/plain");
  for (const line of plain.split(/\r?\n/)) {
    addPath(paths, fileUriToPath(line));
  }

  return [...paths];
}

export function installGlobalDragDropGuard(): () => void {
  function preventDefaults(event: DragEvent): void {
    event.preventDefault();
  }

  window.addEventListener("dragover", preventDefaults);
  window.addEventListener("drop", preventDefaults);
  return () => {
    window.removeEventListener("dragover", preventDefaults);
    window.removeEventListener("drop", preventDefaults);
  };
}
