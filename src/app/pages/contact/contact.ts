import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';
import {ClinicService} from '../../services/clinic.service';
import {TranslationService} from '../../services/translation.service';
import {ClinicMapComponent} from '../../components/clinic-map/clinic-map';
import {WhatsAppIconComponent} from '../../components/whatsapp-icon/whatsapp-icon';
import {TranslatePipe} from '../../pipes/translate.pipe';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ReactiveFormsModule, ClinicMapComponent, WhatsAppIconComponent, TranslatePipe],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactComponent {
  clinic = inject(ClinicService);
  i18n = inject(TranslationService);

  contactForm = new FormGroup({
    preferredDoctor: new FormControl(''),
    reasonId: new FormControl('first_visit'),
    patientName: new FormControl(''),
    customNote: new FormControl(''),
  });

  sendWhatsApp() {
    const values = this.contactForm.value;
    const url = this.clinic.generateWhatsAppUrl(
      values.reasonId || 'first_visit',
      values.patientName || '',
      values.customNote || '',
      values.preferredDoctor || ''
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
