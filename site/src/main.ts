import './styles.css';
import { fileName, removeStep, toJson, toMarkdown, updateStepNote, type Flow } from '../../lib/flow';
import { sampleFlow } from '../../lib/sample';

type Route = '/' | '/demo' | '/privacy' | '/terms' | '/not-found';

const app = document.querySelector<HTMLDivElement>('#app')!;
const routeStatus = document.querySelector<HTMLDivElement>('#route-status')!;
let demoFlow: Flow = structuredClone(sampleFlow);
let undoFlow: Flow | null = null;
let demoIndex = 0;
let renderedRoute: Route | null = null;
const LICENSE_KEY = 'app-flow-reader:returned-license';

captureReturnedLicense();
render(false);
registerServiceWorker();

addEventListener('popstate', () => render(true));
document.addEventListener('click', (event) => {
  const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-route]') : null;
  if (!link || link.origin !== location.origin) return;
  event.preventDefault();
  history.pushState({}, '', `${link.pathname}${link.search}${link.hash}`);
  render(true);
});

function render(focusHeading: boolean) {
  const route = currentRoute();
  if (renderedRoute === '/demo' && route !== '/demo') resetDemo();
  if (route === '/demo' && renderedRoute !== '/demo') resetDemo();
  renderedRoute = route;
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
      <a href="/?demo=1" data-route ${route === '/demo' ? 'aria-current="page"' : ''}>Demo</a>
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
        <p class="kicker">Browser extension for progressive low vision</p>
        <h1 id="hero-title">Follow saved routes through dense workplace apps</h1>
        <p class="lede">For people with progressive low vision who need one reliable path through dense workplace apps.</p>
        <div class="hero-actions">
          <a class="button primary" href="/?demo=1" data-route>Try it with sample data</a>
          <span>Follow a five-step expense route.</span>
        </div>
        <ul class="plain-facts" aria-label="Product facts">
          <li><strong>Private</strong><span>Routes stay on this device.</span></li>
          <li><strong>Offline</strong><span>The sample reader works after its first visit.</span></li>
          <li><strong>Free</strong><span>Reader and exports are free; covers cost $12 once.</span></li>
        </ul>
      </div>
      <div class="hero-map" aria-label="Illustration of a five-step expense route">
        <div class="paper-tab">ROUTE 05</div>
        <ol>
          <li><span>01</span><p>Open Expenses</p></li>
          <li><span>02</span><p>New report</p></li>
          <li><span>03</span><p>Monthly expenses</p></li>
          <li><span>04</span><p>Review report</p></li>
          <li><span>05</span><p>Send to manager</p></li>
        </ol>
      </div>
    </section>

    <section class="product-preview" aria-labelledby="preview-title">
      <div class="section-label"><span>01</span><p>Live preview</p></div>
      <div class="preview-copy"><h2 id="preview-title">Hear the current step and find its control</h2><p>The reader announces one instruction, outlines the matching page control, and waits for you.</p></div>
      <div class="browser-frame" aria-label="Example extension view">
        <div class="browser-bar"><span></span><span></span><span></span><p>northstar.example/team</p></div>
        <div class="mini-flow">
          <p class="eyebrow">Current route</p><h3>Submit monthly expenses</h3>
          <ol><li><b>1</b><span>Open Expenses<small>Start</small></span></li><li><b>2</b><span>Choose New report<small>Find</small></span></li><li><b>3</b><span>Select Monthly expenses<small>Find</small></span></li></ol>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="how" aria-labelledby="how-title">
      <div class="section-label"><span>02</span><p>How it works</p></div>
      <h2 id="how-title">Record once, then follow at your pace</h2>
      <ol class="how-list">
        <li><span>1</span><div><h3>Save a route</h3><p>Name the task, then record between three and ten steps.</p></div></li>
        <li><span>2</span><div><h3>Choose the route</h3><p>Your named routes stay together in the extension.</p></div></li>
        <li><span>3</span><div><h3>Follow each step</h3><p>Use large Back and Next controls while the page target stays outlined.</p></div></li>
      </ol>
    </section>

    <section class="boundaries" aria-labelledby="boundaries-title">
      <div><p class="kicker">Clear boundaries</p><h2 id="boundaries-title">It reads the route, not your private fields</h2></div>
      <ul><li>Password controls are ignored completely.</li><li>No screenshots or typed field values are stored.</li><li>Browser settings pages cannot be read.</li></ul>
    </section>

    <section class="supporter" aria-labelledby="supporter-title">
      <p class="kicker">Optional supporter license</p>
      <h2 id="supporter-title">Add notebook cover styles for $12 once</h2>
      <p>The route reader, exports, and every accessibility feature remain free. A supporter license adds three decorative cover styles in the extension.</p>
      <p>After checkout, an installed extension restores the returned token. You can also paste it into Supporter styles.</p>
      <a class="button secondary" href="https://api.sociobot.in/api/v1/products/app-flow-reader/checkout">Buy supporter license</a>
      ${returnedLicenseNotice()}
    </section>

    <section class="install" aria-labelledby="install-title">
      <p class="kicker">Use in Chrome, Edge, Brave, and similar browsers</p>
      <h2 id="install-title">Keep the route reader in your toolbar</h2>
      <p>Download the package, unzip it, then load the folder from the browser extensions page.</p>
      <a class="button primary" href="/downloads/app-flow-reader-chrome.zip" download>Download extension</a>
      <details><summary>Install from the downloaded folder</summary><ol><li>Open your browser’s extensions page.</li><li>Turn on the page’s <strong>Developer mode</strong> setting.</li><li>Choose <strong>Load unpacked</strong>, then choose the unzipped folder.</li></ol></details>
    </section>
  </main>`;
}

function demo(): string {
  const steps = demoFlow.steps.map((step, index) => `<li class="demo-step ${index === demoIndex ? 'current' : ''}" data-step-id="${step.id}" ${index === demoIndex ? 'aria-current="step"' : ''}>
    <span class="demo-number">${String(index + 1).padStart(2, '0')}</span>
    <div class="demo-step-copy"><span class="step-kind">${step.kind === 'navigate' ? 'Page change' : step.kind === 'start' ? 'Start' : 'Click'}</span><h2>${escapeHtml(step.label)}</h2><p class="step-url">${escapeHtml(new URL(step.url).pathname + new URL(step.url).search)}</p>${step.note ? `<p class="note">${escapeHtml(step.note)}</p>` : ''}</div>
    <div class="step-actions"><button class="icon-button edit-note" type="button" aria-label="Edit note for ${escapeHtml(step.label)}">Edit note</button><button class="icon-button remove-step" type="button" aria-label="Remove ${escapeHtml(step.label)}">Remove</button></div>
  </li>`).join('');
  return `<div class="demo-banner" role="status"><strong>Demo</strong><span>Sample data. Nothing is saved.</span><button id="reset-demo" type="button">Reset demo</button><a href="/" data-route>Leave demo</a></div>
  <main id="main" class="demo-main">
    <header class="demo-heading"><div><p class="kicker">Sample route</p><h1>Follow the monthly expense route</h1><p>Use Back and Next to hear one step at a time. The current step has a thick outline.</p></div><div class="demo-tools"><button id="export-markdown" class="button primary" type="button">Export Markdown</button><button id="export-json" class="button secondary" type="button">Export JSON</button></div></header>
    <section class="demo-reader" aria-labelledby="reader-step"><p id="reader-position">Step ${demoIndex + 1} of ${demoFlow.steps.length}</p><h2 id="reader-step">${escapeHtml(demoFlow.steps[demoIndex]?.label ?? 'Route complete')}</h2><p>${escapeHtml(demoFlow.steps[demoIndex]?.note ?? 'Complete this action, then choose Next.')}</p><div><button id="demo-back" type="button" ${demoIndex === 0 ? 'disabled' : ''}>Back</button><button id="demo-next" class="primary" type="button" ${demoIndex >= demoFlow.steps.length - 1 ? 'disabled' : ''}>Next</button></div></section>
    <section class="flow-sheet" aria-label="Monthly expense route"><div class="sheet-heading"><div><span>ROUTE / 05</span><h2>${escapeHtml(demoFlow.title)}</h2></div><p>${demoFlow.steps.length} steps</p></div><ol id="demo-steps">${steps}</ol></section>
    <div class="undo-bar" id="undo-bar" hidden><span>Step removed.</span><button id="undo-remove" type="button">Undo</button></div>
    <dialog id="note-dialog"><form method="dialog"><h2>Edit step note</h2><label for="step-note">Note</label><textarea id="step-note" rows="4" maxlength="280"></textarea><input id="note-step-id" type="hidden"><div><button value="cancel" type="submit">Cancel</button><button id="save-note" class="primary" value="default" type="submit">Save note</button></div></form></dialog>
    <p id="demo-announcement" class="sr-only" aria-live="polite"></p>
  </main>`;
}

function privacy(): string {
  return `<main id="main" class="prose"><p class="kicker">Policy</p><h1>Privacy without a cloud account</h1><p class="updated">Effective 28 August 2026</p><h2>What the extension stores</h2><p>App Flow Reader stores route names, action labels, page addresses, notes, and timestamps on this device.</p><h2>What it does not collect</h2><p>The extension ignores password controls. It does not store screenshots or typed field values.</p><h2>Where route data goes</h2><p>Route data stays in your browser unless you export and share a file. The demo keeps changes only in memory.</p><h2>Supporter license checks</h2><p>The extension makes no background network request until you restore a supporter token. It then contacts only api.sociobot.in to check that token.</p><h2>Delete your data</h2><p>Select Delete route in the extension to remove that saved route.</p><h2>Questions</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p></main>`;
}

function terms(): string {
  return `<main id="main" class="prose"><p class="kicker">Terms</p><h1>Terms for using App Flow Reader</h1><p class="updated">Effective 28 August 2026</p><h2>Use of the extension</h2><p>You may use App Flow Reader for browser tasks you are allowed to access. Review exported files before sharing them.</p><h2>Free reader</h2><p>The route reader, exports, and accessibility features are free. They do not require a supporter license.</p><h2>Supporter purchase</h2><p>The $12 supporter license is a one-time purchase for three decorative cover styles in the extension. Restore the returned token in the extension.</p><h2>No warranty</h2><p>The software is provided as is, without warranties. Keep a copy of any route you need to retain.</p><h2>Acceptable use</h2><p>Do not use the extension to collect private information from other people or to bypass access controls.</p><h2>Contact</h2><p>Email <a href="mailto:support@sociobot.in">support@sociobot.in</a>.</p></main>`;
}

function notFound(): string {
  return `<main id="main" class="not-found"><div class="lost-line" aria-hidden="true"><span>?</span></div><p class="kicker">404 / Path not recorded</p><h1>This step is not in the flow</h1><p>The address may have changed. Return to the first step.</p><a class="button primary" href="/" data-route>Return home</a></main>`;
}

function footer(): string {
  return `<footer class="site-footer"><div><a class="footer-mark" href="/" data-route>App Flow Reader</a><p>Follow saved routes through dense workplace apps.</p></div><nav aria-label="Footer navigation"><a href="/privacy" data-route>Privacy</a><a href="/terms" data-route>Terms</a><a href="https://hello-factory.sociobot.in" target="_blank" rel="noreferrer" aria-label="Built by Param Factory (opens in a new tab)">Built by Param Factory <span aria-hidden="true">↗</span></a></nav><p class="build">Version 1.1.0 · build 2026.08.29</p></footer>`;
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
  document.querySelector('#reset-demo')?.addEventListener('click', () => { resetDemo(); render(false); announce('Demo reset to five sample steps.'); });
  document.querySelector('#demo-back')?.addEventListener('click', () => { demoIndex = Math.max(0, demoIndex - 1); render(false); announce(`Step ${demoIndex + 1} of ${demoFlow.steps.length}. ${demoFlow.steps[demoIndex]?.label}`); focusDemoStep(); });
  document.querySelector('#demo-next')?.addEventListener('click', () => { demoIndex = Math.min(demoFlow.steps.length - 1, demoIndex + 1); render(false); announce(`Step ${demoIndex + 1} of ${demoFlow.steps.length}. ${demoFlow.steps[demoIndex]?.label}`); focusDemoStep(); });
  document.querySelector('#export-markdown')?.addEventListener('click', () => download(fileName(demoFlow, 'md'), toMarkdown(demoFlow), 'text/markdown'));
  document.querySelector('#export-json')?.addEventListener('click', () => download(fileName(demoFlow, 'json'), toJson(demoFlow), 'application/json'));
  document.querySelectorAll<HTMLButtonElement>('.remove-step').forEach((button) => button.addEventListener('click', () => {
    const id = button.closest<HTMLElement>('[data-step-id]')!.dataset.stepId!;
    undoFlow = structuredClone(demoFlow);
    demoFlow = removeStep(demoFlow, id);
    demoIndex = Math.min(demoIndex, Math.max(0, demoFlow.steps.length - 1));
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
  if (location.pathname === '/' && new URLSearchParams(location.search).get('demo') === '1') return '/demo';
  if (location.pathname === '/') return '/';
  if (location.pathname === '/demo') return '/demo';
  if (location.pathname === '/privacy') return '/privacy';
  if (location.pathname === '/terms') return '/terms';
  return '/not-found';
}

function setMetadata(route: Route) {
  const values: Record<Route, [string, string]> = {
    '/': ['App Flow Reader — Follow routes in workplace apps', 'Save and follow clear routes through dense workplace apps.'],
    '/demo': ['Demo — App Flow Reader', 'Follow a five-step expense route with isolated sample data.'],
    '/privacy': ['Privacy — App Flow Reader', 'How App Flow Reader keeps flow data in your browser.'],
    '/terms': ['Terms — App Flow Reader', 'Terms for using the App Flow Reader browser extension.'],
    '/not-found': ['Page not found — App Flow Reader', 'Return to App Flow Reader.'],
  };
  document.title = values[route][0];
  const canonicalPath = route === '/not-found' ? location.pathname : route;
  const url = `https://app-flow-reader.sociobot.in${canonicalPath}`;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = values[route][1];
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = url;
  setMeta('meta[property="og:title"]', values[route][0]);
  setMeta('meta[property="og:description"]', values[route][1]);
  setMeta('meta[property="og:url"]', url);
  setMeta('meta[name="twitter:title"]', values[route][0]);
  setMeta('meta[name="twitter:description"]', values[route][1]);
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

function focusDemoStep() {
  requestAnimationFrame(() => document.querySelector<HTMLElement>('.demo-step.current')?.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
}

function captureReturnedLicense() {
  const params = new URLSearchParams(location.search);
  const token = params.get('license');
  if (!token) return;
  sessionStorage.setItem(LICENSE_KEY, token);
  params.delete('license');
  history.replaceState({}, '', `${location.pathname}${params.size ? `?${params}` : ''}${location.hash}`);
}

function returnedLicenseNotice(): string {
  const token = sessionStorage.getItem(LICENSE_KEY);
  return token ? `<p class="returned-license" data-app-flow-reader-license-return="${escapeHtml(token)}" role="status">Purchase complete. Your installed extension restores this token now. You can also copy it into Supporter styles: <code>${escapeHtml(token)}</code></p>` : '';
}

function resetDemo() {
  demoFlow = structuredClone(sampleFlow);
  undoFlow = null;
  demoIndex = 0;
}

function setMeta(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)!.content = content;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!);
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) addEventListener('load', () => void navigator.serviceWorker.register('/sw.js'));
}
