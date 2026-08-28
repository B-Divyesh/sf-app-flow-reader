import { anchorFor, isSensitiveTarget, readableTarget, type FlowStep } from '../lib/flow';

export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  main() {
    let previousUrl = location.href;
    let highlighted: HTMLElement | null = null;
    let previousOutline = '';
    let readerHost: HTMLElement | null = null;

    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element
        ? event.target.closest('button, a, input, select, textarea, [role="button"], [role="link"]')
        : null;
      if (!target || target.closest('[data-app-flow-reader-ignore]') || isSensitiveTarget(target)) return;
      void browser.runtime.sendMessage({
        type: 'afr:step',
        kind: 'click',
        label: readableTarget(target),
        anchor: anchorFor(target),
        url: location.href,
      });
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

    browser.runtime.onMessage.addListener((message) => {
      if (message?.type === 'afr:show-step') showStep(message.step, message.title, message.index, message.count);
      if (message?.type === 'afr:hide-step') clearReader();
    });

    function showStep(step: FlowStep, title: string, index: number, count: number) {
      clearHighlight();
      let anchor: HTMLElement | null = null;
      if (step.anchor) {
        try { anchor = document.querySelector<HTMLElement>(step.anchor); } catch { anchor = null; }
      }
      if (anchor && isVisible(anchor)) {
        highlighted = anchor;
        previousOutline = anchor.style.outline;
        anchor.style.outline = '4px solid #ff6b35';
        anchor.style.outlineOffset = '5px';
        anchor.scrollIntoView({ block: 'center', inline: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }

      if (!readerHost) {
        readerHost = document.createElement('aside');
        readerHost.dataset.appFlowReaderIgnore = 'true';
        readerHost.setAttribute('aria-label', 'App Flow Reader controls');
        readerHost.style.cssText = 'position:fixed;z-index:2147483647;left:16px;right:16px;bottom:16px;max-width:720px;margin:auto;color:#fff;background:#101923;border:3px solid #ff9a76;box-shadow:6px 6px 0 #000;padding:18px;font:700 18px/1.4 system-ui,sans-serif;';
        document.documentElement.append(readerHost);
      }
      readerHost.replaceChildren();
      const status = document.createElement('p');
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'assertive');
      status.style.cssText = 'margin:0 0 6px;color:#ffd0bf;font-size:14px;';
      status.textContent = `${title}. Step ${index + 1} of ${count}. ${anchor ? 'Target highlighted.' : 'Target is not visible on this page.'}`;
      const instruction = document.createElement('p');
      instruction.style.cssText = 'margin:0 0 14px;font:700 22px/1.3 Georgia,serif;';
      instruction.textContent = step.label;
      const controls = document.createElement('div');
      controls.style.cssText = 'display:flex;flex-wrap:wrap;gap:12px;';
      controls.append(
        readerButton('Back', index === 0, () => move(-1)),
        readerButton('Next', index === count - 1, () => move(1)),
        readerButton('Stop following', false, () => void browser.runtime.sendMessage({ type: 'afr:stop-following' })),
      );
      readerHost.append(status, instruction, controls);
    }

    function readerButton(label: string, disabled: boolean, action: () => void): HTMLButtonElement {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.disabled = disabled;
      button.style.cssText = 'min-width:112px;min-height:48px;padding:10px 18px;color:#101923;background:#fff7e8;border:2px solid #fff;font:800 17px system-ui,sans-serif;cursor:pointer;';
      button.addEventListener('click', action);
      return button;
    }

    function move(delta: number) { void browser.runtime.sendMessage({ type: 'afr:playback-move', delta }); }
    function isVisible(element: HTMLElement) {
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return box.width > 0 && box.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    }
    function clearHighlight() {
      if (highlighted) {
        highlighted.style.outline = previousOutline;
        highlighted.style.outlineOffset = '';
      }
      highlighted = null;
    }
    function clearReader() {
      clearHighlight();
      readerHost?.remove();
      readerHost = null;
    }
  },
});
