import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  computed,
  viewChild,
  OnInit,
  output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Dental3DViewportComponent } from '../dental-3d-viewport/dental-3d-viewport';
import { Dental3DEngineService } from '../../services/dental-3d-engine.service';
import { Dental3DDataService } from '../../services/dental-3d-data.service';
import { ToothArchItem } from '../../models/dental-3d.model';

export type BoneOpacityMode = 'hidden' | 'visible' | 'translucent';

interface GuidedStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
}

@Component({
  selector: 'app-jawline-3d-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, Dental3DViewportComponent],
  templateUrl: './jawline-3d-viewer.html',
  styleUrl: './jawline-3d-viewer.css',
})
export class Jawline3dViewerComponent implements OnInit {
  public engine = inject(Dental3DEngineService);
  public dataService = inject(Dental3DDataService);
  readonly viewport = viewChild(Dental3DViewportComponent);

  get activeEngine(): Dental3DEngineService {
    return this.viewport()?.service?.engine || this.engine;
  }

  // Outputs
  openToothExplorer = output<number>();

  // State Signals
  viewMode = signal<'explore' | 'learn'>('explore');
  boneMode = signal<BoneOpacityMode>('translucent');
  showTeethLayer = signal<boolean>(true);
  showCanalLayer = signal<boolean>(true);
  showMaxillaLayer = signal<boolean>(true);
  showMandibleLayer = signal<boolean>(true);
  showSinusLayer = signal<boolean>(true);
  selectedToothFdi = signal<number | null>(null);
  
  // Apple-Style Refined UI Signals
  isFullscreen = signal<boolean>(false);
  isSidebarOpen = signal<boolean>(false);
  isAutoRotating = signal<boolean>(false);

  // Arch & Quadrant Focus
  selectedArch = signal<'all' | 'upper' | 'lower'>('all');

  // Computed Tooth Metadata
  selectedToothData = computed<ToothArchItem | null>(() => {
    const fdi = this.selectedToothFdi();
    if (!fdi) return null;
    return this.dataService.getToothByFdi(fdi) || null;
  });

  // Educational Steps
  currentStepIndex = signal<number>(0);
  readonly guidedSteps: GuidedStep[] = [
    {
      id: 'arch',
      title: 'Alignement des Arcades Dentaires',
      icon: 'all_inclusive',
      description: 'Les 32 dents permanentes sont réparties sur deux arcades paraboliques. L\'arcade maxillaire supérieure recouvre physiologiquement l\'arcade mandibulaire inférieure.',
      action: () => {
        this.resetView();
        this.activeEngine.setPresetView('front');
      }
    },
    {
      id: 'bone',
      title: 'Mandibule & Maxillaire',
      icon: 'architecture',
      description: 'Les dents sont ancrées dans les procès alvéolaires. La corticale osseuse externe protège et stabilise la dentition contre les contraintes occlusales.',
      action: () => {
        this.setBoneMode('visible');
        this.showTeethLayer.set(true);
        this.showCanalLayer.set(false);
        this.activeEngine.setLayerVisibilityState({ teeth: true, bone: true, canal: false, sinus: true, pulp: false });
        this.activeEngine.setPresetView('left');
      }
    },
    {
      id: 'roots',
      title: 'Implantation & Racines',
      icon: 'line_style',
      description: 'En rendant l\'os translucide, on observe la divergence des racines pluriradiculées au sein de l\'os alvéolaire, garantissant la stabilité masticatoire.',
      action: () => {
        this.setBoneMode('translucent');
        this.showTeethLayer.set(true);
        this.activeEngine.setLayerVisibilityState({ teeth: true, bone: true });
        this.activeEngine.setPresetView('right');
      }
    },
    {
      id: 'canal',
      title: 'Canaux Alvéolaires Inférieurs',
      icon: 'route',
      description: 'Conduit neurovasculaire primordial traversant la mandibule. Repère chirurgical critique en implantologie et avulsion des troisièmes molaires (dents de sagesse).',
      action: () => {
        this.setArch('lower');
        this.setBoneMode('translucent');
        this.showCanalLayer.set(true);
        this.activeEngine.setLayerVisibilityState({ canal: true, bone: true, teeth: true });
        this.activeEngine.setPresetView('canal');
      }
    }
  ];

  ngOnInit(): void {
    setTimeout(() => this.resetView(), 100);
    if (typeof document !== 'undefined') {
      document.addEventListener('fullscreenchange', () => {
        this.isFullscreen.set(!!document.fullscreenElement);
      });
    }
  }

  toggleAutoRotate(): void {
    const val = !this.isAutoRotating();
    this.isAutoRotating.set(val);
    this.activeEngine.setAutoRotate(val);
  }

  toggleFullscreen(): void {
    if (typeof document === 'undefined') return;
    const el = document.getElementById('jawline-viewer-container');
    if (!document.fullscreenElement && el) {
      el.requestFullscreen().catch((err: unknown) => {
        console.warn('Fullscreen request failed:', err);
      });
      this.isFullscreen.set(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch((err: unknown) => {
        console.warn('Exit fullscreen failed:', err);
      });
      this.isFullscreen.set(false);
    } else {
      this.isFullscreen.update((v) => !v);
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update((v) => !v);
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
    }
  }

  // --- Interaction & Controls ---

  setExploreMode(): void {
    this.viewMode.set('explore');
    this.resetView();
  }

  setLearnMode(): void {
    this.viewMode.set('learn');
    this.executeStep(0);
  }

  executeStep(index: number): void {
    if (index < 0 || index >= this.guidedSteps.length) return;
    this.currentStepIndex.set(index);
    this.selectedToothFdi.set(null);
    this.guidedSteps[index].action();
  }

  nextStep(): void {
    if (this.currentStepIndex() < this.guidedSteps.length - 1) {
      this.executeStep(this.currentStepIndex() + 1);
    }
  }

  prevStep(): void {
    if (this.currentStepIndex() > 0) {
      this.executeStep(this.currentStepIndex() - 1);
    }
  }

  setArch(arch: 'all' | 'upper' | 'lower'): void {
    this.selectedArch.set(arch);
    this.activeEngine.setDentitionArchFilter(arch);
    this.activeEngine.setQuadrantFilter(null);
    this.selectedToothFdi.set(null);
  }

  setBoneMode(mode: BoneOpacityMode): void {
    this.boneMode.set(mode);
    this.activeEngine.setBoneOpacityMode(mode);
  }

  toggleTeethLayer(): void {
    const val = !this.showTeethLayer();
    this.showTeethLayer.set(val);
    this.activeEngine.setLayerVisibilityState({ teeth: val });
  }

  toggleMaxillaLayer(): void {
    const val = !this.showMaxillaLayer();
    this.showMaxillaLayer.set(val);
    this.activeEngine.setLayerVisibilityState({ maxilla: val });
  }

  toggleMandibleLayer(): void {
    const val = !this.showMandibleLayer();
    this.showMandibleLayer.set(val);
    this.activeEngine.setLayerVisibilityState({ mandible: val });
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

  setCanalView(): void {
    // Focus view specifically on the mandibular alveolar nerve canals
    this.setArch('lower');
    this.setBoneMode('translucent');
    this.showCanalLayer.set(true);
    this.showMandibleLayer.set(true);
    this.activeEngine.setLayerVisibilityState({ canal: true, mandible: true, bone: true, teeth: true });
    this.activeEngine.setPresetView('canal');
  }

  // --- Tooth Selection ---

  selectTooth(fdi: number): void {
    const isSameTooth = this.selectedToothFdi() === fdi;
    this.selectedToothFdi.set(fdi);
    // Focus camera once only when selecting a new tooth, preserving free camera orbit afterwards
    if (!isSameTooth) {
      this.activeEngine.focusToothInFullArch(fdi);
      // Optionally make bone translucent to see root relationship
      if (this.boneMode() === 'visible') {
        this.setBoneMode('translucent');
      }
    }
  }

  clearToothSelection(): void {
    this.selectedToothFdi.set(null);
    this.activeEngine.resetFullArchCamera();
  }

  onViewportToothSelected(fdi: number): void {
    if (this.selectedToothFdi() === fdi) return;
    if (this.viewMode() === 'learn') {
      this.setExploreMode();
    }
    this.selectTooth(fdi);
  }

  inspectTooth(): void {
    const fdi = this.selectedToothFdi();
    if (fdi) {
      this.openToothExplorer.emit(fdi);
    }
  }

  // --- Camera Presets ---

  resetView(): void {
    this.selectedArch.set('all');
    this.isAutoRotating.set(false);
    this.boneMode.set('translucent');
    this.showTeethLayer.set(true);
    this.showCanalLayer.set(true);
    this.showMaxillaLayer.set(true);
    this.showMandibleLayer.set(true);
    this.showSinusLayer.set(true);
    this.selectedToothFdi.set(null);
    
    this.activeEngine.setDentitionArchFilter('all');
    this.activeEngine.setQuadrantFilter(null);
    this.activeEngine.setBoneOpacityMode('translucent');
    this.activeEngine.setLayerVisibilityState({
      teeth: true,
      pulp: false,
      bone: true,
      mandible: true,
      maxilla: true,
      canal: true,
      sinus: true,
    });
    this.activeEngine.resetFullArchCamera();
  }

  setOcclusalView(): void {
    this.activeEngine.setPresetView('top');
  }

  setAnteriorView(): void {
    this.activeEngine.setPresetView('front');
  }

  setLeftLateralView(): void {
    this.activeEngine.setPresetView('left');
  }

  setRightLateralView(): void {
    this.activeEngine.setPresetView('right');
  }
}
