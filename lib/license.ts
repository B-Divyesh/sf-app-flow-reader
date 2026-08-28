export const LICENSE_KEY = 'app-flow-reader:license';
export const COVER_KEY = 'app-flow-reader:cover';
export const LICENSE_CHECK_INTERVAL = 86_400_000;
export const COVER_STYLES = ['blueprint', 'graphite', 'sunrise'] as const;

export type CoverStyle = typeof COVER_STYLES[number];
export interface LicenseRecord {
  token: string;
  valid: boolean;
  checkedAt: number;
  reason?: string;
}

export function isCoverStyle(value: unknown): value is CoverStyle {
  return typeof value === 'string' && (COVER_STYLES as readonly string[]).includes(value);
}
