type ImportMetaGlobOptions = {
  eager?: boolean;
  import?: string;
};

declare global {
  interface ImportMeta {
    glob: (pattern: string, options?: ImportMetaGlobOptions) => Record<string, unknown>;
  }
}

const imageModules = import.meta.glob(
  "./**/*.{png,jpg,jpeg,svg,webp,gif,avif,ico}",
  { eager: true, import: "default" },
) as Record<string, string>;

export type ImagesMap = Record<string, string>;

export const images: ImagesMap = Object.fromEntries(
  Object.entries(imageModules).map(([path, url]) => [
    path.replace(/^\.\//, "").replace(/\.[^/.]+$/, ""),
    url,
  ]),
);

export const imagePaths = Object.keys(images);

export function getImage(key: string) {
  return images[key];
}