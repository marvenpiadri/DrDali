import {ChangeDetectionStrategy, Component, output, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ClinicService} from '../../services/clinic.service';
import {TranslationService} from '../../services/translation.service';
import {ClinicMapComponent} from '../../components/clinic-map/clinic-map';
import {FaqAccordionComponent} from '../../components/faq-accordion/faq-accordion';
import {WhatsAppIconComponent} from '../../components/whatsapp-icon/whatsapp-icon';
import {TranslatePipe} from '../../pipes/translate.pipe';

@Component({
  selector: 'app-clinic',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ClinicMapComponent, FaqAccordionComponent, WhatsAppIconComponent, TranslatePipe],
  templateUrl: './clinic.html',
  styleUrl: './clinic.css',
})
export class ClinicComponent {
  clinic = inject(ClinicService);
  i18n = inject(TranslationService);
  openWhatsApp = output<void>();
}
