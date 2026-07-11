# Project Overview
This project is a migration of an existing static personal portfolio site from pure HTML/CSS to Astro. 

- **Production URL:** https://hidekia.github.io
- **Repository:** https://github.com/HidekiA/HidekiA.github.io
- **Constraint:** This is a public repository hosted on GitHub Pages.
- **Never include API keys, personal secrets, or sensitive data in this codebase.**

# Tech Stack
- **Framework:** Astro
- **Content:** Markdown / MDX (used for academic papers, publications, and project lists)
- **Deployment:** GitHub Pages

# Migration Goals & Rules
1. **Preserve the Minimalist Design:** Maintain the clean, lightweight, and fast-loading nature of the original `index.html`. Do not over-engineer the UI or add unnecessary CSS frameworks unless requested.
2. **Componentization:** Break down the existing `index.html` into logical Astro components (e.g., `<Header />`, `<Footer />`, `<ProjectList />`) to improve maintainability.
3. **Content Management:** Set up Astro's `Content Collections` (or a similar Markdown-based structure) so that adding future research papers or software achievements is as simple as adding a new `.md` file.

# Commands
- Dev server: `npm run dev`
- Build for production: `npm run build`

# Documentation
- Plans, status reports, and investigation notes by Claude Code live in `docs/` as `YYYY-MM-DD-<topic>.md`.
- Current migration status and remaining work: `docs/2026-07-12-migration-status.md`

# Instructions for Claude
- Before adding any new npm packages or major dependencies, briefly explain why they are needed and ask for confirmation.
- When splitting files into components, ensure the logic and styling remain isolated and easy to read.
- Keep the directory structure as flat and simple as possible. Do not create overly nested folders.
- Do not 'git push'
