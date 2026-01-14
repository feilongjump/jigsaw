import { useEffect, useRef } from 'react';
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
      // 处理 Markdown 以确保图片 URL 正确
      const processedMarkdown = markdown.replace(/!\[(.*?)\]\((.*?)\)/g, (_match, alt, url) => {
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
