import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ExportEngine } from "@core/engines";
import { pruneExcludedUnderRoot, toggleExcludedPath } from "@core/excludedPaths";
import { resolvePreviewMode, type PreviewMode } from "@core/folderPreview";
import type { FolderTreeNode } from "@core/folderTree";
import type { AtlasPreviewResult } from "@core/atlasPreviewTypes";
import type { PackResult } from "@core/types";
import {
  buildTreeFromProjectRoot,
  buildWebProjectFromFiles,
  getFileByVirtualPath,
  type WebProjectRoot,
} from "@core/browser/fileTree";
import {
  exportPackFiles,
  formatOutputDirectoryLabel,
  pickOutputDirectory,
  supportsOutputDirectoryPicker,
} from "@core/browser/outputFolder";
import { packWebProject, previewPackWeb } from "@core/browser/packWeb";
import {
  loadOutputDirectoryHandle,
  loadWebSession,
  saveOutputDirectoryHandle,
  saveWebSession,
} from "@core/browser/webSession";
import { fileToDataUrl } from "@core/browser/image";
import { FolderBrowser } from "../ui/FolderBrowser";
import { ImagePreview } from "../ui/ImagePreview";
import { ResizableLayout } from "../ui/ResizableLayout";
import { SettingsPanel } from "../ui/SettingsPanel";

const defaultOptions = {
  atlasName: "Heroes",
  borderPadding: 3,
  spacing: 0,
  trimTransparent: false,
  maxAtlasSize: 4096,
  exportSpriteFrames: true,
  exportEngines: ["godot"] as ExportEngine[],
};

function uniqueRoots(roots: WebProjectRoot[]): WebProjectRoot[] {
  const seen = new Set<string>();
  const result: WebProjectRoot[] = [];
  for (const root of roots) {
    if (seen.has(root.id)) continue;
    seen.add(root.id);
    result.push(root);
  }
  return result;
}

function rootIdFromFiles(files: File[]): string {
  const first = files[0];
  const relative = first?.webkitRelativePath || first?.name || "folder";
  const top = relative.split("/")[0] || "folder";
  return `web:${top}`;
}

export default function WebApp() {
  const [projectRoots, setProjectRoots] = useState<WebProjectRoot[]>([]);
  const [excludedFolders, setExcludedFolders] = useState<string[]>([]);
  const [outputDir, setOutputDir] = useState("");
  const [atlasName, setAtlasName] = useState(defaultOptions.atlasName);
  const [borderPadding, setBorderPadding] = useState(defaultOptions.borderPadding);
  const [spacing, setSpacing] = useState(defaultOptions.spacing);
  const [trimTransparent, setTrimTransparent] = useState(defaultOptions.trimTransparent);
  const [exportSpriteFrames, setExportSpriteFrames] = useState(defaultOptions.exportSpriteFrames);
  const [exportEngines, setExportEngines] = useState<ExportEngine[]>(defaultOptions.exportEngines);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("empty");
  const [previewFrames, setPreviewFrames] = useState<FolderTreeNode[]>([]);
  const [highlightPaths, setHighlightPaths] = useState<string[]>([]);
  const [focusPath, setFocusPath] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<FolderTreeNode | null>(null);
  const [atlasPreview, setAtlasPreview] = useState<AtlasPreviewResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PackResult | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const atlasRequestRef = useRef(0);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const outputHandleRef = useRef<FileSystemDirectoryHandle | null>(null);

  const inputFolders = useMemo(() => projectRoots.map((root) => root.id), [projectRoots]);
  const inputFolderLabels = useMemo(() => projectRoots.map((root) => root.label), [projectRoots]);
  const trees = useMemo(
    () => projectRoots.map((root) => buildTreeFromProjectRoot(root)),
    [projectRoots],
  );

  const applyPreviewSelection = useCallback((selection: ReturnType<typeof resolvePreviewMode>) => {
    setPreviewMode(selection.mode);
    setPreviewFrames(selection.frames);
    setHighlightPaths(selection.highlightPaths);
    setFocusPath(selection.focusPath);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const [savedHandle, savedSession] = await Promise.all([
          loadOutputDirectoryHandle(),
          loadWebSession(),
        ]);

        if (cancelled) return;

        if (savedHandle) {
          outputHandleRef.current = savedHandle;
          setOutputDir(formatOutputDirectoryLabel(savedHandle, savedHandle.name));
        }

        if (savedSession) {
          setProjectRoots(savedSession.projectRoots);
          setExcludedFolders(savedSession.excludedFolders);
          if (!savedHandle && savedSession.outputDirName) {
            setOutputDir(savedSession.outputDirName);
          }
          setAtlasName(savedSession.atlasName);
          setBorderPadding(savedSession.borderPadding);
          setSpacing(savedSession.spacing);
          setTrimTransparent(savedSession.trimTransparent);
          setExportSpriteFrames(savedSession.exportSpriteFrames);
          setExportEngines(savedSession.exportEngines);
          applyPreviewSelection(resolvePreviewMode(null, savedSession.projectRoots.map((root) => root.id)));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!cancelled) setSessionReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [applyPreviewSelection]);

  useEffect(() => {
    if (!sessionReady) return;
    const timer = window.setTimeout(() => {
      void saveWebSession({
        projectRoots,
        excludedFolders,
        outputDirName: outputDir,
        atlasName,
        borderPadding,
        spacing,
        trimTransparent,
        exportSpriteFrames,
        exportEngines,
      });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [
    sessionReady,
    projectRoots,
    excludedFolders,
    outputDir,
    atlasName,
    borderPadding,
    spacing,
    trimTransparent,
    exportSpriteFrames,
    exportEngines,
  ]);

  useEffect(() => {
    if (inputFolders.length === 0) return;
    if (previewMode !== "empty") return;
    applyPreviewSelection(resolvePreviewMode(null, inputFolders));
  }, [inputFolders, previewMode, applyPreviewSelection]);

  const canExport = useMemo(() => {
    if (!projectRoots.length || !atlasName.trim() || !exportEngines.length) return false;
    if (supportsOutputDirectoryPicker() && !outputDir.trim()) return false;
    return true;
  }, [projectRoots, atlasName, exportEngines, outputDir]);

  async function pickOutputFolder(): Promise<void> {
    setError(null);
    if (!supportsOutputDirectoryPicker()) {
      setError("当前浏览器不支持选择导出文件夹，请使用 Chrome 或 Edge。");
      return;
    }

    try {
      const handle = await pickOutputDirectory(outputHandleRef.current);
      if (!handle) return;
      outputHandleRef.current = handle;
      const label = formatOutputDirectoryLabel(handle, handle.name);
      setOutputDir(label);
      await saveOutputDirectoryHandle(handle);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  const loadAtlasPreview = useCallback(async () => {
    if (projectRoots.length === 0) {
      setAtlasPreview(null);
      return;
    }

    const requestId = ++atlasRequestRef.current;
    try {
      const preview = await previewPackWeb(projectRoots, {
        borderPadding,
        spacing,
        trimTransparent,
        maxAtlasSize: defaultOptions.maxAtlasSize,
        excludedDirs: excludedFolders,
      });
      if (requestId === atlasRequestRef.current) setAtlasPreview(preview);
    } catch (err) {
      if (requestId === atlasRequestRef.current) {
        setAtlasPreview(null);
        setError(err instanceof Error ? err.message : String(err));
      }
    }
  }, [projectRoots, excludedFolders, borderPadding, spacing, trimTransparent]);

  const showFullAtlas = useCallback(() => {
    setSelectedNode(null);
    applyPreviewSelection(resolvePreviewMode(null, inputFolders));
    void loadAtlasPreview();
  }, [applyPreviewSelection, inputFolders, loadAtlasPreview]);

  const handleSourceSelect = useCallback(
    (node: FolderTreeNode) => {
      setSelectedNode(node);
      applyPreviewSelection(resolvePreviewMode(node, inputFolders));
    },
    [applyPreviewSelection, inputFolders],
  );

  useEffect(() => {
    if (previewMode !== "atlas") return;
    const timer = window.setTimeout(() => void loadAtlasPreview(), 250);
    return () => window.clearTimeout(timer);
  }, [previewMode, loadAtlasPreview, borderPadding, spacing, trimTransparent, excludedFolders, projectRoots]);

  function addProjectRoot(root: WebProjectRoot): void {
    setProjectRoots((current) => {
      const withoutDuplicate = current.filter((item) => item.id !== root.id);
      return uniqueRoots([...withoutDuplicate, root]);
    });
    applyPreviewSelection(resolvePreviewMode(null, [...inputFolders, root.id]));
  }

  function addFilesFromList(files: FileList | File[]): void {
    const list = Array.from(files);
    if (list.length === 0) return;
    const rootId = rootIdFromFiles(list);
    const label = list[0]?.webkitRelativePath?.split("/")[0] || list[0]?.name || "Sprites";
    addProjectRoot(buildWebProjectFromFiles(rootId, label, list));
  }

  function removeInputFolder(folderPath: string): void {
    setProjectRoots((current) => current.filter((root) => root.id !== folderPath));
    setExcludedFolders((current) => pruneExcludedUnderRoot(current, folderPath));
  }

  function toggleExcludeFolder(folderPath: string): void {
    setExcludedFolders((current) => toggleExcludedPath(current, folderPath));
  }

  async function resolveOutputHandle(): Promise<FileSystemDirectoryHandle | null> {
    if (outputHandleRef.current) return outputHandleRef.current;
    const saved = await loadOutputDirectoryHandle();
    if (saved) {
      outputHandleRef.current = saved;
      setOutputDir(formatOutputDirectoryLabel(saved, saved.name));
    }
    return saved;
  }

  async function exportAtlas(): Promise<void> {
    if (!canExport) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setExportNotice(null);
    try {
      const packed = await packWebProject(projectRoots, {
        atlasName: atlasName.trim(),
        borderPadding,
        spacing,
        trimTransparent,
        maxAtlasSize: defaultOptions.maxAtlasSize,
        exportSpriteFrames: exportEngines.includes("godot") && exportSpriteFrames,
        exportEngines,
        excludedDirs: excludedFolders,
      });

      const directory = supportsOutputDirectoryPicker() ? await resolveOutputHandle() : null;
      const destination = await exportPackFiles(packed.files, directory, {
        requireDirectory: supportsOutputDirectoryPicker(),
      });

      setResult(packed.packResult);
      const fileNames = packed.files.map((file) => file.name).join("、");
      setExportNotice(
        destination === "directory"
          ? `已导出到文件夹「${outputDir || directory?.name || ""}」：${fileNames}`
          : `已下载到浏览器默认下载文件夹：${fileNames}`,
      );
      if (previewMode === "atlas") void loadAtlasPreview();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  const resolveImageUrl = useCallback(
    async (virtualPath: string) => {
      const file = getFileByVirtualPath(projectRoots, virtualPath);
      if (!file) return "";
      return fileToDataUrl(file);
    },
    [projectRoots],
  );

  return (
    <div className="app-shell">
      <input
        ref={folderInputRef}
        type="file"
        multiple
        {...({ webkitdirectory: "", directory: "" } as React.InputHTMLAttributes<HTMLInputElement>)}
        style={{ display: "none" }}
        onChange={(event) => {
          if (event.target.files?.length) addFilesFromList(event.target.files);
          event.target.value = "";
        }}
      />

      <header className="app-toolbar">
        <div className="toolbar-brand">
          <strong>SheetGen</strong>
          <span className="toolbar-version">Web</span>
        </div>
      </header>

      <ResizableLayout
        left={
          <FolderBrowser
            inputFolders={inputFolders}
            inputFolderLabels={inputFolderLabels}
            excludedFolders={excludedFolders}
            treesOverride={trees}
            onAddFolders={() => folderInputRef.current?.click()}
            onRemoveFolder={removeInputFolder}
            onToggleExclude={toggleExcludeFolder}
            onPickInputFolder={() => folderInputRef.current?.click()}
            onSelectNode={handleSourceSelect}
            onShowFullAtlas={showFullAtlas}
            onDropFiles={addFilesFromList}
            electronReady
            webMode
          />
        }
        center={
          <ImagePreview
            mode={previewMode}
            frames={previewFrames}
            selectedNode={selectedNode}
            atlasPreview={atlasPreview}
            highlightPaths={highlightPaths}
            focusPath={focusPath}
            onFocusSprite={setFocusPath}
            resolveImageUrl={resolveImageUrl}
            onDropFiles={addFilesFromList}
          />
        }
        right={
          <SettingsPanel
            exportEngines={exportEngines}
            onEnginesChange={setExportEngines}
            atlasName={atlasName}
            onAtlasNameChange={setAtlasName}
            onAtlasNameBlur={() => undefined}
            outputDir={outputDir}
            outputDirPlaceholder={
              supportsOutputDirectoryPicker()
                ? "Select folder..."
                : "当前浏览器不支持，将下载到默认文件夹"
            }
            onPickOutputFolder={() => void pickOutputFolder()}
            borderPadding={borderPadding}
            onBorderPaddingChange={setBorderPadding}
            spacing={spacing}
            onSpacingChange={setSpacing}
            trimTransparent={trimTransparent}
            onTrimTransparentChange={setTrimTransparent}
            exportSpriteFrames={exportSpriteFrames}
            onExportSpriteFramesChange={setExportSpriteFrames}
            showSpriteFrames={exportEngines.includes("godot")}
            canExport={canExport}
            busy={busy}
            onExport={() => void exportAtlas()}
            electronReady
            webMode
          />
        }
      />

      {error ? <div className="toast error">{error}</div> : null}

      {exportNotice ? <div className="toast success">{exportNotice}</div> : null}

      {result && !exportNotice ? (
        <div className="toast success">
          Exported {result.spriteCount} sprites · {result.atlasWidth}×{result.atlasHeight} ·{" "}
          {result.engines.join(", ")}
        </div>
      ) : null}
    </div>
  );
}
