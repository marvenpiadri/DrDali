import {ChangeDetectionStrategy, Component, computed, signal, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TranslationService} from '../../services/translation.service';
import {TranslatePipe} from '../../pipes/translate.pipe';

export type FaqCategory = 'all' | 'general' | 'implants' | 'care' | 'aesthetics' | 'emergencies';

export interface FaqItem {
  id: string;
  category: FaqCategory;
  questionKey: string;
  answerKey: string;
  icon: string;
}

@Component({
  selector: 'app-faq-accordion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './faq-accordion.html',
  styleUrl: './faq-accordion.css',
})
export class FaqAccordionComponent {
  readonly i18n = inject(TranslationService);

  readonly selectedCategory = signal<FaqCategory>('all');
  readonly searchQuery = signal<string>('');
  readonly openIndex = signal<number | null>(0);

  readonly faqCategories: {id: FaqCategory; labelKey: string; icon: string}[] = [
    { id: 'all', labelKey: 'faqCategoryAll', icon: 'grid_view' },
    { id: 'general', labelKey: 'faqCategoryGeneral', icon: 'event_available' },
    { id: 'implants', labelKey: 'faqCategoryImplants', icon: 'hardware' },
    { id: 'care', labelKey: 'faqCategoryCare', icon: 'health_and_safety' },
    { id: 'aesthetics', labelKey: 'faqCategoryAesthetics', icon: 'auto_awesome' },
    { id: 'emergencies', labelKey: 'faqCategoryEmergencies', icon: 'medical_services' },
  ];

  readonly faqItems: FaqItem[] = [
    { id: 'q1', category: 'general', questionKey: 'faq.q1.question', answerKey: 'faq.q1.answer', icon: 'event' },
    { id: 'q2', category: 'general', questionKey: 'faq.q2.question', answerKey: 'faq.q2.answer', icon: 'schedule' },
    { id: 'q3', category: 'implants', questionKey: 'faq.q3.question', answerKey: 'faq.q3.answer', icon: 'healing' },
    { id: 'q4', category: 'implants', questionKey: 'faq.q4.question', answerKey: 'faq.q4.answer', icon: 'hourglass_empty' },
    { id: 'q5', category: 'care', questionKey: 'faq.q5.question', answerKey: 'faq.q5.answer', icon: 'vaccines' },
    { id: 'q6', category: 'care', questionKey: 'faq.q6.question', answerKey: 'faq.q6.answer', icon: 'content_cut' },
    { id: 'q7', category: 'aesthetics', questionKey: 'faq.q7.question', answerKey: 'faq.q7.answer', icon: 'face' },
    { id: 'q8', category: 'aesthetics', questionKey: 'faq.q8.question', answerKey: 'faq.q8.answer', icon: 'clean_hands' },
    { id: 'q9', category: 'emergencies', questionKey: 'faq.q9.question', answerKey: 'faq.q9.answer', icon: 'warning' },
    { id: 'q10', category: 'emergencies', questionKey: 'faq.q10.question', answerKey: 'faq.q10.answer', icon: 'cleaning_services' },
  ];

  readonly filteredFaq = computed(() => {
    const category = this.selectedCategory();
    const query = this.searchQuery().trim().toLowerCase();

    return this.faqItems.filter((item) => {
      // Category filter
      const matchesCategory = category === 'all' || item.category === category;
      if (!matchesCategory) return false;

      // Text search filter
      if (!query) return true;

      const questionText = this.i18n.translate(item.questionKey).toLowerCase();
      const answerText = this.i18n.translate(item.answerKey).toLowerCase();

      return questionText.includes(query) || answerText.includes(query);
    });
  });

  toggleItem(index: number) {
    if (this.openIndex() === index) {
      this.openIndex.set(null);
    } else {
      this.openIndex.set(index);
    }
  }

  setCategory(cat: FaqCategory) {
    this.selectedCategory.set(cat);
    this.openIndex.set(0); // Open first matching item
  }

  onWhatsAppClick() {
    this.openWhatsApp.emit();
  }
}
