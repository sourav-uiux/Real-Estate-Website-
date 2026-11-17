import * as THREE from 'three';
import { VillaMaterialSet } from './villaMaterials';

export interface BuiltVillaWorld {
  root: THREE.Group;
  waterMesh: THREE.Mesh;
  poolMesh: THREE.Mesh;
  interiorGlowMeshes: THREE.Mesh[];
  dispose: () => void;
}

export function terrainHeightAt(x: number, z: number): number {
  // Coastal headland: engineered plateau near origin, rising gently behind (-Z),
  // and dropping steeply into the Mediterranean Sea past the infinity terrace (+Z / +X)
  const undulation =
    Math.sin(x * 0.11) * Math.cos(z * 0.09) * 0.55 +
    Math.sin(x * 0.24 + z * 0.17) * 0.22;

  const distFromPad = Math.max(0, Math.hypot(x * 0.72, z * 0.88) - 9.8);
  const padBlend = Math.min(1, distFromPad / 6.5);

  // Steep coastal drop toward south-east sea (+Z, +X)
  const seaDrop = Math.max(0, (z - 7.8) * 0.58 + (x - 10.5) * 0.28);
  const ridgeRise = Math.max(0, (-z - 7.5) * 0.22);

  const rawHeight = Math.max(-5.8, Math.min(4.2, ridgeRise - seaDrop + undulation));
  return padBlend * rawHeight;
}

function createBeveledSlabGeometry(
  width: number,
  depth: number,
  thickness: number,
  bevel = 0.06,
): THREE.ExtrudeGeometry {
  const hw = width / 2;
  const hd = depth / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-hw, -hd);
  shape.lineTo(hw, -hd);
  shape.lineTo(hw, hd);
  shape.lineTo(-hw, hd);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.05, thickness - bevel * 2),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
  });
  geo.rotateX(-Math.PI / 2);
  geo.center();
  return geo;
}

export function buildVillaWorld(mats: VillaMaterialSet): BuiltVillaWorld {
  const root = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  const localMaterials: THREE.Material[] = [];
  const interiorGlowMeshes: THREE.Mesh[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };

  // 1. Coastal Limestone Headland Terrain (extended beyond playable bounds, natural horizon)
  const terrainGeo = trackGeo(new THREE.PlaneGeometry(180, 180, 72, 72));
  terrainGeo.rotateX(-Math.PI / 2);
  const posAttr = terrainGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const vx = posAttr.getX(i);
    const vz = posAttr.getZ(i);
    posAttr.setY(i, terrainHeightAt(vx, vz));
  }
  terrainGeo.computeVertexNormals();
  const terrainMesh = new THREE.Mesh(terrainGeo, mats.limestoneTerrain);
  terrainMesh.receiveShadow = true;
  root.add(terrainMesh);

  // 2. Mediterranean Sea Plane (visibly surrounding the cliffside promontory)
  const seaGeo = trackGeo(new THREE.PlaneGeometry(420, 420, 24, 24));
  seaGeo.rotateX(-Math.PI / 2);
  const waterMesh = new THREE.Mesh(seaGeo, mats.waterSea);
  waterMesh.position.set(18, -2.15, 55);
  waterMesh.receiveShadow = true;
  root.add(waterMesh);

  // 3. Estate Base Plinth & Stepped Retaining Terraces (Composite Group)
  const plinthGroup = new THREE.Group();
  const mainDeckGeo = trackGeo(createBeveledSlabGeometry(24, 15.5, 0.65, 0.05));
  const mainDeck = new THREE.Mesh(mainDeckGeo, mats.travertine);
  mainDeck.position.set(0, 0.32, 0);
  mainDeck.castShadow = true;
  mainDeck.receiveShadow = true;
  plinthGroup.add(mainDeck);

  // Lower garden retaining wall & stepping stones
  const gardenStepGeo = trackGeo(createBeveledSlabGeometry(13, 6.2, 0.45, 0.04));
  const gardenStep = new THREE.Mesh(gardenStepGeo, mats.travertineDark);
  gardenStep.position.set(-5.8, 0.16, 8.8);
  gardenStep.castShadow = true;
  gardenStep.receiveShadow = true;
  plinthGroup.add(gardenStep);

  // Basalt arrival water court + 4 floating travertine stepping slabs
  const arrivalBasinGeo = trackGeo(new THREE.BoxGeometry(8.8, 0.16, 4.8));
  const arrivalBasin = new THREE.Mesh(arrivalBasinGeo, mats.basalt);
  arrivalBasin.position.set(-7.2, 0.68, 5.1);
  arrivalBasin.receiveShadow = true;
  plinthGroup.add(arrivalBasin);

  const stepSlabGeo = trackGeo(createBeveledSlabGeometry(1.45, 0.72, 0.14, 0.02));
  for (let i = 0; i < 4; i++) {
    const slab = new THREE.Mesh(stepSlabGeo, mats.travertine);
    slab.position.set(-5.4, 0.78, 7.1 - i * 1.12);
    slab.castShadow = true;
    slab.receiveShadow = true;
    plinthGroup.add(slab);
  }
  root.add(plinthGroup);

  // 4. Cantilevered Saltwater Infinity Pool (Composite 5-part Group)
  const poolGroup = new THREE.Group();
  const poolOuterGeo = trackGeo(createBeveledSlabGeometry(14.4, 5.0, 1.1, 0.05));
  const poolOuter = new THREE.Mesh(poolOuterGeo, mats.travertine);
  poolOuter.position.set(5.4, 0.34, 5.8);
  poolOuter.castShadow = true;
  poolOuter.receiveShadow = true;
  poolGroup.add(poolOuter);

  const poolBasinFloorGeo = trackGeo(new THREE.BoxGeometry(13.6, 0.1, 4.3));
  const poolBasinFloor = new THREE.Mesh(poolBasinFloorGeo, mats.basalt);
  poolBasinFloor.position.set(5.4, 0.78, 5.8);
  poolGroup.add(poolBasinFloor);

  const poolWaterGeo = trackGeo(new THREE.PlaneGeometry(13.7, 4.35, 16, 8));
  poolWaterGeo.rotateX(-Math.PI / 2);
  const poolMesh = new THREE.Mesh(poolWaterGeo, mats.waterPool);
  poolMesh.position.set(5.4, 0.91, 5.8);
  poolMesh.renderOrder = 2;
  poolGroup.add(poolMesh);

  // Submerged travertine edge steps + glowing step strip
  const submergedStepGeo = trackGeo(new THREE.BoxGeometry(2.6, 0.12, 1.2));
  const submergedStep = new THREE.Mesh(submergedStepGeo, mats.travertineDark);
  submergedStep.position.set(-0.2, 0.84, 4.4);
  poolGroup.add(submergedStep);

  const poolCoveGeo = trackGeo(new THREE.BoxGeometry(13.2, 0.06, 0.08));
  const poolCove = new THREE.Mesh(poolCoveGeo, mats.warmGlow);
  poolCove.position.set(5.4, 0.85, 7.92);
  interiorGlowMeshes.push(poolCove);
  poolGroup.add(poolCove);

  // Fluted travertine architectural detail monolith beside infinity pool
  const flutePillarGeo = trackGeo(new THREE.BoxGeometry(0.18, 2.6, 0.28));
  for (let f = 0; f < 6; f++) {
    const flute = new THREE.Mesh(flutePillarGeo, mats.travertineDark);
    flute.position.set(11.8, 1.95, 2.9 + f * 0.34);
    flute.castShadow = true;
    flute.receiveShadow = true;
    poolGroup.add(flute);
  }
  root.add(poolGroup);

  // 5. Ground-Level Living & Dining Pavilion (Composite 10-part Architectural Group)
  const mainPavilion = new THREE.Group();

  // Rear & side structural travertine shear walls
  const backWallGeo = trackGeo(new THREE.BoxGeometry(18.6, 3.85, 0.55));
  const backWall = new THREE.Mesh(backWallGeo, mats.travertine);
  backWall.position.set(0.2, 2.57, -5.6);
  backWall.castShadow = true;
  backWall.receiveShadow = true;
  mainPavilion.add(backWall);

  const westShearWallGeo = trackGeo(new THREE.BoxGeometry(0.65, 3.85, 7.8));
  const westShearWall = new THREE.Mesh(westShearWallGeo, mats.travertineDark);
  westShearWall.position.set(-8.7, 2.57, -1.7);
  westShearWall.castShadow = true;
  westShearWall.receiveShadow = true;
  mainPavilion.add(westShearWall);

  const eastWallGeo = trackGeo(new THREE.BoxGeometry(0.65, 3.85, 6.2));
  const eastWall = new THREE.Mesh(eastWallGeo, mats.travertine);
  eastWall.position.set(9.2, 2.57, -2.5);
  eastWall.castShadow = true;
  eastWall.receiveShadow = true;
  mainPavilion.add(eastWall);

  // Monumental bronze pivot entrance portal
  const portalDoorGeo = trackGeo(new THREE.BoxGeometry(1.9, 3.45, 0.14));
  const portalDoor = new THREE.Mesh(portalDoorGeo, mats.bronze);
  portalDoor.position.set(-5.4, 2.38, 2.15);
  portalDoor.rotation.y = 0.28; // Partially open welcoming threshold
  portalDoor.castShadow = true;
  mainPavilion.add(portalDoor);

  // Cantilevered travertine roof slab + warm cedar soffit ceiling
  const mainRoofGeo = trackGeo(createBeveledSlabGeometry(21.4, 11.4, 0.52, 0.06));
  const mainRoof = new THREE.Mesh(mainRoofGeo, mats.travertine);
  mainRoof.position.set(0.5, 4.72, -1.4);
  mainRoof.castShadow = true;
  mainRoof.receiveShadow = true;
  mainPavilion.add(mainRoof);

  const cedarSoffitGeo = trackGeo(new THREE.BoxGeometry(20.6, 0.08, 10.6));
  const cedarSoffit = new THREE.Mesh(cedarSoffitGeo, mats.cedar);
  cedarSoffit.position.set(0.5, 4.43, -1.4);
  mainPavilion.add(cedarSoffit);

  // Anodized bronze structural mullions & frameless glazing bays
  const mullionGeo = trackGeo(new THREE.BoxGeometry(0.08, 3.82, 0.12));
  const mullionXs = [-4.2, -0.6, 3.0, 6.6, 9.0];
  for (const mx of mullionXs) {
    const mullion = new THREE.Mesh(mullionGeo, mats.bronze);
    mullion.position.set(mx, 2.56, 2.1);
    mullion.castShadow = true;
    mainPavilion.add(mullion);
  }

  const glassPaneGeo = trackGeo(new THREE.BoxGeometry(3.48, 3.76, 0.04));
  for (let i = 0; i < 3; i++) {
    const pane = new THREE.Mesh(glassPaneGeo, mats.glass);
    pane.position.set(-2.4 + i * 3.6, 2.55, 2.1);
    pane.renderOrder = 3;
    mainPavilion.add(pane);
  }

  // Interior Sculptural Elements (visible through the glass)
  // Travertine fireplace hearth & flue
  const hearthBaseGeo = trackGeo(createBeveledSlabGeometry(3.2, 1.35, 0.32, 0.03));
  const hearthBase = new THREE.Mesh(hearthBaseGeo, mats.travertineDark);
  hearthBase.position.set(3.2, 0.82, -2.6);
  mainPavilion.add(hearthBase);

  const hearthCoreGeo = trackGeo(new THREE.BoxGeometry(2.1, 1.45, 0.95));
  const hearthCore = new THREE.Mesh(hearthCoreGeo, mats.travertine);
  hearthCore.position.set(3.2, 1.65, -2.6);
  hearthCore.castShadow = true;
  mainPavilion.add(hearthCore);

  const hearthFlueGeo = trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 2.4, 20));
  const hearthFlue = new THREE.Mesh(hearthFlueGeo, mats.bronze);
  hearthFlue.position.set(3.2, 3.45, -2.6);
  mainPavilion.add(hearthFlue);

  const emberGlowGeo = trackGeo(new THREE.BoxGeometry(1.1, 0.32, 0.35));
  const emberGlow = new THREE.Mesh(emberGlowGeo, mats.warmGlow);
  emberGlow.position.set(3.2, 1.25, -2.55);
  interiorGlowMeshes.push(emberGlow);
  mainPavilion.add(emberGlow);

  // Linen sectional sofa + travertine plinth coffee table
  const sofaBaseGeo = trackGeo(new THREE.BoxGeometry(4.2, 0.42, 1.3));
  const sofaBase = new THREE.Mesh(sofaBaseGeo, mats.linen);
  sofaBase.position.set(-0.8, 0.9, -1.8);
  sofaBase.castShadow = true;
  mainPavilion.add(sofaBase);

  const sofaBackGeo = trackGeo(new THREE.BoxGeometry(4.2, 0.46, 0.28));
  const sofaBack = new THREE.Mesh(sofaBackGeo, mats.linen);
  sofaBack.position.set(-0.8, 1.25, -2.32);
  mainPavilion.add(sofaBack);

  const coffeeTableGeo = trackGeo(createBeveledSlabGeometry(2.1, 1.1, 0.26, 0.03));
  const coffeeTable = new THREE.Mesh(coffeeTableGeo, mats.travertineDark);
  coffeeTable.position.set(-0.8, 0.88, -0.2);
  mainPavilion.add(coffeeTable);

  // Sculptural dining monolith in east bay
  const diningTopGeo = trackGeo(createBeveledSlabGeometry(3.4, 1.25, 0.14, 0.02));
  const diningTop = new THREE.Mesh(diningTopGeo, mats.travertine);
  diningTop.position.set(6.5, 1.48, -1.6);
  diningTop.castShadow = true;
  mainPavilion.add(diningTop);

  const diningPedestalGeo = trackGeo(new THREE.CylinderGeometry(0.32, 0.42, 0.78, 18));
  const diningPedestal1 = new THREE.Mesh(diningPedestalGeo, mats.travertineDark);
  diningPedestal1.position.set(5.5, 1.06, -1.6);
  const diningPedestal2 = new THREE.Mesh(diningPedestalGeo, mats.travertineDark);
  diningPedestal2.position.set(7.5, 1.06, -1.6);
  mainPavilion.add(diningPedestal1, diningPedestal2);

  // Interior linear ceiling cove light
  const coveLightGeo = trackGeo(new THREE.BoxGeometry(15.5, 0.05, 0.14));
  const coveLight = new THREE.Mesh(coveLightGeo, mats.warmGlow);
  coveLight.position.set(1.2, 4.36, -3.9);
  interiorGlowMeshes.push(coveLight);
  mainPavilion.add(coveLight);

  root.add(mainPavilion);

  // 6. Upper Cantilevered Sky Suite Wing (Composite 6-part Group)
  const upperWing = new THREE.Group();
  const upperWallBackGeo = trackGeo(new THREE.BoxGeometry(13.2, 3.25, 0.5));
  const upperWallBack = new THREE.Mesh(upperWallBackGeo, mats.travertine);
  upperWallBack.position.set(-2.5, 6.55, -5.2);
  upperWallBack.castShadow = true;
  upperWallBack.receiveShadow = true;
  upperWing.add(upperWallBack);

  const upperWallSideGeo = trackGeo(new THREE.BoxGeometry(0.55, 3.25, 6.8));
  const upperWallLeft = new THREE.Mesh(upperWallSideGeo, mats.travertineDark);
  upperWallLeft.position.set(-8.8, 6.55, -2.0);
  upperWallLeft.castShadow = true;
  upperWing.add(upperWallLeft);

  const upperWallRight = new THREE.Mesh(upperWallSideGeo, mats.travertine);
  upperWallRight.position.set(3.8, 6.55, -2.0);
  upperWallRight.castShadow = true;
  upperWing.add(upperWallRight);

  const upperRoofGeo = trackGeo(createBeveledSlabGeometry(15.6, 8.8, 0.48, 0.06));
  const upperRoof = new THREE.Mesh(upperRoofGeo, mats.travertine);
  upperRoof.position.set(-2.2, 8.4, -1.7);
  upperRoof.castShadow = true;
  upperRoof.receiveShadow = true;
  upperWing.add(upperRoof);

  const upperSoffitGeo = trackGeo(new THREE.BoxGeometry(14.8, 0.08, 8.0));
  const upperSoffit = new THREE.Mesh(upperSoffitGeo, mats.cedar);
  upperSoffit.position.set(-2.2, 8.13, -1.7);
  upperWing.add(upperSoffit);

  const upperGlassGeo = trackGeo(new THREE.BoxGeometry(11.8, 3.1, 0.04));
  const upperGlass = new THREE.Mesh(upperGlassGeo, mats.glass);
  upperGlass.position.set(-2.5, 6.52, 1.25);
  upperGlass.renderOrder = 3;
  upperWing.add(upperGlass);

  // Sky terrace glass balustrade on east roof deck
  const balustradeGeo = trackGeo(new THREE.BoxGeometry(6.8, 1.05, 0.04));
  const balustrade = new THREE.Mesh(balustradeGeo, mats.glass);
  balustrade.position.set(7.4, 5.48, 4.1);
  balustrade.renderOrder = 4;
  upperWing.add(balustrade);

  root.add(upperWing);

  // 7. Outdoor Terrace Loungers & Contact Shadows (3-part composite loungers)
  const loungerBaseGeo = trackGeo(new THREE.BoxGeometry(0.95, 0.22, 2.05));
  const loungerBackGeo = trackGeo(new THREE.BoxGeometry(0.95, 0.2, 0.72));
  const shadowDiscGeo = trackGeo(new THREE.CircleGeometry(1.15, 24));
  shadowDiscGeo.rotateX(-Math.PI / 2);

  const loungerPositions: [number, number][] = [
    [2.6, 2.6],
    [4.4, 2.6],
    [8.2, 2.6],
  ];
  for (const [lx, lz] of loungerPositions) {
    const lounger = new THREE.Group();
    const base = new THREE.Mesh(loungerBaseGeo, mats.cedar);
    base.position.set(0, 0.14, 0);
    base.castShadow = true;

    const cushion = new THREE.Mesh(loungerBaseGeo, mats.linen);
    cushion.scale.set(0.92, 0.55, 0.94);
    cushion.position.set(0, 0.3, 0);

    const headrest = new THREE.Mesh(loungerBackGeo, mats.linen);
    headrest.position.set(0, 0.52, -0.62);
    headrest.rotation.x = 0.52;

    const shadowDisc = new THREE.Mesh(shadowDiscGeo, mats.contactShadow);
    shadowDisc.position.set(0, 0.02, 0);

    lounger.add(shadowDisc, base, cushion, headrest);
    lounger.position.set(lx, 0.65, lz);
    root.add(lounger);
  }

  // 8. Instanced Mediterranean Cypress & Olive Grove (> 20 instances, 3-part silhouettes)
  const cypressCoords: [number, number][] = [
    [-15.5, 4.5], [-17.2, 0.5], [-16.0, -4.5], [-14.2, -9.2],
    [-10.5, -12.5], [-5.2, -13.0], [2.4, -12.8], [8.8, -11.5],
    [13.6, -8.2], [15.4, -3.5], [-18.5, 6.2], [-13.8, 7.6],
    [-21.0, -2.5], [-20.5, -9.5], [-16.8, -14.2], [16.8, -10.5],
    [18.2, -6.5], [-24.0, 2.2], [-25.5, -6.0], [14.5, -15.0],
    [5.8, -16.2], [-8.0, -17.0], [-22.5, -13.5], [11.2, -14.8],
  ];
  const cypressCount = cypressCoords.length;

  const trunkGeo = trackGeo(new THREE.CylinderGeometry(0.14, 0.24, 2.2, 8));
  trunkGeo.translate(0, 1.1, 0);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4d3c2d, roughness: 0.94 });
  localMaterials.push(trunkMat);

  const crownLowerGeo = trackGeo(new THREE.ConeGeometry(0.98, 4.6, 10));
  crownLowerGeo.translate(0, 3.8, 0);
  const crownMidGeo = trackGeo(new THREE.ConeGeometry(0.74, 3.6, 10));
  crownMidGeo.translate(0, 5.8, 0);
  const crownTipGeo = trackGeo(new THREE.ConeGeometry(0.42, 2.4, 10));
  crownTipGeo.translate(0, 7.5, 0);
  const foliageMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.88 });
  localMaterials.push(foliageMat);

  const trunkInst = new THREE.InstancedMesh(trunkGeo, trunkMat, cypressCount);
  const crownLowInst = new THREE.InstancedMesh(crownLowerGeo, foliageMat, cypressCount);
  const crownMidInst = new THREE.InstancedMesh(crownMidGeo, foliageMat, cypressCount);
  const crownTipInst = new THREE.InstancedMesh(crownTipGeo, foliageMat, cypressCount);
  trunkInst.castShadow = true;
  crownLowInst.castShadow = true;
  crownMidInst.castShadow = true;
  crownTipInst.castShadow = true;

  const dummy = new THREE.Object3D();
  const tintColor = new THREE.Color();
  const foliagePalette = [0x3d4b37, 0x46553e, 0x344230, 0x4f5e45];

  for (let i = 0; i < cypressCount; i++) {
    const [tx, tz] = cypressCoords[i];
    const ty = terrainHeightAt(tx, tz);
    const scaleY = 0.84 + ((i * 37) % 30) / 100;
    const scaleXZ = 0.86 + ((i * 23) % 24) / 100;

    dummy.position.set(tx, ty, tz);
    dummy.rotation.set(0, (i * 1.1) % (Math.PI * 2), 0);
    dummy.scale.set(scaleXZ, scaleY, scaleXZ);
    dummy.updateMatrix();

    trunkInst.setMatrixAt(i, dummy.matrix);
    crownLowInst.setMatrixAt(i, dummy.matrix);
    crownMidInst.setMatrixAt(i, dummy.matrix);
    crownTipInst.setMatrixAt(i, dummy.matrix);

    tintColor.setHex(foliagePalette[i % foliagePalette.length]);
    crownLowInst.setColorAt(i, tintColor);
    crownMidInst.setColorAt(i, tintColor);
    crownTipInst.setColorAt(i, tintColor);
  }

  trunkInst.instanceMatrix.needsUpdate = true;
  crownLowInst.instanceMatrix.needsUpdate = true;
  crownMidInst.instanceMatrix.needsUpdate = true;
  crownTipInst.instanceMatrix.needsUpdate = true;
  if (crownLowInst.instanceColor) crownLowInst.instanceColor.needsUpdate = true;
  if (crownMidInst.instanceColor) crownMidInst.instanceColor.needsUpdate = true;
  if (crownTipInst.instanceColor) crownTipInst.instanceColor.needsUpdate = true;
  trunkInst.computeBoundingSphere();
  crownLowInst.computeBoundingSphere();
  crownMidInst.computeBoundingSphere();
  crownTipInst.computeBoundingSphere();

  root.add(trunkInst, crownLowInst, crownMidInst, crownTipInst);

  // 9. Instanced Coastal Limestone Boulders along the cliff drop-off
  const boulderCoords: [number, number][] = [
    [-12.5, 11.2], [-9.2, 11.8], [-5.8, 12.1], [-2.0, 11.4],
    [1.8, 11.5], [5.4, 11.2], [9.2, 10.6], [12.4, 9.5],
    [14.2, 6.8], [15.1, 3.2], [15.8, -0.4], [-15.2, 10.4],
    [-7.5, 13.6], [0.5, 13.2], [7.2, 12.5], [13.5, 11.2],
    [-11.0, 14.5], [-3.2, 14.8], [4.0, 14.2], [11.2, 13.4],
    [16.8, 5.2], [17.5, 1.4],
  ];
  const boulderGeo = trackGeo(new THREE.DodecahedronGeometry(1.15, 0));
  const boulderMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.94,
    metalness: 0.02,
    flatShading: true,
  });
  localMaterials.push(boulderMat);
  const boulderInst = new THREE.InstancedMesh(
    boulderGeo,
    boulderMat,
    boulderCoords.length,
  );
  boulderInst.castShadow = true;
  boulderInst.receiveShadow = true;

  const boulderPalette = [0xa89b87, 0x998c77, 0xb5a894, 0x8f8370];
  for (let i = 0; i < boulderCoords.length; i++) {
    const [bx, bz] = boulderCoords[i];
    const by = terrainHeightAt(bx, bz) - 0.15;
    const sx = 0.85 + ((i * 19) % 50) / 100;
    const sy = 0.55 + ((i * 13) % 40) / 100;
    const sz = 0.85 + ((i * 29) % 50) / 100;
    dummy.position.set(bx, by, bz);
    dummy.rotation.set(i * 0.4, i * 0.9, i * 0.2);
    dummy.scale.set(sx, sy, sz);
    dummy.updateMatrix();
    boulderInst.setMatrixAt(i, dummy.matrix);
    tintColor.setHex(boulderPalette[i % boulderPalette.length]);
    boulderInst.setColorAt(i, tintColor);
  }
  boulderInst.instanceMatrix.needsUpdate = true;
  if (boulderInst.instanceColor) boulderInst.instanceColor.needsUpdate = true;
  boulderInst.computeBoundingSphere();
  root.add(boulderInst);

  return {
    root,
    waterMesh,
    poolMesh,
    interiorGlowMeshes,
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      localMaterials.forEach((m) => m.dispose());
    },
  };
}
