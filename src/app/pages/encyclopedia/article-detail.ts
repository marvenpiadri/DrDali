import {ChangeDetectionStrategy, Component, signal, computed, inject} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {EncyclopediaService} from '../../services/encyclopedia.service';
import {DentalArticle} from '../../models/encyclopedia.model';
import {DisclaimerComponent} from '../../components/disclaimer/disclaimer';

@Component({
  selector: 'app-article-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DisclaimerComponent],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.css',
})
export class ArticleDetailComponent {
  route = inject(ActivatedRoute);
  encyclopedia = inject(EncyclopediaService);

  slug = signal<string>('');

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const s = params.get('slug') || '';
      this.slug.set(s);
    });
  }

  article = computed<DentalArticle | undefined>(() => {
    return this.encyclopedia.getArticleBySlug(this.slug());
  });

  related3DTool = computed(() => {
    const s = this.slug();
    switch (s) {
      case 'enamel':
        return {
          slug: 'tooth-explorer',
          title: 'Explorateur Anatomique de l\'Émail en 3D',
          desc: 'Examinez la structure prismatique externe, la jonction amélo-dentinaire et les couches sous-jacentes à 360°.',
          icon: 'view_in_ar',
          badge: 'Signature 3D',
        };
      case 'dental-caries':
        return {
          slug: 'tooth-decay',
          title: 'Simulateur 3D de l\'Évolution de la Carie',
          desc: 'Observez la déminéralisation de l\'émail, l\'atteinte dentinaire et la pulpite sur les 6 stades progressifs.',
          icon: 'coronavirus',
          badge: 'Simulation 3D',
        };
      case 'root-canal':
        return {
          slug: 'root-canal',
          title: 'Parcours Thérapeutique 3D du Traitement de Canal',
          desc: 'Suivez en 3D les 10 étapes cliniques : anesthésie, pose de la digue, désinfection NiTi et obturation étanche.',
          icon: 'architecture',
          badge: 'Chirurgie 3D',
        };
      case 'dental-implants':
        return {
          slug: 'implant-explorer',
          title: 'Atelier 3D d\'Implantologie & Ostéo-intégration',
          desc: 'Manipulez la vis en titane Grade 5, le pilier trans-gingival et la couronne zircone en vue éclatée interactive.',
          icon: 'hardware',
          badge: 'Implant 3D',
        };
      case 'periodontitis':
        return {
          slug: 'gum-disease',
          title: 'Simulation 3D de la Parodontite & Déchaussement',
          desc: 'Mesurez visuellement la perte osseuse, le tartre sous-gingival et la profondeur des poches parodontales.',
          icon: 'water_drop',
          badge: 'Parodonte 3D',
        };
      case 'tooth-pain':
      case 'dental-abscess':
        return {
          slug: 'wisdom-teeth',
          title: 'Explorateur 3D des Dents de Sagesse & Douleurs',
          desc: 'Comprenez l\'enclavement des troisièmes molaires et le trajet du nerf alvéolaire inférieur.',
          icon: 'psychology',
          badge: 'Anatomie 3D',
        };
      default:
        return {
          slug: 'tooth-explorer',
          title: 'Explorateur Anatomique 3D des Dents',
          desc: 'Visualisez les structures dentaires internes et externes dans notre laboratoire numérique 3D.',
          icon: 'view_in_ar',
          badge: 'Laboratoire 3D',
        };
    }
  });
}
