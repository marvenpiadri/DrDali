import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import {UpperCasePipe} from '@angular/common';
import {TranslatePipe} from '../../pipes/translate.pipe';

export type ToothSurface = 'occlusal' | 'mesial' | 'distal' | 'vestibular' | 'lingual' | 'root' | 'crown';
export type ToothCondition = 'healthy' | 'caries' | 'composite' | 'crown' | 'implant' | 'endo' | 'missing' | 'veneer';
export type NumberingSystem = 'fdi' | 'universal' | 'palmer';

export interface ToothSurfaceState {
  surface: ToothSurface;
  condition: ToothCondition;
}

export interface OdontogramToothState {
  fdi: number;
  universal: number;
  palmer: string;
  nameFr: string;
  nameAr: string;
  quadrant: 1 | 2 | 3 | 4;
  type: 'incisor' | 'canine' | 'premolar' | 'molar';
  overallCondition: ToothCondition;
  surfaces: Record<ToothSurface, ToothCondition>;
  notes?: string;
}

@Component({
  selector: 'app-advanced-odontogram',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UpperCasePipe, TranslatePipe],
  templateUrl: './advanced-odontogram.html',
  styleUrl: './advanced-odontogram.css',
})
export class AdvancedOdontogramComponent {
  // Inputs
  readonly selectedFdi = input<number | null>(46);
  readonly readOnly = input<boolean>(false);
  readonly showSurfaces = input<boolean>(true);
  readonly compact = input<boolean>(false);

  // Outputs
  readonly toothSelected = output<number>();
  readonly surfaceClicked = output<{fdi: number; surface: ToothSurface; condition: ToothCondition}>();
  readonly conditionChanged = output<{fdi: number; condition: ToothCondition}>();

  // Settings State
  readonly numberingSystem = signal<NumberingSystem>('fdi');
  readonly selectedActiveCondition = signal<ToothCondition>('caries');
  readonly activeQuadrantFilter = signal<'all' | 1 | 2 | 3 | 4>('all');
  readonly hoverTooth = signal<OdontogramToothState | null>(null);

  // Available condition tools for clinical marking
  readonly conditionTools: {id: ToothCondition; label: string; color: string; bgClass: string; icon: string}[] = [
    { id: 'healthy', label: 'Sain (Intact)', color: '#10b981', bgClass: 'bg-emerald-500', icon: 'check_circle' },
    { id: 'caries', label: 'Carie / Lésion', color: '#ef4444', bgClass: 'bg-red-500', icon: 'coronavirus' },
    { id: 'composite', label: 'Obturation Composite', color: '#3b82f6', bgClass: 'bg-blue-500', icon: 'format_paint' },
    { id: 'crown', label: 'Couronne Céramique', color: '#f59e0b', bgClass: 'bg-amber-500', icon: 'stars' },
    { id: 'implant', label: 'Implant Titane', color: '#14b8a6', bgClass: 'bg-teal-500', icon: 'hardware' },
    { id: 'endo', label: 'Traitement Endodontique', color: '#8b5cf6', bgClass: 'bg-purple-500', icon: 'colorize' },
    { id: 'veneer', label: 'Facette Esthétique', color: '#ec4899', bgClass: 'bg-pink-500', icon: 'auto_awesome' },
    { id: 'missing', label: 'Dent Absente / Extraite', color: '#6b7280', bgClass: 'bg-neutral-500', icon: 'cancel' },
  ];

  // 32 Permanent Teeth Initial State
  readonly teethState = signal<Record<number, OdontogramToothState>>(this.initialize32Teeth());

  // Quadrants breakdown
  readonly upperRightTeeth = computed(() => [18, 17, 16, 15, 14, 13, 12, 11].map(fdi => this.teethState()[fdi]));
  readonly upperLeftTeeth = computed(() => [21, 22, 23, 24, 25, 26, 27, 28].map(fdi => this.teethState()[fdi]));
  readonly lowerRightTeeth = computed(() => [48, 47, 46, 45, 44, 43, 42, 41].map(fdi => this.teethState()[fdi]));
  readonly lowerLeftTeeth = computed(() => [31, 32, 33, 34, 35, 36, 37, 38].map(fdi => this.teethState()[fdi]));

  // Selected tooth data
  readonly currentSelectedTooth = computed(() => {
    const fdi = this.selectedFdi();
    if (!fdi) return null;
    return this.teethState()[fdi] || null;
  });

  // Clinical Summary Statistics (DMF Index: Decayed, Missing, Filled)
  readonly statistics = computed(() => {
    const all = Object.values(this.teethState());
    let decayed = 0;
    let filled = 0;
    let missing = 0;
    let crowns = 0;
    let implants = 0;
    let endo = 0;
    let healthy = 0;

    for (const t of all) {
      if (t.overallCondition === 'caries') decayed++;
      else if (t.overallCondition === 'composite') filled++;
      else if (t.overallCondition === 'missing') missing++;
      else if (t.overallCondition === 'crown') crowns++;
      else if (t.overallCondition === 'implant') implants++;
      else if (t.overallCondition === 'endo') endo++;
      else healthy++;
    }

    return {
      decayed,
      filled,
      missing,
      crowns,
      implants,
      endo,
      healthy,
      dmfTotal: decayed + missing + filled,
      total: 32,
    };
  });

  private initialize32Teeth(): Record<number, OdontogramToothState> {
    const state: Record<number, OdontogramToothState> = {};
    const fdiList = [
      18, 17, 16, 15, 14, 13, 12, 11,
      21, 22, 23, 24, 25, 26, 27, 28,
      31, 32, 33, 34, 35, 36, 37, 38,
      41, 42, 43, 44, 45, 46, 47, 48,
    ];

    const fdiToUniversal: Record<number, number> = {
      18: 1, 17: 2, 16: 3, 15: 4, 14: 5, 13: 6, 12: 7, 11: 8,
      21: 9, 22: 10, 23: 11, 24: 12, 25: 13, 26: 14, 27: 15, 28: 16,
      38: 17, 37: 18, 36: 19, 35: 20, 34: 21, 33: 22, 32: 23, 31: 24,
      41: 25, 42: 26, 43: 27, 44: 28, 45: 29, 46: 30, 47: 31, 48: 32,
    };

    for (const fdi of fdiList) {
      const q = Math.floor(fdi / 10) as 1 | 2 | 3 | 4;
      const num = fdi % 10;
      let type: 'incisor' | 'canine' | 'premolar' | 'molar' = 'incisor';
      if (num === 1 || num === 2) type = 'incisor';
      else if (num === 3) type = 'canine';
      else if (num === 4 || num === 5) type = 'premolar';
      else type = 'molar';

      const palmer = `${num}`;
      const nameFr = this.getToothNameFr(fdi);
      const nameAr = this.getToothNameAr(fdi);

      // Default conditions: healthy, with preset clinical examples for demo
      let overallCondition: ToothCondition = 'healthy';
      if (fdi === 16) overallCondition = 'composite';
      if (fdi === 36) overallCondition = 'endo';
      if (fdi === 46) overallCondition = 'caries';
      if (fdi === 14) overallCondition = 'crown';
      if (fdi === 26) overallCondition = 'missing';

      const isCaries = overallCondition === 'caries';
      const isComp = overallCondition === 'composite';
      const isCrown = overallCondition === 'crown';
      const isEndo = overallCondition === 'endo';

      state[fdi] = {
        fdi,
        universal: fdiToUniversal[fdi] || 1,
        palmer,
        nameFr,
        nameAr,
        quadrant: q,
        type,
        overallCondition,
        surfaces: {
          occlusal: isCaries ? 'caries' : isComp ? 'composite' : 'healthy',
          mesial: 'healthy',
          distal: 'healthy',
          vestibular: isCrown ? 'crown' : 'healthy',
          lingual: 'healthy',
          root: isEndo ? 'endo' : 'healthy',
          crown: isCrown ? 'crown' : 'healthy',
        },
      };
    }

    return state;
  }

  getToothNameFr(fdi: number): string {
    const q = Math.floor(fdi / 10);
    const num = fdi % 10;
    const arch = q <= 2 ? 'supérieure' : 'inférieure';
    const side = (q === 1 || q === 4) ? 'droite' : 'gauche';
    
    let toothType = '';
    switch (num) {
      case 1: toothType = 'Incisive centrale'; break;
      case 2: toothType = 'Incisive latérale'; break;
      case 3: toothType = 'Canine'; break;
      case 4: toothType = 'Première prémolaire'; break;
      case 5: toothType = 'Deuxième prémolaire'; break;
      case 6: toothType = 'Première molaire'; break;
      case 7: toothType = 'Deuxième molaire'; break;
      case 8: toothType = 'Troisième molaire (sagesse)'; break;
    }
    return `${toothType} ${arch} ${side}`;
  }

  getToothNameAr(fdi: number): string {
    const num = fdi % 10;
    switch (num) {
      case 1: return 'الثنية';
      case 2: return 'الرباعية';
      case 3: return 'الناب';
      case 4: return 'الضاحك الأول';
      case 5: return 'الضاحك الثاني';
      case 6: return 'الضرس الأول';
      case 7: return 'الضرس الثاني';
      case 8: return 'ضرس العقل';
      default: return 'سن';
    }
  }

  getToothNumber(tooth: OdontogramToothState): string | number {
    switch (this.numberingSystem()) {
      case 'universal':
        return tooth.universal;
      case 'palmer':
        return tooth.palmer;
      case 'fdi':
      default:
        return tooth.fdi;
    }
  }

  selectTooth(fdi: number): void {
    this.toothSelected.emit(fdi);
  }

  onSurfaceClick(event: MouseEvent, fdi: number, surface: ToothSurface): void {
    event.stopPropagation();
    if (this.readOnly()) return;

    const condition = this.selectedActiveCondition();
    this.teethState.update((current) => {
      const tooth = current[fdi];
      if (!tooth) return current;

      const newSurfaces = { ...tooth.surfaces, [surface]: condition };
      // If marking tooth-wide conditions
      let newOverall = tooth.overallCondition;
      if (condition === 'missing' || condition === 'implant' || condition === 'crown' || condition === 'endo') {
        newOverall = condition;
      } else if (condition === 'caries') {
        newOverall = 'caries';
      } else if (condition === 'healthy') {
        newOverall = 'healthy';
      }

      return {
        ...current,
        [fdi]: {
          ...tooth,
          overallCondition: newOverall,
          surfaces: newSurfaces,
        },
      };
    });

    this.surfaceClicked.emit({ fdi, surface, condition });
    this.toothSelected.emit(fdi);
  }

  applyConditionToWholeTooth(fdi: number, condition: ToothCondition): void {
    if (this.readOnly()) return;

    this.teethState.update((current) => {
      const tooth = current[fdi];
      if (!tooth) return current;

      const newSurfaces: Record<ToothSurface, ToothCondition> = {
        occlusal: condition,
        mesial: condition,
        distal: condition,
        vestibular: condition,
        lingual: condition,
        root: condition,
        crown: condition,
      };

      return {
        ...current,
        [fdi]: {
          ...tooth,
          overallCondition: condition,
          surfaces: newSurfaces,
        },
      };
    });

    this.conditionChanged.emit({ fdi, condition });
  }

  resetAllToHealthy(): void {
    this.teethState.update((current) => {
      const updated: Record<number, OdontogramToothState> = {};
      for (const [key, tooth] of Object.entries(current)) {
        const fdi = Number(key);
        updated[fdi] = {
          ...tooth,
          overallCondition: 'healthy',
          surfaces: {
            occlusal: 'healthy',
            mesial: 'healthy',
            distal: 'healthy',
            vestibular: 'healthy',
            lingual: 'healthy',
            root: 'healthy',
            crown: 'healthy',
          },
        };
      }
      return updated;
    });
  }

  getSurfaceColor(condition: ToothCondition): string {
    switch (condition) {
      case 'caries': return '#ef4444'; // Red
      case 'composite': return '#3b82f6'; // Blue
      case 'crown': return '#f59e0b'; // Amber/Gold
      case 'implant': return '#14b8a6'; // Teal
      case 'endo': return '#8b5cf6'; // Purple
      case 'veneer': return '#ec4899'; // Pink
      case 'missing': return '#6b7280'; // Gray
      case 'healthy':
      default:
        return '#f8fafc'; // Natural tooth ivory/white
    }
  }

  getConditionBadgeClass(condition: ToothCondition): string {
    switch (condition) {
      case 'caries': return 'bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-400 border-red-200 dark:border-red-900';
      case 'composite': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-400 border-blue-200 dark:border-blue-900';
      case 'crown': return 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400 border-amber-200 dark:border-amber-900';
      case 'implant': return 'bg-teal-100 text-teal-700 dark:bg-teal-950/80 dark:text-teal-400 border-teal-200 dark:border-teal-900';
      case 'endo': return 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-400 border-purple-200 dark:border-purple-900';
      case 'veneer': return 'bg-pink-100 text-pink-700 dark:bg-pink-950/80 dark:text-pink-400 border-pink-200 dark:border-pink-900';
      case 'missing': return 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700';
      case 'healthy':
      default:
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900';
    }
  }
}
