import type { ComponentType } from 'react';

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  readTime: string;
};

type MDXModule = {
  frontmatter: Omit<BlogPost, 'slug'>;
  default: ComponentType;
};

const modules = import.meta.glob<MDXModule>('./posts/*.mdx', { eager: true });

export const blogPosts: BlogPost[] = Object.entries(modules)
  .map(([filePath, mod]) => ({
    slug: filePath.replace('./posts/', '').replace('.mdx', ''),
    ...mod.frontmatter,
  }))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const blogCategories = ['All', ...Array.from(new Set(blogPosts.map((p) => p.category)))];

function relatedScore(current: BlogPost, candidate: BlogPost): number {
  let score = 0;
  if (candidate.category === current.category) score += 10;
  for (const tag of candidate.tags) {
    if (current.tags.includes(tag)) score += 1;
  }
  return score;
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = blogPosts.find((p) => p.slug === slug);
  if (!current) return [];

  const others = blogPosts.filter((p) => p.slug !== slug);
  return [...others]
    .sort((a, b) => {
      const scoreDiff = relatedScore(current, b) - relatedScore(current, a);
      if (scoreDiff !== 0) return scoreDiff;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);
}

export async function getBlogPostComponent(slug: string): Promise<ComponentType | null> {
  const key = `./posts/${slug}.mdx`;
  const mod = modules[key];
  return mod ? mod.default : null;
}

export { getMdxLeadPreviewMarkdown } from './mdxLead';
