import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  output,
  input,
  OnInit,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Dental3DViewportComponent } from '../dental-3d-viewport/dental-3d-viewport';
import { Dental3DEngineService } from '../../services/dental-3d-engine.service';
import { Dental3DDataService } from '../../services/dental-3d-data.service';
import { ToothArchItem } from '../../models/dental-3d.model';
import { TranslatePipe } from '../../pipes/translate.pipe';

export type ArchFilter = 'all' | 'upper' | 'lower';
export type QuadrantFilter = 1 | 2 | 3 | 4 | null;
export type BoneOpacityMode = 'hidden' | 'visible' | 'translucent';

@Component({
  selector: 'app-full-mouth-explorer',
  imports: [CommonModule, MatIconModule, Dental3DViewportComponent, TranslatePipe],
  templateUrl: './full-mouth-explorer.html',
  styleUrl: './full-mouth-explorer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullMouthExplorerComponent implements OnInit, OnDestroy {
  public engine = inject(Dental3DEngineService);
  public dataService = inject(Dental3DDataService);

  readonly viewport = viewChild(Dental3DViewportComponent);

  get activeEngine(): Dental3DEngineService {
    return this.viewport()?.service?.engine || this.engine;
  }

  // Inputs & Outputs
  initialToothFdi = input<number | null>(null);
  openToothExplorer = output<number>();

  // State Signals
  selectedArch = signal<ArchFilter>('all');
  selectedQuadrant = signal<QuadrantFilter>(null);
  boneMode = signal<BoneOpacityMode>('translucent');

  showTeethLayer = signal<boolean>(true);
  showPulpLayer = signal<boolean>(false);
  showBoneLayer = signal<boolean>(true);
  showCanalLayer = signal<boolean>(true);
  showSinusLayer = signal<boolean>(true);

  selectedToothFdi = signal<number | null>(null);
  showFdiLabels = signal<boolean>(false);
  isAccessibleListOpen = signal<boolean>(false);

  fdiPositions = signal<{ fdi: number; x: number; y: number; visible: boolean }[]>([]);
  private labelTimer: ReturnType<typeof setTimeout> | null = null;

  // Computed Tooth Metadata
  selectedToothData = computed<ToothArchItem | null>(() => {
    const fdi = this.selectedToothFdi();
    if (!fdi) return null;
    return this.dataService.getToothByFdi(fdi) || null;
  });

  // Nearby Anatomy Callout based on tooth location
  nearbyAnatomyInfo = computed<{ title: string; description: string; tag: string } | null>(() => {
    const data = this.selectedToothData();
    if (!data) return null;

    const fdi = data.fdi;
    if ((fdi >= 34 && fdi <= 38) || (fdi >= 44 && fdi <= 48)) {
      return {
        title: 'Inferior Alveolar Canal',
        tag: 'Mandibular Neurovascular Pathway',
        description:
          'Passes through the bony mandibular canal directly below the apices of premolars and molars. Critical landmark in implant surgery and wisdom tooth extraction.',
      };
    } else if ((fdi >= 14 && fdi <= 18) || (fdi >= 24 && fdi <= 28)) {
      return {
        title: 'Maxillary Sinus Floor',
        tag: 'Schneiderian Membrane Floor',
        description:
          'Directly opposes the apical roots of maxillary premolars and molars. Root tips often project into or closely contact the sinus floor.',
      };
    } else {
      return {
        title: 'Alveolar Bone Ridge',
        tag: 'Cortical & Trabecular Plate',
        description:
          'Provides structural socket support (alveolus) anchored via the periodontal ligament desmodontal fibers.',
      };
    }
  });

  // Quadrant Tooth Collections
  q1Teeth = computed(() => this.dataService.dentalArchTeeth.filter((t: ToothArchItem) => t.quadrant === 1));
  q2Teeth = computed(() => this.dataService.dentalArchTeeth.filter((t: ToothArchItem) => t.quadrant === 2));
  q3Teeth = computed(() => this.dataService.dentalArchTeeth.filter((t: ToothArchItem) => t.quadrant === 3));
  q4Teeth = computed(() => this.dataService.dentalArchTeeth.filter((t: ToothArchItem) => t.quadrant === 4));

  ngOnInit(): void {
    if (this.initialToothFdi()) {
      this.selectedToothFdi.set(this.initialToothFdi());
    }

    // Start 2D FDI position update timer
    this.labelTimer = setInterval(() => {
      if (this.showFdiLabels()) {
        const positions = this.activeEngine.getToothScreenPositions();
        this.fdiPositions.set(positions);
      }
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.labelTimer) {
      clearInterval(this.labelTimer);
    }
  }

  // --- Dentition Arch Filter ---
  setArch(arch: ArchFilter): void {
    this.selectedArch.set(arch);
    this.selectedQuadrant.set(null);
    this.activeEngine.setDentitionArchFilter(arch);
    this.activeEngine.setQuadrantFilter(null);
  }

  // --- Quadrant Filter ---
  setQuadrant(q: QuadrantFilter): void {
    this.selectedQuadrant.set(q);
    this.activeEngine.setQuadrantFilter(q);
  }

  // --- Bone Opacity Mode ---
  setBoneMode(mode: BoneOpacityMode): void {
    this.boneMode.set(mode);
    this.activeEngine.setBoneOpacityMode(mode);
  }

  // --- Layer Toggles ---
  toggleTeethLayer(): void {
    const val = !this.showTeethLayer();
    this.showTeethLayer.set(val);
    this.activeEngine.setLayerVisibilityState({ teeth: val });
  }

  togglePulpLayer(): void {
    const val = !this.showPulpLayer();
    this.showPulpLayer.set(val);
    this.activeEngine.setLayerVisibilityState({ pulp: val });
  }

  toggleBoneLayer(): void {
    const val = !this.showBoneLayer();
    this.showBoneLayer.set(val);
    if (!val) {
      this.boneMode.set('hidden');
      this.activeEngine.setBoneOpacityMode('hidden');
    } else {
      this.boneMode.set('visible');
      this.activeEngine.setBoneOpacityMode('visible');
    }
    this.activeEngine.setLayerVisibilityState({ bone: val });
  }

  toggleCanalLayer(): void {
    const val = !this.showCanalLayer();
    this.showCanalLayer.set(val);
    this.activeEngine.setLayerVisibilityState({ canal: val });
  }

  toggleSinusLayer(): void {
    const val = !this.showSinusLayer();
    this.showSinusLayer.set(val);
    this.activeEngine.setLayerVisibilityState({ sinus: val });
  }

  // --- Tooth Selection ---
  selectTooth(fdi: number): void {
    const isSameTooth = this.selectedToothFdi() === fdi;
    this.selectedToothFdi.set(fdi);
    if (!isSameTooth) {
      this.activeEngine.focusToothInFullArch(fdi);
    }
  }

  clearToothSelection(): void {
    this.selectedToothFdi.set(null);
    this.activeEngine.resetFullArchCamera();
  }

  onViewportToothSelected(fdi: number): void {
    if (this.selectedToothFdi() === fdi) return;
    this.selectTooth(fdi);
  }

  // --- Tooth Navigation (Prev / Next) ---
  navigateToTooth(direction: 'prev' | 'next'): void {
    const allFdis = this.dataService.dentalArchTeeth.map((t: ToothArchItem) => t.fdi);
    const current = this.selectedToothFdi();

    if (!current) {
      this.selectTooth(allFdis[0]);
      return;
    }

    const currentIndex = allFdis.indexOf(current);
    if (currentIndex === -1) return;

    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0) nextIndex = allFdis.length - 1;
    if (nextIndex >= allFdis.length) nextIndex = 0;

    this.selectTooth(allFdis[nextIndex]);
  }

  // --- Trigger Detail Explorer Transition ---
  exploreSelectedTooth(): void {
    const fdi = this.selectedToothFdi();
    if (fdi) {
      this.openToothExplorer.emit(fdi);
    }
  }

  // --- Orientation Controls ---
  resetView(): void {
    // Reset signals to default
    this.selectedArch.set('all');
    this.selectedQuadrant.set(null);
    this.boneMode.set('translucent');
    this.showTeethLayer.set(true);
    this.showPulpLayer.set(false);
    this.showBoneLayer.set(true);
    this.showCanalLayer.set(true);
    this.showSinusLayer.set(true);
    this.selectedToothFdi.set(null);

    // Synchronize 3D Engine state
    this.activeEngine.setDentitionArchFilter('all');
    this.activeEngine.setQuadrantFilter(null);
    this.activeEngine.setBoneOpacityMode('translucent');
    this.activeEngine.setLayerVisibilityState({
      teeth: true,
      pulp: false,
      bone: true,
      canal: true,
      sinus: true,
    });
    this.activeEngine.resetFullArchCamera();
  }

  setCanalView(): void {
    this.selectedArch.set('lower');
    this.selectedQuadrant.set(null);
    this.boneMode.set('translucent');
    this.showCanalLayer.set(true);
    this.showBoneLayer.set(true);
    this.showTeethLayer.set(true);

    this.activeEngine.setDentitionArchFilter('lower');
    this.activeEngine.setQuadrantFilter(null);
    this.activeEngine.setBoneOpacityMode('translucent');
    this.activeEngine.setLayerVisibilityState({
      teeth: true,
      bone: true,
      canal: true,
    });
    this.activeEngine.setPresetView('canal');
  }

  setOcclusalView(): void {
    this.activeEngine.setPresetView('top');
  }

  setAnteriorView(): void {
    this.activeEngine.setPresetView('front');
  }

  setPosteriorView(): void {
    this.activeEngine.setPresetView('back');
  }

  setLeftLateralView(): void {
    this.activeEngine.setPresetView('left');
  }

  setRightLateralView(): void {
    this.activeEngine.setPresetView('right');
  }

  toggleFdiLabels(): void {
    this.showFdiLabels.set(!this.showFdiLabels());
  }

  toggleAccessibleList(): void {
    this.isAccessibleListOpen.set(!this.isAccessibleListOpen());
  }
}
