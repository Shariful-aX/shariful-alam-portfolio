# Shariful Alam — Engineering Portfolio

The engineering portfolio of Md Shariful Alam, featuring projects in biomechanics, finite element analysis, mechanical design, dynamics, robotics, and materials selection.

**Website:** [sharifulalam.dev](https://sharifulalam.dev/)

The site brings together project summaries, simulation results, CAD models, fabrication photographs, research and teaching experience, and a downloadable résumé. Responsive layouts and accessible navigation support desktop and mobile browsing.

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

The build renders the page content as static HTML, bundles React locally, and generates the CSS ahead of time. The main sections, project summaries, contact links, and résumé remain available without JavaScript; React adds galleries, dialogs, and motion controls when it loads. Responsive WebP covers reduce initial image downloads while gallery images retain their original detail. Google Fonts are optional; the site uses system font fallbacks if they are unavailable.

Validation checks the generated page, JavaScript syntax, and local asset references. Tests cover section navigation, keyboard and touch interruption, nested scrolling, dialog behavior, and reduced-motion controls.

## Deployment

The site is hosted on GitHub Pages with the custom domain `sharifulalam.dev`. Updates pushed to `main` trigger the deployment workflow, which installs dependencies, builds the site, runs validation and tests, and publishes the generated `dist` directory.

The site is static and does not require a database or application server.
