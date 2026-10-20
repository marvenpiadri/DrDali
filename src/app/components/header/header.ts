import {ChangeDetectionStrategy, Component, signal, computed, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {ThemeService} from '../../services/theme.service';
import {TranslationService, Language, TextDirection} from '../../services/translation.service';
import {LogoComponent} from '../logo/logo';
import {TranslatePipe} from '../../pipes/translate.pipe';

export interface LanguageOption {
  code: Language;
  shortLabel: string;
  name: string;
  nativeName: string;
}

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, LogoComponent, TranslatePipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {
  theme = inject(ThemeService);
  i18n = inject(TranslationService);

  openSearch = output<void>();

  mobileMenuOpen = signal<boolean>(false);
  langDropdownOpen = signal<boolean>(false);

  readonly languages: LanguageOption[] = [
    { code: 'fr', shortLabel: 'FR', name: 'Français', nativeName: 'Français' },
    { code: 'ar', shortLabel: 'AR', name: 'Arabe', nativeName: 'العربية' },
    { code: 'en', shortLabel: 'EN', name: 'Anglais', nativeName: 'English' },
  ];

  currentLangOption = computed(() => {
    const current = this.i18n.currentLang();
    return this.languages.find((l) => l.code === current) || this.languages[0];
  });

  toggleMobileMenu() {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  toggleLangDropdown() {
    this.langDropdownOpen.update((v) => !v);
  }

  closeLangDropdown() {
    this.langDropdownOpen.set(false);
  }

  selectLanguage(lang: Language) {
    this.i18n.setLanguage(lang);
    this.langDropdownOpen.set(false);
  }

  setDirection(dir: TextDirection) {
    this.i18n.setTextDirection(dir);
  }

  toggleDirection() {
    this.i18n.toggleDirection();
  }
}
