import {ChangeDetectionStrategy, Component, signal, computed, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {EncyclopediaService} from '../../services/encyclopedia.service';
import {DictionaryTerm} from '../../models/encyclopedia.model';
import {TranslatePipe} from '../../pipes/translate.pipe';

@Component({
  selector: 'app-dictionary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './dictionary.html',
  styleUrl: './dictionary.css',
})
export class DictionaryComponent {
  encyclopedia = inject(EncyclopediaService);

  searchQuery = signal<string>('');
  selectedLetter = signal<string>('ALL');

  alphabet = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  allTerms = this.encyclopedia.dictionaryTerms;

  filteredTerms = computed(() => {
    let terms = this.allTerms();
    const q = this.searchQuery().trim().toLowerCase();
    const letter = this.selectedLetter();

    if (q) {
      terms = terms.filter(
        (t: DictionaryTerm) =>
          t.term.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q) ||
          (t.termAr && t.termAr.includes(q))
      );
    }

    if (letter !== 'ALL') {
      terms = terms.filter((t: DictionaryTerm) => t.term.toUpperCase().startsWith(letter));
    }

    return terms.slice().sort((a: DictionaryTerm, b: DictionaryTerm) => a.term.localeCompare(b.term));
  });

  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }
}
