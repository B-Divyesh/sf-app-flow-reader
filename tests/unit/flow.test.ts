import { describe, expect, it, vi } from 'vitest';
import { appendStep, cleanText, createFlow, createStep, fileName, removeStep, toJson, toMarkdown, updateStepNote } from '../../lib/flow';

describe('flow document', () => {
  it('starts a flow and keeps ordered, distinct steps', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const start = new Date('2026-08-28T10:00:00.000Z');
    let flow = createFlow('  Invite   a teammate  ', 'https://example.test/team', start);
    const click = createStep('click', ' Invite ', 'https://example.test/team', new Date('2026-08-28T10:00:02.000Z'));
    flow = appendStep(flow, click);
    flow = appendStep(flow, click);
    expect(flow.title).toBe('Invite a teammate');
    expect(flow.steps.map((step) => step.label)).toEqual(['Started recording', 'Invite']);
  });

  it('edits, removes, and serializes steps without executable markup', () => {
    const flow = createFlow('Checkout *path*', 'https://example.test/cart', new Date('2026-08-28T10:00:00.000Z'));
    const edited = updateStepNote(flow, flow.steps[0]!.id, 'Check [role]');
    expect(toMarkdown(edited)).toContain('# Checkout \\*path\\*');
    expect(toMarkdown(edited)).toContain('Check \\[role\\]');
    expect(JSON.parse(toJson(edited)).steps).toHaveLength(1);
    expect(removeStep(edited, flow.steps[0]!.id).steps).toHaveLength(0);
    expect(fileName(edited, 'md')).toBe('checkout-path.md');
  });

  it('bounds captured labels and rejects privileged URLs', () => {
    expect(cleanText(`  ${'word '.repeat(50)}`, 20)).toHaveLength(20);
    const step = createStep('click', 'Settings', 'chrome://settings');
    expect(step.url).toBe('');
  });
});
