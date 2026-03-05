import React from 'react';
import { Box, Text } from 'ink';
import chalk from 'chalk';
import { colors, gradientText } from '../theme.js';
import { getMonthGrid, getMonthName, calculateStreak } from '../utils/dates.js';
import { getMonthEntries } from '../store.js';
import { STATUS_EMOJI } from '../types.js';
import type { DayEntry, DayStatus } from '../types.js';

interface CalendarProps {
    year: number;
    month: number;
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function statusEmoji(entry?: DayEntry): string {
    if (!entry || !STATUS_EMOJI[entry.status]) return ' ';
    return STATUS_EMOJI[entry.status]!;
}

function statusColor(status?: DayStatus): string {
    if (!status) return colors.textDim;
    const map: Record<DayStatus, string> = { good: colors.good, bad: colors.bad, alcohol: colors.alcohol };
    return map[status];
}

export default function Calendar({ year, month }: CalendarProps): React.ReactElement {
    const grid = getMonthGrid(year, month);
    const entries = getMonthEntries(year, month);
    const monthName = getMonthName(month);

    // Stats
    const vals = Object.values(entries);
    const good = vals.filter(e => e.status === 'good').length;
    const bad = vals.filter(e => e.status === 'bad').length;
    const alc = vals.filter(e => e.status === 'alcohol').length;
    const total = vals.length;
    const daysInMonth = new Date(year, month, 0).getDate();
    const unlogged = daysInMonth - total;
    const rate = total > 0 ? Math.round((good / total) * 100) : 0;
    const streak = calculateStreak(entries);
    const rateColor = rate >= 70 ? colors.good : rate >= 40 ? colors.alcohol : colors.bad;

    return (
        <Box flexDirection="column" width={64} alignItems="center">
            {/* Outer Box for the calendar grid */}
            <Box flexDirection="column" width={56} borderStyle="round" borderColor={colors.borderHighlight}>

                {/* Header row with Title */}
                <Box justifyContent="center" paddingBottom={1}>
                    <Text>{gradientText(`${monthName} ${year}`, '#FF3D00', '#FFEA00')}</Text>
                </Box>

                {/* Day Headers */}
                <Box flexDirection="row" paddingTop={0} paddingBottom={1} borderBottomColor={colors.border}>
                    {DAY_NAMES.map((name, i) => {
                        const color = i >= 5 ? colors.alcohol : colors.textPrimary;
                        return (
                            <Box key={name} flexBasis={0} flexGrow={1} justifyContent="center" alignItems="center">
                                <Text color={color} bold>{name}</Text>
                            </Box>
                        );
                    })}
                </Box>

                {/* Grid */}
                <Box flexDirection="column" paddingBottom={1} paddingTop={1}>
                    {grid.map((week, wIdx) => (
                        <Box key={wIdx} flexDirection="row" marginY={1}>
                            {week.map((day, dIdx) => {
                                if (day === null) {
                                    return <Box key={`null-${dIdx}`} flexBasis={0} flexGrow={1} />;
                                }
                                const ds = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const entry = entries[ds];
                                const color = statusColor(entry?.status);
                                const emoji = statusEmoji(entry);

                                return (
                                    <Box key={day} flexBasis={0} flexGrow={1} flexDirection="column" alignItems="center">
                                        <Box height={1}>
                                            <Text>{emoji}</Text>
                                        </Box>
                                        <Box>
                                            <Text color={color}>{String(day).padStart(2, '0')}</Text>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Stats Summary below Calendar */}
            <Box flexDirection="column" width={56} marginTop={1} paddingX={1}>
                {/* We use flex layout to perfectly align the horizontal items across the bottom */}
                <Box flexDirection="row" justifyContent="space-between" marginBottom={1}>
                    <Text color={colors.good}>✅ {good} good</Text>
                    <Text color={colors.textDim}>│</Text>
                    <Text color={colors.bad}>❌ {bad} bad</Text>
                    <Text color={colors.textDim}>│</Text>
                    <Text color={colors.alcohol}>🍺 {alc} alcohol</Text>
                    <Text color={colors.textDim}>│</Text>
                    <Text color={colors.textSecondary}>{unlogged} unlogged</Text>
                </Box>

                <Box flexDirection="row" justifyContent="space-around">
                    <Text color={colors.streak}>🔥 Streak: {streak} days</Text>
                    <Text color={rateColor}>Success: {rate}%</Text>
                </Box>
            </Box>
        </Box>
    );
}
