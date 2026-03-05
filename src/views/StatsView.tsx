import React from 'react';
import { Box, Text } from 'ink';
import chalk from 'chalk';
import Header from '../components/Header.js';
import StatsBar from '../components/StatsBar.js';
import { colors } from '../theme.js';

export default function StatsView(): React.ReactElement {
    return (
        <Box flexDirection="column" flexGrow={1} justifyContent="center" alignItems="center" minHeight={30}>
            <Box flexDirection="column" width={60}>
                <Header subtitle="Overall Analytics" />

                <Box flexDirection="column" flexGrow={1} alignSelf="center" marginTop={2}>
                    <StatsBar />

                    <Box marginTop={1} justifyContent="center" width="100%">
                        <Text color={colors.textDim}>
                            {chalk.bold('Esc')} return to main menu
                        </Text>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
