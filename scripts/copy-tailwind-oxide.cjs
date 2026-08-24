/**
 * Turbopack's PostCSS worker cannot resolve Tailwind v4's optional
 * platform package. Copy the native .node next to @tailwindcss/oxide
 * so `require("./tailwindcss-oxide.*.node")` succeeds.
 */
const fs = require("fs");
const path = require("path");

const twDir = path.join(__dirname, "..", "node_modules", "@tailwindcss");
const oxideDir = path.join(twDir, "oxide");

if (!fs.existsSync(oxideDir)) {
  process.exit(0);
}

for (const name of fs.readdirSync(twDir)) {
  if (!name.startsWith("oxide-")) continue;

  const pkgDir = path.join(twDir, name);
  if (!fs.statSync(pkgDir).isDirectory()) continue;

  for (const file of fs.readdirSync(pkgDir)) {
    if (!file.endsWith(".node")) continue;

    fs.copyFileSync(path.join(pkgDir, file), path.join(oxideDir, file));
  }
}
