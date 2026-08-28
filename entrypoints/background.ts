import { appendStep, createFlow, createStep, STORAGE_KEY, updateStepNote, type RecorderState } from '../lib/flow';

const EMPTY_STATE: RecorderState = { active: false, flow: null };

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(() => {
    browser.storage.local.get(STORAGE_KEY).then((stored) => {
      if (!stored[STORAGE_KEY]) return browser.storage.local.set({ [STORAGE_KEY]: EMPTY_STATE });
    });
  });

  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === 'afr:get-state') {
      getState().then(sendResponse);
      return true;
    }
    if (message?.type === 'afr:start') {
      const flow = createFlow(message.title, message.url);
      setState({ active: true, flow }).then(() => sendResponse({ active: true, flow }));
      return true;
    }
    if (message?.type === 'afr:stop') {
      getState().then((state) => setState({ ...state, active: false })).then(getState).then(sendResponse);
      return true;
    }
    if (message?.type === 'afr:resume') {
      getState().then((state) => setState({ ...state, active: Boolean(state.flow) })).then(getState).then(sendResponse);
      return true;
    }
    if (message?.type === 'afr:clear') {
      setState(EMPTY_STATE).then(() => sendResponse(EMPTY_STATE));
      return true;
    }
    if (message?.type === 'afr:step') {
      getState().then(async (state) => {
        if (!state.active || !state.flow) return state;
        const next = { ...state, flow: appendStep(state.flow, createStep(message.kind, message.label, message.url)) };
        await setState(next);
        return next;
      }).then(sendResponse);
      return true;
    }
    if (message?.type === 'afr:note') {
      getState().then(async (state) => {
        if (!state.flow) return state;
        const next = { ...state, flow: updateStepNote(state.flow, message.id, message.note) };
        await setState(next);
        return next;
      }).then(sendResponse);
      return true;
    }
    return false;
  });
});

async function getState(): Promise<RecorderState> {
  const stored = await browser.storage.local.get(STORAGE_KEY) as Record<string, RecorderState>;
  return stored[STORAGE_KEY] ?? EMPTY_STATE;
}

async function setState(state: RecorderState): Promise<void> {
  await browser.storage.local.set({ [STORAGE_KEY]: state });
}
