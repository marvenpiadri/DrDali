export type Dental3DModelType = 
  | 'tooth-explorer' 
  | 'dental-arch' 
  | 'tooth-decay' 
  | 'gum-disease' 
  | 'root-canal' 
  | 'implant-explorer' 
  | 'crown-explorer' 
  | 'veneer-explorer' 
  | 'wisdom-teeth' 
  | 'jaw-anatomy';

export type ViewingMode = 'surface' | 'anatomy' | 'isolate' | 'cross-section' | 'xray';
export type ToothNumberingSystem = 'fdi' | 'universal' | 'palmer';

export interface ToothData {
  id: string;
  name: string;
  function: string;
  description: string;
}

export interface Dental3DModel {
  id: string;
  name: string;
  type: Dental3DModelType;
  title: string;
  description: string;
  structures?: Dental3DStructure[];
  stages?: Dental3DStage[];
  cameraInitialPosition?: [number, number, number];
  cameraTarget?: [number, number, number];
  allowExplodedView?: boolean;
  allowCrossSection?: boolean;
}

export interface Dental3DStructure {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  tag: string;
  description: string;
  functionText: string;
  clinicalSignificance: string;
  relatedConditions: string[];
  relatedTreatments: string[];
  relatedArticleSlug?: string;
  relatedArticleTitle?: string;
  position3D?: [number, number, number]; // Normalized position for 3D annotation pin
}

export interface Dental3DStage {
  id: string;
  stageNumber: number;
  title: string;
  titleAr: string;
  severity: 'healthy' | 'mild' | 'moderate' | 'severe' | 'critical';
  shortDesc: string;
  clinicalDescription: string;
  whatHappens: string;
  whyNecessary?: string;
  patientSensation: string;
  recommendedTreatment: string;
  relatedArticleSlug?: string;
}

export interface ToothArchItem {
  fdi: number;
  universal: number;
  palmer: string;
  nameFr: string;
  nameAr: string;
  type: 'incisor' | 'canine' | 'premolar' | 'molar';
  arch: 'maxillary' | 'mandibular';
  quadrant: 1 | 2 | 3 | 4;
  functionFr: string;
  eruptionAge: string;
  rootsCount: number;
  commonConditions: string[];
  commonTreatments: string[];
}

export interface Dental3DToolConfig {
  id: Dental3DModelType;
  slug: string;
  title: string;
  subtitle: string;
  category: 'anatomy' | 'conditions' | 'treatments';
  badge: string;
  icon: string;
  description: string;
  disclaimer: string;
  defaultMode: ViewingMode;
  availableModes: ViewingMode[];
  structures?: Dental3DStructure[];
  stages?: Dental3DStage[];
  relatedArticles: { title: string; slug: string; category: string }[];
}

export interface LandmarkHoverInfo {
  visible: boolean;
  label: string;
  category: string;
  screenX: number;
  screenY: number;
}
