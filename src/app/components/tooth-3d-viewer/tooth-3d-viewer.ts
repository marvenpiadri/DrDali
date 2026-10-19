import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  inject,
  effect,
  viewChild,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Dental3DViewportComponent } from '../dental-3d-viewport/dental-3d-viewport';
import { ViewingMode } from '../../models/dental-3d.model';
import { Dental3DDataService } from '../../services/dental-3d-data.service';
import { TranslationService } from '../../services/translation.service';

export type ToothViewerMode = 'full' | 'cross-section' | 'xray' | 'anatomy';
export type ToothPart = 'enamel' | 'dentin' | 'pulp' | 'root';
export type ToothCategory = 'all' | 'incisor' | 'canine' | 'premolar' | 'molar';

export interface ToothTypeOption {
  id: ToothCategory;
  label: string;
  shortLabel: string;
  count: number;
  fdis: number[];
}

export const TOOTH_CATEGORIES: ToothTypeOption[] = [
  {
    id: 'incisor',
    label: 'Incisives',
    shortLabel: 'Incisives',
    count: 8,
    fdis: [11, 12, 21, 22, 31, 32, 41, 42],
  },
  {
    id: 'canine',
    label: 'Canines',
    shortLabel: 'Canines',
    count: 4,
    fdis: [13, 23, 33, 43],
  },
  {
    id: 'premolar',
    label: 'Prémolaires',
    shortLabel: 'Prémolaires',
    count: 8,
    fdis: [14, 15, 24, 25, 34, 35, 44, 45],
  },
  {
    id: 'molar',
    label: 'Molaires',
    shortLabel: 'Molaires',
    count: 12,
    fdis: [16, 17, 18, 26, 27, 28, 36, 37, 38, 46, 47, 48],
  },
];

export interface StructureItem {
  id: ToothPart;
  num: string;
  name: string;
  subtitle: string;
  metric: string;
  metricLabel: string;
  description: string;
  clinicalNote: string;
  modeHelp: string;
  linkedMode: ToothViewerMode;
  colorHex: string;
  badgeBg: string;
  badgeBorder: string;
}

export const ANATOMY_STRUCTURES: StructureItem[] = [
  {
    id: 'enamel',
    num: '01',
    name: 'Émail Dentaire',
    subtitle: 'Couronne Externe',
    metric: '96%',
    metricLabel: 'Hydroxyapatite',
    description:
      'Le tissu le plus dur de l\'organisme humain. Il forme la coque protectrice externe de la couronne, résistant aux forces de broyage et aux attaques acides.',
    clinicalNote:
      'Dépourvu de cellules vivantes, l\'émail ne peut s\'auto-régénérer. Toute lésion carieuse le traversant progresse vers la dentine.',
    modeHelp: 'Vue externe complète de la couronne et des cuspides occlusales',
    linkedMode: 'full',
    colorHex: '#f8fafc',
    badgeBg: 'bg-slate-100/10 text-slate-200',
    badgeBorder: 'border-slate-400/30',
  },
  {
    id: 'dentin',
    num: '02',
    name: 'Dentine (Ivoire)',
    subtitle: 'Paroi Tubulaire',
    metric: '70%',
    metricLabel: 'Tissu Vivant Calcifié',
    description:
      'Couche intermédiaire élastique traversée de millions de tubuli microscopiques contenant les prolongements des odontoblastes reliant la périphérie à la pulpe.',
    clinicalNote:
      'Transmet les stimuli thermiques (froid/chaud) et osmotiques, responsable de l\'hypersensibilité dentinaire.',
    modeHelp: 'Section sagittale réelle Micro-CT exposant l\'épaisseur de paroi',
    linkedMode: 'cross-section',
    colorHex: '#f59e0b',
    badgeBg: 'bg-amber-500/10 text-amber-300',
    badgeBorder: 'border-amber-500/30',
  },
  {
    id: 'pulp',
    num: '03',
    name: 'Pulpe & Canaux',
    subtitle: 'Endodonte Vivant',
    metric: '100%',
    metricLabel: 'Vascularisé & Innervé',
    description:
      'Le cœur vivant de la dent abritant le tissu conjonctif lâche, les vaisseaux sanguins nourriciers et les fibres nerveuses sensitives du nerf trijumeau.',
    clinicalNote:
      'En cas de pulpite irréversible ou de nécrose, un traitement endodontique sous microscope permet de désinfecter et d\'obturer ce réseau.',
    modeHelp: 'Isolation 3D avec zoom automatique sur la chambre et les canaux',
    linkedMode: 'anatomy',
    colorHex: '#ef4444',
    badgeBg: 'bg-rose-500/10 text-rose-300',
    badgeBorder: 'border-rose-500/30',
  },
  {
    id: 'root',
    num: '04',
    name: 'Racines & Apex',
    subtitle: 'Ancrage Desmodontal',
    metric: '2-3',
    metricLabel: 'Racines Selon la Dent',
    description:
      'Piliers anatomiques ancrés dans l\'os alvéolaire par le ligament alvéolo-dentaire (desmodonte). Les foramens apicaux assurent le passage neurovasculaire.',
    clinicalNote:
      'Les racines de la molaire #46 supportent des contraintes masticatoires allant jusqu\'à 70 kg/cm².',
    modeHelp: 'Orientation de caméra axée sur la zone de furcation et les apex',
    linkedMode: 'full',
    colorHex: '#94a3b8',
    badgeBg: 'bg-emerald-500/10 text-emerald-300',
    badgeBorder: 'border-emerald-500/30',
  },
];

export interface ViewModeConfig {
  id: ToothViewerMode;
  labelKey: string;
}

@Component({
  selector: 'app-tooth-3d-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, Dental3DViewportComponent],
  templateUrl: './tooth-3d-viewer.html',
  styleUrl: './tooth-3d-viewer.css',
})
export class Tooth3dViewerComponent implements OnInit {
  private dataService = inject(Dental3DDataService);
  readonly i18n = inject(TranslationService);
  readonly viewport = viewChild(Dental3DViewportComponent);

  readonly isCompact = input<boolean>(false);
  readonly initialFdi = input<number | undefined>(undefined);
  readonly selectedFdi = signal<number>(46);
  readonly backToFullMouth = output<void>();

  // 4-Tooth-Type Filter State
  readonly toothCategories = TOOTH_CATEGORIES;
  readonly selectedCategory = signal<ToothCategory>('molar');

  readonly isSelectorExpanded = signal<boolean>(false);
  readonly selectedQuadrantTab = signal<number | 'all'>('all');

  readonly allTeeth = computed(() => this.dataService.dentalArchTeeth);

  readonly localizedToothName = computed<string>(() => {
    const t = this.selectedTooth();
    if (!t) return `Dent #${this.selectedFdi()}`;
    const lang = this.i18n.currentLang();
    if (lang === 'ar') return t.nameAr || t.nameFr;
    if (lang === 'en') {
      const typeStr = t.type.charAt(0).toUpperCase() + t.type.slice(1);
      const archStr = t.arch === 'maxillary' ? 'Maxillary' : 'Mandibular';
      return `${archStr} ${typeStr} #${t.fdi}`;
    }
    return t.nameFr;
  });

  readonly localizedArchName = computed<string>(() => {
    const t = this.selectedTooth();
    if (!t) return '';
    return t.arch === 'maxillary' ? this.i18n.translate('upperArch') : this.i18n.translate('lowerArch');
  });

  getCategoryLabel(catId: ToothCategory): string {
    switch (catId) {
      case 'incisor': return this.i18n.translate('toothCategoryIncisors');
      case 'canine': return this.i18n.translate('toothCategoryCanines');
      case 'premolar': return this.i18n.translate('toothCategoryPremolars');
      case 'molar': return this.i18n.translate('toothCategoryMolars');
      default: return this.i18n.translate('toothCategoryAll');
    }
  }

  readonly activeCategoryTeeth = computed(() => {
    const catId = this.selectedCategory();
    if (catId === 'all') {
      return this.allTeeth();
    }
    const cat = TOOTH_CATEGORIES.find((c) => c.id === catId);
    if (!cat) return this.allTeeth();
    return this.allTeeth().filter((t) => cat.fdis.includes(t.fdi));
  });

  readonly displayedTeeth = computed(() => {
    const q = this.selectedQuadrantTab();
    const list = this.allTeeth();
    if (q === 'all') return list;
    return list.filter((t) => t.quadrant === q);
  });

  readonly selectedTooth = computed(() => {
    return this.dataService.getToothByFdi(this.selectedFdi());
  });

  readonly activeMode = signal<ToothViewerMode>('full');
  readonly selectedPart = signal<ToothPart>('enamel');
  readonly focusedStructure = signal<'enamel' | 'dentin' | 'pulp' | 'root' | undefined>(undefined);
  readonly isFullscreen = signal<boolean>(false);
  readonly isAutoRotating = signal<boolean>(false);

  readonly viewModes: ViewModeConfig[] = [
    {
      id: 'full',
      labelKey: 'viewModeFull',
    },
    {
      id: 'cross-section',
      labelKey: 'viewModeCross',
    },
    {
      id: 'xray',
      labelKey: 'viewModeXray',
    },
    {
      id: 'anatomy',
      labelKey: 'viewModePulp',
    },
  ];

  readonly structures = ANATOMY_STRUCTURES;

  readonly currentStructure = computed(() => {
    const part = this.selectedPart();
    return this.structures.find((s) => s.id === part) || this.structures[0];
  });

  readonly mappedViewingMode = computed<ViewingMode>(() => {
    const mode = this.activeMode();
    if (mode === 'full') return 'surface';
    if (mode === 'cross-section') return 'cross-section';
    if (mode === 'xray') return 'xray';
    if (mode === 'anatomy') return 'anatomy';
    return 'surface';
  });

  constructor() {
    effect(() => {
      const init = this.initialFdi();
      if (init) {
        this.selectedFdi.set(init);
        this.selectedCategory.set(this.getCategoryForFdi(init));
      }
    });
  }

  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('fullscreenchange', () => {
        this.isFullscreen.set(!!document.fullscreenElement);
      });
    }
  }

  getCategoryForFdi(fdi: number): ToothCategory {
    const found = TOOTH_CATEGORIES.find((c) => c.fdis.includes(fdi));
    return found ? found.id : 'all';
  }

  selectCategory(category: ToothCategory): void {
    this.selectedCategory.set(category);
    if (category === 'all') return;
    const cat = TOOTH_CATEGORIES.find((c) => c.id === category);
    if (cat && cat.fdis.length > 0) {
      if (!cat.fdis.includes(this.selectedFdi())) {
        this.selectedFdi.set(cat.fdis[0]);
      }
    }
  }

  onToothSelected(fdi: number): void {
    this.selectedFdi.set(fdi);
    const cat = this.getCategoryForFdi(fdi);
    if (this.selectedCategory() !== 'all') {
      this.selectedCategory.set(cat);
    }
  }

  navigateToNextTooth(): void {
    const list = this.activeCategoryTeeth();
    if (list.length === 0) return;
    const current = this.selectedFdi();
    const idx = list.findIndex((t) => t.fdi === current);
    const nextIdx = idx >= 0 ? (idx + 1) % list.length : 0;
    this.selectedFdi.set(list[nextIdx].fdi);
  }

  navigateToPrevTooth(): void {
    const list = this.activeCategoryTeeth();
    if (list.length === 0) return;
    const current = this.selectedFdi();
    const idx = list.findIndex((t) => t.fdi === current);
    const prevIdx = idx >= 0 ? (idx - 1 + list.length) % list.length : 0;
    this.selectedFdi.set(list[prevIdx].fdi);
  }

  setMode(mode: ToothViewerMode): void {
    this.activeMode.set(mode);
    if (mode === 'full') {
      this.selectedPart.set('enamel');
      this.focusedStructure.set('enamel');
    } else if (mode === 'cross-section') {
      this.selectedPart.set('dentin');
      this.focusedStructure.set('dentin');
    } else if (mode === 'anatomy') {
      this.selectedPart.set('pulp');
      this.focusedStructure.set('pulp');
    } else if (mode === 'xray') {
      this.focusedStructure.set(undefined);
    }
  }

  selectPart(part: ToothPart): void {
    this.selectedPart.set(part);
    this.focusedStructure.set(part);

    const match = this.structures.find((s) => s.id === part);
    if (match) {
      this.activeMode.set(match.linkedMode);
    }
  }

  exploreNextStructure(): void {
    const currentIndex = this.structures.findIndex((s) => s.id === this.selectedPart());
    const nextIndex = (currentIndex + 1) % this.structures.length;
    this.selectPart(this.structures[nextIndex].id);
  }

  toggleAutoRotate(): void {
    const val = !this.isAutoRotating();
    this.isAutoRotating.set(val);
    const vp = this.viewport();
    if (vp) {
      vp.service.engine.setAutoRotate(val);
    }
  }

  resetCamera(): void {
    this.viewport()?.resetCamera();
  }

  toggleFullscreen(): void {
    if (typeof document === 'undefined') return;
    const el = document.getElementById('tooth-viewer-container');
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

  toggleSelectorExpanded(): void {
    this.isSelectorExpanded.update((v) => !v);
  }

  setQuadrantTab(tab: number | 'all'): void {
    this.selectedQuadrantTab.set(tab);
  }
}
