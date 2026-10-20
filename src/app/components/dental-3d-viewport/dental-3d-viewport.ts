import {
  Component,
  ElementRef,
  viewChild,
  input,
  output,
  signal,
  effect,
  untracked,
  OnDestroy,
  AfterViewInit,
  inject,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';
import {Dental3DService} from '../../services/dental-3d.service';
import {Dental3DModelType, ViewingMode} from '../../models/dental-3d.model';
import {DentalLoaderComponent} from '../dental-loader/dental-loader';
import {Dental3DEngineService} from '../../services/dental-3d-engine.service';
import {AnatomyTooltipService} from '../../services/anatomy-tooltip.service';
import {TranslatePipe} from '../../pipes/translate.pipe';

@Component({
  selector: 'app-dental-3d-viewport',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DentalLoaderComponent, TranslatePipe],
  providers: [Dental3DService, Dental3DEngineService],
  templateUrl: './dental-3d-viewport.html',
  styleUrl: './dental-3d-viewport.css',
})
export class Dental3DViewportComponent implements AfterViewInit, OnDestroy {
  readonly canvasContainer = viewChild<ElementRef<HTMLDivElement>>('canvasContainer');

  // Inputs
  readonly modelType = input.required<Dental3DModelType>();
  readonly modelSource = input<'toothfairy' | 'diaz' | 'openfulljaw' | 'fang' | 'procedural-molar' | undefined>(undefined);
  readonly activeMode = input<ViewingMode>('surface');
  readonly stageIndex = input<number>(0);
  readonly selectedToothFdi = input<number | undefined>(undefined);
  readonly explode = input<boolean>(false);
  readonly crownStage = input<'damaged' | 'prepared' | 'crown'>('crown');
  readonly veneerStage = input<'natural' | 'prep' | 'veneer'>('veneer');
  readonly focusedStructure = input<'enamel' | 'dentin' | 'pulp' | 'root' | undefined>(undefined);
  readonly showControls = input<boolean>(true);

  // Outputs
  readonly toothSelected = output<number>();
  readonly modeChange = output<ViewingMode>();

  // State
  public readonly service = inject(Dental3DService);
  private tooltipService = inject(AnatomyTooltipService);
  
  readonly isLoading = computed(() => this.service.isLoading());
  readonly missingAsset = computed(() => this.service.missingAsset());
  readonly annotations = computed(() => this.service.annotations());
  
  readonly isAutoRotating = signal(false);
  readonly isFullscreen = signal(false);
  readonly hasInteracted = signal(false);
 
  readonly hoverTooltip = computed(() => this.tooltipService.activeTooltip());
 
  private resizeObserver: ResizeObserver | null = null;
  private isInitialized = false;
  private fullscreenChangeHandler: (() => void) | null = null;
 
  private lastLoadedModelConfig: string | null = null;
 
  constructor() {
    // Model reload effect
    effect(() => {
      const type = this.modelType();
      const source = this.modelSource();
      const mode = this.activeMode();
      const stage = this.stageIndex();
      const fdi = this.selectedToothFdi();
      const crown = this.crownStage();
      const veneer = this.veneerStage();
 
      if (!this.isInitialized) return;
 
      const isSingleToothTool = [
        'tooth-explorer',
        'tooth-decay',
        'root-canal',
        'crown-explorer',
        'veneer-explorer',
      ].includes(type) || source === 'procedural-molar';

      const modelConfigKey = isSingleToothTool
        ? `${type}:${source || ''}:${stage}:${fdi || ''}:${crown}:${veneer}`
        : `${type}:${source || ''}:${stage}:${crown}:${veneer}`;
 
      untracked(() => {
        if (this.lastLoadedModelConfig !== modelConfigKey) {
          this.lastLoadedModelConfig = modelConfigKey;
          if (source) {
            this.service.loadModelWithSource(type, source, mode, stage, fdi);
          } else {
            this.service.loadModel(type, mode, stage, fdi, crown, veneer);
          }
        } else {
          this.service.setMode(mode);
          if (!isSingleToothTool) {
            this.service.engine.selectTooth(fdi !== undefined && fdi !== null ? fdi : null);
          }
        }
      });
    });

    // Structure focus effect
    effect(() => {
      const struct = this.focusedStructure();
      if (!this.isInitialized || !struct) return;

      untracked(() => {
        this.service.focusStructure(struct);
      });
    });
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    const container = this.canvasContainer()?.nativeElement;
    if (!container) return;

    this.service.onToothSelectedCallback = (fdi) => {
      this.toothSelected.emit(fdi);
    };

    this.service.init(container);
    this.isInitialized = true;

    // Interaction dismiss
    const dismissInteraction = () => {
      if (!this.hasInteracted()) {
        this.hasInteracted.set(true);
      }
    };
    container.addEventListener('pointerdown', dismissInteraction, { passive: true });
    container.addEventListener('wheel', dismissInteraction, { passive: true });
    container.addEventListener('touchstart', dismissInteraction, { passive: true });

    // Sync fullscreen state
    this.fullscreenChangeHandler = () => {
      this.isFullscreen.set(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', this.fullscreenChangeHandler);

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          this.service.handleResize(width, height);
        }
      }
    });
    this.resizeObserver.observe(container);

    this.service.loadModel(
      this.modelType(),
      this.activeMode(),
      this.stageIndex(),
      this.selectedToothFdi(),
      this.crownStage(),
      this.veneerStage()
    );
  }

  readonly activeViewAngle = signal<'front' | 'back' | 'side' | 'occlusal' | null>(null);

  toggleAutoRotate(): void {
    const isSpinning = this.service.toggleAutoRotate();
    this.isAutoRotating.set(isSpinning);
  }

  setCameraAngle(angle: 'front' | 'back' | 'side' | 'occlusal'): void {
    this.activeViewAngle.set(angle);
    this.service.setCameraAngle(angle);
  }

  resetCamera(): void {
    this.activeViewAngle.set(null);
    this.service.resetCamera();
  }

  zoomIn(): void {
    this.service.zoomIn();
  }

  zoomOut(): void {
    this.service.zoomOut();
  }

  toggleFullscreen(): void {
    const container = this.canvasContainer()?.nativeElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.().then(() => this.isFullscreen.set(true)).catch((err: unknown) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen?.().then(() => this.isFullscreen.set(false)).catch((err: unknown) => {
        console.warn('Exit fullscreen failed:', err);
      });
    }
  }

  setMode(mode: ViewingMode): void {
    this.modeChange.emit(mode);
  }

  ngOnDestroy(): void {
    if (this.fullscreenChangeHandler && typeof document !== 'undefined') {
      document.removeEventListener('fullscreenchange', this.fullscreenChangeHandler);
      this.fullscreenChangeHandler = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    this.service.dispose();
  }
}
