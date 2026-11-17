import * as THREE from 'three';

export interface VillaMaterialSet {
  travertine: THREE.MeshStandardMaterial;
  travertineDark: THREE.MeshStandardMaterial;
  cedar: THREE.MeshStandardMaterial;
  bronze: THREE.MeshPhysicalMaterial;
  glass: THREE.MeshPhysicalMaterial;
  waterPool: THREE.MeshPhysicalMaterial;
  waterSea: THREE.MeshStandardMaterial;
  basalt: THREE.MeshStandardMaterial;
  linen: THREE.MeshStandardMaterial;
  limestoneTerrain: THREE.MeshStandardMaterial;
  warmGlow: THREE.MeshStandardMaterial;
  contactShadow: THREE.MeshBasicMaterial;
  textures: THREE.Texture[];
  dispose: () => void;
}

function createTravertineCanvas(variant: 'light' | 'dark'): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = variant === 'light' ? '#CBBBA4' : '#A9977E';
  ctx.fillRect(0, 0, 512, 512);

  // Horizontal vein-cut travertine striations
  for (let y = 0; y < 512; y += 2) {
    const wave = Math.sin(y * 0.045) * 0.5 + 0.5;
    const tone =
      variant === 'light'
        ? Math.floor(184 + wave * 24 + ((y * 17) % 9) - 4)
        : Math.floor(148 + wave * 22 + ((y * 13) % 9) - 4);
    ctx.fillStyle = `rgb(${tone}, ${Math.floor(tone * 0.94)}, ${Math.floor(tone * 0.85)})`;
    ctx.fillRect(0, y, 512, 2);
  }

  // Subtle mineral pores
  ctx.fillStyle = variant === 'light' ? 'rgba(98, 86, 68, 0.18)' : 'rgba(72, 62, 48, 0.22)';
  for (let i = 0; i < 420; i++) {
    const px = (i * 97) % 512;
    const py = (i * 53) % 512;
    const w = 4 + (i % 18);
    ctx.fillRect(px, py, w, 1.5);
  }

  return canvas;
}

function createStoneBumpCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 600; i++) {
    const x = (i * 73) % 256;
    const y = (i * 41) % 256;
    const shade = 105 + (i % 45);
    ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
    ctx.fillRect(x, y, 6 + (i % 10), 2);
  }
  return canvas;
}

function createCedarCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#755336';
  ctx.fillRect(0, 0, 512, 512);

  // Slat joints + warm wood grain
  const slatCount = 16;
  const slatWidth = 512 / slatCount;
  for (let s = 0; s < slatCount; s++) {
    const x = s * slatWidth;
    const shift = (s % 3) * 8 - 8;
    ctx.fillStyle = `rgb(${118 + shift}, ${82 + shift}, ${52 + shift})`;
    ctx.fillRect(x, 0, slatWidth - 3, 512);
    ctx.fillStyle = '#332215';
    ctx.fillRect(x + slatWidth - 3, 0, 3, 512);
  }

  return canvas;
}

function createWaterRippleBumpCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const img = ctx.createImageData(256, 256);
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      const u = (x / 256) * Math.PI * 2;
      const v = (y / 256) * Math.PI * 2;
      const val =
        Math.sin(u * 4 + Math.cos(v * 3)) * 0.5 +
        Math.cos(v * 6 - Math.sin(u * 2)) * 0.5;
      const c = Math.floor(128 + val * 42);
      const idx = (y * 256 + x) * 4;
      img.data[idx] = c;
      img.data[idx + 1] = c;
      img.data[idx + 2] = c;
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

function createContactShadowCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const grad = ctx.createRadialGradient(64, 64, 6, 64, 64, 60);
  grad.addColorStop(0, 'rgba(18, 16, 13, 0.55)');
  grad.addColorStop(0.55, 'rgba(18, 16, 13, 0.22)');
  grad.addColorStop(1, 'rgba(18, 16, 13, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return canvas;
}

export function createVillaMaterials(
  maxAnisotropy: number,
  isSoftwareGl: boolean,
): VillaMaterialSet {
  const textures: THREE.Texture[] = [];

  const configureMap = (
    canvas: HTMLCanvasElement,
    isColor: boolean,
    repeatX = 2,
    repeatY = 2,
  ) => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    tex.anisotropy = Math.max(1, maxAnisotropy);
    tex.needsUpdate = true;
    textures.push(tex);
    return tex;
  };

  const travLightMap = configureMap(createTravertineCanvas('light'), true, 2, 2);
  const travDarkMap = configureMap(createTravertineCanvas('dark'), true, 2, 2);
  const stoneBump = configureMap(createStoneBumpCanvas(), false, 3, 3);
  const cedarMap = configureMap(createCedarCanvas(), true, 3, 2);
  const waterBump = configureMap(createWaterRippleBumpCanvas(), false, 4, 4);
  const shadowTex = new THREE.CanvasTexture(createContactShadowCanvas());
  shadowTex.colorSpace = THREE.SRGBColorSpace;
  textures.push(shadowTex);

  const travertine = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: travLightMap,
    bumpMap: stoneBump,
    bumpScale: 0.03,
    roughness: 0.86,
    metalness: 0.02,
  });

  const travertineDark = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: travDarkMap,
    bumpMap: stoneBump,
    bumpScale: 0.04,
    roughness: 0.9,
    metalness: 0.03,
  });

  const cedar = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: cedarMap,
    bumpMap: stoneBump,
    bumpScale: 0.015,
    roughness: 0.72,
    metalness: 0.03,
  });

  const bronze = new THREE.MeshPhysicalMaterial({
    color: 0x3f3224,
    roughness: 0.25,
    metalness: 0.9,
    anisotropy: 0.75,
    clearcoat: 0.3,
    clearcoatRoughness: 0.25,
  });

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xc8d9dc,
    roughness: 0.06,
    metalness: 0.08,
    ior: 1.52,
    reflectivity: 0.9,
    transparent: true,
    opacity: isSoftwareGl ? 0.34 : 0.42,
    transmission: isSoftwareGl ? 0 : 0.68,
    thickness: 0.25,
    depthWrite: false,
  });

  const waterPool = new THREE.MeshPhysicalMaterial({
    color: 0x2f6870,
    roughness: 0.08,
    metalness: 0.08,
    bumpMap: waterBump,
    bumpScale: 0.018,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    transparent: true,
    opacity: 0.86,
  });

  const waterSea = new THREE.MeshStandardMaterial({
    color: 0x1e4a5e,
    roughness: 0.18,
    metalness: 0.25,
    bumpMap: waterBump,
    bumpScale: 0.05,
  });

  const basalt = new THREE.MeshStandardMaterial({
    color: 0x262523,
    bumpMap: stoneBump,
    bumpScale: 0.02,
    roughness: 0.66,
    metalness: 0.08,
  });

  const linen = new THREE.MeshStandardMaterial({
    color: 0xede6da,
    roughness: 0.92,
    metalness: 0.0,
  });

  const limestoneTerrain = new THREE.MeshStandardMaterial({
    color: 0x998c78,
    bumpMap: stoneBump,
    bumpScale: 0.07,
    roughness: 0.95,
    metalness: 0.02,
  });

  const warmGlow = new THREE.MeshStandardMaterial({
    color: 0xffe4bd,
    emissive: 0xffc77a,
    emissiveIntensity: 1.6,
    roughness: 0.4,
    metalness: 0.0,
  });

  const contactShadow = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
  });

  const allMaterials = [
    travertine,
    travertineDark,
    cedar,
    bronze,
    glass,
    waterPool,
    waterSea,
    basalt,
    linen,
    limestoneTerrain,
    warmGlow,
    contactShadow,
  ];

  return {
    travertine,
    travertineDark,
    cedar,
    bronze,
    glass,
    waterPool,
    waterSea,
    basalt,
    linen,
    limestoneTerrain,
    warmGlow,
    contactShadow,
    textures,
    dispose: () => {
      allMaterials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
    },
  };
}
