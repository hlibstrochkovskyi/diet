import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import chalk from 'chalk';
import Header from '../components/Header.js';
import Calendar from '../components/Calendar.js';
import { colors } from '../theme.js';
import { useNavigation } from '../App.js';

export default function CalendarView(): React.ReactElement {
    const { navigate } = useNavigation();
    const today = new Date();

    // Local state for navigating months while in this view
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);

    useInput((input, key) => {
        if (key.leftArrow) {
            if (month === 1) {
                setMonth(12);
                setYear(y => y - 1);
            } else {
                setMonth(m => m - 1);
            }
        } else if (key.rightArrow) {
            if (month === 12) {
                setMonth(1);
                setYear(y => y + 1);
            } else {
                setMonth(m => m + 1);
            }
        } else if (input === 't') {
            // Jump back to today's month
            setYear(today.getFullYear());
            setMonth(today.getMonth() + 1);
        }
    });

    return (
        <Box flexDirection="column" flexGrow={1} justifyContent="center" alignItems="center" minHeight={30}>
            <Box flexDirection="column" width={60}>
                <Header subtitle="Interactive Calendar" />

                <Box flexDirection="column" flexGrow={1} alignSelf="center" marginTop={2}>
                    <Calendar year={year} month={month} />

                    <Box marginTop={1} justifyContent="center" width="100%">
                        <Text color={colors.textDim}>
                            {'← → '} prev/next month {'   '}
                            {chalk.bold('t')} today {'   '}
                            {chalk.bold('Esc')} return
                        </Text>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
