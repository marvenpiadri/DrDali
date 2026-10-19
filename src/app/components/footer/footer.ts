import {ChangeDetectionStrategy, Component, output, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {LogoComponent} from '../logo/logo';
import {ClinicService} from '../../services/clinic.service';
import {TranslationService} from '../../services/translation.service';
import {WhatsAppIconComponent} from '../whatsapp-icon/whatsapp-icon';
import {TranslatePipe} from '../../pipes/translate.pipe';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LogoComponent, WhatsAppIconComponent, TranslatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  clinic = inject(ClinicService);
  i18n = inject(TranslationService);
  openWhatsApp = output<void>();
}
