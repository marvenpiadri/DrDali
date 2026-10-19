import {ChangeDetectionStrategy, Component, signal, HostListener, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './components/header/header';
import {FooterComponent} from './components/footer/footer';
import {WhatsAppModalComponent} from './components/whatsapp-modal/whatsapp-modal';
import {SearchModalComponent} from './components/search-modal/search-modal';
import {ClinicService} from './services/clinic.service';
import {ThemeService} from './services/theme.service';
import {TranslationService} from './services/translation.service';
import {SeoService} from './services/seo.service';
import {ReadingProgressBarComponent} from './components/reading-progress-bar/reading-progress-bar';
import {WhatsAppIconComponent} from './components/whatsapp-icon/whatsapp-icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    WhatsAppModalComponent,
    SearchModalComponent,
    ReadingProgressBarComponent,
    WhatsAppIconComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  clinic = inject(ClinicService);
  theme = inject(ThemeService);
  i18n = inject(TranslationService);
  seo = inject(SeoService);

  constructor() {
    this.seo.init();
  }

  isWhatsAppModalOpen = signal<boolean>(false);
  isSearchModalOpen = signal<boolean>(false);

  openWhatsAppModal() {
    this.isWhatsAppModalOpen.set(true);
  }

  closeWhatsAppModal() {
    this.isWhatsAppModalOpen.set(false);
  }

  openSearchModal() {
    this.isSearchModalOpen.set(true);
  }

  closeSearchModal() {
    this.isSearchModalOpen.set(false);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.isSearchModalOpen.update((v) => !v);
    }
    if (event.key === 'Escape') {
      this.isSearchModalOpen.set(false);
      this.isWhatsAppModalOpen.set(false);
    }
  }
}
