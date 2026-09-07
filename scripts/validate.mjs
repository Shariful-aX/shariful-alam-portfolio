import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Script } from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(resolve(root, "dist", "index.html"), "utf8");
const app = await readFile(resolve(root, "src", "app.js"), "utf8");
const builtApp = await readFile(resolve(root, "dist", "app.js"), "utf8");
new Script(builtApp);
if (/text\/babel|cdn.tailwindcss.com|unpkg.com/.test(html)) throw new Error("Runtime compilation must not be present in the publish build.");
const css = await readFile(resolve(root, "dist", "styles.css"), "utf8");
const required = ["About", "Projects", "Stack", "Experience", "Contact", "Shariful Alam"];
const missing = required.filter((value) => !app.includes(value) && !html.includes(value));
if (missing.length) {
  console.error(`Missing required content: ${missing.join(", ")}`);
  process.exit(1);
}
if ((app.match(/<h1/g) || []).length !== 1) {
  console.error("The page must contain exactly one h1 element.");
  process.exit(1);
}
const content = [html, app, builtApp, css].join("\n");
const assets = new Set([...content.matchAll(/["']((?:images|profile|resume)\/[^"']+)["']/g)].map((match) => match[1]));
for (const asset of assets) {
  if (asset.includes("/bone-screw-gallery/") && /\.(png|gif)$/.test(asset)) assets.add(asset.replace(/\.(png|gif)$/, "-thumb.webp"));
  if (asset.includes("/bone-screw-gallery/") && asset.endsWith(".gif")) assets.add(asset.replace(/\.gif$/, "-poster.webp"));
}
for (const asset of [...assets, "favicon.svg", "og-shariful-alam.png"]) {
  if (/\s\d+w(?:,|$)/.test(asset)) continue; // srcset is checked by its individual generated paths.
  await readFile(resolve(root, "dist", asset));
}
for (const match of builtApp.matchAll(/images\/covers\/[\w.-]+\.webp/g)) await readFile(resolve(root, "dist", match[0]));
for (const id of ["top", "about", "projects", "stack", "experience", "contact", "main-content"]) {
  if (!app.includes(`id="${id}"`)) throw new Error(`Missing navigation destination: ${id}`);
}
console.log(`Validation passed: required sections, single h1, navigation destinations, and ${assets.size + 2} local assets.`);
