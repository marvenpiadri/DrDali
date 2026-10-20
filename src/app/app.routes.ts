import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Centre Dentaire Dali | Clinique Dentaire & Soins d\'Excellence',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'atlas',
    pathMatch: 'full',
    redirectTo: 'atlas/inside-a-tooth',
  },
  {
    path: 'atlas/dictionary',
    title: 'Dictionnaire Dentaire A-Z | Centre Dentaire Dali',
    loadComponent: () => import('./pages/encyclopedia/dictionary').then((m) => m.DictionaryComponent),
  },
  {
    path: 'atlas/tooth-explorer',
    title: 'Explorateur 32 Dents 3D | Centre Dentaire Dali',
    data: { toolId: 'tooth-explorer' },
    loadComponent: () => import('./pages/tools/tools-3d-detail').then((m) => m.Tools3dDetailComponent),
  },
  {
    path: 'atlas/dental-arch',
    title: 'Modélisation de l\'Arcade Dentaire 3D | Centre Dentaire Dali',
    data: { toolId: 'dental-arch' },
    loadComponent: () => import('./pages/tools/tools-3d-detail').then((m) => m.Tools3dDetailComponent),
  },
  {
    path: 'atlas/tooth-decay',
    title: 'Progression de la Carie 3D | Centre Dentaire Dali',
    data: { toolId: 'tooth-decay' },
    loadComponent: () => import('./pages/tools/tools-3d-detail').then((m) => m.Tools3dDetailComponent),
  },
  {
    path: 'atlas/gum-disease',
    title: 'Maladies Parodontales & Gencives 3D | Centre Dentaire Dali',
    data: { toolId: 'gum-disease' },
    loadComponent: () => import('./pages/tools/tools-3d-detail').then((m) => m.Tools3dDetailComponent),
  },
  {
    path: 'atlas/root-canal',
    title: 'Traitement de Canal Endodontique 3D | Centre Dentaire Dali',
    data: { toolId: 'root-canal' },
    loadComponent: () => import('./pages/tools/tools-3d-detail').then((m) => m.Tools3dDetailComponent),
  },
  {
    path: 'atlas/implant-explorer',
    title: 'Système d\'Implant Dentaire 3D | Centre Dentaire Dali',
    data: { toolId: 'implant-explorer' },
    loadComponent: () => import('./pages/tools/tools-3d-detail').then((m) => m.Tools3dDetailComponent),
  },
  {
    path: 'atlas/crown-explorer',
    title: 'Couronnes & Prothèses Dentaires 3D | Centre Dentaire Dali',
    data: { toolId: 'crown-explorer' },
    loadComponent: () => import('./pages/tools/tools-3d-detail').then((m) => m.Tools3dDetailComponent),
  },
  {
    path: 'atlas/veneer-explorer',
    title: 'Facettes Esthétiques Cliniques 3D | Centre Dentaire Dali',
    data: { toolId: 'veneer-explorer' },
    loadComponent: () => import('./pages/tools/tools-3d-detail').then((m) => m.Tools3dDetailComponent),
  },
  {
    path: 'atlas/wisdom-teeth',
    title: 'Dents de Sagesse & Impactées 3D | Centre Dentaire Dali',
    data: { toolId: 'wisdom-teeth' },
    loadComponent: () => import('./pages/tools/tools-3d-detail').then((m) => m.Tools3dDetailComponent),
  },
  {
    path: 'atlas/jaw-anatomy',
    title: 'Anatomie Osseuse des Mâchoires 3D | Centre Dentaire Dali',
    data: { toolId: 'jaw-anatomy' },
    loadComponent: () => import('./pages/tools/tools-3d-detail').then((m) => m.Tools3dDetailComponent),
  },
  {
    path: 'atlas/:lessonId',
    title: 'Leçon 3D Interactive & Anatomie | Centre Dentaire Dali',
    loadComponent: () => import('./pages/atlas/atlas-lesson-detail').then((m) => m.AtlasLessonDetailComponent),
  },
  {
    path: 'tools',
    title: 'Outils Dentaires Interactifs | Centre Dentaire Dali',
    loadComponent: () => import('./pages/tools/tools-hub').then((m) => m.ToolsHubComponent),
  },
  {
    path: 'admin/3d-model-inventory',
    title: 'Inventaire des Modèles Anatomiques 3D | Centre Dentaire Dali',
    loadComponent: () => import('./pages/admin/model-inventory/model-inventory').then((m) => m.ModelInventoryComponent),
  },
  {
    path: 'clinic',
    title: 'Le Cabinet & Équipements de Pointe | Centre Dentaire Dali',
    loadComponent: () => import('./pages/clinic/clinic').then((m) => m.ClinicComponent),
  },
  {
    path: 'contact',
    title: 'Contact, Accès & Prise de Rendez-vous | Centre Dentaire Dali',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.ContactComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
