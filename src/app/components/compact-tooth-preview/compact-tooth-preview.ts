import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Dental3DViewportComponent } from '../dental-3d-viewport/dental-3d-viewport';
import { Dental3DDataService } from '../../services/dental-3d-data.service';
import { ToothArchItem, ViewingMode } from '../../models/dental-3d.model';
import { TranslationService } from '../../services/translation.service';

export interface ToothTypePreset {
  id: 'incisor' | 'canine' | 'premolar' | 'molar';
  fdi: number;
  labelKey: string;
}

@Component({
  selector: 'app-compact-tooth-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatIconModule, Dental3DViewportComponent],
  templateUrl: './compact-tooth-preview.html',
  styleUrl: './compact-tooth-preview.css',
})
export class CompactToothPreviewComponent {
  private dataService = inject(Dental3DDataService);
  readonly i18n = inject(TranslationService);

  // Inputs
  readonly fdi = input<number>(46);
  readonly title = input<string>('Aperçu 3D Haute Résolution');
  readonly ctaText = input<string>('Explorer l\'Atlas Dentaire 3D');
  readonly ctaLink = input<string[]>([ '/atlas', 'tooth-explorer' ]);
  readonly showDetailsCta = input<boolean>(true);
  readonly badgeLabel = input<string>('Micro-CT 3D');

  readonly viewport = viewChild<Dental3DViewportComponent>('viewport');

  // State
  readonly currentFdi = signal<number>(46);
  readonly activeMode = signal<ViewingMode>('surface');
  readonly isAutoRotating = signal(false);

  // Tooth Types Presets
  readonly toothTypePresets: ToothTypePreset[] = [
    { id: 'incisor', fdi: 11, labelKey: 'toothCategoryIncisors' },
    { id: 'canine', fdi: 13, labelKey: 'toothCategoryCanines' },
    { id: 'premolar', fdi: 14, labelKey: 'toothCategoryPremolars' },
    { id: 'molar', fdi: 46, labelKey: 'toothCategoryMolars' },
  ];

  // View Mode Presets
  readonly viewModes: { id: ViewingMode; label: string }[] = [
    { id: 'surface', label: 'full' },
    { id: 'cross-section', label: 'cross' },
    { id: 'xray', label: 'x-ray' },
    { id: 'anatomy', label: 'pulp' },
  ];

  constructor() {
    // Sync initial fdi input
    const initialFdi = this.fdi();
    if (initialFdi) {
      this.currentFdi.set(initialFdi);
    }
  }

  readonly toothInfo = computed<ToothArchItem | undefined>(() => {
    const fdiNumber = this.currentFdi();
    return this.dataService.dentalArchTeeth.find((t) => t.fdi === fdiNumber);
  });

  readonly localizedToothName = computed<string>(() => {
    const item = this.toothInfo();
    if (!item) return `Dent #${this.currentFdi()}`;
    const lang = this.i18n.currentLang();
    if (lang === 'ar') return item.nameAr || item.nameFr;
    if (lang === 'en') {
      const typeStr = item.type.charAt(0).toUpperCase() + item.type.slice(1);
      const archStr = item.arch === 'maxillary' ? 'Maxillary' : 'Mandibular';
      return `${archStr} ${typeStr} #${item.fdi}`;
    }
    return item.nameFr;
  });

  readonly localizedArchName = computed<string>(() => {
    const item = this.toothInfo();
    if (!item) return '';
    if (item.arch === 'maxillary') {
      return this.i18n.translate('upperArch');
    }
    return this.i18n.translate('lowerArch');
  });

  selectTooth(fdi: number): void {
    this.currentFdi.set(fdi);
  }

  setViewMode(mode: ViewingMode): void {
    this.activeMode.set(mode);
  }

  toggleAutoRotate(): void {
    const vp = this.viewport();
    if (vp) {
      vp.toggleAutoRotate();
      this.isAutoRotating.set(vp.isAutoRotating());
    }
  }

  resetCamera(): void {
    const vp = this.viewport();
    if (vp) {
      vp.resetCamera();
    }
  }
}
