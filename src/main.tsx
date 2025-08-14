import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { FeatureFlagProvider } from "./context/FeatureFlagContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FeatureFlagProvider>
      <App />
    </FeatureFlagProvider>
  </StrictMode>
);
