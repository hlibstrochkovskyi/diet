import chalk from 'chalk';

// ─── Color Palette ───────────────────────────────────────────────
export const colors = {
  // Brand
  brand: '#FF3D00',
  brandAlt: '#FF9100',
  brandDim: '#B22A00',

  // Status
  good: '#00E676',
  goodDim: '#1B5E20',
  bad: '#FF5252',
  badDim: '#B71C1C',
  alcohol: '#FFB300',
  alcoholDim: '#FF6F00',

  // Elements
  water: '#40C4FF',
  calories: '#FF6E40',
  streak: '#FF9100',

  // Neutrals
  white: '#FAFAFA',
  textPrimary: '#E0E0E0',
  textSecondary: '#9E9E9E',
  textDim: '#616161',
  border: '#3A3A3A',
  borderHighlight: '#555555',
  panelBg: '#1E1E1E',
} as const;

// ─── Styled Text Helpers ─────────────────────────────────────────
export const s = {
  brand: (text: string) => chalk.hex(colors.brand).bold(text),
  brandAlt: (text: string) => chalk.hex(colors.brandAlt)(text),
  good: (text: string) => chalk.hex(colors.good)(text),
  goodBold: (text: string) => chalk.hex(colors.good).bold(text),
  bad: (text: string) => chalk.hex(colors.bad)(text),
  badBold: (text: string) => chalk.hex(colors.bad).bold(text),
  alcohol: (text: string) => chalk.hex(colors.alcohol)(text),
  water: (text: string) => chalk.hex(colors.water)(text),
  waterBold: (text: string) => chalk.hex(colors.water).bold(text),
  calories: (text: string) => chalk.hex(colors.calories)(text),
  caloriesBold: (text: string) => chalk.hex(colors.calories).bold(text),
  streak: (text: string) => chalk.hex(colors.streak).bold(text),
  primary: (text: string) => chalk.hex(colors.textPrimary)(text),
  secondary: (text: string) => chalk.hex(colors.textSecondary)(text),
  dim: (text: string) => chalk.hex(colors.textDim)(text),
  bold: (text: string) => chalk.hex(colors.white).bold(text),
  label: (text: string) => chalk.hex(colors.textSecondary)(text),
  value: (text: string) => chalk.hex(colors.textPrimary).bold(text),
  success: (text: string) => chalk.hex(colors.good)('✓ ') + chalk.hex(colors.good)(text),
  error: (text: string) => chalk.hex(colors.bad)('✗ ') + chalk.hex(colors.bad)(text),
  hint: (text: string) => chalk.hex(colors.textDim).italic(text),
} as const;

// ─── Box Drawing ────────────────────────────────────────────────
export const BOX = {
  tl: '╭', tr: '╮', bl: '╰', br: '╯',
  h: '─', v: '│',
  teeR: '├', teeL: '┤', teeD: '┬', teeU: '┴', cross: '┼',
  // Double
  dh: '═', dv: '║',
  dtl: '╔', dtr: '╗', dbl: '╚', dbr: '╝',
} as const;

// ─── Panel builder ──────────────────────────────────────────────
export function buildPanel(lines: string[], width: number, options?: {
  title?: string;
  titleColor?: string;
  borderColor?: string;
  separatorAfter?: number[]; // line indices after which to add a separator
}): string {
  const borderColor = options?.borderColor || colors.border;
  const bc = (text: string) => chalk.hex(borderColor)(text);
  const sepPositions = new Set(options?.separatorAfter || []);

  const innerWidth = width - 2;
  const hLine = BOX.h.repeat(innerWidth);
  const result: string[] = [];

  // Top border with optional title
  if (options?.title) {
    const titleColored = options.titleColor
      ? chalk.hex(options.titleColor).bold(` ${options.title} `)
      : chalk.bold(` ${options.title} `);
    const titleLen = options.title.length + 2; // for spaces
    const leftPad = 2;
    const rightPad = innerWidth - leftPad - titleLen;
    result.push(
      bc(BOX.tl) +
      bc(BOX.h.repeat(leftPad)) +
      titleColored +
      bc(BOX.h.repeat(Math.max(0, rightPad))) +
      bc(BOX.tr)
    );
  } else {
    result.push(bc(BOX.tl) + bc(hLine) + bc(BOX.tr));
  }

  // Content lines
  lines.forEach((line, idx) => {
    const stripped = stripAnsi(line);
    const padding = Math.max(0, innerWidth - stripped.length);
    result.push(bc(BOX.v) + line + ' '.repeat(padding) + bc(BOX.v));

    if (sepPositions.has(idx)) {
      result.push(bc(BOX.teeR) + bc(hLine) + bc(BOX.teeL));
    }
  });

  // Bottom border
  result.push(bc(BOX.bl) + bc(hLine) + bc(BOX.br));
  return result.join('\n');
}

// ─── Gradient Text Generator ────────────────────────────────────
export function gradientText(text: string, startHex: string, endHex: string): string {
  const start = hexToRgb(startHex);
  const end = hexToRgb(endHex);
  if (!start || !end) return chalk.hex(startHex)(text);

  return text
    .split('')
    .map((char, i) => {
      const ratio = text.length > 1 ? i / (text.length - 1) : 0;
      const r = Math.round(start.r + (end.r - start.r) * ratio);
      const g = Math.round(start.g + (end.g - start.g) * ratio);
      const b = Math.round(start.b + (end.b - start.b) * ratio);
      return chalk.rgb(r, g, b)(char);
    })
    .join('');
}

// ─── Progress Bar ───────────────────────────────────────────────
export function progressBar(value: number, max: number, width: number = 20, filledColor: string = colors.good): string {
  const ratio = max > 0 ? Math.min(value / max, 1) : 0;
  const filled = Math.round(ratio * width);
  const empty = width - filled;
  return chalk.hex(filledColor)('█'.repeat(filled)) + chalk.hex(colors.border)('░'.repeat(empty));
}

// ─── Utilities ──────────────────────────────────────────────────
export function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1]!, 16),
      g: parseInt(result[2]!, 16),
      b: parseInt(result[3]!, 16),
    }
    : null;
}
