import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  hitTestAtlasSprite,
  sourceBounds,
  type AtlasPreviewResult,
  type AtlasSpritePreview,
} from "@core/atlasPreviewTypes";
import type { PreviewMode } from "@core/folderPreview";
import type { FolderTreeNode } from "@core/folderTree";
import { collectDropPaths } from "./dropPaths";
import { collectFilesFromDrop } from "@core/browser/collectDropFiles";

interface ImagePreviewProps {
  mode: PreviewMode;
  frames: FolderTreeNode[];
  selectedNode: FolderTreeNode | null;
  atlasPreview: AtlasPreviewResult | null;
  highlightPaths: string[];
  focusPath: string | null;
  onFocusSprite: (absolutePath: string | null) => void;
  onDropFolder?: (paths: string[]) => void;
  onDropFiles?: (files: FileList | File[]) => void;
  resolveImageUrl?: (virtualPath: string) => Promise<string>;
  disabled?: boolean;
}

const MIN_ZOOM = 25;
const MAX_ZOOM = 400;
const MIN_STATUS_HEIGHT = 72;
const DEFAULT_STATUS_HEIGHT = 120;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

function AtlasOverlay({
  atlas,
  highlightPaths,
  focusPath,
  selectedSprite,
}: {
  atlas: AtlasPreviewResult;
  highlightPaths: string[];
  focusPath: string | null;
  selectedSprite: AtlasSpritePreview | null;
}) {
  const highlightSet = useMemo(() => new Set(highlightPaths), [highlightPaths]);
  const showAllHighlights = highlightPaths.length > 0;

  return (
    <svg
      className="preview-atlas-overlay"
      viewBox={`0 0 ${atlas.width} ${atlas.height}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {atlas.sprites.map((sprite) => {
        const isFocused =
          selectedSprite?.absolutePath === sprite.absolutePath ||
          (focusPath !== null && sprite.absolutePath === focusPath);
        const isHighlighted =
          showAllHighlights && highlightSet.has(sprite.absolutePath) && !selectedSprite;
        if (!isFocused && !isHighlighted) return null;

        const source = sourceBounds(sprite);
        const { x, y, w, h } = sprite.region;

        return (
          <g key={sprite.absolutePath}>
            {source ? (
              <rect
                x={source.x}
                y={source.y}
                width={source.w}
                height={source.h}
                className="preview-slice-source"
              />
            ) : null}
            <rect x={x} y={y} width={w} height={h} className="preview-slice-region" />
          </g>
        );
      })}

      {selectedSprite ? (
        <g>
          {(() => {
            const source = sourceBounds(selectedSprite);
            const { x, y, w, h } = selectedSprite.region;
            return (
              <>
                {source ? (
                  <rect
                    x={source.x}
                    y={source.y}
                    width={source.w}
                    height={source.h}
                    className="preview-slice-source preview-slice-source-active"
                  />
                ) : null}
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  className="preview-slice-region preview-slice-region-active"
                />
              </>
            );
          })()}
        </g>
      ) : null}
    </svg>
  );
}

export function ImagePreview({
  mode,
  frames,
  selectedNode,
  atlasPreview,
  highlightPaths,
  focusPath,
  onFocusSprite,
  onDropFolder,
  onDropFiles,
  resolveImageUrl,
  disabled,
}: ImagePreviewProps) {
  const containerRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const atlasWrapRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageCache, setImageCache] = useState<Map<string, string>>(new Map());
  const [dragOver, setDragOver] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [fps, setFps] = useState(8);
  const [zoom, setZoom] = useState(100);
  const [statusHeight, setStatusHeight] = useState(DEFAULT_STATUS_HEIGHT);
  const [selectedSprite, setSelectedSprite] = useState<AtlasSpritePreview | null>(null);
  const statusDragRef = useRef(false);

  const framePathsKey = useMemo(() => frames.map((frame) => frame.path).join("\0"), [frames]);
  const activeFrame = frames[activeIndex] ?? null;
  const isAnimation = mode === "animation" && frames.length >= 2;
  const isAtlas = mode === "atlas" && atlasPreview !== null;

  const dataUrl = useMemo(() => {
    if (isAtlas) return atlasPreview.dataUrl;
    if (!activeFrame) return null;
    return imageCache.get(activeFrame.path) ?? null;
  }, [isAtlas, atlasPreview, activeFrame, imageCache]);

  useEffect(() => {
    setActiveIndex(0);
    setPlaying(true);
    setZoom(100);
    setSelectedSprite(null);
  }, [selectedNode?.path, mode]);

  useEffect(() => {
    if (!focusPath || !atlasPreview) {
      setSelectedSprite(null);
      return;
    }
    const match = atlasPreview.sprites.find((sprite) => sprite.absolutePath === focusPath) ?? null;
    setSelectedSprite(match);
  }, [focusPath, atlasPreview]);

  useEffect(() => {
    if (isAtlas || frames.length === 0) {
      setImageCache(new Map());
      return;
    }

    let cancelled = false;

    void (async () => {
      const entries = await Promise.all(
        frames.map(async (frame) => {
          try {
            if (resolveImageUrl) {
              const url = await resolveImageUrl(frame.path);
              return [frame.path, url] as const;
            }
            if (!window.electronApi?.readFileDataUrl) {
              return [frame.path, ""] as const;
            }
            const url = await window.electronApi.readFileDataUrl(frame.path);
            return [frame.path, url] as const;
          } catch {
            return [frame.path, ""] as const;
          }
        }),
      );

      if (cancelled) return;

      const cache = new Map<string, string>();
      for (const [path, url] of entries) {
        if (url) cache.set(path, url);
      }
      setImageCache(cache);
    })();

    return () => {
      cancelled = true;
    };
  }, [isAtlas, framePathsKey, frames, resolveImageUrl]);

  useEffect(() => {
    if (!isAnimation || !playing) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % frames.length);
    }, 1000 / fps);

    return () => window.clearInterval(interval);
  }, [isAnimation, playing, frames.length, fps]);

  const onWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -10 : 10;
    setZoom((current) => clamp(current + delta, MIN_ZOOM, MAX_ZOOM));
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  const onStatusResizeMove = useCallback((event: MouseEvent) => {
    if (!statusDragRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const next = rect.bottom - event.clientY;
    const maxStatus = Math.max(MIN_STATUS_HEIGHT, rect.height - 120);
    setStatusHeight(clamp(next, MIN_STATUS_HEIGHT, maxStatus));
  }, []);

  const onStatusResizeUp = useCallback(() => {
    statusDragRef.current = false;
    document.body.classList.remove("is-resizing-row");
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onStatusResizeMove);
    window.addEventListener("mouseup", onStatusResizeUp);
    return () => {
      window.removeEventListener("mousemove", onStatusResizeMove);
      window.removeEventListener("mouseup", onStatusResizeUp);
    };
  }, [onStatusResizeMove, onStatusResizeUp]);

  function startStatusDrag(): void {
    statusDragRef.current = true;
    document.body.classList.add("is-resizing-row");
  }

  function handleAtlasClick(event: React.MouseEvent<HTMLDivElement>): void {
    if (!atlasPreview || !atlasWrapRef.current) return;

    const img = atlasWrapRef.current.querySelector("img");
    if (!img) return;

    const imgRect = img.getBoundingClientRect();
    const scaleX = atlasPreview.width / imgRect.width;
    const scaleY = atlasPreview.height / imgRect.height;
    const atlasX = (event.clientX - imgRect.left) * scaleX;
    const atlasY = (event.clientY - imgRect.top) * scaleY;

    if (atlasX < 0 || atlasY < 0 || atlasX > atlasPreview.width || atlasY > atlasPreview.height) {
      setSelectedSprite(null);
      onFocusSprite(null);
      return;
    }

    const hit = hitTestAtlasSprite(atlasX, atlasY, atlasPreview.sprites);
    setSelectedSprite(hit);
    onFocusSprite(hit?.absolutePath ?? null);
  }

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

    if (!onDropFolder) return;

    const paths = collectDropPaths(event);
    if (paths.length > 0) onDropFolder(paths);
  }

  const statusLabel = selectedNode
    ? selectedNode.relativePath || selectedNode.name
    : "All sprites";

  const sliceLabel = selectedSprite
    ? `${selectedSprite.filename} · ${selectedSprite.region.w}×${selectedSprite.region.h}`
    : null;

  return (
    <main
      ref={containerRef}
      className={`preview-canvas ${dragOver ? "drag-over" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => void handleDrop(e)}
    >
      <div ref={viewportRef} className="preview-viewport">
        <div className="preview-zoom-controls">
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={5}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label="Zoom"
          />
          <input
            type="number"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={5}
            value={zoom}
            onChange={(e) => setZoom(clamp(Number(e.target.value) || 100, MIN_ZOOM, MAX_ZOOM))}
            aria-label="Zoom percentage"
          />
          <span className="preview-zoom-unit">%</span>
        </div>

        <div className="preview-viewport-content">
          {dataUrl ? (
            <div className="preview-image-stage" style={{ transform: `scale(${zoom / 100})` }}>
              {isAtlas && atlasPreview ? (
                <div ref={atlasWrapRef} className="preview-atlas-wrap" onClick={handleAtlasClick}>
                  <img
                    src={dataUrl}
                    alt="Atlas preview"
                    className="preview-image preview-image-atlas"
                    draggable={false}
                  />
                  <AtlasOverlay
                    atlas={atlasPreview}
                    highlightPaths={highlightPaths}
                    focusPath={focusPath}
                    selectedSprite={selectedSprite}
                  />
                </div>
              ) : (
                <img
                  src={dataUrl}
                  alt={activeFrame?.name ?? "preview"}
                  className="preview-image"
                  draggable={false}
                />
              )}
            </div>
          ) : null}
        </div>
      </div>

      <div
        className="resize-handle resize-handle-horizontal"
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize status panel"
        onMouseDown={startStatusDrag}
      />

      <div className="preview-status-bar" style={{ height: statusHeight }}>
        <div className="preview-status-main">
          <span className="preview-status-label">Selection</span>
          <span className="preview-status-name">{statusLabel}</span>
          {isAtlas && atlasPreview ? (
            <span className="preview-status-meta">
              Atlas {atlasPreview.width}×{atlasPreview.height} · {atlasPreview.spriteCount} sprites
            </span>
          ) : null}
          {sliceLabel ? <span className="preview-status-meta">{sliceLabel}</span> : null}
          {isAnimation ? (
            <span className="preview-status-meta">
              Animation · {frames.length} frames · {activeIndex + 1}/{frames.length}
            </span>
          ) : null}
        </div>

        {isAnimation ? (
          <div className="preview-status-controls">
            <button type="button" className="preview-control-btn" onClick={() => setPlaying(!playing)}>
              {playing ? "Pause" : "Play"}
            </button>
            <label className="preview-fps">
              FPS
              <input
                type="number"
                min={1}
                max={30}
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
              />
            </label>
          </div>
        ) : null}

        {isAnimation && frames.length > 1 ? (
          <div className="preview-frame-bar">
            {frames.slice(0, 64).map((frame, index) => (
              <button
                key={frame.path}
                type="button"
                className={`frame-chip ${index === activeIndex ? "active" : ""}`}
                onClick={() => {
                  setActiveIndex(index);
                  setPlaying(false);
                }}
                title={frame.relativePath || frame.name}
              >
                {frame.name}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
