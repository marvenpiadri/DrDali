import {ChangeDetectionStrategy, Component, signal, computed, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {EncyclopediaService} from '../../services/encyclopedia.service';
import {DisclaimerComponent} from '../../components/disclaimer/disclaimer';
import {Tooth3dViewerComponent} from '../../components/tooth-3d-viewer/tooth-3d-viewer';
import {Dental3DModelType, ViewingMode} from '../../models/dental-3d.model';
import {ArticleCategory, DentalArticle} from '../../models/encyclopedia.model';

@Component({
  selector: 'app-encyclopedia-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DisclaimerComponent, Tooth3dViewerComponent],
  templateUrl: './encyclopedia-home.html',
  styleUrl: './encyclopedia-home.css',
})
export class EncyclopediaHomeComponent {
  encyclopedia = inject(EncyclopediaService);

  // 3D Laboratory Viewport State
  active3DMode = signal<ViewingMode>('surface');
  selected3DModel = signal<Dental3DModelType>('tooth-explorer');
  selectedTissue = signal<'enamel' | 'dentin' | 'pulp' | 'pdl'>('enamel');

  readonly tissueInfo = computed(() => {
    switch (this.selectedTissue()) {
      case 'enamel':
        return {
          name: 'Émail Dentaire',
          tag: 'Couche Protectrice Minérale (96%)',
          color: 'text-neutral-200',
          desc: 'Le tissu biologique le plus dur du corps humain. Il protège la dent contre les agressions mécaniques et chimiques masticatoires.',
          articleLink: '/encyclopedia/anatomy/anatomie-dent-email',
        };
      case 'dentin':
        return {
          name: 'Dentine (Ivoire)',
          tag: 'Tissu Vivant Tubulaire (70%)',
          color: 'text-amber-400',
          desc: 'Structure poreuse sous l\'émail traversée par des canalicules microscopiques transmettant les signaux thermiques aux nerfs.',
          articleLink: '/encyclopedia/anatomy/anatomie-dent-email',
        };
      case 'pulp':
        return {
          name: 'Pulpe & Canaux Radiculaires',
          tag: 'Vaisseaux & Filets Nerveux',
          color: 'text-rose-400',
          desc: 'Le tissu conjonctif vivant assurant la sensibilité et la nutrition de la dent. Son inflammation aiguë correspond à la pulpite (rage de dent).',
          articleLink: '/encyclopedia/treatments/traitement-de-canal',
        };
      case 'pdl':
        return {
          name: 'Ligament Parodontal & Os',
          tag: 'Système d\'Ancrage & Amortissement',
          color: 'text-emerald-400',
          desc: 'Faisceau de fibres de collagène fixant la racine dentaire dans l\'alvéole osseuse et amortissant les forces masticatoires.',
          articleLink: '/encyclopedia/conditions/parodontite-et-gingivite',
        };
    }
  });

  selectedCategory = signal<ArticleCategory | 'all'>('all');

  categories: { id: ArticleCategory; label: string }[] = [
    { id: 'conditions', label: 'Pathologies & Caries' },
    { id: 'treatments', label: 'Traitements & Implants' },
    { id: 'oral-hygiene', label: 'Hygiène & Prévention' },
    { id: 'emergencies', label: 'Urgences Dentaires' },
    { id: 'children', label: 'Pédodontie & Enfants' },
    { id: 'anatomy', label: 'Anatomie & Émail' },
  ];

  allArticles = this.encyclopedia.articles;

  filteredArticles = computed(() => {
    const cat = this.selectedCategory();
    const articles = this.allArticles();
    if (cat === 'all') {
      return articles;
    }
    return articles.filter((a: DentalArticle) => a.category === cat);
  });
}
