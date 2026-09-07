# Shariful Alam — Engineering Portfolio

Responsive single-page portfolio with nine project detail windows, image galleries, experience and education, technical skills, and contact links.

## Preview locally

The preview runs at `http://127.0.0.1:4280/`. With Node.js and pnpm available, run these from this folder:

```powershell
pnpm install --frozen-lockfile
pnpm build
pnpm dev
```

The preview serves the built `dist` folder. Run `pnpm build` after source changes, then refresh the browser. Stop the preview with Ctrl+C.

## Editing and verification

- `src/app.js`: portfolio content and interactions.
- `src/styles.css`: custom styling and responsive layouts.
- `src/index.html`: page title and metadata.
- `public`: project media, résumé, and other static assets.

```powershell
pnpm build
pnpm validate
pnpm test
```

The build bundles React locally and generates the CSS ahead of time. Responsive WebP covers reduce initial image downloads while gallery images retain their original detail. Google Fonts are optional; the site uses system font fallbacks if they are unavailable.

Validation checks the generated page, JavaScript syntax, and local asset references. Tests cover section navigation, keyboard and touch interruption, nested scrolling, dialog behavior, and reduced-motion controls.

## Publication

Publish only when requested. The latest `dist` folder contains the complete static website; no database or server-side application is required. Historical ZIP exports are not automatically refreshed.

Once the final public domain is chosen, set the Open Graph and Twitter image metadata to that domain's absolute image URL and rebuild before publishing.

Original project materials and the separate Pre-Astra Backup are not modified by this website's build.
