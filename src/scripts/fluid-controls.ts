import { defaults, limits, loadFluidParams, resetFluidParams, saveFluidParams, state, type FluidParams } from './fluid-state';

export type ControlItem = {
  key: keyof FluidParams;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  format: (value: number) => string;
};

export type ControlGroup = {
  title: string;
  items: ControlItem[];
};

const number2 = (value: number) => value.toFixed(2);
const number1 = (value: number) => value.toFixed(1);
const integer = (value: number) => `${Math.round(value)}`;
const seconds = (value: number) => `${value.toFixed(1)}s`;

export const controlGroups: ControlGroup[] = [
  {
    title: '色',
    items: [
      { key: 'colorR', label: '赤', min: 0, max: 1, step: 0.01, defaultValue: defaults.colorR, format: number2 },
      { key: 'colorG', label: '緑', min: 0, max: 1, step: 0.01, defaultValue: defaults.colorG, format: number2 },
      { key: 'colorB', label: '青', min: 0, max: 1, step: 0.01, defaultValue: defaults.colorB, format: number2 },
    ],
  },
  {
    title: '発生',
    items: [
      { key: 'ambientCount', label: '発生数', min: 1, max: 6, step: 1, defaultValue: defaults.ambientCount, format: integer },
      { key: 'ambientSize', label: '発生の広さ', min: limits.ambientSize[0], max: limits.ambientSize[1], step: 0.01, defaultValue: defaults.ambientSize, format: number2 },
      { key: 'ambientDye', label: '発生量', min: limits.ambientDye[0], max: limits.ambientDye[1], step: 0.01, defaultValue: defaults.ambientDye, format: number2 },
      { key: 'cursorSize', label: 'カーソルの大きさ', min: limits.cursorSize[0], max: limits.cursorSize[1], step: 0.01, defaultValue: defaults.cursorSize, format: number2 },
      { key: 'cursorForce', label: 'カーソルの強さ', min: limits.cursorForce[0], max: limits.cursorForce[1], step: 10, defaultValue: defaults.cursorForce, format: integer },
    ],
  },
  {
    title: '流れ',
    items: [
      { key: 'windStrength', label: '風の強さ', min: limits.windStrength[0], max: limits.windStrength[1], step: 0.01, defaultValue: defaults.windStrength, format: number2 },
      { key: 'windScale', label: '風の広がり', min: limits.windScale[0], max: limits.windScale[1], step: 0.01, defaultValue: defaults.windScale, format: number2 },
      { key: 'windHold', label: '更新間隔', min: limits.windHold[0], max: limits.windHold[1], step: 0.1, defaultValue: defaults.windHold, format: seconds },
      { key: 'windMorph', label: '遷移時間', min: limits.windMorph[0], max: limits.windMorph[1], step: 0.1, defaultValue: defaults.windMorph, format: seconds },
      { key: 'vorticity', label: '渦の強さ', min: limits.vorticity[0], max: limits.vorticity[1], step: 0.1, defaultValue: defaults.vorticity, format: number1 },
    ],
  },
  {
    title: '見え方',
    items: [
      { key: 'velocityDissipation', label: '速度の残り方', min: limits.velocityDissipation[0], max: limits.velocityDissipation[1], step: 0.01, defaultValue: defaults.velocityDissipation, format: number2 },
      { key: 'dyeDissipation', label: '煙の残り方', min: limits.dyeDissipation[0], max: limits.dyeDissipation[1], step: 0.01, defaultValue: defaults.dyeDissipation, format: number2 },
      { key: 'bloomAmt', label: '発光量', min: limits.bloomAmt[0], max: limits.bloomAmt[1], step: 0.01, defaultValue: defaults.bloomAmt, format: number2 },
      { key: 'bloomThreshold', label: '発光の閾値', min: limits.bloomThreshold[0], max: limits.bloomThreshold[1], step: 0.01, defaultValue: defaults.bloomThreshold, format: number2 },
      { key: 'bloomKnee', label: '発光のなだらかさ', min: limits.bloomKnee[0], max: limits.bloomKnee[1], step: 0.01, defaultValue: defaults.bloomKnee, format: number2 },
      { key: 'blackPoint', label: '黒の締まり', min: limits.blackPoint[0], max: limits.blackPoint[1], step: 0.005, defaultValue: defaults.blackPoint, format: number2 },
    ],
  },
];

function formatValue(key: keyof FluidParams, value: number): string {
  const item = controlGroups.flatMap((group) => group.items).find((entry) => entry.key === key);
  return item ? item.format(value) : String(value);
}

function syncInput(input: HTMLInputElement): void {
  const key = input.dataset.param as keyof FluidParams | undefined;
  if (!key) return;
  input.value = `${state[key]}`;
  const out = input.parentElement?.querySelector<HTMLOutputElement>(`output[data-output-for="${key}"]`);
  if (out) out.textContent = formatValue(key, state[key]);
}

export function mountFluidControls(root: HTMLElement | null): void {
  if (!root) return;
  loadFluidParams();

  const inputs = Array.from(root.querySelectorAll<HTMLInputElement>('input[data-param]'));
  const reset = root.querySelector<HTMLButtonElement>('[data-reset]');

  for (const input of inputs) {
    syncInput(input);
  }

  root.addEventListener('input', (event) => {
    const input = event.target instanceof HTMLInputElement ? event.target : null;
    if (!input || input.type !== 'range') return;
    const key = input.dataset.param as keyof FluidParams | undefined;
    if (!key) return;
    const raw = Number(input.value);
    state[key] = key === 'ambientCount' ? Math.round(raw) : raw;
    saveFluidParams();
    syncInput(input);
  });

  reset?.addEventListener('click', () => {
    resetFluidParams();
    for (const input of inputs) syncInput(input);
  });
}
