import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {TranslationService} from '../../services/translation.service';
import {TranslatePipe} from '../../pipes/translate.pipe';

@Component({
  selector: 'app-reading-progress-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './reading-progress-bar.html',
  styleUrl: './reading-progress-bar.css',
})
export class ReadingProgressBarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly i18n = inject(TranslationService);

  readonly progress = signal<number>(0);
  readonly isVisible = signal<boolean>(false);
  readonly isArticleRoute = signal<boolean>(false);

  ngOnInit() {
    this.checkRoute(this.router.url);

    // Listen to route changes
    const routerSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        const nav = e as NavigationEnd;
        this.checkRoute(nav.urlAfterRedirects || nav.url);
        this.updateProgress();
      });

    // Listen to window scroll & resize events
    const onScroll = () => this.updateProgress();
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
    }

    this.destroyRef.onDestroy(() => {
      routerSub.unsubscribe();
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    });

    this.updateProgress();
  }

  private checkRoute(url: string) {
    const isArticle =
      url.includes('/atlas') ||
      url.includes('/encyclopedia') ||
      url.includes('/dictionary') ||
      url.includes('/dr-dali') ||
      url.includes('/tools');
    this.isArticleRoute.set(isArticle);
  }

  private updateProgress() {
    if (typeof window === 'undefined') return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight || 0;
    const scrollableHeight = docHeight - clientHeight;

    if (scrollableHeight > 250) {
      const percentage = Math.min(100, Math.max(0, (scrollTop / scrollableHeight) * 100));
      this.progress.set(Math.round(percentage));
      this.isVisible.set(scrollTop > 60);
    } else {
      this.progress.set(0);
      this.isVisible.set(false);
    }
  }

  scrollToTop() {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
