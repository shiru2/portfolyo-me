// boot.ts — tiny, ships for everyone. Gates + DEFERS the WebGL field as a
// separate code-split chunk. (The first-view reveal runs from a tiny inline
// script in Base.astro, so it never depends on this bundle loading.)
import { mountFluidControls } from './fluid-controls';
import { loadFluidParams } from './fluid-state';

loadFluidParams();
mountFluidControls(document.getElementById('fluid-controls'));

// ---- gated, deferred WebGL field ----
function gateAllows(): boolean {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 2) return false;
  try {
    const c = document.createElement('canvas');
    if (!(c.getContext('webgl2') || c.getContext('webgl'))) return false;
  } catch {
    return false;
  }
  return true;
}

function deferStart() {
  const canvas = document.getElementById('fluid') as HTMLCanvasElement | null;
  if (!canvas || !gateAllows()) return;
  const begin = () => import('./fluid').then((m) => m.start(canvas)).catch(() => {});
  const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void })
    .requestIdleCallback;
  if (ric) ric(begin, { timeout: 1200 });
  else setTimeout(begin, 200);
}

deferStart();
