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

  private readonly baseUrl = 'https://drdali.marvenpiadri.workers.dev';
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
    this.metaService.updateTag({ name: 'author', content: 'Demo for Dentists' });
    this.metaService.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large' });

    // OpenGraph / Facebook Meta
    const fullUrl = `${this.baseUrl}${url || '/'}`;
    this.metaService.updateTag({ property: 'og:site_name', content: 'Demo for Dentists' });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:url', content: fullUrl });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:locale', content: lang === 'ar' ? 'ar_MA' : lang === 'en' ? 'en_US' : 'fr_FR' });

    // Twitter Meta
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });

    // Canonical & Hreflang Link tags
    this.updateCanonicalAndHreflang(url);

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

    const pages: { path: string; title: string; description: string }[] = [
      { path: '/atlas/dictionary', title: 'Dental Glossary', description: 'A multilingual reference for dental anatomy, conditions, terminology, and treatments.' },
      { path: '/atlas/tooth-explorer', title: '3D Tooth Anatomy Explorer', description: 'Explore permanent tooth anatomy and its internal structures in an interactive 3D viewer.' },
      { path: '/atlas/dental-arch', title: '3D Dental Arch', description: 'Explore upper and lower dental arches, tooth alignment, and occlusion in 3D.' },
      { path: '/atlas/tooth-decay', title: 'Tooth Decay Simulator', description: 'Explore the progression of dental caries through an interactive 3D simulation.' },
      { path: '/atlas/gum-disease', title: 'Gum Disease Explorer', description: 'Explore gingival and periodontal structures through interactive 3D anatomy.' },
      { path: '/atlas/root-canal', title: 'Root Canal Treatment in 3D', description: 'Follow the stages of endodontic treatment in an interactive 3D guide.' },
      { path: '/atlas/implant-explorer', title: 'Dental Implant Explorer', description: 'Explore dental implant components and osseointegration in 3D.' },
      { path: '/atlas/crown-explorer', title: 'Dental Crown Explorer', description: 'Explore dental crown preparation and restoration through 3D visualization.' },
      { path: '/atlas/veneer-explorer', title: 'Dental Veneer Explorer', description: 'Explore cosmetic dental veneers and restorative steps in 3D.' },
      { path: '/atlas/wisdom-teeth', title: 'Wisdom Teeth Explorer', description: 'Explore impacted wisdom teeth and their anatomical relationships in 3D.' },
      { path: '/atlas/jaw-anatomy', title: 'Jaw Anatomy in 3D', description: 'Explore maxillary and mandibular anatomy in an interactive 3D viewer.' },
      { path: '/atlas', title: 'Interactive 3D Dental Atlas', description: 'Explore interactive 3D dental anatomy, conditions, and treatment explanations.' },
      { path: '/dr-dali', title: 'Dental Team Demo', description: 'Preview a sample dental team presentation for a practice website.' },
      { path: '/clinic', title: 'Practice Preview', description: 'Preview a sample dental practice website and its facilities presentation.' },
      { path: '/contact', title: 'Contact & Location Preview', description: 'Preview a sample dental practice contact and location page.' },
      { path: '/tools', title: 'Dental Tools & Simulators', description: 'Explore interactive dental education tools and clinical learning simulators.' },
    ];

    const page = pages.find((item) => url.includes(item.path));
    const title = page
      ? `${page.title} | Demo for Dentists`
      : 'Demo for Dentists | Interactive Dental Atlas';
    const description = page?.description
      ?? 'A demonstration dental website featuring interactive 3D anatomy, treatment explanations, and patient education tools.';

    return { title, description };
  }
}
