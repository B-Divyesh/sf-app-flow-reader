import './styles.css';
import { fileName, removeStep, toJson, toMarkdown, updateStepNote, type Flow } from '../../lib/flow';
import { sampleFlow } from '../../lib/sample';

type Route = '/' | '/demo' | '/privacy' | '/terms' | '/not-found';

const app = document.querySelector<HTMLDivElement>('#app')!;
const routeStatus = document.querySelector<HTMLDivElement>('#route-status')!;
let demoFlow: Flow = structuredClone(sampleFlow);
let undoFlow: Flow | null = null;

render(false);
registerServiceWorker();

addEventListener('popstate', () => render(true));
document.addEventListener('click', (event) => {
  const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-route]') : null;
  if (!link || link.origin !== location.origin) return;
  event.preventDefault();
  history.pushState({}, '', link.pathname);
  render(true);
});

function render(focusHeading: boolean) {
  const route = currentRoute();
  setMetadata(route);
  app.innerHTML = `${header(route)}${route === '/' ? home() : route === '/demo' ? demo() : route === '/privacy' ? privacy() : route === '/terms' ? terms() : notFound()}${footer()}`;
  document.querySelector('main')?.setAttribute('tabindex', '-1');
  bindSharedActions();
  if (route === '/demo') bindDemoActions();
  if (focusHeading) {
    const heading = document.querySelector<HTMLHeadingElement>('h1');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus();
    routeStatus.textContent = `${heading?.textContent ?? 'Page'} loaded`;
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
}

function header(route: Route): string {
  return `<header class="site-header">
    <a class="wordmark" href="/" data-route aria-label="App Flow Reader home">
      <svg aria-hidden="true" width="34" height="26" viewBox="0 0 34 26"><path d="M4 5h11l5 8h10M4 21h11l5-8"/><circle cx="4" cy="5" r="3"/><circle cx="4" cy="21" r="3"/><circle cx="30" cy="13" r="3"/></svg>
      <span>App Flow Reader</span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="sr-only">Open navigation</span><span></span><span></span></button>
    <nav id="site-nav" aria-label="Main navigation">
      <a href="/demo" data-route ${route === '/demo' ? 'aria-current="page"' : ''}>Demo</a>
      <a href="/#how-it-works">How it works</a>
      <a href="/privacy" data-route ${route === '/privacy' ? 'aria-current="page"' : ''}>Privacy</a>
      <a class="nav-download" href="/downloads/app-flow-reader-chrome.zip" download>Download</a>
    </nav>
  </header>`;
}

function home(): string {
  return `<main id="main">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="kicker">A browser path, written down</p>
        <h1 id="hero-title">Record browser tasks as clear steps</h1>
        <p class="lede">For product teams who need to explain a web app without replaying every click.</p>
        <div class="hero-actions">
          <a class="button primary" href="/demo" data-route>Try it with sample data</a>
          <span>See a five-step teammate invite.</span>
        </div>
        <ul class="plain-facts" aria-label="Product facts">
          <li><strong>Local</strong><span>Your flow stays in browser storage.</span></li>
          <li><strong>Portable</strong><span>Export Markdown and JSON files.</span></li>
          <li><strong>Open</strong><span>No account is needed.</span></li>
        </ul>
      </div>
      <div class="hero-map" aria-label="Illustration of a five-step app flow">
        <div class="paper-tab">FLOW 05</div>
        <ol>
          <li><span>01</span><p>Open team</p></li>
          <li><span>02</span><p>Invite teammate</p></li>
          <li><span>03</span><p>Choose Editor</p></li>
          <li><span>04</span><p>Send invitation</p></li>
          <li><span>05</span><p>Check Pending</p></li>
        </ol>
      </div>
    </section>

    <section class="product-preview" aria-labelledby="preview-title">
      <div class="section-label"><span>01</span><p>Live preview</p></div>
      <div class="preview-copy"><h2 id="preview-title">A useful record, not a screen recording</h2><p>App Flow Reader catches the action label and page address. Add the reason later, then share a document people can scan.</p></div>
      <div class="browser-frame" aria-label="Example extension view">
        <div class="browser-bar"><span></span><span></span><span></span><p>northstar.example/team</p></div>
        <div class="mini-flow">
          <p class="eyebrow">Current flow</p><h3>Invite a teammate</h3>
          <ol><li><b>1</b><span>Opened the team dashboard<small>Start</small></span></li><li><b>2</b><span>Invite teammate<small>Click</small></span></li><li><b>3</b><span>Role: Editor<small>Click</small></span></li></ol>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="how" aria-labelledby="how-title">
      <div class="section-label"><span>02</span><p>How it works</p></div>
      <h2 id="how-title">Follow the task once</h2>
      <ol class="how-list">
        <li><span>1</span><div><h3>Start recording</h3><p>Open the extension on the first page of the task.</p></div></li>
        <li><span>2</span><div><h3>Complete the path</h3><p>Your clicks and page changes become ordered steps.</p></div></li>
        <li><span>3</span><div><h3>Export the flow</h3><p>Save Markdown for people or JSON for another tool.</p></div></li>
      </ol>
    </section>

    <section class="boundaries" aria-labelledby="boundaries-title">
      <div><p class="kicker">Clear boundaries</p><h2 id="boundaries-title">It records the path, not the screen</h2></div>
      <ul><li>No screenshots or typed field values.</li><li>No cloud account or shared workspace.</li><li>No recording on browser settings pages.</li></ul>
    </section>

    <section class="install" aria-labelledby="install-title">
      <p class="kicker">Chrome and Chromium browsers</p>
      <h2 id="install-title">Keep the recorder in your toolbar</h2>
      <p>Download the package, unzip it, then load the folder from the browser extensions page.</p>
      <a class="button primary" href="/downloads/app-flow-reader-chrome.zip" download>Download extension</a>
      <details><summary>Install an unpacked extension</summary><ol><li>Open <code>chrome://extensions</code>.</li><li>Turn on Developer mode.</li><li>Select Load unpacked and choose the unzipped folder.</li></ol></details>
    </section>
  </main>`;
}

function demo(): string {
  const steps = demoFlow.steps.map((step, index) => `<li class="demo-step" data-step-id="${step.id}">
    <span class="demo-number">${String(index + 1).padStart(2, '0')}</span>
    <div class="demo-step-copy"><span class="step-kind">${step.kind === 'navigate' ? 'Page change' : step.kind === 'start' ? 'Start' : 'Click'}</span><h2>${escapeHtml(step.label)}</h2><p class="step-url">${escapeHtml(new URL(step.url).pathname + new URL(step.url).search)}</p>${step.note ? `<p class="note">${escapeHtml(step.note)}</p>` : ''}</div>
    <div class="step-actions"><button class="icon-button edit-note" type="button" aria-label="Edit note for ${escapeHtml(step.label)}">Note</button><button class="icon-button remove-step" type="button" aria-label="Remove ${escapeHtml(step.label)}">Remove</button></div>
  </li>`).join('');
  return `<div class="demo-banner" role="status"><strong>Demo</strong><span>Sample data. Nothing is saved.</span><button id="reset-demo" type="button">Reset demo</button><a href="/" data-route>Start for real</a></div>
  <main id="main" class="demo-main">
    <header class="demo-heading"><div><p class="kicker">Sample flow</p><h1>Read the teammate invite path</h1><p>Change a note, remove a step, or export this isolated sample.</p></div><div class="demo-tools"><button id="export-markdown" class="button primary" type="button">Export Markdown</button><button id="export-json" class="button secondary" type="button">Export JSON</button></div></header>
    <section class="flow-sheet" aria-label="Invite a teammate flow"><div class="sheet-heading"><div><span>FLOW / 05</span><h2>${escapeHtml(demoFlow.title)}</h2></div><p>${demoFlow.steps.length} steps</p></div><ol id="demo-steps">${steps}</ol></section>
    <div class="undo-bar" id="undo-bar" hidden><span>Step removed.</span><button id="undo-remove" type="button">Undo</button></div>
    <dialog id="note-dialog"><form method="dialog"><h2>Edit step note</h2><label for="step-note">Note</label><textarea id="step-note" rows="4" maxlength="280"></textarea><input id="note-step-id" type="hidden"><div><button value="cancel" type="submit">Cancel</button><button id="save-note" class="primary" value="default" type="submit">Save note</button></div></form></dialog>
    <p id="demo-announcement" class="sr-only" aria-live="polite"></p>
  </main>`;
}

function privacy(): string {
  return `<main id="main" class="prose"><p class="kicker">Policy</p><h1>Privacy without a cloud account</h1><p class="updated">Effective 28 August 2026</p><h2>What the extension stores</h2><p>App Flow Reader stores flow titles, action labels, page addresses, notes, and timestamps in Chrome local storage.</p><h2>What it does not collect</h2><p>The extension does not collect screenshots, passwords, form values, analytics, or advertising identifiers.</p><h2>Where data goes</h2><p>Flow data stays in your browser unless you export a file and choose to share it. The website demo keeps its sample only in memory.</p><h2>Permissions</h2><p>Storage saves your current flow. Active tab reads the current page title and address when you start. Page access records labeled clicks and address changes while recording.</p><h2>Delete your data</h2><p>Select Clear flow in the extension. Removing the extension also removes its local data.</p><h2>Questions</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p></main>`;
}

function terms(): string {
  return `<main id="main" class="prose"><p class="kicker">Terms</p><h1>Terms for using App Flow Reader</h1><p class="updated">Effective 28 August 2026</p><h2>Use of the extension</h2><p>You may use App Flow Reader to document browser tasks you are allowed to access. You are responsible for reviewing exported files before sharing them.</p><h2>No warranty</h2><p>The software is provided as is, without warranties. Keep a copy of any flow you need to retain.</p><h2>Acceptable use</h2><p>Do not use the extension to collect private information from other people or to bypass access controls.</p><h2>Changes</h2><p>Future versions may change these terms. The effective date above identifies this version.</p><h2>Contact</h2><p>Email <a href="mailto:support@sociobot.in">support@sociobot.in</a>.</p></main>`;
}

function notFound(): string {
  return `<main id="main" class="not-found"><div class="lost-line" aria-hidden="true"><span>?</span></div><p class="kicker">404 / Path not recorded</p><h1>This step is not in the flow</h1><p>The address may have changed. Return to the first step.</p><a class="button primary" href="/" data-route>Return home</a></main>`;
}

function footer(): string {
  return `<footer class="site-footer"><div><a class="footer-mark" href="/" data-route>App Flow Reader</a><p>Turn browser tasks into readable steps.</p></div><nav aria-label="Footer navigation"><a href="/privacy" data-route>Privacy</a><a href="/terms" data-route>Terms</a><a href="https://hello-factory.sociobot.in" target="_blank" rel="noreferrer" aria-label="Built by Param Factory (opens in a new tab)">Built by Param Factory <span aria-hidden="true">↗</span></a></nav><p class="build">Version 1.0.0 · build 2026.08</p></footer>`;
}

function bindSharedActions() {
  const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle');
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    document.querySelector('#site-nav')?.classList.toggle('open', !open);
  });
}

function bindDemoActions() {
  document.querySelector('#reset-demo')?.addEventListener('click', () => { demoFlow = structuredClone(sampleFlow); undoFlow = null; render(false); announce('Demo reset to five sample steps.'); });
  document.querySelector('#export-markdown')?.addEventListener('click', () => download(fileName(demoFlow, 'md'), toMarkdown(demoFlow), 'text/markdown'));
  document.querySelector('#export-json')?.addEventListener('click', () => download(fileName(demoFlow, 'json'), toJson(demoFlow), 'application/json'));
  document.querySelectorAll<HTMLButtonElement>('.remove-step').forEach((button) => button.addEventListener('click', () => {
    const id = button.closest<HTMLElement>('[data-step-id]')!.dataset.stepId!;
    undoFlow = structuredClone(demoFlow);
    demoFlow = removeStep(demoFlow, id);
    render(false);
    const undo = document.querySelector<HTMLElement>('#undo-bar');
    if (undo) undo.hidden = false;
    announce('Step removed. You can undo this change.');
  }));
  document.querySelector('#undo-remove')?.addEventListener('click', () => { if (undoFlow) demoFlow = undoFlow; undoFlow = null; render(false); announce('Step restored.'); });
  document.querySelectorAll<HTMLButtonElement>('.edit-note').forEach((button) => button.addEventListener('click', () => {
    const id = button.closest<HTMLElement>('[data-step-id]')!.dataset.stepId!;
    const dialog = document.querySelector<HTMLDialogElement>('#note-dialog')!;
    (document.querySelector('#step-note') as HTMLTextAreaElement).value = demoFlow.steps.find((step) => step.id === id)?.note ?? '';
    (document.querySelector('#note-step-id') as HTMLInputElement).value = id;
    dialog.showModal();
    (document.querySelector('#step-note') as HTMLTextAreaElement).focus();
  }));
  document.querySelector('#save-note')?.addEventListener('click', () => {
    const note = (document.querySelector('#step-note') as HTMLTextAreaElement).value;
    const id = (document.querySelector('#note-step-id') as HTMLInputElement).value;
    demoFlow = updateStepNote(demoFlow, id, note);
    setTimeout(() => { render(false); announce('Step note saved.'); }, 0);
  });
}

function currentRoute(): Route {
  if (location.pathname === '/') return '/';
  if (location.pathname === '/demo') return '/demo';
  if (location.pathname === '/privacy') return '/privacy';
  if (location.pathname === '/terms') return '/terms';
  return '/not-found';
}

function setMetadata(route: Route) {
  const values: Record<Route, [string, string]> = {
    '/': ['App Flow Reader — Record browser tasks as steps', 'Record clicks and page changes as a clear app flow.'],
    '/demo': ['Demo — App Flow Reader', 'Try a five-step app flow with isolated sample data.'],
    '/privacy': ['Privacy — App Flow Reader', 'How App Flow Reader keeps flow data in your browser.'],
    '/terms': ['Terms — App Flow Reader', 'Terms for using the App Flow Reader browser extension.'],
    '/not-found': ['Page not found — App Flow Reader', 'Return to App Flow Reader.'],
  };
  document.title = values[route][0];
  document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = values[route][1];
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = `https://app-flow-reader.sociobot.in${route === '/not-found' ? location.pathname : route}`;
}

function download(name: string, contents: string, type: string) {
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(new Blob([contents], { type }));
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(anchor.href), 0);
  announce(`${name} downloaded.`);
}

function announce(message: string) {
  const region = document.querySelector('#demo-announcement') ?? routeStatus;
  region.textContent = message;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!);
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) addEventListener('load', () => void navigator.serviceWorker.register('/sw.js'));
}
