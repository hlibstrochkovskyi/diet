export type DayStatus = 'good' | 'bad' | 'alcohol';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal {
  type: MealType;
  description: string;
}

export interface DayEntry {
  date: string;           // ISO "2026-03-05"
  status: DayStatus;
  calories?: number;
  water?: number;         // glasses
  meals?: Meal[];
  note?: string;
}

export interface DietData {
  version: 1;
  entries: Record<string, DayEntry>;  // keyed by "YYYY-MM-DD"
}

export const STATUS_EMOJI: Record<DayStatus, string> = {
  good: '✅',
  bad: '❌',
  alcohol: '🍺',
};

export const MEAL_EMOJI: Record<MealType, string> = {
  breakfast: '🌅',
  lunch: '🌞',
  dinner: '🌙',
  snack: '🍫',
};

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};
