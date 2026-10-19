import {ChangeDetectionStrategy, Component, output, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ClinicService} from '../../services/clinic.service';
import {DoctorSliderComponent} from '../../components/doctor-slider/doctor-slider';
import {TranslatePipe} from '../../pipes/translate.pipe';

@Component({
  selector: 'app-doctor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DoctorSliderComponent, TranslatePipe],
  templateUrl: './doctor.html',
  styleUrl: './doctor.css',
})
export class DoctorComponent {
  clinic = inject(ClinicService);
  openWhatsApp = output<void>();

  onBookWithDoctor(event: {doctorName: string}) {
    const url = this.clinic.generateWhatsAppUrl('first_visit', '', '', event.doctorName);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  contactDoctor(doctorName: string) {
    const url = this.clinic.generateWhatsAppUrl('first_visit', '', '', doctorName);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
