import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Eye, EyeOff, RotateCcw, Sun, Moon } from 'lucide-react';
import { JOURNEY_CHAPTERS } from '../data/residenceData';
import { CAMERA_PRESETS, dampScalar } from '../utils/cameraChoreography';
import { createVillaMaterials } from '../three/villaMaterials';
import { buildVillaWorld } from '../three/villaGeometry';

export type LightingMood = 'golden' | 'twilight';

interface VillaThreeSceneProps {
  activeChapterIndex: number;
  onSelectChapter: (index: number) => void;
}

const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();

function detectSoftwareWebGL(): boolean {
  const probeCanvas = document.createElement('canvas');
  const gl = probeCanvas.getContext('webgl2');
  if (!gl) return true;
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
  const gpu = String(gl.getParameter(param));
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
}

export function VillaThreeScene({
  activeChapterIndex,
  onSelectChapter,
}: VillaThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [lightingMood, setLightingMood] = useState<LightingMood>('golden');
  const [freeOrbit, setFreeOrbit] = useState(false);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const targetChapterRef = useRef(activeChapterIndex);
  const freeOrbitRef = useRef(freeOrbit);
  const moodRef = useRef<LightingMood>(lightingMood);
  const requestRenderRef = useRef<(() => void) | null>(null);
  const applyMoodRef = useRef<((mood: LightingMood) => void) | null>(null);
  const snapPresetRef = useRef<((index: number) => void) | null>(null);

  useEffect(() => {
    targetChapterRef.current = activeChapterIndex;
    if (!freeOrbitRef.current) {
      requestRenderRef.current?.();
    }
  }, [activeChapterIndex]);

  useEffect(() => {
    freeOrbitRef.current = freeOrbit;
    if (!freeOrbit) {
      requestRenderRef.current?.();
    }
  }, [freeOrbit]);

  useEffect(() => {
    moodRef.current = lightingMood;
    applyMoodRef.current?.(lightingMood);
    requestRenderRef.current?.();
  }, [lightingMood]);

  // Keyboard shortcut 'H' to toggle HUD visibility
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === 'h' || e.key === 'H') {
        setDockCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const mountEl = containerRef.current;
    if (!mountEl) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const width = mountEl.clientWidth || 1280;
    const height = mountEl.clientHeight || 720;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
      requestRender();
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const scene = new THREE.Scene();
    const initialBg = new THREE.Color(0xeae1d3);
    scene.background = initialBg.clone();
    scene.fog = new THREE.FogExp2(0xeae1d3, 0.0082);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTex = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.48;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const preset0 = CAMERA_PRESETS[targetChapterRef.current] ?? CAMERA_PRESETS[0];
    const camera = new THREE.PerspectiveCamera(preset0.fov, width / height, 0.25, 420);
    camera.position.set(...preset0.position);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...preset0.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.minDistance = 4;
    controls.maxDistance = 58;
    controls.update();

    // Warm/cool 3-point + hemisphere studio outdoor lighting (1 shadow caster max)
    const hemiLight = new THREE.HemisphereLight(0xcddae6, 0x8f7d69, 0.72);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xffdfb3, 2.35);
    sunLight.position.set(28, 22, 18);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.camera.near = 2;
    sunLight.shadow.camera.far = 90;
    sunLight.shadow.camera.left = -26;
    sunLight.shadow.camera.right = 26;
    sunLight.shadow.camera.top = 26;
    sunLight.shadow.camera.bottom = -26;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;
    scene.add(sunLight);

    // Subtle interior warm architectural lights (<= 3 unshadowed)
    const livingLight = new THREE.PointLight(0xffcb88, 3.8, 16, 1.5);
    livingLight.position.set(0.5, 3.6, -1.5);
    const diningLight = new THREE.PointLight(0xffcb88, 3.0, 14, 1.5);
    diningLight.position.set(6.5, 3.4, -1.6);
    const suiteLight = new THREE.PointLight(0xffcb88, 2.6, 14, 1.5);
    suiteLight.position.set(-2.5, 7.2, -1.8);
    scene.add(livingLight, diningLight, suiteLight);

    const materials = createVillaMaterials(
      renderer.capabilities.getMaxAnisotropy(),
      isSoftwareGl,
    );
    const world = buildVillaWorld(materials);
    scene.add(world.root);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const applyMood = (mood: LightingMood) => {
      if (mood === 'golden') {
        const bgHex = 0xeae1d3;
        (scene.background as THREE.Color).setHex(bgHex);
        if (scene.fog instanceof THREE.FogExp2) {
          scene.fog.color.setHex(bgHex);
          scene.fog.density = 0.0082;
        }
        sunLight.color.setHex(0xffdfb3);
        sunLight.intensity = 2.35;
        sunLight.position.set(28, 22, 18);
        hemiLight.color.setHex(0xcddae6);
        hemiLight.groundColor.setHex(0x8f7d69);
        hemiLight.intensity = 0.72;
        livingLight.intensity = 3.8;
        diningLight.intensity = 3.0;
        suiteLight.intensity = 2.6;
        materials.warmGlow.emissiveIntensity = 1.4;
        renderer.toneMappingExposure = 1.08;
      } else {
        const bgHex = 0x1b2330;
        (scene.background as THREE.Color).setHex(bgHex);
        if (scene.fog instanceof THREE.FogExp2) {
          scene.fog.color.setHex(bgHex);
          scene.fog.density = 0.0105;
        }
        sunLight.color.setHex(0x8faed9);
        sunLight.intensity = 0.72;
        sunLight.position.set(-20, 18, -22);
        hemiLight.color.setHex(0x4b6285);
        hemiLight.groundColor.setHex(0x27231e);
        hemiLight.intensity = 0.58;
        livingLight.intensity = 10.5;
        diningLight.intensity = 9.0;
        suiteLight.intensity = 8.2;
        materials.warmGlow.emissiveIntensity = 3.2;
        renderer.toneMappingExposure = 1.15;
      }
    };

    applyMoodRef.current = applyMood;
    applyMood(moodRef.current);

    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let lastTickMs = performance.now();
    let disposed = false;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const requestRender = () => {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        if (disposed) return;
        renderDirty = false;
        const now = performance.now();
        const dt = Math.min(0.1, Math.max(0.001, (now - lastTickMs) / 1000));
        lastTickMs = now;

        let needsFollowUp = false;

        if (!freeOrbitRef.current) {
          const preset =
            CAMERA_PRESETS[targetChapterRef.current] ?? CAMERA_PRESETS[0];
          _targetPos.set(...preset.position);
          _targetLook.set(...preset.target);

          if (isSoftwareGl) {
            camera.position.copy(_targetPos);
            controls.target.copy(_targetLook);
            camera.fov = preset.fov;
            camera.updateProjectionMatrix();
          } else {
            const lambda = 4.5;
            camera.position.x = dampScalar(camera.position.x, _targetPos.x, lambda, dt);
            camera.position.y = dampScalar(camera.position.y, _targetPos.y, lambda, dt);
            camera.position.z = dampScalar(camera.position.z, _targetPos.z, lambda, dt);
            controls.target.x = dampScalar(controls.target.x, _targetLook.x, lambda, dt);
            controls.target.y = dampScalar(controls.target.y, _targetLook.y, lambda, dt);
            controls.target.z = dampScalar(controls.target.z, _targetLook.z, lambda, dt);
            camera.fov = dampScalar(camera.fov, preset.fov, lambda, dt);
            camera.updateProjectionMatrix();

            const distPos = camera.position.distanceTo(_targetPos);
            const distTarget = controls.target.distanceTo(_targetLook);
            if (distPos > 0.03 || distTarget > 0.03 || Math.abs(camera.fov - preset.fov) > 0.05) {
              needsFollowUp = true;
            }
          }
        }

        const didDamp = controls.update();
        if (didDamp && !isSoftwareGl) {
          needsFollowUp = true;
        }

        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (renderDirty || needsFollowUp) {
            requestRender();
          }
        };

        if (isSoftwareGl) {
          afterDraw(done);
        } else {
          done();
        }
      });
    };

    requestRenderRef.current = requestRender;

    snapPresetRef.current = (idx: number) => {
      const preset = CAMERA_PRESETS[idx] ?? CAMERA_PRESETS[0];
      camera.position.set(...preset.position);
      controls.target.set(...preset.target);
      camera.fov = preset.fov;
      camera.updateProjectionMatrix();
      controls.update();
      requestRender();
    };

    const handleControlStart = () => {
      if (!freeOrbitRef.current) {
        freeOrbitRef.current = true;
        setFreeOrbit(true);
      }
    };

    const handleControlChange = () => {
      requestRender();
    };

    controls.addEventListener('start', handleControlStart);
    controls.addEventListener('change', handleControlChange);

    const handleResize = () => {
      if (!mountEl || disposed) return;
      const w = mountEl.clientWidth || 1280;
      const h = mountEl.clientHeight || 720;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mountEl);

    // Initial render
    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', handleControlStart);
      controls.removeEventListener('change', handleControlChange);
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      world.dispose();
      materials.dispose();
      envTex.dispose();
      renderer.dispose();
    };
  }, []);

  const currentChapter = JOURNEY_CHAPTERS[activeChapterIndex] ?? JOURNEY_CHAPTERS[0];

  return (
    <div
      className="relative w-full h-[78vh] min-h-[540px] max-h-[820px] bg-[#171614] overflow-hidden border-y border-[#D8D0C5]"
      data-testid="villa-3d-viewport"
      data-active-chapter={currentChapter.id}
      data-lighting-mood={lightingMood}
      data-free-orbit={String(freeOrbit)}
    >
      {/* Dedicated isolated WebGL mount */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        aria-label="Interactive 3D architectural model of Villa Vérone"
      />

      {/* Fallback when WebGL context is unavailable */}
      {contextLost && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#171614] text-[#F7F4EF] p-8 text-center">
          <div className="max-w-md space-y-3">
            <p className="font-serif text-3xl">3D Pavilion View Paused</p>
            <p className="text-sm text-[#D8D0C5]">
              Graphics context is restoring. Scroll below to explore interior architectural photography.
            </p>
          </div>
        </div>
      )}

      {/* Minimal Top-Left Scene Chapter Readout (No backdrop-blur over WebGL, solid/rgba only) */}
      <div className="pointer-events-none absolute top-5 left-5 right-5 flex items-start justify-between gap-4">
        <div className="bg-[rgba(23,22,20,0.86)] border border-white/15 px-4 py-3 text-[#F7F4EF] max-w-sm">
          <div className="flex items-center gap-2 text-xs tracking-[0.16em] uppercase text-[#B89F7D] tabular-nums">
            <span>{currentChapter.index}</span>
            <span aria-hidden="true">/</span>
            <span>{currentChapter.label}</span>
          </div>
          <p className="font-serif text-xl leading-snug mt-1 text-[#F7F4EF]">
            {currentChapter.title}
          </p>
          <p className="text-xs text-[#D8D0C5] mt-1">
            {currentChapter.elevation} · {currentChapter.focusMaterial}
          </p>
        </div>

        {/* Top-Right Compact Collapse Toggle when Dock is hidden */}
        {dockCollapsed && (
          <button
            type="button"
            onClick={() => setDockCollapsed(false)}
            className="pointer-events-auto inline-flex items-center gap-2 bg-[rgba(23,22,20,0.9)] hover:bg-[#171614] text-[#F7F4EF] border border-white/20 px-3.5 py-2 text-xs tracking-wider uppercase transition-colors whitespace-nowrap shrink-0"
          >
            <Eye className="w-3.5 h-3.5 text-[#B89F7D]" />
            <span>Show Controls</span>
          </button>
        )}
      </div>

      {/* Collapsible Bottom Control Dock (<= 15% viewport footprint, solid rgba surface) */}
      {!dockCollapsed && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[min(920px,94vw)] flex flex-col items-center gap-2 z-10">
          <button
            type="button"
            onClick={() => setDockCollapsed(true)}
            aria-label="Hide 3D viewport controls"
            className="inline-flex items-center gap-1.5 bg-[rgba(23,22,20,0.88)] hover:bg-[#171614] text-[#D8D0C5] hover:text-[#F7F4EF] border border-white/15 px-3 py-1 text-[11px] tracking-[0.14em] uppercase transition-colors whitespace-nowrap shrink-0"
          >
            <EyeOff className="w-3 h-3" />
            <span>Hide Controls</span>
          </button>

          <div className="w-full bg-[rgba(23,22,20,0.92)] border border-white/15 px-3 py-2 flex flex-wrap lg:flex-nowrap items-center justify-between gap-2 text-[#F7F4EF]">
            {/* 5 Architectural Camera Waypoints */}
            <div
              className="flex flex-wrap items-center gap-1"
              role="group"
              aria-label="3D Architectural Camera Chapters"
            >
              {JOURNEY_CHAPTERS.map((chapter, idx) => {
                const isActive = idx === activeChapterIndex && !freeOrbit;
                const shortLabel = chapter.label
                  .replace('The ', '')
                  .replace('Architectural ', '')
                  .replace('Entering the ', '')
                  .replace(' Discovery', '')
                  .replace('Signature ', '');
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    aria-label={`${chapter.index} · ${chapter.label}`}
                    onClick={() => {
                      setFreeOrbit(false);
                      onSelectChapter(idx);
                      snapPresetRef.current?.(idx);
                    }}
                    className={`px-2.5 py-1.5 text-xs transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                      isActive
                        ? 'bg-[#9B8364] text-[#171614] font-medium'
                        : 'text-[#D8D0C5] hover:text-[#F7F4EF] hover:bg-white/10'
                    }`}
                  >
                    {chapter.index} · {shortLabel}
                  </button>
                );
              })}
            </div>

            {/* Atmosphere & Orbit Mode Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() =>
                  setLightingMood((prev) => (prev === 'golden' ? 'twilight' : 'golden'))
                }
                aria-label={`Switch lighting atmosphere, currently ${lightingMood === 'golden' ? 'Golden Hour' : 'Twilight'}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-white/15 text-[#F7F4EF] hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
              >
                {lightingMood === 'golden' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#B89F7D]" />
                    <span>Golden Hour</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#B89F7D]" />
                    <span>Blue Hour</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setFreeOrbit(false);
                  snapPresetRef.current?.(activeChapterIndex);
                }}
                aria-label="Reset 3D camera to guided chapter view"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-white/15 text-[#D8D0C5] hover:text-[#F7F4EF] hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{freeOrbit ? 'Resume Guided' : 'Reset View'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
