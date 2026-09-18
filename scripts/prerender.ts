import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const ssrOutDir = path.join(rootDir, 'dist-ssr');

function injectAppHtml(html: string, appHtml: string): string {
  if (html.includes('<div id="root"></div>')) {
    return html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  }
  if (html.includes('<div id="root">')) {
    return html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${appHtml}</div>`);
  }
  throw new Error('Could not find #root container in HTML');
}

async function main() {
  if (!fs.existsSync(path.join(distDir, 'index.html'))) {
    throw new Error('dist/index.html missing — run vite build first');
  }

  await build({
    configFile: path.join(rootDir, 'vite.config.ts'),
    build: {
      ssr: path.join(rootDir, 'src/entry-server.tsx'),
      outDir: ssrOutDir,
      emptyOutDir: true,
      sourcemap: false,
    },
  });

  const entryCandidates = [
    path.join(ssrOutDir, 'entry-server.js'),
    path.join(ssrOutDir, 'entry-server.mjs'),
    path.join(ssrOutDir, 'assets', 'entry-server.js'),
  ];
  const entryPath = entryCandidates.find((p) => fs.existsSync(p));
  if (!entryPath) {
    const files = fs.readdirSync(ssrOutDir, { recursive: true });
    throw new Error(`SSR entry not found. dist-ssr contents: ${JSON.stringify(files)}`);
  }

  const mod = await import(pathToFileURL(entryPath).href);
  const render = mod.render as (url: string) => string;
  if (typeof render !== 'function') {
    throw new Error('SSR module does not export render()');
  }

  const postsDir = path.join(rootDir, 'src/blog/posts');
  const slugs = fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));

  const routes = ['/', '/blog', ...slugs.map((slug) => `/blog/${slug}`)];

  for (const route of routes) {
    const outFile =
      route === '/'
        ? path.join(distDir, 'index.html')
        : path.join(distDir, route.slice(1), 'index.html');

    if (!fs.existsSync(outFile)) {
      throw new Error(`Missing HTML for route ${route} at ${outFile}`);
    }

    let appHtml: string;
    try {
      appHtml = render(route);
    } catch (err) {
      console.error(`Prerender failed for ${route}`);
      throw err;
    }

    if (!appHtml || appHtml.length < 50) {
      throw new Error(`Empty prerender output for ${route}`);
    }

    const html = fs.readFileSync(outFile, 'utf8');
    fs.writeFileSync(outFile, injectAppHtml(html, appHtml));
    console.log(`prerendered ${route} (${appHtml.length} chars)`);
  }

  fs.rmSync(ssrOutDir, { recursive: true, force: true });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
