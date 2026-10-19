import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Dental3DViewportComponent} from '../../../components/dental-3d-viewport/dental-3d-viewport';
import {Dental3DModelType, ViewingMode} from '../../../models/dental-3d.model';
import {Dental3DDataService} from '../../../services/dental-3d-data.service';

export interface ModelSourceInventoryItem {
  id: 'toothfairy' | 'openfulljaw' | 'fang' | 'diaz';
  name: string;
  category: string;
  authors: string;
  year: number;
  doi: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  subjectType: 'Human CBCT Patient Scan' | 'Pediatric CBCT' | 'Synthetic CAD / Finite Element';
  caseIdentifier: string;
  bufferFile: string;
  bufferSizeBytes: number;
  totalTrianglesApprox: number;
  supportedStructures: string[];
  limitations: string[];
  clinicalLessonsPowered: {title: string; slug: string; type: 'atlas' | 'tool'}[];
}

@Component({
  selector: 'app-model-inventory',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, RouterLink, Dental3DViewportComponent],
  templateUrl: './model-inventory.html',
  styleUrl: './model-inventory.css',
})
export class ModelInventoryComponent {
  private d3Data = inject(Dental3DDataService);

  // Active dataset inspector
  readonly activeDatasetId = signal<'toothfairy' | 'openfulljaw' | 'fang' | 'diaz'>('toothfairy');
  readonly previewModelType = signal<Dental3DModelType>('dental-arch');
  readonly previewMode = signal<ViewingMode>('anatomy');

  // Capability Matrix structures definition
  readonly capabilityColumns = [
    { key: 'jawBone', label: 'Os Mâchoire (Mandibule/Maxillaire)' },
    { key: 'full32Teeth', label: '32 Dents Permanentes' },
    { key: 'pulpCavity', label: 'Chambre Pulpaire Interne' },
    { key: 'rootCanals', label: 'Canaux Radiculaires' },
    { key: 'pdl', label: 'Ligament Parodontal (Desmodonte)' },
    { key: 'nerveCanal', label: 'Canal Nerf Alvéolaire Inférieur' },
    { key: 'sinusFloor', label: 'Plancher Sinus Maxillaire' },
    { key: 'appliance', label: 'Appareil Orthodontique' },
  ];

  // Datasets Inventory
  readonly datasets: ModelSourceInventoryItem[] = [
    {
      id: 'toothfairy',
      name: 'ToothFairy3 (Case 3F_026)',
      category: 'Clinical Maxillofacial CBCT',
      authors: 'F. Bolelli, L. Lumetti, S. Vinayahalingam et al. (Uni. Modena & Reggio Emilia)',
      year: 2025,
      doi: '10.1109/TMI.2024.3523096',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      sourceUrl: 'https://ditto.ing.unimore.it/toothfairy3/',
      subjectType: 'Human CBCT Patient Scan',
      caseIdentifier: 'Patient ToothFairy3F_026 (Selected among 532 scans)',
      bufferFile: 'toothfairy.bin',
      bufferSizeBytes: 8176368,
      totalTrianglesApprox: 340000,
      supportedStructures: [
        '32 Dents adultes complètes segmentées individuellement (FDI 11 à 48)',
        '32 Systèmes pulpaires anatomiques internes réels (FDI 11 à 48)',
        'Mandibule osseuse adulte & Processus alvéolaire maxillaire',
        'Canal mandibulaire gauche & droit (Nerf alvéolaire inférieur)',
        'Planchers des sinus maxillaires gauche et droit',
      ],
      limitations: [
        'Pas de segmentation distincte émail / dentine (limite résolution scan 0.3mm)',
        'Pas de ligament parodontal (PDL)',
        'Les apex pulpaires fins (<0.3mm) sont tronqués physiologiquement à 1-2mm du foramen',
        'Maxillaire tronqué par le champ de vue (FOV) du Cone Beam',
      ],
      clinicalLessonsPowered: [
        { title: 'À l\'intérieur d\'une Dent (Chambre pulpaire)', slug: 'inside-a-tooth', type: 'atlas' },
        { title: 'Numérotation & Types Dentaires', slug: 'tooth-numbering', type: 'atlas' },
        { title: 'Surfaces & Faces de la Dent', slug: 'tooth-surfaces', type: 'atlas' },
        { title: 'Racines & Réseau Canalaire', slug: 'roots-and-canals', type: 'atlas' },
        { title: 'Arcade Dentaire & Mâchoire Adulte', slug: 'full-dentition', type: 'atlas' },
        { title: 'Simulation Traitement Endodontique 3D', slug: 'root-canal', type: 'tool' },
        { title: 'Explorateur Dents de Sagesse & Nerf', slug: 'wisdom-teeth', type: 'tool' },
      ],
    },
    {
      id: 'openfulljaw',
      name: 'Open-Full-Jaw (Patient 12)',
      category: 'Finite Element Biomechanical CBCT',
      authors: 'T. Gholamalizadeh, F. Moshfeghifar, Z. Ferguson, D. Panozzo, K. Erleben et al.',
      year: 2022,
      doi: '10.1016/j.cmpb.2022.107009',
      license: 'CC BY-NC-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
      sourceUrl: 'https://github.com/diku-dk/Open-Full-Jaw',
      subjectType: 'Human CBCT Patient Scan',
      caseIdentifier: 'Patient 12 of 17 (Adult Validated Dataset)',
      bufferFile: 'open-full-jaw.bin',
      bufferSizeBytes: 8274192,
      totalTrianglesApprox: 290000,
      supportedStructures: [
        'Mandibule et Maxillaire osseux complets d\'un patient réel',
        '31 Dents segmentées avec occlusion réelle (dent 26 absente in-vivo)',
        '31 Coques de ligament parodontal (Desmodonte) dérivées de l\'espace alvéolaire',
      ],
      limitations: [
        'Aucune anatomie pulpaire interne (dents pleines)',
        'Dent 26 manquante chez ce patient',
        'Licence CC BY-NC-SA 4.0 stricte non commerciale',
      ],
      clinicalLessonsPowered: [
        { title: 'Tissus de Soutien & Parodonte', slug: 'supporting-structures', type: 'atlas' },
        { title: 'Maladie Parodontale & Poches 3D', slug: 'gum-disease', type: 'tool' },
        { title: 'Ostéointégration & Implants', slug: 'implant-explorer', type: 'tool' },
      ],
    },
    {
      id: 'fang',
      name: 'Fang Molar & Space Maintainer (Kang 2024)',
      category: 'Pediatric Finite Element Model',
      authors: 'Fang Fang Kang, Shi, Liu (PeerJ 12:e17456)',
      year: 2024,
      doi: '10.7717/peerj.17456',
      license: 'CC BY 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      sourceUrl: 'https://doi.org/10.6084/m9.figshare.24591537.v1',
      subjectType: 'Pediatric CBCT',
      caseIdentifier: 'Child aged 7 in Mixed Dentition (Mandibular 1st Molar 46)',
      bufferFile: 'dental.bin',
      bufferSizeBytes: 10321680,
      totalTrianglesApprox: 85000,
      supportedStructures: [
        'Première molaire permanente immature (Dent 46 avec apex ouvert)',
        'Chambre pulpaire volumineuse typique de l\'enfant',
        'Ligament parodontal (0.15-0.2mm)',
        'Mainteneur d\'espace bague-et-boucle (Band & Loop appliance)',
      ],
      limitations: [
        'Molaire unitaire pédiatrique (pas d\'arcade complète)',
        'Apex radiculaire incomplet (normal à 7 ans)',
      ],
      clinicalLessonsPowered: [
        { title: 'Dentition Mixte & Apexogénèse', slug: 'roots-and-canals', type: 'atlas' },
        { title: 'Mainteneur d\'Espace Orthodontique', slug: 'tooth-explorer', type: 'tool' },
      ],
    },
    {
      id: 'diaz',
      name: 'Diaz Synthetic Human Jaw (2024)',
      category: 'Synthetic CAD Biomechanical Geometry',
      authors: 'Cristian Diaz and colleagues (Mendeley Data)',
      year: 2024,
      doi: '10.17632/xjsx7nfhj8.1',
      license: 'CC BY 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      sourceUrl: 'https://data.mendeley.com/datasets/xjsx7nfhj8/1',
      subjectType: 'Synthetic CAD / Finite Element',
      caseIdentifier: 'Synthetic Standard Mandible Architecture',
      bufferFile: 'dental.bin',
      bufferSizeBytes: 10321680,
      totalTrianglesApprox: 120000,
      supportedStructures: [
        'Os cortical mandibulaire dense',
        'Os spongieux / trabéculaire interne',
        'Dents mandibulaires 31-37, 41-47',
        'Gaines synthétiques ligamentaires (0.25mm)',
      ],
      limitations: [
        'Modèle synthétique non patient',
        'Pas de pulpe ni de canaux radiculaires',
        'Mandibule uniquement (pas de maxillaire)',
      ],
      clinicalLessonsPowered: [
        { title: 'Anatomie Osseuse Mandibulaire', slug: 'supporting-structures', type: 'atlas' },
        { title: 'Architecture Os Cortical vs Spongieux', slug: 'jaw-anatomy', type: 'tool' },
      ],
    },
  ];

  // Active dataset computed
  readonly activeDataset = computed(() => {
    return this.datasets.find(d => d.id === this.activeDatasetId()) || this.datasets[0];
  });

  // Capability matrix values
  readonly matrixData: Record<string, Record<string, boolean>> = {
    toothfairy: {
      jawBone: true,
      full32Teeth: true,
      pulpCavity: true,
      rootCanals: true,
      pdl: false,
      nerveCanal: true,
      sinusFloor: true,
      appliance: false,
    },
    openfulljaw: {
      jawBone: true,
      full32Teeth: true, // 31
      pulpCavity: false,
      rootCanals: false,
      pdl: true,
      nerveCanal: false,
      sinusFloor: false,
      appliance: false,
    },
    fang: {
      jawBone: false,
      full32Teeth: false, // 1 tooth
      pulpCavity: true,
      rootCanals: true,
      pdl: true,
      nerveCanal: false,
      sinusFloor: false,
      appliance: true,
    },
    diaz: {
      jawBone: true,
      full32Teeth: false, // Lower only
      pulpCavity: false,
      rootCanals: false,
      pdl: true,
      nerveCanal: false,
      sinusFloor: false,
      appliance: false,
    },
  };

  selectDataset(id: 'toothfairy' | 'openfulljaw' | 'fang' | 'diaz') {
    this.activeDatasetId.set(id);
    if (id === 'fang') {
      this.previewModelType.set('tooth-explorer');
    } else if (id === 'diaz') {
      this.previewModelType.set('jaw-anatomy');
    } else {
      this.previewModelType.set('dental-arch');
    }
  }
}
