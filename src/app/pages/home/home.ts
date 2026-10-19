import {ChangeDetectionStrategy, Component, output, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ClinicService} from '../../services/clinic.service';
import {EncyclopediaService} from '../../services/encyclopedia.service';
import {TranslationService} from '../../services/translation.service';
import {DoctorSliderComponent} from '../../components/doctor-slider/doctor-slider';
import {CompactToothPreviewComponent} from '../../components/compact-tooth-preview/compact-tooth-preview';
import {Jawline3dViewerComponent} from '../../components/jawline-3d-viewer/jawline-3d-viewer';
import {ClinicMapComponent} from '../../components/clinic-map/clinic-map';
import {FaqAccordionComponent} from '../../components/faq-accordion/faq-accordion';
import {WhatsAppIconComponent} from '../../components/whatsapp-icon/whatsapp-icon';
import {TranslatePipe} from '../../pipes/translate.pipe';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    DoctorSliderComponent,
    CompactToothPreviewComponent,
    Jawline3dViewerComponent,
    ClinicMapComponent,
    FaqAccordionComponent,
    WhatsAppIconComponent,
    TranslatePipe,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  clinic = inject(ClinicService);
  encyclopedia = inject(EncyclopediaService);
  i18n = inject(TranslationService);

  openWhatsApp = output<void>();

  openWhatsAppWithDoctor(event: {doctorName: string}) {
    const url = this.clinic.generateWhatsAppUrl('first_visit', '', '', event.doctorName);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  openWhatsAppEmergency() {
    const url = this.clinic.generateWhatsAppUrl('emergency');
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
