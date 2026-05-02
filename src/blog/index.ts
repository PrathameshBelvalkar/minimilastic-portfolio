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

export async function getBlogPostComponent(slug: string): Promise<ComponentType | null> {
  const key = `./posts/${slug}.mdx`;
  const mod = modules[key];
  return mod ? mod.default : null;
}
