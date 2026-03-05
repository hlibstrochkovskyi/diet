#!/usr/bin/env node

import React from 'react';
import { render } from 'ink';
import App from './App.js';

// Enter the alternative screen buffer (full-screen takeover)
process.stdout.write('\x1b[?1049h');
// Hide the cursor globally for the menu experience
process.stdout.write('\x1b[?25l');

const { unmount } = render(<App />, { exitOnCtrlC: false });

// When the process exits, cleanly restore the terminal
process.on('exit', () => {
    // Show cursor
    process.stdout.write('\x1b[?25h');
    // Leave alternative screen buffer
    process.stdout.write('\x1b[?1049l');
});
