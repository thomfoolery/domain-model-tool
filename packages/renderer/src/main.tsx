import { StrictMode } from "react";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import { createRoot } from "react-dom/client";

import { App, ErrorBoundary } from "./components";

// import "./samples/electron-store";
// import "./samples/preload-module";

import "./styles/index.css";

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <RecoilRoot>
        <RecoilNexus />
        <App />
      </RecoilRoot>
    </ErrorBoundary>
  </StrictMode>
);

window.removeLoading();
