import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ─────────────────────────────────────────────────────────────────────────────
// vite.config.js — place this in your /frontend folder.
//
// GitHub Pages serves your site at:
//   https://<your-username>.github.io/<repo-name>/
//
// The `base` option below must match that sub-path so that Vite
// generates correct asset URLs in the built bundle.
//
// Set the REPO_NAME environment variable in the build step, or
// hard-code it here: base: "/my-repo-name/"
// ─────────────────────────────────────────────────────────────────────────────

export default defineConfig({
  plugins: [react()],

  base: process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}/`
    : "/",
  // ↑ GITHUB_REPOSITORY is automatically set by GitHub Actions ("owner/repo").
  //   Locally it is undefined, so base falls back to "/" — dev server works normally.

  build: {
    outDir: "dist",      // upload-pages-artifact points here
    sourcemap: false,    // set to true if you want sourcemaps in production
  },
});