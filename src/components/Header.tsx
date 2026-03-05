import React from 'react';
import { Box, Text } from 'ink';
import { getInlineBrand } from '../ascii.js';
import { colors } from '../theme.js';
import { today, formatDateHuman } from '../utils/dates.js';

interface HeaderProps {
    subtitle?: string;
}

export default function Header({ subtitle }: HeaderProps): React.ReactElement {
    const dateStr = today();
    const dateHuman = formatDateHuman(dateStr);

    return (
        <Box
            flexDirection="column"
            borderStyle="round"
            borderColor={colors.borderHighlight}
            paddingX={2}
            paddingBottom={subtitle ? 1 : 0}
            width={60}
            marginBottom={2}
        >
            <Box justifyContent="space-between">
                <Text>{getInlineBrand()}</Text>
                <Text color={colors.textDim}>📅 {dateHuman}</Text>
            </Box>
            {subtitle && (
                <Box marginTop={1}>
                    <Text color={colors.textSecondary}>{subtitle}</Text>
                </Box>
            )}
        </Box>
    );
}
