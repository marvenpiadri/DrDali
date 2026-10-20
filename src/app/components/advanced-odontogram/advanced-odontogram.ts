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

  readonly getToothSilhouette = (type: OdontogramToothState['type']): string => {
    switch (type) {
      case 'incisor':
        return 'M 13 3 C 8 3 5 7 5 13 L 6 27 C 6 33 11 37 20 37 C 29 37 34 33 34 27 L 35 13 C 35 7 31 3 27 3 C 24 3 23 6 20 6 C 17 6 16 3 13 3 Z';
      case 'canine':
        return 'M 14 2 C 9 4 6 9 6 15 C 6 24 11 31 18 38 C 19 39 21 39 22 38 C 29 31 34 24 34 15 C 34 9 31 4 26 2 C 23 1 22 5 20 7 C 18 5 17 1 14 2 Z';
      case 'premolar':
        return 'M 13 3 C 8 3 4 8 5 14 L 7 27 C 8 33 12 37 20 37 C 28 37 32 33 33 27 L 35 14 C 36 8 32 3 27 3 C 24 3 23 7 20 7 C 17 7 16 3 13 3 Z';
      case 'molar':
      default:
        return 'M 12 3 C 8 2 4 6 4 12 L 3 23 C 3 29 7 34 12 36 C 15 37 17 34 20 34 C 23 34 25 37 28 36 C 33 34 37 29 37 23 L 36 12 C 36 6 32 2 28 3 C 25 3 23 7 20 7 C 17 7 15 3 12 3 Z';
    }
  };

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

  onSurfaceClick(event: MouseEvent | KeyboardEvent, fdi: number, surface: ToothSurface): void {
    event.preventDefault();
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

  getToothSilhouette(type: OdontogramToothState['type']): string {
    switch (type) {
      case 'incisor':
        return 'M11 4 C7 5 5 10 6 16 L8 29 C9 34 12 37 20 37 C28 37 31 34 32 29 L34 16 C35 10 33 5 29 4 C25 3 23 6 20 6 C17 6 15 3 11 4 Z';
      case 'canine':
        return 'M12 4 C7 6 6 12 8 19 L12 31 C14 36 17 38 20 38 C23 38 26 36 28 31 L32 19 C34 12 33 6 28 4 C24 3 23 8 20 8 C17 8 16 3 12 4 Z';
      case 'premolar':
        return 'M10 5 C5 8 5 14 7 20 L10 30 C12 35 16 37 20 37 C24 37 28 35 30 30 L33 20 C35 14 35 8 30 5 C26 3 24 7 20 7 C16 7 14 3 10 5 Z';
      case 'molar':
      default:
        return 'M9 5 C5 6 4 11 5 16 L8 29 C9 34 12 36 16 35 C18 35 19 33 20 33 C21 33 22 35 24 35 C28 36 31 34 32 29 L35 16 C36 11 35 6 31 5 C27 4 24 7 22 8 C21 8 21 5 20 5 C19 5 19 8 18 8 C16 7 13 4 9 5 Z';
    }
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
      case 'caries': return 'odg-condition-badge--caries';
      case 'composite': return 'odg-condition-badge--composite';
      case 'crown': return 'odg-condition-badge--crown';
      case 'implant': return 'odg-condition-badge--implant';
      case 'endo': return 'odg-condition-badge--endo';
      case 'veneer': return 'odg-condition-badge--veneer';
      case 'missing': return 'odg-condition-badge--missing';
      case 'healthy':
      default:
        return 'odg-condition-badge--healthy';
    }
  }
}
