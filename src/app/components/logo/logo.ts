import {ChangeDetectionStrategy, Component, input, signal, computed, inject} from '@angular/core';
import {TranslationService} from '../../services/translation.service';
import {ThemeService} from '../../services/theme.service';

@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './logo.html',
  styleUrl: './logo.css',
})
export class LogoComponent {
  i18n = inject(TranslationService);
  theme = inject(ThemeService);

  size = input<number>(44);
  textHeight = input<number>(40);
  showText = input<boolean>(true);
  showSubtitle = input<boolean>(false);
  isNavbar = input<boolean>(false);
  containerClass = input<string>('');

  hasImageError = signal<boolean>(false);
  hasTextError = signal<boolean>(false);

  logoSrc = computed(() => {
    return this.theme.isDark() ? 'assets/dali_light.png' : 'assets/dali_black.png';
  });

  logoTextSrc = computed(() => {
    return this.theme.isDark() ? 'assets/dali_text_light.png' : 'assets/dali_text_black.png';
  });

  onImageError() {
    this.hasImageError.set(true);
  }

  onTextError() {
    this.hasTextError.set(true);
  }
}
