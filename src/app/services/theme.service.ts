import {Injectable, signal, effect, PLATFORM_ID, inject} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  
  // Default to light mode (as requested: default to sophisticated light scheme with intentional dark mode)
  isDark = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('cdd_theme');
      if (savedTheme) {
        this.isDark.set(savedTheme === 'dark');
      } else {
        const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
        this.isDark.set(prefersDark);
      }
      this.applyTheme(this.isDark());
    }

    effect(() => {
      const dark = this.isDark();
      if (isPlatformBrowser(this.platformId)) {
        this.applyTheme(dark);
        localStorage.setItem('cdd_theme', dark ? 'dark' : 'light');
      }
    });
  }

  toggleTheme() {
    this.isDark.update((v) => !v);
  }

  setTheme(dark: boolean) {
    this.isDark.set(dark);
  }

  private applyTheme(dark: boolean) {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
