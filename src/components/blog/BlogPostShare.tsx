import { Check, Copy, Linkedin } from 'lucide-react';
import { useMemo, useState } from 'react';

type Props = {
  title: string;
  slug: string;
};

function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const shareButtonClass =
  'flex h-9 w-9 items-center justify-center rounded-lg border border-theme text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)] hover:border-[color-mix(in_oklab,var(--color-accent)_35%,transparent)]';

export function BlogPostShare({ title, slug }: Props) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    const configured = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim();
    const origin = (
      configured ||
      (typeof window !== 'undefined' ? window.location.origin : 'https://prathameshbelvalkar.in')
    ).replace(/\/+$/, '');
    return `${origin}/blog/${slug}`;
  }, [slug]);

  const twitterHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;
  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  const handleCopy = () => {
    void navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <nav className="flex flex-col gap-3 lg:gap-2" aria-label="Share this post">
      <span className="section-label lg:mb-4" style={{ fontSize: '11px' }}>
        Share
      </span>
      <div className="flex flex-row lg:flex-col gap-2">
        <a
          href={twitterHref}
          target="_blank"
          rel="noopener noreferrer"
          className={shareButtonClass}
          aria-label="Share on X"
        >
          <XIcon size={14} />
        </a>
        <a
          href={linkedInHref}
          target="_blank"
          rel="noopener noreferrer"
          className={shareButtonClass}
          aria-label="Share on LinkedIn"
        >
          <Linkedin size={14} strokeWidth={2} aria-hidden />
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className={shareButtonClass}
          aria-label={copied ? 'Link copied' : 'Copy link'}
        >
          {copied ? <Check size={14} strokeWidth={2} aria-hidden /> : <Copy size={14} strokeWidth={2} aria-hidden />}
        </button>
      </div>
    </nav>
  );
}
