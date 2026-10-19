import {Dental3DModelType, ViewingMode, Dental3DStructure} from './dental-3d.model';

export type AtlasCategory = 
  | 'tooth-anatomy' 
  | 'dentition' 
  | 'conditions' 
  | 'treatments' 
  | 'anatomy';

export type LessonDifficulty = 'Débutant' | 'Intermédiaire' | 'Avancé';
export type CameraAngle = 'front' | 'back' | 'side' | 'occlusal' | 'perspective' | 'zoom-crown' | 'zoom-apex' | 'cross-section' | 'anatomy';

export interface AtlasQuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface AtlasQuizQuestion {
  id: string;
  question: string;
  options: AtlasQuizOption[];
  clinicalTip?: string;
}

export interface AtlasLessonStage {
  id: string;
  stageNumber: number;
  title: string;
  titleAr?: string;
  subtitle: string;
  explanation: string;
  whatIsHappening: string;
  whyItMatters: string;
  patientSensation?: string;
  highlightStructureId?: string;
  cameraPreset?: CameraAngle;
  viewMode?: ViewingMode;
  layerVisibility?: {
    bone?: boolean;
    teeth?: boolean;
    pulp?: boolean;
    canal?: boolean;
    pdl?: boolean;
    sinus?: boolean;
  };
  annotationBadge?: {
    label: string;
    text: string;
  };
}

export interface AtlasDidYouKnowFact {
  title: string;
  text: string;
  icon?: string;
}

export interface AtlasLesson {
  id: string;
  slug: string;
  title: string;
  titleAr?: string;
  subtitle: string;
  category: AtlasCategory;
  categoryLabel: string;
  badge: string;
  icon: string;
  durationMinutes: number;
  difficulty: LessonDifficulty;
  modelType: Dental3DModelType;
  modelSource: 'toothfairy' | 'diaz' | 'openfulljaw' | 'fang' | 'procedural-molar';
  defaultCameraAngle: CameraAngle;
  defaultMode: ViewingMode;
  availableModes: ViewingMode[];
  
  // Interactive features enabled
  hasOdontogramSync?: boolean;
  hasDissectionStages?: boolean;
  hasLayerToggles?: boolean;
  hasQuiz?: boolean;
  hasAngleSwitcher?: boolean;

  introduction: {
    summary: string;
    learningObjectives: string[];
    clinicalRelevance: string;
  };

  stages: AtlasLessonStage[];
  structures: Dental3DStructure[];
  didYouKnowFacts: AtlasDidYouKnowFact[];
  quizQuestions?: AtlasQuizQuestion[];

  relatedLessons: {
    id: string;
    title: string;
    category: AtlasCategory;
    icon: string;
  }[];

  relatedArticles: {
    title: string;
    slug: string;
    category: string;
    badge: string;
  }[];

  completionSummary: {
    keyTakeaways: string[];
    clinicalAdvice: string;
  };
}
