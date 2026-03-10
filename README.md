<div align="center">

# ✦ dpastor.eu

**Personal portfolio & consulting site**

[![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-deployed-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)
[![License](https://img.shields.io/badge/license-MIT-7c5cfc?style=flat-square)](LICENSE)

[🌐 dpastor.eu](https://dpastor.eu) · [📬 hola@dpastor.eu](mailto:hola@dpastor.eu) · [💼 LinkedIn](https://linkedin.com/in/danpassol) · [🐙 GitHub](https://github.com/danpassol)

</div>

---

## About

Personal portfolio and consulting landing page of **Daniel Pastor** — sysadmin, DevOps, infrastructure and IT security professional based in Spain.

Built with a dark space aesthetic, bilingual content (ES/EN), and a focus on performance and SEO.

## Stack

| Layer | Technology |
|---|---|
| Framework | Astro 5 (Static + SSR endpoints) |
| Styling | Tailwind CSS 4 + Custom Design System |
| Interactivity | React Islands |
| Content | Markdown via Obsidian + Vault CMS |
| Search | Pagefind (static, client-side) |
| Code blocks | Expressive Code |
| Email | Resend API |
| Deployment | Cloudflare Pages |

## Features

- **Bilingual (ES/EN)** — Full i18n with `Accept-Language` redirect, hreflang SEO tags and cross-language fallback with language badge
- **Dark space theme** — Animated star field canvas, glassmorphism, electric blue + violet accents, Playfair Display headings
- **Blog + Projects** — Markdown content written in Obsidian via Vault CMS workflow
- **Obsidian callouts** — `[!note]`, `[!caution]`, `[!tip]` etc. rendered via `rehype-callouts`
- **Image zoom** — Click-to-zoom on blog images via `medium-zoom`
- **Contact form** — Validated form with Resend API, sends to `hola@dpastor.eu`
- **Static search** — `Cmd+K` interface powered by Pagefind, indexes blog and projects
- **SEO** — JSON-LD (BlogPosting, Organization, BreadcrumbList), Open Graph, Twitter Cards, hreflang alternates, sitemap, robots.txt
- **RSS feed** — Auto-generated at `/rss.xml` covering both languages
- **Dark/Light mode** — Default dark, toggle with localStorage persistence

## Project Structure

```
src/
├── components/
│   ├── common/       # CookieConsent, ThemeToggle, LanguagePicker...
│   ├── islands/      # React islands: ContactForm, Search, MobileMenu...
│   ├── layout/       # Header, Footer, SEO, Schema...
│   └── sections/     # Hero, TechStack, CTA, LatestPosts...
├── content/
│   ├── blog/
│   │   ├── es/       # Posts in Spanish
│   │   └── en/       # Posts in English
│   └── projects/
│       ├── es/
│       └── en/
├── i18n/
│   ├── locales/      # es.properties, en.properties
│   └── utils.ts
├── layouts/
│   ├── Layout.astro
│   └── BlogPost.astro
├── pages/
│   ├── [lang]/       # blog, projects, about, contact, 404
│   ├── api/          # contact.ts (Resend endpoint)
│   ├── index.astro   # Accept-Language redirect
│   └── rss.xml.js
└── styles/
    ├── global.css
    └── theme.css
```

## Content Workflow

Posts are written in **Obsidian** using **Vault CMS**. The frontmatter schema:

```yaml
---
title: "Post title"
description: "Brief description"
pubDate: 2026-03-10
heroImage: /blog/image.webp
tags: [devops, linux]
---
```

Images go in `/public/blog/` (WebP recommended). Posts in one language automatically appear in the other with a language badge.

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build (includes Pagefind indexing)
npm run build && cd dist/client && pagefind --site .

# Preview
node dist/server/entry.mjs
```

<div align="center">
<sub>Built with ♥ by <a href="https://dpastor.eu">Dani Pastor</a></sub>
</div>