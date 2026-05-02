import mermaid from 'mermaid';
import { useCallback, useEffect, useRef, useState } from 'react';

let counter = 0;

export function MermaidDiagram({ code }: { code: string }) {
  const id = useRef(`mermaid-${++counter}`).current;
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const render = useCallback(() => {
    if (!ref.current) return;
    setError(null);

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
        fontSize: '11px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      },
      flowchart: {
        curve: 'basis',
        padding: 10,
        nodeSpacing: 30,
        rankSpacing: 40,
        htmlLabels: true,
      },
    });

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

  if (error) {
    return (
      <pre className="overflow-x-auto rounded-xl border border-theme px-5 py-4 mb-8 text-[0.82rem] leading-[1.75] font-mono opacity-60">
        {code}
      </pre>
    );
  }

  return (
    <div
      ref={ref}
      className="my-8 flex justify-center overflow-x-auto rounded-xl border border-theme p-4 min-h-[80px]"
      style={{ background: 'var(--color-card-bg)' }}
    />
  );
}
