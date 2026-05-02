import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'path';
import rehypeHighlight from 'rehype-highlight';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const siteUrl = (env.VITE_SITE_URL || 'https://prathameshbelvalkar.in').replace(/\/+$/, '');
  return {
    plugins: [
      mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
        rehypePlugins: [rehypeHighlight],
      }),
      react(),
      tailwindcss(),
      {
        name: 'generate-sitemap',
        buildStart() {
          const postsDir = path.resolve(__dirname, 'src/blog/posts');
          const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdx'));
          const slugs = [...new Set(files.map((f) => f.replace(/\.mdx$/, '')))].sort();
          type UrlRow = {loc: string; lastmod?: string; priority: string; changefreq: string};
          const urls: UrlRow[] = [
            {loc: `${siteUrl}/`, priority: '1.0', changefreq: 'weekly'},
            {loc: `${siteUrl}/blog`, priority: '0.9', changefreq: 'weekly'},
          ];
          for (const slug of slugs) {
            const fp = path.join(postsDir, `${slug}.mdx`);
            let lastmod: string | undefined;
            try {
              const raw = fs.readFileSync(fp, 'utf8');
              const m = raw.match(/^date:\s*"([^"]+)"/m);
              if (m) lastmod = m[1];
            } catch {
              /* ignore */
            }
            urls.push({
              loc: `${siteUrl}/blog/${slug}`,
              lastmod,
              priority: '0.8',
              changefreq: 'monthly',
            });
          }
          const body = urls
            .map((u) => {
              const lm = u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : '';
              return `  <url>\n    <loc>${u.loc}</loc>${lm}\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`;
            })
            .join('\n');
          const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
          fs.writeFileSync(path.resolve(__dirname, 'public/sitemap.xml'), xml);
        },
      },
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
