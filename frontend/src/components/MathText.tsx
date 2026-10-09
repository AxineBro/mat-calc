import { Fragment, type ReactNode } from 'react';

type Props = { children: string };

function render(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let buf = '';
  let i = 0;
  const flush = () => {
    if (buf) {
      out.push(buf);
      buf = '';
    }
  };

  while (i < text.length) {
    if (text[i] === '_' && text[i + 1] === '{') {
      const end = text.indexOf('}', i + 2);
      if (end > 0) {
        flush();
        const inner = text.slice(i + 2, end);
        out.push(<sub key={out.length}>{render(inner)}</sub>);
        i = end + 1;
        continue;
      }
    }
    if (
      text[i] === '_' &&
      i + 1 < text.length &&
      /[A-Za-z0-9]/.test(text[i + 1])
    ) {
      flush();
      out.push(<sub key={out.length}>{text[i + 1]}</sub>);
      i += 2;
      continue;
    }
    buf += text[i];
    i++;
  }
  flush();
  return out;
}

export function MathText({ children }: Props) {
  return <Fragment>{render(children)}</Fragment>;
}