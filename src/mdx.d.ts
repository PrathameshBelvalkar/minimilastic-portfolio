declare module '*.mdx' {
  import type { ComponentType } from 'react';

  export const frontmatter: {
    title: string;
    date: string;
    category: string;
    tags: string[];
    excerpt: string;
    readTime: string;
  };

  const MDXComponent: ComponentType;
  export default MDXComponent;
}
