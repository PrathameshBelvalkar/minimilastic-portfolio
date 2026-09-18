# SEO Action Plan

**Target:** https://prathameshbelvalkar.in/  
**Date:** 2026-09-18  
**Priority order:** blockers → quick wins → strategic

## 1. Immediate blockers

| # | Type | Action | Effort | Impact |
|---|------|--------|--------|--------|
| 1 | Strategic | Prerender or SSR the homepage so H1, intro, nav, project, and blog links exist in the first HTML (empty `#root` today). | High | High |
| 2 | Quick win | Stop serving SPA HTML at `/llms.txt` and `/llms-full.txt`. Add real `text/plain` files under `public/`. | Low | High |

## 2. Quick wins

| # | Type | Action | Effort | Impact |
|---|------|--------|--------|--------|
| 3 | Quick win | Redeploy so live title/description/schema match **Solution Architect** (repo already differs from live “Full Stack Developer”). | Low | Medium |
| 4 | Quick win | Lengthen meta description to 150–160 characters (role, stack, employer or CTA). | Low | Medium |
| 5 | Quick win | Expand Person JSON-LD: `description`, `email`, `worksFor`, `alumniOf`, `knowsLanguage`. Add `WebSite` + `ProfilePage` in one `@graph`. Do not add FAQPage or HowTo. | Low | High |
| 6 | Quick win | Add `lastmod` on sitemap `/` and `/blog`. | Low | Low |
| 7 | Quick win | Add Vercel headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`, HSTS `includeSubDomains`. | Low | Medium |

Suggested `llms.txt` outline:

```text
# Prathamesh Belvalkar

> Solution Architect. Portfolio and engineering writing at prathameshbelvalkar.in.

## Pages
- [Home](https://prathameshbelvalkar.in/): Profile, experience, projects, contact
- [Blog](https://prathameshbelvalkar.in/blog): Technical articles
```

Suggested JSON-LD `@graph` types: `WebSite`, `ProfilePage`, `Person` (JSON-LD only). Include `sameAs` LinkedIn and GitHub already in use.

## 3. Strategic improvements

| # | Type | Action | Effort | Impact |
|---|------|--------|--------|--------|
| 8 | Strategic | Prerender `/blog` and each post so titles, excerpts, and `BlogPosting` exist without waiting on client JS. | High | High |
| 9 | Strategic | Add unique `lastmod` and keep sitemap in sync with MDX posts. | Medium | Medium |
| 10 | Maintenance | Only add hreflang if Japanese is a real URL (`/ja/`), not an in-app toggle. | Medium | Low |
| 11 | Maintenance | Optional explicit `Allow` groups for GPTBot, ClaudeBot, PerplexityBot, Google-Extended. | Low | Low |
| 12 | Maintenance | Re-run PageSpeed (mobile) with an API key; use INP not FID. | Low | Medium |

## Do not do

- FAQPage schema (restricted; not for a commercial/personal portfolio).
- HowTo schema (deprecated; no rich results).
- Microdata/RDFa instead of JSON-LD.

## Execution order

1. Static `llms.txt` + metadata/title alignment + schema `@graph`  
2. Security headers + sitemap `lastmod`  
3. Prerender/SSR homepage, then blog routes  
4. Measure CWV after deploy
