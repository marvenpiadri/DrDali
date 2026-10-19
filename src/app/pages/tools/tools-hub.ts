import {ChangeDetectionStrategy, Component, signal, computed, inject, OnDestroy} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ToolsService} from '../../services/tools.service';
import {ToothData, SymptomAssessmentResult} from '../../models/tools.model';
import {DisclaimerComponent} from '../../components/disclaimer/disclaimer';
import {ClinicService} from '../../services/clinic.service';
import {TranslationService} from '../../services/translation.service';
import {AdvancedOdontogramComponent, ToothSurface, ToothCondition} from '../../components/advanced-odontogram/advanced-odontogram';
import {CompactToothPreviewComponent} from '../../components/compact-tooth-preview/compact-tooth-preview';
import {WhatsAppIconComponent} from '../../components/whatsapp-icon/whatsapp-icon';
import {TranslatePipe} from '../../pipes/translate.pipe';

@Component({
  selector: 'app-tools-hub',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    DisclaimerComponent,
    AdvancedOdontogramComponent,
    CompactToothPreviewComponent,
    WhatsAppIconComponent,
    TranslatePipe,
  ],
  templateUrl: './tools-hub.html',
  styleUrl: './tools-hub.css',
})
export class ToolsHubComponent implements OnDestroy {
  toolsService = inject(ToolsService);
  clinic = inject(ClinicService);
  i18n = inject(TranslationService);

  toolTabs = computed(() => [
    { id: 'tooth-explorer', label: this.i18n.translate('toolOdontogramTab'), icon: 'format_list_numbered' },
    { id: 'symptom-explorer', label: this.i18n.translate('toolSymptomTab'), icon: 'health_and_safety' },
    { id: 'emergency-guide', label: this.i18n.translate('toolEmergencyTab'), icon: 'emergency' },
    { id: 'brushing-timer', label: this.i18n.translate('toolTimerTab'), icon: 'timer' },
    { id: 'eruption-timeline', label: this.i18n.translate('toolTimelineTab'), icon: 'timeline' },
    { id: 'number-converter', label: this.i18n.translate('toolConverterTab'), icon: 'swap_horiz' },
  ]);

  activeTab = signal<string>('tooth-explorer');

  // Tooth Explorer State - default to first molar 46
  selectedTooth = signal<ToothData>(
    this.toolsService.allTeeth.find((t) => t.fdiNumber === 46) || this.toolsService.allTeeth[0]
  );
  selectedFdiNumber = computed(() => this.selectedTooth().fdiNumber);
  selectedSurfaceInfo = signal<{ surface: string; label: string; condition: string } | null>(null);

  private surfaceNames: Record<string, string> = {
    occlusal: 'Face Occlusale (Mastication / Sillons)',
    vestibular: 'Face Vestibulaire (Côté externe / Joue ou Lèvre)',
    lingual: 'Face Linguale / Palatine (Côté interne / Langue ou Palais)',
    mesial: 'Face Mésiale (Côté proximal orienté vers le centre)',
    distal: 'Face Distale (Côté proximal orienté vers l\'arrière)',
  };

  onOdontogramToothSelected(fdi: number) {
    const found = this.toolsService.allTeeth.find((t) => t.fdiNumber === fdi);
    if (found) {
      this.selectedTooth.set(found);
      this.selectedSurfaceInfo.set(null);
    }
  }

  onOdontogramSurfaceClicked(event: { fdi: number; surface: ToothSurface; condition: ToothCondition }) {
    const found = this.toolsService.allTeeth.find((t) => t.fdiNumber === event.fdi);
    if (found) {
      this.selectedTooth.set(found);
    }
    this.selectedSurfaceInfo.set({
      surface: event.surface,
      label: this.surfaceNames[event.surface] || event.surface,
      condition: event.condition,
    });
  }

  upperRightTeeth = this.toolsService.allTeeth.filter((t) => t.quadrant === 1);
  upperLeftTeeth = this.toolsService.allTeeth.filter((t) => t.quadrant === 2);
  lowerLeftTeeth = this.toolsService.allTeeth.filter((t) => t.quadrant === 3);
  lowerRightTeeth = this.toolsService.allTeeth.filter((t) => t.quadrant === 4);

  // Symptom Explorer State
  selectedSymptoms = signal<string[]>(['sym-hot-cold']);

  toggleSymptom(id: string) {
    this.selectedSymptoms.update((current) => {
      if (current.includes(id)) {
        return current.filter((s) => s !== id);
      } else {
        return [...current, id];
      }
    });
  }

  isSymptomSelected(id: string): boolean {
    return this.selectedSymptoms().includes(id);
  }

  symptomAssessment = computed<SymptomAssessmentResult>(() => {
    return this.toolsService.evaluateSymptoms(this.selectedSymptoms());
  });

  // Brushing Timer State (120 seconds total, 4 quadrants of 30 seconds each)
  timerSecondsRemaining = signal<number>(120);
  isTimerRunning = signal<boolean>(false);
  private timerIntervalId: ReturnType<typeof setInterval> | null = null;

  currentQuadrantIndex = computed<number>(() => {
    const elapsed = 120 - this.timerSecondsRemaining();
    if (elapsed >= 120) return 3;
    return Math.floor(elapsed / 30);
  });

  currentQuadrantName = computed<string>(() => {
    const names = [
      'Cadran 1 : Dents Supérieures Droites',
      'Cadran 2 : Dents Supérieures Gauches',
      'Cadran 3 : Dents Inférieures Gauches',
      'Cadran 4 : Dents Inférieures Droites',
    ];
    return names[this.currentQuadrantIndex()] || names[0];
  });

  startTimer() {
    if (this.timerIntervalId) return;
    this.isTimerRunning.set(true);
    this.timerIntervalId = setInterval(() => {
      this.timerSecondsRemaining.update((v) => {
        if (v <= 1) {
          this.pauseTimer();
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  }

  pauseTimer() {
    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
      this.timerIntervalId = null;
    }
    this.isTimerRunning.set(false);
  }

  resetTimer() {
    this.pauseTimer();
    this.timerSecondsRemaining.set(120);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Tooth Eruption Stage State
  selectedStageIndex = signal<number>(4); // Default to age 6-7 transition
  currentStage = computed(() => {
    return this.toolsService.eruptionStages[this.selectedStageIndex()] || this.toolsService.eruptionStages[0];
  });

  onStageChange(event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    this.selectedStageIndex.set(val);
  }

  // Number Converter State
  converterFdi = signal<number>(36);
  convertedToothData = computed(() => {
    return this.toolsService.convertNotation(this.converterFdi());
  });

  onConverterChange(event: Event) {
    const val = Number((event.target as HTMLSelectElement).value);
    this.converterFdi.set(val);
  }

  ngOnDestroy() {
    this.pauseTimer();
  }
}
