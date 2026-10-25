import {Injectable, signal, computed, effect} from '@angular/core';

export type Language = 'fr' | 'ar' | 'en';
export type TextDirection = 'auto' | 'rtl' | 'ltr';

export type Translations = Record<
  string,
  {
    fr: string;
    ar: string;
    en: string;
  }
>;

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  readonly currentLang = signal<Language>('fr');
  readonly textDir = signal<TextDirection>('auto');

  /**
   * Evaluates if effective layout is Right-To-Left (RTL).
   * If textDir is 'rtl' -> true
   * If textDir is 'ltr' -> false
   * If textDir is 'auto' -> true when currentLang === 'ar', false otherwise
   */
  readonly isRtl = computed(() => {
    const dir = this.textDir();
    if (dir === 'rtl') return true;
    if (dir === 'ltr') return false;
    return this.currentLang() === 'ar';
  });

  readonly effectiveDir = computed<'rtl' | 'ltr'>(() => (this.isRtl() ? 'rtl' : 'ltr'));

  private readonly dictionary: Translations = {
    // Brand
    brandName: {
      fr: 'Demo',
      ar: 'Demo',
      en: 'Demo',
    },
    brandTagline: {
      fr: 'La confiance dans chaque sourire',
      ar: 'الثقة في كل ابتسامة',
      en: 'Confidence in every smile',
    },
    cityLocation: {
      fr: 'Demo City, Morocco',
      ar: 'مدينة تجريبية، المغرب',
      en: 'Demo City, Morocco',
    },
    clinicAddress: {
      fr: 'Demo Avenue, Demo City, Maroc',
      ar: 'شارع تجريبي، مدينة تجريبية، المغرب',
      en: 'Hassan II Avenue, Al Manar Residence, Demo City, Morocco',
    },
    openingHours: {
      fr: 'Lun - Ven : 09:00 - 19:30 • Sam : 09:00 - 14:00',
      ar: 'الإثنين - الجمعة: 09:00 - 19:30 • السبت: 09:00 - 14:00',
      en: 'Mon - Fri: 09:00 - 19:30 • Sat: 09:00 - 14:00',
    },

    // Global Primary Navigation
    navHome: {
      fr: 'Accueil',
      ar: 'الرئيسية',
      en: 'Home',
    },
    navAtlas: {
      fr: 'Atlas 3D',
      ar: 'الأطلس 3D',
      en: '3D Atlas',
    },
    navEncyclopedia: {
      fr: 'Atlas 3D',
      ar: 'الأطلس 3D',
      en: '3D Atlas',
    },
    navTools: {
      fr: 'Outils Cliniques',
      ar: 'الأدوات السريرية',
      en: 'Clinical Tools',
    },
    navDoctors: {
      fr: 'Doctors',
      ar: 'الأطباء',
      en: 'Doctors',
    },
    navClinic: {
      fr: 'Le Cabinet',
      ar: 'العيادة والتجهيزات',
      en: 'The Clinic',
    },
    navContact: {
      fr: 'Contact & Accès',
      ar: 'تواصل والوصول',
      en: 'Contact & Location',
    },
    navDictionary: {
      fr: 'Dictionnaire Dentaire',
      ar: 'المعجم الطبي للأسنان',
      en: 'Dental Glossary',
    },

    // Direction & Reading Mode
    dirMode: {
      fr: 'Sens de lecture',
      ar: 'اتجاه القراءة',
      en: 'Reading Direction',
    },
    dirRtl: {
      fr: 'RTL (Droite à Gauche)',
      ar: 'من اليمين إلى اليسار (RTL)',
      en: 'RTL (Right-to-Left)',
    },
    dirLtr: {
      fr: 'LTR (Gauche à Droite)',
      ar: 'من اليسار إلى اليمين (LTR)',
      en: 'LTR (Left-to-Right)',
    },
    dirAuto: {
      fr: 'Automatique',
      ar: 'تلقائي حسب اللغة',
      en: 'Auto',
    },
    toggleRtlLtr: {
      fr: 'Basculer RTL / LTR',
      ar: 'تبديل الاتجاه (يمين/يسار)',
      en: 'Toggle RTL / LTR',
    },

    // Action Buttons & WhatsApp
    btnWhatsApp: {
      fr: 'WhatsApp',
      ar: 'واتساب',
      en: 'WhatsApp',
    },
    btnWhatsAppShort: {
      fr: 'WhatsApp',
      ar: 'واتساب',
      en: 'WhatsApp',
    },
    directWhatsApp: {
      fr: 'Ligne Directe WhatsApp',
      ar: 'خط واتساب المباشر',
      en: 'Direct WhatsApp Line',
    },
    btnBookAppointment: {
      fr: 'Prendre Rendez-vous',
      ar: 'حجز موعد استشارة',
      en: 'Book Appointment',
    },
    btnEmergency: {
      fr: 'Urgence Dentaire',
      ar: 'طوارئ الأسنان الفورية',
      en: 'Dental Emergency',
    },
    btnSearch: {
      fr: 'Rechercher une dent, un soin, un terme...',
      ar: 'ابحث عن سن، علاج، أو مصطلح طبي...',
      en: 'Search tooth, treatment, term...',
    },
    btnSearchShortcut: {
      fr: 'Ctrl+K',
      ar: 'Ctrl+K',
      en: 'Ctrl+K',
    },
    btnExplore3D: {
      fr: 'Explorer la Dent en 3D',
      ar: 'استكشاف السن ثلاثي الأبعاد',
      en: 'Explore Tooth in 3D',
    },
    btnReadArticle: {
      fr: 'Lire l\'article',
      ar: 'قراءة المقال الطبي',
      en: 'Read Article',
    },
    btnDirections: {
      fr: 'Itinéraire & Localisation',
      ar: 'المسار وتحديد الموقع',
      en: 'Directions & Location',
    },
    btnCallDirect: {
      fr: 'Appeler le cabinet',
      ar: 'الاتصال بالعيادة مباشرة',
      en: 'Call Clinic',
    },
    btnSendMessage: {
      fr: 'Envoyer le message',
      ar: 'إرسال الرسالة',
      en: 'Send Message',
    },
    btnStartSimulation: {
      fr: 'Démarrer la simulation 3D',
      ar: 'بدء المحاكاة ثلاثية الأبعاد',
      en: 'Start 3D Simulation',
    },
    btnResetView: {
      fr: 'Recentrer la caméra',
      ar: 'إعادة ضبط المنظور',
      en: 'Recenter Camera',
    },

    // 3D Visual Lab & Teaser
    interactive3DTitle: {
      fr: 'Laboratoire Visuel 3D : Anatomie Dentaire',
      ar: 'المختبر البصري ثلاثي الأبعاد: تشريح وبنية الأسنان',
      en: '3D Visual Lab: Tooth Anatomy',
    },
    interactive3DSubtitle: {
      fr: 'Manipulez, pivotez et inspectez les couches de la dent (émail, dentine, pulpe, canaux radiculaires) en temps réel avec notre moteur 3D interactif.',
      ar: 'حرّك، أدر وتفحص طبقات السن (المينا، العاج، الحجرة اللبية، قنوات الجذور) في الوقت الفعلي باستخدام محركنا التفاعلي ثلاثي الأبعاد.',
      en: 'Rotate, inspect, and explore tooth layers (enamel, dentin, pulp, root canals) in real-time with our interactive 3D dental engine.',
    },
    modeFullTooth: {
      fr: 'Dent Complète',
      ar: 'السن بالكامل',
      en: 'Full Tooth',
    },
    modeCrossSection: {
      fr: 'Coupe Anatomique',
      ar: 'مقطع تشريحي داخلي',
      en: 'Cross Section',
    },
    modeXray: {
      fr: 'Vue Radiographique',
      ar: 'رؤية إشعاعية شفافة',
      en: 'X-Ray View',
    },
    modePulp: {
      fr: 'Cavité Pulpaire',
      ar: 'الحجرة وقنوات العصب',
      en: 'Pulp Cavity',
    },
    autoRotateToggle: {
      fr: 'Rotation Automatique',
      ar: 'دوران تلقائي مستمر',
      en: 'Auto Rotate',
    },

    // 3D Controls & Viewpoints
    reset: {
      fr: 'Réinitialiser',
      ar: 'إعادة ضبط',
      en: 'Reset',
    },
    recenterView: {
      fr: 'Recentrer la vue',
      ar: 'إعادة توسيط المنظور',
      en: 'Recenter view',
    },
    fullscreen: {
      fr: 'Plein écran',
      ar: 'ملء الشاشة',
      en: 'Fullscreen',
    },
    exitFullscreen: {
      fr: 'Quitter plein écran',
      ar: 'إنهاء ملء الشاشة',
      en: 'Exit fullscreen',
    },
    occlusal: {
      fr: 'Occlusale',
      ar: 'إطباقي (علوي/سطح المضغ)',
      en: 'Occlusal',
    },
    anterior: {
      fr: 'Antérieure',
      ar: 'أمامي',
      en: 'Anterior',
    },
    posterior: {
      fr: 'Postérieure',
      ar: 'خلفي',
      en: 'Posterior',
    },
    left: {
      fr: 'Gauche',
      ar: 'أيسر',
      en: 'Left',
    },
    right: {
      fr: 'Droite',
      ar: 'أيمن',
      en: 'Right',
    },
    vestibular: {
      fr: 'Vestibulaire',
      ar: 'دهليزي (خارجي جهة الشفة)',
      en: 'Vestibular',
    },
    lingual: {
      fr: 'Linguale',
      ar: 'لساني (داخلي جهة اللسان)',
      en: 'Lingual',
    },
    palatal: {
      fr: 'Palatine',
      ar: 'حنكي (داخلي سقف الحلق)',
      en: 'Palatal',
    },
    mesial: {
      fr: 'Mésiale',
      ar: 'إنسي (نحو خط المنتصف)',
      en: 'Mesial',
    },
    distal: {
      fr: 'Distale',
      ar: 'وحشي (بعيداً عن المنتصف)',
      en: 'Distal',
    },

    // Anatomical Structures (Medical Terminology)
    pulp: {
      fr: 'Pulpe dentaire (Nerf & Vaisseaux)',
      ar: 'لب السن (الأعصاب والأوعية الدموية)',
      en: 'Dental pulp (Nerve & Blood vessels)',
    },
    root: {
      fr: 'Racine dentaire',
      ar: 'جذر السن',
      en: 'Tooth Root',
    },
    enamel: {
      fr: 'Émail dentaire',
      ar: 'مينا الأسنان',
      en: 'Dental enamel',
    },
    dentin: {
      fr: 'Dentine',
      ar: 'العاج السني',
      en: 'Dentin',
    },
    cementum: {
      fr: 'Cément radiculaire',
      ar: 'الملاط الجذري',
      en: 'Root Cementum',
    },
    periodontalLigament: {
      fr: 'Desmodonte / Ligament parodontal',
      ar: 'رباط حول السن (الديسمودونت)',
      en: 'Periodontal ligament',
    },
    alveolarBone: {
      fr: 'Os alvéolaire de soutien',
      ar: 'العظم السنخي الداعم',
      en: 'Alveolar bone',
    },
    gingiva: {
      fr: 'Gencive saine',
      ar: 'اللثة السليمة',
      en: 'Healthy gingiva',
    },
    inferiorAlveolarCanal: {
      fr: 'Canal du nerf alvéolaire inférieur',
      ar: 'قناة العصب السنخي السفلي',
      en: 'Inferior alveolar nerve canal',
    },
    maxilla: {
      fr: 'Os Maxillaire (Mâchoire supérieure)',
      ar: 'عظم الفك العلوي (الماكسيلا)',
      en: 'Maxilla (Upper Jaw)',
    },
    mandible: {
      fr: 'Os Mandibulaire (Mâchoire inférieure)',
      ar: 'عظم الفك السفلي (المانديبولا)',
      en: 'Mandible (Lower Jaw)',
    },
    maxillarySinus: {
      fr: 'Sinus maxillaire',
      ar: 'الجيب الفكي العلوي',
      en: 'Maxillary sinus',
    },

    // Tooth Types & Categories
    toothCategoryIncisors: {
      fr: 'Incisives',
      ar: 'القواطع',
      en: 'Incisors',
    },
    toothCategoryCanines: {
      fr: 'Canines',
      ar: 'الأنياب',
      en: 'Canines',
    },
    toothCategoryPremolars: {
      fr: 'Prémolaires',
      ar: 'الضواحك',
      en: 'Premolars',
    },
    toothCategoryMolars: {
      fr: 'Molaires',
      ar: 'الأضراس',
      en: 'Molars',
    },
    upperArch: {
      fr: 'Arcade Supérieure (Maxillaire)',
      ar: 'الفك العلوي (الماكسيلا)',
      en: 'Upper Arch (Maxillary)',
    },
    lowerArch: {
      fr: 'Arcade Inférieure (Mandibulaire)',
      ar: 'الفك السفلي (المانديبولا)',
      en: 'Lower Arch (Mandibular)',
    },

    // Viewing Modes
    viewModeSurface: {
      fr: 'Surface',
      ar: 'سطحي',
      en: 'Surface',
    },
    viewModeCrossSection: {
      fr: 'Coupe',
      ar: 'مقطع',
      en: 'Cross Section',
    },
    viewModeXray: {
      fr: 'Radiographie',
      ar: 'أشعة سينية',
      en: 'X-Ray',
    },
    viewModeTransparent: {
      fr: 'Transparence',
      ar: 'شفافية',
      en: 'Transparent',
    },
    viewModeFull: {
      fr: 'Full',
      ar: 'كامل',
      en: 'Full',
    },
    viewModeCross: {
      fr: 'Cross',
      ar: 'مقطع',
      en: 'Cross',
    },
    viewModePulp: {
      fr: 'Pulp',
      ar: 'لب',
      en: 'Pulp',
    },

    // Odontogram Surfaces & Conditions
    surfaceVestibular: {
      fr: 'Vestibulaire (Extérieur)',
      ar: 'دهليزي (السطح الخارجي)',
      en: 'Vestibular (Buccal/Labial)',
    },
    surfacePalatal: {
      fr: 'Palatine (Intérieur Haut)',
      ar: 'حنكي (السطح الداخلي العلوي)',
      en: 'Palatal (Upper Inner)',
    },
    surfaceLingual: {
      fr: 'Linguale (Intérieur Bas)',
      ar: 'لساني (السطح الداخلي السفلي)',
      en: 'Lingual (Lower Inner)',
    },
    surfaceMesial: {
      fr: 'Mésiale (Face avant)',
      ar: 'إنسي (الوجه الأمامي المجاور)',
      en: 'Mesial (Front Face)',
    },
    surfaceDistal: {
      fr: 'Distale (Face arrière)',
      ar: 'وحشي (الوجه الخلفي المجاور)',
      en: 'Distal (Rear Face)',
    },
    surfaceOcclusal: {
      fr: 'Occlusale / Incisive (Mastication)',
      ar: 'إطباقي / قاطع (سطح المضغ والعض)',
      en: 'Occlusal / Incisal',
    },
    conditionHealthy: {
      fr: 'Dent Saine',
      ar: 'سن سليم',
      en: 'Healthy Tooth',
    },
    conditionCaries: {
      fr: 'Carie / Lésion active',
      ar: 'تسوس / نخر نشط',
      en: 'Active Cavity / Caries',
    },
    conditionRestoration: {
      fr: 'Obturation / Composite existant',
      ar: 'حشوة تجميلية موجودة',
      en: 'Restoration / Filling',
    },
    conditionEndo: {
      fr: 'Traitement de canal (Dévitalisée)',
      ar: 'معالجة لبية (عصب مسحوب)',
      en: 'Root Canal Treated',
    },
    conditionCrown: {
      fr: 'Couronne céramique',
      ar: 'تاج خزفي / تلبيسة',
      en: 'Ceramic Crown',
    },
    conditionImplant: {
      fr: 'Implant ostéo-intégré',
      ar: 'زرعة سنية في العظم',
      en: 'Dental Implant',
    },
    conditionMissing: {
      fr: 'Dent Absente / Édentement',
      ar: 'سن مفقود / فراغ',
      en: 'Missing Tooth',
    },
    conditionToExtract: {
      fr: 'Indication d\'extraction',
      ar: 'يحتاج للخلع الجراحي',
      en: 'Indicated for Extraction',
    },

    // Doctors Carousel & Profile
    ourDoctorsTitle: {
      fr: 'Nos Chirurgiens-Dentistes',
      ar: 'أطباؤنا لجراحة الأسنان',
      en: 'Our Dental Surgeons',
    },
    ourDoctorsSubtitle: {
      fr: 'Une équipe complémentaire et attentive dédiée à l\'excellence clinique, à la douceur des soins et à la préservation naturelle de vos dents.',
      ar: 'فريق طبي متكامل ومكرس للتميز السريري، وعلاجات لطيفة والحفاظ الطبيعي على أسنانكم.',
      en: 'A complementary team dedicated to clinical excellence, gentle care, and natural tooth preservation.',
    },
    slideNext: {
      fr: 'Praticien Suivant',
      ar: 'الطبيب التالي',
      en: 'Next Doctor',
    },
    slidePrev: {
      fr: 'Praticien Précédent',
      ar: 'الطبيب السابق',
      en: 'Previous Doctor',
    },
    consultDoctorBtn: {
      fr: 'Consulter avec ce praticien',
      ar: 'حجز استشارة مع هذا الطبيب',
      en: 'Consult with this doctor',
    },

    // Map & Location
    liveMapTitle: {
      fr: 'Localisation & Accès au Cabinet',
      ar: 'الموقع وسهولة الوصول إلى العيادة',
      en: 'Real-Time Location & Clinic Access',
    },
    liveMapSubtitle: {
      fr: 'Situé au cœur de Demo City, accessible en moins de 10 minutes depuis Rabat, Harhoura et Skhirat.',
      ar: 'يقع في قلب مدينة مدينة تجريبية، على بُعد أقل من 10 دقائق من الرباط والهرهورة والصخيرات.',
      en: 'Located in the heart of Demo City, accessible in under 10 minutes from Rabat, Harhoura, and Skhirat.',
    },
    openStatusNow: {
      fr: 'Cabinet Ouvert Actuellement',
      ar: 'العيادة مفتوحة حالياً للخدمة',
      en: 'Clinic Currently Open',
    },
    closedStatusNow: {
      fr: 'Cabinet Fermé Actuellement',
      ar: 'العيادة مغلقة حالياً',
      en: 'Clinic Currently Closed',
    },
    openGoogleMaps: {
      fr: 'Ouvrir sur Google Maps',
      ar: 'فتح في خرائط جوجل',
      en: 'Open in Google Maps',
    },
    openWaze: {
      fr: 'Naviguer avec Waze',
      ar: 'الملاحة عبر تطبيق ويز',
      en: 'Navigate with Waze',
    },

    // Emergency Triage
    emergencyTitle: {
      fr: 'Besoin d\'une prise en charge d\'urgence ?',
      ar: 'هل تعاني من ألم أسنان حاد أو حالة طارئة؟',
      en: 'Need emergency dental care?',
    },
    emergencyDesc: {
      fr: 'Rage de dent aiguë, gonflement, dent expulsée ou traumatisme : notre ligne WhatsApp prioritaire vous guide immédiatement.',
      ar: 'ألم حاد مفاجئ، انتفاخ، كسر سن أو سقوط سن بالكامل: خط الواتساب المباشر يوجهكم فوراً.',
      en: 'Acute toothache, swelling, knocked-out tooth, or trauma: our priority WhatsApp line guides you immediately.',
    },

    // Atlas & Education Navigation
    atlasTitle: {
      fr: 'Atlas Dentaire 3D Interactif',
      ar: 'أطلس الأسنان التفاعلي ثلاثي الأبعاد',
      en: '3D Interactive Dental Atlas',
    },
    atlasSubtitle: {
      fr: 'Explorez l\'anatomie des 32 dents, visualisez les pathologies et comprenez vos traitements grâce à nos modèles 3D biomédicaux.',
      ar: 'استكشف تشريح الـ 32 سناً، شاهد الأمراض في مراحلها، وافهم خطط علاجك عبر نماذج طبية تفاعلية ثلاثية الأبعاد.',
      en: 'Explore the anatomy of 32 teeth, visualize pathologies, and understand your treatments using biomedical 3D models.',
    },
    tabAll: {
      fr: 'Tous les sujets',
      ar: 'جميع المواضيع',
      en: 'All Topics',
    },
    anatomy: {
      fr: 'Anatomie',
      ar: 'التشريح والتركيب',
      en: 'Anatomy',
    },
    lessons: {
      fr: 'Leçons cliniques',
      ar: 'الدروس السريرية',
      en: 'Clinical Lessons',
    },
    conditions: {
      fr: 'Pathologies & Caries',
      ar: 'الأمراض والتسوس',
      en: 'Conditions',
    },
    treatments: {
      fr: 'Traitements & Implants',
      ar: 'العلاجات والزراعة',
      en: 'Treatments',
    },
    prevention: {
      fr: 'Prévention & Hygiène',
      ar: 'الوقاية ونظافة الفم',
      en: 'Prevention',
    },
    pedodontics: {
      fr: 'Dentisterie Pédiatrique',
      ar: 'طب أسنان الأطفال',
      en: 'Pedodontics',
    },
    emergencies: {
      fr: 'Urgences Dentaires',
      ar: 'طوارئ وإسعافات الأسنان',
      en: 'Emergencies',
    },
    dictionary: {
      fr: 'Dictionnaire A-Z',
      ar: 'المعجم الطبي A-Z',
      en: 'Dictionary A-Z',
    },
    tooth: {
      fr: 'Dent',
      ar: 'سن',
      en: 'Tooth',
    },
    exploreIn3D: {
      fr: 'Explorer en 3D',
      ar: 'استكشاف ثلاثي الأبعاد',
      en: 'Explore in 3D',
    },
    clinicalRelevance: {
      fr: 'Pertinence Clinique',
      ar: 'الأهمية السريرية والطبية',
      en: 'Clinical Relevance',
    },
    clinicalAdvice: {
      fr: 'Conseil du Praticien',
      ar: 'نصيحة طبيب الأسنان',
      en: 'Dentist\'s Advice',
    },
    whatIsHappening: {
      fr: 'Ce que vous observez',
      ar: 'ما تشاهده في النموذج',
      en: 'What you observe',
    },
    whyItMatters: {
      fr: 'Pourquoi c\'est important',
      ar: 'لماذا هذا الأمر مهم لصحتك',
      en: 'Why it matters',
    },
    quizTitle: {
      fr: 'Validation des connaissances',
      ar: 'اختبار ترسيخ الفهم السريري',
      en: 'Knowledge Check',
    },
    relatedTopics: {
      fr: 'Sujets et Leçons Associés',
      ar: 'مواضيع ودروس مرتبطة',
      en: 'Related Topics',
    },

    // Tools Hub
    toolsTitle: {
      fr: 'Outils Médicaux & Calculateurs Dentaires',
      ar: 'الأدوات الطبية وحاسبات صحة الفم والأسنان',
      en: 'Medical Tools & Dental Calculators',
    },
    toolsSubtitle: {
      fr: 'Odontogramme interactif, évaluateur de symptômes, guide d\'urgence et chronomètre de brossage pour vous accompagner.',
      ar: 'مخطط الأسنان السريري، فاحص الأعراض، دليل الطوارئ الفوري، ومؤقت التنظيف الذكي لمرافقتكم.',
      en: 'Interactive odontogram, symptom analyzer, emergency triage guide, and smart brushing timer to assist your oral care.',
    },
    toolOdontogram: {
      fr: 'Odontogramme Interactif 32 Dents',
      ar: 'مخطط الأسنان السريري (32 سناً)',
      en: 'Interactive 32-Tooth Odontogram',
    },
    toolSymptomChecker: {
      fr: 'Analyseur de Symptômes',
      ar: 'فاحص الأعراض السريرية',
      en: 'Symptom Checker',
    },
    toolEmergencyGuide: {
      fr: 'Protocole d\'Urgence',
      ar: 'بروتوكول الإسعافات الطارئة',
      en: 'Emergency Protocol',
    },
    toolBrushingTimer: {
      fr: 'Chronomètre de Brossage 2 Min',
      ar: 'مؤقت تنظيف الأسنان (دقيقتان)',
      en: '2-Minute Brushing Timer',
    },
    toolEruptionTimeline: {
      fr: 'Chronologie d\'Éruption Dentaire',
      ar: 'جدول بزوغ ونمو الأسنان',
      en: 'Tooth Eruption Timeline',
    },

    // Accessibility Labels
    ariaOpenMenu: {
      fr: 'Ouvrir le menu de navigation',
      ar: 'فتح قائمة التنقل',
      en: 'Open navigation menu',
    },
    ariaCloseMenu: {
      fr: 'Fermer le menu',
      ar: 'إغلاق القائمة',
      en: 'Close menu',
    },
    ariaSelectLang: {
      fr: 'Changer la langue d\'affichage',
      ar: 'تغيير لغة العرض',
      en: 'Change display language',
    },
    ariaSearch: {
      fr: 'Rechercher dans l\'Atlas et les services',
      ar: 'بحث في الأطلس والخدمات',
      en: 'Search Atlas and services',
    },
    ariaThemeToggle: {
      fr: 'Basculer entre mode sombre et clair',
      ar: 'تبديل المظهر الداكن والفاتح',
      en: 'Toggle dark and light theme',
    },
    ariaThemeLight: {
      fr: 'Passer en mode clair',
      ar: 'تفعيل المظهر الفاتح',
      en: 'Switch to light mode',
    },
    ariaThemeDark: {
      fr: 'Passer en mode sombre',
      ar: 'تفعيل المظهر الداكن',
      en: 'Switch to dark mode',
    },
    ariaWhatsAppCTA: {
      fr: 'Contacter Demo sur WhatsApp',
      ar: 'تواصل مع Demo عبر واتساب',
      en: 'Contact Demo on WhatsApp',
    },
    dragToRotateHint: {
      fr: 'Glisser pour orbiter • Molette pour zoomer',
      ar: 'اسحب للتدوير بالماوس أو اللمس • العجلة للتكبير',
      en: 'Drag to orbit • Scroll to zoom',
    },
    copyrightText: {
      fr: 'Demo • Informations fictives de démonstration',
      ar: 'Demo • جميع الحقوق محفوظة • الأطباء وشركاؤه',
      en: 'Demo • Sample demonstration information',
    },
    // Home Page Specific Translations
    heroDescription: {
      fr: 'Une approche humaine et rigoureuse de la chirurgie dentaire moderne. Accédez à notre atlas interactif en 3D, maîtrisez vos soins et consultez notre équipe médicale en toute confiance.',
      ar: 'مقاربة طبية إنسانية ودقيقة لطب وجراحة الأسنان الحديثة. استكشف أطلسنا التفاعلي ثلاثي الأبعاد، وتعرف على خطط علاجك بثقة تامة.',
      en: 'A compassionate and rigorous approach to modern dental surgery. Explore our interactive 3D dental atlas and consult our medical team with confidence.',
    },
    statPratitioners: {
      fr: 'Praticiens Complémentaires',
      ar: 'أطباء أسنان مكملون بتخصصات دقيقة',
      en: 'Complementary Practitioners',
    },
    stat3DTools: {
      fr: 'Anatomie & Outils Interactifs 3D',
      ar: 'أدوات تفاعلية وتشريح ثلاثي الأبعاد',
      en: '3D Anatomy & Interactive Tools',
    },
    statTransparency: {
      fr: 'Transparence & Rigueur Médicale',
      ar: 'شفافية طبية واضحة 100%',
      en: '100% Medical Transparency',
    },
    heroToothTitle: {
      fr: 'Molaire Permanente Humaine',
      ar: 'الضرس الدائم البشري',
      en: 'Human Permanent Molar',
    },
    heroToothCta: {
      fr: 'Explorer l\'Atlas Dentaire 3D',
      ar: 'استكشاف أطلس الأسنان 3D',
      en: 'Explore 3D Dental Atlas',
    },
    visualTechBadge: {
      fr: 'Technologie Visuelle',
      ar: 'تقنية بصرية متقدمة',
      en: 'Visual Technology',
    },
    visualPoint1: {
      fr: 'Visualisation des tubuli de la dentine et de la pulpe',
      ar: 'رؤية دقيقة لأنابيب العاج وحجرة العصب',
      en: 'Visualization of dentin tubules and pulp chamber',
    },
    visualPoint2: {
      fr: 'Simulation de coupe anatomique en direct',
      ar: 'محاكاة تفاعلية فورية للمقطع العرضي الداخلي',
      en: 'Real-time anatomical cross-section simulation',
    },
    visualPoint3: {
      fr: 'Liaison directe avec nos leçons cliniques 3D',
      ar: 'ربط مباشر مع الدروس السريرية المفصلة',
      en: 'Direct link to detailed 3D clinical lessons',
    },
    open3DWorkshop: {
      fr: 'Ouvrir les Outils 3D Interactifs',
      ar: 'فتح ورشة الأدوات ثلاثية الأبعاد',
      en: 'Open 3D Interactive Tools',
    },
    cardStagesCaries: {
      fr: '6 Stades Cliniques',
      ar: '6 مراحل سريرية',
      en: '6 Clinical Stages',
    },
    cardTitleCaries: {
      fr: 'Progression de la Carie',
      ar: 'تطور تسوس السن',
      en: 'Tooth Decay Progression',
    },
    cardDescCaries: {
      fr: 'De la déminéralisation de l\'émail à la nécrose pulpaire et l\'abcès péri-apical.',
      ar: 'من فقدان تمعدن المينا الأولي إلى التهاب العصب والخراج حول الذروة.',
      en: 'From early enamel demineralization to pulp necrosis and periapical abscess.',
    },
    cardStagesEndo: {
      fr: '10 Étapes Endodontiques',
      ar: '10 مراحل علاجية',
      en: '10 Endodontic Steps',
    },
    cardTitleEndo: {
      fr: 'Traitement de Canal',
      ar: 'معالجة العصب وقنوات الجذور',
      en: 'Root Canal Treatment',
    },
    cardDescEndo: {
      fr: 'Instrumentation canalaire NiTi mécanisée, désinfection et obturation chaude 3D.',
      ar: 'تنظيف قنوات العصب بأجهزة روتاري حديثة، تعقيم دقيق وحشو حراري ثلاثي الأبعاد.',
      en: 'Mechanized NiTi canal shaping, root disinfection, and 3D warm obturation.',
    },
    cardStagesImplant: {
      fr: 'Titane & Zircone',
      ar: 'تيتانيوم وزركونيوم',
      en: 'Titanium & Zirconia',
    },
    cardTitleImplant: {
      fr: 'Implantologie & Prothèses',
      ar: 'زراعة الأسنان والتركيبات',
      en: 'Dental Implants & Prosthetics',
    },
    cardDescImplant: {
      fr: 'Ostéo-intégration du pas de vis, pilier trans-gingival et couronnes céramiques.',
      ar: 'الالتحام العظمي لزرعة التيتانيوم، الدعامة اللثوية والتيجان الخزفية التجميلية.',
      en: 'Screw osseointegration, trans-gingival abutment, and ceramic crowns.',
    },
    cardStagesPerio: {
      fr: 'Sondage Parodontal',
      ar: 'فحص اللثة والعظم',
      en: 'Periodontal Probing',
    },
    cardTitlePerio: {
      fr: 'Gencives & Parodontite',
      ar: 'أمراض اللثة والعظم الداعم',
      en: 'Gum Disease & Periodontitis',
    },
    cardDescPerio: {
      fr: 'Visualisation des poches infra-osseuses, du tartre et de la résorption osseuse.',
      ar: 'رؤية الجيوب اللثوية، تراكم الجير وانحسار العظم حول جذور الأسنان.',
      en: 'Visualization of infra-bony pockets, calculus, and alveolar bone resorption.',
    },
    launchSimulator: {
      fr: 'Lancer le simulateur',
      ar: 'تشغيل المحاكي 3D',
      en: 'Launch 3D Simulator',
    },
    jawScannerBadge: {
      fr: 'Scanner 3D Anatomique',
      ar: 'ماسح تشريحي ثلاثي الأبعاد',
      en: '3D Anatomical Scanner',
    },
    jawScannerTitle: {
      fr: 'Exploration de la Mâchoire & de l\'Arcade Dentaire',
      ar: 'استكشاف الفك والهيكل السني الكامل',
      en: 'Jawline & Dental Arch Exploration',
    },
    jawScannerSubtitle: {
      fr: 'Visualisez l\'os mandibulaire, la corticale alvéolaire et l\'implantation tridimensionnelle de vos 32 dents en temps réel.',
      ar: 'شاهد عظم الفك السفلي، القناة العصبية وغرس الـ 32 سناً في نموذج ثلاثي الأبعاد في الوقت الفعلي.',
      en: 'Visualize mandibular bone, alveolar cortex, and 3D positioning of all 32 teeth in real-time.',
    },
    homeDomainsTitle: {
      fr: 'Nos Domaines d\'Enseignement & Soins',
      ar: 'مجالات التعليم الطبي والعلاجات',
      en: 'Educational Fields & Dental Care',
    },
    homeExploreAllLessons: {
      fr: 'Explorer toutes les leçons 3D',
      ar: 'استكشاف جميع الدروس ثلاثية الأبعاد',
      en: 'Explore all 3D lessons',
    },
    emergencyBannerBadge: {
      fr: 'Urgences Dentaires Demo City',
      ar: 'طوارئ الأسنان في مدينة تجريبية',
      en: 'Demo City Dental Emergencies',
    },

    // Atlas & 3D Lessons
    exploreFreeMode: {
      fr: 'Mode Exploration Libre',
      ar: 'وضع الاستكشاف الحر',
      en: 'Free Exploration Mode',
    },
    guided3DExperience: {
      fr: 'Démarrer l\'Expérience 3D Guidée',
      ar: 'بدء التجربة ثلاثية الأبعاد الموجهة',
      en: 'Start Guided 3D Experience',
    },
    searchLessonPlaceholder: {
      fr: 'Rechercher une leçon, un organe, une dent...',
      ar: 'ابحث عن درس، عضو، سن أو مصطلح طبي...',
      en: 'Search for a lesson, organ, tooth...',
    },
    clearSearch: {
      fr: 'Effacer la recherche',
      ar: 'مسح البحث',
      en: 'Clear search',
    },
    allLessons: {
      fr: 'Toutes les Leçons',
      ar: 'جميع الدروس',
      en: 'All Lessons',
    },
    toothAnatomy: {
      fr: 'Anatomie Dentaire',
      ar: 'تشريح السن',
      en: 'Tooth Anatomy',
    },
    dentition32: {
      fr: 'Dentition & 32 Dents',
      ar: 'الأسنان والـ 32 سناً',
      en: 'Dentition & 32 Teeth',
    },
    pathologiesLesions: {
      fr: 'Pathologies & Lésions',
      ar: 'الأمراض والتسوس',
      en: 'Conditions & Lesions',
    },
    treatmentsSurgeries: {
      fr: 'Traitements & Chirurgies',
      ar: 'العلاجات والجراحة',
      en: 'Treatments & Surgeries',
    },
    maxillofacial: {
      fr: 'Mâchoires & Maxillo-Facial',
      ar: 'الفك والهيكل الوجهي',
      en: 'Jaw & Maxillofacial',
    },
    interactive3DAtlasTitle: {
      fr: 'Atlas Anatomique 3D Interactif • Demo',
      ar: 'الأطلس التشريحي التفاعلي 3D • Demo',
      en: 'Interactive 3D Anatomical Atlas • Demo',
    },
    atlasHeroSubtitle: {
      fr: 'Apprenez l\'odontologie en interagissant directement avec l\'anatomie tridimensionnelle. Dissections guidées, coupes transversales et simulations cliniques de pointe.',
      ar: 'تعلم طب الأسنان من خلال التفاعل المباشر مع النماذج ثلاثية الأبعاد. مقاطع عرضية دقيقة ومحاكاة سريرية متطورة.',
      en: 'Learn dentistry by interacting directly with 3D anatomy. Guided cross-sections and state-of-the-art clinical simulations.',
    },
    filterByCategory: {
      fr: 'Filtrer par catégorie',
      ar: 'تصفية حسب الفئة',
      en: 'Filter by category',
    },

    // Tools Hub
    toolsLabTitle: {
      fr: 'Laboratoire d\'Éducation Thérapeutique',
      ar: 'مختبر التوعية والتعليم العلاجي',
      en: 'Therapeutic Education Lab',
    },
    toolsHubSubtitle: {
      fr: 'Explorez l\'anatomie de votre bouche, comprenez vos symptômes et préparez vos soins grâce à nos simulateurs pédagogiques exclusifs du Demo.',
      ar: 'استكشف تشريح فمك، وافهم أعراضك واستعد لزيارتك مع محاكيات مركز دالي التفاعلية.',
      en: 'Explore oral anatomy, understand symptoms, and prepare for treatment with exclusive interactive simulators from Demo.',
    },
    clinicalQuestionCta: {
      fr: 'Une question clinique ?',
      ar: 'هل لديك سؤال طبي؟',
      en: 'Have a clinical question?',
    },
    toolOdontogramTab: {
      fr: 'Explorateur 32 Dents & Odontogramme',
      ar: 'مستكشف الـ 32 سناً ومخطط الأسنان',
      en: '32-Tooth Explorer & Odontogram',
    },
    toolSymptomTab: {
      fr: 'Analyseur de Symptômes',
      ar: 'محلل الأعراض الذكي',
      en: 'Symptom Checker',
    },
    toolEmergencyTab: {
      fr: 'Guide des Urgences',
      ar: 'دليل الطوارئ العاجلة',
      en: 'Emergency Guide',
    },
    toolTimerTab: {
      fr: 'Chronomètre 2 Min',
      ar: 'مؤقت تنظيف الأسنان (دقيقتان)',
      en: '2-Min Brushing Timer',
    },
    toolTimelineTab: {
      fr: 'Chronologie Éruption',
      ar: 'الجدول الزمني لبزوغ الأسنان',
      en: 'Eruption Timeline',
    },
    toolConverterTab: {
      fr: 'Convertisseur FDI/USA',
      ar: 'محول ترقيم الأسنان FDI/USA',
      en: 'FDI/Universal Converter',
    },
    fdiClinicalStandard: {
      fr: 'Standard Clinique International FDI',
      ar: 'المعيار السريري الدولي للاتحاد العالمي لطب الأسنان (FDI)',
      en: 'International FDI Clinical Standard',
    },
    odontogramTitle: {
      fr: 'Explorateur Clinique des 32 Dents & Odontogramme Interactif',
      ar: 'المستكشف السريري لـ 32 سناً ومخطط الأسنان التفاعلي',
      en: 'Clinical 32-Tooth Explorer & Interactive Odontogram',
    },
    odontogramSubtitle: {
      fr: 'Cartographie 2D des 32 dents permanentes avec interactions multi-surfaces (vestibulaire, linguale, occlusale, mésiale, distale), simulation d\'états pathologiques et aperçu 3D instantané de la dent sélectionnée.',
      ar: 'خريطة متكاملة لـ 32 سناً مع أسطح تفاعلية ومحاكاة الحالات المرضية ومعاينة ثلاثية الأبعاد فورية.',
      en: 'Interactive 32-tooth map with multi-surface interaction, pathology simulation, and instant 3D preview.',
    },

    // Doctor & Clinic Pages
    clinicalDirection: {
      fr: 'Direction Clinique & Chirurgiens-Dentistes',
      ar: 'الإدارة السريرية وجراحو الأسنان',
      en: 'Clinical Leadership & Dental Surgeons',
    },
    doctorsPageTitle: {
      fr: 'Les Praticiens du Demo',
      ar: 'أطباء Demo',
      en: 'Practitioners of Demo',
    },
    doctorsPageSubtitle: {
      fr: 'Une équipe complémentaire et dévouée réunissant la précision chirurgicale, l\'implantologie, l\'orthodontie invisible et la douceur des soins pédiatriques.',
      ar: 'فريق طبي متكامل يجمع بين الدقة الجراحية وزراعة الأسنان والتقويم الشفاف وطب أسنان الأطفال.',
      en: 'A complementary team bringing together surgical precision, implantology, clear aligner orthodontics, and gentle pediatric care.',
    },
    interactiveSliderTitle: {
      fr: 'Diaporama Interactif des Médecins',
      ar: 'عرض تفاعلي للأطباء',
      en: 'Interactive Doctor Showcase',
    },
    scrollPratitionersHint: {
      fr: 'Faites défiler pour découvrir chaque praticien',
      ar: 'مرر للتعرف على تخصصات كل طبيب',
      en: 'Scroll to discover each practitioner',
    },
    sharedVisionTitle: {
      fr: 'Deux Praticiens, Une Même Vision Médicale',
      ar: 'طبيبان برؤية طبية واحدة',
      en: 'Two Practitioners, One Shared Medical Vision',
    },
    doctorYoussefRole: {
      fr: 'Chirurgien-Dentiste Fondateur',
      ar: 'جراح أسنان ومؤسس المركز',
      en: 'Founder & Dental Surgeon',
    },
    doctorYoussefBio: {
      fr: 'Spécialisé en implantologie orale, parodontologie, reconstruction osseuse et esthétique du sourire. Il privilégie les protocoles de micro-dentisterie conservatrice sous grossissement optique.',
      ar: 'متخصص في زراعة الأسنان، أمراض وجراحة اللثة، الترميم العظمي وتجميل الابتسامة باستخدام تقنيات التكبير البصري الدقيقة.',
      en: 'Specialized in oral implantology, periodontics, bone grafting, and aesthetic dentistry using microscopic optical magnification.',
    },
    doctorKenzaRole: {
      fr: 'Chirurgien-Dentiste Associée',
      ar: 'جراحة أسنان شريكة',
      en: 'Associate Dental Surgeon',
    },
    doctorKenzaBio: {
      fr: 'Dédiée à l\'orthodontie moderne par aligneurs invisibles, à la pédodontie préventive et à l\'approche sans anxiété pour enfants et adultes.',
      ar: 'متخصصة في تقويم الأسنان الشفاف، طب أسنان الأطفال الوقائي وعلاج الخوف والقلق السني للأطفال والبالغين.',
      en: 'Dedicated to modern clear aligner orthodontics, preventive pediatric dentistry, and anxiety-free patient care.',
    },
    clinicPageTitle: {
      fr: 'Le Demo à Demo City',
      ar: 'Demo في مدينة تجريبية',
      en: 'Demo in Demo City',
    },
    clinicPageSubtitle: {
      fr: 'Plateau technique de dernière génération conçu pour la sécurité, l\'asepsie chirurgicale et le confort absolu de chaque patient.',
      ar: 'منصة تقنية متطورة مجهزة بأحدث معايير التعقيم الجراحي والراحة التامة للمرضى.',
      en: 'State-of-the-art facility designed for safety, surgical sterility, and patient comfort.',
    },
    accessScheduleTitle: {
      fr: 'Accès & Horaires d\'Ouverture',
      ar: 'الموقع ومواعيد العمل',
      en: 'Location & Opening Hours',
    },
    contactPageTitle: {
      fr: 'Contactez le Demo',
      ar: 'تواصل مع Demo',
      en: 'Contact Demo',
    },
    contactPageSubtitle: {
      fr: 'Nous sommes à votre disposition pour vos rendez-vous, vos questions de soins et la prise en charge de vos urgences.',
      ar: 'نحن في خدمتكم لحجز المواعيد، الإجابة عن استفساراتكم والتعامل الفوري مع الحالات الطارئة.',
      en: 'We are here to help you with appointments, treatment questions, and urgent dental care.',
    },

    // Search & Modals
    searchPlaceholderModal: {
      fr: 'Rechercher une pathologie, un symptôme, un traitement...',
      ar: 'ابحث عن حالة مرضية، عرض أو علاج...',
      en: 'Search for a condition, symptom, treatment...',
    },
    suggestedSearches: {
      fr: 'Recherches suggérées',
      ar: 'عمليات بحث مقترحة',
      en: 'Suggested searches',
    },
    quickNavigation: {
      fr: 'Navigation rapide :',
      ar: 'تنقل سريع:',
      en: 'Quick navigation:',
    },
    pressEscToClose: {
      fr: 'Échap',
      ar: 'خروج',
      en: 'Esc',
    },
    noResultsFound: {
      fr: 'Aucun résultat trouvé pour cette recherche.',
      ar: 'لم يتم العثور على نتائج لهذا البحث.',
      en: 'No results found for this search.',
    },

    footerTaglineDesc: {
      fr: 'Plateforme d\'excellence et de pédagogie bucco-dentaire du Demo. La confiance commence par la compréhension de votre santé dentaire.',
      ar: 'منصة التميز والتوعية بصحة الفم والأسنان لDemo. تبدأ الثقة بفهم صحة أسنانكم بدقة.',
      en: 'Oral health excellence and educational platform of Demo. Confidence begins with understanding your dental health.',
    },
    footerKnowledgeChain: {
      fr: 'Connaissance → Compréhension → Confiance',
      ar: 'المعرفة ← الفهم ← الثقة',
      en: 'Knowledge → Understanding → Confidence',
    },
    footerMedicalDisclaimerTitle: {
      fr: 'Avertissement Médical Légal :',
      ar: 'تنبيه طبي قانوني:',
      en: 'Legal Medical Disclaimer:',
    },
    footerMedicalDisclaimer: {
      fr: 'Les informations, outils et modèles 3D publiés sur cette plateforme sont mis à disposition à titre purement éducatif et préventif sous la supervision clinique de l\'équipe du Demo. Ils ne constituent en aucun cas une téléconsultation ou un diagnostic médical personnalisé et ne sauraient se substituer à un examen clinique et radiologique approfondi réalisé au cabinet.',
      ar: 'المعلومات، الأدوات والنماذج ثلاثية الأبعاد المنشورة على هذه المنصة مقدمة لأغراض التوعية والتعليم الوقائي تحت إشراف أطباء Demo. وهي لا تغني عن الفحص السريري والشعاعي الشامل داخل العيادة.',
      en: 'The information, tools, and 3D models provided on this platform are for educational and preventive purposes under the clinical supervision of Demo. They do not replace a full in-person clinical and radiological examination at the clinic.',
    },
    footerLegalNotice: {
      fr: 'Mentions Légales & Déontologie',
      ar: 'الإشعار القانوني وأخلاقيات المهنة',
      en: 'Legal Notice & Ethics',
    },
    footerAccessMap: {
      fr: 'Plan d\'Accès Demo City',
      ar: 'خريطة الوصول في مدينة تجريبية',
      en: 'Access Map Demo City',
    },

    // Atlas detailed UI
    'atlas.modeGuided': {
      fr: 'Mode Guidé',
      ar: 'الوضع الموجه',
      en: 'Guided Mode',
    },
    'atlas.modeExplore': {
      fr: 'Exploration',
      ar: 'وضع الاستكشاف',
      en: 'Explore Mode',
    },
    'atlas.quiz': {
      fr: 'Quiz',
      ar: 'اختبار',
      en: 'Quiz',
    },
    'atlas.minTraining': {
      fr: 'min de formation',
      ar: 'دقيقة تكوين',
      en: 'min training',
    },
    'atlas.level': {
      fr: 'Niveau',
      ar: 'المستوى',
      en: 'Level',
    },
    'atlas.camFront': {
      fr: 'Face',
      ar: 'الأمام',
      en: 'Front',
    },
    'atlas.camProfile': {
      fr: 'Profil',
      ar: 'الجانب',
      en: 'Profile',
    },
    'atlas.camBack': {
      fr: 'Arrière',
      ar: 'الخلف',
      en: 'Back',
    },
    'atlas.camOcclusal': {
      fr: 'Occlusal',
      ar: 'الإطباق',
      en: 'Occlusal',
    },
    'atlas.stage': {
      fr: 'Étape',
      ar: 'المرحلة',
      en: 'Stage',
    },
    'atlas.whatIsHappening': {
      fr: 'Ce que vous voyez',
      ar: 'ما تراه حالياً',
      en: 'What you see',
    },
    'atlas.whyItMatters': {
      fr: "Pourquoi c'est important",
      ar: 'لماذا هذا مهم',
      en: 'Why it matters',
    },
    'atlas.prevStage': {
      fr: 'Étape précédente',
      ar: 'المرحلة السابقة',
      en: 'Previous stage',
    },
    'atlas.nextStage': {
      fr: 'Étape suivante',
      ar: 'المرحلة التالية',
      en: 'Next stage',
    },
    'atlas.finishLesson': {
      fr: 'Terminer la leçon',
      ar: 'إنهاء الدرس',
      en: 'Finish lesson',
    },
    'atlas.learningObjectives': {
      fr: 'Objectifs Pédagogiques',
      ar: 'الأهداف التعليمية',
      en: 'Learning Objectives',
    },
    'atlas.clinicalRelevance': {
      fr: 'Pertinence Clinique',
      ar: 'الأهمية السريرية',
      en: 'Clinical Relevance',
    },
    'atlas.didYouKnow': {
      fr: 'Le Saviez-Vous ?',
      ar: 'هل كنت تعلم؟',
      en: 'Did You Know?',
    },
    'atlas.quizEvaluation': {
      fr: 'Quiz & Auto-Évaluation',
      ar: 'اختبار وتقييم ذاتي',
      en: 'Quiz & Self-Assessment',
    },
    'atlas.submitAnswers': {
      fr: 'Valider mes réponses',
      ar: 'تأكيد إجاباتى',
      en: 'Submit Answers',
    },
    'atlas.yourScore': {
      fr: 'Votre Score',
      ar: 'نتيجتك',
      en: 'Your Score',
    },
    'atlas.relatedLessons': {
      fr: 'Leçons Connexes',
      ar: 'دروس ذات صلة',
      en: 'Related Lessons',
    },
    'atlas.relatedArticles': {
      fr: 'Articles Recommandés',
      ar: 'مقالات موصى بها',
      en: 'Recommended Articles',
    },
    'atlas.keyTakeaways': {
      fr: 'Résumé Clé',
      ar: 'النقاط الرئيسية',
      en: 'Key Takeaways',
    },
    'atlas.bookAfterLesson': {
      fr: 'Prendre RDV après cette leçon',
      ar: 'حجز موعد بعد هذا الدرس',
      en: 'Book Appointment After Lesson',
    },
    'atlas.backToAtlas': {
      fr: "Retour à l'Atlas",
      ar: 'العودة إلى الأطلس',
      en: 'Back to Atlas',
    },
    'atlas.guided3DExperience': {
      fr: 'Expérience 3D Guidée',
      ar: 'تجربة ثلاثية الأبعاد موجهة',
      en: 'Guided 3D Experience',
    },
    'atlas.exploreFreeMode': {
      fr: 'Mode Exploration Libre',
      ar: 'وضع الاستكشاف الحر',
      en: 'Free Explore Mode',
    },
    clickToStart3D: {
      fr: "Cliquez sur une leçon pour lancer l'expérience 3D interactive",
      ar: 'انقر على أي درس لبدء التجربة ثلاثية الأبعاد التفاعلية',
      en: 'Click a lesson to launch interactive 3D experience',
    },

    // Advanced Odontogram
    permanent32: {
      fr: '32 Dents Permanentes',
      ar: '32 سن دائم',
      en: '32 Permanent Teeth',
    },
    btnResetAll: {
      fr: 'Réinitialiser',
      ar: 'إعادة ضبط',
      en: 'Reset All',
    },
    activeToolLabel: {
      fr: 'Outil de marquage actif',
      ar: 'أداة التعليم النشطة',
      en: 'Active marking tool',
    },
    clickSurfaceHint: {
      fr: 'Cliquez sur une surface pour appliquer l\'état',
      ar: 'انقر على سطح لتطبيق الحالة',
      en: 'Click on a surface to apply state',
    },
    quadrantRightUpper: {
      fr: 'Maxillaire Droit (Q1)',
      ar: 'العلوي الأيمن (Q1)',
      en: 'Upper Right (Q1)',
    },
    quadrantLeftUpper: {
      fr: 'Maxillaire Gauche (Q2)',
      ar: 'العلوي الأيسر (Q2)',
      en: 'Upper Left (Q2)',
    },
    quadrantRightLower: {
      fr: 'Mandibulaire Droit (Q4)',
      ar: 'السفلي الأيمن (Q4)',
      en: 'Lower Right (Q4)',
    },
    quadrantLeftLower: {
      fr: 'Mandibulaire Gauche (Q3)',
      ar: 'السفلي الأيسر (Q3)',
      en: 'Lower Left (Q3)',
    },
    upperArchTitle: {
      fr: 'ARCADE SUPÉRIEURE (MAXILLAIRE)',
      ar: 'الفك العلوي (المكسيلار)',
      en: 'UPPER ARCH (MAXILLA)',
    },
    lowerArchTitle: {
      fr: 'ARCADE INFÉRIEURE (MANDIBULE)',
      ar: 'الفك السفلي (المانديبول)',
      en: 'LOWER ARCH (MANDIBLE)',
    },
    toothConditionHealthy: {
      fr: 'Saine',
      ar: 'سليمة',
      en: 'Healthy',
    },
    toothConditionCaries: {
      fr: 'Carie',
      ar: 'تسوس',
      en: 'Caries',
    },
    toothConditionCrown: {
      fr: 'Couronne',
      ar: 'تاج/تاج طبي',
      en: 'Crown',
    },
    selectToothGridPrompt: {
      fr: 'Sélectionnez une dent sur la grille pour inspecter ses faces anatomiques.',
      ar: 'اختر سناً من الشبكة لفحص أسطحه التشريحية.',
      en: 'Select a tooth on the grid to inspect its anatomical surfaces.',
    },
    dmfIndex: {
      fr: 'Indice CAO (DMF)',
      ar: 'مؤشر تسوس وخلع وحشو الأسنان (DMF)',
      en: 'DMF Index',
    },
    healthyTeeth: {
      fr: 'Dents Saines',
      ar: 'أسنان سليمة',
      en: 'Healthy Teeth',
    },

    // Dictionary / Glossary
    dictionaryHeroSubtitle: {
      fr: 'Encyclopédie clinique et lexique des pathologies, traitements et termes dentaires.',
      ar: 'المعجم السريري والقاموس الطبي لأمراض، علاجات ومصطلحات طب الأسنان.',
      en: 'Clinical encyclopedia and lexicon of dental pathologies, treatments, and terms.',
    },
    all: {
      fr: 'Tous',
      ar: 'الكل',
      en: 'All',
    },
    clinicalNote: {
      fr: 'Note clinique',
      ar: 'ملاحظة سريرية',
      en: 'Clinical note',
    },
    readDedicatedArticle: {
      fr: 'Consulter l\'article détaillé',
      ar: 'قراءة المقال الطبي التفصيلي',
      en: 'Read detailed article',
    },
    searchDictionaryPlaceholder: {
      fr: 'Rechercher un terme, une pathologie, un soin...',
      ar: 'ابحث عن مصطلح، مرض، أو علاج أسنان...',
      en: 'Search a term, pathology, or treatment...',
    },

    // Doctors / Consultation
    btnBookConsultation: {
      fr: 'Réserver une consultation',
      ar: 'حجز موعد استشارة',
      en: 'Book consultation',
    },
    whatsappDirectLine: {
      fr: 'Ligne directe WhatsApp',
      ar: 'الخط المباشر عبر الواتساب',
      en: 'WhatsApp Direct Line',
    },
    selectDoctorOptional: {
      fr: 'Choisir un praticien (optionnel)',
      ar: 'اختيار الطبيب المعالج (اختياري)',
      en: 'Select doctor (optional)',
    },
    anyDoctor: {
      fr: 'Premier praticien disponible',
      ar: 'أول طبيب متاح',
      en: 'First available practitioner',
    },
    doctorYoussefSpecialty: {
      fr: 'Dr. Adam Bennett — Chirurgie & Implantologie',
      ar: 'د. آدم بنِت — جراحة وزراعة الأسنان',
      en: 'Dr. Adam Bennett — Surgery & Implantology',
    },
    doctorKenzaSpecialty: {
      fr: 'Dr. Maya Laurent — Esthétique & Orthodontie',
      ar: 'د. مايا لوران — تجميل وتقويم الأسنان',
      en: 'Dr. Maya Laurent — Aesthetics & Orthodontics',
    },
    consultationReason: {
      fr: 'Motif de la consultation',
      ar: 'سبب الاستشارة',
      en: 'Reason for consultation',
    },
    yourFullName: {
      fr: 'Votre nom complet',
      ar: 'الاسم الكامل',
      en: 'Your full name',
    },
    symptomsOrAvailabilities: {
      fr: 'Symptômes ou disponibilités souhaitées',
      ar: 'الأعراض أو الأوقات المفضل حجزها',
      en: 'Symptoms or preferred availabilities',
    },
    btnOpenWhatsApp: {
      fr: 'Ouvrir WhatsApp',
      ar: 'فتح تطبيق واتساب',
      en: 'Open WhatsApp',
    },
    officialContactDetails: {
      fr: 'Coordonnées officielles du cabinet',
      ar: 'معلومات الاتصال الرسمية بالعيادة',
      en: 'Official clinic contact details',
    },
    emergencyPhoneLabel: {
      fr: 'Téléphone d\'urgence',
      ar: 'هاتف الطوارئ',
      en: 'Emergency phone',
    },
    emergencyNotice: {
      fr: 'Prise en charge prioritaire pour les urgences douloureuses.',
      ar: 'عناية أولوية فورية للحالات الطارئة والألم الحاد.',
      en: 'Priority care for acute emergency pain.',
    },

    // Atlas & 3D Lessons
    guidedStages: {
      fr: 'Étapes guidées',
      ar: 'مراحل تعليمية موجهة',
      en: 'Guided stages',
    },
    crossSection: {
      fr: 'Coupe anatomique',
      ar: 'مقطع تشريحي',
      en: 'Cross section',
    },
    xray: {
      fr: 'Rayons-X',
      ar: 'أشعة سينية',
      en: 'X-ray',
    },
    quiz: {
      fr: 'Auto-évaluation',
      ar: 'اختبار تقييمي',
      en: 'Quiz',
    },
    launchLesson: {
      fr: 'Ouvrir le module 3D',
      ar: 'فتح وحدة التعلم ثلاثية الأبعاد',
      en: 'Open 3D module',
    },

    // WhatsApp Modal
    clinicSubtitle: {
      fr: 'Plateforme de soins dentaires & santé bucco-dentaire',
      ar: 'منصة الرعاية الصحية وصحة الفم والأسنان',
      en: 'Dental care platform & oral health',
    },
    selectDoctor: {
      fr: 'Sélectionner un praticien',
      ar: 'اختيار الطبيب',
      en: 'Select doctor',
    },
    anyDoctorOption: {
      fr: 'Sans préférence (premier disponible)',
      ar: 'بدون تفضيل (أول متاح)',
      en: 'No preference (first available)',
    },
    reasonForConsultation: {
      fr: 'Motif du rendez-vous',
      ar: 'سبب الموعد',
      en: 'Appointment reason',
    },
    patientFullName: {
      fr: 'Nom & Prénom du patient',
      ar: 'اسم المريض الكامل',
      en: 'Patient full name',
    },
    symptomsNoteOptional: {
      fr: 'Détails des symptômes (optionnel)',
      ar: 'تفاصيل الأعراض (اختياري)',
      en: 'Symptom details (optional)',
    },
    whatsAppAutoFormatNotice: {
      fr: 'Un message pré-formaté sera généré directement sur WhatsApp.',
      ar: 'سيتم توليد رسالة منسقة مسبقاً وتوجيهها مباشرة إلى الواتساب.',
      en: 'A pre-formatted message will be created directly on WhatsApp.',
    },
    patientNamePlaceholder: {
      fr: 'Ex: Karim Benjelloun',
      ar: 'مثال: كريم بنجلون',
      en: 'Ex: John Smith',
    },
    symptomsNotePlaceholder: {
      fr: 'Ex: Douleur vive molaire droite depuis hier...',
      ar: 'مثال: ألم حاد في الضرس الأيمن منذ الأمس...',
      en: 'Ex: Sharp right molar pain since yesterday...',
    },

    // Tooth 3D Viewer & Tools
    toothCategoryAll: {
      fr: 'Toutes les dents',
      ar: 'جميع الأسنان',
      en: 'All teeth',
    },

    // Search Modal
    searchEscape: {
      fr: 'Échap pour fermer',
      ar: 'زر Esc للإغلاق',
      en: 'Esc to close',
    },
    toolSymptomDesc: {
      fr: 'Outils interactifs d\'exploration 3D & simulateurs',
      ar: 'أدوات التفاعل والاستكشاف ثلاثي الأبعاد والمحاكاة',
      en: 'Interactive 3D tools & simulators',
    },
    medicalLexicon: {
      fr: 'Lexique médical & termes dentaires',
      ar: 'المعجم الطبي ومصطلحات الأسنان',
      en: 'Medical lexicon & dental terms',
    },
    encyclopediaArticles: {
      fr: 'Articles cliniques & fiches explicatives',
      ar: 'المقالات السريرية والبطاقات الشارحة',
      en: 'Clinical articles & guide sheets',
    },
    noResultsFor: {
      fr: 'Aucun résultat trouvé pour',
      ar: 'لم يتم العثور على نتائج لـ',
      en: 'No results found for',
    },
    trySimplerTerm: {
      fr: 'Essayer avec un terme plus simple ou sélectionner une catégorie ci-dessus.',
      ar: 'جرب البحث بمصطلح أسهل أو اختر إحدى الفئات أعلاه.',
      en: 'Try searching with a simpler term or select a category above.',
    },
    searchPlaceholder: {
      fr: 'Rechercher un terme, un soin, une dent, un symptôme...',
      ar: 'ابحث عن مصطلح، علاج، سن، أو عرض طبي...',
      en: 'Search term, treatment, tooth, symptom...',
    },
    btnBookDoctor: {
      fr: 'Prendre RDV avec ce praticien',
      ar: 'حجز موعد مع هذا الطبيب',
      en: 'Book with this doctor',
    },
    scrollToTop: {
      fr: 'Remonter en haut',
      ar: 'العودة إلى الأعلى',
      en: 'Scroll to top',
    },

    // FAQ Section Translations
    faqTitle: {
      fr: 'Questions Fréquentes (FAQ)',
      ar: 'الأسئلة الشائعة والمعلومات الطبية',
      en: 'Frequently Asked Questions (FAQ)',
    },
    faqBadge: {
      fr: 'Guide & Réponses Patient',
      ar: 'دليل وإجابات المرضى',
      en: 'Patient Guide & Answers',
    },
    faqSubtitle: {
      fr: 'Retrouvez toutes les réponses claires et détaillées sur les procédures dentaires, la chirurgie, l\'esthétique et la prise en charge au cabinet.',
      ar: 'إجابات واضحة وتفصيلية حول إجراءات طب الأسنان والجراحة والتجميل والرعاية بالعيادة.',
      en: 'Clear and detailed answers about dental procedures, surgery, aesthetics, and clinic care.',
    },
    faqCategoryAll: {
      fr: 'Toutes les questions',
      ar: 'جميع الأسئلة',
      en: 'All Questions',
    },
    faqCategoryGeneral: {
      fr: 'Général & Premier RDV',
      ar: 'عام والزيارة الأولى',
      en: 'General & First Visit',
    },
    faqCategoryImplants: {
      fr: 'Implants & Chirurgie',
      ar: 'زراعة وجراحة الأسنان',
      en: 'Implants & Surgery',
    },
    faqCategoryCare: {
      fr: 'Soins & Dévitalisation',
      ar: 'علاج التسوس وحشو العصب',
      en: 'Care, Caries & Root Canals',
    },
    faqCategoryAesthetics: {
      fr: 'Esthétique & Orthodontie',
      ar: 'التجميل وتقويم الأسنان',
      en: 'Aesthetics & Orthodontics',
    },
    faqCategoryEmergencies: {
      fr: 'Urgences & Hygiène',
      ar: 'الطوارئ والعناية الوقائية',
      en: 'Emergencies & Prevention',
    },
    faqSearchPlaceholder: {
      fr: 'Rechercher une question (ex: implant, douleur, blanchiment, RDV)...',
      ar: 'ابحث عن سؤال (مثال: زراعة، ألم، تبييض، موعد)...',
      en: 'Search a question (e.g. implant, pain, whitening, booking)...',
    },
    faqNoResults: {
      fr: 'Aucune question ne correspond à votre recherche.',
      ar: 'لا توجد أسئلة تطابق بحثك.',
      en: 'No questions match your search.',
    },
    faqStillHaveQuestion: {
      fr: 'Vous avez une question spécifique ?',
      ar: 'هل لديك سؤال خاص أو استفسار محدد؟',
      en: 'Have a specific question?',
    },
    faqContactTeamText: {
      fr: 'Notre équipe médicale et les Doctors sont à votre entière disposition pour répondre à toutes vos interrogations.',
      ar: 'فريقنا الطبي والدكتور دالي في خدمتكم للإجابة على كافة استفساراتكم بكل رحابة صدر.',
      en: 'Our medical team and Doctors are at your complete disposal to answer all your queries.',
    },
    faqAskWhatsApp: {
      fr: 'Poser une question via WhatsApp',
      ar: 'طرح سؤال عبر الواتساب',
      en: 'Ask a question via WhatsApp',
    },

    'faq.q1.question': {
      fr: 'Comment se déroule la première consultation au cabinet ?',
      ar: 'كيف تتم الزيارة الأولى والاستشارة في العيادة؟',
      en: 'How does the first consultation at the clinic go?',
    },
    'faq.q1.answer': {
      fr: 'La première consultation comprend un bilan bucco-dentaire complet, un examen approfondi des muqueuses et des dents, des clichés radiologiques panoramiques si nécessaire, ainsi que l\'établissement d\'un plan de traitement personnalisé et d\'un devis clair et détaillé.',
      ar: 'تتضمن الاستشارة الأولى فحصاً كاملاً للفم والأسنان، صور أشعة بانورامية عند الحاجة، مع تحديد خطة علاجية مخصصة وتقديم تقدير واضح للتكاليف.',
      en: 'The first consultation includes a comprehensive oral checkup, thorough examination of gums and teeth, panoramic X-rays if needed, and a personalized treatment plan with a clear detailed quote.',
    },

    'faq.q2.question': {
      fr: 'Quels sont les horaires d\'ouverture et comment réserver ?',
      ar: 'ما هي أوقات العمل وكيف يمكن حجز موعد؟',
      en: 'What are the opening hours and how do I book?',
    },
    'faq.q2.answer': {
      fr: 'Le cabinet est ouvert du Lundi au Vendredi de 09h00 à 19h30 et le Samedi de 09h00 à 14h00. Vous pouvez réserver votre rendez-vous en ligne via WhatsApp ou en appelant directement l\'accueil du cabinet.',
      ar: 'العيادة مفتوحة من الإثنين إلى الجمعة من 09:00 إلى 19:30 والسبت من 09:00 إلى 14:00. يمكنك حجز موعدك بسهولة عبر الواتساب أو الاتصال المباشر بالعيادة.',
      en: 'The clinic is open Monday to Friday from 09:00 to 19:30 and Saturday from 09:00 to 14:00. You can book online via WhatsApp or by calling the clinic directly.',
    },

    'faq.q3.question': {
      fr: 'La pose d\'un implant dentaire est-elle douloureuse ?',
      ar: 'هل عملية زراعة الأسنان مؤلمة؟',
      en: 'Is dental implant placement painful?',
    },
    'faq.q3.answer': {
      fr: 'L\'intervention se déroule sous anesthésie locale parfaitement dosée et est totalement indolore. Une légère sensibilité post-opératoire peut être ressentie pendant 24 à 48h, très bien soulagée par les antalgiques prescrits par le chirurgien.',
      ar: 'تتم العملية تحت تأثير التخدير المحلي التام وهي خالية تماماً من الألم. قد تشعر بحساسية خفيفة لمدة 24 إلى 48 ساعة بعد العملية، وتزول بمسكنات الألم الموصوفة.',
      en: 'The procedure is performed under local anesthesia and is completely painless. Mild post-operative sensitivity for 24-48 hours is easily managed with prescribed pain relievers.',
    },

    'faq.q4.question': {
      fr: 'Combien de temps dure l\'intégration d\'un implant dentaire ?',
      ar: 'كم تستغرق فترة التحام زراعة الأسنان بالعظم؟',
      en: 'How long does dental implant osseointegration take?',
    },
    'faq.q4.answer': {
      fr: 'L\'ostéointégration prend généralement entre 2 et 4 mois selon la densité osseuse du patient. Durant cette phase de cicatrisation, une prothèse provisoire esthétique peut être mise en place afin que vous ne restiez jamais sans dent.',
      ar: 'تستغرق عملية الالتحام العظمي عادة بين شهرين إلى 4 أشهر حسب كثافة العظم. خلال هذه الفترة، يمكن وضع تركيب مؤقت مريح للحفاظ على مظهرك الجمالي.',
      en: 'Osseointegration typically takes between 2 to 4 months depending on bone density. During this healing phase, an aesthetic temporary restoration can be placed so you are never without a tooth.',
    },

    'faq.q5.question': {
      fr: 'Quand faut-il dévitaliser une dent (traitement de canal) ?',
      ar: 'متى يكون علاج عصب السن (الديداني) ضرورياً؟',
      en: 'When is a root canal treatment necessary?',
    },
    'faq.q5.answer': {
      fr: 'La dévitalisation est nécessaire lorsque la carie a atteint la pulpe dentaire (le nerf), provoquant une rage de dent ou une infection. Le traitement nettoie, désinfecte et obture hermétiquement les canaux radiculaires pour conserver la dent naturelle.',
      ar: 'يكون علاج العصب ضرورياً عندما يصل التسوس إلى لب السن (العصب)، مما يتسبب في ألم حاد أو التهاب. يقوم العلاج بتنظيف القنوات الجذرية وتطهيرها وسدها للحفاظ على السن الطبيعي.',
      en: 'Root canal treatment is required when deep decay reaches the tooth pulp (nerve), causing severe pain or infection. The treatment cleans, disinfects, and hermetically seals the root canals to preserve your natural tooth.',
    },

    'faq.q6.question': {
      fr: 'Quelle est la différence entre un composite et une couronne ?',
      ar: 'ما الفرق بين الحشوة التجميلية وتاج الأسنان (الكورون)؟',
      en: 'What is the difference between a composite filling and a crown?',
    },
    'faq.q6.answer': {
      fr: 'Le composite est une résine esthétique de la couleur de la dent utilisée pour combler les petites et moyennes cavités. La couronne est une coiffe en céramique qui recouvre entièrement une dent fortement délabrée ou dévitalisée pour la consolider durablement.',
      ar: 'الحشوة التجميلية هي مادة مركبة بلون السن لسد الفجوات الصغيرة والمتوسطة. أما التاج فهو غطاء سيراميك يغطي السن المتضرر بشدة لحمايته واستعادة قوته ومظهره الطبيعي.',
      en: 'Composite resin matches the tooth color and fills small-to-medium cavities. A ceramic crown fully covers a severely damaged or treated tooth to permanently restore its structural strength.',
    },

    'faq.q7.question': {
      fr: 'Quels sont les avantages des aligneurs invisibles par rapport aux bagues ?',
      ar: 'ما هي مميزات التقويم الشفاف مقارنة بالأقواس التقليدية؟',
      en: 'What are the advantages of clear aligners over traditional braces?',
    },
    'faq.q7.answer': {
      fr: 'Les aligneurs transparents sont amovibles pour les repas et le brossage, quasi invisibles, extrêmement confortables et réduisent significativement le nombre de visites d\'urgence au cabinet par rapport aux bagues métalliques.',
      ar: 'التقويم الشفاف قابل للإزالة أثناء الطعام والتنظيف، وهو شبه مرئي ومريح للغاية، ويقلل من زيارات الطوارئ مقارنة بالأقواس المعدنية التقليدية.',
      en: 'Clear aligners are removable for meals and brushing, virtually invisible, highly comfortable, and significantly reduce emergency clinic visits compared to metal brackets.',
    },

    'faq.q8.question': {
      fr: 'Le blanchiment dentaire professionnel abîme-t-il l\'émail ?',
      ar: 'هل التبييض الطبي للأسنان يضر بمينا السن؟',
      en: 'Does professional teeth whitening damage enamel?',
    },
    'faq.q8.answer': {
      fr: 'Réalisé sous contrôle médical avec des gels de peroxyde certifiés et individualisés, le blanchiment dentaire professionnel est totalement sécurisé pour l\'émail et n\'altère en rien la structure minérale de la dent.',
      ar: 'تبييض الأسنان الطبي المصرح به وتحت إشراف الطبيب آمن تماماً على مادة المينا ولا يضر بتركيبة السن على الإطلاق.',
      en: 'Performed under professional dental supervision using certified gels, teeth whitening is completely safe for enamel and does not alter the mineral structure of the tooth.',
    },

    'faq.q9.question': {
      fr: 'Que faire en cas de rage de dent ou d\'urgence dentaire ?',
      ar: 'ماذا أفعل في حالة ألم الأسنان الحاد أو الطوارئ؟', en: 'What should I do in case of a toothache or dental emergency?',
    },
    'faq.q9.answer': {
      fr: 'Contactez immédiatement le cabinet via notre ligne prioritaire WhatsApp. En attendant votre rendez-vous d\'urgence le jour même, rincez-vous la bouche à l\'eau tiède salée et prenez des antalgiques autorisés (évitez l\'aspirine qui fluidifie le sang).',
      ar: 'اتصل بالعيادة فوراً عبر خط الطوارئ المباشر على الواتساب. لحين استقبالك في نفس اليوم، اشطف فمك بماء دافئ وملح وتناول المسكنات المسموحة (تجنب الأسبرين).',
      en: 'Contact the clinic immediately via our priority WhatsApp line. Pending your same-day emergency appointment, rinse with warm salt water and take recommended pain relievers (avoid aspirin).',
    },

    'faq.q10.question': {
      fr: 'À quelle fréquence faut-il effectuer un détartrage ?',
      ar: 'كم مرة يجب إجراء تنظيف وتلميع الأسنان الطبي؟',
      en: 'How often should professional scaling be performed?',
    },
    'faq.q10.answer': {
      fr: 'Un détartrage et polissage professionnel est recommandé tous les 6 mois (ou au maximum 1 an) pour éliminer le tartre sous-gingival, prévenir la parodontite et maintenir des gencives saines et sans saignement.',
      ar: 'يُنصح بتنظيف وتلميع الأسنان الطبي كل 6 أشهر (أو سنة كحد أقصى) لإزالة الجير تحت اللثة، والوقاية من أمراض اللثة والحفاظ على صحة النسيج الداعم.',
      en: 'Professional scaling and polishing is recommended every 6 months (or annually at most) to remove subgingival tartar, prevent gum disease, and maintain healthy, non-bleeding gums.',
    },

    // Clinic page and map UI
    clinicEquipmentTitle: { fr: 'Les équipements du plateau technique', ar: 'تجهيزات العيادة', en: 'Clinical equipment' },
    clinicEquipmentIntro: { fr: "La précision des soins dépend de la qualité des outils diagnostiques et thérapeutiques utilisés.", ar: 'تعتمد دقة العلاج على جودة أدوات التشخيص والعلاج المستخدمة.', en: 'Precise care depends on the quality of diagnostic and treatment tools.' },
    clinicSterilizationTitle: { fr: 'Stérilisation de norme hospitalière (classe B)', ar: 'تعقيم بمعايير المستشفيات (الفئة B)', en: 'Hospital-grade sterilization (Class B)' },
    clinicSterilizationDesc: { fr: "Autoclave de classe B avec traçabilité numérique de chaque cycle. Les instruments sont décontaminés, nettoyés aux ultrasons, ensachés et stérilisés avant leur ouverture devant vous.", ar: 'جهاز تعقيم من الفئة B مع تتبع رقمي لكل دورة. تُطهّر الأدوات وتُنظّف بالموجات فوق الصوتية وتُغلّف وتُعقّم قبل فتحها أمامكم.', en: 'Class B autoclave with digital cycle tracking. Instruments are decontaminated, ultrasonically cleaned, pouched and sterilized before being opened in front of you.' },
    clinicRvgTitle: { fr: 'Radiovisiographie numérique à faible dose', ar: 'التصوير الشعاعي الرقمي بجرعة منخفضة', en: 'Low-dose digital radiography' },
    clinicRvgDesc: { fr: "Des capteurs numériques haute définition réduisent l’exposition aux rayons X par rapport aux films traditionnels. Les images sont consultées et expliquées sur écran avec le patient.", ar: 'تقلل المستشعرات الرقمية عالية الدقة التعرض للأشعة مقارنة بالأفلام التقليدية، وتُعرض الصور وتُشرح للمريض على الشاشة.', en: 'High-definition digital sensors reduce X-ray exposure compared with traditional film. Images are reviewed and explained on screen with the patient.' },
    clinicCameraTitle: { fr: 'Caméra intra-orale et visualisation à l’écran', ar: 'كاميرا داخل الفم وعرض على الشاشة', en: 'Intraoral camera and screen viewing' },
    clinicCameraDesc: { fr: 'Visualisez vos dents et vos gencives à l’écran. Les caries, l’usure et les fissures vous sont montrées avant tout traitement.', ar: 'شاهدوا أسنانكم ولثتكم على الشاشة، مع توضيح التسوس والتآكل والتشققات قبل أي علاج.', en: 'View your teeth and gums on screen. Decay, wear and cracks are shown before treatment.' },
    clinicOpticsTitle: { fr: 'Aides optiques et grossissement', ar: 'وسائل بصرية وتكبير', en: 'Optical aids and magnification' },
    clinicOpticsDesc: { fr: 'Les gestes de préparation et de collage sont réalisés sous loupes binoculaires avec éclairage LED coaxial afin de préserver au maximum les tissus dentaires sains.', ar: 'تُجرى خطوات التحضير واللصق باستخدام عدسات مكبرة ثنائية مع إضاءة LED للحفاظ على أنسجة الأسنان السليمة قدر الإمكان.', en: 'Preparation and bonding are performed with binocular magnification and coaxial LED lighting to preserve healthy tooth structure.' },
    clinicMapOpen: { fr: 'Ouvert actuellement', ar: 'مفتوح الآن', en: 'Open now' },
    clinicMapClosed: { fr: 'Fermé actuellement (réouverture à 09 h 00)', ar: 'مغلق الآن (يفتح مجدداً الساعة 09:00)', en: 'Closed now (reopens at 9:00 AM)' },
    clinicMapActionsLabel: { fr: 'Options d’itinéraire', ar: 'خيارات الاتجاهات', en: 'Directions options' },
    clinicMapGoogleDirections: { fr: 'Itinéraire Google Maps', ar: 'الاتجاهات عبر خرائط Google', en: 'Google Maps directions' },
    clinicMapParking: { fr: 'Parking gratuit à proximité', ar: 'موقف سيارات مجاني قريب', en: 'Free nearby parking' },
    clinicMapAccessibility: { fr: 'Accès PMR complet', ar: 'إمكانية وصول كاملة لذوي الحركة المحدودة', en: 'Full wheelchair accessibility' },
    clinicMapAddress: { fr: 'Adresse fictive — Demo City', ar: 'مقابل صيدلية الحسن الثاني، مدينة تجريبية', en: 'Fictional address — Demo City' },
    toolsCompleteArch: { fr: 'Arcade dentaire complète en 3D', ar: 'قوس الأسنان الكامل ثلاثي الأبعاد', en: 'Complete 3D dental arch' },
    toolsToothLabel: { fr: 'Dent n°{{number}}', ar: 'السن رقم {{number}}', en: 'Tooth #{{number}}' },

    fullMouthExplorerTitle: { fr: 'Explorateur de la dentition complète', ar: 'مستكشف مجموعة الأسنان الكاملة', en: 'Full-mouth dentition explorer' },
    fullMouthExplorerSubtitle: { fr: 'Anatomie tridimensionnelle des 32 dents et rapports avec les nerfs', ar: 'التشريح ثلاثي الأبعاد للأسنان الـ32 وعلاقتها بالأعصاب', en: '3D anatomy of all 32 teeth and their relationship to nerves' },
    fullMouthShowFdi: { fr: 'Afficher/masquer les repères FDI', ar: 'إظهار/إخفاء علامات FDI', en: 'Show/hide FDI markers' },
    fullMouthFdi: { fr: 'Repères FDI', ar: 'علامات FDI', en: 'FDI markers' },
    fullMouthDirectory: { fr: 'Répertoire des dents', ar: 'دليل الأسنان', en: 'Tooth directory' },
    fullMouthReset: { fr: 'Réinitialiser', ar: 'إعادة الضبط', en: 'Reset' },
    fullMouthResetView: { fr: 'Réinitialiser le cadrage', ar: 'إعادة ضبط زاوية العرض', en: 'Reset view' },
    fullMouthQuadrant1: { fr: 'Quadrant 1 : supérieur droit (11–18)', ar: 'الربع 1: علوي أيمن (11–18)', en: 'Quadrant 1: upper right (11–18)' },
    fullMouthQuadrant2: { fr: 'Quadrant 2 : supérieur gauche (21–28)', ar: 'الربع 2: علوي أيسر (21–28)', en: 'Quadrant 2: upper left (21–28)' },
    fullMouthQuadrant3: { fr: 'Quadrant 3 : inférieur gauche (31–38)', ar: 'الربع 3: سفلي أيسر (31–38)', en: 'Quadrant 3: lower left (31–38)' },
    fullMouthQuadrant4: { fr: 'Quadrant 4 : inférieur droit (41–48)', ar: 'الربع 4: سفلي أيمن (41–48)', en: 'Quadrant 4: lower right (41–48)' },
    dental3dRequiredTitle: { fr: 'Modèle 3D requis', ar: 'نموذج ثلاثي الأبعاد مطلوب', en: '3D model required' },
    dental3dAutoRotate: { fr: 'Rotation automatique', ar: 'تدوير تلقائي', en: 'Auto-rotate' },
    dental3dResetView: { fr: 'Réinitialiser la vue', ar: 'إعادة ضبط العرض', en: 'Reset view' },
    dental3dFullscreen: { fr: 'Plein écran', ar: 'ملء الشاشة', en: 'Fullscreen' },
    contactNamePlaceholder: { fr: 'Ex. : Yasmine Benjelloun', ar: 'مثال: ياسمين بنجلون', en: 'e.g. Yasmine Benjelloun' },
    contactMessagePlaceholder: { fr: 'Ex. : Disponible de préférence le mardi après-midi…', ar: 'مثال: أفضل موعد بعد ظهر يوم الثلاثاء…', en: 'e.g. Preferably available Tuesday afternoon…' },
  };

  constructor() {
    // Restore saved language and direction if available
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedLang = window.localStorage.getItem('cdd_lang') as Language;
        if (savedLang === 'fr' || savedLang === 'ar' || savedLang === 'en') {
          this.currentLang.set(savedLang);
        }

        const savedDir = window.localStorage.getItem('cdd_dir') as TextDirection;
        if (savedDir === 'auto' || savedDir === 'rtl' || savedDir === 'ltr') {
          this.textDir.set(savedDir);
        }
      } catch {
        // Fallback safely
      }
    }

    // Synchronize HTML lang and dir attributes on client side
    effect(() => {
      const lang = this.currentLang();
      const dir = this.effectiveDir();
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
        document.documentElement.dir = dir;
        
        // Add class helper on html / body
        if (dir === 'rtl') {
          document.documentElement.classList.add('app-rtl');
          document.documentElement.classList.remove('app-ltr');
        } else {
          document.documentElement.classList.add('app-ltr');
          document.documentElement.classList.remove('app-rtl');
        }

        try {
          localStorage.setItem('cdd_lang', lang);
          localStorage.setItem('cdd_dir', this.textDir());
        } catch {
          // ignore
        }
      }
    });
  }

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
  }

  setTextDirection(dir: TextDirection) {
    this.textDir.set(dir);
  }

  toggleDirection() {
    const current = this.effectiveDir();
    this.textDir.set(current === 'rtl' ? 'ltr' : 'rtl');
  }

  translate(key: string, fallback?: string): string {
    const item = this.dictionary[key];
    if (!item) {
      if (typeof window !== 'undefined') {
        console.warn(`[missing translation: ${key}]`);
      }
      return fallback || `[missing translation: ${key}]`;
    }
    const current = this.currentLang();
    return item[current] || item['fr'] || fallback || `[missing translation: ${key}]`;
  }
}
