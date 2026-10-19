import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AtlasLessonService} from '../../services/atlas-lesson.service';
import {Dental3DDataService} from '../../services/dental-3d-data.service';
import {AtlasCategory, AtlasLesson} from '../../models/atlas.model';
import {Dental3DToolConfig} from '../../models/dental-3d.model';
import {TranslationService} from '../../services/translation.service';
import {CompactToothPreviewComponent} from '../../components/compact-tooth-preview/compact-tooth-preview';
import {TranslatePipe} from '../../pipes/translate.pipe';

@Component({
  selector: 'app-atlas-home',
  imports: [RouterLink, CompactToothPreviewComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './atlas-home.html',
  styleUrl: './atlas-home.css',
})
export class AtlasHomeComponent {
  readonly atlasService = inject(AtlasLessonService);
  readonly d3Data = inject(Dental3DDataService);
  readonly i18n = inject(TranslationService);

  readonly selectedCategory = signal<AtlasCategory | 'all'>('all');
  readonly searchQuery = signal<string>('');

  readonly categories = computed<{ id: AtlasCategory | 'all'; label: string; icon: string }[]>(() => [
    { id: 'all', label: this.i18n.translate('allLessons'), icon: 'apps' },
    { id: 'tooth-anatomy', label: this.i18n.translate('toothAnatomy'), icon: 'layers' },
    { id: 'dentition', label: this.i18n.translate('dentition32'), icon: 'grid_view' },
    { id: 'conditions', label: this.i18n.translate('pathologiesLesions'), icon: 'coronavirus' },
    { id: 'treatments', label: this.i18n.translate('treatmentsSurgeries'), icon: 'healing' },
    { id: 'anatomy', label: this.i18n.translate('maxillofacial'), icon: 'account_tree' },
  ]);

  readonly flagshipLesson = computed<AtlasLesson | undefined>(() => {
    return this.atlasService.getLessonById('inside-a-tooth');
  });

  readonly filteredLessons = computed<AtlasLesson[]>(() => {
    const all = this.atlasService.allLessons();
    const cat = this.selectedCategory();
    const query = this.searchQuery().toLowerCase().trim();

    return all.filter((lesson) => {
      const matchesCat = cat === 'all' || lesson.category === cat;
      const matchesQuery =
        !query ||
        lesson.title.toLowerCase().includes(query) ||
        lesson.subtitle.toLowerCase().includes(query) ||
        lesson.categoryLabel.toLowerCase().includes(query) ||
        lesson.stages.some((s) => s.title.toLowerCase().includes(query));

      return matchesCat && matchesQuery;
    });
  });

  readonly filteredSimulations = computed<Dental3DToolConfig[]>(() => {
    const all = this.d3Data.toolsCatalog;
    const cat = this.selectedCategory();
    const query = this.searchQuery().toLowerCase().trim();

    return all.filter((sim: Dental3DToolConfig) => {
      const matchesCat = cat === 'all' || sim.category === cat;
      const matchesQuery =
        !query ||
        sim.title.toLowerCase().includes(query) ||
        sim.subtitle.toLowerCase().includes(query) ||
        sim.description.toLowerCase().includes(query);

      return matchesCat && matchesQuery;
    });
  });

  selectCategory(cat: AtlasCategory | 'all') {
    this.selectedCategory.set(cat);
  }

  setCategory(cat: AtlasCategory | 'all') {
    this.selectedCategory.set(cat);
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  clearSearch() {
    this.searchQuery.set('');
  }
}
