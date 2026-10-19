export interface Reviewer {
  name: string;
  title: string;
  credentials: string;
  role: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ArticleSection {
  title: string;
  content: string;
  subsections?: { title: string; content: string }[];
  bulletPoints?: string[];
  clinicalNote?: string;
}

export type ArticleCategory =
  | 'anatomy'
  | 'teeth'
  | 'conditions'
  | 'symptoms'
  | 'treatments'
  | 'oral-hygiene'
  | 'children'
  | 'emergencies';

export interface DentalArticle {
  id: string;
  slug: string;
  title: string;
  category: ArticleCategory;
  categoryLabel: string;
  summary: string;
  readingTimeMinutes: number;
  lastReviewed: string;
  reviewer: Reviewer;
  keyFacts: string[];
  symptoms?: string[];
  causes?: string[];
  riskFactors?: string[];
  prevention?: string[];
  treatmentOverview?: string[];
  whenToSeekCare: string[];
  sections: ArticleSection[];
  relatedArticles: { title: string; slug: string; category: string }[];
  relatedTreatments?: string[];
  relatedAnatomy?: string[];
  faqs: FAQItem[];
  tags: string[];
}

export interface DictionaryTerm {
  id: string;
  term: string;
  phonetic?: string;
  termFr: string;
  termAr?: string;
  category: string;
  definition: string;
  clinicalContext: string;
  relatedArticleSlug?: string;
  relatedCategory?: string;
}
