import {ChangeDetectionStrategy, Component, signal, output, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {EncyclopediaService} from '../../services/encyclopedia.service';
import {TranslationService} from '../../services/translation.service';
import {DentalArticle, DictionaryTerm} from '../../models/encyclopedia.model';
import {TranslatePipe} from '../../pipes/translate.pipe';

@Component({
  selector: 'app-search-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './search-modal.html',
  styleUrl: './search-modal.css',
})
export class SearchModalComponent {
  encyclopedia = inject(EncyclopediaService);
  i18n = inject(TranslationService);
  closeModal = output<void>();

  query = signal<string>('');
  
  suggestedTags = [
    'Carie',
    'Implant',
    'Douleur',
    'Dévitalisation',
    'Abcès',
    'Sensibilité',
    'Émail',
    'Parodontite',
    'Dents de sagesse',
  ];

  results = signal<{ articles: DentalArticle[]; terms: DictionaryTerm[] }>({
    articles: [],
    terms: [],
  });

  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.setQuery(val);
  }

  setQuery(q: string) {
    this.query.set(q);
    this.results.set(this.encyclopedia.search(q));
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('search-backdrop')) {
      this.closeModal.emit();
    }
  }
}
