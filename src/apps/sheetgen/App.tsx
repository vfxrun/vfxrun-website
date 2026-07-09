import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ExportEngine } from "@core/engines";
import { pruneExcludedUnderRoot, toggleExcludedPath } from "@core/excludedPaths";
import { resolvePreviewMode, type PreviewMode } from "@core/folderPreview";
import type { FolderTreeNode } from "@core/folderTree";
import type { AtlasPreviewResult } from "@core/atlasPreviewTypes";
import type { PackResult } from "@core/types";
import { FolderBrowser } from "./ui/FolderBrowser";
import { ImagePreview } from "./ui/ImagePreview";
import { ResizableLayout } from "./ui/ResizableLayout";
import { SettingsPanel } from "./ui/SettingsPanel";
import { installGlobalDragDropGuard } from "./ui/dropPaths";

const defaultOptions = {
  atlasName: "Heroes",
  borderPadding: 3,
  spacing: 0,
  trimTransparent: false,
  maxAtlasSize: 4096,
  exportSpriteFrames: true,
  exportEngines: ["godot"] as ExportEngine[],
};

function hasElectronApi(): boolean {
  return typeof window !== "undefined" && Boolean(window.electronApi);
}

function uniqueFolders(folders: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const folder of folders) {
    const normalized = folder.trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }
  return result;
}

export default function App() {
  const [electronReady, setElectronReady] = useState(hasElectronApi());
  const [inputFolders, setInputFolders] = useState<string[]>([]);
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
  const [atlasLoading, setAtlasLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const atlasRequestRef = useRef(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PackResult | null>(null);

  useEffect(() => {
    setElectronReady(hasElectronApi());
    if (!hasElectronApi()) return;
    return installGlobalDragDropGuard();
  }, []);

  useEffect(() => {
    if (!window.electronApi?.getRecentPaths) return;

    void window.electronApi.getRecentPaths().then((settings) => {
      if (settings.inputFolders?.length) {
        setInputFolders(settings.inputFolders);
      } else if (settings.lastInputDir) {
        setInputFolders([settings.lastInputDir]);
      }
      if (settings.excludedFolders?.length) {
        setExcludedFolders(settings.excludedFolders);
      }
      if (settings.lastOutputDir) setOutputDir(settings.lastOutputDir);
      if (settings.lastAtlasName) setAtlasName(settings.lastAtlasName);
      if (settings.exportEngines?.length) setExportEngines(settings.exportEngines);
    });
  }, []);

  const applyPreviewSelection = useCallback((selection: ReturnType<typeof resolvePreviewMode>) => {
    setPreviewMode(selection.mode);
    setPreviewFrames(selection.frames);
    setHighlightPaths(selection.highlightPaths);
    setFocusPath(selection.focusPath);
  }, []);

  useEffect(() => {
    if (inputFolders.length === 0) return;
    if (previewMode !== "empty") return;
    applyPreviewSelection(resolvePreviewMode(null, inputFolders));
  }, [inputFolders, previewMode, applyPreviewSelection]);

  async function persistSettings(patch: Record<string, unknown>): Promise<void> {
    if (!window.electronApi?.saveAppSettings) return;
    await window.electronApi.saveAppSettings(patch);
  }

  const canExport = useMemo(
    () =>
      electronReady &&
      Boolean(inputFolders.length > 0 && outputDir && atlasName.trim() && exportEngines.length > 0),
    [electronReady, inputFolders, outputDir, atlasName, exportEngines],
  );

  const loadAtlasPreview = useCallback(async () => {
    if (inputFolders.length === 0 || !window.electronApi?.previewPackAtlas) {
      setAtlasPreview(null);
      return;
    }

    const requestId = ++atlasRequestRef.current;
    setAtlasLoading(true);
    try {
      const preview = await window.electronApi.previewPackAtlas(inputFolders, {
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
    } finally {
      if (requestId === atlasRequestRef.current) setAtlasLoading(false);
    }
  }, [inputFolders, excludedFolders, borderPadding, spacing, trimTransparent]);

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
  }, [previewMode, loadAtlasPreview, borderPadding, spacing, trimTransparent, excludedFolders, inputFolders]);

  function addInputFolders(folders: string[]): void {
    setInputFolders((current) => {
      const next = uniqueFolders([...current, ...folders]);
      void persistSettings({ inputFolders: next, lastInputDir: next[0] });
      applyPreviewSelection(resolvePreviewMode(null, next));
      return next;
    });
  }

  function removeInputFolder(folderPath: string): void {
    setInputFolders((current) => {
      const next = current.filter((folder) => folder !== folderPath);
      void persistSettings({ inputFolders: next, lastInputDir: next[0] });
      return next;
    });
    setExcludedFolders((current) => {
      const next = pruneExcludedUnderRoot(current, folderPath);
      void persistSettings({ excludedFolders: next });
      return next;
    });
  }

  function toggleExcludeFolder(folderPath: string): void {
    setExcludedFolders((current) => {
      const next = toggleExcludedPath(current, folderPath);
      void persistSettings({ excludedFolders: next });
      return next;
    });
  }

  async function resolveAndAddFolders(paths: string[]): Promise<void> {
    const folders = await window.electronApi?.resolveDroppedFolders(paths);
    if (folders?.length) addInputFolders(folders);
  }

  async function pickInputFolder(): Promise<void> {
    if (!window.electronApi) return;
    try {
      setError(null);
      const folder = await window.electronApi.selectFolder();
      if (folder) addInputFolders([folder]);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function pickOutputFolder(): Promise<void> {
    if (!window.electronApi) return;
    try {
      setError(null);
      const folder = await window.electronApi.selectOutputFolder();
      if (folder) {
        setOutputDir(folder);
        void persistSettings({ lastOutputDir: folder });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function exportAtlas(): Promise<void> {
    if (!canExport || !window.electronApi) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const packResult = await window.electronApi.packFolder(inputFolders, outputDir, {
        atlasName: atlasName.trim(),
        borderPadding,
        spacing,
        trimTransparent,
        maxAtlasSize: defaultOptions.maxAtlasSize,
        exportSpriteFrames: exportEngines.includes("godot") && exportSpriteFrames,
        exportEngines,
        excludedDirs: excludedFolders,
      });
      setResult(packResult);
      if (previewMode === "atlas") void loadAtlasPreview();
      await persistSettings({
        lastAtlasName: atlasName.trim(),
        exportEngines,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="app-toolbar">
        <div className="toolbar-brand">
          <strong>SheetGen</strong>
          <span className="toolbar-version">v0.3.0</span>
        </div>
      </header>

      <ResizableLayout
        left={
          <FolderBrowser
            inputFolders={inputFolders}
            excludedFolders={excludedFolders}
            onAddFolders={addInputFolders}
            onRemoveFolder={removeInputFolder}
            onToggleExclude={toggleExcludeFolder}
            onPickInputFolder={() => void pickInputFolder()}
            onSelectNode={handleSourceSelect}
            onShowFullAtlas={showFullAtlas}
            disabled={!electronReady}
            electronReady={electronReady}
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
            onDropFolder={(paths) => void resolveAndAddFolders(paths)}
            disabled={!electronReady}
          />
        }
        right={
          <SettingsPanel
            exportEngines={exportEngines}
            onEnginesChange={(engines) => {
              setExportEngines(engines);
              void persistSettings({ exportEngines: engines });
            }}
            atlasName={atlasName}
            onAtlasNameChange={setAtlasName}
            onAtlasNameBlur={() => void persistSettings({ lastAtlasName: atlasName.trim() })}
            outputDir={outputDir}
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
            electronReady={electronReady}
          />
        }
      />

      {error ? <div className="toast error">{error}</div> : null}

      {result ? (
        <div className="toast success">
          Exported {result.spriteCount} sprites · {result.atlasWidth}×{result.atlasHeight} ·{" "}
          {result.engines.join(", ")}
        </div>
      ) : null}
    </div>
  );
}
