function readAllDirectoryEntries(reader: FileSystemDirectoryReader): Promise<FileSystemEntry[]> {
  return new Promise((resolve, reject) => {
    const entries: FileSystemEntry[] = [];

    function readBatch(): void {
      reader.readEntries(
        (batch) => {
          if (batch.length === 0) {
            resolve(entries);
            return;
          }
          entries.push(...batch);
          readBatch();
        },
        reject,
      );
    }

    readBatch();
  });
}

function fileFromEntry(entry: FileSystemFileEntry): Promise<File> {
  return new Promise((resolve, reject) => {
    entry.file(resolve, reject);
  });
}

function tagRelativePath(file: File, relativePath: string): File {
  if (file.webkitRelativePath) return file;
  try {
    Object.defineProperty(file, "webkitRelativePath", {
      value: relativePath,
      configurable: true,
    });
  } catch {
    /* ignore */
  }
  return file;
}

async function walkEntry(entry: FileSystemEntry, basePath: string, files: File[]): Promise<void> {
  if (entry.isFile) {
    const file = await fileFromEntry(entry as FileSystemFileEntry);
    const relativePath = basePath ? `${basePath}/${file.name}` : file.name;
    files.push(tagRelativePath(file, relativePath));
    return;
  }

  if (!entry.isDirectory) return;

  const dirEntry = entry as FileSystemDirectoryEntry;
  const nextBase = basePath ? `${basePath}/${entry.name}` : entry.name;
  const children = await readAllDirectoryEntries(dirEntry.createReader());
  for (const child of children) {
    await walkEntry(child, nextBase, files);
  }
}

/** Collect dropped files/folders in the browser (with webkitRelativePath when possible). */
export async function collectFilesFromDrop(dataTransfer: DataTransfer): Promise<File[]> {
  const plainFiles = Array.from(dataTransfer.files);
  if (plainFiles.some((file) => file.webkitRelativePath)) {
    return plainFiles;
  }

  const items = dataTransfer.items;
  if (!items || items.length === 0) {
    return plainFiles;
  }

  const collected: File[] = [];
  const tasks: Promise<void>[] = [];

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    if (item.kind !== "file") continue;
    const entry = item.webkitGetAsEntry?.() ?? null;
    if (!entry) continue;
    tasks.push(walkEntry(entry, "", collected));
  }

  if (tasks.length > 0) {
    await Promise.all(tasks);
  }

  return collected.length > 0 ? collected : plainFiles;
}
