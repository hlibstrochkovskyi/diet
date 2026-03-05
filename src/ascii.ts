import chalk from 'chalk';
import { gradientText } from './theme.js';

// ─── Solid Block (Pixel) Mascot ASCII Art ───────────────────────
// Derpy Apple Mascot - High fidelity pixel art using solid blocks.
// ' ' = transparent
// 'W' = White (eyes, teeth)
// 'K' = Black (outlines, pupils)
// 'R' = Red (base body)
// 'D' = Dark Red (shadows, edges)
// 'L' = Light Red / Pinkish (highlights)
// 'P' = Pink blush (cheeks)
// 'b' = Brown (stem)
// 'd' = Dark Brown (stem shadow)
// 'g' = Light Green (leaf)
// 'h' = Dark Green (leaf shadow)
// 'V' = Grey (teeth shadow)

const pixelMascot = [
    "                 bbb                 ",
    "                 bbb   hhhh          ",
    "                 bdd  hggggg         ",
    "        KKKKKK   bdd  hggggg  KKK    ",
    "      KKDDDDDDKK bdd       KDDDDKK   ",
    "     KDDRRRRRRRRKKKKKKKRRRRRRRRRDKK  ",
    "    KDRRLLLLLRRRRRRRRRRRRRRRRRRRRRDK ",
    "   KDRLLLLLLLLRRKKKKKKKRRRKKKKKKKRRDK",
    "   KDRLLLLLLRRRKWWWWWWWK KWWWWWWWKRRDK",
    "  KDRLLLLLRRRRRKWWWWWWWK KWWKWWWWKRRRDK",
    "  KDRLLLRRRRRRRKWWWKKWWK KKKKKKKWKRRRDK",
    "  KDRRRRRRRRRRRKWWWKKWWK KWWKWWWWKRRRDK",
    "  KDPPPRRRRRRRR KKKKKKK   KKKKKKK RRPDK",
    "  KDPPPRRRRRRRRRRRRRRRRRRRRRRRRRRPPPRDK",
    "  KDPPPRRR K RRRRRRRRRRRRRR  K  RPPPPDK",
    "  KDRRRRRR KKK  WWWWWWWWWW KKKK RRRRPDK",
    "   KDRRRRRRR KKKKKKKKKKKKKK RRRRRRRRDK ",
    "   KDRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRDK ",
    "    KDRRRRRRRRRRRRRRRRRRRRRRRRRRRRRDK  ",
    "    KDRRRRRRRRRRRRRRRRRRRRRRRRRRRRRDK  ",
    "     KKDDRRRRRRRRRRRRRRRRRRRRRRRRDDKK  ",
    "       KKDDRRRRRRRRRRRRRRRRRRRRDDKK    ",
    "         KKKKKKK         KKKKKKK       "
];

// @ts-ignore - chalk v5 compatibility
const bgHex = chalk.bgHex;
// @ts-ignore - chalk v5 compatibility  
const hex = chalk.hex;

const colorMap: Record<string, (text: string) => string> = {
    ' ': (text) => text, // transparent
    'W': (text) => bgHex('#FFFFFF')(hex('#FFFFFF')(text)), // white
    'K': (text) => bgHex('#111111')(hex('#111111')(text)), // black
    'R': (text) => bgHex('#D32F2F')(hex('#D32F2F')(text)), // red
    'D': (text) => bgHex('#B71C1C')(hex('#B71C1C')(text)), // dark red
    'L': (text) => bgHex('#EF5350')(hex('#EF5350')(text)), // light red / highlight
    'P': (text) => bgHex('#E57373')(hex('#E57373')(text)), // pink blush
    'b': (text) => bgHex('#795548')(hex('#795548')(text)), // stem brown
    'd': (text) => bgHex('#4E342E')(hex('#4E342E')(text)), // stem shadow
    'g': (text) => bgHex('#4CAF50')(hex('#4CAF50')(text)), // leaf light green
    'h': (text) => bgHex('#2E7D32')(hex('#2E7D32')(text)), // leaf dark green
};

export function getMascot(): string {
    // Use two space characters per pixel for square aspect ratio in terminal
    return pixelMascot.map(row => {
        return row.split('').map(char => {
            const colorFn = colorMap[char];
            if (colorFn && char !== ' ') {
                return colorFn('  ');
            }
            return '  ';
        }).join('');
    }).join('\n');
}

// ─── GET LEAN B*TCH Title Block ─────────────────────────────────
const titleLines = [
    ' ██████╗ ███████╗████████╗    ██╗     ███████╗ █████╗ ███╗   ██╗',
    '██╔════╝ ██╔════╝╚══██╔══╝    ██║     ██╔════╝██╔══██╗████╗  ██║',
    '██║  ███╗█████╗     ██║       ██║     █████╗  ███████║██╔██╗ ██║',
    '██║   ██║██╔══╝     ██║       ██║     ██╔══╝  ██╔══██║██║╚██╗██║',
    '╚██████╔╝███████╗   ██║       ███████╗███████╗██║  ██║██║ ╚████║',
    ' ╚═════╝ ╚══════╝   ╚═╝       ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝',
    '',
    '           ██████╗ ██╗████████╗ ██████╗██╗  ██╗',
    '           ██╔══██╗██║╚══██╔══╝██╔════╝██║  ██║',
    '           ██████╔╝██║   ██║   ██║     ███████║',
    '           ██╔══██╗██║   ██║   ██║     ██╔══██║',
    '           ██████╔╝██║   ██║   ╚██████╗██║  ██║',
    '           ╚═════╝ ╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝',
];

export function getTitleArt(): string {
    return titleLines
        .map((line) => gradientText(line, '#FF3D00', '#FFEA00'))
        .join('\n');
}

// ─── Compact Title (for header bars) ────────────────────────────
export function getCompactTitle(): string {
    return gradientText('GET LEAN B*TCH', '#FF3D00', '#FFEA00');
}

// ─── Inline branding ────────────────────────────────────────────
export function getInlineBrand(): string {
    return gradientText('GET LEAN B*TCH', '#FF3D00', '#FFEA00');
}

// ─── Decorations ────────────────────────────────────────────────
export function sparkle(): string {
    return chalk.hex('#FF9100')('✦') + ' ' + chalk.hex('#FF3D00')('✧') + ' ' + chalk.hex('#FFEA00')('✦');
}
