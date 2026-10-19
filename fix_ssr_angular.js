const fs = require('fs');
let content = fs.readFileSync('src/app/services/dental-3d-engine.service.ts', 'utf8');

// Replace top-level imports with dynamic imports or PLATFORM_ID checks if possible.
// Actually, since Three.js accesses `window` when imported in some cases (though less so now),
// the safest way in Angular SSR is to use isPlatformBrowser.

content = `import {Injectable, NgZone, inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import * as THREE from 'three';
import {ViewingMode, ToothNumberingSystem} from '../models/dental-3d.model';
import {DENTAL_3D_ASSETS} from '../data/dental-3d-assets';
import {Dental3DAsset} from '../models/dental-3d-asset.model';

export interface AnnotationPoint {
  id: string;
  label: string;
  worldPosition: THREE.Vector3;
  screenX: number;
  screenY: number;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Dental3DEngineService {
  private ngZone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);
  
  // Core Three.js members (types only, instantiated conditionally)
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  controls: any; // Type as any to avoid OrbitControls import at top level breaking SSR

  // Root group for the current active dental model
  modelGroup!: THREE.Group;

  // Clipping plane for cross-section views
  private clippingPlane!: THREE.Plane;

  // Lighting
  private ambientLight!: THREE.AmbientLight;
  private keyLight!: THREE.DirectionalLight;
  private fillLight!: THREE.DirectionalLight;
  private rimLight!: THREE.DirectionalLight;

  // State
  activeMode: ViewingMode = 'surface';
  isAutoRotating = false;
  selectedStructureId: string | null = null;
  selectedToothFdi: number | null = null;
  currentNumberingSystem: ToothNumberingSystem = 'fdi';

  // Materials Cache
  private materials: Record<string, THREE.Material> = {};

  // Animation Loop
  private animationFrameId: number | null = null;

  // Callbacks
  onAnnotationsUpdate?: (points: AnnotationPoint[]) => void;
  onAssetLoadError?: (asset: Dental3DAsset) => void;
  onAssetLoaded?: () => void;

  async initialize(container: HTMLElement): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Do nothing on SSR
    }

    if (this.scene) {
      this.dispose();
    }
    
    // Dynamically import GLTFLoader and OrbitControls to prevent SSR crashes
    const [{ OrbitControls }] = await Promise.all([
      import('three/examples/jsm/controls/OrbitControls.js')
    ]);

    this.scene = new THREE.Scene();
    this.modelGroup = new THREE.Group();
    this.scene.add(this.modelGroup);

    this.clippingPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);

    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 80);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.localClippingEnabled = true;
    
    // Modern physical lighting setup
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enablePan = true;
    this.controls.minDistance = 10;
    this.controls.maxDistance = 200;
    this.controls.target.set(0, 0, 0);

    this.setupLighting();
    this.initMaterialCache();
    this.startAnimationLoop();
  }

  private setupLighting(): void {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(this.ambientLight);

    this.keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    this.keyLight.position.set(20, 20, 30);
    this.scene.add(this.keyLight);

    this.fillLight = new THREE.DirectionalLight(0xdbeafe, 1.5);
    this.fillLight.position.set(-20, 0, -20);
    this.scene.add(this.fillLight);

    this.rimLight = new THREE.DirectionalLight(0xffffff, 2.0);
    this.rimLight.position.set(0, -20, -30);
    this.scene.add(this.rimLight);
  }

  private initMaterialCache(): void {
    this.materials['enamel'] = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.05,
      transmission: 0.1,
      ior: 1.5,
      thickness: 0.5,
      side: THREE.DoubleSide,
      clippingPlanes: [this.clippingPlane],
    });

    this.materials['dentin'] = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.5,
      metalness: 0,
      side: THREE.DoubleSide,
      clippingPlanes: [this.clippingPlane],
    });

    this.materials['pulp'] = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.4,
      metalness: 0.1,
      side: THREE.DoubleSide,
      clippingPlanes: [this.clippingPlane],
    });

    this.materials['gum'] = new THREE.MeshStandardMaterial({
      color: 0xfca5a5,
      roughness: 0.6,
      metalness: 0,
      side: THREE.DoubleSide,
      clippingPlanes: [this.clippingPlane],
    });
    
    this.materials['bone'] = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.8,
      metalness: 0,
      side: THREE.DoubleSide,
      clippingPlanes: [this.clippingPlane],
    });
    
    this.materials['transparent'] = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.8,
      opacity: 0.4,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
      side: THREE.DoubleSide,
      clippingPlanes: [this.clippingPlane],
    });
    
    this.materials['error'] = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      wireframe: true,
    });
  }

  resize(width: number, height: number): void {
    if (!isPlatformBrowser(this.platformId) || !this.camera || !this.renderer) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private startAnimationLoop(): void {
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        this.animationFrameId = requestAnimationFrame(animate);
        if (this.controls) {
          if (this.isAutoRotating) {
            this.controls.autoRotate = true;
            this.controls.autoRotateSpeed = 1.0;
          } else {
            this.controls.autoRotate = false;
          }
          this.controls.update();
        }
        if (this.renderer && this.scene && this.camera) {
          this.renderer.render(this.scene, this.camera);
        }
      };
      animate();
    });
  }

  clearModel(): void {
    if (!this.modelGroup) return;
    while (this.modelGroup.children.length > 0) {
      const child = this.modelGroup.children[0];
      this.modelGroup.remove(child);
      if (child instanceof THREE.Mesh) {
        if (child.geometry) child.geometry.dispose();
      }
    }
  }
  
  showErrorPlaceholder(assetId: string): void {
    this.clearModel();
    if (!this.modelGroup) return;
    const asset = DENTAL_3D_ASSETS[assetId];
    
    // Create a wireframe placeholder to indicate missing asset
    const geom = new THREE.BoxGeometry(20, 20, 20);
    const mesh = new THREE.Mesh(geom, this.materials['error']);
    this.modelGroup.add(mesh);
    
    if (this.onAssetLoadError) {
      this.ngZone.run(() => {
        this.onAssetLoadError?.(asset);
      });
    }
  }

  async loadModelAsset(assetId: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    
    this.clearModel();
    const asset = DENTAL_3D_ASSETS[assetId];
    if (!asset) {
      this.showErrorPlaceholder(assetId);
      return;
    }

    const [{ GLTFLoader }] = await Promise.all([
      import('three/examples/jsm/loaders/GLTFLoader.js')
    ]);

    const loader = new GLTFLoader();
    
    loader.load(
      asset.modelUrl,
      (gltf) => {
        const root = gltf.scene;
        
        // Center and scale the loaded model
        const box = new THREE.Box3().setFromObject(root);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 40 / maxDim;
        
        root.scale.set(scale, scale, scale);
        root.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        
        // Apply materials based on node names matching anatomical structures
        root.traverse((node) => {
          if ((node as THREE.Mesh).isMesh) {
            const mesh = node as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            const name = mesh.name.toLowerCase();
            
            if (name.includes('enamel')) {
              mesh.material = this.materials['enamel'];
            } else if (name.includes('dentin')) {
              mesh.material = this.materials['dentin'];
            } else if (name.includes('pulp')) {
              mesh.material = this.materials['pulp'];
            } else if (name.includes('gum') || name.includes('gingiva')) {
              mesh.material = this.materials['gum'];
            } else if (name.includes('bone') || name.includes('jaw')) {
              mesh.material = this.materials['bone'];
            } else {
               // Default fallback for unknown parts, still standard material
              mesh.material = new THREE.MeshStandardMaterial({
                color: 0xcccccc,
                roughness: 0.5,
                clippingPlanes: [this.clippingPlane],
                side: THREE.DoubleSide
              });
            }
          }
        });
        
        this.modelGroup.add(root);
        
        if (this.onAssetLoaded) {
          this.ngZone.run(() => {
            this.onAssetLoaded?.();
          });
        }
      },
      undefined,
      (error) => {
        console.error('Failed to load professional 3D asset:', error);
        // Trigger fallback error overlay due to missing asset
        this.showErrorPlaceholder(assetId);
      }
    );
  }

  setMode(mode: ViewingMode): void {
    if (!isPlatformBrowser(this.platformId) || !this.renderer) return;
    this.activeMode = mode;
    // Enable cross-section clipping plane
    if (mode === 'cross-section') {
      this.renderer.localClippingEnabled = true;
      this.clippingPlane.constant = 0; // Cut down the middle
    } else {
      this.renderer.localClippingEnabled = false;
      this.clippingPlane.constant = 100; // Move plane far away
    }

    // Apply transparency logic depending on the mode
    if (this.modelGroup) {
      this.modelGroup.traverse((node) => {
        if ((node as THREE.Mesh).isMesh) {
          const mesh = node as THREE.Mesh;
          const name = mesh.name.toLowerCase();
          
          if (mode === 'anatomy') {
            // Make enamel transparent so dentin/pulp can be seen
            if (name.includes('enamel')) {
              mesh.material = this.materials['transparent'];
            } else if (name.includes('dentin')) {
              mesh.material = this.materials['dentin'];
            } else if (name.includes('pulp')) {
              mesh.material = this.materials['pulp'];
            }
          } else if (mode === 'xray') {
            // Apply a generic x-ray look to all
             mesh.material = new THREE.MeshPhysicalMaterial({
                color: 0xa8c0ff,
                transparent: true,
                opacity: 0.3,
                roughness: 0.1,
                transmission: 0.9,
                clippingPlanes: [this.clippingPlane],
             });
          } else if (mode === 'surface') {
            // Reset to default materials
            if (name.includes('enamel')) {
              mesh.material = this.materials['enamel'];
            } else if (name.includes('dentin')) {
              mesh.material = this.materials['dentin'];
            } else if (name.includes('pulp')) {
              mesh.material = this.materials['pulp'];
            } else if (name.includes('gum') || name.includes('gingiva')) {
              mesh.material = this.materials['gum'];
            } else if (name.includes('bone') || name.includes('jaw')) {
              mesh.material = this.materials['bone'];
            }
          }
        }
      });
    }
  }

  selectTooth(fdi: number): void {
    this.selectedToothFdi = fdi;
    // In a real jaw model, we would highlight the specific node representing this tooth
    if (this.modelGroup) {
       this.modelGroup.traverse((node) => {
         if ((node as THREE.Mesh).isMesh) {
             const mesh = node as THREE.Mesh;
             // Assuming nodes are named like "tooth_44", etc.
             if (mesh.name.includes(fdi.toString())) {
                const emissiveMat = (mesh.material as THREE.MeshStandardMaterial).clone();
                emissiveMat.emissive = new THREE.Color(0x34d399); // Highlight color
                emissiveMat.emissiveIntensity = 0.5;
                mesh.material = emissiveMat;
             }
         }
       });
    }
  }

  toggleAutoRotate(): boolean {
    this.isAutoRotating = !this.isAutoRotating;
    return this.isAutoRotating;
  }

  resetCamera(): void {
    if (!this.camera || !this.controls) return;
    this.camera.position.set(0, 0, 80);
    this.controls.target.set(0, 0, 0);
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

  dispose(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.controls) {
      this.controls.dispose();
    }

    if (this.modelGroup) {
      this.clearModel();
    }

    Object.values(this.materials).forEach((material) => {
      material.dispose();
    });
    this.materials = {};

    if (this.renderer) {
      this.renderer.dispose();
      const dom = this.renderer.domElement;
      if (dom && dom.parentNode) {
        dom.parentNode.removeChild(dom);
      }
    }
    
    this.onAnnotationsUpdate = undefined;
    this.onAssetLoadError = undefined;
    this.onAssetLoaded = undefined;
  }
}
`;
fs.writeFileSync('src/app/services/dental-3d-engine.service.ts', content, 'utf8');
