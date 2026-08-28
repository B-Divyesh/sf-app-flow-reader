import './style.css';
import { fileName, MAX_ROUTE_STEPS, MIN_ROUTE_STEPS, normalizeState, toJson, toMarkdown, type RecorderState } from '../../lib/flow';

const flowSection = getElement('flow');
const stepList = getElement('step-list');
const statusChip = getElement('status-chip');
const toggle = getButton('toggle');
const announcement = getElement('announcement');
let current: RecorderState = normalizeState(undefined);

void refresh();

getButton('start').addEventListener('click', async () => {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  const name = (getElement('route-name') as HTMLInputElement).value;
  current = normalizeState(await browser.runtime.sendMessage({ type: 'afr:start', title: name, url: tab?.url || '' }));
  render();
  announce('Recording started. Complete at least two more steps on the page.');
});

toggle.addEventListener('click', async () => {
  current = normalizeState(await browser.runtime.sendMessage({ type: current.active ? 'afr:stop' : 'afr:resume' }));
  render();
  announce(current.active ? 'Recording resumed.' : 'Recording paused.');
});

getButton('follow').addEventListener('click', async () => {
  if (!current.flow || current.flow.steps.length < MIN_ROUTE_STEPS) return;
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  current = normalizeState(await browser.runtime.sendMessage({ type: 'afr:follow', id: current.flow.id, tabId: tab?.id }));
  render();
  announceStep();
});
getButton('back').addEventListener('click', () => move(-1));
getButton('next').addEventListener('click', () => move(1));
getButton('stop-following').addEventListener('click', async () => {
  current = normalizeState(await browser.runtime.sendMessage({ type: 'afr:stop-following' }));
  render();
  announce('Stopped following the route.');
});

getButton('export-md').addEventListener('click', () => current.flow && download(fileName(current.flow, 'md'), toMarkdown(current.flow), 'text/markdown'));
getButton('export-json').addEventListener('click', () => current.flow && download(fileName(current.flow, 'json'), toJson(current.flow), 'application/json'));
getButton('clear').addEventListener('click', async () => {
  if (!confirm('Delete this saved route and all of its steps?')) return;
  current = normalizeState(await browser.runtime.sendMessage({ type: 'afr:clear' }));
  render();
  announce('Route deleted.');
});

async function refresh() {
  current = normalizeState(await browser.runtime.sendMessage({ type: 'afr:get-state' }));
  render();
}

async function move(delta: number) {
  current = normalizeState(await browser.runtime.sendMessage({ type: 'afr:playback-move', delta }));
  render();
  announceStep();
}

function render() {
  flowSection.hidden = !current.flow;
  statusChip.textContent = current.active ? 'Recording' : current.playback ? 'Following' : 'Ready';
  statusChip.classList.toggle('active', current.active || Boolean(current.playback));
  toggle.textContent = current.active ? 'Pause' : 'Resume';

  const routeList = getElement('route-list');
  routeList.replaceChildren(...current.routes.map((route) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = route.id === current.flow?.id ? 'route-choice selected' : 'route-choice';
    button.setAttribute('aria-pressed', String(route.id === current.flow?.id));
    button.innerHTML = '<strong></strong><span></span>';
    button.querySelector('strong')!.textContent = route.title;
    button.querySelector('span')!.textContent = `${route.steps.length} steps`;
    button.addEventListener('click', async () => {
      current = normalizeState(await browser.runtime.sendMessage({ type: 'afr:select-route', id: route.id }));
      render();
    });
    item.append(button);
    return item;
  }));
  getElement('no-routes').hidden = current.routes.length > 0;
  if (!current.flow) return;

  getElement('flow-title').textContent = current.flow.title;
  const count = current.flow.steps.length;
  getElement('route-guidance').textContent = count < MIN_ROUTE_STEPS
    ? `${MIN_ROUTE_STEPS - count} more ${MIN_ROUTE_STEPS - count === 1 ? 'step' : 'steps'} needed before following.`
    : count === MAX_ROUTE_STEPS ? 'Ten-step limit reached. This route is ready to follow.' : `${count} steps. This route is ready to follow.`;
  toggle.disabled = count >= MAX_ROUTE_STEPS && !current.active;
  const follow = getButton('follow');
  follow.disabled = count < MIN_ROUTE_STEPS;
  follow.setAttribute('aria-describedby', 'route-guidance');

  stepList.replaceChildren(...current.flow.steps.map((step, index) => {
    const item = document.createElement('li');
    item.innerHTML = '<span class="step-number"></span><div><strong></strong><small></small><p class="step-note"></p><button class="note-button" type="button"></button></div>';
    item.querySelector('.step-number')!.textContent = String(index + 1);
    item.querySelector('strong')!.textContent = step.label;
    item.querySelector('small')!.textContent = step.kind === 'navigate' ? 'Page change' : step.kind === 'start' ? 'Start' : 'Find';
    const note = item.querySelector<HTMLElement>('.step-note')!;
    note.textContent = step.note ?? '';
    note.hidden = !step.note;
    const noteButton = item.querySelector<HTMLButtonElement>('.note-button')!;
    noteButton.textContent = step.note ? 'Edit note' : 'Add note';
    noteButton.setAttribute('aria-label', `${step.note ? 'Edit' : 'Add'} note for ${step.label}`);
    noteButton.addEventListener('click', async () => {
      const value = prompt(`Note for “${step.label}”`, step.note ?? '');
      if (value === null) return;
      current = normalizeState(await browser.runtime.sendMessage({ type: 'afr:note', id: step.id, note: value }));
      render();
      announce('Step note saved.');
    });
    return item;
  }));

  const following = Boolean(current.playback && current.playback.routeId === current.flow.id);
  const controls = getElement('follow-controls');
  controls.hidden = !following;
  if (following) {
    const index = current.playback!.index;
    getElement('current-step').textContent = `Step ${index + 1} of ${count}: ${current.flow.steps[index]?.label}`;
    getButton('back').disabled = index === 0;
    getButton('next').disabled = index === count - 1;
  }
}

function announceStep() {
  if (!current.flow || !current.playback) return;
  const step = current.flow.steps[current.playback.index];
  announce(`Step ${current.playback.index + 1} of ${current.flow.steps.length}. ${step?.label}`);
}

function download(name: string, contents: string, type: string) {
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(new Blob([contents], { type }));
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(anchor.href), 0);
  announce(`${name} downloaded.`);
}

function announce(message: string) { announcement.textContent = message; }
function getElement(id: string): HTMLElement { return document.getElementById(id)!; }
function getButton(id: string): HTMLButtonElement { return getElement(id) as HTMLButtonElement; }
