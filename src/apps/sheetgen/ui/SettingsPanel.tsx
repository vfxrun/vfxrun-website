import { useState, type ReactNode } from "react";
import type { ExportEngine } from "@core/engines";
import { ENGINE_OPTIONS } from "@core/engines";

interface SettingsPanelProps {
  exportEngines: ExportEngine[];
  onEnginesChange: (engines: ExportEngine[]) => void;
  atlasName: string;
  onAtlasNameChange: (value: string) => void;
  onAtlasNameBlur: () => void;
  outputDir: string;
  outputDirPlaceholder?: string;
  onPickOutputFolder: () => void;
  borderPadding: number;
  onBorderPaddingChange: (value: number) => void;
  spacing: number;
  onSpacingChange: (value: number) => void;
  trimTransparent: boolean;
  onTrimTransparentChange: (value: boolean) => void;
  exportSpriteFrames: boolean;
  onExportSpriteFramesChange: (value: boolean) => void;
  showSpriteFrames: boolean;
  canExport: boolean;
  busy: boolean;
  onExport: () => void;
  electronReady: boolean;
  webMode?: boolean;
}

function SettingsSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="settings-section">
      <button type="button" className="settings-section-header" onClick={() => setOpen(!open)}>
        <span className={`settings-chevron ${open ? "open" : ""}`}>▸</span>
        <span>{title}</span>
      </button>
      {open ? <div className="settings-section-body">{children}</div> : null}
    </section>
  );
}

function SettingRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="setting-row">
      <span className="setting-label">{label}</span>
      <div className="setting-control">{children}</div>
    </div>
  );
}

export function SettingsPanel({
  exportEngines,
  onEnginesChange,
  atlasName,
  onAtlasNameChange,
  onAtlasNameBlur,
  outputDir,
  outputDirPlaceholder = "Select folder...",
  onPickOutputFolder,
  borderPadding,
  onBorderPaddingChange,
  spacing,
  onSpacingChange,
  trimTransparent,
  onTrimTransparentChange,
  exportSpriteFrames,
  onExportSpriteFramesChange,
  showSpriteFrames,
  canExport,
  busy,
  onExport,
  electronReady,
  webMode = false,
}: SettingsPanelProps) {
  function toggleEngine(engine: ExportEngine): void {
    if (exportEngines.includes(engine)) {
      const next = exportEngines.filter((item) => item !== engine);
      onEnginesChange(next.length > 0 ? next : ["godot"]);
      return;
    }
    onEnginesChange([...exportEngines, engine]);
  }

  return (
    <aside className="settings-panel">
      <div className="settings-panel-header">
        <h2>Settings</h2>
      </div>

      <div className="settings-scroll">
        <SettingsSection title="Data">
          <SettingRow label="Data format">
            <div className="engine-checklist">
              {ENGINE_OPTIONS.map((engine) => (
                <label key={engine.id} className="engine-check">
                  <input
                    type="checkbox"
                    checked={exportEngines.includes(engine.id)}
                    onChange={() => toggleEngine(engine.id)}
                  />
                  <span>{engine.label}</span>
                </label>
              ))}
            </div>
          </SettingRow>
          <SettingRow label="Sprite sheet file">
            <input
              value={atlasName}
              onChange={(e) => onAtlasNameChange(e.target.value)}
              onBlur={onAtlasNameBlur}
              placeholder="heroes"
            />
          </SettingRow>
          <SettingRow label="Output folder">
            <div className="path-picker">
              <input value={outputDir} readOnly placeholder={outputDirPlaceholder} title={outputDir} />
              <button
                type="button"
                onClick={onPickOutputFolder}
                disabled={webMode ? false : !electronReady}
              >
                …
              </button>
            </div>
          </SettingRow>
        </SettingsSection>

        <SettingsSection title="Layout">
          <SettingRow label="Border padding">
            <input
              type="number"
              min={0}
              value={borderPadding}
              onChange={(e) => onBorderPaddingChange(Number(e.target.value))}
            />
          </SettingRow>
          <SettingRow label="Shape padding">
            <input
              type="number"
              min={0}
              value={spacing}
              onChange={(e) => onSpacingChange(Number(e.target.value))}
            />
          </SettingRow>
        </SettingsSection>

        <SettingsSection title="Sprites">
          <SettingRow label="Trim mode">
            <label className="inline-check">
              <input
                type="checkbox"
                checked={trimTransparent}
                onChange={(e) => onTrimTransparentChange(e.target.checked)}
              />
              <span>Trim transparent pixels</span>
            </label>
          </SettingRow>
          {showSpriteFrames ? (
            <SettingRow label="SpriteFrames">
              <label className="inline-check">
                <input
                  type="checkbox"
                  checked={exportSpriteFrames}
                  onChange={(e) => onExportSpriteFramesChange(e.target.checked)}
                />
                <span>Auto-generate for Godot</span>
              </label>
            </SettingRow>
          ) : null}
        </SettingsSection>
      </div>

      <div className="settings-footer">
        <button
          className="primary publish-btn"
          type="button"
          disabled={!canExport || busy}
          onClick={onExport}
        >
          {busy ? "Publishing..." : "Publish sprite sheet"}
        </button>
      </div>
    </aside>
  );
}
