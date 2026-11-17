import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CAMERA_PRESETS,
  chapterIndexFromProgress,
  clamp01,
  dampScalar,
  interpolateCameraPose,
} from './cameraChoreography';

test('clamp01 bounds values cleanly and handles NaN', () => {
  assert.equal(clamp01(-0.4), 0);
  assert.equal(clamp01(1.8), 1);
  assert.equal(clamp01(0.45), 0.45);
  assert.equal(clamp01(Number.NaN), 0);
});

test('interpolateCameraPose matches first and last presets at boundaries', () => {
  const start = interpolateCameraPose(0);
  const end = interpolateCameraPose(1);

  assert.deepEqual(start.position, CAMERA_PRESETS[0].position);
  assert.deepEqual(end.position, CAMERA_PRESETS[CAMERA_PRESETS.length - 1].position);
  assert.equal(start.id, 'setting');
  assert.equal(end.id, 'details');
});

test('interpolateCameraPose smoothly blends intermediate waypoints', () => {
  const mid = interpolateCameraPose(0.5);
  assert.equal(mid.id, 'threshold');
  assert.equal(mid.fov, CAMERA_PRESETS[2].fov);
});

test('chapterIndexFromProgress maps normalized scroll progress to chapter indices', () => {
  assert.equal(chapterIndexFromProgress(0), 0);
  assert.equal(chapterIndexFromProgress(0.25), 1);
  assert.equal(chapterIndexFromProgress(0.5), 2);
  assert.equal(chapterIndexFromProgress(0.75), 3);
  assert.equal(chapterIndexFromProgress(1), 4);
});

test('dampScalar moves monotonically toward target without overshoot', () => {
  const next = dampScalar(0, 10, 6, 0.016);
  assert.ok(next > 0 && next < 10);
  assert.equal(dampScalar(5, 10, 6, 0), 5);
});
