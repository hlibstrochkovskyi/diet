import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import chalk from 'chalk';
import { useNavigation } from '../App.js';
import { getTitleArt, sparkle } from '../ascii.js';
import { colors } from '../theme.js';
import { today, formatDateHuman } from '../utils/dates.js';

const MENU_ITEMS = [
    { id: 'log', label: 'Log Today\'s Diet' },
    { id: 'calendar', label: 'View Calendar' },
    { id: 'stats', label: 'View Analytics' },
    { id: 'quit', label: 'Quit' }
] as const;

export default function HomeView(): React.ReactElement {
    const { navigate, quit } = useNavigation();
    const [selectedIdx, setSelectedIdx] = useState(0);

    // Menu navigation
    useInput((input, key) => {
        if (key.upArrow) {
            setSelectedIdx(i => Math.max(0, i - 1));
        } else if (key.downArrow) {
            setSelectedIdx(i => Math.min(MENU_ITEMS.length - 1, i + 1));
        } else if (key.return) {
            const selected = MENU_ITEMS[selectedIdx]!.id;
            if (selected === 'quit') quit();
            else navigate(selected as any);
        }
    });

    const dateHuman = formatDateHuman(today());

    return (
        <Box
            flexDirection="column"
            flexGrow={1}
            justifyContent="center"
            alignItems="center"
            minHeight={30}
        >
            <Box flexDirection="column" alignItems="center">
                {/* Logo and ASCII */}
                <Text>{getTitleArt()}</Text>
                <Text> </Text>
                <Text>
                    {sparkle()}{'  '}
                    {chalk.hex(colors.textSecondary).italic('Your diet. Your discipline. Your gains.')}
                    {'  '}{sparkle()}
                </Text>
                <Text> </Text>

                {/* Info panel */}
                <Box
                    borderStyle="round"
                    borderColor={colors.border}
                    paddingX={2}
                    marginBottom={2}
                    flexDirection="column"
                    alignItems="center"
                >
                    <Text color={colors.textSecondary}>{dateHuman}</Text>
                </Box>

                {/* Interactive Menu */}
                <Box flexDirection="column" paddingX={4} alignSelf="center">
                    {MENU_ITEMS.map((item, idx) => {
                        const isSelected = idx === selectedIdx;

                        // Replicate OpenCode's glowing/highlighted menu style
                        const prefix = isSelected ? chalk.hex(colors.brand)('  ❯ ') : '    ';

                        // Draw a subtle "selection box" effect with background color when selected
                        const labelContent = isSelected
                            ? chalk.white.bold(item.label)
                            : chalk.hex(colors.textSecondary)(item.label);

                        return (
                            <Box key={item.id} marginBottom={1}>
                                <Text>{prefix}{labelContent}</Text>
                            </Box>
                        );
                    })}
                </Box>

                {/* Footer hints */}
                <Box marginTop={4} alignSelf="center">
                    <Text color={colors.textDim}>
                        {' ↑↓  '}navigate{'   '}
                        {chalk.bold('↵')}   select{'   '}
                        {'ESC'} return
                    </Text>
                </Box>
            </Box>
        </Box>
    );
}
