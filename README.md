# chientrm.com – Personal Homepage & Web App

This is the source code for [chientrm.com](https://chientrm.com), the personal homepage and web app of Chien Tran. Distributed as a web application via npm.

## Features

- Modern, minimal design using [shadcn/ui](https://ui.shadcn.com/) React components
- Responsive and accessible
- Express API backend with Swagger docs
- Automated build and npm publishing via GitHub Actions

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Express (API)
- pnpm (package manager)

## Development

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Build for production:

```bash
pnpm build
```

## Publishing

This app is published to npm on every version tag push (e.g., `1.2.3`).

To release a new version:

1. Bump the version in `package.json` (or just tag with the new version).
2. Create a git tag matching the new version:
   ```bash
   git tag 1.2.3
   git push --tags
   ```
3. GitHub Actions will build and publish to npm automatically.

> **Note:** Lockfiles (pnpm-lock.yaml, etc.) are not published to npm.

---

© 2025 Chien Tran. All rights reserved.
