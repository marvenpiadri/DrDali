import {Injectable} from '@angular/core';
import {Doctor} from '../models/doctor.model';

export interface ConsultationReason {
  id: string;
  label: string;
  description: string;
  urgency: 'normale' | 'prioritaire' | 'urgence';
  defaultMessage: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClinicService {
  readonly clinicName = 'Demo';
  readonly doctorName = 'Dr. Adam Bennett';
  readonly city = 'Témara';
  readonly country = 'Morocco';
  readonly address = 'Avenue Hassan II, Résidence Al Manar, Témara, Morocco';
  readonly phone = '+212 610 405 164';
  readonly whatsappPhone = '212610405164'; // Official clinic WhatsApp contact
  readonly googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=Avenue+Hassan+II+Residence+Al+Manar+Temara+Morocco';
  readonly openingHours = 'Sample hours: Monday–Friday, 09:00–17:00';

  // Doctor profiles intentionally contain names only until the clinic supplies approved biographies and portraits.
  readonly doctors: Doctor[] = [
    {
      id: 'dr-youssef-dali',
      name: 'Dr. Youssef Dali',
      title: {fr: '', ar: '', en: ''},
      specialties: {fr: [], ar: [], en: []},
      diplomas: {fr: [], ar: [], en: []},
      bio: {fr: '', ar: '', en: ''},
      quote: {fr: '', ar: '', en: ''},
      languages: [],
      initials: '',
      colorAccent: '',
    },
    {
      id: 'dr-yassine-ibrahimi',
      name: 'Dr. Yassine Ibrahimi',
      title: {fr: '', ar: '', en: ''},
      specialties: {fr: [], ar: [], en: []},
      diplomas: {fr: [], ar: [], en: []},
      bio: {fr: '', ar: '', en: ''},
      quote: {fr: '', ar: '', en: ''},
      languages: [],
      initials: '',
      colorAccent: '',
    },
  ];

  get clinicInfo() {
    return {
      name: this.clinicName,
      doctor: this.doctorName,
      doctors: this.doctors,
      address: this.address,
      city: this.city,
      country: this.country,
      phone: this.phone,
      whatsappNumber: this.whatsappPhone,
      openingHours: this.openingHours,
      googleMapsUrl: this.googleMapsUrl,
    };
  }

  readonly consultationReasons: ConsultationReason[] = [
    {
      id: 'first_visit',
      label: 'Première consultation & Bilan global',
      description: 'Bilan bucco-dentaire complet, examen radiologique et plan de traitement personnalisé.',
      urgency: 'normale',
      defaultMessage: 'Bonjour Demo. Je souhaite planifier une première consultation pour un bilan bucco-dentaire complet à Témara.',
    },
    {
      id: 'emergency',
      label: 'Urgence dentaire (Douleur / Gonflement / Choc)',
      description: 'Prise en charge rapide pour soulager une douleur aiguë, un abcès ou une dent fracturée.',
      urgency: 'urgence',
      defaultMessage: 'URGENCE DENTAIRE : Bonjour Demo. Je souffre d\'une urgence dentaire aiguë (douleur intense/gonflement/traumatisme) et j\'ai besoin d\'une prise en charge rapide.',
    },
    {
      id: 'orthodontics',
      label: 'Orthodontie & Aligneurs Invisibles',
      description: 'Alignement dentaire esthétique pour adultes et adolescents, gouttières transparentes.',
      urgency: 'normale',
      defaultMessage: 'Bonjour Demo. Je souhaite un avis spécialisé concernant un alignement dentaire ou un traitement par gouttières invisibles.',
    },
    {
      id: 'implants',
      label: 'Implantologie & Remplacement de dents',
      description: 'Remplacement de dents manquantes par implants en titane et couronnes céramiques.',
      urgency: 'normale',
      defaultMessage: 'Bonjour Demo. Je souhaite une consultation concernant la pose d\'implants dentaires ou le remplacement de dents absentes.',
    },
    {
      id: 'endodontics',
      label: 'Soin de carie / Traitement de racine',
      description: 'Traitement conservateur, dévitalisation et restauration sous microscope.',
      urgency: 'prioritaire',
      defaultMessage: 'Bonjour Demo. Je ressens une douleur/sensibilité sur une dent et je souhaite prendre rendez-vous pour un diagnostic et soin conservateur.',
    },
    {
      id: 'pedodontics',
      label: 'Soins pour Enfant (Pédodontie)',
      description: 'Prise en charge douce, prévention des caries et accompagnement bienveillant pour enfants.',
      urgency: 'normale',
      defaultMessage: 'Bonjour Demo. Je souhaite prendre rendez-vous pour mon enfant pour une consultation de contrôle et soins en pédodontie.',
    },
    {
      id: 'aesthetics',
      label: 'Esthétique du sourire (Facettes / Éclaircissement)',
      description: 'Harmonisation du sourire, facettes céramiques haute précision et éclaircissement clinique.',
      urgency: 'normale',
      defaultMessage: 'Bonjour Demo. J\'aimerais planifier une consultation dédiée à l\'esthétique de mon sourire (facettes / éclaircissement).',
    },
    {
      id: 'periodontics',
      label: 'Parodontologie (Saignement / Déchaussement)',
      description: 'Soins des gencives, surfaçage radiculaire et stabilisation osseuse.',
      urgency: 'prioritaire',
      defaultMessage: 'Bonjour Demo. Je constate des saignements de gencives / mobilité et souhaite un examen parodontal complet.',
    },
  ];

  isClinicOpenNow(): boolean {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hour = now.getHours();
    const min = now.getMinutes();
    const time = hour + min / 60;

    if (day === 0) {
      return false; // Sunday closed
    }
    if (day >= 1 && day <= 5) {
      // Monday to Friday: 9h00 to 19h00
      return time >= 9.0 && time < 19.0;
    }
    if (day === 6) {
      // Saturday: 9h00 to 14h00
      return time >= 9.0 && time < 14.0;
    }
    return false;
  }

  generateWhatsAppUrl(reasonId = 'first_visit', patientName?: string, customNote?: string, preferredDoctor?: string): string {
    const reason = this.consultationReasons.find((r) => r.id === reasonId) || this.consultationReasons[0];
    let text = reason.defaultMessage;
    
    if (preferredDoctor) {
      text += `\nPraticien souhaité : ${preferredDoctor}`;
    }
    if (patientName && patientName.trim()) {
      text += `\nNom du patient : ${patientName.trim()}`;
    }
    if (customNote && customNote.trim()) {
      text += `\nPrécisions : ${customNote.trim()}`;
    }
    text += `\n\n(Demo message — not a real appointment request)`;

    const cleanNumber = this.whatsappPhone.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  }
}
