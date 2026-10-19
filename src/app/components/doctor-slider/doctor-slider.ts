import {ChangeDetectionStrategy, Component, signal, output, inject} from '@angular/core';
import {ClinicService} from '../../services/clinic.service';
import {TranslationService} from '../../services/translation.service';
import {Doctor} from '../../models/doctor.model';
import {WhatsAppIconComponent} from '../whatsapp-icon/whatsapp-icon';

@Component({
  selector: 'app-doctor-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WhatsAppIconComponent],
  templateUrl: './doctor-slider.html',
  styleUrl: './doctor-slider.css',
})
export class DoctorSliderComponent {
  clinic = inject(ClinicService);
  i18n = inject(TranslationService);
  openWhatsApp = output<{doctorName: string}>();

  readonly doctors: Doctor[] = this.clinic.doctors;
  currentIndex = signal<number>(0);

  nextSlide() {
    // Infinite forward navigation
    this.currentIndex.update((prev) => (prev + 1) % this.doctors.length);
  }

  prevSlide() {
    // Infinite backward navigation
    this.currentIndex.update((prev) => (prev - 1 + this.doctors.length) % this.doctors.length);
  }

  goToSlide(index: number) {
    if (index >= 0 && index < this.doctors.length) {
      this.currentIndex.set(index);
    }
  }

  getTitle(doc: Doctor): string {
    const lang = this.i18n.currentLang();
    return doc.title[lang] || doc.title.fr;
  }

  getBio(doc: Doctor): string {
    const lang = this.i18n.currentLang();
    return doc.bio[lang] || doc.bio.fr;
  }

  getQuote(doc: Doctor): string {
    const lang = this.i18n.currentLang();
    return doc.quote[lang] || doc.quote.fr;
  }

  getSpecialties(doc: Doctor): string[] {
    const lang = this.i18n.currentLang();
    return doc.specialties[lang] || doc.specialties.fr;
  }

  getDiplomas(doc: Doctor): string[] {
    const lang = this.i18n.currentLang();
    return doc.diplomas[lang] || doc.diplomas.fr;
  }

  bookWithDoctor(doc: Doctor) {
    const url = this.clinic.generateWhatsAppUrl('first_visit', '', '', doc.name);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
