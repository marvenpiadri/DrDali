import {Injectable, inject, signal, computed} from '@angular/core';
import {Dental3DEngineService, AnnotationPoint} from './dental-3d-engine.service';
import {Dental3DDataService} from './dental-3d-data.service';
import {Dental3DModelType, ViewingMode, ToothNumberingSystem, Dental3DToolConfig} from '../models/dental-3d.model';
import {Dental3DAsset} from '../models/dental-3d-asset.model';

@Injectable({
  providedIn: 'root',
})
export class Dental3DService {
  public readonly engine = inject(Dental3DEngineService);
  private dataService = inject(Dental3DDataService);

  readonly isLoading = signal<boolean>(false);
  readonly currentModelType = signal<Dental3DModelType | null>(null);
  readonly currentMode = signal<ViewingMode>('surface');
  readonly currentStage = signal<number>(0);
  readonly annotations = signal<AnnotationPoint[]>([]);
  readonly selectedFdi = signal<number | null>(null);
  readonly missingAsset = signal<Dental3DAsset | null>(null);

  readonly hoverTooltip = computed(() => this.engine.hoverTooltip());

  onToothSelectedCallback?: (fdi: number) => void;

  /**
   * Initializes the Three.js WebGL context inside the host container element.
   */
  init(container: HTMLElement): void {
    this.engine.onAnnotationsUpdate = (points) => {
      this.annotations.set([...points]);
    };

    this.engine.onToothClicked = (fdi) => {
      this.selectedFdi.set(fdi);
      this.onToothSelectedCallback?.(fdi);
    };

    this.engine.onAssetLoaded = () => {
      this.missingAsset.set(null);
      this.isLoading.set(false);
    };

    this.engine.onAssetLoadError = (err) => {
      console.error('Dental 3D asset load error:', err);
      const currentType = this.currentModelType();
      this.missingAsset.set(currentType ? this.dataService.getToolById(currentType) ?? null : null);
      this.isLoading.set(false);
    };

    this.engine.initialize(container);
  }

  /**
   * Loads anatomical 3D models based on requested clinical tool and mode
   */
  loadModel(
    type: Dental3DModelType,
    mode: ViewingMode = 'surface',
    stage = 0,
    selectedFdi?: number,
    crownStage: 'damaged' | 'prepared' | 'crown' = 'crown',
    veneerStage: 'natural' | 'prep' | 'veneer' = 'veneer'
  ): void {
    this.isLoading.set(true);
    this.missingAsset.set(null);
    this.currentModelType.set(type);
    this.currentMode.set(mode);
    this.currentStage.set(stage);
    if (selectedFdi !== undefined && selectedFdi !== null && this.selectedFdi() !== selectedFdi) {
      this.selectedFdi.set(selectedFdi);
    }

    this.engine.setMode(mode);

    // Determine if single tooth or full arch/jaw
    const isSingleToothTool = [
      'tooth-explorer',
      'tooth-decay',
      'root-canal',
      'crown-explorer',
      'veneer-explorer',
    ].includes(type);

    if (isSingleToothTool) {
      const fdiToLoad = selectedFdi || 46; // FDI 46 (Mandibular First Molar) default
      this.engine.loadSingleTooth(fdiToLoad, stage, type, crownStage, veneerStage);
    } else {
      // Full arch / jaw tools
      const source: 'toothfairy' | 'diaz' | 'openfulljaw' | 'fang' = 'toothfairy';
      this.engine.loadFullDentition(source);
      if (selectedFdi) {
        this.engine.selectTooth(selectedFdi);
      }
    }
  }

  loadModelWithSource(
    type: Dental3DModelType,
    source: 'toothfairy' | 'diaz' | 'openfulljaw' | 'fang' | 'procedural-molar',
    mode: ViewingMode = 'surface',
    stage = 0,
    selectedFdi?: number
  ): void {
    this.isLoading.set(true);
    this.missingAsset.set(null);
    this.currentModelType.set(type);
    this.currentMode.set(mode);
    this.currentStage.set(stage);
    if (selectedFdi !== undefined && selectedFdi !== null) {
      this.selectedFdi.set(selectedFdi);
    }

    this.engine.setMode(mode);

    const isSingleToothTool = [
      'tooth-explorer',
      'tooth-decay',
      'root-canal',
      'crown-explorer',
      'veneer-explorer',
    ].includes(type);

    if (isSingleToothTool || source === 'procedural-molar') {
      const fdiToLoad = selectedFdi || 46;
      this.engine.loadSingleTooth(fdiToLoad, stage, type);
    } else {
      this.engine.loadFullDentition(source);
      if (selectedFdi) {
        this.engine.selectTooth(selectedFdi);
      }
    }
  }

  setBoneArchitectureMode(mode: 'cortical' | 'trabecular' | 'combined' | 'xray'): void {
    this.engine.setBoneArchitectureMode(mode);
  }

  setSupportingStructuresMode(mode: 'full' | 'pdl' | 'bone' | 'relationship'): void {
    this.engine.setSupportingStructuresMode(mode);
  }

  setPediatricMode(mode: 'complete' | 'open-apex' | 'maintainer'): void {
    this.engine.setPediatricMode(mode);
  }

  setAnatomicalRelationshipMode(focus: 'nerve' | 'sinus' | 'all'): void {
    this.engine.setAnatomicalRelationshipMode(focus);
  }

  handleResize(width: number, height: number): void {
    this.engine.resize(width, height);
  }

  setMode(mode: ViewingMode): void {
    this.currentMode.set(mode);
    this.engine.setMode(mode);
  }

  selectTooth(fdi: number): void {
    this.selectedFdi.set(fdi);
    this.engine.selectTooth(fdi);
  }

  focusStructure(structure: 'enamel' | 'dentin' | 'pulp' | 'root'): void {
    this.engine.focusStructure(structure);
  }

  setCameraAngle(angle: 'front' | 'back' | 'side' | 'occlusal'): void {
    this.engine.setCameraAngle(angle);
  }

  toggleLayerVisibility(layer: 'bone' | 'teeth' | 'pulp' | 'canal' | 'pdl' | 'sinus', visible: boolean): void {
    this.engine.toggleLayerVisibility(layer, visible);
  }

  setBoneOpacity(opacity: number): void {
    this.engine.setBoneOpacity(opacity);
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
