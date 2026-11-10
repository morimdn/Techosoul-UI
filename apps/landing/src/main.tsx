import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/saira/wdth.css";
import "@fontsource-variable/martian-mono/wdth.css";
import "antd/dist/reset.css";
import "@techosoul/ui/styles.css";
import "./landing.css";
import { TechosoulProvider } from "@techosoul/ui";
import App from "./App";

let savedTheme: "light" | "dark" = "dark";
try {
  if (localStorage.getItem("techosoul-landing-theme") === "light") savedTheme = "light";
} catch {
  /* storage unavailable: default to dark */
}
document.documentElement.dataset.theme = savedTheme;

// Scroll reveals hide content only when JS runs and motion is allowed.
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  document.documentElement.classList.add("reveal-ready");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TechosoulProvider initialMode={savedTheme}>
      <App />
    </TechosoulProvider>
  </React.StrictMode>,
);
