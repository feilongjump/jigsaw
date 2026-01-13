import { useEffect, useRef } from 'react';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { getStaticUrl } from '@/utils/url';

interface VditorPreviewProps {
  markdown: string;
  className?: string;
}

export function VditorPreview({ markdown, className }: VditorPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewRef.current) {
      // Process markdown to ensure image URLs are correct
      const processedMarkdown = markdown.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
          return `![${alt}](${getStaticUrl(url)})`;
      });

      import('vditor').then((Vditor) => {
        Vditor.default.preview(previewRef.current!, processedMarkdown, {
          mode: 'light',
          hljs: {
              style: 'github',
          },
          theme: {
              current: 'light',
              path: 'https://cdn.jsdelivr.net/npm/vditor/dist/css/content-theme',
          }
        });
      });
    }
  }, [markdown]);

  return <div ref={previewRef} className={`vditor-reset ${className || ''}`} />;
}
