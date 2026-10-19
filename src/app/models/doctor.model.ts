export interface Doctor {
  id: string;
  name: string;
  title: {
    fr: string;
    ar: string;
    en: string;
  };
  specialties: {
    fr: string[];
    ar: string[];
    en: string[];
  };
  diplomas: {
    fr: string[];
    ar: string[];
    en: string[];
  };
  bio: {
    fr: string;
    ar: string;
    en: string;
  };
  quote: {
    fr: string;
    ar: string;
    en: string;
  };
  languages: string[];
  initials: string;
  colorAccent: string;
}
