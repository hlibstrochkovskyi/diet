import {
    format,
    parse,
    startOfMonth,
    endOfMonth,
    getDay,
    getDaysInMonth,
    isToday,
    isBefore,
    isAfter,
    subDays,
    addDays,
} from 'date-fns';

/**
 * Format a Date to "YYYY-MM-DD"
 */
export function formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
}

/**
 * Get today's date string
 */
export function today(): string {
    return formatDate(new Date());
}

/**
 * Check if a date string is today
 */
export function isDateToday(dateStr: string): boolean {
    const date = parse(dateStr, 'yyyy-MM-dd', new Date());
    return isToday(date);
}

/**
 * Get a 2D grid of dates for a month, arranged by weekday (Mon=0 .. Sun=6)
 * Returns array of weeks, each week is array of 7 (day number or null)
 */
export function getMonthGrid(year: number, month: number): (number | null)[][] {
    const totalDays = getDaysInMonth(new Date(year, month - 1));
    const firstDay = new Date(year, month - 1, 1);

    // getDay: 0=Sunday, 1=Monday, etc. We want Monday=0
    let startOffset = getDay(firstDay) - 1;
    if (startOffset < 0) startOffset = 6; // Sunday becomes 6

    const weeks: (number | null)[][] = [];
    let currentWeek: (number | null)[] = [];

    // Fill leading nulls
    for (let i = 0; i < startOffset; i++) {
        currentWeek.push(null);
    }

    // Fill days
    for (let day = 1; day <= totalDays; day++) {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }

    // Fill trailing nulls
    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
            currentWeek.push(null);
        }
        weeks.push(currentWeek);
    }

    return weeks;
}

/**
 * Parse a month argument. Accepts:
 *  - "march", "March" etc (month name)
 *  - "2026-03" (year-month)
 *  - "3" (month number, assumes current year)
 *  - undefined (current month)
 */
export function parseMonthArg(arg?: string): { year: number; month: number } {
    const now = new Date();

    if (!arg) {
        return { year: now.getFullYear(), month: now.getMonth() + 1 };
    }

    // Try "YYYY-MM" format
    const isoMatch = arg.match(/^(\d{4})-(\d{1,2})$/);
    if (isoMatch) {
        return { year: parseInt(isoMatch[1]!, 10), month: parseInt(isoMatch[2]!, 10) };
    }

    // Try plain number (1-12)
    const numMatch = arg.match(/^(\d{1,2})$/);
    if (numMatch) {
        const m = parseInt(numMatch[1]!, 10);
        if (m >= 1 && m <= 12) {
            return { year: now.getFullYear(), month: m };
        }
    }

    // Try month name
    const monthNames: Record<string, number> = {
        january: 1, february: 2, march: 3, april: 4,
        may: 5, june: 6, july: 7, august: 8,
        september: 9, october: 10, november: 11, december: 12,
        jan: 1, feb: 2, mar: 3, apr: 4,
        jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
    };

    const monthNum = monthNames[arg.toLowerCase()];
    if (monthNum) {
        return { year: now.getFullYear(), month: monthNum };
    }

    // Default to current month
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

/**
 * Parse a date argument. Accepts:
 *  - "today" or undefined -> today
 *  - "yesterday" -> yesterday
 *  - "2026-03-05" -> specific date
 *  - "5" or "05" -> day number in current month
 */
export function parseDateArg(arg?: string): string {
    const now = new Date();

    if (!arg || arg.toLowerCase() === 'today') {
        return formatDate(now);
    }

    if (arg.toLowerCase() === 'yesterday') {
        return formatDate(subDays(now, 1));
    }

    // "YYYY-MM-DD"
    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(arg)) {
        return arg;
    }

    // Just a day number
    const dayNum = parseInt(arg, 10);
    if (!isNaN(dayNum) && dayNum >= 1 && dayNum <= 31) {
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        return `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    }

    return formatDate(now);
}

/**
 * Get month name from month number
 */
export function getMonthName(month: number): string {
    const names = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return names[month - 1] || 'Unknown';
}

/**
 * Format a date string to a human-readable form
 */
export function formatDateHuman(dateStr: string): string {
    const date = parse(dateStr, 'yyyy-MM-dd', new Date());
    return format(date, 'EEEE, MMMM d, yyyy');
}

/**
 * Calculate streak of consecutive 'good' days ending today
 */
export function calculateStreak(entries: Record<string, { status: string }>): number {
    let streak = 0;
    let date = new Date();

    while (true) {
        const dateStr = formatDate(date);
        const entry = entries[dateStr];

        if (entry && entry.status === 'good') {
            streak++;
            date = subDays(date, 1);
        } else {
            break;
        }
    }

    return streak;
}
