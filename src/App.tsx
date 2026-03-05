import React, { createContext, useContext, useState, useEffect } from 'react';
import { Box, useInput, useApp } from 'ink';
import HomeView from './views/HomeView.js';
import LogView from './views/LogView.js';
import CalendarView from './views/CalendarView.js';
import StatsView from './views/StatsView.js';

export type ViewState = 'home' | 'log' | 'calendar' | 'stats';

interface AppContextType {
    currentView: ViewState;
    navigate: (view: ViewState) => void;
    quit: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useNavigation() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useNavigation must be used within AppProvider');
    return ctx;
}

export default function App(): React.ReactElement {
    const { exit } = useApp();
    const [currentView, setCurrentView] = useState<ViewState>('home');

    // Global hotkeys
    useInput((input, key) => {
        // Ctrl+C to quit globally
        if (key.ctrl && input === 'c') {
            exit();
            return;
        }

        // Esc to return home from anywhere
        if (key.escape && currentView !== 'home') {
            setCurrentView('home');
        }
    });

    const contextValue = {
        currentView,
        navigate: setCurrentView,
        quit: () => exit()
    };

    return (
        <AppContext.Provider value={contextValue}>
            <Box flexDirection="column" flexGrow={1} height="100%" width="100%">
                {currentView === 'home' && <HomeView />}
                {currentView === 'log' && <LogView />}
                {currentView === 'calendar' && <CalendarView />}
                {currentView === 'stats' && <StatsView />}
            </Box>
        </AppContext.Provider>
    );
}
