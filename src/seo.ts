import type { BlogPost } from './blog';
import type { Project } from './components/ProjectModal';
import { portfolioData } from './data';

const DYNAMIC_JSONLD_ID = 'seo-jsonld-dynamic';

type MetaKind = 'name' | 'property';

function getSiteUrl() {
  const configured = import.meta.env.VITE_SITE_URL as string | undefined;
  const trimmed = configured?.trim();
  if (trimmed) return trimmed.replace(/\/+$/, '');
  if (typeof window !== 'undefined') {
    return window.location.origin.replace(/\/+$/, '');
  }
  return 'https://prathameshbelvalkar.in';
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


function buildPersonGraph(siteUrl: string) {
  const name = portfolioData.person.name;
  const description = portfolioData.siteDescription;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name,
        description,
        publisher: { '@id': `${siteUrl}/#person` },
        inLanguage: 'en',
      },
      {
        '@type': 'ProfilePage',
        '@id': `${siteUrl}/#profilepage`,
        url: `${siteUrl}/`,
        name: `${name} | Solution Architect`,
        isPartOf: { '@id': `${siteUrl}/#website` },
        mainEntity: { '@id': `${siteUrl}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name,
        url: `${siteUrl}/`,
        image: `${siteUrl}/meta_image.png`,
        jobTitle: 'Solution Architect',
        description,
        email: `mailto:${portfolioData.aboutProfile.email}`,
        worksFor: {
          '@type': 'Organization',
          name: 'Airrived AI',
        },
        alumniOf: [
          { '@type': 'CollegeOrUniversity', name: "KIT's IMER, Kolhapur" },
          { '@type': 'CollegeOrUniversity', name: 'The New College, Kolhapur' },
        ],
        knowsLanguage: ['en', 'hi', 'mr', 'ja'],
        sameAs: [
          portfolioData.aboutProfile.linkedinHref,
          'https://github.com/prathameshbelvalkar',
        ],
      },
    ],
  };
}

function buildBreadcrumbList(siteUrl: string, items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export function applyDefaultSeo() {
  removeArticleMeta();
  removeDynamicJsonLd();
  const siteUrl = getSiteUrl();
  const title = `${portfolioData.person.name} | Solution Architect`;
  const description = portfolioData.siteDescription;
  const ogImage = `${siteUrl}/meta_image.png`;

  document.title = title;
  upsertMeta('name', 'description', description);
  upsertMeta('name', 'keywords', 'solution architect, backend engineer, React, Node.js, NestJS, Python, FastAPI, portfolio');

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

  upsertDynamicJsonLd(buildPersonGraph(siteUrl));
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
    '@graph': [
      {
        '@type': 'Blog',
        name: title,
        description: blogListingDescription,
        url: pageUrl,
        author: {
          '@type': 'Person',
          name: portfolioData.person.name,
          url: `${siteUrl}/`,
        },
      },
      buildBreadcrumbList(siteUrl, [
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
      ]),
    ],
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
    '@graph': [
      {
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
      },
      buildBreadcrumbList(siteUrl, [
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: post.title, path: path },
      ]),
    ],
  });
}
