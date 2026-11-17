export interface CameraPose {
  id: string;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const CAMERA_PRESETS: CameraPose[] = [
  {
    id: 'setting',
    position: [23, 10.5, 25],
    target: [1.5, 1.5, 1.5],
    fov: 42,
  },
  {
    id: 'arrival',
    position: [-14.5, 5.2, 16.5],
    target: [-1.5, 2.4, 1.0],
    fov: 42,
  },
  {
    id: 'threshold',
    position: [-4.8, 3.3, 9.6],
    target: [1.8, 2.2, -1.5],
    fov: 44,
  },
  {
    id: 'interior',
    position: [2.2, 3.0, 4.4],
    target: [6.8, 2.3, -4.5],
    fov: 46,
  },
  {
    id: 'details',
    position: [12.4, 3.4, 8.6],
    target: [6.5, 1.2, 3.2],
    fov: 38,
  },
];

export function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function smoothstep01(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

export function dampScalar(current: number, target: number, lambda: number, dt: number): number {
  if (dt <= 0) return current;
  const factor = 1 - Math.exp(-lambda * dt);
  return current + (target - current) * factor;
}

export function interpolateCameraPose(
  progress: number,
  presets: readonly CameraPose[] = CAMERA_PRESETS,
): CameraPose {
  if (presets.length === 0) {
    return { id: 'default', position: [0, 5, 10], target: [0, 0, 0], fov: 42 };
  }
  if (presets.length === 1) {
    return presets[0];
  }

  const p = clamp01(progress);
  if (p <= 0) return presets[0];
  if (p >= 1) return presets[presets.length - 1];
  const maxIndex = presets.length - 1;
  const scaled = p * maxIndex;
  const idx = Math.min(Math.floor(scaled), maxIndex - 1);
  const localT = smoothstep01(scaled - idx);

  const a = presets[idx];
  const b = presets[idx + 1];

  const lerp = (u: number, v: number) => u + (v - u) * localT;

  return {
    id: localT < 0.5 ? a.id : b.id,
    position: [
      lerp(a.position[0], b.position[0]),
      lerp(a.position[1], b.position[1]),
      lerp(a.position[2], b.position[2]),
    ],
    target: [
      lerp(a.target[0], b.target[0]),
      lerp(a.target[1], b.target[1]),
      lerp(a.target[2], b.target[2]),
    ],
    fov: lerp(a.fov, b.fov),
  };
}

export function chapterIndexFromProgress(progress: number, totalChapters = 5): number {
  if (totalChapters <= 1) return 0;
  const p = clamp01(progress);
  return Math.min(totalChapters - 1, Math.round(p * (totalChapters - 1)));
}
