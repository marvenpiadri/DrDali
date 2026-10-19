const fs = require('fs');

const content = `import {Injectable, inject, signal} from '@angular/core';
import {Dental3DEngineService, AnnotationPoint} from './dental-3d-engine.service';
import {Dental3DDataService} from './dental-3d-data.service';
import {Dental3DModelType, ViewingMode, ToothNumberingSystem, Dental3DToolConfig} from '../models/dental-3d.model';
import {Dental3DAsset} from '../models/dental-3d-asset.model';

@Injectable({
  providedIn: 'root',
})
export class Dental3DService {
  private engine = inject(Dental3DEngineService);
  private dataService = inject(Dental3DDataService);

  readonly isLoading = signal<boolean>(false);
  readonly currentModelType = signal<Dental3DModelType | null>(null);
  readonly currentMode = signal<ViewingMode>('surface');
  readonly currentStage = signal<number>(0);
  readonly annotations = signal<AnnotationPoint[]>([]);
  
  // Track missing asset errors
  readonly missingAsset = signal<Dental3DAsset | null>(null);

  /**
   * Initializes the Three.js WebGL context inside the host container element.
   */
  init(container: HTMLElement): void {
    this.engine.onAnnotationsUpdate = (points) => {
      this.annotations.set([...points]);
    };
    this.engine.onAssetLoadError = (asset) => {
      this.missingAsset.set(asset);
      this.isLoading.set(false);
    };
    this.engine.onAssetLoaded = () => {
      this.missingAsset.set(null);
      this.isLoading.set(false);
    };
    this.engine.initialize(container);
  }

  /**
   * Maps application tool logic to specific 3D anatomy assets via the registry.
   */
  loadModel(
    type: Dental3DModelType,
    mode: ViewingMode = 'surface',
    stage = 0,
    selectedFdi?: number,
    explode = false,
    crownStage: 'damaged' | 'prepared' | 'crown' = 'crown',
    veneerStage: 'natural' | 'prep' | 'veneer' = 'veneer'
  ): void {
    if (!this.engine.scene) return;

    this.isLoading.set(true);
    this.missingAsset.set(null);
    this.currentModelType.set(type);
    this.currentMode.set(mode);
    this.currentStage.set(stage);

    this.engine.setMode(mode);

    // Map application logic types to actual registered assets
    let assetId = '';
    switch (type) {
      case 'tooth-explorer':
      case 'tooth-decay':
      case 'root-canal':
      case 'crown-explorer':
      case 'veneer-explorer':
        assetId = 'nih-tooth'; // High-res single tooth asset
        break;
      case 'dental-arch':
      case 'gum-disease':
      case 'implant-explorer':
      case 'wisdom-teeth':
      case 'jaw-anatomy':
        assetId = 'omf-lower-jaw'; // Full arch/jaw asset
        break;
      default:
        assetId = 'nih-tooth';
    }

    // This triggers the GLTFLoader. If the asset isn't downloaded,
    // onAssetLoadError will be called, updating the missingAsset signal.
    this.engine.loadModelAsset(assetId);
    
    // Fallback safety timeout if the loader gets completely stuck
    setTimeout(() => {
       if (this.isLoading()) {
          this.isLoading.set(false);
       }
    }, 5000);
  }

  handleResize(width: number, height: number): void {
    this.engine.resize(width, height);
  }

  setMode(mode: ViewingMode): void {
    this.currentMode.set(mode);
    this.engine.setMode(mode);
  }

  selectTooth(fdi: number): void {
    this.engine.selectTooth(fdi);
  }

  setNumberingSystem(system: ToothNumberingSystem): void {
    this.engine.currentNumberingSystem = system;
  }

  toggleAutoRotate(): boolean {
    return this.engine.toggleAutoRotate();
  }

  resetCamera(): void {
    this.engine.resetCamera();
  }

  zoomIn(): void {
    this.engine.zoomIn();
  }

  zoomOut(): void {
    this.engine.zoomOut();
  }

  dispose(): void {
    this.isLoading.set(false);
    this.missingAsset.set(null);
    this.annotations.set([]);
    this.engine.dispose();
  }

  getToolConfig(modelType: string): Dental3DToolConfig | undefined {
    return this.dataService.getToolById(modelType);
  }
}
`;

fs.writeFileSync('src/app/services/dental-3d.service.ts', content, 'utf8');
console.log('Dental3DService successfully refactored.');
