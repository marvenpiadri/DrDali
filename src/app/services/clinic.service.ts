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
  readonly clinicName = 'Centre Dentaire Dali';
  readonly doctorName = 'Dr. Youssef Dali';
  readonly city = 'Témara';
  readonly country = 'Maroc';
  readonly address = 'Centre Dentaire Dali, Avenue Hassan II, Témara, Maroc';
  readonly phone = '+212 5 37 60 XX XX';
  readonly whatsappPhone = '+212661000000'; // WhatsApp contact gateway
  readonly googleMapsUrl = 'https://maps.google.com/?q=Temara+Morocco+Centre+Dentaire';
  readonly openingHours = 'Lundi au Vendredi : 09h00 – 19h00 | Samedi : 09h00 – 14h00';

  // The two doctors of Centre Dentaire Dali
  readonly doctors: Doctor[] = [
    {
      id: 'dr-youssef-dali',
      name: 'Dr. Youssef Dali',
      title: {
        fr: 'Chirurgien-Dentiste Fondateur',
        ar: 'جراح أسنان ومؤسس المركز',
        en: 'Founder & Dental Surgeon',
      },
      specialties: {
        fr: [
          'Implantologie & Micro-Chirurgie',
          'Parodontologie & Régénération Osseuse',
          'Réhabilitation Esthétique & Facettes',
          'Endodontie Microscopique',
        ],
        ar: [
          'زراعة الأسنان والجراحة الدقيقة',
          'علاج اللثة وتجديد العظام',
          'تجميل الابتسامة والعدسات الخزفية',
          'علاج الجذور بالميكروسكوب',
        ],
        en: [
          'Implantology & Micro-Surgery',
          'Periodontics & Bone Regeneration',
          'Aesthetic Rehabilitation & Veneers',
          'Microscopic Endodontics',
        ],
      },
      diplomas: {
        fr: [
          'Diplôme d\'État de Docteur en Chirurgie Dentaire',
          'Certificat d\'Études Supérieures en Implantologie Orale',
          'Formation Internationale en Chirurgie Parodontale et Muco-Gingivale',
          'Membre des Sociétés Scientifiques d\'Implantologie & Parodontologie',
        ],
        ar: [
          'دبلوم الدولة في جراحة الأسنان',
          'شهادة الدراسات العليا في زراعة الأسنان',
          'تكوين دولي في جراحة اللثة المتقدمة',
          'عضو الجمعيات العلمية لزراعة الأسنان وعلاج اللثة',
        ],
        en: [
          'State Diploma in Dental Surgery',
          'Advanced Graduate Certificate in Oral Implantology',
          'International Training in Periodontal and Mucogingival Surgery',
          'Member of Scientific Societies of Implantology and Periodontology',
        ],
      },
      bio: {
        fr: 'Animé par la conviction que la dentisterie moderne repose sur la micro-dentisterie adhésive, la précision numérique et une écoute bienveillante, Dr. Youssef Dali met un point d\'honneur à préserver au maximum les tissus dentaires naturels.',
        ar: 'مسترشداً بقناعة أن طب الأسنان الحديث يقوم على الدقة الرقمية والعلاجات المحافظة، يحرص د. يوسف دالي على الحفاظ على الأنسجة الطبيعية للأسنان وتقديم رعاية مبنية على الراحة والثقة.',
        en: 'Driven by the conviction that modern dentistry is rooted in adhesive micro-dentistry, digital precision, and compassionate listening, Dr. Youssef Dali emphasizes preserving natural tooth structure whenever possible.',
      },
      quote: {
        fr: 'La confiance ne se réclame pas : elle se construit par la rigueur de chaque geste et le respect du bien-être du patient.',
        ar: 'الثقة لا تُطلب بل تُبنى بدقة كل حركة واحترام راحة المريض وسلامته.',
        en: 'Trust is not claimed: it is built through the precision of every action and deep respect for patient well-being.',
      },
      languages: ['Français', 'Arabe', 'Anglais'],
      initials: 'YD',
      colorAccent: 'emerald',
    },
    {
      id: 'dr-kenza-dali',
      name: 'Dr. Kenza Dali',
      title: {
        fr: 'Chirurgien-Dentiste Associée',
        ar: 'جراحة أسنان مشاركة بالمركز',
        en: 'Associate Dental Surgeon',
      },
      specialties: {
        fr: [
          'Orthodontie par Aligneurs Invisibles',
          'Pédodontie & Soins des Enfants',
          'Dentisterie Conservatrice Mini-Invasive',
          'Éclaircissement & Esthétique Douce',
        ],
        ar: [
          'تقويم الأسنان بالصفائح الشفافة (الإنفيزلاين)',
          'طب أسنان الأطفال والناشئة',
          'العلاجات التحفظية اللطيفة',
          'تبييض الأسنان والعلاجات التجميلية',
        ],
        en: [
          'Clear Aligner Orthodontics',
          'Pediatric Dentistry',
          'Minimally Invasive Conservative Care',
          'Teeth Whitening & Smile Aesthetics',
        ],
      },
      diplomas: {
        fr: [
          'Diplôme d\'État de Docteur en Chirurgie Dentaire',
          'Certification Spécialisée en Orthodontie par Aligneurs Transparents',
          'Formation Approfondie en Pédodontie et Gestion de l\'Anxiété Dentaire',
          'Pratique de la Dentisterie Mini-Invasive et Préventive',
        ],
        ar: [
          'دبلوم الدولة في جراحة الأسنان',
          'شهادة معتمدة في تقويم الأسنان الشفاف',
          'تكوين متقدم في طب أسنان الأطفال وإدارة قلق العلاج',
          'ممارسة طب الأسنان التحفظي الوقائي',
        ],
        en: [
          'State Diploma in Dental Surgery',
          'Certified Specialist in Clear Aligner Orthodontics',
          'Advanced Training in Pediatric Dentistry & Dental Anxiety Management',
          'Practice of Minimally Invasive & Preventive Dentistry',
        ],
      },
      bio: {
        fr: 'Passionnée par l\'harmonie des sourires chez l\'adulte et la prise en charge précoce et douce chez l\'enfant, Dr. Kenza Dali applique des approches modernes d\'alignement invisible et met en confiance les patients de tous âges.',
        ar: 'شغوفة بتناسق الابتسامات لدى البالغين والعناية اللطيفة والمبكرة بأسنان الأطفال، تطبق د. كنزة دالي أحدث تقنيات التقويم الشفاف وتبث الاطمئنان لدى المرضى من جميع الأعمار.',
        en: 'Passionate about smile harmony for adults and gentle, early interceptive care for children, Dr. Kenza Dali applies modern clear aligner technology while creating an anxiety-free atmosphere for all patients.',
      },
      quote: {
        fr: 'Un beau sourire commence dès le plus jeune âge dans la douceur et la sérénité.',
        ar: 'الابتسامة الجميلة تبدأ منذ الصغر في جو من اللطف والهدوء التام.',
        en: 'A radiant smile begins early in an atmosphere of gentleness and reassurance.',
      },
      languages: ['Français', 'Arabe', 'Anglais'],
      initials: 'KD',
      colorAccent: 'amber',
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
      defaultMessage: 'Bonjour Centre Dentaire Dali. Je souhaite planifier une première consultation pour un bilan bucco-dentaire complet à Témara.',
    },
    {
      id: 'emergency',
      label: 'Urgence dentaire (Douleur / Gonflement / Choc)',
      description: 'Prise en charge rapide pour soulager une douleur aiguë, un abcès ou une dent fracturée.',
      urgency: 'urgence',
      defaultMessage: 'URGENCE DENTAIRE : Bonjour Centre Dentaire Dali. Je souffre d\'une urgence dentaire aiguë (douleur intense/gonflement/traumatisme) et j\'ai besoin d\'une prise en charge rapide.',
    },
    {
      id: 'orthodontics',
      label: 'Orthodontie & Aligneurs Invisibles',
      description: 'Alignement dentaire esthétique pour adultes et adolescents, gouttières transparentes.',
      urgency: 'normale',
      defaultMessage: 'Bonjour Centre Dentaire Dali. Je souhaite un avis spécialisé concernant un alignement dentaire ou un traitement par gouttières invisibles.',
    },
    {
      id: 'implants',
      label: 'Implantologie & Remplacement de dents',
      description: 'Remplacement de dents manquantes par implants en titane et couronnes céramiques.',
      urgency: 'normale',
      defaultMessage: 'Bonjour Dr. Dali. Je souhaite une consultation concernant la pose d\'implants dentaires ou le remplacement de dents absentes.',
    },
    {
      id: 'endodontics',
      label: 'Soin de carie / Traitement de racine',
      description: 'Traitement conservateur, dévitalisation et restauration sous microscope.',
      urgency: 'prioritaire',
      defaultMessage: 'Bonjour Centre Dentaire Dali. Je ressens une douleur/sensibilité sur une dent et je souhaite prendre rendez-vous pour un diagnostic et soin conservateur.',
    },
    {
      id: 'pedodontics',
      label: 'Soins pour Enfant (Pédodontie)',
      description: 'Prise en charge douce, prévention des caries et accompagnement bienveillant pour enfants.',
      urgency: 'normale',
      defaultMessage: 'Bonjour Centre Dentaire Dali. Je souhaite prendre rendez-vous pour mon enfant pour une consultation de contrôle et soins en pédodontie.',
    },
    {
      id: 'aesthetics',
      label: 'Esthétique du sourire (Facettes / Éclaircissement)',
      description: 'Harmonisation du sourire, facettes céramiques haute précision et éclaircissement clinique.',
      urgency: 'normale',
      defaultMessage: 'Bonjour Centre Dentaire Dali. J\'aimerais planifier une consultation dédiée à l\'esthétique de mon sourire (facettes / éclaircissement).',
    },
    {
      id: 'periodontics',
      label: 'Parodontologie (Saignement / Déchaussement)',
      description: 'Soins des gencives, surfaçage radiculaire et stabilisation osseuse.',
      urgency: 'prioritaire',
      defaultMessage: 'Bonjour Centre Dentaire Dali. Je constate des saignements de gencives / mobilité et souhaite un examen parodontal complet.',
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
    text += `\n\n(Envoyé depuis la plateforme Centre Dentaire Dali)`;

    const cleanNumber = this.whatsappPhone.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  }
}
