import fs from 'node:fs';
import path from 'node:path';

const PERSON_NAME = 'Prathamesh Belvalkar';
const BLOG_LISTING_DESCRIPTION =
  'Articles on full stack development, backend systems, TypeScript, Node.js, and engineering practices.';
const BLOG_LISTING_KEYWORDS =
  'developer blog, full stack, backend, TypeScript, React, Node.js, engineering';

type BlogPostFrontmatter = {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
};

type SeoConfig = {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogType: 'website' | 'article';
  ogImage: string;
  siteName: string;
  articlePublishedTime?: string;
  articleTags?: string[];
  jsonLd: Record<string, unknown>;
};

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function frontmatterField(raw: string, field: string): string | undefined {
  const match = raw.match(new RegExp(`^${field}:\\s*"([^"]*)"`, 'm'));
  return match?.[1];
}

function parseTags(raw: string): string[] {
  const block = raw.match(/^tags:\s*\[([\s\S]*?)\]/m)?.[1] ?? '';
  return [...block.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

function parseMdxPost(filePath: string): BlogPostFrontmatter | null {
  const raw = fs.readFileSync(filePath, 'utf8');
  const title = frontmatterField(raw, 'title');
  const date = frontmatterField(raw, 'date');
  const category = frontmatterField(raw, 'category');
  const excerpt = frontmatterField(raw, 'excerpt');
  if (!title || !date || !category || !excerpt) return null;

  const slug = path.basename(filePath, '.mdx');
  return {
    slug,
    title,
    date,
    category,
    tags: parseTags(raw),
    excerpt,
  };
}

function upsertMeta(
  html: string,
  kind: 'name' | 'property',
  key: string,
  content: string
): string {
  const pattern = new RegExp(
    `<meta\\s+${kind}="${key}"\\s+content="[^"]*"\\s*/?>`,
    'i'
  );
  const tag = `<meta ${kind}="${key}" content="${escapeAttr(content)}" />`;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function upsertLink(html: string, rel: string, href: string): string {
  const pattern = new RegExp(`<link\\s+rel="${rel}"\\s+href="[^"]*"\\s*/?>`, 'i');
  const tag = `<link rel="${rel}" href="${escapeAttr(href)}" />`;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function replaceJsonLd(html: string, data: Record<string, unknown>): string {
  const json = JSON.stringify(data, null, 2);
  const pattern =
    /<script type="application\/ld\+json">\s*[\s\S]*?\s*<\/script>/i;
  const tag = `<script type="application/ld+json">\n      ${json}\n    </script>`;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function applySeoToHtml(html: string, seo: SeoConfig): string {
  let next = html.replace(
    /<title>[^<]*<\/title>/i,
    `<title>${escapeAttr(seo.title)}</title>`
  );

  next = upsertMeta(next, 'name', 'description', seo.description);
  next = upsertMeta(next, 'name', 'keywords', seo.keywords);
  next = upsertLink(next, 'canonical', seo.canonical);

  next = upsertMeta(next, 'property', 'og:type', seo.ogType);
  next = upsertMeta(next, 'property', 'og:site_name', seo.siteName);
  next = upsertMeta(next, 'property', 'og:title', seo.title);
  next = upsertMeta(next, 'property', 'og:description', seo.description);
  next = upsertMeta(next, 'property', 'og:url', seo.canonical);
  next = upsertMeta(next, 'property', 'og:image', seo.ogImage);

  next = upsertMeta(next, 'name', 'twitter:card', 'summary_large_image');
  next = upsertMeta(next, 'name', 'twitter:title', seo.title);
  next = upsertMeta(next, 'name', 'twitter:description', seo.description);
  next = upsertMeta(next, 'name', 'twitter:image', seo.ogImage);

  if (seo.ogType === 'article' && seo.articlePublishedTime) {
    next = upsertMeta(
      next,
      'property',
      'article:published_time',
      seo.articlePublishedTime
    );
    const articleTags = (seo.articleTags ?? [])
      .map(
        (tag) =>
          `    <meta property="article:tag" content="${escapeAttr(tag)}" />`
      )
      .join('\n');
    if (articleTags) {
      next = next.replace(
        /<meta property="og:image:type"[^>]*\/>/i,
        (match) => `${match}\n${articleTags}`
      );
    }
  }

  return replaceJsonLd(next, seo.jsonLd);
}


function homepageSeo(siteUrl: string): SeoConfig {
  const title = `${PERSON_NAME} | Solution Architect`;
  const description =
    'Solution Architect specializing in scalable backend systems and high-performance web apps with React, Node.js, NestJS, and Python. Explore portfolio and blog.';
  const ogImage = `${siteUrl}/meta_image.png`;
  return {
    title,
    description,
    keywords:
      'Prathamesh Belvalkar, solution architect, backend engineer, React, Node.js, NestJS, Python, FastAPI, portfolio',
    canonical: `${siteUrl}/`,
    ogType: 'website',
    ogImage,
    siteName: PERSON_NAME,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${siteUrl}/#website`,
          url: `${siteUrl}/`,
          name: PERSON_NAME,
          description,
          publisher: { '@id': `${siteUrl}/#person` },
          inLanguage: 'en',
        },
        {
          '@type': 'ProfilePage',
          '@id': `${siteUrl}/#profilepage`,
          url: `${siteUrl}/`,
          name: title,
          isPartOf: { '@id': `${siteUrl}/#website` },
          mainEntity: { '@id': `${siteUrl}/#person` },
        },
        {
          '@type': 'Person',
          '@id': `${siteUrl}/#person`,
          name: PERSON_NAME,
          url: `${siteUrl}/`,
          image: ogImage,
          jobTitle: 'Solution Architect',
          description,
          email: 'mailto:prathameshbelvalkars@gmail.com',
          worksFor: { '@type': 'Organization', name: 'Airrived AI' },
          alumniOf: [
            { '@type': 'CollegeOrUniversity', name: "KIT's IMER, Kolhapur" },
            { '@type': 'CollegeOrUniversity', name: 'The New College, Kolhapur' },
          ],
          knowsLanguage: ['en', 'hi', 'mr', 'ja'],
          sameAs: [
            'https://www.linkedin.com/in/prathamesh-belvalkar-83b72a267/',
            'https://github.com/prathameshbelvalkar',
          ],
        },
      ],
    },
  };
}

function blogListingSeo(siteUrl: string): SeoConfig {
  const pageUrl = `${siteUrl}/blog`;
  const title = `Blog | ${PERSON_NAME}`;
  const ogImage = `${siteUrl}/meta_image.png`;

  return {
    title,
    description: BLOG_LISTING_DESCRIPTION,
    keywords: BLOG_LISTING_KEYWORDS,
    canonical: pageUrl,
    ogType: 'website',
    ogImage,
    siteName: PERSON_NAME,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Blog',
          name: title,
          description: BLOG_LISTING_DESCRIPTION,
          url: pageUrl,
          author: {
            '@type': 'Person',
            name: PERSON_NAME,
            url: `${siteUrl}/`,
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${siteUrl}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Blog',
              item: pageUrl,
            },
          ],
        },
      ],
    },
  };
}

function blogPostSeo(siteUrl: string, post: BlogPostFrontmatter): SeoConfig {
  const pageUrl = `${siteUrl}/blog/${post.slug}`;
  const title = `${post.title} | ${PERSON_NAME}`;
  const ogImage = `${siteUrl}/meta_image.png`;
  const published = new Date(post.date).toISOString();

  return {
    title,
    description: post.excerpt,
    keywords: [...post.tags, post.category, 'blog'].join(', '),
    canonical: pageUrl,
    ogType: 'article',
    ogImage,
    siteName: PERSON_NAME,
    articlePublishedTime: published,
    articleTags: post.tags,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          datePublished: published,
          author: {
            '@type': 'Person',
            name: PERSON_NAME,
            url: `${siteUrl}/`,
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': pageUrl,
          },
          keywords: post.tags.join(', '),
          articleSection: post.category,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${siteUrl}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Blog',
              item: `${siteUrl}/blog`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: post.title,
              item: pageUrl,
            },
          ],
        },
      ],
    },
  };
}

function writeSeoHtml(outPath: string, html: string) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
}

export function generateSeoHtml(distDir: string, siteUrl: string, postsDir: string) {
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) return;

  const baseHtml = fs.readFileSync(indexPath, 'utf8');
  const homeHtml = applySeoToHtml(baseHtml, homepageSeo(siteUrl));
  fs.writeFileSync(indexPath, homeHtml);
  const listingHtml = applySeoToHtml(homeHtml, blogListingSeo(siteUrl));
  writeSeoHtml(path.join(distDir, 'blog', 'index.html'), listingHtml);

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdx'));
  for (const file of files) {
    const post = parseMdxPost(path.join(postsDir, file));
    if (!post) continue;
    const postHtml = applySeoToHtml(homeHtml, blogPostSeo(siteUrl, post));
    writeSeoHtml(path.join(distDir, 'blog', post.slug, 'index.html'), postHtml);
  }
}

export function seoHtmlPlugin(siteUrl: string, rootDir: string) {
  const postsDir = path.join(rootDir, 'src/blog/posts');
  const distDir = path.join(rootDir, 'dist');

  return {
    name: 'generate-seo-html',
    closeBundle() {
      generateSeoHtml(distDir, siteUrl, postsDir);
    },
  };
}
