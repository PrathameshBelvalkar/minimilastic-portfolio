import type { Project } from './components/ProjectModal';
import { portfolioData } from './data';

type MetaKind = 'name' | 'property';

function getSiteUrl() {
  const configured = import.meta.env.VITE_SITE_URL as string | undefined;
  const trimmed = configured?.trim();
  if (trimmed) return trimmed.replace(/\/+$/, '');
  return window.location.origin.replace(/\/+$/, '');
}

function upsertMeta(kind: MetaKind, key: string, content: string) {
  const selector = `meta[${kind}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(kind, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  const selector = `link[rel="${rel}"]`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function applyDefaultSeo() {
  const siteUrl = getSiteUrl();
  const title = `${portfolioData.person.name} | Full Stack Developer`;
  const description = portfolioData.hero.intro;
  const ogImage = `${siteUrl}/meta_image.png`;

  document.title = title;
  upsertMeta('name', 'description', description);
  upsertMeta('name', 'keywords', 'full stack developer, backend engineer, React, Node.js, NestJS, Python, FastAPI, portfolio');

  upsertLink('canonical', `${siteUrl}/`);

  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:site_name', portfolioData.person.name);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', `${siteUrl}/`);
  upsertMeta('property', 'og:image', ogImage);

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', ogImage);
}

export function applyProjectSeo(project: Project | null) {
  if (!project) {
    applyDefaultSeo();
    return;
  }

  const siteUrl = getSiteUrl();
  const title = `${project.title} | ${portfolioData.person.name}`;
  const description = project.longDesc || project.desc;
  const ogImage = `${siteUrl}/meta_image.png`;

  document.title = title;
  upsertMeta('name', 'description', description);

  upsertLink('canonical', `${siteUrl}/`);

  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', `${siteUrl}/`);
  upsertMeta('property', 'og:image', ogImage);

  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', ogImage);
}

