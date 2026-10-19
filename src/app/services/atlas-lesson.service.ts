import {Injectable, signal, computed, inject} from '@angular/core';
import {ATLAS_LESSONS} from '../data/atlas-lessons.data';
import {AtlasLesson, AtlasCategory} from '../models/atlas.model';
import {TranslationService} from './translation.service';
import {LESSON_TRANSLATIONS} from '../data/lesson-translations.data';

@Injectable({
  providedIn: 'root',
})
export class AtlasLessonService {
  private readonly i18n = inject(TranslationService);
  private readonly _lessons = signal<AtlasLesson[]>(ATLAS_LESSONS);

  readonly allLessons = computed(() => {
    const lang = this.i18n.currentLang();
    return this._lessons().map((l) => this.localizeLesson(l, lang));
  });

  readonly categories: { id: AtlasCategory; label: string; icon: string; count: number }[] = [
    { id: 'tooth-anatomy', label: 'Anatomie Dentaire', icon: 'layers', count: 3 },
    { id: 'dentition', label: 'Dentition & Numérotation', icon: 'grid_view', count: 2 },
    { id: 'conditions', label: 'Pathologies & Lésions', icon: 'coronavirus', count: 2 },
    { id: 'treatments', label: 'Traitements & Chirurgies', icon: 'healing', count: 2 },
    { id: 'anatomy', label: 'Mâchoires & Os Maxillo-Facial', icon: 'account_tree', count: 1 },
  ];

  private localizeLesson(lesson: AtlasLesson, lang: string): AtlasLesson {
    if (lang === 'fr') return lesson;
    const t = LESSON_TRANSLATIONS[lesson.id];
    if (!t) return lesson;

    const langKey = lang as 'en' | 'ar';
    const localized = { ...lesson };

    if (t.title && t.title[langKey]) localized.title = t.title[langKey];
    if (t.subtitle && t.subtitle[langKey]) localized.subtitle = t.subtitle[langKey];
    if (t.categoryLabel && t.categoryLabel[langKey]) localized.categoryLabel = t.categoryLabel[langKey];
    if (t.badge && t.badge[langKey]) localized.badge = t.badge[langKey];

    if (t.introduction) {
      localized.introduction = {
        summary: t.introduction.summary?.[langKey] || lesson.introduction.summary,
        learningObjectives: t.introduction.learningObjectives?.[langKey] || lesson.introduction.learningObjectives,
        clinicalRelevance: t.introduction.clinicalRelevance?.[langKey] || lesson.introduction.clinicalRelevance,
      };
    }

    if (t.stages && lesson.stages) {
      localized.stages = lesson.stages.map((stage, idx) => {
        const transStage = t.stages?.find((s) => s.id === stage.id) || t.stages?.[idx];
        if (!transStage) return stage;
        return {
          ...stage,
          title: transStage.title?.[langKey] || stage.title,
          subtitle: transStage.subtitle?.[langKey] || stage.subtitle,
          explanation: transStage.explanation?.[langKey] || stage.explanation,
          whatIsHappening: transStage.whatIsHappening?.[langKey] || stage.whatIsHappening,
          whyItMatters: transStage.whyItMatters?.[langKey] || stage.whyItMatters,
        };
      });
    }

    if (t.didYouKnowFacts && lesson.didYouKnowFacts) {
      localized.didYouKnowFacts = lesson.didYouKnowFacts.map((fact, idx) => {
        const transFact = t.didYouKnowFacts?.[idx];
        if (!transFact) return fact;
        return {
          ...fact,
          title: transFact.title?.[langKey] || fact.title,
          text: transFact.text?.[langKey] || fact.text,
        };
      });
    }

    if (t.quizQuestions && lesson.quizQuestions) {
      localized.quizQuestions = lesson.quizQuestions.map((q, idx) => {
        const transQ = t.quizQuestions?.find((item) => item.id === q.id) || t.quizQuestions?.[idx];
        if (!transQ) return q;
        return {
          ...q,
          question: transQ.question?.[langKey] || q.question,
          options: q.options.map((opt, optIdx) => {
            const transOpt = transQ.options?.find((o) => o.id === opt.id) || transQ.options?.[optIdx];
            if (!transOpt) return opt;
            return {
              ...opt,
              text: transOpt.text?.[langKey] || opt.text,
              explanation: transOpt.explanation?.[langKey] || opt.explanation,
            };
          }),
        };
      });
    }

    if (t.completionSummary) {
      localized.completionSummary = {
        keyTakeaways: t.completionSummary.keyTakeaways?.[langKey] || lesson.completionSummary.keyTakeaways,
        clinicalAdvice: t.completionSummary.clinicalAdvice?.[langKey] || lesson.completionSummary.clinicalAdvice,
      };
    }

    return localized;
  }

  getLessonById(id: string): AtlasLesson | undefined {
    const raw = this._lessons().find((l) => l.id === id || l.slug === id);
    if (!raw) return undefined;
    return this.localizeLesson(raw, this.i18n.currentLang());
  }

  getLessonsByCategory(category: AtlasCategory): AtlasLesson[] {
    return this.allLessons().filter((l) => l.category === category);
  }

  getFlagshipLessons(): AtlasLesson[] {
    return this.allLessons().slice(0, 6);
  }

  getRelatedLessons(lessonId: string): AtlasLesson[] {
    const list = this.allLessons();
    const current = list.find((l) => l.id === lessonId || l.slug === lessonId);
    if (!current) return list.slice(0, 3);
    
    const explicitIds = current.relatedLessons.map((r) => r.id);
    const related = list.filter((l) => explicitIds.includes(l.id));
    if (related.length >= 2) return related;

    const sameCat = list.filter((l) => l.category === current.category && l.id !== current.id);
    return [...related, ...sameCat].slice(0, 3);
  }

  getNextLesson(currentId: string): AtlasLesson | undefined {
    const list = this.allLessons();
    const index = list.findIndex((l) => l.id === currentId || l.slug === currentId);
    if (index >= 0 && index < list.length - 1) {
      return list[index + 1];
    }
    return list[0];
  }
}
