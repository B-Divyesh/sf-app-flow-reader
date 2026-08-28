import './style.css';
import { fileName, toJson, toMarkdown, type RecorderState } from '../../lib/flow';

const empty = getElement('empty');
const flowSection = getElement('flow');
const stepList = getElement('step-list');
const noSteps = getElement('no-steps');
const statusChip = getElement('status-chip');
const toggle = getButton('toggle');
const announcement = getElement('announcement');
let current: RecorderState = { active: false, flow: null };

void refresh();

getButton('start').addEventListener('click', async () => {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  current = await browser.runtime.sendMessage({ type: 'afr:start', title: tab?.title || 'Untitled app flow', url: tab?.url || '' });
  render();
  announce('Recording started. Return to the page and complete the task.');
});

toggle.addEventListener('click', async () => {
  if (current.active) current = await browser.runtime.sendMessage({ type: 'afr:stop' });
  else {
    current = await browser.runtime.sendMessage({ type: 'afr:resume' });
  }
  render();
  announce(current.active ? 'Recording resumed.' : 'Recording paused.');
});

getButton('export-md').addEventListener('click', () => current.flow && download(fileName(current.flow, 'md'), toMarkdown(current.flow), 'text/markdown'));
getButton('export-json').addEventListener('click', () => current.flow && download(fileName(current.flow, 'json'), toJson(current.flow), 'application/json'));
getButton('clear').addEventListener('click', async () => {
  if (!confirm('Clear this flow and all of its recorded steps?')) return;
  current = await browser.runtime.sendMessage({ type: 'afr:clear' });
  render();
  announce('Flow cleared.');
});

async function refresh() {
  current = await browser.runtime.sendMessage({ type: 'afr:get-state' });
  render();
}

function render() {
  empty.hidden = Boolean(current.flow);
  flowSection.hidden = !current.flow;
  statusChip.textContent = current.active ? 'Recording' : 'Stopped';
  statusChip.classList.toggle('active', current.active);
  toggle.textContent = current.active ? 'Pause' : 'Resume';
  if (!current.flow) return;
  stepList.replaceChildren(...current.flow.steps.map((step, index) => {
    const item = document.createElement('li');
    item.innerHTML = `<span class="step-number">${index + 1}</span><div><strong></strong><small></small><p class="step-note"></p><button class="note-button" type="button">${step.note ? 'Edit note' : 'Add note'}</button></div>`;
    item.querySelector('strong')!.textContent = step.label;
    item.querySelector('small')!.textContent = step.kind === 'navigate' ? 'Page change' : step.kind === 'start' ? 'Start' : 'Click';
    const note = item.querySelector<HTMLElement>('.step-note')!;
    note.textContent = step.note ?? '';
    note.hidden = !step.note;
    item.querySelector<HTMLButtonElement>('.note-button')!.addEventListener('click', async () => {
      const value = prompt(`Note for “${step.label}”`, step.note ?? '');
      if (value === null) return;
      current = await browser.runtime.sendMessage({ type: 'afr:note', id: step.id, note: value });
      render();
      announce('Step note saved.');
    });
    return item;
  }));
  noSteps.hidden = current.flow.steps.length > 0;
}

function download(name: string, contents: string, type: string) {
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(new Blob([contents], { type }));
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(anchor.href);
  announce(`${name} downloaded.`);
}

function announce(message: string) { announcement.textContent = message; }
function getElement(id: string): HTMLElement { return document.getElementById(id)!; }
function getButton(id: string): HTMLButtonElement { return getElement(id) as HTMLButtonElement; }
