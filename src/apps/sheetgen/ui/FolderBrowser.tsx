import { useCallback, useEffect, useRef, useState } from "react";
import { isPathExcluded } from "@core/excludedPaths";
import type { FolderTreeNode } from "@core/folderTree";
import { isSmartFolderRoot } from "@core/folderPreview";
import { collectDropPaths } from "./dropPaths";
import { collectFilesFromDrop } from "@core/browser/collectDropFiles";

interface FolderBrowserProps {
  inputFolders: string[];
  inputFolderLabels?: string[];
  excludedFolders: string[];
  treesOverride?: FolderTreeNode[];
  onAddFolders: (folders: string[]) => void;
  onRemoveFolder: (folderPath: string) => void;
  onToggleExclude: (folderPath: string) => void;
  onPickInputFolder: () => void;
  onSelectNode?: (node: FolderTreeNode) => void;
  onShowFullAtlas?: () => void;
  onDropFiles?: (files: FileList | File[]) => void;
  disabled?: boolean;
  electronReady?: boolean;
  webMode?: boolean;
}

function inputFolderSummary(folders: string[], labels?: string[]): string {
  const shown = labels?.length ? labels : folders;
  if (shown.length === 0) return "";
  if (shown.length === 1) return shown[0];
  return `${shown.length} folders · ${shown[0]}`;
}

function TreeNode({
  node,
  depth,
  selectedPath,
  expandedPaths,
  smartRoots,
  excludedFolders,
  onToggle,
  onSelect,
  onRemoveRoot,
  onToggleExclude,
}: {
  node: FolderTreeNode;
  depth: number;
  selectedPath: string | null;
  expandedPaths: Set<string>;
  smartRoots: string[];
  excludedFolders: string[];
  onToggle: (path: string) => void;
  onSelect: (node: FolderTreeNode) => void;
  onRemoveRoot: (path: string) => void;
  onToggleExclude: (path: string) => void;
}) {
  const isFolder = node.type === "folder";
  const isExpanded = expandedPaths.has(node.path);
  const isSelected = selectedPath === node.path;
  const isRoot = isSmartFolderRoot(node, smartRoots);
  const isExcluded = isFolder && isPathExcluded(node.path, excludedFolders);

  return (
    <div className="tree-node">
      <div
        className={`tree-row-wrap ${isSelected ? "selected" : ""} ${isExcluded ? "excluded" : ""}`}
      >
        <button
          type="button"
          className={`tree-row ${isSelected ? "selected" : ""} ${isExcluded ? "excluded" : ""}`}
          style={{ paddingLeft: `${10 + depth * 14}px` }}
          onClick={() => {
            if (isFolder) onToggle(node.path);
            onSelect(node);
          }}
        >
          <span className="tree-icon">
            {isFolder ? (isExpanded ? "▾" : "▸") : node.type === "file" ? "f" : "·"}
          </span>
          <span className="tree-name">{node.name}</span>
          {isExcluded ? <span className="tree-excluded-badge">excluded</span> : null}
          {isFolder && node.imageCount > 0 ? (
            <span className="tree-count">{node.imageCount}</span>
          ) : null}
        </button>
        {isRoot ? (
          <button
            type="button"
            className="tree-remove-btn"
            title="Remove folder from project"
            aria-label={`Remove ${node.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onRemoveRoot(node.path);
            }}
          >
            ×
          </button>
        ) : isFolder ? (
          <button
            type="button"
            className={`tree-remove-btn ${isExcluded ? "tree-include-btn" : ""}`}
            title={isExcluded ? "Include in export" : "Exclude from export"}
            aria-label={isExcluded ? `Include ${node.name}` : `Exclude ${node.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleExclude(node.path);
            }}
          >
            {isExcluded ? "↩" : "×"}
          </button>
        ) : null}
      </div>
      {isFolder && isExpanded
        ? node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              expandedPaths={expandedPaths}
              smartRoots={smartRoots}
              excludedFolders={excludedFolders}
              onToggle={onToggle}
              onSelect={onSelect}
              onRemoveRoot={onRemoveRoot}
              onToggleExclude={onToggleExclude}
            />
          ))
        : null}
    </div>
  );
}

export function FolderBrowser({
  inputFolders,
  inputFolderLabels,
  excludedFolders,
  treesOverride,
  onAddFolders,
  onRemoveFolder,
  onToggleExclude,
  onPickInputFolder,
  onSelectNode,
  onShowFullAtlas,
  onDropFiles,
  disabled,
  electronReady,
  webMode = false,
}: FolderBrowserProps) {
  const [trees, setTrees] = useState<FolderTreeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const onSelectNodeRef = useRef(onSelectNode);
  const onShowFullAtlasRef = useRef(onShowFullAtlas);
  const loadedKeyRef = useRef<string>("");

  onSelectNodeRef.current = onSelectNode;
  onShowFullAtlasRef.current = onShowFullAtlas;

  const foldersKey = inputFolders.join("\0");
  const usingOverride = treesOverride !== undefined;
  const visibleTrees = usingOverride ? treesOverride : trees;

  const loadTrees = useCallback(async (folders: string[]) => {
    if (usingOverride || !window.electronApi?.scanFolderTree || folders.length === 0) {
      setTrees([]);
      loadedKeyRef.current = "";
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        folders.map((folder) => window.electronApi!.scanFolderTree(folder, "source")),
      );
      setTrees(results);
      loadedKeyRef.current = folders.join("\0");
      setExpandedPaths((current) => {
        const next = new Set(current);
        for (const tree of results) next.add(tree.path);
        return next;
      });
      setSelectedPath(null);
      onShowFullAtlasRef.current?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setTrees([]);
      loadedKeyRef.current = "";
    } finally {
      setLoading(false);
    }
  }, [usingOverride]);

  const appendTrees = useCallback(async (folders: string[]) => {
    if (usingOverride || !window.electronApi?.scanFolderTree || folders.length === 0) return;

    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        folders.map((folder) => window.electronApi!.scanFolderTree(folder, "source")),
      );
      setTrees((current) => [...current, ...results]);
      loadedKeyRef.current = inputFolders.join("\0");
      setExpandedPaths((current) => {
        const next = new Set(current);
        for (const tree of results) next.add(tree.path);
        return next;
      });
      const added = results[results.length - 1];
      if (added) {
        setExpandedPaths((current) => {
          const next = new Set(current);
          next.add(added.path);
          return next;
        });
      }
      onShowFullAtlasRef.current?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [inputFolders, usingOverride]);

  useEffect(() => {
    if (usingOverride) return;
    if (inputFolders.length === 0) {
      setTrees([]);
      setSelectedPath(null);
      loadedKeyRef.current = "";
      return;
    }

    const loaded = loadedKeyRef.current ? loadedKeyRef.current.split("\0") : [];
    const added = inputFolders.filter((folder) => !loaded.includes(folder));
    const removed = loaded.filter((folder) => !inputFolders.includes(folder));

    if (added.length === 0 && removed.length === 0) return;

    if (removed.length > 0 || loaded.length === 0) {
      void loadTrees(inputFolders);
      return;
    }

    void appendTrees(added);
  }, [foldersKey, inputFolders, loadTrees, appendTrees, usingOverride]);

  async function handleDrop(event: React.DragEvent): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(false);
    if (disabled) return;

    if (onDropFiles) {
      const files = await collectFilesFromDrop(event.dataTransfer);
      if (files.length > 0) {
        onDropFiles(files);
        return;
      }
    }

    const paths = collectDropPaths(event);
    if (paths.length === 0) return;

    const folders = await window.electronApi?.resolveDroppedFolders(paths);
    if (folders?.length) onAddFolders(folders);
  }

  function handleDragOver(event: React.DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
    setDragOver(true);
  }

  function handleDragLeave(event: React.DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(false);
  }

  function handleSelect(node: FolderTreeNode): void {
    setSelectedPath(node.path);
    onSelectNodeRef.current?.(node);
  }

  function handleShowFullAtlas(): void {
    setSelectedPath(null);
    onShowFullAtlasRef.current?.();
  }

  function toggleExpand(path: string): void {
    setExpandedPaths((current) => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }

  function handleRemoveRoot(folderPath: string): void {
    onRemoveFolder(folderPath);
    if (selectedPath === folderPath) {
      setSelectedPath(null);
    }
  }

  const hasFolders = inputFolders.length > 0;
  const folderSummary = inputFolderSummary(inputFolders, inputFolderLabels);
  const folderSummaryTitle = (inputFolderLabels ?? inputFolders).join("\n");

  return (
    <aside
      className={`sprites-panel ${dragOver ? "drag-over" : ""}`}
      onDragEnter={handleDragOver}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(e) => void handleDrop(e)}
    >
      <div className="sprites-panel-header">
        <h2>Sprites{hasFolders ? ` (${inputFolders.length})` : ""}</h2>
      </div>

      <div className="sprites-input-row">
        <span className="sprites-input-label">Input folder · add multiple</span>
        <div className="path-picker">
          <input
            value={folderSummary}
            readOnly
            placeholder="Select folder..."
            title={folderSummaryTitle}
          />
          <button
            type="button"
            onClick={onPickInputFolder}
            disabled={disabled || (!electronReady && !webMode)}
            title="Add folder"
          >
            …
          </button>
        </div>
      </div>

      <div
        className="sprites-panel-body"
        onClick={(event) => {
          if (event.target === event.currentTarget) handleShowFullAtlas();
        }}
      >
        {loading ? <div className="tree-loading">Scanning folders...</div> : null}
        {error ? <p className="tree-error">{error}</p> : null}

        {!hasFolders ? (
          <div
            className={`sprites-drop-hint ${dragOver ? "drag-over" : ""}`}
            onDragEnter={handleDragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => void handleDrop(e)}
          >
            <p className="sprites-drop-title">
              Drop your sprites
              <br />
              or folders here
            </p>
            <p className="sprites-drop-desc">
              All sprites in a folder are added.
              <br />
              Changes in the folder automatically
              <br />
              update your sprite sheet.
            </p>
            <p className="sprites-drop-formats">png, jpg, webp, bmp</p>
          </div>
        ) : visibleTrees.length > 0 ? (
          <div
            className={`tree-scroll ${loading ? "is-loading" : ""}`}
            onClick={(event) => {
              if (event.target === event.currentTarget) handleShowFullAtlas();
            }}
          >
            {visibleTrees.map((tree) => (
              <TreeNode
                key={tree.path}
                node={tree}
                depth={0}
                selectedPath={selectedPath}
                expandedPaths={expandedPaths}
                smartRoots={inputFolders}
                excludedFolders={excludedFolders}
                onToggle={toggleExpand}
                onSelect={handleSelect}
                onRemoveRoot={handleRemoveRoot}
                onToggleExclude={onToggleExclude}
              />
            ))}
          </div>
        ) : !loading ? (
          <div className="sprites-drop-hint">
            <p className="sprites-drop-title">No sprites found</p>
            <p className="sprites-drop-desc">Drop another folder or check the linked paths.</p>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
