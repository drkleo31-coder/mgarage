import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, MessageCircle, RotateCcw } from 'lucide-react';
import {
  buildWhatsAppUrl,
  CAMERA_PRESETS,
  FINISH_PRESETS,
  type CameraPresetId,
  type FinishModeId,
} from '../utils/mgarage';
import { buildLuxuryGtCoupe, type CarRig } from './carModelBuilder';

const _targetColor = new THREE.Color();
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();

function detectSoftwareGl(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function InteractiveCar3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activeFinish, setActiveFinish] = useState<FinishModeId>('polimento');
  const [activeCamera, setActiveCamera] = useState<CameraPresetId>('threeQuarter');
  const [controlsCollapsed, setControlsCollapsed] = useState(false);
  const [webglReady, setWebglReady] = useState(true);

  const finishRef = useRef<FinishModeId>(activeFinish);
  const cameraGoalRef = useRef<{
    active: boolean;
    pos: THREE.Vector3;
    target: THREE.Vector3;
  }>({
    active: false,
    pos: new THREE.Vector3(...CAMERA_PRESETS[0].position),
    target: new THREE.Vector3(...CAMERA_PRESETS[0].target),
  });
  const requestRenderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    finishRef.current = activeFinish;
    requestRenderRef.current?.();
  }, [activeFinish]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSoftwareGl = detectSoftwareGl();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglReady(false);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060607);
    scene.fog = new THREE.FogExp2(0x060607, 0.042);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      60
    );
    camera.position.set(...CAMERA_PRESETS[0].position);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...CAMERA_PRESETS[0].target);
    controls.enableZoom = false; // Never hijack page vertical scroll
    controls.enablePan = false;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minPolarAngle = 0.45;
    controls.maxPolarAngle = Math.PI / 2 - 0.06;
    controls.rotateSpeed = 0.72;
    controls.update();

    // Warm / Cool 3-point studio lighting rig
    const hemiLight = new THREE.HemisphereLight(0x9fb8db, 0x161412, 0.55);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1d6, 2.2);
    keyLight.position.set(5.5, 7.5, 4.5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.left = -4.5;
    keyLight.shadow.camera.right = 4.5;
    keyLight.shadow.camera.top = 4.5;
    keyLight.shadow.camera.bottom = -4.5;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const goldRimLight = new THREE.PointLight(0xe5c158, 2.2, 18, 1.6);
    goldRimLight.position.set(-4.5, 2.8, -3.5);
    scene.add(goldRimLight);

    const frontAccentLight = new THREE.PointLight(0xf8f0d8, 1.1, 14, 1.5);
    frontAccentLight.position.set(2.8, 1.4, 4.8);
    scene.add(frontAccentLight);

    // Studio floor extending to horizon fog
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x070709,
      metalness: 0.35,
      roughness: 0.65,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.06;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Multi-part sculpted GT Coupe
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const carRig: CarRig = buildLuxuryGtCoupe(maxAniso);
    scene.add(carRig.root);

    // Subtle floating gold dust motes around the turntable
    const sparkCount = 48;
    const sparkPositions = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      const angle = (i / sparkCount) * Math.PI * 2;
      const radius = 2.6 + (i % 5) * 0.45;
      sparkPositions[i * 3] = Math.cos(angle) * radius;
      sparkPositions[i * 3 + 1] = 0.25 + (i % 7) * 0.28;
      sparkPositions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xf3d578,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparks);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let frameId = 0;
    let disposed = false;
    let renderBusy = false;
    let renderDirty = false;
    let userInteracting = false;
    const pointerParallax = { x: 0, y: 0 };
    const clock = new THREE.Clock();

    const applyFinishStep = (dt: number, immediate: boolean) => {
      const preset = FINISH_PRESETS.find((f) => f.id === finishRef.current) ?? FINISH_PRESETS[1];
      _targetColor.setHex(preset.bodyColor);
      if (immediate) {
        carRig.bodyMaterial.color.copy(_targetColor);
        carRig.bodyMaterial.metalness = preset.metalness;
        carRig.bodyMaterial.roughness = preset.roughness;
        carRig.bodyMaterial.clearcoat = preset.clearcoat;
        carRig.bodyMaterial.clearcoatRoughness = preset.clearcoatRoughness;
        goldRimLight.intensity = preset.rimLightIntensity;
        return false;
      }

      const alpha = 1 - Math.exp(-8 * dt);
      carRig.bodyMaterial.color.lerp(_targetColor, alpha);
      carRig.bodyMaterial.metalness = THREE.MathUtils.lerp(
        carRig.bodyMaterial.metalness,
        preset.metalness,
        alpha
      );
      carRig.bodyMaterial.roughness = THREE.MathUtils.lerp(
        carRig.bodyMaterial.roughness,
        preset.roughness,
        alpha
      );
      carRig.bodyMaterial.clearcoat = THREE.MathUtils.lerp(
        carRig.bodyMaterial.clearcoat,
        preset.clearcoat,
        alpha
      );
      carRig.bodyMaterial.clearcoatRoughness = THREE.MathUtils.lerp(
        carRig.bodyMaterial.clearcoatRoughness,
        preset.clearcoatRoughness,
        alpha
      );
      goldRimLight.intensity = THREE.MathUtils.lerp(
        goldRimLight.intensity,
        preset.rimLightIntensity,
        alpha
      );

      const colorDelta =
        Math.abs(carRig.bodyMaterial.color.r - _targetColor.r) +
        Math.abs(carRig.bodyMaterial.color.g - _targetColor.g) +
        Math.abs(carRig.bodyMaterial.color.b - _targetColor.b);
      return colorDelta > 0.005;
    };

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const stepScene = (dt: number) => {
      let needsAnotherFrame = applyFinishStep(dt, isSoftwareGl);

      if (cameraGoalRef.current.active) {
        const camAlpha = isSoftwareGl ? 1 : 1 - Math.exp(-6.5 * dt);
        _targetCamPos.copy(cameraGoalRef.current.pos);
        _targetLookAt.copy(cameraGoalRef.current.target);
        camera.position.lerp(_targetCamPos, camAlpha);
        controls.target.lerp(_targetLookAt, camAlpha);
        if (camera.position.distanceTo(_targetCamPos) < 0.03) {
          camera.position.copy(_targetCamPos);
          controls.target.copy(_targetLookAt);
          cameraGoalRef.current.active = false;
        } else {
          needsAnotherFrame = true;
        }
      }

      if (!prefersReducedMotion && !isSoftwareGl && !userInteracting) {
        carRig.root.rotation.y += dt * 0.22;
        carRig.root.rotation.x = THREE.MathUtils.damp(
          carRig.root.rotation.x,
          pointerParallax.y * 0.035,
          4,
          dt
        );
        sparks.rotation.y -= dt * 0.08;
      }

      controls.update();
      return needsAnotherFrame;
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
        const dt = Math.min(clock.getDelta(), 0.05);
        const keepStepping = stepScene(dt);
        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (!disposed && (renderDirty || keepStepping)) {
            requestRender();
          }
        };

        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    };

    requestRenderRef.current = requestRender;

    const onControlsStart = () => {
      userInteracting = true;
      cameraGoalRef.current.active = false;
    };
    const onControlsEnd = () => {
      userInteracting = false;
    };
    const onControlsChange = () => {
      if (isSoftwareGl || prefersReducedMotion) {
        requestRender();
      }
    };

    controls.addEventListener('start', onControlsStart);
    controls.addEventListener('end', onControlsEnd);
    controls.addEventListener('change', onControlsChange);

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointerParallax.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerParallax.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    renderer.domElement.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      if (!container || disposed) return;
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', onResize, { passive: true });

    const onContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
    };
    const onContextRestored = () => {
      requestRender();
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    // Continuous GPU loop vs On-demand Software-WebGL / Reduced-Motion path
    if (isSoftwareGl || prefersReducedMotion) {
      applyFinishStep(0.016, true);
      requestRender();
    } else {
      const tick = () => {
        if (disposed) return;
        const dt = Math.min(clock.getDelta(), 0.05);
        stepScene(dt);
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(tick);
      };
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.removeEventListener('start', onControlsStart);
      controls.removeEventListener('end', onControlsEnd);
      controls.removeEventListener('change', onControlsChange);
      controls.dispose();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      window.removeEventListener('resize', onResize);

      carRig.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      sparkGeo.dispose();
      sparkMat.dispose();
      envTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleSelectCamera = (presetId: CameraPresetId) => {
    setActiveCamera(presetId);
    const preset = CAMERA_PRESETS.find((c) => c.id === presetId);
    if (preset) {
      cameraGoalRef.current = {
        active: true,
        pos: new THREE.Vector3(...preset.position),
        target: new THREE.Vector3(...preset.target),
      };
      requestRenderRef.current?.();
    }
  };

  const currentFinish = FINISH_PRESETS.find((f) => f.id === activeFinish) ?? FINISH_PRESETS[1];

  return (
    <section
      id="estudio-3d"
      className="relative border-t border-[#D4AF37]/20 bg-[#060607] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Title Row */}
        <div className="flex flex-col justify-between gap-4 pb-8 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.26em] uppercase text-[#D4AF37]">
              Experiência Visual Interativa
            </p>
            <h2 className="font-display text-balance text-3xl font-semibold tracking-[0.04em] text-[#F8F7F4] sm:text-5xl">
              Estúdio 3D de Reflexos.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#B5B0A6]">
            Arraste sobre o veículo para girar em 360° e alterne os acabamentos abaixo para observar como a luz interage com a carroceria.
          </p>
        </div>

        {/* 3D Viewport Container */}
        <div
          data-testid="car-3d-stage"
          data-finish={activeFinish}
          data-camera={activeCamera}
          className="relative h-[470px] w-full overflow-hidden rounded-sm border border-[#D4AF37]/25 bg-[#060607] sm:h-[580px]"
        >
          {/* Dedicated isolated WebGL mount ref */}
          <div
            ref={mountRef}
            data-testid="car-3d-canvas-mount"
            aria-label="Visualização 3D interativa de veículo esportivo"
            className="h-full w-full cursor-grab active:cursor-grabbing"
          />

          {/* Top-Left Minimal Spec Header (No floating clutter, solid rgba surface) */}
          <div className="pointer-events-none absolute top-4 left-4 right-4 z-10 flex items-start justify-between gap-4 sm:top-6 sm:left-6 sm:right-6">
            <div className="rounded-sm border border-white/10 bg-[#0B0B0E]/90 px-4 py-2.5">
              <p className="font-display text-xs font-semibold tracking-[0.18em] uppercase text-[#F3D578]">
                {currentFinish.label}
              </p>
              <p className="mt-0.5 text-xs text-[#C7C3B8]">{currentFinish.subtitle}</p>
            </div>

            <button
              type="button"
              onClick={() => handleSelectCamera('threeQuarter')}
              aria-label="Resetar ângulo da câmera 3D"
              className="pointer-events-auto inline-flex min-h-[40px] items-center gap-1.5 rounded-sm border border-white/15 bg-[#0B0B0E]/90 px-3 py-2 text-xs font-medium text-[#E5E2DC] transition-colors hover:border-[#D4AF37]/60 hover:text-[#F3D578] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Resetar ângulo</span>
            </button>
          </div>

          {/* Fallback if WebGL unavailable */}
          {!webglReady && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0B0B0E] p-6 text-center">
              <img
                src="/assets/aistudio/IMG_5647_53d29c7d.png"
                alt="M Garage Estética Automotiva"
                className="mb-4 h-28 w-28 rounded-full border border-[#D4AF37]/40 object-cover"
              />
              <p className="font-display text-lg text-[#F8F7F4]">
                Visualização Interativa M Garage
              </p>
              <p className="mt-2 max-w-md text-sm text-[#A9A59B]">
                Seu navegador está operando sem aceleração WebGL. Utilize os links abaixo para solicitar um orçamento.
              </p>
            </div>
          )}

          {/* Collapsible Bottom Control Dock (Zero backdrop-blur over WebGL) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex flex-col items-center px-3 sm:bottom-5">
            <button
              type="button"
              onClick={() => setControlsCollapsed((prev) => !prev)}
              aria-expanded={!controlsCollapsed}
              className="pointer-events-auto mb-1.5 inline-flex min-h-[34px] items-center gap-1.5 rounded-sm border border-[#D4AF37]/35 bg-[#0B0B0E]/95 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#F3D578] transition-colors hover:border-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              {controlsCollapsed ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Mostrar controles</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Ocultar controles</span>
                </>
              )}
            </button>

            {!controlsCollapsed && (
              <div className="pointer-events-auto w-full max-w-5xl rounded-sm border border-[#D4AF37]/30 bg-[#0B0B0E]/95 px-3 py-2.5 shadow-[0_18px_40px_rgba(0,0,0,0.85)] sm:px-4">
                <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
                  {/* Finish Presets */}
                  <div className="flex flex-wrap items-center gap-1.5 lg:flex-nowrap">
                    {FINISH_PRESETS.map((preset) => {
                      const selected = preset.id === activeFinish;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setActiveFinish(preset.id)}
                          className={`min-h-[36px] rounded-sm px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                            selected
                              ? 'bg-[#D4AF37] font-semibold text-[#060607]'
                              : 'border border-white/10 bg-[#141419] text-[#D6D3CD] hover:border-[#D4AF37]/50 hover:text-[#F8F7F4]'
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Camera Angle Presets + Contextual CTA */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2 lg:flex-nowrap lg:border-t-0 lg:pt-0">
                    <div className="flex items-center gap-1.5">
                      {CAMERA_PRESETS.map((cam) => {
                        const selected = cam.id === activeCamera;
                        return (
                          <button
                            key={cam.id}
                            type="button"
                            onClick={() => handleSelectCamera(cam.id)}
                            className={`min-h-[36px] rounded-sm px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                              selected
                                ? 'border border-[#D4AF37] bg-[#D4AF37]/15 text-[#F3D578]'
                                : 'border border-white/10 bg-[#141419] text-[#B5B0A6] hover:text-[#F8F7F4]'
                            }`}
                          >
                            {cam.label}
                          </button>
                        );
                      })}
                    </div>

                    <a
                      href={buildWhatsAppUrl(currentFinish.linkedService)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[36px] items-center gap-1.5 rounded-sm border border-[#D4AF37]/60 bg-[#D4AF37] px-3.5 py-1.5 text-xs font-bold tracking-[0.06em] uppercase text-[#060607] transition-colors hover:bg-[#E2BE53] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3D578]"
                    >
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Orçamento</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
