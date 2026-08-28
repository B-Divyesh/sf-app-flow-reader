import {
  appendStep,
  createFlow,
  createStep,
  EMPTY_STATE,
  MAX_ROUTE_STEPS,
  MIN_ROUTE_STEPS,
  normalizeState,
  STORAGE_KEY,
  updateStepNote,
  upsertRoute,
  type RecorderState,
} from '../lib/flow';

let mutationQueue: Promise<unknown> = Promise.resolve();
let lastContentTabId: number | undefined;

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(() => { void enqueue(async () => save(await getState())); });

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === 'afr:get-state') {
      getState().then(sendResponse);
      return true;
    }
    if (message?.type === 'afr:start') {
      respond(sendResponse, async () => {
        const flow = createFlow(message.title, message.url);
        const current = await getState();
        return save({ ...current, active: true, flow, routes: current.routes, playback: null });
      });
      return true;
    }
    if (message?.type === 'afr:stop') {
      respond(sendResponse, async () => save({ ...(await getState()), active: false }));
      return true;
    }
    if (message?.type === 'afr:resume') {
      respond(sendResponse, async () => {
        const state = await getState();
        return save({ ...state, active: Boolean(state.flow && state.flow.steps.length < MAX_ROUTE_STEPS), playback: null });
      });
      return true;
    }
    if (message?.type === 'afr:clear') {
      respond(sendResponse, async () => {
        const state = await getState();
        const routes = state.flow ? state.routes.filter((route) => route.id !== state.flow?.id) : state.routes;
        return save({ ...EMPTY_STATE, routes });
      });
      return true;
    }
    if (message?.type === 'afr:select-route') {
      respond(sendResponse, async () => {
        const state = await getState();
        const flow = state.routes.find((route) => route.id === message.id) ?? state.flow;
        return save({ ...state, active: false, flow, playback: null });
      });
      return true;
    }
    if (message?.type === 'afr:step') {
      if (sender.tab?.id !== undefined) lastContentTabId = sender.tab.id;
      respond(sendResponse, async () => {
        const state = await getState();
        if (!state.active || !state.flow) return state;
        const flow = appendStep(state.flow, createStep(message.kind, message.label, message.url, new Date(), message.anchor));
        return save({
          ...state,
          active: flow.steps.length < MAX_ROUTE_STEPS,
          flow,
          routes: flow.steps.length >= MIN_ROUTE_STEPS ? upsertRoute(state.routes, flow) : state.routes,
        });
      });
      return true;
    }
    if (message?.type === 'afr:note') {
      respond(sendResponse, async () => {
        const state = await getState();
        if (!state.flow) return state;
        const flow = updateStepNote(state.flow, message.id, message.note);
        return save({ ...state, flow, routes: state.routes.some((route) => route.id === flow.id) ? upsertRoute(state.routes, flow) : state.routes });
      });
      return true;
    }
    if (message?.type === 'afr:follow') {
      respond(sendResponse, async () => {
        const state = await getState();
        const flow = state.routes.find((route) => route.id === message.id) ?? state.flow;
        if (!flow || flow.steps.length < MIN_ROUTE_STEPS) return state;
        const next = await save({ ...state, active: false, flow, playback: { routeId: flow.id, index: 0 } });
        await showPlayback(next, message.tabId ?? sender.tab?.id);
        return next;
      });
      return true;
    }
    if (message?.type === 'afr:playback-move') {
      respond(sendResponse, async () => {
        const state = await getState();
        if (!state.playback) return state;
        const flow = state.routes.find((route) => route.id === state.playback?.routeId);
        if (!flow) return save({ ...state, playback: null });
        const index = Math.max(0, Math.min(flow.steps.length - 1, state.playback.index + Number(message.delta ?? 0)));
        const next = await save({ ...state, flow, playback: { ...state.playback, index } });
        await showPlayback(next, message.tabId ?? sender.tab?.id);
        return next;
      });
      return true;
    }
    if (message?.type === 'afr:stop-following') {
      respond(sendResponse, async () => {
        const next = await save({ ...(await getState()), playback: null });
        await hidePlayback(sender.tab?.id);
        return next;
      });
      return true;
    }
    return false;
  });
});

function respond(sendResponse: (response?: unknown) => void, operation: () => Promise<RecorderState>) {
  enqueue(operation).then(sendResponse).catch((error) => sendResponse({ error: error instanceof Error ? error.message : String(error) }));
}

function enqueue<T>(operation: () => Promise<T>): Promise<T> {
  const result = mutationQueue.then(operation, operation);
  mutationQueue = result.then(() => undefined, () => undefined);
  return result;
}

async function getState(): Promise<RecorderState> {
  const stored = await browser.storage.local.get(STORAGE_KEY) as Record<string, Partial<RecorderState>>;
  return normalizeState(stored[STORAGE_KEY]);
}

async function save(state: RecorderState): Promise<RecorderState> {
  await browser.storage.local.set({ [STORAGE_KEY]: state });
  return state;
}

async function activeTabId(): Promise<number | undefined> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  return tab?.id;
}

async function showPlayback(state: RecorderState, preferredTab?: number) {
  const flow = state.routes.find((route) => route.id === state.playback?.routeId);
  const step = flow?.steps[state.playback?.index ?? -1];
  const tabId = preferredTab ?? lastContentTabId ?? await activeTabId();
  if (!flow || !step || tabId === undefined) return;
  await browser.tabs.sendMessage(tabId, {
    type: 'afr:show-step',
    title: flow.title,
    step,
    index: state.playback!.index,
    count: flow.steps.length,
  }).catch(() => undefined);
}

async function hidePlayback(preferredTab?: number) {
  const tabId = preferredTab ?? lastContentTabId ?? await activeTabId();
  if (tabId !== undefined) await browser.tabs.sendMessage(tabId, { type: 'afr:hide-step' }).catch(() => undefined);
}
