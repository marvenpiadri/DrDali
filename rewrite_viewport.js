const fs = require('fs');
const content = `import {
  Component,
  ElementRef,
  viewChild,
  input,
  output,
  signal,
  effect,
  OnDestroy,
  AfterViewInit,
  inject,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';
import {Dental3DService} from '../../services/dental-3d.service';
import {Dental3DModelType, ViewingMode} from '../../models/dental-3d.model';
import {DentalLoaderComponent} from '../dental-loader/dental-loader';

@Component({
  selector: 'app-dental-3d-viewport',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DentalLoaderComponent],
  templateUrl: './dental-3d-viewport.html',
  styleUrl: './dental-3d-viewport.css',
})
export class Dental3DViewportComponent implements AfterViewInit, OnDestroy {
  readonly canvasContainer = viewChild<ElementRef<HTMLDivElement>>('canvasContainer');

  // Inputs
  readonly modelType = input.required<Dental3DModelType>();
  readonly activeMode = input<ViewingMode>('surface');
  readonly stageIndex = input<number>(0);
  readonly selectedToothFdi = input<number | undefined>(undefined);
  readonly explode = input<boolean>(false);
  readonly crownStage = input<'damaged' | 'prepared' | 'crown'>('crown');
  readonly veneerStage = input<'natural' | 'prep' | 'veneer'>('veneer');

  // Outputs
  readonly toothSelected = output<number>();
  readonly modeChange = output<ViewingMode>();

  // State
  private service = inject(Dental3DService);
  
  readonly isLoading = computed(() => this.service.isLoading());
  readonly missingAsset = computed(() => this.service.missingAsset());
  readonly annotations = computed(() => this.service.annotations());
  
  readonly isAutoRotating = signal(false);
  readonly isFullscreen = signal(false);

  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    effect(() => {
      const type = this.modelType();
      const mode = this.activeMode();
      const stage = this.stageIndex();
      const fdi = this.selectedToothFdi();
      const isExploded = this.explode();
      const cStage = this.crownStage();
      const vStage = this.veneerStage();

      if (!this.canvasContainer()) return;
      this.service.loadModel(type, mode, stage, fdi, isExploded, cStage, vStage);
    });
  }

  ngAfterViewInit(): void {
    const container = this.canvasContainer()?.nativeElement;
    if (!container) return;

    this.service.init(container);

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
      this.explode(),
      this.crownStage(),
      this.veneerStage()
    );
  }

  toggleAutoRotate(): void {
    const isSpinning = this.service.toggleAutoRotate();
    this.isAutoRotating.set(isSpinning);
  }

  resetCamera(): void {
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
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    this.service.dispose();
  }
}
`;
fs.writeFileSync('src/app/components/dental-3d-viewport/dental-3d-viewport.ts', content, 'utf8');
