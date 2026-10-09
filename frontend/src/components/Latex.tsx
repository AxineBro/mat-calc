import { useMemo } from 'react';
import katex from 'katex';

type Props = {
  tex: string;
  displayMode?: boolean;
  className?: string;
};

export function Latex({ tex, displayMode = false, className }: Props) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode,
        throwOnError: false,
        strict: false,
        output: 'html',
        trust: false,
      });
    } catch {
      return tex;
    }
  }, [tex, displayMode]);

  return (
    <span
      className={`latex ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}