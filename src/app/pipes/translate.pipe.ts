import {Pipe, PipeTransform, inject} from '@angular/core';
import {TranslationService} from '../services/translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false, // Reactive to TranslationService signals (currentLang, textDir)
})
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(TranslationService);

  transform(
    key: string,
    paramsOrFallback?: Record<string, string | number> | string,
    fallbackOrParams?: string | Record<string, string | number>
  ): string {
    if (!key) return '';

    let params: Record<string, string | number> | undefined;
    let fallback: string | undefined;

    if (typeof paramsOrFallback === 'object' && paramsOrFallback !== null) {
      params = paramsOrFallback as Record<string, string | number>;
    } else if (typeof paramsOrFallback === 'string') {
      fallback = paramsOrFallback;
    }

    if (typeof fallbackOrParams === 'object' && fallbackOrParams !== null) {
      params = fallbackOrParams as Record<string, string | number>;
    } else if (typeof fallbackOrParams === 'string') {
      fallback = fallbackOrParams;
    }

    let translated = this.i18n.translate(key, fallback);
    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        translated = translated.replace(new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g'), String(val));
        translated = translated.replace(new RegExp(`:${paramKey}`, 'g'), String(val));
      });
    }
    return translated;
  }
}

