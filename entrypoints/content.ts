import { readableTarget } from '../lib/flow';

export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  main() {
    let previousUrl = location.href;

    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target.closest('button, a, input, select, textarea, [role="button"], [role="link"]') : null;
      if (!target || target.closest('[data-app-flow-reader-ignore]')) return;
      void browser.runtime.sendMessage({ type: 'afr:step', kind: 'click', label: readableTarget(target), url: location.href });
    }, { capture: true });

    const reportNavigation = () => {
      if (location.href === previousUrl) return;
      previousUrl = location.href;
      void browser.runtime.sendMessage({ type: 'afr:step', kind: 'navigate', label: document.title || 'Opened a page', url: location.href });
    };

    addEventListener('popstate', reportNavigation);
    addEventListener('hashchange', reportNavigation);
    const observer = new MutationObserver(reportNavigation);
    observer.observe(document.documentElement, { childList: true, subtree: true });
  },
});
