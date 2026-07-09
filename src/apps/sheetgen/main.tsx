import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import WebApp from "./web/App";
import "./styles.css";

function isElectronApp(): boolean {
  return typeof window !== "undefined" && Boolean(window.electronApi);
}

export function mountSheetGen(): void {
  const Root = isElectronApp() ? App : WebApp;
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Root />
    </StrictMode>,
  );
}

mountSheetGen();
