// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import { App, ErrorBoundary } from "./components";

// import "./samples/electron-store";
// import "./samples/preload-module";

import "./styles/index.css";

const root = createRoot(document.getElementById("root")!);

root.render(
  // <StrictMode>
  <ErrorBoundary>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </ErrorBoundary>
  // </StrictMode>
);

window.removeLoading();
