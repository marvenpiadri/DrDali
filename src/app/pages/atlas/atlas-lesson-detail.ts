import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AtlasLessonService} from '../../services/atlas-lesson.service';
import {Dental3DDataService} from '../../services/dental-3d-data.service';
import {AtlasLesson, AtlasLessonStage, CameraAngle} from '../../models/atlas.model';
import {
  ViewingMode,
  ToothNumberingSystem,
  ToothArchItem,
  Dental3DStructure,
} from '../../models/dental-3d.model';
import {Dental3DViewportComponent} from '../../components/dental-3d-viewport/dental-3d-viewport';
import {FullMouthExplorerComponent} from '../../components/full-mouth-explorer/full-mouth-explorer';
import {TranslationService} from '../../services/translation.service';
import {Dental3DService} from '../../services/dental-3d.service';
import {Jawline3dViewerComponent} from '../../components/jawline-3d-viewer/jawline-3d-viewer';
import {TranslatePipe} from '../../pipes/translate.pipe';
import {WhatsAppIconComponent} from '../../components/whatsapp-icon/whatsapp-icon';

@Component({
  selector: 'app-atlas-lesson-detail',
  imports: [RouterLink, Dental3DViewportComponent, FullMouthExplorerComponent, Jawline3dViewerComponent, TranslatePipe, WhatsAppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './atlas-lesson-detail.html',
  styleUrl: './atlas-lesson-detail.css',
})
export class AtlasLessonDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly atlasService = inject(AtlasLessonService);
  readonly d3Data = inject(Dental3DDataService);
  readonly d3Service = inject(Dental3DService);
  readonly i18n = inject(TranslationService);

  // Active Lesson
  readonly lesson = signal<AtlasLesson | undefined>(undefined);

  // Modes & Stepper State
  readonly activeLearningMode = signal<'guided' | 'explore'>('guided');
  readonly currentStageIndex = signal<number>(0);
  readonly activeViewingMode = signal<ViewingMode>('surface');
  readonly currentCameraAngle = signal<CameraAngle>('perspective');

  // Interactive Selection
  readonly selectedToothFdi = signal<number>(16);
  readonly selectedStructureId = signal<string>('enamel');
  readonly numberingSystem = signal<ToothNumberingSystem>('fdi');

  // Flagship Custom Experience Modes
  readonly boneArchMode = signal<'cortical' | 'trabecular' | 'combined' | 'xray'>('combined');
  readonly supportingMode = signal<'full' | 'pdl' | 'bone' | 'relationship'>('pdl');
  readonly pediatricMode = signal<'complete' | 'open-apex' | 'maintainer'>('complete');
  readonly relationshipFocus = signal<'nerve' | 'sinus' | 'all'>('nerve');

  // Layers Visibility State
  readonly layerVisibility = signal({
    bone: true,
    teeth: true,
    pulp: true,
    canal: true,
    pdl: true,
    sinus: true,
  });

  // Quiz State
  readonly quizAnswers = signal<Record<string, string>>({});
  readonly quizSubmitted = signal<boolean>(false);
  readonly isQuizDrawerOpen = signal<boolean>(false);

  // Lesson Completion
  readonly isCompleted = signal<boolean>(false);

  // Computed Properties
  readonly currentStage = computed<AtlasLessonStage | undefined>(() => {
    const l = this.lesson();
    if (!l || !l.stages || l.stages.length === 0) return undefined;
    return l.stages[this.currentStageIndex()] || l.stages[0];
  });

  readonly selectedTooth = computed<ToothArchItem | undefined>(() => {
    return this.d3Data.getToothByFdi(this.selectedToothFdi());
  });

  readonly selectedStructure = computed<Dental3DStructure | undefined>(() => {
    const l = this.lesson();
    if (!l) return undefined;
    if (l.structures && l.structures.length > 0) {
      return l.structures.find((s) => s.id === this.selectedStructureId()) || l.structures[0];
    }
    // Fallback to global data structures
    return this.d3Data.toothStructures.find((s) => s.id === this.selectedStructureId()) || this.d3Data.toothStructures[0];
  });

  readonly relatedLessons = computed<AtlasLesson[]>(() => {
    const l = this.lesson();
    if (!l) return [];
    return this.atlasService.getRelatedLessons(l.id);
  });

  readonly nextLesson = computed<AtlasLesson | undefined>(() => {
    const l = this.lesson();
    if (!l) return undefined;
    return this.atlasService.getNextLesson(l.id);
  });

  readonly quizScore = computed<{ correct: number; total: number }>(() => {
    const l = this.lesson();
    if (!l || !l.quizQuestions) return { correct: 0, total: 0 };
    const answers = this.quizAnswers();
    let correct = 0;
    l.quizQuestions.forEach((q) => {
      const selectedId = answers[q.id];
      const opt = q.options.find((o) => o.id === selectedId);
      if (opt && opt.isCorrect) correct++;
    });
    return { correct, total: l.quizQuestions.length };
  });

  readonly upperTeeth = this.d3Data.dentalArchTeeth.filter((t: ToothArchItem) => t.arch === 'maxillary');
  readonly lowerTeeth = this.d3Data.dentalArchTeeth.filter((t: ToothArchItem) => t.arch === 'mandibular');

  readonly whatsappUrl = computed(() => {
    const l = this.lesson();
    const title = l ? l.title : 'Atlas 3D';
    const text = encodeURIComponent(
      `Bonjour Centre Dentaire Dali, j'ai consulté la leçon 3D "${title}" sur votre Atlas et je souhaite prendre rendez-vous pour un bilan dentaire.`
    );
    return `https://wa.me/212661000000?text=${text}`;
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const lessonId = params.get('lessonId') || 'inside-a-tooth';
      const found = this.atlasService.getLessonById(lessonId);
      if (found) {
        this.lesson.set(found);
        this.currentStageIndex.set(0);
        this.activeViewingMode.set(found.defaultMode);
        this.currentCameraAngle.set(found.defaultCameraAngle);
        this.isCompleted.set(false);
        this.quizAnswers.set({});
        this.quizSubmitted.set(false);

        // Check query params for mode
        const mode = this.route.snapshot.queryParamMap.get('mode');
        if (mode === 'explore') {
          this.activeLearningMode.set('explore');
        } else {
          this.activeLearningMode.set('guided');
        }
      } else {
        // Fallback to first flagship lesson
        this.router.navigate(['/atlas/inside-a-tooth']);
      }
    });
  }

  setLearningMode(mode: 'guided' | 'explore'): void {
    this.activeLearningMode.set(mode);
  }

  onOpenToothExplorer(fdi: number): void {
    this.selectedToothFdi.set(fdi);
    this.router.navigate(['/atlas/inside-a-tooth'], { queryParams: { tooth: fdi } });
  }

  setStage(index: number): void {
    const l = this.lesson();
    if (!l) return;
    if (index >= 0 && index < l.stages.length) {
      this.currentStageIndex.set(index);
      const stage = l.stages[index];
      
      // Auto-apply stage presets if present
      if (stage.viewMode) {
        this.activeViewingMode.set(stage.viewMode);
        this.d3Service.setMode(stage.viewMode);
      }
      if (stage.cameraPreset && ['front', 'back', 'side', 'occlusal'].includes(stage.cameraPreset)) {
        this.setCameraAngle(stage.cameraPreset as 'front' | 'back' | 'side' | 'occlusal');
      }
      if (stage.highlightStructureId) {
        this.selectedStructureId.set(stage.highlightStructureId);
      }

      // Check if last stage reached
      if (index === l.stages.length - 1) {
        this.isCompleted.set(true);
      }
    }
  }

  nextStage(): void {
    this.setStage(this.currentStageIndex() + 1);
  }

  prevStage(): void {
    this.setStage(this.currentStageIndex() - 1);
  }

  setViewingMode(mode: ViewingMode): void {
    this.activeViewingMode.set(mode);
    this.d3Service.setMode(mode);
  }

  setCameraAngle(angle: 'front' | 'back' | 'side' | 'occlusal'): void {
    this.currentCameraAngle.set(angle);
    this.d3Service.setCameraAngle(angle);
  }

  selectTooth(fdi: number): void {
    this.selectedToothFdi.set(fdi);
    this.d3Service.selectTooth(fdi);
  }

  selectStructure(id: string): void {
    this.selectedStructureId.set(id);
  }

  setNumberingSystem(sys: ToothNumberingSystem): void {
    this.numberingSystem.set(sys);
    this.d3Service.setNumberingSystem(sys);
  }

  toggleLayer(layerKey: 'bone' | 'teeth' | 'pulp' | 'canal' | 'pdl' | 'sinus'): void {
    const current = this.layerVisibility();
    const updated = !current[layerKey];
    this.layerVisibility.set({
      ...current,
      [layerKey]: updated,
    });
    this.d3Service.toggleLayerVisibility(layerKey, updated);
  }

  setBoneArchitectureMode(mode: 'cortical' | 'trabecular' | 'combined' | 'xray'): void {
    this.boneArchMode.set(mode);
    this.d3Service.setBoneArchitectureMode(mode);
  }

  setSupportingStructuresMode(mode: 'full' | 'pdl' | 'bone' | 'relationship'): void {
    this.supportingMode.set(mode);
    this.d3Service.setSupportingStructuresMode(mode);
  }

  setPediatricMode(mode: 'complete' | 'open-apex' | 'maintainer'): void {
    this.pediatricMode.set(mode);
    this.d3Service.setPediatricMode(mode);
  }

  setAnatomicalRelationshipMode(focus: 'nerve' | 'sinus' | 'all'): void {
    this.relationshipFocus.set(focus);
    this.d3Service.setAnatomicalRelationshipMode(focus);
  }

  // Quiz Handling
  selectQuizOption(questionId: string, optionId: string): void {
    if (this.quizSubmitted()) return;
    this.quizAnswers.update((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  }

  submitQuiz(): void {
    this.quizSubmitted.set(true);
  }

  resetQuiz(): void {
    this.quizAnswers.set({});
    this.quizSubmitted.set(false);
  }

  toggleQuizDrawer(): void {
    this.isQuizDrawerOpen.update((v) => !v);
  }
}
