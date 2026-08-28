import type { Flow } from './flow';

export const sampleFlow: Flow = {
  id: 'demo-onboarding-flow',
  title: 'Invite a teammate to Northstar',
  createdAt: '2026-08-28T09:15:00.000Z',
  updatedAt: '2026-08-28T09:18:00.000Z',
  steps: [
    { id: 'demo-1', kind: 'start', label: 'Opened the team dashboard', url: 'https://northstar.example/team', at: '2026-08-28T09:15:00.000Z', note: 'Begin as a workspace owner.' },
    { id: 'demo-2', kind: 'click', label: 'Invite teammate', url: 'https://northstar.example/team', at: '2026-08-28T09:15:24.000Z' },
    { id: 'demo-3', kind: 'click', label: 'Role: Editor', url: 'https://northstar.example/team/invite', at: '2026-08-28T09:16:31.000Z', note: 'Editors can change projects but cannot manage billing.' },
    { id: 'demo-4', kind: 'click', label: 'Send invitation', url: 'https://northstar.example/team/invite', at: '2026-08-28T09:17:42.000Z' },
    { id: 'demo-5', kind: 'navigate', label: 'Invitation sent', url: 'https://northstar.example/team?invited=1', at: '2026-08-28T09:18:00.000Z', note: 'The teammate appears as Pending.' },
  ],
};
