export interface ToothData {
  fdiNumber: number;
  universalNumber: number;
  palmerNotation: string;
  nameFr: string;
  nameEn: string;
  quadrant: 1 | 2 | 3 | 4;
  quadrantLabel: string;
  arch: 'maxilla' | 'mandible'; // Upper or Lower jaw
  toothType: 'incisor' | 'canine' | 'premolar' | 'molar';
  typicalRoots: number;
  anatomyOverview: string;
  functions: string[];
  commonConditions: string[];
  commonTreatments: string[];
  encyclopediaSlug?: string;
  eruptionAge: string;
}

export interface ToothSurface {
  code: 'O' | 'M' | 'D' | 'B' | 'L';
  nameFr: string;
  nameEn: string;
  description: string;
  clinicalSignificance: string;
}

export interface ToothLayer {
  id: string;
  nameFr: string;
  nameEn: string;
  nature: 'mineral' | 'cellular' | 'vascular' | 'bone';
  description: string;
  composition: string;
  vulnerability: string;
  clinicalSignificance: string;
  relatedConditions: string[];
}

export interface SymptomOption {
  id: string;
  label: string;
  category: 'pain' | 'sensitivity' | 'gum' | 'structural' | 'appearance';
  icon: string;
  description: string;
}

export interface SymptomAssessmentResult {
  matchedSymptoms: string[];
  possibleCauses: {
    condition: string;
    likelihood: 'Élevée' | 'Modérée' | 'Possible';
    rationale: string;
    articleSlug?: string;
  }[];
  urgencyLevel: 'Urgence immédiate' | 'Consultation prioritaire (24-48h)' | 'Consultation programmée';
  urgencyColor: string;
  affectedAnatomy: string[];
  actionsToDo: string[];
  actionsToAvoid: string[];
  disclaimer: string;
}

export interface EmergencyScenario {
  id: string;
  title: string;
  urgency: 'Critique (< 60 min)' | 'Urgent (le jour même)' | 'Important (< 48h)';
  urgencyLevel: 1 | 2 | 3;
  description: string;
  immediateActions: string[];
  contraindications: string[];
  expectedClinicCare: string;
  whatsappMessage: string;
}

export interface EruptionStage {
  ageMonthsOrYears: number;
  ageDisplay: string;
  phase: 'primary' | 'mixed' | 'permanent';
  description: string;
  eruptingTeeth: string[];
  sheddingTeeth?: string[];
  hygieneAdvice: string;
}

export interface TreatmentDetail {
  id: string;
  slug: string;
  title: string;
  category: string;
  durationEstimate: string;
  anesthesia: string;
  summary: string;
  indications: string[];
  stepByStep: { step: number; title: string; description: string }[];
  patientExperience: string;
  postOpCare: string[];
  questionsToAsk: string[];
}

export interface DentalMaterial {
  id: string;
  name: string;
  category: 'Céramique & Zircone' | 'Métal & Alliage' | 'Polymère & Résine' | 'Naturel';
  composition: string;
  biocompatibility: string;
  aestheticScore: number; // 1-10
  durabilityScore: number; // 1-10
  indications: string[];
  advantages: string[];
  considerations: string[];
}
