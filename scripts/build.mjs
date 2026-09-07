import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import sharp from "sharp";
import tailwindConfig from "../tailwind.config.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(resolve(root, "src"), dist, { recursive: true });
await cp(resolve(root, "public"), dist, { recursive: true });

const version = (content) => createHash("sha256").update(content).digest("hex").slice(0, 10);
// Generate lightweight covers while preserving original images for the galleries.
let source = await readFile(resolve(root, "src/app.js"), "utf8");
const coverPaths = [...source.matchAll(/\n    image: "([^"]+)"/g)].map((match) => match[1]);
await mkdir(resolve(dist, "images/covers"), { recursive: true });
let originalBytes = 0;
let coverBytes = 0;
for (const [index, asset] of coverPaths.entries()) {
  const input = await readFile(resolve(root, "public", asset));
  originalBytes += input.length;
  const paths = [];
  for (const width of [600, 1200]) {
    const { data: buffer, info } = await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 85 }).toBuffer({ resolveWithObject: true });
    const output = `images/covers/${index + 1}-${width}-${version(buffer)}.webp`;
    await writeFile(resolve(dist, output), buffer);
    paths.push({ src: output, width: info.width });
    if (width === 1200) coverBytes += buffer.length;
  }
  const candidates = [...new Map(paths.map((path) => [path.width, path])).values()];
  source = source.replace(`image: "${asset}",`, `image: "${paths[1].src}", imageSet: "${candidates.map((path) => `${path.src} ${path.width}w`).join(", ")}",`);
}
const compiled = await build({
  stdin: { contents: source, loader: "jsx", resolveDir: resolve(root, "src"), sourcefile: "app.js" },
  bundle: true, minify: true, write: false, platform: "browser", format: "iife",
  target: ["es2020", "safari15.4"], define: { "process.env.NODE_ENV": '"production"' }
});
await writeFile(resolve(dist, "app.js"), compiled.outputFiles[0].contents);
const customCss = await readFile(resolve(root, "src/styles.css"), "utf8");
const generatedCss = await postcss([tailwindcss({
  ...tailwindConfig,
  content: [{ raw: source, extension: "jsx" }, { raw: await readFile(resolve(root, "src/index.html"), "utf8"), extension: "html" }]
})]).process("@tailwind base;\n@tailwind components;\n@tailwind utilities;", { from: undefined });
await writeFile(resolve(dist, "styles.css"), `${generatedCss.css}\n${customCss}`);
const css = await readFile(resolve(dist, "styles.css"));
const app = await readFile(resolve(dist, "app.js"));
const favicon = await readFile(resolve(dist, "favicon.svg"));
const indexPath = resolve(dist, "index.html");
let html = await readFile(indexPath, "utf8");

html = html
  .replace(/href="favicon\.svg(?:\?v=[^"]+)?"/, `href="favicon.svg?v=${version(favicon)}"`)
  .replace(/href="styles\.css(?:\?v=[^"]+)?"/, `href="styles.css?v=${version(css)}"`)
  .replace(/src="app\.js(?:\?v=[^"]+)?"/, `src="app.js?v=${version(app)}"`);

await writeFile(indexPath, html);
console.log(`Built publishable site at ${dist}`);
console.log(`Cover image payload: ${(originalBytes / 1e6).toFixed(2)} MB → ${(coverBytes / 1e6).toFixed(2)} MB at maximum card resolution.`);
