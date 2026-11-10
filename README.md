# gitsite

**Bilingual portfolio website built with React, TypeScript, and Vite.** The site has an English/Russian language switch, responsive project sections, and animations that respect the system's reduced-motion preference.

[View the GitHub Pages demo](https://wannasly.github.io/gitsite/)

## Run locally

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
```

## Build and preview

```sh
npm run build
npm run preview
```

The build runs TypeScript checks before Vite writes the static site to `dist/`. Vite uses `/gitsite/` as the base path for GitHub Pages. The [deployment workflow](.github/workflows/deploy.yml) installs locked dependencies, builds, and deploys from `main`.

- [`src/App.tsx`](src/App.tsx) manages the active language and reduced-motion configuration.
- [`src/Site.tsx`](src/Site.tsx) contains the live layout.
- [`src/content.ts`](src/content.ts) holds copy for both languages.
