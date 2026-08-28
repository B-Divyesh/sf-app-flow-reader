export type StepKind = 'start' | 'click' | 'navigate' | 'note';

export interface FlowStep {
  id: string;
  kind: StepKind;
  label: string;
  url: string;
  at: string;
  note?: string;
}

export interface Flow {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  steps: FlowStep[];
}

export interface RecorderState {
  active: boolean;
  flow: Flow | null;
}

export const STORAGE_KEY = 'app-flow-reader:state';

export function createFlow(title: string, url: string, now = new Date()): Flow {
  const timestamp = now.toISOString();
  return {
    id: `flow-${now.getTime()}`,
    title: cleanText(title) || 'Untitled app flow',
    createdAt: timestamp,
    updatedAt: timestamp,
    steps: [createStep('start', 'Started recording', url, now)],
  };
}

export function createStep(kind: StepKind, label: string, url: string, now = new Date()): FlowStep {
  return {
    id: `${kind}-${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    kind,
    label: cleanText(label) || fallbackLabel(kind),
    url: safeUrl(url),
    at: now.toISOString(),
  };
}

export function appendStep(flow: Flow, step: FlowStep): Flow {
  const previous = flow.steps.at(-1);
  if (previous && previous.kind === step.kind && previous.label === step.label && previous.url === step.url) {
    return flow;
  }
  return { ...flow, updatedAt: step.at, steps: [...flow.steps, step] };
}

export function updateStepNote(flow: Flow, id: string, note: string): Flow {
  return {
    ...flow,
    updatedAt: new Date().toISOString(),
    steps: flow.steps.map((step) => step.id === id ? { ...step, note: cleanText(note, 280) } : step),
  };
}

export function removeStep(flow: Flow, id: string): Flow {
  return { ...flow, updatedAt: new Date().toISOString(), steps: flow.steps.filter((step) => step.id !== id) };
}

export function cleanText(value: string, limit = 120): string {
  return value.replace(/\s+/g, ' ').trim().slice(0, limit);
}

export function readableTarget(element: Element | null): string {
  if (!element) return 'Selected page item';
  const html = element as HTMLElement;
  const formLabel = html instanceof HTMLInputElement || html instanceof HTMLTextAreaElement || html instanceof HTMLSelectElement
    ? html.labels?.[0]?.innerText
    : '';
  const label = html.getAttribute('aria-label')
    || html.getAttribute('title')
    || html.innerText
    || formLabel
    || (html instanceof HTMLInputElement ? html.name || html.placeholder : '')
    || html.getAttribute('alt')
    || html.tagName.toLowerCase();
  return cleanText(label);
}

export function toMarkdown(flow: Flow): string {
  const lines = [`# ${escapeMarkdown(flow.title)}`, '', `Recorded ${formatDate(flow.createdAt)}.`, ''];
  flow.steps.forEach((step, index) => {
    lines.push(`${index + 1}. **${kindLabel(step.kind)}:** ${escapeMarkdown(step.label)}`);
    if (step.url) lines.push(`   - Page: ${step.url}`);
    if (step.note) lines.push(`   - Note: ${escapeMarkdown(step.note)}`);
  });
  lines.push('', '_Created with App Flow Reader._', '');
  return lines.join('\n');
}

export function toJson(flow: Flow): string {
  return `${JSON.stringify(flow, null, 2)}\n`;
}

export function fileName(flow: Flow, extension: 'md' | 'json'): string {
  const base = cleanText(flow.title, 70).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'app-flow';
  return `${base}.${extension}`;
}

function fallbackLabel(kind: StepKind): string {
  return kind === 'navigate' ? 'Opened a page' : kind === 'note' ? 'Added a note' : kind === 'start' ? 'Started recording' : 'Selected page item';
}

function safeUrl(value: string): string {
  try {
    const parsed = new URL(value);
    return ['http:', 'https:', 'file:'].includes(parsed.protocol) ? parsed.href : '';
  } catch {
    return '';
  }
}

function escapeMarkdown(value: string): string {
  return value.replace(/([\\`*_[\]<>#])/g, '\\$1');
}

function kindLabel(kind: StepKind): string {
  return ({ start: 'Start', click: 'Click', navigate: 'Page change', note: 'Note' } as const)[kind];
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}
