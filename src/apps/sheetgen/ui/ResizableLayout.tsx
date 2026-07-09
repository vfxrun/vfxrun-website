import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

interface ResizableLayoutProps {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
  defaultLeftWidth?: number;
  defaultRightWidth?: number;
  minLeftWidth?: number;
  minRightWidth?: number;
  minCenterWidth?: number;
}

export function ResizableLayout({
  left,
  center,
  right,
  defaultLeftWidth = 240,
  defaultRightWidth = 300,
  minLeftWidth = 180,
  minRightWidth = 220,
  minCenterWidth = 360,
}: ResizableLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [rightWidth, setRightWidth] = useState(defaultRightWidth);
  const dragRef = useRef<"left" | "right" | null>(null);

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      const container = containerRef.current;
      if (!container || !dragRef.current) return;

      const rect = container.getBoundingClientRect();
      const handleWidth = 6;

      if (dragRef.current === "left") {
        const next = event.clientX - rect.left;
        const max = rect.width - rightWidth - minCenterWidth - handleWidth * 2;
        setLeftWidth(Math.max(minLeftWidth, Math.min(next, max)));
      }

      if (dragRef.current === "right") {
        const next = rect.right - event.clientX;
        const max = rect.width - leftWidth - minCenterWidth - handleWidth * 2;
        setRightWidth(Math.max(minRightWidth, Math.min(next, max)));
      }
    },
    [leftWidth, minCenterWidth, minLeftWidth, minRightWidth, rightWidth],
  );

  const onMouseUp = useCallback(() => {
    dragRef.current = null;
    document.body.classList.remove("is-resizing");
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  function startDrag(edge: "left" | "right"): void {
    dragRef.current = edge;
    document.body.classList.add("is-resizing");
  }

  return (
    <div className="resizable-layout" ref={containerRef}>
      <div className="layout-pane layout-left" style={{ width: leftWidth }}>
        {left}
      </div>
      <div
        className="resize-handle"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sprites panel"
        onMouseDown={() => startDrag("left")}
      />
      <div className="layout-pane layout-center">{center}</div>
      <div
        className="resize-handle"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize settings panel"
        onMouseDown={() => startDrag("right")}
      />
      <div className="layout-pane layout-right" style={{ width: rightWidth }}>
        {right}
      </div>
    </div>
  );
}
