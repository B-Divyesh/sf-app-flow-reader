export type StepKind = 'start' | 'click' | 'navigate' | 'note';

export interface FlowStep {
  id: string;
  kind: StepKind;
  label: string;
  url: string;
  at: string;
  note?: string;
  anchor?: string;
}

export interface Flow {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  steps: FlowStep[];
}

export interface PlaybackState { routeId: string; index: number; }
export interface RecorderState {
  active: boolean;
  flow: Flow | null;
  routes: Flow[];
  playback: PlaybackState | null;
}

export const STORAGE_KEY = 'app-flow-reader:state';
export const MIN_ROUTE_STEPS = 3;
export const MAX_ROUTE_STEPS = 10;
export const EMPTY_STATE: RecorderState = { active: false, flow: null, routes: [], playback: null };

export function normalizeState(value: Partial<RecorderState> | undefined): RecorderState {
  if (!value) return structuredClone(EMPTY_STATE);
  const flow = value.flow ?? null;
  const routes = Array.isArray(value.routes) ? value.routes : flow ? [flow] : [];
  return { active: Boolean(value.active), flow, routes, playback: value.playback ?? null };
}

export function createFlow(title: string, url: string, now = new Date()): Flow {
  const timestamp = now.toISOString();
  return {
    id: `flow-${now.getTime()}`,
    title: cleanText(title) || 'Untitled app route',
    createdAt: timestamp,
    updatedAt: timestamp,
    steps: [createStep('start', 'Start here', url, now)],
  };
}

export function createStep(kind: StepKind, label: string, url: string, now = new Date(), anchor = ''): FlowStep {
  return {
    id: `${kind}-${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    kind,
    label: cleanText(label) || fallbackLabel(kind),
    url: safeUrl(url),
    at: now.toISOString(),
    ...(anchor ? { anchor: cleanText(anchor, 300) } : {}),
  };
}

export function appendStep(flow: Flow, step: FlowStep): Flow {
  if (flow.steps.length >= MAX_ROUTE_STEPS) return flow;
  const previous = flow.steps.at(-1);
  if (previous && previous.kind === step.kind && previous.label === step.label && previous.url === step.url) return flow;
  return { ...flow, updatedAt: step.at, steps: [...flow.steps, step] };
}

export function upsertRoute(routes: Flow[], flow: Flow): Flow[] {
  const found = routes.some((route) => route.id === flow.id);
  return found ? routes.map((route) => route.id === flow.id ? flow : route) : [...routes, flow];
}

export function updateStepNote(flow: Flow, id: string, note: string): Flow {
  return {
    ...flow,
    updatedAt: new Date().toISOString(),
    steps: flow.steps.map((step) => step.id === id ? { ...step, note: cleanText(note, 280) || undefined } : step),
  };
}

export function removeStep(flow: Flow, id: string): Flow {
  return { ...flow, updatedAt: new Date().toISOString(), steps: flow.steps.filter((step) => step.id !== id) };
}

export function cleanText(value: string, limit = 120): string {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, limit);
}

export function isSensitiveTarget(element: Element | null): boolean {
  return Boolean(element?.closest('input[type="password"], [data-app-flow-reader-private]'));
}

/** DOM approximation of the browser's accessible-name order, before visual text fallbacks. */
export function readableTarget(element: Element | null): string {
  if (!element) return 'Selected page item';
  const html = element as HTMLElement;
  const labelledBy = html.getAttribute('aria-labelledby')
    ?.split(/\s+/)
    .map((id) => document.getElementById(id)?.textContent ?? '')
    .join(' ');
  const formLabel = html instanceof HTMLInputElement || html instanceof HTMLTextAreaElement || html instanceof HTMLSelectElement
    ? [...(html.labels ?? [])].map((label) => label.textContent ?? '').join(' ')
    : '';
  const descendantAlt = html.querySelector('img[alt]')?.getAttribute('alt') ?? '';
  const label = labelledBy
    || html.getAttribute('aria-label')
    || formLabel
    || html.getAttribute('alt')
    || descendantAlt
    || html.textContent
    || html.getAttribute('title')
    || (html instanceof HTMLInputElement ? html.name || html.placeholder : '')
    || html.tagName.toLowerCase();
  return cleanText(label);
}

export function anchorFor(element: Element): string {
  const escaped = (value: string) => CSS.escape(value);
  if (element.id) return `#${escaped(element.id)}`;
  const aria = element.getAttribute('aria-label');
  if (aria) return `${element.tagName.toLowerCase()}[aria-label="${aria.replace(/["\\]/g, '\\$&')}"]`;
  const name = element.getAttribute('name');
  if (name) return `${element.tagName.toLowerCase()}[name="${name.replace(/["\\]/g, '\\$&')}"]`;
  const parent = element.parentElement;
  if (!parent) return element.tagName.toLowerCase();
  const siblings = [...parent.children].filter((item) => item.tagName === element.tagName);
  return `${anchorFor(parent)} > ${element.tagName.toLowerCase()}:nth-of-type(${siblings.indexOf(element) + 1})`;
}

export function toMarkdown(flow: Flow): string {
  const lines = [`# ${escapeMarkdown(flow.title)}`, '', `${flow.steps.length}-step browser route.`, ''];
  flow.steps.forEach((step, index) => {
    lines.push(`${index + 1}. **${kindLabel(step.kind)}:** ${escapeMarkdown(step.label)}`);
    if (step.url) lines.push(`   - Page: ${step.url}`);
    if (step.note) lines.push(`   - Note: ${escapeMarkdown(step.note)}`);
  });
  lines.push('', '_Created with App Flow Reader._', '');
  return lines.join('\n');
}

export function toJson(flow: Flow): string { return `${JSON.stringify(flow, null, 2)}\n`; }

export function fileName(flow: Flow, extension: 'md' | 'json'): string {
  const base = cleanText(flow.title, 70).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'app-route';
  return `${base}.${extension}`;
}

function fallbackLabel(kind: StepKind): string {
  return kind === 'navigate' ? 'Opened a page' : kind === 'note' ? 'Added a note' : kind === 'start' ? 'Start here' : 'Selected page item';
}

function safeUrl(value: string): string {
  try {
    const parsed = new URL(value);
    return ['http:', 'https:', 'file:'].includes(parsed.protocol) ? parsed.href : '';
  } catch { return ''; }
}

function escapeMarkdown(value: string): string { return value.replace(/([\\`*_[\]<>#])/g, '\\$1'); }
function kindLabel(kind: StepKind): string { return ({ start: 'Start', click: 'Find', navigate: 'Page change', note: 'Note' } as const)[kind]; }
