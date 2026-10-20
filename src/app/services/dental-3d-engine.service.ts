import {Injectable, NgZone, inject, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {ViewingMode, ToothNumberingSystem, LandmarkHoverInfo} from '../models/dental-3d.model';
import {AnatomyTooltipService} from './anatomy-tooltip.service';

export interface AnnotationPoint {
  id: string;
  label: string;
  worldPosition: THREE.Vector3;
  screenX: number;
  screenY: number;
  visible: boolean;
}

export interface DentalManifestPart {
  id: string;
  name: string;
  group: 'bone' | 'tooth' | 'pdl' | 'pulp' | 'canal' | 'sinus' | 'appliance';
  source: 'diaz' | 'toothfairy' | 'openfulljaw' | 'fang';
  buffer?: string;
  positions: number;
  normals: number;
  indices: number;
  vertexCount: number;
  indexCount: number;
  bounds: [[number, number, number], [number, number, number]];
  fdi?: number;
  axes?: {
    side: [number, number, number];
    up: [number, number, number];
    out: [number, number, number];
  };
}

export interface DentalManifest {
  parts: DentalManifestPart[];
}

@Injectable({
  providedIn: 'root',
})
export class Dental3DEngineService {
  private ngZone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);
  private tooltipService = inject(AnatomyTooltipService);

  private currentlyHoveredMesh: THREE.Mesh | null = null;

  // Core Three.js members
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  controls: OrbitControls | null = null;

  // Root group for the active dental model
  modelGroup!: THREE.Group;

  // Clipping plane for cross-section views
  private clippingPlane!: THREE.Plane;

  // Lighting
  private ambientLight!: THREE.AmbientLight;
  private keyLight!: THREE.DirectionalLight;
  private fillLight!: THREE.DirectionalLight;
  private rimLight!: THREE.DirectionalLight;
  private groundShadow: THREE.Mesh | null = null;

  // State
  activeMode: ViewingMode = 'surface';
  isAutoRotating = false;
  selectedStructureId: string | null = null;
  selectedToothFdi: number | null = null;
  currentNumberingSystem: ToothNumberingSystem = 'fdi';
  boneOpacity = 1.0;

  // Full Dentition Filter State
  dentitionArchFilter: 'all' | 'upper' | 'lower' = 'all';
  dentitionQuadrantFilter: 1 | 2 | 3 | 4 | null = null;
  boneOpacityMode: 'hidden' | 'visible' | 'translucent' = 'translucent';
  showPulpLayer = false;
  showTeethLayer = true;
  showBoneLayer = true;
  showMandibleLayer = true;
  showMaxillaLayer = true;
  showCanalLayer = true;
  showSinusLayer = true;

  readonly hoverTooltip = signal<LandmarkHoverInfo>({
    visible: false,
    label: '',
    category: '',
    screenX: 0,
    screenY: 0,
  });

  // Published Manifest & ArrayBuffer Caches
  private manifest: DentalManifest | null = null;
  private bufferCache: Record<string, ArrayBuffer> = {};
  private manifestPromise: Promise<DentalManifest> | null = null;
  private initPromise: Promise<void> | null = null;

  // Materials Cache
  private materials: Record<string, THREE.Material> = {};

  // Animation Loop & Raycasting
  private animationFrameId: number | null = null;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  // Callbacks
  onAnnotationsUpdate?: (points: AnnotationPoint[]) => void;
  onToothClicked?: (fdi: number, name: string) => void;
  onStructureClicked?: (structureId: string) => void;
  onAssetLoaded?: () => void;
  onAssetLoadError?: (err: Error) => void;

  async initialize(container: HTMLElement): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.initPromise = (async () => {
      if (this.scene) {
        this.dispose();
      }

      // Dynamically import OrbitControls
      const {OrbitControls} = await import('three/examples/jsm/controls/OrbitControls.js');

      this.scene = new THREE.Scene();
      this.scene.background = null; // Transparent scene to display rich CSS radial studio gradient
      this.modelGroup = new THREE.Group();
      this.scene.add(this.modelGroup);

      // Subtle soft contact ground shadow disc beneath the model
      this.addGroundShadow();

      // Coronal/Sagittal clipping plane
      this.clippingPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);

      const width = container.clientWidth || 600;
      const height = container.clientHeight || 400;
      const aspect = width / height;

      this.camera = new THREE.PerspectiveCamera(40, aspect, 0.01, 500);
      this.camera.position.set(0, 0, 75);

      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.localClippingEnabled = true;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.35;

      container.appendChild(this.renderer.domElement);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.06;
      this.controls.enablePan = true;
      this.controls.minDistance = 5;
      this.controls.maxDistance = 250;
      this.controls.target.set(0, 0, 0);

      // Cancel in-flight camera animations immediately when user interacts with controls
      this.controls.addEventListener('start', () => {
        if (this.cameraAnimId !== null) {
          cancelAnimationFrame(this.cameraAnimId);
          this.cameraAnimId = null;
        }
      });

      this.setupLighting();
      this.initMaterialCache();
      this.bindEvents(container);
      this.startAnimationLoop();
    })();

    return this.initPromise;
  }

  private setupLighting(): void {
    // Hemispheric ambient light simulating neutral surgical studio
    const hemiLight = new THREE.HemisphereLight(0xfffdfa, 0x111115, 1.25);
    this.scene.add(hemiLight);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(this.ambientLight);

    // Soft Key Light
    this.keyLight = new THREE.DirectionalLight(0xfffaf0, 2.1);
    this.keyLight.position.set(32, 42, 48);
    this.scene.add(this.keyLight);

    // Subtle Fill Light: Soft neutral diffuse fill
    this.fillLight = new THREE.DirectionalLight(0xd1d5db, 1.1);
    this.fillLight.position.set(-32, -12, 28);
    this.scene.add(this.fillLight);

    // Controlled Neutral Rim Light (No blue tint)
    this.rimLight = new THREE.DirectionalLight(0xf8fafc, 0.95);
    this.rimLight.position.set(0, 32, -48);
    this.scene.add(this.rimLight);

    // Subtle Apical Bounce Light
    const bounceLight = new THREE.DirectionalLight(0x4b5563, 0.55);
    bounceLight.position.set(0, -38, 18);
    this.scene.add(bounceLight);
  }

  private initMaterialCache(): void {
    // 1. Natural Enamel (Physically based medical enamel: hydroxyapatite refractive index 1.62, warm natural A1/A2 ivory, subtle organic clearcoat and sheen)
    this.materials['enamel'] = new THREE.MeshPhysicalMaterial({
      color: 0xfaf6ee, // Natural VITA A1/A2 enamel ivory
      roughness: 0.22,
      metalness: 0.0,
      clearcoat: 0.26,
      clearcoatRoughness: 0.12,
      ior: 1.62,
      specularIntensity: 0.85,
      specularColor: 0xffffff,
      sheen: 0.12,
      sheenRoughness: 0.25,
      sheenColor: 0xfdf8ee,
      side: THREE.FrontSide,
      depthWrite: true,
    });

    // 1b. Translucent Enamel (Glass-like translucent shell revealing internal pulp and root structures)
    this.materials['enamel_transparent'] = new THREE.MeshPhysicalMaterial({
      color: 0xfaf6ee,
      roughness: 0.18,
      metalness: 0.0,
      transmission: 0.82,
      opacity: 0.38,
      transparent: true,
      ior: 1.62,
      depthWrite: false,
      side: THREE.FrontSide,
    });

    // 2. Sagittal Section Dentin Wall (Double-sided clipped material rendering solid calcified wall around pulp chamber)
    this.materials['dentin_section'] = new THREE.MeshStandardMaterial({
      color: 0xf2ebdc, // Biological calcified ivory
      roughness: 0.42,
      metalness: 0.0,
      side: THREE.DoubleSide, // Crucial for clean solid cross-section without back-face culling
      clippingPlanes: [this.clippingPlane],
      clipShadows: true,
    });

    // 3. X-Ray Translucent Outer Shell (Optical glass-like translucent shell revealing internal pulp path)
    this.materials['xray_shell'] = new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      roughness: 0.12,
      metalness: 0.0,
      transmission: 0.90, // Optical transmission
      opacity: 0.32,
      transparent: true,
      ior: 1.52,
      depthWrite: false, // Allows internal pulp to render crisply without z-buffer occlusion
      side: THREE.DoubleSide,
    });

    // 4. Natural Vascular Pulp (Micro-vascularized soft tissue, rich restrained clinical carmine red)
    this.materials['pulp'] = new THREE.MeshStandardMaterial({
      color: 0xa82435, // Restrained clinical deep red
      emissive: new THREE.Color(0x3b070f),
      emissiveIntensity: 0.20,
      roughness: 0.35,
      metalness: 0.0,
      side: THREE.DoubleSide,
      clippingPlanes: [this.clippingPlane],
      clipShadows: true,
    });

    // 4b. Pulp Cross-Section (Intact 3D pulp canal tree rendered inside the sectioned tooth cavity)
    this.materials['pulp_section'] = new THREE.MeshStandardMaterial({
      color: 0xa82435,
      emissive: new THREE.Color(0x3b070f),
      emissiveIntensity: 0.25,
      roughness: 0.35,
      metalness: 0.0,
      side: THREE.DoubleSide,
      depthWrite: true,
      clipShadows: false,
    });

    // 5. X-Ray Emphasized Pulp (Solid radiopaque clinical red for radiographic contrast)
    this.materials['pulp_xray'] = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: new THREE.Color(0x991b1b),
      emissiveIntensity: 0.55,
      roughness: 0.25,
      metalness: 0.0,
      depthWrite: true,
      side: THREE.DoubleSide,
      clippingPlanes: [this.clippingPlane],
    });

    // 6. Isolated Endodontic Pulp (High-definition pulp horns & canal morphology in vibrant clinical red)
    this.materials['pulp_isolated'] = new THREE.MeshPhysicalMaterial({
      color: 0xdc2626,
      emissive: new THREE.Color(0x7f1d1d),
      emissiveIntensity: 0.45,
      roughness: 0.28,
      metalness: 0.0,
      clearcoat: 0.4,
      clearcoatRoughness: 0.12,
      side: THREE.DoubleSide,
      depthWrite: true,
      clippingPlanes: [this.clippingPlane],
    });

    // 7. Faint Ghost Silhouette (Subtle spatial reference envelope in pulp isolation mode)
    this.materials['tooth_ghost_faint'] = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.8,
      transparent: true,
      opacity: 0.07,
      depthWrite: false,
      side: THREE.FrontSide,
      clippingPlanes: [this.clippingPlane],
    });

    // 8. Periodontal Ligament (PDL) (Collagenous desmodontal fibers)
    this.materials['pdl'] = new THREE.MeshStandardMaterial({
      color: 0xd4a5a5,
      roughness: 0.65,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
      clippingPlanes: [this.clippingPlane],
    });

    // 9. Inferior Alveolar Nerve & Vascular Canal (Clinical neurovascular conduit with vivid luminous nerve amber/gold)
    this.materials['canal'] = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Luminous nerve amber gold
      emissive: new THREE.Color(0xfbbf24),
      emissiveIntensity: 0.65,
      roughness: 0.28,
      metalness: 0.05,
      side: THREE.DoubleSide,
      depthWrite: true,
      clippingPlanes: [this.clippingPlane],
      clipShadows: false,
    });

    // 10. Alveolar & Mandibular Cortical Bone (Clean calcified biological bone matrix)
    this.materials['bone'] = new THREE.MeshStandardMaterial({
      color: 0xded5c6,
      roughness: 0.74,
      metalness: 0.01,
      transparent: true,
      opacity: 0.95,
      side: THREE.FrontSide,
      clippingPlanes: [this.clippingPlane],
    });

    // 11. Maxillary Sinus Floor (Thin schneiderian membrane)
    this.materials['sinus'] = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.55,
      transparent: true,
      opacity: 0.38,
      side: THREE.FrontSide,
      clippingPlanes: [this.clippingPlane],
    });

    // 12. Gingiva / Attached Gum Tissue (Natural pale salmon pink, stippled keratinized mucosa)
    this.materials['gingiva'] = new THREE.MeshStandardMaterial({
      color: 0xd47e82,
      roughness: 0.58,
      metalness: 0.0,
      side: THREE.FrontSide,
      clippingPlanes: [this.clippingPlane],
    });

    // 13. X-Ray Radiographic Material (High-contrast radiopaque dental enamel and radiolucent pulp)
    this.materials['xray_tooth'] = this.materials['xray_shell'];

    this.materials['xray_bone'] = new THREE.MeshPhysicalMaterial({
      color: 0x64748b,
      roughness: 0.25,
      transmission: 0.85,
      opacity: 0.22,
      transparent: true,
      depthWrite: true,
      side: THREE.FrontSide,
      clippingPlanes: [this.clippingPlane],
    });

    // 14. Selected Highlight (Translucent clinical tooth shell allowing the internal red pulp and canals to be clearly visible)
    this.materials['selected_highlight'] = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: new THREE.Color(0xd1d5db), // Crisp clinical silver-white glow
      emissiveIntensity: 0.25,
      roughness: 0.16,
      metalness: 0.0,
      transmission: 0.78, // High transmission reveals the internal red pulp chamber & canal tree
      opacity: 0.50,
      transparent: true,
      ior: 1.54,
      clearcoat: 0.5,
      clearcoatRoughness: 0.08,
      depthWrite: false, // Prevents occluding the internal pulp mesh
      side: THREE.FrontSide,
    });

    // 12. Caries / Decay Demineralization (Clinical necrotic and cavitated dentin)
    this.materials['decay_deep'] = new THREE.MeshStandardMaterial({
      color: 0x281912,
      roughness: 0.94,
      side: THREE.FrontSide,
      clippingPlanes: [this.clippingPlane],
    });

    // 13. Gutta-Percha Root Canal Obturation (Standard clinical alpha/beta phase gutta-percha)
    this.materials['gutta_percha'] = new THREE.MeshStandardMaterial({
      color: 0xc85624,
      roughness: 0.48,
      metalness: 0.0,
      side: THREE.FrontSide,
      clippingPlanes: [this.clippingPlane],
    });

    // 14. Aesthetic Ceramic Crown / Veneer (High translucency lithium disilicate / layered porcelain)
    this.materials['ceramic_crown'] = new THREE.MeshPhysicalMaterial({
      color: 0xfcfcfc,
      roughness: 0.12,
      metalness: 0.0,
      clearcoat: 0.65,
      clearcoatRoughness: 0.06,
      ior: 1.58,
      side: THREE.FrontSide,
    });

    // 15. Cortical Bone (Ivory dense compact outer bone shell)
    this.materials['bone_cortical'] = new THREE.MeshStandardMaterial({
      color: 0xefede8,
      roughness: 0.65,
      metalness: 0.0,
      transparent: true,
      opacity: 0.95,
      side: THREE.FrontSide,
      clippingPlanes: [this.clippingPlane],
    });

    // 16. Trabecular Bone (Warm porous cancellous spongy bone matrix)
    this.materials['bone_trabecular'] = new THREE.MeshStandardMaterial({
      color: 0xd6c6af,
      roughness: 0.82,
      metalness: 0.0,
      transparent: true,
      opacity: 0.98,
      side: THREE.FrontSide,
      clippingPlanes: [this.clippingPlane],
    });

    // 17. Metallic Orthodontic Appliance (Band & Loop Space Maintainer)
    this.materials['appliance'] = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.88,
      roughness: 0.2,
      side: THREE.DoubleSide,
      clippingPlanes: [this.clippingPlane],
    });

    // 18. Highlighted Periodontal Ligament (PDL) (Vivid glowing rose desmodonte)
    this.materials['pdl_highlight'] = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: new THREE.Color(0x881337),
      emissiveIntensity: 0.45,
      roughness: 0.4,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      clippingPlanes: [this.clippingPlane],
    });

    // 19. Dimmed Enamel (For non-selected teeth / non-focused quadrants in full arch view)
    this.materials['enamel_dimmed'] = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.55,
      transparent: true,
      opacity: 0.35,
      side: THREE.FrontSide,
    });

    // 20. Translucent Jaw Bone (Soft translucent bone matrix revealing internal canals and roots)
    this.materials['bone_translucent'] = new THREE.MeshStandardMaterial({
      color: 0xded5c6,
      roughness: 0.74,
      metalness: 0.01,
      transparent: true,
      opacity: 0.28,
      depthWrite: false, // Critical: allows internal canals and tooth roots to render crisply without occlusion
      side: THREE.FrontSide,
      clippingPlanes: [this.clippingPlane],
    });
  }

  private addGroundShadow(): void {
    if (typeof document === 'undefined') return;

    // Create a smooth radial gradient canvas texture for contact shadow
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
      gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.25)');
      gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.05)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);
    }

    const shadowTexture = new THREE.CanvasTexture(canvas);
    const shadowGeo = new THREE.PlaneGeometry(38, 38);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.7,
    });

    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -17.5, 0);
    this.groundShadow = shadowMesh;
    this.scene.add(shadowMesh);
  }

  /**
   * Load manifest.json and binary files
   */
  async loadManifest(): Promise<DentalManifest> {
    if (this.manifest) return this.manifest;
    if (this.manifestPromise) return this.manifestPromise;

    this.manifestPromise = (async () => {
      const res = await fetch('/models/dental/manifest.json');
      if (!res.ok) {
        throw new Error(`Failed to load manifest.json: ${res.statusText}`);
      }
      this.manifest = await res.json();
      return this.manifest!;
    })();

    return this.manifestPromise;
  }

  async getBuffer(bufferName = 'dental'): Promise<ArrayBuffer> {
    if (this.bufferCache[bufferName]) {
      return this.bufferCache[bufferName];
    }
    const filename = `${bufferName}.bin`;
    const res = await fetch(`/models/dental/${filename}`);
    if (!res.ok) {
      throw new Error(`Failed to load buffer ${filename}: ${res.statusText}`);
    }
    const buffer = await res.arrayBuffer();
    this.bufferCache[bufferName] = buffer;
    return buffer;
  }

  private geometryFor(part: DentalManifestPart, buffers: Record<string, ArrayBuffer>): THREE.BufferGeometry {
    const bufferKey = part.buffer || 'dental';
    const buffer = buffers[bufferKey];
    if (!buffer) throw new Error(`Buffer not found: ${bufferKey}`);

    if (!Number.isInteger(part.vertexCount) || part.vertexCount < 3 ||
        !Number.isInteger(part.indexCount) || part.indexCount < 3 || part.indexCount % 3 !== 0) {
      throw new Error(`Invalid mesh counts for ${part.id}`);
    }

    const positionBytes = part.vertexCount * 3 * Float32Array.BYTES_PER_ELEMENT;
    const normalBytes = positionBytes;
    const indexBytes = part.indexCount * Uint32Array.BYTES_PER_ELEMENT;
    const validRange = (offset: number, length: number): boolean =>
      Number.isInteger(offset) && offset >= 0 && offset % 4 === 0 && offset + length <= buffer.byteLength;

    if (!validRange(part.positions, positionBytes) ||
        !validRange(part.normals, normalBytes) ||
        !validRange(part.indices, indexBytes)) {
      throw new Error(`Mesh data for ${part.id} extends beyond buffer ${bufferKey}`);
    }

    const positions = new Float32Array(buffer, part.positions, part.vertexCount * 3);
    const normals = new Float32Array(buffer, part.normals, part.vertexCount * 3);
    const indices = new Uint32Array(buffer, part.indices, part.indexCount);
    for (const position of positions) {
      if (!Number.isFinite(position)) throw new Error(`Mesh ${part.id} contains a non-finite vertex position`);
    }
    for (const index of indices) {
      if (index >= part.vertexCount) throw new Error(`Mesh ${part.id} contains an out-of-range triangle index`);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    return geometry;
  }

  clearModel(): void {
    this.clearHoverHighlight();
    if (!this.modelGroup) return;

    // Models contain nested Groups, so dispose every geometry before detaching
    // the hierarchy. Materials are cached separately and intentionally retained.
    const geometries = new Set<THREE.BufferGeometry>();
    this.modelGroup.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (mesh.isMesh && mesh.geometry) geometries.add(mesh.geometry);
    });
    geometries.forEach((geometry) => geometry.dispose());

    this.modelGroup.clear();
    this.modelGroup.name = '';
  }

  /**
   * Load a specific single tooth model (ToothFairy CT scan or Kang immature molar)
   */
  async loadSingleTooth(
    fdi = 46,
    stage = 0,
    toolType = 'tooth-explorer',
    crownStage: 'damaged' | 'prepared' | 'crown' = 'crown',
    veneerStage: 'natural' | 'prep' | 'veneer' = 'veneer'
  ): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.initPromise) {
      await this.initPromise;
    }
    this.clearModel();
    this.selectedToothFdi = null;

    try {
      const manifest = await this.loadManifest();
      
      // Look for ToothFairy parts for this FDI
      let toothPart = manifest.parts.find((p) => p.id === `tf-tooth-${fdi}`);
      let pulpPart = manifest.parts.find((p) => p.id === `tf-pulp-${fdi}`);
      // Only attach PDL if from the exact same source dataset to avoid coordinate space mismatch
      const pdlPart = manifest.parts.find((p) => p.id === `jaw-pdl-${fdi}` && p.source === toothPart?.source);

      // Fallback to FDI 46 or 11 if specific FDI not found
      if (!toothPart) {
        toothPart = manifest.parts.find((p) => p.id === 'tf-tooth-46') || manifest.parts.find((p) => p.id === 'jaw-tooth-46');
        pulpPart = manifest.parts.find((p) => p.id === 'tf-pulp-46');
      }

      if (!toothPart) {
        throw new Error(`Anatomical mesh for tooth FDI ${fdi} not found in dataset.`);
      }

      // Pre-fetch required binary buffers
      const neededBuffers = new Set<string>();
      if (toothPart.buffer) neededBuffers.add(toothPart.buffer);
      if (pulpPart?.buffer) neededBuffers.add(pulpPart.buffer);
      if (pdlPart?.buffer) neededBuffers.add(pdlPart.buffer);
      neededBuffers.add('dental');
      neededBuffers.add('toothfairy');

      const loadedBuffers: Record<string, ArrayBuffer> = {};
      await Promise.all(
        Array.from(neededBuffers).map(async (bufName) => {
          try {
            loadedBuffers[bufName] = await this.getBuffer(bufName);
          } catch (e) {
            console.warn(`Buffer ${bufName} load warning:`, e);
          }
        })
      );

      const group = new THREE.Group();
      group.name = `tooth-${fdi}`;

      // Calculate center from bounding box of tooth
      const center = [
        (toothPart.bounds[0][0] + toothPart.bounds[1][0]) / 2,
        (toothPart.bounds[0][1] + toothPart.bounds[1][1]) / 2,
        (toothPart.bounds[0][2] + toothPart.bounds[1][2]) / 2,
      ];

      const toothHeight = Math.abs(toothPart.bounds[1][2] - toothPart.bounds[0][2]) || 20;

      // 1. Tooth Main Shell (Enamel/Dentin)
      const toothGeom = this.geometryFor(toothPart, loadedBuffers);
      let toothMat = this.activeMode === 'anatomy' || this.activeMode === 'isolate'
        ? this.materials['enamel_transparent']
        : this.activeMode === 'xray'
        ? this.materials['xray_tooth']
        : this.materials['enamel'];

      // Specific tool modifications
      if (toolType === 'tooth-decay') {
        if (stage === 4) {
          // Pulpitis stage: enamel becomes slightly translucent showing internal pulpal congestion
          toothMat = this.activeMode === 'surface' ? this.materials['enamel_transparent'] : toothMat;
        } else if (stage === 5) {
          // Necrosis stage: devitalized tooth greyish tone
          toothMat = new THREE.MeshPhysicalMaterial({
            color: 0xdedbd5,
            roughness: 0.35,
            metalness: 0.0,
            clearcoat: 0.2,
            side: THREE.FrontSide,
            clippingPlanes: [this.clippingPlane],
          });
        }
      } else if (toolType === 'crown-explorer') {
        if (crownStage === 'crown') {
          toothMat = this.materials['ceramic_crown'];
        }
      } else if (toolType === 'veneer-explorer') {
        if (veneerStage === 'natural') {
          toothMat = new THREE.MeshStandardMaterial({
            color: 0xe6d5b8, // Slightly discolored tooth
            roughness: 0.3,
            side: THREE.FrontSide,
            clippingPlanes: [this.clippingPlane],
          });
        } else if (veneerStage === 'veneer') {
          toothMat = this.materials['ceramic_crown'];
        }
      }

      const toothMesh = new THREE.Mesh(toothGeom, toothMat);
      toothMesh.position.set(-center[0], -center[1], -center[2]);
      toothMesh.userData = {
        ['tissue']: 'tooth',
        ['fdi']: fdi,
        ['name']: toothPart.name,
        ['originalMat']: toothMat,
      };
      group.add(toothMesh);

      // 2. Internal Pulp Chamber & Root Canals
      if (pulpPart) {
        try {
          const pulpGeom = this.geometryFor(pulpPart, loadedBuffers);
          let pulpMat = this.materials['pulp'];

          if (toolType === 'tooth-decay') {
            if (stage === 4) {
              // Acute pulpitis: angry, hyperemic inflamed crimson red
              pulpMat = new THREE.MeshStandardMaterial({
                color: 0xdc2626,
                emissive: new THREE.Color(0xb91c1c),
                emissiveIntensity: 0.6,
                roughness: 0.2,
                side: THREE.FrontSide,
                clippingPlanes: [this.clippingPlane],
              });
            } else if (stage === 5) {
              // Necrotic gangrenous pulp: dark grey-black
              pulpMat = new THREE.MeshStandardMaterial({
                color: 0x334155,
                emissive: new THREE.Color(0x0f172a),
                emissiveIntensity: 0.2,
                roughness: 0.8,
                side: THREE.FrontSide,
                clippingPlanes: [this.clippingPlane],
              });
            }
          } else if (toolType === 'root-canal') {
            if (stage >= 6) {
              // Obturation stages: bright orange bio-inert gutta-percha
              pulpMat = this.materials['gutta_percha'];
            }
          }

          const pulpMesh = new THREE.Mesh(pulpGeom, pulpMat);
          pulpMesh.position.set(-center[0], -center[1], -center[2]);
          pulpMesh.renderOrder = 1;
          pulpMesh.userData = {
            ['tissue']: 'pulp',
            ['name']: pulpPart.name,
            ['originalMat']: pulpMat,
          };
          group.add(pulpMesh);
        } catch (e) {
          console.warn('Pulp mesh load skip:', e);
        }
      }

      // 3. Dynamic Visual Pathology / Stages Additions
      if (toolType === 'tooth-decay') {
        if (stage === 1) {
          // White Spot Demineralization (Subtle chalky white lesion on occlusal surface)
          const lesionGeom = new THREE.SphereGeometry(1.2, 16, 16);
          const lesionMat = new THREE.MeshStandardMaterial({
            color: 0xf8fafc,
            roughness: 0.9,
          });
          const lesion = new THREE.Mesh(lesionGeom, lesionMat);
          lesion.position.set(0, 0, toothHeight * 0.35);
          lesion.scale.set(1.5, 1.2, 0.4);
          group.add(lesion);
        } else if (stage === 2) {
          // Enamel Cavitation (Dark brown-black localized lesion)
          const lesionGeom = new THREE.SphereGeometry(1.6, 16, 16);
          const lesionMat = new THREE.MeshStandardMaterial({
            color: 0x3e2723,
            roughness: 0.85,
          });
          const lesion = new THREE.Mesh(lesionGeom, lesionMat);
          lesion.position.set(0, 0, toothHeight * 0.35);
          lesion.scale.set(1.6, 1.4, 0.8);
          group.add(lesion);
        } else if (stage === 3) {
          // Dentin Caries (Expanded dark cavernous cavity penetrating into dentin)
          const lesionGeom = new THREE.SphereGeometry(2.4, 16, 16);
          const lesionMat = new THREE.MeshStandardMaterial({
            color: 0x24120c,
            roughness: 0.95,
          });
          const lesion = new THREE.Mesh(lesionGeom, lesionMat);
          lesion.position.set(0, 0, toothHeight * 0.28);
          lesion.scale.set(1.8, 1.5, 1.4);
          group.add(lesion);
        } else if (stage === 4) {
          // Pulpitis (Deep necrotic cavity reaching the pulp chamber)
          const lesionGeom = new THREE.SphereGeometry(2.8, 16, 16);
          const lesionMat = new THREE.MeshStandardMaterial({
            color: 0x170b07,
            roughness: 0.95,
          });
          const lesion = new THREE.Mesh(lesionGeom, lesionMat);
          lesion.position.set(0, 0, toothHeight * 0.22);
          lesion.scale.set(1.9, 1.6, 1.8);
          group.add(lesion);
        } else if (stage === 5) {
          // Necrosis & Periapical Abscess (Root apex inflammatory abscess sphere)
          const lesionGeom = new THREE.SphereGeometry(3.2, 16, 16);
          const lesionMat = new THREE.MeshStandardMaterial({
            color: 0x120804,
            roughness: 0.95,
          });
          const lesion = new THREE.Mesh(lesionGeom, lesionMat);
          lesion.position.set(0, 0, toothHeight * 0.22);
          group.add(lesion);

          // Periapical Abscess at root apex
          const abscessGeom = new THREE.SphereGeometry(3.5, 24, 24);
          const abscessMat = new THREE.MeshStandardMaterial({
            color: 0xef4444,
            emissive: new THREE.Color(0xb91c1c),
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.85,
            roughness: 0.3,
          });
          const abscess = new THREE.Mesh(abscessGeom, abscessMat);
          abscess.position.set(0, 0, -toothHeight * 0.45);
          group.add(abscess);
        }
      } else if (toolType === 'root-canal') {
        if (stage >= 2 && stage <= 5) {
          // Endodontic NiTi rotary file entering the root canal
          const fileGeom = new THREE.CylinderGeometry(0.2, 0.5, toothHeight * 0.9, 16);
          const fileMat = new THREE.MeshStandardMaterial({
            color: 0x94a3b8,
            metalness: 0.9,
            roughness: 0.2,
          });
          const fileMesh = new THREE.Mesh(fileGeom, fileMat);
          fileMesh.position.set(0, 0, 0);
          group.add(fileMesh);
        } else if (stage >= 8) {
          // Coronal composite seal on top of gutta-percha
          const sealGeom = new THREE.CylinderGeometry(1.8, 1.8, 2.0, 16);
          const sealMat = new THREE.MeshStandardMaterial({
            color: 0xf1f5f9,
            roughness: 0.25,
          });
          const sealMesh = new THREE.Mesh(sealGeom, sealMat);
          sealMesh.position.set(0, 0, toothHeight * 0.35);
          group.add(sealMesh);
        }
      }

      // Align tooth along its anatomical long axis (Crown UP, Root DOWN)
      if (toothPart.axes) {
        const basis = new THREE.Matrix4().makeBasis(
          new THREE.Vector3().fromArray(toothPart.axes.side),
          new THREE.Vector3().fromArray(toothPart.axes.up),
          new THREE.Vector3().fromArray(toothPart.axes.out)
        );
        group.quaternion.setFromRotationMatrix(basis.transpose());
      } else {
        group.rotation.x = -Math.PI / 2;
      }

      // Scale up tooth from millimeters to viewport units
      const radiusMm = Math.hypot(
        toothPart.bounds[1][0] - toothPart.bounds[0][0],
        toothPart.bounds[1][1] - toothPart.bounds[0][1],
        toothPart.bounds[1][2] - toothPart.bounds[0][2]
      ) * 0.5;

      const scale = 20 / (radiusMm || 10);
      group.scale.set(scale, scale, scale);

      this.modelGroup.add(group);

      // Auto zoom-out camera framing so the whole tooth is visible without manual zoom-out
      this.frameCameraOnGroup(group, 1.65, false);

      this.updateViewingModeVisuals();

      this.onAssetLoaded?.();
    } catch (err: unknown) {
      console.error('Error loading published 3D single tooth:', err);
      this.onAssetLoadError?.(err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Load full adult dentition / jaw anatomy (ToothFairy, Diaz, OpenFullJaw, or Kang)
   */
  async loadFullDentition(source: 'toothfairy' | 'diaz' | 'openfulljaw' | 'fang' = 'toothfairy'): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.initPromise) {
      await this.initPromise;
    }
    this.clearModel();
    this.modelGroup.name = `dentition-${source}`;

    try {
      const manifest = await this.loadManifest();
      const parts = manifest.parts.filter((p) => p.source === source);
      if (!parts.length) {
        throw new Error(`No published anatomy parts found for source: ${source}`);
      }

      const neededBuffers = new Set<string>();
      parts.forEach((p) => neededBuffers.add(p.buffer || 'dental'));
      neededBuffers.add('dental');
      neededBuffers.add('toothfairy');

      const loadedBuffers: Record<string, ArrayBuffer> = {};
      await Promise.all(
        Array.from(neededBuffers).map(async (bufName) => {
          loadedBuffers[bufName] = await this.getBuffer(bufName);
        })
      );

      const lo = [Infinity, Infinity, Infinity];
      const hi = [-Infinity, -Infinity, -Infinity];

      for (const part of parts) {
        for (let axis = 0; axis < 3; axis++) {
          lo[axis] = Math.min(lo[axis], part.bounds[0][axis]);
          hi[axis] = Math.max(hi[axis], part.bounds[1][axis]);
        }
      }

      const center = lo.map((low, axis) => (low + hi[axis]) / 2);
      const group = new THREE.Group();
      group.name = `dentition-${source}`;
      const expectedToothMeshes = parts.filter((part) => part.group === 'tooth').length;
      let loadedToothMeshes = 0;

      for (const part of parts) {
        try {
          const geom = this.geometryFor(part, loadedBuffers);
          let mat: THREE.Material;

          if (part.id === 'jaw-cortical') {
            mat = this.materials['bone_cortical'];
          } else if (part.id === 'jaw-cancellous') {
            mat = this.materials['bone_trabecular'];
          } else if (part.id === 'fang-maintainer') {
            mat = this.materials['appliance'];
          } else if (part.id === 'fang-pulp') {
            mat = this.materials['pulp_isolated'];
          } else if (part.group === 'tooth') {
            mat = this.activeMode === 'anatomy' || this.activeMode === 'isolate'
              ? this.materials['enamel_transparent']
              : this.activeMode === 'xray'
              ? this.materials['xray_tooth']
              : this.materials['enamel'];
          } else if (part.group === 'pulp') {
            mat = this.materials['pulp'];
          } else if (part.group === 'bone') {
            mat = this.boneOpacityMode === 'translucent'
              ? this.materials['bone_translucent']
              : this.activeMode === 'xray'
              ? this.materials['xray_bone']
              : this.materials['bone'];
          } else if (part.group === 'canal') {
            mat = this.materials['canal'];
          } else if (part.group === 'pdl') {
            mat = this.materials['pdl'];
          } else if (part.group === 'sinus') {
            mat = this.materials['sinus'];
          } else {
            mat = this.materials['dentin'];
          }

          const mesh = new THREE.Mesh(geom, mat);
          mesh.position.set(-center[0], -center[1], -center[2]);
          if (part.group === 'bone') {
            mesh.renderOrder = 0;
          } else if (part.group === 'tooth') {
            mesh.renderOrder = 1;
          } else if (part.group === 'pulp') {
            mesh.renderOrder = 2;
          } else if (part.group === 'sinus') {
            mesh.renderOrder = 2;
          } else if (part.group === 'canal') {
            mesh.renderOrder = 3;
          }
          mesh.userData = {
            ['tissue']: part.group,
            ['fdi']: part.fdi,
            ['name']: part.name,
            ['originalMat']: mat,
            ['id']: part.id,
          };
          group.add(mesh);
          if (part.group === 'tooth') loadedToothMeshes++;
        } catch (error) {
          console.warn(`Skipping invalid dental mesh "${part.id}" from ${source}:`, error);
        }
      }

      if (source === 'toothfairy' && expectedToothMeshes > 0 && loadedToothMeshes !== expectedToothMeshes) {
        throw new Error(`The dentition is incomplete: loaded ${loadedToothMeshes} of ${expectedToothMeshes} tooth meshes. Check the published dental buffers and manifest offsets.`);
      }

      // Standing upright face toward reader
      group.scale.setScalar(0.7);
      group.rotation.x = -Math.PI / 2;

      this.modelGroup.add(group);

      // Auto zoom-out camera framing for full dentition / jaw anatomy
      this.frameCameraOnGroup(group, 1.45, true);

      this.updateViewingModeVisuals();

      this.onAssetLoaded?.();
    } catch (err: unknown) {
      console.error('Error loading published 3D dentition arch:', err);
      this.onAssetLoadError?.(err instanceof Error ? err : new Error(String(err)));
    }
  }

  /** Priority 3: Set Cortical vs Trabecular Bone Mode (Diaz dataset) */
  setBoneArchitectureMode(mode: 'cortical' | 'trabecular' | 'combined' | 'xray'): void {
    if (!this.modelGroup) return;

    this.modelGroup.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const id = obj.userData['id'];
        if (id === 'jaw-cortical') {
          obj.visible = mode === 'cortical' || mode === 'combined' || mode === 'xray';
          if (mode === 'combined') {
            obj.material = this.materials['bone_cortical'];
            (obj.material as THREE.Material).transparent = true;
            (obj.material as THREE.Material).opacity = 0.35;
          } else if (mode === 'xray') {
            obj.material = this.materials['xray_bone'];
          } else {
            obj.material = this.materials['bone_cortical'];
            (obj.material as THREE.Material).transparent = true;
            (obj.material as THREE.Material).opacity = 0.95;
          }
        } else if (id === 'jaw-cancellous') {
          obj.visible = mode === 'trabecular' || mode === 'combined' || mode === 'xray';
          if (mode === 'xray') {
            obj.material = this.materials['xray_bone'];
          } else {
            obj.material = this.materials['bone_trabecular'];
            (obj.material as THREE.Material).transparent = true;
            (obj.material as THREE.Material).opacity = 0.98;
          }
        }
      }
    });
  }

  /** Priority 2: Set Supporting Structures Mode (OpenFullJaw dataset) */
  setSupportingStructuresMode(mode: 'full' | 'pdl' | 'bone' | 'relationship'): void {
    if (!this.modelGroup) return;

    this.modelGroup.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const tissue = obj.userData['tissue'];

        if (tissue === 'pdl') {
          obj.visible = true;
          obj.material = mode === 'pdl' ? this.materials['pdl_highlight'] : this.materials['pdl'];
        } else if (tissue === 'tooth') {
          obj.visible = true;
          if (mode === 'pdl' || mode === 'relationship') {
            obj.material = this.materials['enamel_transparent'];
          } else {
            obj.material = this.materials['enamel'];
          }
        } else if (tissue === 'bone') {
          obj.visible = mode !== 'pdl';
          if (mode === 'relationship') {
            obj.material = this.materials['xray_bone'];
          } else {
            obj.material = this.materials['bone'];
          }
        }
      }
    });
  }

  /** Priority 4: Set Pediatric Tooth #46 Mode (Kang dataset) */
  setPediatricMode(mode: 'complete' | 'open-apex' | 'maintainer'): void {
    if (!this.modelGroup) return;

    this.modelGroup.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const id = obj.userData['id'];

        if (id === 'fang-maintainer') {
          obj.visible = mode === 'complete' || mode === 'maintainer';
          obj.material = this.materials['appliance'];
        } else if (id === 'fang-pulp') {
          obj.visible = true;
          obj.material = mode === 'open-apex' ? this.materials['pulp_isolated'] : this.materials['pulp'];
        } else if (id === 'fang-tooth') {
          obj.visible = true;
          if (mode === 'open-apex' || mode === 'maintainer') {
            obj.material = this.materials['enamel_transparent'];
          } else {
            obj.material = this.materials['enamel'];
          }
        }
      }
    });
  }

  /** Priority 5: Set Anatomical Relationship Focus (Inferior Alveolar Canal vs Maxillary Sinus Floor) */
  setAnatomicalRelationshipMode(focus: 'nerve' | 'sinus' | 'all'): void {
    if (!this.modelGroup) return;

    this.modelGroup.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const tissue = obj.userData['tissue'];
        const id = obj.userData['id'];

        if (tissue === 'canal' || id?.includes('canal')) {
          obj.visible = focus === 'nerve' || focus === 'all';
          obj.material = this.materials['canal'];
        } else if (tissue === 'sinus' || id?.includes('sinus')) {
          obj.visible = focus === 'sinus' || focus === 'all';
          obj.material = this.materials['sinus'];
        } else if (tissue === 'bone') {
          obj.visible = true;
          obj.material = this.materials['xray_bone'];
        } else if (tissue === 'tooth') {
          obj.visible = true;
          obj.material = this.materials['enamel_transparent'];
        }
      }
    });
  }

  setMode(mode: ViewingMode): void {
    this.activeMode = mode;
    this.updateViewingModeVisuals();
  }

  private updateViewingModeVisuals(): void {
    if (!this.modelGroup) return;

    if (this.activeMode === 'cross-section') {
      this.renderer.localClippingEnabled = true;
      this.clippingPlane.set(new THREE.Vector3(1, 0, 0), 0);
    } else {
      this.renderer.localClippingEnabled = false;
    }

    const isFullArch = (this.modelGroup.name && this.modelGroup.name.startsWith('dentition')) ||
                       this.modelGroup.children.some(child => child.name && child.name.startsWith('dentition'));

    this.modelGroup.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        const tissue = mesh.userData['tissue'];
        const fdi = mesh.userData['fdi'] as number | undefined;
        const id = mesh.userData['id'] as string | undefined;

        if (isFullArch) {
          // ==========================================
          // FULL DENTITION ARCH RENDERING PIPELINE
          // ==========================================
          if (tissue === 'tooth') {
            const isUpper = fdi && fdi >= 11 && fdi <= 28;
            const isLower = fdi && fdi >= 31 && fdi <= 48;

            let isArchVisible = true;
            if (this.dentitionArchFilter === 'upper' && !isUpper) isArchVisible = false;
            if (this.dentitionArchFilter === 'lower' && !isLower) isArchVisible = false;

            let isQuadrantVisible = true;
            if (this.dentitionQuadrantFilter && fdi) {
              const q = this.dentitionQuadrantFilter;
              const inQuadrant =
                (q === 1 && fdi >= 11 && fdi <= 18) ||
                (q === 2 && fdi >= 21 && fdi <= 28) ||
                (q === 3 && fdi >= 31 && fdi <= 38) ||
                (q === 4 && fdi >= 41 && fdi <= 48);
              if (!inQuadrant) isQuadrantVisible = false;
            }

            // An explicitly selected tooth overrides the arch/quadrant visibility filters to remain viewable and highlighted
            const isSelectedTooth = fdi && fdi === this.selectedToothFdi;
            const shouldBeVisible = (isArchVisible && isQuadrantVisible && this.showTeethLayer) || isSelectedTooth;

            if (!shouldBeVisible) {
              mesh.visible = false;
              return;
            }

            mesh.visible = true;

            if (isSelectedTooth) {
              mesh.material = this.materials['selected_highlight'];
            } else if (this.selectedToothFdi) {
              mesh.material = this.materials['enamel_dimmed'];
            } else {
              mesh.material = (this.showPulpLayer || this.activeMode === 'anatomy' || this.activeMode === 'isolate')
                ? this.materials['enamel_transparent']
                : this.activeMode === 'xray'
                ? this.materials['xray_tooth']
                : this.materials['enamel'];
            }
          } else if (tissue === 'pulp') {
            const isUpper = fdi && fdi >= 11 && fdi <= 28;
            const isLower = fdi && fdi >= 31 && fdi <= 48;

            let isArchVisible = true;
            if (this.dentitionArchFilter === 'upper' && !isUpper) isArchVisible = false;
            if (this.dentitionArchFilter === 'lower' && !isLower) isArchVisible = false;

            let isQuadrantVisible = true;
            if (this.dentitionQuadrantFilter && fdi) {
              const q = this.dentitionQuadrantFilter;
              const inQuadrant =
                (q === 1 && fdi >= 11 && fdi <= 18) ||
                (q === 2 && fdi >= 21 && fdi <= 28) ||
                (q === 3 && fdi >= 31 && fdi <= 38) ||
                (q === 4 && fdi >= 41 && fdi <= 48);
              if (!inQuadrant) isQuadrantVisible = false;
            }

            const isSelectedPulp = fdi && fdi === this.selectedToothFdi;
            const shouldShowPulp = (isArchVisible && isQuadrantVisible && this.showPulpLayer) || isSelectedPulp;

            if (!shouldShowPulp) {
              mesh.visible = false;
              return;
            }

            mesh.visible = true;
            mesh.renderOrder = 2; // Render after translucent tooth shell
            if (isSelectedPulp) {
              mesh.material = this.materials['pulp_isolated'];
            } else {
              mesh.material = this.activeMode === 'xray' ? this.materials['pulp_xray'] : this.materials['pulp'];
            }
          } else if (tissue === 'bone') {
            const isMandible = id === 'tf-bone-mandible' || id === 'jaw-bone-mandible' || id === 'jaw-cortical';
            const isMaxilla = id === 'tf-bone-maxilla' || id === 'jaw-bone-maxilla';

            let isArchVisible = true;
            if (this.dentitionArchFilter === 'upper' && isMandible) isArchVisible = false;
            if (this.dentitionArchFilter === 'lower' && isMaxilla) isArchVisible = false;
            if (isMandible && !this.showMandibleLayer) isArchVisible = false;
            if (isMaxilla && !this.showMaxillaLayer) isArchVisible = false;

            if (!isArchVisible || !this.showBoneLayer || this.boneOpacityMode === 'hidden') {
              mesh.visible = false;
              return;
            }

            mesh.visible = true;
            mesh.renderOrder = 0;
            if (this.boneOpacityMode === 'translucent') {
              mesh.material = this.materials['bone_translucent'];
            } else if (this.activeMode === 'xray') {
              mesh.material = this.materials['xray_bone'];
            } else {
              mesh.material = this.materials['bone'];
            }
          } else if (tissue === 'canal') {
            const isArchVisible = this.dentitionArchFilter === 'all' || this.dentitionArchFilter === 'lower';
            mesh.visible = isArchVisible && this.showCanalLayer;
            mesh.material = this.materials['canal'];
            mesh.renderOrder = 3;
          } else if (tissue === 'sinus') {
            const isArchVisible = this.dentitionArchFilter === 'all' || this.dentitionArchFilter === 'upper';
            mesh.visible = isArchVisible && this.showSinusLayer;
            mesh.material = this.materials['sinus'];
            mesh.renderOrder = 2;
          }
        } else {
          // ==========================================
          // SINGLE TOOTH & OTHER MODELS RENDERING
          // ==========================================
          if (tissue === 'tooth') {
            if (this.activeMode === 'surface') {
              mesh.visible = true;
              mesh.material = this.materials['enamel'];
            } else if (this.activeMode === 'cross-section') {
              mesh.visible = true;
              mesh.material = this.materials['dentin_section'];
            } else if (this.activeMode === 'xray') {
              mesh.visible = true;
              mesh.material = this.materials['xray_shell'];
            } else if (this.activeMode === 'anatomy' || this.activeMode === 'isolate') {
              mesh.visible = true;
              mesh.material = this.materials['tooth_ghost_faint'];
            }
          } else if (tissue === 'pulp') {
            if (this.activeMode === 'surface') {
              mesh.visible = true;
              mesh.material = this.materials['pulp'];
              mesh.renderOrder = 1;
            } else if (this.activeMode === 'cross-section') {
              // In sagittal cross section, render the full intact 3D pulp canal tree inside the carved chamber
              mesh.visible = true;
              mesh.material = this.materials['pulp_section'];
              mesh.renderOrder = 2;
            } else if (this.activeMode === 'xray') {
              mesh.visible = true;
              mesh.material = this.materials['pulp_xray'];
              mesh.renderOrder = 2;
            } else if (this.activeMode === 'anatomy' || this.activeMode === 'isolate') {
              mesh.visible = true;
              mesh.material = this.materials['pulp_isolated'];
              mesh.renderOrder = 2;
            }
          } else if (tissue === 'bone') {
            mesh.visible = true;
            mesh.material = this.activeMode === 'xray' ? this.materials['xray_bone'] : this.materials['bone'];
          } else if (tissue === 'canal') {
            mesh.visible = true;
            mesh.material = this.materials['canal'];
          } else if (tissue === 'pdl') {
            mesh.visible = this.activeMode !== 'anatomy';
            mesh.material = this.materials['pdl'];
          } else if (tissue === 'sinus') {
            mesh.visible = this.activeMode !== 'anatomy';
            mesh.material = this.materials['sinus'];
          }
        }
      }
    });
  }

  /**
   * Anatomically focuses and highlights specific tooth layers (enamel, dentin, pulp, root)
   */
  focusStructure(structure: 'enamel' | 'dentin' | 'pulp' | 'root'): void {
    if (!this.modelGroup || !this.camera || !this.controls) return;
    const target = this.controls.target.clone();

    switch (structure) {
      case 'enamel':
        // Switch to complete external tooth, glide camera to coronal cusp table
        this.setMode('surface');
        {
          const dist = 68;
          const pos = new THREE.Vector3(target.x, target.y + 12, target.z + dist * 0.85);
          this.animateCameraTo(pos, target, 500);
        }
        break;

      case 'dentin':
        // Switch to sagittal cross section, camera angles at 3/4 cut to clearly see dentin wall thickness
        this.setMode('cross-section');
        {
          const dist = 66;
          const pos = new THREE.Vector3(target.x + dist * 0.65, target.y + 6, target.z + dist * 0.72);
          this.animateCameraTo(pos, target, 500);
        }
        break;

      case 'pulp':
        // Switch to internal pulp isolation, zoom smoothly into endodontic canal tree
        this.setMode('anatomy');
        {
          const dist = 48; // Close-up on pulp chamber
          const pos = new THREE.Vector3(target.x, target.y + 2, target.z + dist);
          this.animateCameraTo(pos, target, 500);
        }
        break;

      case 'root':
        // Switch to complete tooth, focus camera on root apices and furcation anatomy
        this.setMode('surface');
        {
          const dist = 70;
          const pos = new THREE.Vector3(target.x + 12, target.y - 14, target.z + dist * 0.82);
          const lookAt = new THREE.Vector3(target.x, target.y - 8, target.z);
          this.animateCameraTo(pos, lookAt, 500);
        }
        break;
    }
  }

  selectTooth(fdi: number | null): void {
    this.selectedToothFdi = fdi;
    this.updateViewingModeVisuals();
  }

  setBoneOpacity(opacity: number): void {
    this.boneOpacity = opacity;
    if (this.materials['bone'] instanceof THREE.MeshStandardMaterial) {
      this.materials['bone'].opacity = opacity;
      this.materials['bone'].transparent = opacity < 0.99;
    }
  }

  private getValidIntersection(intersects: THREE.Intersection[]): THREE.Intersection | null {
    for (const hit of intersects) {
      const mesh = hit.object as THREE.Mesh;
      if (!mesh || !mesh.visible) continue;

      // Ensure all parents in scene graph are visible
      let parent = mesh.parent;
      let isParentVisible = true;
      while (parent && parent !== this.scene) {
        if (!parent.visible) {
          isParentVisible = false;
          break;
        }
        parent = parent.parent;
      }
      if (!isParentVisible) continue;

      // Ensure material is visible and non-zero opacity
      if (mesh.material) {
        const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
        if (mat.visible === false) continue;
        if (mat.transparent && mat.opacity === 0) continue;
      }

      // Check clipping planes (e.g. cross-section sagittal cut plane)
      if (this.activeMode === 'cross-section' && this.clippingPlane) {
        // Point is clipped if distanceToPoint is negative
        const planeDist = this.clippingPlane.distanceToPoint(hit.point);
        if (planeDist < -0.01) {
          continue; // Skipped because this section of mesh is clipped away visually
        }
      }

      // If tooth is in section cut or translucent mode, check if internal pulp/canal is exposed & hit
      if ((this.activeMode === 'anatomy' || this.activeMode === 'isolate' || this.activeMode === 'cross-section') && mesh.userData['tissue'] === 'tooth') {
        const internalHit = intersects.find((i) => {
          const m = i.object as THREE.Mesh;
          if (!m.visible || (m.userData['tissue'] !== 'pulp' && m.userData['tissue'] !== 'canal')) {
            return false;
          }
          if (this.activeMode === 'cross-section' && this.clippingPlane) {
            return this.clippingPlane.distanceToPoint(i.point) >= -0.01;
          }
          return true;
        });
        if (internalHit) {
          return internalHit;
        }
      }

      return hit;
    }
    return null;
  }

  private applyHoverHighlight(mesh: THREE.Mesh): void {
    if (this.currentlyHoveredMesh === mesh) return;
    this.clearHoverHighlight();

    this.currentlyHoveredMesh = mesh;
    if (!mesh || !mesh.material) return;

    if (!mesh.userData['isHoverHighlighted']) {
      mesh.userData['preHoverMaterial'] = mesh.material;

      const origMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      if (origMat) {
        const hoverMat = (origMat as THREE.Material).clone() as THREE.MeshStandardMaterial;
        // Subtle emerald emissive accent glow on aiming
        if ('emissive' in hoverMat) {
          hoverMat.emissive = new THREE.Color(0x059669);
          hoverMat.emissiveIntensity = 0.35;
        }
        mesh.material = hoverMat;
        mesh.userData['isHoverHighlighted'] = true;
      }
    }
  }

  private clearHoverHighlight(): void {
    if (this.currentlyHoveredMesh) {
      if (this.currentlyHoveredMesh.userData['isHoverHighlighted']) {
        const preMat = this.currentlyHoveredMesh.userData['preHoverMaterial'];
        if (preMat) {
          this.currentlyHoveredMesh.material = preMat;
        }
        delete this.currentlyHoveredMesh.userData['isHoverHighlighted'];
        delete this.currentlyHoveredMesh.userData['preHoverMaterial'];
      }
      this.currentlyHoveredMesh = null;
    }
  }

  private getLandmarkInfo(hitMesh: THREE.Mesh, point: THREE.Vector3): { label: string; category: string } | null {
    if (!hitMesh || !hitMesh.userData) return null;
    const tissue = hitMesh.userData['tissue'];
    const name = hitMesh.userData['name'] || '';
    const fdi = hitMesh.userData['fdi'];

    if (tissue === 'pulp') {
      return { label: 'Chambre Pulpaire & Canaux', category: 'Système Endodontique' };
    } else if (tissue === 'tooth') {
      if (this.activeMode === 'cross-section') {
        return { label: 'Dentine Calcifiée', category: 'Coupe Sagittale' };
      } else if (this.activeMode === 'xray') {
        return { label: 'Émail Radiopaque', category: 'Radiographie' };
      } else {
        if (point.y > 2) {
          return { label: 'Émail Coronaire', category: 'Morphologie externe' };
        } else if (point.y < -3) {
          return { label: 'Apex Radiculaire', category: 'Ancrage Alvéolaire' };
        } else {
          return { label: 'Collet Dentaire', category: 'Jonction Cément-Émail' };
        }
      }
    } else if (tissue === 'bone') {
      return { label: 'Os Alvéolaire', category: 'Structure Osseuse' };
    } else if (tissue === 'canal') {
      return { label: 'Canal Mandibulaire', category: 'Paquet Vasculo-Nerveux' };
    } else if (tissue === 'gingiva') {
      return { label: 'Gencive Attachée', category: 'Tissu Parodontal' };
    } else if (tissue === 'pdl') {
      return { label: 'Desmodonte', category: 'Ligament Alvéolo-Dentaire' };
    } else if (tissue === 'sinus') {
      return { label: 'Plancher Sinusien', category: 'Cavité Sinusale' };
    } else if (fdi) {
      return { label: `Molaire #${fdi}`, category: name || 'Anatomie Dentaire' };
    }

    if (name) {
      return { label: name, category: 'Anatomie' };
    }

    return null;
  }

  private bindEvents(container: HTMLElement): void {
    let pointerStartX = 0;
    let pointerStartY = 0;

    const onPointerDown = (event: MouseEvent) => {
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      if (this.cameraAnimId !== null) {
        cancelAnimationFrame(this.cameraAnimId);
        this.cameraAnimId = null;
      }
    };

    const onPointerMove = (event: MouseEvent) => {
      if (!this.modelGroup || !this.camera) return;

      const rect = container.getBoundingClientRect();
      const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), this.camera);
      const intersects = this.raycaster.intersectObjects(this.modelGroup.children, true);
      const validHit = this.getValidIntersection(intersects);

      if (validHit) {
        const hitMesh = validHit.object as THREE.Mesh;
        const landmark = this.getLandmarkInfo(hitMesh, validHit.point);

        if (landmark) {
          const screenX = event.clientX - rect.left;
          const screenY = event.clientY - rect.top;

          this.applyHoverHighlight(hitMesh);

          this.ngZone.run(() => {
            const tooltipState = {
              visible: true,
              label: landmark.label,
              category: landmark.category,
              screenX,
              screenY,
              hoveredMeshId: hitMesh.name || hitMesh.uuid,
            };
            this.hoverTooltip.set(tooltipState);
            this.tooltipService.setTooltip(tooltipState);
          });
          return;
        }
      }

      this.clearHoverHighlight();
      this.ngZone.run(() => {
        if (this.hoverTooltip().visible) {
          this.hoverTooltip.set({ visible: false, label: '', category: '', screenX: 0, screenY: 0 });
          this.tooltipService.clearTooltip();
        }
      });
    };

    const onPointerLeave = () => {
      this.clearHoverHighlight();
      this.ngZone.run(() => {
        if (this.hoverTooltip().visible) {
          this.hoverTooltip.set({ visible: false, label: '', category: '', screenX: 0, screenY: 0 });
          this.tooltipService.clearTooltip();
        }
      });
    };

    const onPointerUp = (event: MouseEvent) => {
      const dx = Math.abs(event.clientX - pointerStartX);
      const dy = Math.abs(event.clientY - pointerStartY);

      // If user was dragging / rotating OrbitControls, ignore click
      if (dx > 6 || dy > 6) return;

      const rect = container.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.modelGroup.children, true);
      const validHit = this.getValidIntersection(intersects);

      if (validHit) {
        const hitMesh = validHit.object as THREE.Mesh;
        if (hitMesh.userData) {
          const fdi = hitMesh.userData['fdi'];
          const name = hitMesh.userData['name'];
          const tissue = hitMesh.userData['tissue'];

          if (fdi) {
            const isAlreadySelected = this.selectedToothFdi === fdi;
            this.ngZone.run(() => {
              if (!isAlreadySelected) {
                this.selectTooth(fdi);
              }
              this.onToothClicked?.(fdi, name);
            });
          } else if (tissue) {
            this.ngZone.run(() => {
              this.onStructureClicked?.(tissue);
            });
          }
        }
      }
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);
    container.addEventListener('pointerup', onPointerUp);
  }

  private startAnimationLoop(): void {
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        this.animationFrameId = requestAnimationFrame(animate);
        if (this.controls) {
          this.controls.autoRotate = this.isAutoRotating;
          this.controls.autoRotateSpeed = 1.2;
          this.controls.update();
        }
        if (this.renderer && this.scene && this.camera) {
          this.renderer.render(this.scene, this.camera);
        }
      };
      animate();
    });
  }

  resize(width: number, height: number): void {
    if (!isPlatformBrowser(this.platformId) || !this.camera || !this.renderer) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private cameraAnimId: number | null = null;

  private animateCameraTo(targetPosition: THREE.Vector3, targetLookAt: THREE.Vector3, durationMs = 450): void {
    if (!this.camera || !this.controls) return;

    if (this.cameraAnimId !== null) {
      cancelAnimationFrame(this.cameraAnimId);
      this.cameraAnimId = null;
    }

    const startPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();
    const startTime = performance.now();

    const animateStep = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1.0);
      // Smooth cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);

      this.camera?.position.lerpVectors(startPos, targetPosition, ease);
      this.controls?.target.lerpVectors(startTarget, targetLookAt, ease);
      this.controls?.update();

      if (progress < 1.0) {
        this.cameraAnimId = requestAnimationFrame(animateStep);
      } else {
        this.cameraAnimId = null;
        if (this.controls && this.camera) {
          this.controls.target.copy(targetLookAt);
          this.camera.position.copy(targetPosition);
          this.controls.update();
        }
      }
    };

    this.cameraAnimId = requestAnimationFrame(animateStep);
  }

  setCameraAngle(angle: 'front' | 'back' | 'side' | 'occlusal'): void {
    if (!this.camera || !this.controls) return;
    const target = this.controls.target.clone();
    const dist = Math.max(this.camera.position.distanceTo(target), 50);

    const destPos = new THREE.Vector3();

    switch (angle) {
      case 'front': // Vestibulaire / Buccal (Facial aspect)
        destPos.set(target.x, target.y + (dist * 0.05), target.z + dist);
        break;
      case 'back': // Lingual / Palatin (Internal tongue/palate aspect)
        destPos.set(target.x, target.y + (dist * 0.05), target.z - dist);
        break;
      case 'side': // Proximal (Mésial / Distal aspect showing contact contours)
        destPos.set(target.x + dist, target.y + (dist * 0.05), target.z);
        break;
      case 'occlusal': // Occlusal / Incisif (Top-down cusps, triangular ridges, and groove anatomy)
        destPos.set(target.x, target.y + dist, target.z + 0.01);
        break;
    }

    this.animateCameraTo(destPos, target, 500);
  }

  toggleLayerVisibility(layer: 'bone' | 'teeth' | 'pulp' | 'canal' | 'pdl' | 'sinus', visible: boolean): void {
    if (!this.modelGroup) return;
    const tissueMap: Record<string, string> = {
      bone: 'bone',
      teeth: 'tooth',
      pulp: 'pulp',
      canal: 'canal',
      pdl: 'pdl',
      sinus: 'sinus',
    };
    const targetTissue = tissueMap[layer];

    this.modelGroup.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        if (mesh.userData && mesh.userData['tissue'] === targetTissue) {
          mesh.visible = visible;
        }
      }
    });
  }

  /**
   * Intelligently frames and zooms out the perspective camera on the loaded 3D tooth or anatomy group.
   * Ensures the whole tooth (crown, pulp, cervical margin, root tip) is fully in frame with generous clearance.
   */
  private frameCameraOnGroup(object: THREE.Object3D, padding = 1.65, isArch = false): void {
    if (!this.camera || !this.controls) return;

    const box = new THREE.Box3().setFromObject(object);
    if (box.isEmpty()) {
      const defaultDist = isArch ? 95 : 72;
      this.camera.position.set(0, 2, defaultDist);
      this.controls.target.set(0, 0, 0);
      this.controls.update();
      return;
    }

    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    this.controls.target.copy(center);

    const vFov = (this.camera.fov * Math.PI) / 180;
    const aspect = Math.max(this.camera.aspect || 1, 0.45);

    const distV = (size.y / 2) / Math.tan(vFov / 2);
    const distH = (size.x / 2) / (Math.tan(vFov / 2) * aspect);
    const maxDim = Math.max(size.x, size.y, size.z);
    const distMax = (maxDim / 2) / Math.tan(vFov / 2);

    let targetDistance = Math.max(distV, distH, distMax) * padding;

    if (!isArch) {
      // Generous baseline zoom out for single tooth so user never has to zoom out manually
      targetDistance = Math.max(targetDistance, 70);
      this.camera.position.set(center.x, center.y + (size.y * 0.08), center.z + targetDistance);
    } else {
      targetDistance = Math.max(targetDistance, 108);
      this.camera.position.set(center.x, center.y + 2.0, center.z + targetDistance);
    }

    this.camera.lookAt(center);
    this.controls.update();
  }

  setAutoRotate(enabled: boolean): void {
    this.isAutoRotating = enabled;
  }

  toggleAutoRotate(): boolean {
    this.isAutoRotating = !this.isAutoRotating;
    return this.isAutoRotating;
  }

  resetCamera(): void {
    if (!this.camera || !this.controls) return;
    const isArch = (this.modelGroup.name && this.modelGroup.name.startsWith('dentition')) ||
                   this.modelGroup.children.some(child => child.name && child.name.startsWith('dentition'));
    const dist = isArch ? 108 : 72;
    this.camera.position.set(0, isArch ? 2.0 : 0, dist);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  setPresetView(preset: 'top' | 'front' | 'back' | 'left' | 'right' | 'perspective' | 'canal' | 'nerve'): void {
    if (!this.camera || !this.controls) return;

    // Use current target or stable model center if no specific tooth is selected
    const target = this.controls.target.clone();
    if (!this.selectedToothFdi && this.modelGroup) {
      const box = new THREE.Box3().setFromObject(this.modelGroup);
      if (!box.isEmpty()) {
        box.getCenter(target);
      }
    }

    const currentDist = this.camera.position.distanceTo(target);
    const dist = Math.max(currentDist, 68);

    const pos = new THREE.Vector3();
    switch (preset) {
      case 'top':
        pos.set(target.x, target.y + dist, target.z + 0.1);
        break;
      case 'front':
        pos.set(target.x, target.y, target.z + dist);
        break;
      case 'back':
        pos.set(target.x, target.y, target.z - dist);
        break;
      case 'left':
        pos.set(target.x - dist, target.y, target.z);
        break;
      case 'right':
        pos.set(target.x + dist, target.y, target.z);
        break;
      case 'canal':
      case 'nerve':
        {
          const canalBox = new THREE.Box3();
          this.modelGroup?.traverse((child) => {
            if ((child as THREE.Mesh).isMesh && child.userData && child.userData['tissue'] === 'canal') {
              canalBox.expandByObject(child);
            }
          });
          if (!canalBox.isEmpty()) {
            canalBox.getCenter(target);
          }
          // Elevated anterolateral clinical perspective ensuring view is looking at the canal and teeth, not down into void
          pos.set(target.x - dist * 0.65, target.y + dist * 0.18, target.z + dist * 0.62);
        }
        break;
      case 'perspective':
      default:
        pos.set(target.x + dist * 0.5, target.y + dist * 0.3, target.z + dist * 0.8);
        break;
    }

    this.animateCameraTo(pos, target, 500);
  }

  zoomIn(): void {
    if (!this.camera || !this.controls) return;
    const currentDist = this.camera.position.distanceTo(this.controls.target);
    const newDist = Math.max(this.controls.minDistance, currentDist * 0.8);
    this.camera.position.lerp(this.controls.target, 1 - newDist / currentDist);
  }

  zoomOut(): void {
    if (!this.camera || !this.controls) return;
    const currentDist = this.camera.position.distanceTo(this.controls.target);
    const newDist = Math.max(this.controls.maxDistance, currentDist * 1.2);
    this.camera.position.lerp(this.controls.target, 1 - newDist / currentDist);
  }

  /**
   * Sets dentition arch filter ('all', 'upper', 'lower')
   */
  setDentitionArchFilter(arch: 'all' | 'upper' | 'lower'): void {
    this.dentitionArchFilter = arch;
    this.updateViewingModeVisuals();
  }

  /**
   * Sets quadrant filter (1, 2, 3, 4 or null)
   */
  setQuadrantFilter(quadrant: 1 | 2 | 3 | 4 | null): void {
    this.dentitionQuadrantFilter = quadrant;
    this.updateViewingModeVisuals();
  }

  /**
   * Sets bone opacity mode ('hidden', 'visible', 'translucent')
   */
  setBoneOpacityMode(mode: 'hidden' | 'visible' | 'translucent'): void {
    this.boneOpacityMode = mode;
    this.updateViewingModeVisuals();
  }

  /**
   * Batch updates layer visibilities for teeth, pulp, bone, mandible, maxilla, canal, and sinus
   */
  setLayerVisibilityState(layers: {
    teeth?: boolean;
    pulp?: boolean;
    bone?: boolean;
    mandible?: boolean;
    maxilla?: boolean;
    canal?: boolean;
    sinus?: boolean;
  }): void {
    if (layers.teeth !== undefined) this.showTeethLayer = layers.teeth;
    if (layers.pulp !== undefined) this.showPulpLayer = layers.pulp;
    if (layers.bone !== undefined) this.showBoneLayer = layers.bone;
    if (layers.mandible !== undefined) this.showMandibleLayer = layers.mandible;
    if (layers.maxilla !== undefined) this.showMaxillaLayer = layers.maxilla;
    if (layers.canal !== undefined) this.showCanalLayer = layers.canal;
    if (layers.sinus !== undefined) this.showSinusLayer = layers.sinus;
    this.updateViewingModeVisuals();
  }

  /**
   * Focuses and frames camera smoothly on a specific tooth in the full arch dataset
   */
  focusToothInFullArch(fdi: number): void {
    if (!this.modelGroup || !this.camera || !this.controls) return;
    this.selectedToothFdi = fdi;
    this.updateViewingModeVisuals();

    let targetMesh: THREE.Mesh | null = null;
    this.modelGroup.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        if (mesh.userData && mesh.userData['tissue'] === 'tooth' && mesh.userData['fdi'] === fdi) {
          targetMesh = mesh;
        }
      }
    });

    if (targetMesh) {
      this.modelGroup.updateMatrixWorld(true);
      (targetMesh as THREE.Mesh).updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(targetMesh);
      const center = new THREE.Vector3();
      box.getCenter(center);

      // Position camera at a comfortable clinical distance facing the buccal/facial aspect of the tooth.
      // We orient the vector from the arch curvature with positive Z bias so the camera always remains
      // in front of the dental arch, keeping the tooth perfectly centered without jumping backward or below.
      const isUpper = fdi >= 11 && fdi <= 28;
      const viewDir = new THREE.Vector3(
        center.x * 0.45,
        isUpper ? 0.8 : 2.2,
        Math.max(center.z * 0.4, 0) + 18
      ).normalize();

      const dist = 38;
      const pos = center.clone().addScaledVector(viewDir, dist);

      this.animateCameraTo(pos, center, 550);
    }
  }

  /**
   * Resets full arch camera to initial overview framing
   */
  resetFullArchCamera(): void {
    if (!this.modelGroup) return;
    this.selectedToothFdi = null;
    this.updateViewingModeVisuals();
    this.frameCameraOnGroup(this.modelGroup, 1.55, true);
  }

  /**
   * Projects 3D positions of all teeth to 2D viewport screen coordinates for UI badges
   */
  getToothScreenPositions(): { fdi: number; x: number; y: number; visible: boolean }[] {
    if (!this.modelGroup || !this.camera || !this.renderer) return [];

    const canvas = this.renderer.domElement;
    if (!canvas) return [];

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const results: { fdi: number; x: number; y: number; visible: boolean }[] = [];
    const tempVec = new THREE.Vector3();

    this.modelGroup.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        if (mesh.userData && mesh.userData['tissue'] === 'tooth' && mesh.userData['fdi'] && mesh.visible) {
          const fdi = mesh.userData['fdi'] as number;
          mesh.geometry.computeBoundingBox();
          if (mesh.geometry.boundingBox) {
            mesh.geometry.boundingBox.getCenter(tempVec);
            mesh.localToWorld(tempVec);
            tempVec.project(this.camera);

            const isFront = tempVec.z < 1;
            const x = (tempVec.x * 0.5 + 0.5) * width;
            const y = (-(tempVec.y * 0.5) + 0.5) * height;

            results.push({
              fdi,
              x,
              y,
              visible: isFront && x >= 10 && x <= width - 10 && y >= 10 && y <= height - 10,
            });
          }
        }
      }
    });

    return results;
  }

  dispose(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.cameraAnimId !== null) {
      cancelAnimationFrame(this.cameraAnimId);
      this.cameraAnimId = null;
    }

    this.clearHoverHighlight();
    this.controls?.dispose();
    this.controls = null;
    this.clearModel();

    // The studio shadow is attached to the scene rather than modelGroup.
    // Dispose its geometry, material and canvas texture explicitly.
    if (this.groundShadow) {
      this.scene?.remove(this.groundShadow);
      this.groundShadow.geometry.dispose();
      const material = this.groundShadow.material;
      if (Array.isArray(material)) {
        material.forEach((item) => {
          if (item instanceof THREE.MeshBasicMaterial) item.map?.dispose();
          item.dispose();
        });
      } else {
        if (material instanceof THREE.MeshBasicMaterial) material.map?.dispose();
        material.dispose();
      }
      this.groundShadow = null;
    }

    Object.values(this.materials).forEach((material) => material.dispose());
    this.materials = {};

    if (this.renderer) {
      this.renderer.renderLists.dispose();
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      const dom = this.renderer.domElement;
      if (dom?.parentNode) dom.parentNode.removeChild(dom);
    }

    this.scene?.clear();
    this.onAnnotationsUpdate = undefined;
    this.onToothClicked = undefined;
    this.onStructureClicked = undefined;
    this.onAssetLoaded = undefined;
    this.onAssetLoadError = undefined;
    this.hoverTooltip.set({ visible: false, label: '', category: '', screenX: 0, screenY: 0 });
    this.tooltipService.clearTooltip();
  }
}
