import type { Flow } from './flow';

export const sampleFlow: Flow = {
  id: 'demo-expense-route',
  title: 'Submit a monthly expense report',
  createdAt: '2026-08-28T09:15:00.000Z',
  updatedAt: '2026-08-28T09:18:00.000Z',
  steps: [
    { id: 'demo-1', kind: 'start', label: 'Open Expenses from the main menu', url: 'https://ledger.example/home', at: '2026-08-28T09:15:00.000Z', note: 'The menu is on the left edge.' },
    { id: 'demo-2', kind: 'click', label: 'Choose New report', url: 'https://ledger.example/expenses', at: '2026-08-28T09:15:24.000Z' },
    { id: 'demo-3', kind: 'click', label: 'Select Monthly expenses', url: 'https://ledger.example/expenses/new', at: '2026-08-28T09:16:31.000Z', note: 'This is the second option under Report type.' },
    { id: 'demo-4', kind: 'click', label: 'Choose Review report', url: 'https://ledger.example/expenses/new', at: '2026-08-28T09:17:42.000Z' },
    { id: 'demo-5', kind: 'navigate', label: 'Choose Send to manager', url: 'https://ledger.example/expenses/review', at: '2026-08-28T09:18:00.000Z', note: 'A confirmation appears after sending.' },
  ],
};
