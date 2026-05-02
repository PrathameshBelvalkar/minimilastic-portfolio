import type { BlogPost } from './blog';
import type { Project } from './components/ProjectModal';
import { portfolioData } from './data';

const DYNAMIC_JSONLD_ID = 'seo-jsonld-dynamic';

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

function removeArticleMeta() {
  document.head.querySelectorAll('meta[property^="article:"]').forEach((el) => el.remove());
}

function removeDynamicJsonLd() {
  document.getElementById(DYNAMIC_JSONLD_ID)?.remove();
}

function upsertDynamicJsonLd(data: Record<string, unknown>) {
  removeDynamicJsonLd();
  const script = document.createElement('script');
  script.id = DYNAMIC_JSONLD_ID;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

function setArticleTags(tags: string[]) {
  document.head.querySelectorAll('meta[property="article:tag"]').forEach((el) => el.remove());
  for (const tag of tags) {
    const el = document.createElement('meta');
    el.setAttribute('property', 'article:tag');
    el.setAttribute('content', tag);
    document.head.appendChild(el);
  }
}

export function applyDefaultSeo() {
  removeArticleMeta();
  removeDynamicJsonLd();
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

  removeArticleMeta();
  removeDynamicJsonLd();
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

const blogListingDescription =
  'Articles on full stack development, backend systems, TypeScript, Node.js, and engineering practices.';

export function applyBlogListingSeo() {
  removeArticleMeta();
  const siteUrl = getSiteUrl();
  const path = '/blog';
  const pageUrl = `${siteUrl}${path}`;
  const title = `Blog | ${portfolioData.person.name}`;
  const ogImage = `${siteUrl}/meta_image.png`;

  document.title = title;
  upsertMeta('name', 'description', blogListingDescription);
  upsertMeta(
    'name',
    'keywords',
    'developer blog, full stack, backend, TypeScript, React, Node.js, engineering'
  );

  upsertLink('canonical', pageUrl);

  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:site_name', portfolioData.person.name);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', blogListingDescription);
  upsertMeta('property', 'og:url', pageUrl);
  upsertMeta('property', 'og:image', ogImage);

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', blogListingDescription);
  upsertMeta('name', 'twitter:image', ogImage);

  upsertDynamicJsonLd({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: title,
    description: blogListingDescription,
    url: pageUrl,
    author: {
      '@type': 'Person',
      name: portfolioData.person.name,
      url: `${siteUrl}/`,
    },
  });
}

export function applyBlogPostSeo(post: BlogPost) {
  removeArticleMeta();
  const siteUrl = getSiteUrl();
  const path = `/blog/${post.slug}`;
  const pageUrl = `${siteUrl}${path}`;
  const title = `${post.title} | ${portfolioData.person.name}`;
  const description = post.excerpt;
  const ogImage = `${siteUrl}/meta_image.png`;
  const published = new Date(post.date).toISOString();

  document.title = title;
  upsertMeta('name', 'description', description);
  upsertMeta('name', 'keywords', [...post.tags, post.category, 'blog'].join(', '));

  upsertLink('canonical', pageUrl);

  upsertMeta('property', 'og:type', 'article');
  upsertMeta('property', 'og:site_name', portfolioData.person.name);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', pageUrl);
  upsertMeta('property', 'og:image', ogImage);
  upsertMeta('property', 'article:published_time', published);

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', ogImage);

  setArticleTags(post.tags);

  upsertDynamicJsonLd({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: published,
    author: {
      '@type': 'Person',
      name: portfolioData.person.name,
      url: `${siteUrl}/`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    keywords: post.tags.join(', '),
    articleSection: post.category,
  });
}
