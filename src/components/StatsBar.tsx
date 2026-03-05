import React from 'react';
import { Box, Text } from 'ink';
import chalk from 'chalk';
import { colors, progressBar } from '../theme.js';
import { getAllEntries } from '../store.js';
import { calculateStreak } from '../utils/dates.js';

function Separator({ width = 48 }: { width?: number }) {
    return (
        <Box marginY={1}>
            <Text color={colors.borderHighlight}>{'─'.repeat(width)}</Text>
        </Box>
    );
}

export default function StatsBar(): React.ReactElement {
    const entries = getAllEntries();
    const allEntries = Object.values(entries);
    const width = 52;

    if (allEntries.length === 0) {
        return (
            <Box flexDirection="column" width={width} borderStyle="round" borderColor={colors.borderHighlight} paddingX={2} paddingY={1}>
                <Box marginBottom={1}>
                    <Text color={colors.brandAlt} bold>📊 Statistics</Text>
                </Box>
                <Text color={colors.textSecondary}>No entries yet. Start tracking!</Text>
                <Text>
                    <Text color={colors.textDim}>Run: </Text>
                    <Text color={colors.brand}>dietcli log</Text>
                </Text>
            </Box>
        );
    }

    const good = allEntries.filter(e => e.status === 'good').length;
    const bad = allEntries.filter(e => e.status === 'bad').length;
    const alc = allEntries.filter(e => e.status === 'alcohol').length;
    const total = allEntries.length;
    const rate = Math.round((good / total) * 100);
    const streak = calculateStreak(entries);

    // Longest streak
    const sortedDates = Object.keys(entries).sort();
    let longest = 0;
    let curr = 0;
    for (const d of sortedDates) {
        if (entries[d]?.status === 'good') { curr++; longest = Math.max(longest, curr); }
        else curr = 0;
    }

    // Averages
    const withCal = allEntries.filter(e => e.calories !== undefined);
    const avgCal = withCal.length > 0
        ? Math.round(withCal.reduce((a, e) => a + (e.calories || 0), 0) / withCal.length)
        : null;
    const withWater = allEntries.filter(e => e.water !== undefined);
    const avgWater = withWater.length > 0
        ? (withWater.reduce((a, e) => a + (e.water || 0), 0) / withWater.length).toFixed(1)
        : null;

    const rateColor = rate >= 70 ? colors.good : rate >= 40 ? colors.alcohol : colors.bad;

    return (
        <Box flexDirection="column" width={width} borderStyle="round" borderColor={colors.borderHighlight} paddingX={1} paddingY={0}>
            <Box marginBottom={1}>
                <Text color={colors.brandAlt} bold> 📊 Overall Statistics</Text>
            </Box>

            <Box flexDirection="column" paddingX={1}>
                <Box flexDirection="row" justifyContent="space-between">
                    <Text color={colors.textSecondary}>✅ Good days:</Text>
                    <Text>{chalk.hex(colors.good).bold(String(good).padStart(3))}  {progressBar(good, total, 16, colors.good)}</Text>
                </Box>
                <Box flexDirection="row" justifyContent="space-between">
                    <Text color={colors.textSecondary}>❌ Bad days:</Text>
                    <Text>{chalk.hex(colors.bad).bold(String(bad).padStart(3))}  {progressBar(bad, total, 16, colors.bad)}</Text>
                </Box>
                <Box flexDirection="row" justifyContent="space-between">
                    <Text color={colors.textSecondary}>🍺 Alcohol days:</Text>
                    <Text>{chalk.hex(colors.alcohol).bold(String(alc).padStart(3))}  {progressBar(alc, total, 16, colors.alcohol)}</Text>
                </Box>

                <Separator />

                <Box flexDirection="row" justifyContent="space-between">
                    <Text color={colors.textSecondary}>🔥 Current streak:</Text>
                    <Text>{chalk.hex(colors.streak)(String(streak).padStart(3) + ' days')}</Text>
                </Box>
                <Box flexDirection="row" justifyContent="space-between">
                    <Text color={colors.textSecondary}>🏆 Best streak:</Text>
                    <Text>{chalk.hex(colors.streak)(String(longest).padStart(3) + ' days')}</Text>
                </Box>
                <Box flexDirection="row" justifyContent="space-between">
                    <Text color={colors.textSecondary}>📈 Success rate:</Text>
                    <Text>{chalk.hex(rateColor).bold(String(rate).padStart(3) + '%')}</Text>
                </Box>

                {(avgCal !== null || avgWater !== null) && <Separator />}

                {avgCal !== null && (
                    <Box flexDirection="row" justifyContent="space-between">
                        <Text color={colors.textSecondary}>🔥 Avg calories:</Text>
                        <Text>{chalk.hex(colors.calories).bold(avgCal.toLocaleString() + ' kcal')}</Text>
                    </Box>
                )}
                {avgWater !== null && (
                    <Box flexDirection="row" justifyContent="space-between">
                        <Text color={colors.textSecondary}>💧 Avg water:</Text>
                        <Text>{chalk.hex(colors.water).bold(avgWater + ' glasses')}</Text>
                    </Box>
                )}

                <Separator />

                <Box flexDirection="row" justifyContent="space-between">
                    <Text color={colors.textSecondary}>📋 Total entries:</Text>
                    <Text>{chalk.hex(colors.textPrimary).bold(String(total))}</Text>
                </Box>
            </Box>
        </Box>
    );
}
