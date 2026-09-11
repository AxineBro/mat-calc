export type CsvParseError = 'empty' | 'too-large' | 'bad-format';

export type CsvParseResult =
  | { ok: true; matrix: string[][] }
  | { ok: false; error: CsvParseError };

const DEFAULT_MAX = 10;

/**
 * Разбирает CSV/TSV-подобный текст в матрицу строк.
 *
 * - Автоматически определяет разделитель по первой значимой строке:
 *   табуляция > точка с запятой > запятая.
 * - Учитывает BOM (UTF-8 от Excel).
 * - Обрезает хвостовые пустые ячейки, которые любит добавлять Excel.
 * - Проверяет, что размер не превышает maxSize.
 * - НЕ валидирует содержимое ячеек — это делает parseMatrix в пайплайне.
 */
export function parseDelimited(text: string, maxSize: number = DEFAULT_MAX): CsvParseResult {
  const clean = text
    .replace(/^\uFEFF/, '')
    .replace(/\r\n?/g, '\n');

  const lines = clean.split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 0) return { ok: false, error: 'empty' };

  const delimiter = detectDelimiter(lines[0]);

  const raw: string[][] = lines.map(line =>
    (delimiter ? line.split(delimiter) : [line]).map(c => c.trim()),
  );

  // Хвостовые пустые ячейки, которые иногда оставляет Excel,
  // не должны раздувать ширину матрицы.
  const width = Math.max(1, ...raw.map(effectiveWidth));

  if (raw.length > maxSize || width > maxSize) {
    return { ok: false, error: 'too-large' };
  }

  const matrix = raw.map(row => {
    const r = row.slice(0, width);
    while (r.length < width) r.push('');
    return r;
  });

  return { ok: true, matrix };
}

function detectDelimiter(sample: string): string {
  const candidates: Array<[string, number]> = [
    ['\t', countChar(sample, '\t')],
    [';', countChar(sample, ';')],
    [',', countChar(sample, ',')],
  ];
  candidates.sort((a, b) => b[1] - a[1]);
  return candidates[0][1] > 0 ? candidates[0][0] : '';
}

function countChar(s: string, ch: string): number {
  let n = 0;
  for (let i = 0; i < s.length; i++) if (s[i] === ch) n++;
  return n;
}

function effectiveWidth(row: string[]): number {
  let w = row.length;
  while (w > 0 && row[w - 1] === '') w--;
  return w;
}