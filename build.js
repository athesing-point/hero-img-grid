const esbuild = require("esbuild");

// Bundle JS
esbuild
  .build({
    entryPoints: ["hero-grid.js"],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: ["es2020"],
    outfile: "dist/hero-grid.js",
  })
  .catch(() => process.exit(1));

// Bundle CSS
esbuild
  .build({
    entryPoints: ["hero-grid.css"],
    bundle: true,
    minify: true,
    sourcemap: true,
    outfile: "dist/hero-grid.css",
  })
  .catch(() => process.exit(1));
