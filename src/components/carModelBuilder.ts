import * as THREE from 'three';

export interface CarRig {
  root: THREE.Group;
  bodyMaterial: THREE.MeshPhysicalMaterial;
  trimMaterial: THREE.MeshStandardMaterial;
  wheels: THREE.Group[];
  turntableRing: THREE.Mesh;
  dispose: () => void;
}

function createProceduralCarbonTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#141418';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = '#1d1d23';
    for (let y = 0; y < 64; y += 8) {
      for (let x = 0; x < 64; x += 8) {
        if (((x + y) / 8) % 2 === 0) {
          ctx.fillRect(x, y, 4, 8);
        } else {
          ctx.fillRect(x, y, 8, 4);
        }
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 18, 128, 128, 126);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.92)');
    grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.55)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildLuxuryGtCoupe(maxAnisotropy: number): CarRig {
  const root = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  const carbonTex = createProceduralCarbonTexture();
  carbonTex.anisotropy = maxAnisotropy;
  textures.push(carbonTex);

  const shadowTex = createContactShadowTexture();
  textures.push(shadowTex);

  // Materials with clear roughness differentiation (>= 0.25 across adjacent parts)
  const bodyMaterial = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x0b0b0e,
      metalness: 0.78,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.4,
    })
  );

  const carbonMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: carbonTex,
      metalness: 0.25,
      roughness: 0.58,
    })
  );

  const glassMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x090b10,
      metalness: 0.12,
      roughness: 0.06,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      envMapIntensity: 1.7,
    })
  );

  const goldMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.94,
      roughness: 0.2,
      envMapIntensity: 1.5,
    })
  );

  const tireMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x111114,
      metalness: 0.04,
      roughness: 0.86,
    })
  );

  const alloyMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x26262c,
      metalness: 0.9,
      roughness: 0.22,
    })
  );

  const headlightMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xfff8e7,
      emissive: 0xffe4a3,
      emissiveIntensity: 2.2,
      roughness: 0.1,
    })
  );

  const taillightMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd91c24,
      emissive: 0xc8141d,
      emissiveIntensity: 1.9,
      roughness: 0.18,
    })
  );

  // 1. Primary Silhouette: Sleek Low-Slung Supercar Profile (Front faces +Z)
  const bodyShape = new THREE.Shape();
  bodyShape.moveTo(-2.15, 0.23);
  bodyShape.lineTo(-2.22, 0.52);
  bodyShape.quadraticCurveTo(-2.18, 0.72, -1.72, 0.8);
  bodyShape.quadraticCurveTo(-1.08, 0.86, -0.62, 0.88);
  bodyShape.quadraticCurveTo(-0.12, 1.24, 0.46, 1.22);
  bodyShape.quadraticCurveTo(1.12, 1.18, 1.66, 0.82);
  bodyShape.quadraticCurveTo(2.08, 0.68, 2.24, 0.44);
  bodyShape.quadraticCurveTo(2.26, 0.29, 2.08, 0.22);
  bodyShape.closePath();

  const bodyExtrude = trackGeo(
    new THREE.ExtrudeGeometry(bodyShape, {
      depth: 1.62,
      bevelEnabled: true,
      bevelSegments: 7,
      steps: 1,
      bevelSize: 0.11,
      bevelThickness: 0.13,
      curveSegments: 32,
    })
  );
  bodyExtrude.translate(0, 0, -0.81);
  bodyExtrude.rotateY(Math.PI / 2); // Align car front toward +Z
  bodyExtrude.computeVertexNormals();

  const mainBody = new THREE.Mesh(bodyExtrude, bodyMaterial);
  mainBody.castShadow = true;
  mainBody.receiveShadow = true;
  root.add(mainBody);

  // 2. Wheel coordinates & Side Aero Intakes
  const wheelCoords: [number, number, number][] = [
    [-0.86, 0.36, 1.32],
    [0.86, 0.36, 1.32],
    [-0.88, 0.38, -1.32],
    [0.88, 0.38, -1.32],
  ];

  const sideScoopGeo = trackGeo(new THREE.BoxGeometry(0.1, 0.24, 0.64));
  [-0.9, 0.9].forEach((x) => {
    const scoop = new THREE.Mesh(sideScoopGeo, carbonMat);
    scoop.position.set(x, 0.52, -0.35);
    root.add(scoop);
  });

  // 3. Secondary Read: Smoked Aerodynamic Cabin Canopy (raised & contoured outside body shell)
  const cabinShape = new THREE.Shape();
  cabinShape.moveTo(-0.58, 0.88);
  cabinShape.quadraticCurveTo(-0.08, 1.32, 0.46, 1.3);
  cabinShape.quadraticCurveTo(1.06, 1.24, 1.48, 0.86);
  cabinShape.lineTo(-0.58, 0.88);

  const cabinGeo = trackGeo(
    new THREE.ExtrudeGeometry(cabinShape, {
      depth: 1.42,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.05,
      bevelThickness: 0.06,
      curveSegments: 24,
    })
  );
  cabinGeo.translate(0, 0, -0.71);
  cabinGeo.rotateY(Math.PI / 2);
  const cabinMesh = new THREE.Mesh(cabinGeo, glassMat);
  cabinMesh.position.y = 0.05;
  root.add(cabinMesh);

  // 4. Lower Carbon Aero Splitter, Front Grille Intake & Rear Diffuser
  const undertrayGeo = trackGeo(new THREE.BoxGeometry(1.88, 0.075, 4.44));
  const undertray = new THREE.Mesh(undertrayGeo, carbonMat);
  undertray.position.set(0, 0.2, 0.02);
  undertray.castShadow = true;
  root.add(undertray);

  const frontGrilleGeo = trackGeo(new THREE.BoxGeometry(1.38, 0.14, 0.12));
  const frontGrille = new THREE.Mesh(frontGrilleGeo, carbonMat);
  frontGrille.position.set(0, 0.31, 2.31);
  root.add(frontGrille);

  const goldSplitterLipGeo = trackGeo(new THREE.BoxGeometry(1.82, 0.028, 0.1));
  const goldSplitterLip = new THREE.Mesh(goldSplitterLipGeo, goldMat);
  goldSplitterLip.position.set(0, 0.19, 2.34);
  root.add(goldSplitterLip);

  // Rear Wing Spoiler + Uprights
  const wingBladeGeo = trackGeo(new THREE.BoxGeometry(1.76, 0.045, 0.28));
  const wingBlade = new THREE.Mesh(wingBladeGeo, carbonMat);
  wingBlade.position.set(0, 1.07, -2.04);
  wingBlade.rotation.x = -0.1;
  wingBlade.castShadow = true;
  root.add(wingBlade);

  const wingPylonGeo = trackGeo(new THREE.BoxGeometry(0.04, 0.2, 0.16));
  [-0.5, 0.5].forEach((x) => {
    const pylon = new THREE.Mesh(wingPylonGeo, goldMat);
    pylon.position.set(x, 0.96, -1.98);
    root.add(pylon);
  });

  // 5. Accent Details: Sleek Angled LED Headlights, Rear LED Lightbar, Side Mirrors, Quad Exhausts
  const headlightGeo = trackGeo(new THREE.BoxGeometry(0.44, 0.05, 0.14));
  [-0.62, 0.62].forEach((x) => {
    const hl = new THREE.Mesh(headlightGeo, headlightMat);
    hl.position.set(x, 0.56, 2.24);
    hl.rotation.y = x > 0 ? -0.24 : 0.24;
    hl.rotation.x = 0.25;
    root.add(hl);
  });

  const lightbarGeo = trackGeo(new THREE.BoxGeometry(1.68, 0.046, 0.09));
  const lightbar = new THREE.Mesh(lightbarGeo, taillightMat);
  lightbar.position.set(0, 0.74, -2.3);
  root.add(lightbar);

  const mirrorGeo = trackGeo(new THREE.BoxGeometry(0.18, 0.065, 0.12));
  [-0.95, 0.95].forEach((x) => {
    const mirror = new THREE.Mesh(mirrorGeo, bodyMaterial);
    mirror.position.set(x, 0.87, 0.52);
    root.add(mirror);
  });

  const exhaustGeo = trackGeo(new THREE.CylinderGeometry(0.048, 0.048, 0.14, 16));
  exhaustGeo.rotateX(Math.PI / 2);
  [-0.56, -0.43, 0.43, 0.56].forEach((x) => {
    const pipe = new THREE.Mesh(exhaustGeo, goldMat);
    pipe.position.set(x, 0.28, -2.28);
    root.add(pipe);
  });

  // 6. Sculpted Multi-Part Wheels (Tire + Alloy Rim + Gold Spokes + Brake Caliper)
  const tireGeo = trackGeo(new THREE.CylinderGeometry(0.36, 0.36, 0.25, 28));
  tireGeo.rotateZ(Math.PI / 2);

  const rimDrumGeo = trackGeo(new THREE.CylinderGeometry(0.25, 0.25, 0.26, 24));
  rimDrumGeo.rotateZ(Math.PI / 2);

  const spokeGeo = trackGeo(new THREE.BoxGeometry(0.27, 0.46, 0.032));
  const hubCapGeo = trackGeo(new THREE.CylinderGeometry(0.065, 0.065, 0.275, 16));
  hubCapGeo.rotateZ(Math.PI / 2);

  const caliperGeo = trackGeo(new THREE.BoxGeometry(0.08, 0.16, 0.11));

  const wheels: THREE.Group[] = wheelCoords.map(([x, y, z], idx) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(x, y, z);

    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.castShadow = true;
    wheelGroup.add(tire);

    const rim = new THREE.Mesh(rimDrumGeo, alloyMat);
    wheelGroup.add(rim);

    for (let s = 0; s < 5; s++) {
      const spoke = new THREE.Mesh(spokeGeo, goldMat);
      spoke.rotation.x = (s * Math.PI) / 5;
      wheelGroup.add(spoke);
    }

    const hub = new THREE.Mesh(hubCapGeo, goldMat);
    wheelGroup.add(hub);

    const caliper = new THREE.Mesh(caliperGeo, goldMat);
    caliper.position.set(x > 0 ? -0.02 : 0.02, 0.06, idx < 2 ? -0.14 : 0.14);
    wheelGroup.add(caliper);

    root.add(wheelGroup);
    return wheelGroup;
  });

  // 7. Grounding Contact Shadow + Studio Turntable Ring (offset by >= 0.02 on Y to prevent Z-fighting)
  const contactShadowGeo = trackGeo(new THREE.PlaneGeometry(3.8, 5.6));
  contactShadowGeo.rotateX(-Math.PI / 2);
  const contactShadowMat = trackMat(
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    })
  );
  const contactShadow = new THREE.Mesh(contactShadowGeo, contactShadowMat);
  contactShadow.position.y = 0.02;
  root.add(contactShadow);

  const turntableBaseGeo = trackGeo(new THREE.CylinderGeometry(3.35, 3.45, 0.06, 64));
  const turntableBaseMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0c0c10,
      metalness: 0.45,
      roughness: 0.42,
    })
  );
  const turntableBase = new THREE.Mesh(turntableBaseGeo, turntableBaseMat);
  turntableBase.position.y = -0.03;
  turntableBase.receiveShadow = true;
  root.add(turntableBase);

  const ringGeo = trackGeo(new THREE.RingGeometry(3.26, 3.32, 80));
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide,
    })
  );
  const turntableRing = new THREE.Mesh(ringGeo, ringMat);
  turntableRing.position.y = 0.008;
  root.add(turntableRing);

  return {
    root,
    bodyMaterial,
    trimMaterial: goldMat,
    wheels,
    turntableRing,
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
    },
  };
}
