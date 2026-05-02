import mermaid from 'mermaid';
import { Maximize2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

let counter = 0;

function applyMermaidTheme(expanded: boolean) {
  const root = document.documentElement;
  const s = (v: string) => getComputedStyle(root).getPropertyValue(v).trim();
  const bg = s('--color-bg');
  const cardBg = s('--color-card-bg');
  const text = s('--color-text');
  const muted = s('--color-text-muted');
  const border = s('--color-border');
  const accent = s('--color-accent');

  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
      background: cardBg,
      primaryColor: bg,
      primaryTextColor: text,
      primaryBorderColor: muted,
      lineColor: muted,
      secondaryColor: cardBg,
      tertiaryColor: cardBg,
      edgeLabelBackground: cardBg,
      clusterBkg: cardBg,
      nodeBorder: border,
      mainBkg: cardBg,
      nodeTextColor: text,
      labelTextColor: text,
      titleColor: accent,
      fontSize: expanded ? '15px' : '11px',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    },
    flowchart: {
      curve: 'basis',
      padding: expanded ? 16 : 10,
      nodeSpacing: expanded ? 40 : 30,
      rankSpacing: expanded ? 50 : 40,
      htmlLabels: true,
    },
  });
}

export function MermaidDiagram({ code }: { code: string }) {
  const id = useRef(`mermaid-${++counter}`).current;
  const ref = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const expandedRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const render = useCallback(() => {
    if (!ref.current) return;
    setError(null);
    applyMermaidTheme(false);

    const uniqueId = `${id}-${Date.now()}`;
    mermaid
      .render(uniqueId, code.trim())
      .then(({ svg }) => {
        if (!ref.current) return;
        ref.current.innerHTML = svg;
        const svgEl = ref.current.querySelector('svg');
        if (svgEl) {
          svgEl.style.maxWidth = '100%';
          svgEl.style.height = 'auto';
          svgEl.removeAttribute('width');
          svgEl.style.overflow = 'visible';
        }
      })
      .catch(() => setError('true'));
  }, [code, id]);

  useEffect(() => {
    render();

    const observer = new MutationObserver(render);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, [render]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (!dialogOpen || !expandedRef.current) return;
    const host = expandedRef.current;
    host.innerHTML = '';
    applyMermaidTheme(true);
    const uniqueId = `${id}-expanded-${Date.now()}`;
    mermaid
      .render(uniqueId, code.trim())
      .then(({ svg }) => {
        if (!expandedRef.current) return;
        expandedRef.current.innerHTML = svg;
        const svgEl = expandedRef.current.querySelector('svg');
        if (svgEl) {
          svgEl.style.maxWidth = '100%';
          svgEl.style.height = 'auto';
          svgEl.removeAttribute('width');
          svgEl.style.overflow = 'visible';
        }
      })
      .catch(() => {
        if (expandedRef.current) expandedRef.current.textContent = 'Could not render diagram.';
      });

    return () => {
      host.innerHTML = '';
    };
  }, [dialogOpen, code, id]);

  const openDialog = () => {
    dialogRef.current?.showModal();
    setDialogOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  if (error) {
    return (
      <pre className="overflow-x-auto rounded-xl border border-theme px-5 py-4 mb-8 text-[0.82rem] leading-[1.75] font-mono opacity-60">
        {code}
      </pre>
    );
  }

  return (
    <>
      <div className="relative my-8">
        <button
          type="button"
          onClick={openDialog}
          className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-theme bg-[var(--color-card-bg)] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)] hover:border-[color-mix(in_oklab,var(--color-accent)_35%,transparent)]"
          aria-label="Expand diagram"
        >
          <Maximize2 size={14} strokeWidth={2} aria-hidden />
        </button>
        <div
          ref={ref}
          className="flex justify-center overflow-x-auto rounded-xl border border-theme p-4 pt-12 min-h-[80px]"
          style={{ background: 'var(--color-card-bg)' }}
        />
      </div>

      <dialog
        ref={dialogRef}
        className="fixed left-1/2 top-1/2 z-[100] w-[min(96vw,1200px)] max-h-[min(92vh,900px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-theme bg-[var(--color-bg)] p-0 shadow-2xl backdrop:bg-black/55 backdrop:backdrop-blur-[2px] open:flex open:flex-col"
        onClick={(e) => {
          if (e.target === dialogRef.current) closeDialog();
        }}
        onClose={() => {
          setDialogOpen(false);
          document.body.style.overflow = '';
        }}
      >
        <div className="flex shrink-0 items-center justify-end gap-2 border-b border-theme px-3 py-2">
          <button
            type="button"
            onClick={closeDialog}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-card-bg)] hover:text-[var(--color-text)]"
            aria-label="Close"
          >
            <X size={18} strokeWidth={2} aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-4 md:p-8">
          <div ref={expandedRef} className="flex min-h-[120px] justify-center" />
        </div>
      </dialog>
    </>
  );
}
