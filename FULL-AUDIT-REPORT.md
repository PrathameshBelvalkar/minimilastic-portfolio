# SEO Full Audit Report

**Scope:** Single-page full audit of `https://prathameshbelvalkar.in/` (homepage).  
**Date:** 2026-09-18  
**Score confidence:** Medium (HTML, robots, sitemap, social, schema, and security measured; Core Web Vitals not measured).  
**Overall:** **40/100 — Poor**

This is a Vite/React SPA hosted on Vercel. Crawlers that do not run JavaScript see metadata and Person JSON-LD only. Client-side source has a real H1 and body copy, but that is not in the first HTML response.

## A) Audit Summary

| Item | Value |
|------|--------|
| Live title | `Prathamesh Belvalkar \| Full Stack Developer` (43 chars) |
| Meta description | 99 characters (below 150–160) |
| Canonical | Self-referencing `https://prathameshbelvalkar.in/` |
| Robots | `index,follow,max-image-preview:large` |
| HTTP | HTTPS 200, 0 hops; HTTP → HTTPS 308 |
| Schema | Person JSON-LD only |
| Body word count (static HTML) | 5 |
| H1 / links in static HTML | 0 / 0 |
| Sitemap | 11 URLs; `/` and `/blog` missing `lastmod` |
| `/llms.txt` | SPA HTML fallback, not a text file |
| PageSpeed / CWV | Environment limitation (Google API rate limit) |

**Top 3 issues**
1. Empty `#root` HTML: no headings, copy, or internal links without JavaScript.
2. `/llms.txt` and `/llms-full.txt` rewrite to the homepage HTML (SPA catch-all).
3. Thin Person schema; no WebSite / ProfilePage JSON-LD.

**Top 3 opportunities**
1. Prerender or SSR the homepage so Google and AI crawlers get full copy.
2. Ship a real `llms.txt` and complete Person + WebSite JSON-LD.
3. Align live title/job title with “Solution Architect” (already in repo, not on live HTML).

### Page Score Card

```
Overall Score: 40/100

On-Page SEO:     46/100  █████░░░░░
Content Quality: 35/100  ███░░░░░░░
Technical:       37/100  ████░░░░░░
Schema:          40/100  ████░░░░░░
Images:          60/100  ██████░░░░
Performance:     Insufficient data
GEO / AI:        20/100  ██░░░░░░░░
```

Score derivation (rubric): positives vs deficits, then −15 per Critical and −5 per Warning. Performance omitted from the weighted overall because PageSpeed returned a rate-limit error, not a site metric.

## B) Findings Table

| Area | Severity | Confidence | Finding | Evidence | Fix |
|------|----------|------------|---------|----------|-----|
| Technical | Critical | Confirmed | Static HTML has no body content, H1, or links | `parse_html.py`: `h1=[]`, `word_count=5`, empty links; body is `#root` + JS | Prerender/SSR homepage HTML |
| GEO | Warning | Confirmed | `/llms.txt` is homepage HTML | `curl -sL` returns `<!doctype html>` | Add static `public/llms.txt`; exclude from SPA rewrite |
| Schema | Warning | Confirmed | Only Person; no WebSite/ProfilePage | `parse_html.py` schema count 1 | Add JSON-LD types listed in Action Plan |
| Schema | Warning | Confirmed | Person missing description, email, worksFor | Live JSON-LD keys: name, jobTitle, url, image, sameAs | Extend Person properties from site facts |
| On-page | Warning | Confirmed | Meta description 99 chars | Measured description string | Expand to 150–160 chars |
| On-page | Warning | Confirmed | Live title still “Full Stack Developer”; repo uses “Solution Architect” | Live parse vs local `index.html` / `applyDefaultSeo` | Redeploy aligned title |
| Technical | Warning | Confirmed | Missing CSP, XFO, nosniff, Permissions-Policy; HSTS without includeSubDomains | `security_headers.py` 45/100 | Set headers in `vercel.json` |
| Technical | Info | Confirmed | `/` and `/blog` sitemap URLs lack lastmod | `sitemap_checker.py` | Add lastmod |
| GEO | Info | Confirmed | AI crawlers inherit `User-agent: *` Allow | `robots_checker.py` | Optional explicit Allow groups |
| On-page | Info | Likely | EN/JP UI without hreflang or locale URLs | `hreflang: []`; JP in `portfolioData.languages` | Add locale URLs only if JP is a real indexable version |
| Performance | Info | Hypothesis | CWV unknown | PageSpeed API rate limited | Re-run with API key |

Verifier: `finding_verifier.py` failed on this environment (script expected a different JSON shape). Findings above were de-duplicated manually; sitemap_index XML errors were dropped because those paths are SPA HTML, not real sitemaps.

### Detailed findings

[Area] Technical SEO  
Severity: Critical  
Confidence: Confirmed  
Finding: Homepage HTML has no crawlable body content.  
Evidence: `parse_html.py` word_count 5, zero headings and links.  
Impact: Many crawlers and AI bots never see portfolio copy.  
Fix: Prerender or SSR so H1, intro, nav, and project/blog links exist in the first response.

[Area] AI Search Readiness  
Severity: Warning  
Confidence: Confirmed  
Finding: `/llms.txt` is not a policy file.  
Evidence: Response is the SPA document with title `Prathamesh Belvalkar | Full Stack Developer`.  
Impact: GEO/AEO tools cannot use the file.  
Fix: Publish real `llms.txt` / `llms-full.txt` as `text/plain`.

[Area] Schema  
Severity: Warning  
Confidence: Confirmed  
Finding: Incomplete structured data for a personal site.  
Evidence: Single Person node; no `@graph` WebSite or ProfilePage.  
Impact: Weaker entity and sitelink context.  
Fix: JSON-LD in Action Plan (no FAQPage or HowTo).

[Area] On-Page SEO  
Severity: Warning  
Confidence: Confirmed  
Finding: Description short; live job title lags repo.  
Evidence: 99-character description; live title vs local Solution Architect title.  
Impact: Weaker snippets and mixed keyword targeting.  
Fix: One job title everywhere; longer unique description.

[Area] Technical SEO  
Severity: Warning  
Confidence: Confirmed  
Finding: Security header set is thin.  
Evidence: HSTS only among the checked headers. HTML has `<meta name="referrer">` but that is not the HTTP header.  
Impact: Weaker clickjacking/MIME protections.  
Fix: Add standard Vercel security headers.

[Area] Images  
Severity: Pass  
Confidence: Confirmed  
Finding: OG image is sized and small enough.  
Evidence: `og:image` 1200×630, local `meta_image.png` ~59KB.  
Impact: Social previews should work.  
Fix: None required; WebP/AVIF optional for in-page images after prerender.

[Area] Social  
Severity: Pass  
Confidence: Confirmed  
Finding: Open Graph and Twitter Card core tags are present.  
Evidence: `social_meta.py` score 77/100; missing optional `og:locale`, `twitter:site`.  
Impact: Link previews are usable.  
Fix: Optional locale and Twitter handle.

## Environment Limitations

- First script run failed in sandbox proxy (403); retried once with full network and succeeded.
- PageSpeed Insights rate limited twice; no LCP/INP/CLS numbers. INP is the interactivity metric; FID is not used.
- Playwright not installed: JS render audit could not compare rendered DOM.
- `generate_report.py` failed on Python 3.9 (`dict | None` syntax). No `SEO-REPORT.html`.
- `broken_links.py` crashed (`KeyError: 'total'`) because the page has no HTML links.

## Unknowns and Follow-ups

- Field Core Web Vitals (CrUX) after adding a PageSpeed API key.
- Whether Googlebot’s rendered DOM already has the H1 (likely yes after JS; unconfirmed).
- Whether www vs apex is used in Search Console (HTTP apex 308s to HTTPS apex).
- Blog post pages were not audited in this pass.
