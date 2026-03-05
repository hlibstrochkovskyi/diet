import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import chalk from 'chalk';
import { colors, buildPanel } from '../theme.js';
import { today } from '../utils/dates.js';
import { getEntry, updateEntry } from '../store.js';
import type { DayStatus, MealType, Meal } from '../types.js';
import { useNavigation } from '../App.js';
import Header from '../components/Header.js';

type LogPhase = 'status' | 'calories' | 'water' | 'meals' | 'done';

const STATUS_OPTIONS: { value: DayStatus; label: string; icon: string; desc: string }[] = [
    { value: 'good', label: 'Good day', icon: '✅', desc: 'Calorie deficit, clean eating' },
    { value: 'bad', label: 'Bad day', icon: '❌', desc: 'Slipped up, over calories' },
    { value: 'alcohol', label: 'Alcohol', icon: '🍺', desc: 'Had drinks today' },
];

const MEAL_OPTIONS: { value: MealType; label: string; icon: string }[] = [
    { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { value: 'lunch', label: 'Lunch', icon: '🌞' },
    { value: 'dinner', label: 'Dinner', icon: '🌙' },
    { value: 'snack', label: 'Snack / Extra', icon: '🍫' },
];

export default function LogView(): React.ReactElement {
    const { navigate } = useNavigation();
    const dateStr = today();
    const existing = getEntry(dateStr);

    const [phase, setPhase] = useState<LogPhase>('status');
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [status, setStatus] = useState<DayStatus>(existing?.status || 'good');
    const [caloriesInput, setCaloriesInput] = useState(existing?.calories?.toString() || '');
    const [waterInput, setWaterInput] = useState(existing?.water?.toString() || '');
    const [meals, setMeals] = useState<Meal[]>(existing?.meals || []);
    const [mealPhase, setMealPhase] = useState<'selectType' | 'inputDesc'>('selectType');
    const [currentMealType, setCurrentMealType] = useState<MealType>('breakfast');
    const [inputBuffer, setInputBuffer] = useState('');

    useInput((input, key) => {
        if (phase === 'status') {
            if (key.upArrow) setSelectedIdx(i => Math.max(0, i - 1));
            if (key.downArrow) setSelectedIdx(i => Math.min(STATUS_OPTIONS.length - 1, i + 1));
            if (key.return) {
                setStatus(STATUS_OPTIONS[selectedIdx]!.value);
                setPhase('calories');
                setSelectedIdx(0);
                setInputBuffer(caloriesInput);
            }
        } else if (phase === 'calories') {
            if (key.return) {
                const cal = parseInt(inputBuffer, 10);
                if (inputBuffer && !isNaN(cal)) setCaloriesInput(inputBuffer);
                setPhase('water');
                setInputBuffer(waterInput);
            } else if (key.backspace || key.delete) {
                setInputBuffer(b => b.slice(0, -1));
            } else if (/^\d$/.test(input)) {
                setInputBuffer(b => b + input);
            }
        } else if (phase === 'water') {
            if (key.return) {
                const w = parseInt(inputBuffer, 10);
                if (inputBuffer && !isNaN(w)) setWaterInput(inputBuffer);
                setPhase('meals');
                setSelectedIdx(0);
                setInputBuffer('');
            } else if (key.backspace || key.delete) {
                setInputBuffer(b => b.slice(0, -1));
            } else if (/^\d$/.test(input)) {
                setInputBuffer(b => b + input);
            }
        } else if (phase === 'meals') {
            if (mealPhase === 'selectType') {
                if (key.upArrow) setSelectedIdx(i => Math.max(0, i - 1));
                if (key.downArrow) setSelectedIdx(i => Math.min(MEAL_OPTIONS.length, i + 1));
                if (key.return) {
                    if (selectedIdx === MEAL_OPTIONS.length) {
                        finishLog();
                    } else {
                        setCurrentMealType(MEAL_OPTIONS[selectedIdx]!.value);
                        setMealPhase('inputDesc');
                        setInputBuffer('');
                    }
                }
                if (key.escape) finishLog();
            } else if (mealPhase === 'inputDesc') {
                if (key.return && inputBuffer.trim()) {
                    setMeals(m => [...m, { type: currentMealType, description: inputBuffer.trim() }]);
                    setMealPhase('selectType');
                    setInputBuffer('');
                    setSelectedIdx(0);
                } else if (key.escape) {
                    setMealPhase('selectType');
                    setInputBuffer('');
                } else if (key.backspace || key.delete) {
                    setInputBuffer(b => b.slice(0, -1));
                } else if (input && !key.ctrl && !key.meta) {
                    setInputBuffer(b => b + input);
                }
            }
        }
    });

    function finishLog() {
        const updates: Partial<{ status: DayStatus; calories: number; water: number; meals: Meal[] }> = { status };
        const cal = parseInt(caloriesInput || inputBuffer, 10);
        if (!isNaN(cal) && cal > 0) updates.calories = cal;
        const w = parseInt(waterInput, 10);
        if (!isNaN(w) && w > 0) updates.water = w;
        if (meals.length > 0) updates.meals = meals;
        updateEntry(dateStr, updates);
        setPhase('done');
        setTimeout(() => navigate('home'), 1500);
    }

    if (phase === 'done') {
        const lines = [
            '',
            ` ${chalk.hex(colors.good)('✓')}  Entry saved successfully.`,
            '',
            `    ${chalk.hex(colors.textDim)('Returning to main menu...')}`,
            ''
        ];
        const panel = buildPanel(lines, 60, { title: '✓ Saved', titleColor: colors.good, borderColor: colors.good });
        return (
            <Box flexDirection="column" paddingX={4} paddingTop={2}>
                <Header />
                <Box marginTop={2}>
                    {panel.split('\n').map((line, i) => <Text key={i}>{line}</Text>)}
                </Box>
            </Box>
        );
    }

    // Step indicator
    const steps = ['Status', 'Calories', 'Water', 'Meals'];
    const currentStep = phase === 'status' ? 0 : phase === 'calories' ? 1 : phase === 'water' ? 2 : 3;
    const stepIndicator = steps.map((name, i) => {
        if (i < currentStep) return chalk.hex(colors.good)(`✓ ${name}`);
        if (i === currentStep) return chalk.bgHex('#1A1A1A').hex(colors.brand).bold(` ❯ ${name} `);
        return chalk.hex(colors.textDim)(`○ ${name}`);
    }).join(chalk.hex(colors.textDim)(' → '));

    return (
        <Box flexDirection="column" flexGrow={1} justifyContent="center" alignItems="center" minHeight={30}>
            <Box flexDirection="column" width={60}>
                <Header subtitle={existing ? 'Updating existing entry' : 'New Log Entry'} />

                <Box flexDirection="column" flexGrow={1} alignSelf="center" marginTop={2} width="100%">
                    {/* Step Progress panel */}
                    <Box borderStyle="round" borderColor={colors.borderHighlight} paddingX={2} marginBottom={2}>
                        <Text>{stepIndicator}</Text>
                    </Box>

                    {/* Status Phase */}
                    {phase === 'status' && (
                        <Box flexDirection="column">
                            <Text>{chalk.hex(colors.brand).bold(`  How was your day?`)}</Text>
                            <Text> </Text>
                            {STATUS_OPTIONS.map((opt, idx) => {
                                const selected = idx === selectedIdx;
                                const pointer = selected ? chalk.hex(colors.brand)('  ❯ ') : '    ';
                                const icon = opt.icon;
                                const main = selected
                                    ? chalk.white.bold(opt.label)
                                    : chalk.hex(colors.textSecondary)(opt.label);
                                const desc = chalk.hex(colors.textDim)(` — ${opt.desc}`);
                                return <Text key={opt.value}>{pointer}{icon} {main}{selected ? desc : ''}</Text>;
                            })}
                            <Text> </Text>
                            <Text>{chalk.hex(colors.textDim)('  ↑↓ navigate    Enter select    Esc back')}</Text>
                        </Box>
                    )}

                    {/* Calories Phase */}
                    {phase === 'calories' && (
                        <Box flexDirection="column">
                            <Text>{chalk.hex(colors.brand).bold('  🔥 How many calories?')}</Text>
                            <Text>{chalk.hex(colors.textDim)('  Enter a number, or press Enter to skip')}</Text>
                            <Text> </Text>
                            <Box borderStyle="single" borderColor={colors.brandAlt} paddingX={1} width={30}>
                                <Text>
                                    {inputBuffer || ''}{chalk.bgHex(colors.brand)(' ')}
                                    {inputBuffer ? chalk.hex(colors.textDim)(' kcal') : ''}
                                </Text>
                            </Box>
                        </Box>
                    )}

                    {/* Water Phase */}
                    {phase === 'water' && (
                        <Box flexDirection="column">
                            <Text>{chalk.hex(colors.brand).bold('  💧 Glasses of water?')}</Text>
                            <Text>{chalk.hex(colors.textDim)('  Enter a number, or press Enter to skip')}</Text>
                            <Text> </Text>
                            <Box borderStyle="single" borderColor={colors.brandAlt} paddingX={1} width={30}>
                                <Text>
                                    {inputBuffer || ''}{chalk.bgHex(colors.brand)(' ')}
                                    {inputBuffer ? chalk.hex(colors.textDim)(' glasses') : ''}
                                </Text>
                            </Box>
                        </Box>
                    )}

                    {/* Meals Phase */}
                    {phase === 'meals' && mealPhase === 'selectType' && (
                        <Box flexDirection="column">
                            <Text>{chalk.hex(colors.brand).bold('  🍽  Add a meal')}</Text>
                            {meals.length > 0 && (
                                <Box flexDirection="column" marginTop={1} marginBottom={1} borderStyle="round" borderColor={colors.border} paddingX={1}>
                                    {meals.map((m, i) => {
                                        const opt = MEAL_OPTIONS.find(o => o.value === m.type);
                                        return <Text key={i}>{chalk.hex(colors.textDim)('  ')}✓ {opt?.icon} {chalk.hex(colors.textSecondary)(m.description)}</Text>;
                                    })}
                                </Box>
                            )}
                            <Text> </Text>
                            {MEAL_OPTIONS.map((opt, idx) => {
                                const selected = idx === selectedIdx;
                                const pointer = selected ? chalk.hex(colors.brand)('  ❯ ') : '    ';
                                const main = selected ? chalk.white.bold(opt.label) : chalk.hex(colors.textSecondary)(opt.label);
                                return <Text key={opt.value}>{pointer}{opt.icon} {main}</Text>;
                            })}
                            <Text>
                                {selectedIdx === MEAL_OPTIONS.length ? chalk.hex(colors.brand)('  ❯ ') : '    '}
                                {chalk.hex(selectedIdx === MEAL_OPTIONS.length ? colors.good : colors.textDim)('✓ Done adding meals')}
                            </Text>
                            <Text> </Text>
                            <Text>{chalk.hex(colors.textDim)('  ↑↓ navigate    Enter select')}</Text>
                        </Box>
                    )}

                    {phase === 'meals' && mealPhase === 'inputDesc' && (
                        <Box flexDirection="column">
                            <Text>
                                {chalk.hex(colors.brand).bold(`  ${MEAL_OPTIONS.find(o => o.value === currentMealType)?.icon} What did you have for ${currentMealType}?`)}
                            </Text>
                            <Text> </Text>
                            <Box borderStyle="single" borderColor={colors.brandAlt} paddingX={1} width={50}>
                                <Text>{inputBuffer}{chalk.bgHex(colors.brand)(' ')}</Text>
                            </Box>
                            <Text> </Text>
                            <Text>{chalk.hex(colors.textDim)('  Enter save    Esc cancel')}</Text>
                        </Box>
                    )}

                </Box>
            </Box>
        </Box>
    );
}
