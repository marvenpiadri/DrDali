import { Jawline3dViewerComponent } from "../../components/jawline-3d-viewer/jawline-3d-viewer";
import { FullMouthExplorerComponent } from "../../components/full-mouth-explorer/full-mouth-explorer";
import { Tooth3dViewerComponent } from "../../components/tooth-3d-viewer/tooth-3d-viewer";
import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Dental3DDataService} from '../../services/dental-3d-data.service';
import {Dental3DViewportComponent} from '../../components/dental-3d-viewport/dental-3d-viewport';
import {
  Dental3DToolConfig,
  ViewingMode,
  ToothNumberingSystem,
  Dental3DStage,
  ToothArchItem,
  Dental3DStructure,
} from '../../models/dental-3d.model';
import {TranslationService} from '../../services/translation.service';
import { WhatsAppIconComponent } from '../../components/whatsapp-icon/whatsapp-icon';

@Component({
  selector: 'app-tools-3d-detail',
  imports: [
    RouterLink,
    Dental3DViewportComponent,
    Jawline3dViewerComponent,
    FullMouthExplorerComponent,
    Tooth3dViewerComponent,
    WhatsAppIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tools-3d-detail.html',
  styleUrl: './tools-3d-detail.css',
})
export class Tools3dDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dataService = inject(Dental3DDataService);
  readonly translationService = inject(TranslationService);

  // Current tool configuration
  readonly toolConfig = signal<Dental3DToolConfig | undefined>(undefined);

  // Interactive 3D State
  readonly activeMode = signal<ViewingMode>('surface');
  readonly currentStageIndex = signal<number>(0);
  readonly selectedToothFdi = signal<number>(16);
  readonly isImplantExploded = signal<boolean>(false);
  readonly crownStage = signal<'damaged' | 'prepared' | 'crown'>('crown');
  readonly veneerStage = signal<'natural' | 'prep' | 'veneer'>('veneer');
  readonly numberingSystem = signal<ToothNumberingSystem>('fdi');
  readonly selectedStructureId = signal<string>('enamel');

  // Fallback 2D mode toggle
  readonly show2dFallback = signal<boolean>(false);

  // Computed data
  readonly currentStage = computed<Dental3DStage | undefined>(() => {
    const config = this.toolConfig();
    if (!config || !config.stages) return undefined;
    return config.stages[this.currentStageIndex()] || config.stages[0];
  });

  readonly selectedTooth = computed<ToothArchItem | undefined>(() => {
    return this.dataService.getToothByFdi(this.selectedToothFdi());
  });

  readonly selectedStructure = computed<Dental3DStructure | undefined>(() => {
    const config = this.toolConfig();
    if (!config || !config.structures) return undefined;
    return config.structures.find((s) => s.id === this.selectedStructureId()) || config.structures[0];
  });

  // Dynamic route tracking for breadcrumbs
  readonly isAtlasRoute = signal<boolean>(true);

  readonly whatsappUrl = computed(() => {
    const config = this.toolConfig();
    const title = config ? config.title : 'Consultation Dentaire';
    const text = encodeURIComponent(`Bonjour Centre Dentaire Dali, j'ai exploré l'outil 3D "${title}" sur votre site et je souhaiterais prendre rendez-vous pour une consultation.`);
    return `https://wa.me/212661000000?text=${text}`;
  });

  ngOnInit(): void {
    const routeData = this.route.snapshot.data as { toolId?: string };
    const toolIdFromData = routeData.toolId;

    // Determine if we are under /atlas or /tools route path
    const pathFirstSegment = this.route.snapshot.parent?.url[0]?.path || this.route.snapshot.url[0]?.path;
    this.isAtlasRoute.set(pathFirstSegment === 'atlas');

    this.route.paramMap.subscribe((params) => {
      const toolId = toolIdFromData || params.get('toolId') || 'tooth-explorer';
      const config = this.dataService.getToolById(toolId);
      if (config) {
        this.toolConfig.set(config);
        this.activeMode.set(config.defaultMode);
        this.currentStageIndex.set(0);
      }
    });

    this.route.queryParamMap.subscribe((queryParams) => {
      const fdi = queryParams.get('fdi') || queryParams.get('tooth');
      if (fdi) {
        const num = parseInt(fdi, 10);
        if (!isNaN(num)) {
          this.selectedToothFdi.set(num);
        }
      }
    });
  }

  navigateToTooth(fdi: number): void {
    const base = this.isAtlasRoute() ? '/atlas' : '/tools';
    this.router.navigate([base, 'tooth-explorer'], { queryParams: { fdi } });
  }

  navigateBackToArch(): void {
    const base = this.isAtlasRoute() ? '/atlas' : '/tools';
    this.router.navigate([base, 'dental-arch'], {
      queryParams: this.selectedToothFdi() ? { fdi: this.selectedToothFdi() } : undefined,
    });
  }

  setMode(mode: ViewingMode): void {
    this.activeMode.set(mode);
  }

  setStageIndex(index: number): void {
    this.currentStageIndex.set(index);
  }

  onToothSelected(fdi: number): void {
    this.selectedToothFdi.set(fdi);
  }

  selectStructure(id: string): void {
    this.selectedStructureId.set(id);
  }

  toggleImplantExplode(): void {
    this.isImplantExploded.update((v) => !v);
  }

  setCrownStage(stage: 'damaged' | 'prepared' | 'crown'): void {
    this.crownStage.set(stage);
  }

  setVeneerStage(stage: 'natural' | 'prep' | 'veneer'): void {
    this.veneerStage.set(stage);
  }

  setNumberingSystem(sys: ToothNumberingSystem): void {
    this.numberingSystem.set(sys);
  }

  toggle2DFallback(): void {
    this.show2dFallback.update((v) => !v);
  }
}
