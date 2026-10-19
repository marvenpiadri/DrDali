import {Injectable, inject} from '@angular/core';
import {Title, Meta} from '@angular/platform-browser';
import {Router, NavigationEnd} from '@angular/router';
import {TranslationService, Language} from './translation.service';
import {filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly router = inject(Router);
  private readonly i18n = inject(TranslationService);

  private readonly baseUrl = 'https://centredentairedali.ma';
  private jsonLdScriptElement: HTMLScriptElement | null = null;
  private faqLdScriptElement: HTMLScriptElement | null = null;

  init() {
    // Listen to router navigation events
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageSeo();
      });

    // Run initial SEO setup
    this.updatePageSeo();
  }

  updatePageSeo(customTitle?: string, customDescription?: string) {
    const rawUrl = this.router.url.split('?')[0];
    const url = rawUrl === '/' ? '' : rawUrl;
    const lang = this.i18n.currentLang();

    // 1. Set HTML Lang and Text Direction (Ensure RTL only for Arabic)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = this.i18n.isRtl() ? 'rtl' : 'ltr';
    }

    // 2. Resolve Page Title & Description based on route
    const { title, description } = this.getRouteMetadata(url, lang, customTitle, customDescription);

    this.titleService.setTitle(title);

    // Standard Meta Tags (No meta keywords per current search engine standards)
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ name: 'author', content: 'Centre Dentaire Dali' });
    this.metaService.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large' });

    // OpenGraph / Facebook Meta
    const fullUrl = `${this.baseUrl}${url || '/'}`;
    this.metaService.updateTag({ property: 'og:site_name', content: 'Centre Dentaire Dali' });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:url', content: fullUrl });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:locale', content: lang === 'ar' ? 'ar_MA' : lang === 'en' ? 'en_US' : 'fr_FR' });
    this.metaService.updateTag({ property: 'og:image', content: `${this.baseUrl}/assets/dali_black.png` });

    // Twitter Meta
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: `${this.baseUrl}/assets/dali_black.png` });

    // Canonical & Hreflang Link tags
    this.updateCanonicalAndHreflang(url);

    // Dynamic JSON-LD Structured Data Injection
    this.injectClinicJsonLd();
    
    // Only inject FAQ JSON-LD if FAQ content is genuinely rendered on the page (Home & Clinic)
    if (url === '' || url === '/' || url.includes('/clinic')) {
      this.injectFaqJsonLd();
    } else {
      this.removeFaqJsonLd();
    }
  }

  private updateCanonicalAndHreflang(urlPath: string) {
    if (typeof document === 'undefined') return;

    const cleanPath = urlPath || '';
    const canonicalUrl = `${this.baseUrl}${cleanPath || '/'}`;

    // Canonical URL link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // Hreflang links
    const languages: Language[] = ['fr', 'ar', 'en'];
    languages.forEach((lang) => {
      let hreflang = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`) as HTMLLinkElement;
      if (!hreflang) {
        hreflang = document.createElement('link');
        hreflang.setAttribute('rel', 'alternate');
        hreflang.setAttribute('hreflang', lang);
        document.head.appendChild(hreflang);
      }
      hreflang.setAttribute('href', `${canonicalUrl}?lang=${lang}`);
    });

    // x-default hreflang link
    let xDefault = document.querySelector('link[rel="alternate"][hreflang="x-default"]') as HTMLLinkElement;
    if (!xDefault) {
      xDefault = document.createElement('link');
      xDefault.setAttribute('rel', 'alternate');
      xDefault.setAttribute('hreflang', 'x-default');
      document.head.appendChild(xDefault);
    }
    xDefault.setAttribute('href', canonicalUrl);
  }

  private injectClinicJsonLd() {
    if (typeof document === 'undefined') return;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['Dentist', 'MedicalBusiness', 'MedicalOrganization'],
          '@id': `${this.baseUrl}/#clinic`,
          'name': 'Centre Dentaire Dali',
          'legalName': 'Centre Dentaire Dali Témara',
          'url': this.baseUrl,
          'logo': `${this.baseUrl}/assets/dali_black.png`,
          'image': `${this.baseUrl}/assets/dali_black.png`,
          'telephone': '+212537640000',
          'email': 'contact@dentairdali.ma',
          'priceRange': '$$',
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': 'Avenue Hassan II',
            'addressLocality': 'Témara',
            'addressRegion': 'Rabat-Salé-Kénitra',
            'postalCode': '12000',
            'addressCountry': 'MA',
          },
          'geo': {
            '@type': 'GeoCoordinates',
            'latitude': 33.9238,
            'longitude': -6.9084,
          },
          'openingHoursSpecification': [
            {
              '@type': 'OpeningHoursSpecification',
              'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              'opens': '09:00',
              'closes': '19:30',
            },
            {
              '@type': 'OpeningHoursSpecification',
              'dayOfWeek': 'Saturday',
              'opens': '09:00',
              'closes': '14:00',
            },
          ],
          'medicalSpecialty': [
            'Dentistry',
            'Periodontics',
            'Orthodontics',
            'Endodontics',
            'DentalImplantology',
            'Prosthodontics',
            'CosmeticDentistry',
          ],
          'employee': [
            { '@id': `${this.baseUrl}/#dr-youssef-dali` },
            { '@id': `${this.baseUrl}/#dr-kenza-dali` },
          ],
        },
        {
          '@type': 'Person',
          '@id': `${this.baseUrl}/#dr-youssef-dali`,
          'name': 'Dr. Youssef Dali',
          'jobTitle': 'Chirurgien-Dentiste, Implantologie & Esthétique',
          'worksFor': { '@id': `${this.baseUrl}/#clinic` },
        },
        {
          '@type': 'Person',
          '@id': `${this.baseUrl}/#dr-kenza-dali`,
          'name': 'Dr. Kenza Dali',
          'jobTitle': 'Chirurgien-Dentiste, Parodontologie & Orthodontie',
          'worksFor': { '@id': `${this.baseUrl}/#clinic` },
        },
      ],
    };

    if (!this.jsonLdScriptElement) {
      this.jsonLdScriptElement = document.createElement('script');
      this.jsonLdScriptElement.type = 'application/ld+json';
      this.jsonLdScriptElement.id = 'clinic-jsonld';
      document.head.appendChild(this.jsonLdScriptElement);
    }
    this.jsonLdScriptElement.text = JSON.stringify(schema);
  }

  private injectFaqJsonLd() {
    if (typeof document === 'undefined') return;

    const faqItems = [
      { qKey: 'faq.q1.question', aKey: 'faq.q1.answer' },
      { qKey: 'faq.q2.question', aKey: 'faq.q2.answer' },
      { qKey: 'faq.q3.question', aKey: 'faq.q3.answer' },
      { qKey: 'faq.q4.question', aKey: 'faq.q4.answer' },
      { qKey: 'faq.q5.question', aKey: 'faq.q5.answer' },
      { qKey: 'faq.q6.question', aKey: 'faq.q6.answer' },
      { qKey: 'faq.q7.question', aKey: 'faq.q7.answer' },
      { qKey: 'faq.q8.question', aKey: 'faq.q8.answer' },
      { qKey: 'faq.q9.question', aKey: 'faq.q9.answer' },
      { qKey: 'faq.q10.question', aKey: 'faq.q10.answer' },
    ];

    const mainEntity = faqItems.map((item) => ({
      '@type': 'Question',
      'name': this.i18n.translate(item.qKey),
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': this.i18n.translate(item.aKey),
      },
    }));

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': mainEntity,
    };

    if (!this.faqLdScriptElement) {
      this.faqLdScriptElement = document.createElement('script');
      this.faqLdScriptElement.type = 'application/ld+json';
      this.faqLdScriptElement.id = 'faq-jsonld';
      document.head.appendChild(this.faqLdScriptElement);
    }
    this.faqLdScriptElement.text = JSON.stringify(faqSchema);
  }

  private removeFaqJsonLd() {
    if (typeof document === 'undefined') return;
    const existingScript = document.getElementById('faq-jsonld');
    if (existingScript) {
      existingScript.remove();
      this.faqLdScriptElement = null;
    }
  }

  private getRouteMetadata(
    url: string,
    lang: Language,
    customTitle?: string,
    customDescription?: string
  ): { title: string; description: string } {
    if (customTitle && customDescription) {
      return { title: customTitle, description: customDescription };
    }

    // Default Home Metadata
    let title = 'Centre Dentaire Dali | Clinique Dentaire & Soins d\'Excellence à Témara';
    let description = 'Centre Dentaire Dali à Témara : implants dentaires, aligneurs invisibles, dévitalisation, blanchiment, urgences et atlas 3D interactif.';

    if (lang === 'ar') {
      title = 'مركز دالي لطب الأسنان | عيادة الأسنان ورعاية متقدمة بتمارة';
      description = 'مركز دالي لطب الأسنان بتمارة: زراعة الأسنان، التقويم الشفاف، حشو العصب، التبييض الطبي، الطوارئ والأطلس الثلاثي الأبعاد.';
    } else if (lang === 'en') {
      title = 'Centre Dentaire Dali | Dental Clinic & Excellence in Témara';
      description = 'Centre Dentaire Dali in Témara: dental implants, clear aligners, root canal treatment, whitening, emergency care, and 3D dental atlas.';
    }

    // Route Specific Matched Rules
    if (url.includes('/atlas/dictionary')) {
      if (lang === 'ar') {
        title = 'معجم مصطلحات طب الأسنان الشامل A-Z | مركز دالي لطب الأسنان';
        description = 'دليل ومعجم شامل لمصطلحات وأمراض وعلاجات طب الأسنان باللغات العربية والفرنسية والإنجليزية.';
      } else if (lang === 'en') {
        title = 'A-Z Dental & Medical Terminology Dictionary | Centre Dentaire Dali';
        description = 'Comprehensive A-Z clinical dictionary covering dental pathology, anatomy, and procedures in FR, AR, EN.';
      } else {
        title = 'Dictionnaire Dentaire A-Z & Termes Médicaux | Centre Dentaire Dali';
        description = 'Dictionnaire complet A-Z des termes médicaux, pathologies et procédures dentaires en FR, AR, EN.';
      }
    } else if (url.includes('/atlas/tooth-explorer')) {
      if (lang === 'ar') {
        title = 'مستكشف تشريح الأسنان الثلاثي الأبعاد - 32 سن | مركز دالي لطب الأسنان';
        description = 'استكشف تشريح الأسنان الدائمة الـ 32 ثلاثي الأبعاد مع تحليل طبقات الإينامل والعاج والعصب.';
      } else if (lang === 'en') {
        title = '3D Tooth Anatomy Explorer - 32 Permanent Teeth | Centre Dentaire Dali';
        description = 'Interactive 3D model exploring all 32 permanent teeth, enamel prisms, dentin layers, and pulp chamber.';
      } else {
        title = 'Explorateur Anatomique 3D - 32 Dents | Centre Dentaire Dali';
        description = 'Modèle 3D interactif des 32 dents permanentes, jonction amélo-dentinaire et structure de la pulpe.';
      }
    } else if (url.includes('/atlas/dental-arch')) {
      if (lang === 'ar') {
        title = 'نمذجة الفك والأقواس السنية ثلاثية الأبعاد | مركز دالي لطب الأسنان';
        description = 'استكشاف تفاعلي ثلاثي الأبعاد لقوس الفك العلوي والسفلي وترتيب الأسنان والعض الطبيعي.';
      } else if (lang === 'en') {
        title = '3D Maxillary & Mandibular Dental Arch Model | Centre Dentaire Dali';
        description = 'Interactive 3D visualization of upper and lower dental arches, alignment, and occlusion.';
      } else {
        title = 'Modélisation 3D des Arcades Maxillaire & Mandibulaire | Centre Dentaire Dali';
        description = 'Visualisation 3D des arcades dentaires supérieure et inférieure, alignement et occlusion.';
      }
    } else if (url.includes('/atlas/tooth-decay')) {
      if (lang === 'ar') {
        title = 'مراحل وتطور تسوس الأسنان ثلاثي الأبعاد | مركز دالي لطب الأسنان';
        description = 'محاكاة ثلاثية الأبعاد لتطور تسوس الأسنان من البقعة البيضاء الأولى إلى إصابة العصب.';
      } else if (lang === 'en') {
        title = 'Dental Caries Stages & Progression in 3D | Centre Dentaire Dali';
        description = 'Interactive 3D simulation of tooth decay stages from initial enamel demineralization to pulpitis.';
      } else {
        title = 'Stades & Progression de la Carie Dentaire en 3D | Centre Dentaire Dali';
        description = 'Simulation 3D interactive des stades de la carie dentaire, de la déminéralisation à la pulpite.';
      }
    } else if (url.includes('/atlas/gum-disease')) {
      if (lang === 'ar') {
        title = 'أمراض اللثة والتهاب النسيج الداعم ثلاثي الأبعاد | مركز دالي لطب الأسنان';
        description = 'استكشاف ثلاثي الأبعاد لالتهاب اللثة، امتصاص العظم الداعم، والعلاج الوقائي.';
      } else if (lang === 'en') {
        title = 'Gingivitis & Periodontitis 3D Gum Explorer | Centre Dentaire Dali';
        description = 'Interactive 3D breakdown of gum disease progression, periodontal pockets, and bone resorption.';
      } else {
        title = 'Gingivite & Parodontite : Animation 3D des Gencives | Centre Dentaire Dali';
        description = 'Exploration 3D de la santé parodontale, poches gingivales, alvéololyse et hygiène préventive.';
      }
    } else if (url.includes('/atlas/root-canal')) {
      if (lang === 'ar') {
        title = 'علاج القنوات الجذرية وحشو العصب ثلاثي الأبعاد | مركز دالي لطب الأسنان';
        description = 'محاكاة ثلاثية الأبعاد لخطوات علاج عصب السن، تطهير القنوات، والحشو المحكم.';
      } else if (lang === 'en') {
        title = 'Root Canal Treatment & Endodontics in 3D | Centre Dentaire Dali';
        description = 'Step-by-step 3D interactive guide to endodontic root canal cleaning, shaping, and sealing.';
      } else {
        title = 'Traitement Endodontique & Dévitalisation de Canal 3D | Centre Dentaire Dali';
        description = 'Guide 3D interactif étape par étape de la dévitalisation, désinfection et obturation des canaux.';
      }
    } else if (url.includes('/atlas/implant-explorer')) {
      if (lang === 'ar') {
        title = 'زراعة الأسنان والاندماج العظمي ثلاثي الأبعاد | مركز دالي لطب الأسنان';
        description = 'نموذج تفاعلي ثلاثي الأبعاد لزرعة التيتانيوم، الدعامة والتجميع البروتيزي.';
      } else if (lang === 'en') {
        title = 'Dental Implant System & Osseointegration in 3D | Centre Dentaire Dali';
        description = 'Interactive 3D breakdown of titanium dental implant placement, abutment, and ceramic crown.';
      } else {
        title = 'Implants Dentaires en Titane & Ostéointégration 3D | Centre Dentaire Dali';
        description = 'Modèle 3D interactif du système d\'implant en titane, piliers et prothèses céramiques.';
      }
    } else if (url.includes('/atlas/crown-explorer')) {
      if (lang === 'ar') {
        title = 'تيجان الأسنان والتركيبات الخزفية ثلاثية الأبعاد | مركز دالي لطب الأسنان';
        description = 'استكشاف التاج الخزفي والتجهيز السني لإعادة بناء الأسنان المتضررة.';
      } else if (lang === 'en') {
        title = 'Dental Crown & Ceramic Prosthetics in 3D | Centre Dentaire Dali';
        description = '3D interactive visualization of ceramic dental crown preparation and restoration.';
      } else {
        title = 'Couronnes & Prothèses Céramiques en 3D | Centre Dentaire Dali';
        description = 'Visualisation 3D interactive de la préparation et pose des couronnes dentaires en céramique.';
      }
    } else if (url.includes('/atlas/veneer-explorer')) {
      if (lang === 'ar') {
        title = 'قشور الأسنان التجميلية والفينير ثلاثي الأبعاد | مركز دالي لطب الأسنان';
        description = 'عرض ثلاثي الأبعاد لتركيب قشور الفينير التجميلية لتحسين مظهر الابتسامة.';
      } else if (lang === 'en') {
        title = 'Cosmetic Dental Veneers & Smile Makeover 3D | Centre Dentaire Dali';
        description = 'Interactive 3D model of porcelain cosmetic veneers and smile alignment transformation.';
      } else {
        title = 'Facettes Dentaires Esthétiques en Céramique 3D | Centre Dentaire Dali';
        description = 'Modèle 3D interactif de la pose de facettes en porcelaine et transformation du sourire.';
      }
    } else if (url.includes('/atlas/wisdom-teeth')) {
      if (lang === 'ar') {
        title = 'ضروس العقل المنطمرة وجراحتها ثلاثية الأبعاد | مركز دالي لطب الأسنان';
        description = 'عرض ثلاثي الأبعاد لضروس العقل المائلة والمنطمرة وكيفية استخراجها الجراحي الآمن.';
      } else if (lang === 'en') {
        title = 'Impacted Wisdom Teeth & Surgical Extraction 3D | Centre Dentaire Dali';
        description = 'Interactive 3D view of impacted third molars, nerve proximity, and surgical extraction procedure.';
      } else {
        title = 'Dents de Sagesse Impactées & Extraction 3D | Centre Dentaire Dali';
        description = 'Vue 3D interactive des 3èmes molaires impactées, proximité nerveuse et extraction chirurgicale.';
      }
    } else if (url.includes('/atlas/jaw-anatomy')) {
      if (lang === 'ar') {
        title = 'تشريح العظام والفكين الفوقي والسفلي ثلاثي الأبعاد | مركز دالي لطب الأسنان';
        description = 'استكشاف ثلاثي الأبعاد لهيكل عظام الفكين، العصب الفكي السفلي، والجيوب الأنفية.';
      } else if (lang === 'en') {
        title = 'Jawbone Anatomy & Craniofacial Structure in 3D | Centre Dentaire Dali';
        description = 'Interactive 3D craniofacial anatomy showing maxillary sinuses, mandibular canal, and bone density.';
      } else {
        title = 'Anatomie Osseuse des Mâchoires Maxillaire & Mandibulaire 3D | Centre Dentaire Dali';
        description = 'Exploration 3D de l\'anatomie osseuse, sinus maxillaires, canal dentaire inférieur et densité alvéolaire.';
      }
    } else if (url.includes('/atlas')) {
      if (lang === 'ar') {
        title = 'الأطلس الطبي الثلاثي الأبعاد لطب الأسنان | مركز دالي لطب الأسنان';
        description = 'مستكشف تشريحي تفاعلي ثلاثي الأبعاد للأسنان واللثة وعلاجات جذور الأسنان وزراعة الأسنان.';
      } else if (lang === 'en') {
        title = 'Interactive 3D Dental Atlas & Anatomy Lessons | Centre Dentaire Dali';
        description = 'Interactive 3D anatomical explorer for teeth, gums, root canals, and dental implants.';
      } else {
        title = 'Atlas Dentaire 3D Interactif & Leçons Anatomiques | Centre Dentaire Dali';
        description = 'Explorateur anatomique 3D interactif pour dents, gencives, soins de canal et implants dentaires.';
      }
    } else if (url.includes('/dr-dali')) {
      if (lang === 'ar') {
        title = 'الفريق الطبي : الدكتور يوسف دالي والدكتورة كنزة دالي | مركز دالي لطب الأسنان';
        description = 'تعرف على الدكتور يوسف دالي والدكتورة كنزة دالي وفريق جراحي الأسنان بالعيادة.';
      } else if (lang === 'en') {
        title = 'Medical Team: Dr. Youssef Dali & Dr. Kenza Dali | Centre Dentaire Dali';
        description = 'Meet Dr. Youssef Dali and Dr. Kenza Dali, expert dental surgeons and specialists.';
      } else {
        title = 'Équipe Médicale : Dr Youssef Dali & Dr Kenza Dali | Centre Dentaire Dali';
        description = 'Découvrez le Dr Youssef Dali et le Dr Kenza Dali, chirurgiens-dentistes experts au cabinet.';
      }
    } else if (url.includes('/clinic')) {
      if (lang === 'ar') {
        title = 'عيادة الأسنان والتجهيزات الطبية بتمارة | مركز دالي لطب الأسنان';
        description = 'تعرف على عيادة مركز دالي لطب الأسنان، التجهيزات الرقمية، التعقيم، والموقع.';
      } else if (lang === 'en') {
        title = 'Dental Clinic & Advanced Facilities in Témara | Centre Dentaire Dali';
        description = 'Explore Centre Dentaire Dali clinic, digital imaging, sterilization, and facilities.';
      } else {
        title = 'Le Cabinet Dentaire & Plateau Technique à Témara | Centre Dentaire Dali';
        description = 'Découvrez les équipements de pointe, la chaîne de stérilisation et le plateau technique du Centre Dentaire Dali.';
      }
    } else if (url.includes('/contact')) {
      if (lang === 'ar') {
        title = 'اتصل بنا، الموقع وطوارئ الأسنان بتمارة | مركز دالي لطب الأسنان';
        description = 'اتصل بمركز دالي لطب الأسنان بحي الحسن الثاني تمارة، حجز الموعد وطوارئ الأسنان.';
      } else if (lang === 'en') {
        title = 'Contact, Location & Dental Emergencies | Centre Dentaire Dali Témara';
        description = 'Contact Centre Dentaire Dali in Témara, book appointments, and emergency contacts.';
      } else {
        title = 'Contact, Accès & Urgences Dentaires | Centre Dentaire Dali Témara';
        description = 'Contactez le Centre Dentaire Dali à Témara, réservation en ligne via WhatsApp et urgences dentaires.';
      }
    } else if (url.includes('/tools')) {
      if (lang === 'ar') {
        title = 'مركز المحاكاة والأدوات ثلاثية الأبعاد | مركز دالي لطب الأسنان';
        description = 'استكشف أدوات ومحاكاة طب الأسنان الثلاثية الأبعاد التفاعلية للتشريح والعلاجات.';
      } else if (lang === 'en') {
        title = '3D Exploration Hub & Clinical Simulators | Centre Dentaire Dali';
        description = 'Explore interactive 3D dental tools and clinical simulators for anatomy and procedures.';
      } else {
        title = 'Centre d\'Exploration & Simulateurs 3D | Centre Dentaire Dali';
        description = 'Explorez nos outils dentaires interactifs et simulateurs 3D cliniques pour l\'anatomie et les soins.';
      }
    }

    return { title, description };
  }
}
