import {ChangeDetectionStrategy, Component, output, inject} from '@angular/core';
import {ReactiveFormsModule, FormControl, FormGroup} from '@angular/forms';
import {ClinicService} from '../../services/clinic.service';
import {TranslationService} from '../../services/translation.service';
import {WhatsAppIconComponent} from '../whatsapp-icon/whatsapp-icon';
import {TranslatePipe} from '../../pipes/translate.pipe';

@Component({
  selector: 'app-whatsapp-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, WhatsAppIconComponent, TranslatePipe],
  templateUrl: './whatsapp-modal.html',
  styleUrl: './whatsapp-modal.css',
})
export class WhatsAppModalComponent {
  clinic = inject(ClinicService);
  i18n = inject(TranslationService);
  closeModal = output<void>();

  contactForm = new FormGroup({
    preferredDoctor: new FormControl(''),
    reasonId: new FormControl('first_visit'),
    patientName: new FormControl(''),
    customNote: new FormControl(''),
  });

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).id === 'whatsapp-modal-container') return;
    if ((event.target as HTMLElement).closest('#whatsapp-modal-container')) return;
    this.closeModal.emit();
  }

  sendWhatsApp() {
    const values = this.contactForm.value;
    const url = this.clinic.generateWhatsAppUrl(
      values.reasonId || 'first_visit',
      values.patientName || '',
      values.customNote || '',
      values.preferredDoctor || ''
    );
    window.open(url, '_blank', 'noopener,noreferrer');
    this.closeModal.emit();
  }
}
