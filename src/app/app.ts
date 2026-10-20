import {ChangeDetectionStrategy, Component, signal, HostListener, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './components/header/header';
import {FooterComponent} from './components/footer/footer';
import {SearchModalComponent} from './components/search-modal/search-modal';
import {SeoService} from './services/seo.service';
import {ReadingProgressBarComponent} from './components/reading-progress-bar/reading-progress-bar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SearchModalComponent,
    ReadingProgressBarComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  seo = inject(SeoService);

  constructor() {
    this.seo.init();
  }

  isSearchModalOpen = signal<boolean>(false);

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
    }
  }
}
