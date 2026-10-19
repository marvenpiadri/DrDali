export interface Dental3DAsset {
  id: string;
  name: string;
  source: string;
  modelUrl: string;
  license: string;
  attribution: string;
  commercialUseAllowed: boolean;
  structures: string[];
  category: 'tooth' | 'jaw' | 'gum' | 'nerve' | 'vessel' | 'treatment' | 'other';
}
