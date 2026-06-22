export interface FluidParams {
  colorR: number;
  colorG: number;
  colorB: number;
  ambientCount: number;
  ambientSize: number;
  ambientDye: number;
  windStrength: number;
  windScale: number;
  windHold: number;
  windMorph: number;
  vorticity: number;
  velocityDissipation: number;
  dyeDissipation: number;
  bloomAmt: number;
  bloomThreshold: number;
  bloomKnee: number;
  blackPoint: number;
  cursorForce: number;
  cursorSize: number;
}

export const defaults: FluidParams = {
  colorR: 0.44,
  colorG: 0.10,
  colorB: 0.06,
  ambientCount: 2,
  ambientSize: 0.68,
  ambientDye: 0.2,
  windStrength: 0.3,
  windScale: 1.23,
  windHold: 3.9,
  windMorph: 6.4,
  vorticity: 12,
  velocityDissipation: 0.18,
  dyeDissipation: 0.13,
  bloomAmt: 0.58,
  bloomThreshold: 0.2,
  bloomKnee: 0.12,
  blackPoint: 0.18,
  cursorForce: 3200,
  cursorSize: 1,
};

export const backupCurrent: FluidParams = { ...defaults };

export const state: FluidParams = { ...defaults };

export const limits: Record<keyof FluidParams, [number, number]> = {
  colorR: [0, 1],
  colorG: [0, 1],
  colorB: [0, 1],
  ambientCount: [1, 6],
  ambientSize: [0.4, 1.8],
  ambientDye: [0.2, 2],
  windStrength: [0, 8],
  windScale: [0.5, 3],
  windHold: [2, 20],
  windMorph: [0.5, 10],
  vorticity: [0, 16],
  velocityDissipation: [0.1, 0.8],
  dyeDissipation: [0.05, 0.5],
  bloomAmt: [0, 2],
  bloomThreshold: [0.05, 0.5],
  bloomKnee: [0.01, 0.4],
  blackPoint: [0, 0.2],
  cursorForce: [500, 6000],
  cursorSize: [0.4, 2.5],
};

const STORAGE_KEY = 'hpprc-fluid-params-v1';

function clamp(key: keyof FluidParams, value: number): number {
  const [min, max] = limits[key];
  const next = Math.min(max, Math.max(min, value));
  return key === 'ambientCount' ? Math.round(next) : next;
}

export function applyFluidParams(next: Partial<FluidParams>): void {
  for (const key of Object.keys(defaults) as Array<keyof FluidParams>) {
    const value = next[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      state[key] = clamp(key, value);
    }
  }
  Object.assign(backupCurrent, state);
  saveFluidParams();
}

export function resetFluidParams(): void {
  Object.assign(state, defaults);
  Object.assign(backupCurrent, state);
  saveFluidParams();
}

export function loadFluidParams(): void {
  Object.assign(state, defaults);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<Record<keyof FluidParams, unknown>>;
    for (const key of Object.keys(defaults) as Array<keyof FluidParams>) {
      const value = parsed[key];
      if (typeof value === 'number' && Number.isFinite(value)) {
        state[key] = clamp(key, value);
      }
    }
    Object.assign(backupCurrent, state);
  } catch {
    // fall back to defaults
  }
}

export function saveFluidParams(): void {
  try {
    Object.assign(backupCurrent, state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage failures
  }
}
