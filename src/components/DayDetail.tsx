import React from 'react';
import { Box, Text } from 'ink';
import chalk from 'chalk';
import { colors, s, buildPanel, stripAnsi } from '../theme.js';
import { formatDateHuman } from '../utils/dates.js';
import { STATUS_EMOJI, MEAL_EMOJI, MEAL_LABELS } from '../types.js';
import type { DayEntry } from '../types.js';

interface DayDetailProps {
    entry: DayEntry | undefined;
    dateStr: string;
}

export default function DayDetail({ entry, dateStr }: DayDetailProps): React.ReactElement {
    const dateHuman = formatDateHuman(dateStr);
    const width = 50;
    const innerWidth = width - 2;

    if (!entry) {
        const lines = [
            ` 📅  ${chalk.hex(colors.textPrimary).bold(dateHuman)}`,
            '',
            `  ${chalk.hex(colors.textDim)('No entry logged for this day.')}`,
            '',
            `  ${chalk.hex(colors.textDim)('Log with:')} ${chalk.hex(colors.brand)(`dietcli log -d ${dateStr}`)}`,
            '',
        ];
        const panel = buildPanel(lines, width, {
            title: '📋 Day Detail',
            titleColor: colors.brandAlt,
            separatorAfter: [0, 3],
        });
        return (
            <Box flexDirection="column">
                {panel.split('\n').map((line, i) => <Text key={i}>{line}</Text>)}
            </Box>
        );
    }

    const statusIcon = STATUS_EMOJI[entry.status];
    const statusLabel = entry.status.charAt(0).toUpperCase() + entry.status.slice(1);
    const statusColor = entry.status === 'good' ? colors.good : entry.status === 'bad' ? colors.bad : colors.alcohol;

    const lines: string[] = [];
    const separators: number[] = [];

    // Date + Status
    lines.push(` 📅  ${chalk.hex(colors.textPrimary).bold(dateHuman)}`);
    lines.push(` ${statusIcon}  ${chalk.hex(statusColor).bold(`Status: ${statusLabel}`)}`);
    separators.push(lines.length - 1);

    // Metrics line
    const metricsLine: string[] = [];
    if (entry.calories !== undefined) {
        metricsLine.push(chalk.hex(colors.calories)(` 🔥 ${entry.calories.toLocaleString()} kcal`));
    }
    if (entry.water !== undefined) {
        metricsLine.push(chalk.hex(colors.water)(` 💧 ${entry.water} glasses`));
    }
    if (metricsLine.length > 0) {
        for (const ml of metricsLine) lines.push(ml);
        separators.push(lines.length - 1);
    }

    // Meals
    if (entry.meals && entry.meals.length > 0) {
        lines.push(chalk.hex(colors.textSecondary)(' 🍽  Meals'));
        for (const meal of entry.meals) {
            const emoji = MEAL_EMOJI[meal.type];
            const label = MEAL_LABELS[meal.type];
            lines.push(`   ${emoji} ${chalk.hex(colors.textSecondary)(label + ':')} ${chalk.hex(colors.textPrimary)(meal.description)}`);
        }
        separators.push(lines.length - 1);
    }

    // Note
    if (entry.note) {
        lines.push(` 📝  ${chalk.hex(colors.textPrimary)(entry.note)}`);
    }

    // Add an empty line at the end for padding
    lines.push('');

    const panel = buildPanel(lines, width, {
        title: '📋 Day Detail',
        titleColor: colors.brandAlt,
        separatorAfter: separators,
    });

    return (
        <Box flexDirection="column">
            {panel.split('\n').map((line, i) => <Text key={i}>{line}</Text>)}
        </Box>
    );
}
