export type Habit = { id: string; name: string; detail: string; done: boolean; streak: number; emoji: string; symbol: string };

export const HABITS: Habit[] = [
  { id: '1', name: 'Morning walk', detail: '20 minutes', done: true, streak: 12, emoji: '🚶', symbol: 'figure.walk' },
  { id: '2', name: 'Read', detail: '10 pages', done: true, streak: 5, emoji: '📚', symbol: 'book' },
  { id: '3', name: 'Drink water', detail: '8 glasses', done: false, streak: 3, emoji: '💧', symbol: 'drop' },
  { id: '4', name: 'Stretch', detail: '5 minutes', done: false, streak: 0, emoji: '🧘', symbol: 'figure.flexibility' },
];

export const WEEK = [1, 1, 0.75, 1, 0.5, 1, 0.5];
