import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type { DietData, DayEntry } from './types.js';

const DATA_DIR = path.join(os.homedir(), '.dietcli');
const DATA_FILE = path.join(DATA_DIR, 'data.json');

function ensureDataDir(): void {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

function createEmptyData(): DietData {
    return {
        version: 1,
        entries: {},
    };
}

export function loadData(): DietData {
    ensureDataDir();

    if (!fs.existsSync(DATA_FILE)) {
        const data = createEmptyData();
        saveData(data);
        return data;
    }

    try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw) as DietData;
    } catch {
        // If corrupted, back up and create fresh
        const backupPath = DATA_FILE + '.backup.' + Date.now();
        if (fs.existsSync(DATA_FILE)) {
            fs.copyFileSync(DATA_FILE, backupPath);
        }
        const data = createEmptyData();
        saveData(data);
        return data;
    }
}

export function saveData(data: DietData): void {
    ensureDataDir();
    const json = JSON.stringify(data, null, 2);
    // Atomic write: write to temp, then rename
    const tmpFile = DATA_FILE + '.tmp';
    fs.writeFileSync(tmpFile, json, 'utf-8');
    fs.renameSync(tmpFile, DATA_FILE);
}

export function getEntry(dateStr: string): DayEntry | undefined {
    const data = loadData();
    return data.entries[dateStr];
}

export function setEntry(entry: DayEntry): void {
    const data = loadData();
    data.entries[entry.date] = entry;
    saveData(data);
}

export function updateEntry(dateStr: string, updates: Partial<DayEntry>): DayEntry {
    const data = loadData();
    const existing = data.entries[dateStr] || { date: dateStr, status: 'good' as const };
    const updated = { ...existing, ...updates, date: dateStr };
    data.entries[dateStr] = updated;
    saveData(data);
    return updated;
}

export function getMonthEntries(year: number, month: number): Record<string, DayEntry> {
    const data = loadData();
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    const result: Record<string, DayEntry> = {};

    for (const [key, entry] of Object.entries(data.entries)) {
        if (key.startsWith(prefix)) {
            result[key] = entry;
        }
    }

    return result;
}

export function getAllEntries(): Record<string, DayEntry> {
    const data = loadData();
    return data.entries;
}
