# Adventure India

A professional single-page web app for discovering and booking adventure sports in India.

## APIs used

- **Wikipedia REST API** (`/page/summary/{title}`) for destination highlights.
- **Open-Meteo Forecast API** (`/v1/forecast`) for live weather context.

## Run locally

```bash
python3 -m http.server 8000
```

Open: `http://localhost:8000`.

## Deploy on GitHub Pages

This repository is configured to deploy automatically via GitHub Actions when you push to `main`, `master`, or `work`.

1. Create a GitHub repository and add it as remote:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   ```
2. Push your branch (example for current branch):
   ```bash
   git push -u origin work
   ```
3. In GitHub, go to **Settings → Pages** and set source to **GitHub Actions**.
4. Open the **Actions** tab and confirm the workflow **Deploy static site to GitHub Pages** succeeds.
5. Your site will be available at:
   `https://<your-username>.github.io/<your-repo>/`

> If your default branch is different, either push one of the configured branches above or update `.github/workflows/deploy-pages.yml`.
