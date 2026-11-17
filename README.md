# Villa Vérone — Cap Ferrat

An editorial luxury architectural residence experience built with React, TypeScript, Tailwind CSS, GSAP, Motion, and Three.js.

## Local Development

```bash
npm install
npm run dev
```

## Verification & Production Build

```bash
npm run lint
npx tsx --test src/utils/cameraChoreography.test.ts src/utils/inquiryValidation.test.ts
npm run build
npm run preview
```

## Deploying to GitHub Pages

This repository includes an automated GitHub Actions workflow at `.github/workflows/deploy.yml` configured with a relative Vite `base` (`./`) and `public/.nojekyll` so all bundled JS, CSS, and architectural photography resolve cleanly at any `https://<username>.github.io/<repo>/` URL.

1. Initialize Git and push to the `main` branch of your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Villa Vérone"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
2. In your GitHub repository, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. The `Deploy to GitHub Pages` workflow runs automatically on every push to `main` (or manually via the **Actions** tab) and publishes `./dist`.
