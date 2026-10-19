import {Injectable, signal} from '@angular/core';
import {DentalArticle, DictionaryTerm} from '../models/encyclopedia.model';

@Injectable({
  providedIn: 'root',
})
export class EncyclopediaService {
  private articlesSignal = signal<DentalArticle[]>([
    // --- CONDITIONS ---
    {
      id: 'art-caries',
      slug: 'dental-caries',
      title: 'La Carie Dentaire : Étiologie, Progression et Traitement',
      category: 'conditions',
      categoryLabel: 'Pathologies',
      summary: 'Maladie infectieuse multifactorielle détruisant progressivement les tissus durs de la dent (émail, dentine) sous l’action d’acides sécrétés par le biofilm bactérien.',
      readingTimeMinutes: 6,
      lastReviewed: 'Mars 2026',
      reviewer: {
        name: 'Dr. Youssef Dali',
        title: 'Chirurgien-Dentiste, Docteur en Sciences Odontologiques',
        credentials: 'Chirurgien-Dentiste, Implantologie & Esthétique',
        role: 'Directeur Clinique & Réviseur Scientifique',
      },
      keyFacts: [
        'Causée par la fermentation des sucres alimentaires par des bactéries cariogènes (Streptococcus mutans).',
        'Réversible au stade initial de déminéralisation (tache blanche) grâce aux fluorures.',
        'Totalement indolore au stade de l’émail : la douleur apparaît lorsque la dentine ou la pulpe est atteinte.',
        'La prévention repose sur la triade : brossage minutieux, fluor et réduction de la fréquence des sucres.',
      ],
      symptoms: [
        'Tache crayeuse blanche ou coloration brune/noire sur un sillon ou entre deux dents',
        'Sensibilité passagère au froid, au chaud ou au sucre',
        'Douleur persistante à la mastication lorsque la cavité s’approfondit',
        'Sensation d’accrochage du fil dentaire ou débris alimentaires récurrents',
      ],
      causes: [
        'Biofilm bactérien (plaque dentaire) non éliminé régulièrement',
        'Consommation fréquente de glucides fermentescibles (sucres simples, sodas)',
        'Qualité de la salive (débit réduit, pouvoir tampon salivaire insuffisant)',
        'Anatomie des sillons occlusaux profonds et zones de contact serrées',
      ],
      riskFactors: [
        'Hygiène bucco-dentaire irrégulière ou inadaptée',
        'Grignotage fréquent tout au long de la journée',
        'Xérostomie (sécheresse buccale médicamenteuse ou systémique)',
        'Reflux gastro-œsophagien augmentant l’acidité buccale',
      ],
      prevention: [
        'Brossage biquotidien avec un dentifrice fluoré (1450 ppm)',
        'Passage quotidien du fil dentaire ou brossettes interdentaires',
        'Scellement préventif des sillons (sealants) chez les enfants et adolescents',
        'Visite de contrôle annuelle pour détecter les lésions débutantes par transillumination ou radiographie',
      ],
      treatmentOverview: [
        'Stade amélaire : reminéralisation non invasive au fluorure ou vernis bioactif',
        'Stade dentinaire : curetage de la carie et obturation composite esthétique adhésive',
        'Stade pulpaire : traitement endodontique (dévitalisation) suivi d’une restauration coronotradiculaire ou couronne',
      ],
      whenToSeekCare: [
        'Apparition d’une sensibilité inhabituelle au froid ou au chaud',
        'Douleur spontanée, lancinante ou réveillant la nuit',
        'Sensation de cavité ou d’aspérité ressentie avec la langue',
      ],
      sections: [
        {
          title: 'Mécanisme physiopathologique',
          content: 'La carie dentaire n’est pas une simple cavité mécanique, mais un processus dynamique d’alternance entre déminéralisation et reminéralisation. Lorsque le pH buccal descend en dessous du seuil critique de 5,5, l’hydroxyapatite de l’émail commence à se dissoudre. Si ce déséquilibre persiste, la trame minérale cède et laisse place à une cavitation irréversible.',
          clinicalNote: 'La détection précoce permet d’éviter le recours au fraisage grâce aux techniques de reminéralisation et de scellement.',
        },
        {
          title: 'Stades d’évolution clinique',
          content: 'L’évolution se décompose en 4 phases distinctes : le stade de la lésion carieuse initiale (émail intact), la carie dentinaire superficielle (tubules ouverts, hypersensibilité), la carie dentinaire profonde (proximité de la chambre pulpaire) et la pulpite irréversible (rage de dent).',
          bulletPoints: [
            'Stade 1 : Déminéralisation amélaire (réversible)',
            'Stade 2 : Atteinte dentinaire (nécessite une restauration)',
            'Stade 3 : Hyperhémie et pulpite (risque vital pour la pulpe)',
            'Stade 4 : Nécrose pulpaire et risque d’abcès apical',
          ],
        },
      ],
      relatedArticles: [
        { title: 'Traitement de Canal & Endodontie', slug: 'root-canal', category: 'treatments' },
        { title: 'L’Émail Dentaire : Structure et Résistance', slug: 'enamel', category: 'anatomy' },
        { title: 'Sensibilité Dentaire : Origines et Prise en Charge', slug: 'tooth-sensitivity', category: 'conditions' },
      ],
      relatedTreatments: ['Obturation composite adhésive', 'Inlay / Onlay céramique', 'Traitement endodontique'],
      relatedAnatomy: ['Émail', 'Dentine', 'Pulpe dentaire'],
      faqs: [
        {
          question: 'Une carie peut-elle guérir d’elle-même sans fraiser ?',
          answer: 'Uniquement au tout premier stade (déminéralisation amélaire superficielle) si l’émail n’est pas cavitaire, grâce au brossage fluoré et à une alimentation équilibrée. Dès qu’un trou se forme, l’intervention du praticien est indispensable.',
        },
        {
          question: 'Pourquoi une carie profonde fait-elle mal la nuit ?',
          answer: 'En position allongée, la pression sanguine céphalique augmente, ce qui accroît la pression intrapulpaire dans une chambre inextensible, provoquant des douleurs pulsatiles vives.',
        },
      ],
      tags: ['carie', 'émail', 'dentine', 'biofilm', 'obturation', 'prévention'],
    },

    {
      id: 'art-periodontitis',
      slug: 'periodontitis',
      title: 'Parodontite & Déchaussement : Comprendre la Perte Osseuse',
      category: 'conditions',
      categoryLabel: 'Pathologies',
      summary: 'Infection chronique des tissus de soutien de la dent (gencive, ligament parodontal, os alvéolaire) menant progressivement à la mobilité et à la perte dentaire si elle n’est pas stabilisée.',
      readingTimeMinutes: 7,
      lastReviewed: 'Février 2026',
      reviewer: {
        name: 'Dr. Youssef Dali',
        title: 'Chirurgien-Dentiste, Docteur en Sciences Odontologiques',
        credentials: 'Chirurgien-Dentiste, Implantologie & Esthétique',
        role: 'Directeur Clinique & Réviseur Scientifique',
      },
      keyFacts: [
        'Succède généralement à une gingivite non soignée, mais implique une destruction osseuse irréversible.',
        'Cause n°1 de perte de dents chez l’adulte de plus de 40 ans.',
        'La parodontite est souvent silencieuse et indolore à ses débuts.',
        'Fortement corrélée aux maladies cardiovasculaires et au diabète déséquilibré.',
      ],
      symptoms: [
        'Gencives rouges, tuméfiées ou qui saignent au brossage et à l’utilisation du fil',
        'Rétraction gingivale donnant l’impression que les dents "s’allongent"',
        'Apparition d’espaces noirs interdentaires ou déplacements de dents',
        'Mobilité dentaire progressive ou douleur à la pression masticatoire',
        'Mauvaise haleine persistante (halitose parodontale)',
      ],
      causes: [
        'Accumulation sous-gingivale de tartre et de bactéries anaérobies agressives',
        'Réponse inflammatoire et immunitaire inappropriée de l’hôte détruisant ses propres tissus',
        'Prédisposition génétique influençant la virulence de l’inflammation',
      ],
      riskFactors: [
        'Tabagisme (augmente le risque par 3 à 6 et masque les saignements)',
        'Diabète mal équilibré',
        'Stress chronique affaiblissant la réponse immunitaire',
        'Malpositions dentaires rendant le nettoyage complexe',
      ],
      prevention: [
        'Détartrage supra et sous-gingival régulier au cabinet dentaire',
        'Usage quotidien de brossettes interdentaires calibrées',
        'Arrêt du tabac et contrôle glycémique strict',
      ],
      treatmentOverview: [
        'Bilan parodontal complet avec sondage des poches et radiographies panoramiques/long-cône',
        'Désinfection et surfaçage radiculaire (lithotritie sous anesthésie locale)',
        'Réévaluation parodontale à 8-12 semaines et maintenance parodontale trimestrielle ou semestrielle',
        'Chirurgies régénératrices ou assainissement en cas de poches profondes résiduelles',
      ],
      whenToSeekCare: [
        'Saignements récurrents au brossage ou au réveil',
        'Sensation de dent qui bouge ou qui change de position',
        'Présence de pus à la jonction entre la gencive et la dent',
      ],
      sections: [
        {
          title: 'De la gingivite à la parodontite',
          content: 'La gingivite est une inflammation réversible confinée à la gencive superficielle. En l’absence de prise en charge, les bactéries migrent sous le sulcus gingival, créant une poche parodontale. L’organisme réagit par une cascade enzymatique qui détruit l’os alvéolaire pour éloigner le front osseux de l’infection.',
          clinicalNote: 'Une fois l’os résorbé, il ne se régénère pas spontanément : l’objectif premier du traitement est de stopper l’évolution et d’assainir durablement.',
        },
      ],
      relatedArticles: [
        { title: 'Détartrage & Surfaçage Radiculaire', slug: 'scaling-planing', category: 'treatments' },
        { title: 'L’Appareil de Soutien Dentaire (Parodonte)', slug: 'periodontium', category: 'anatomy' },
        { title: 'Techniques de Brossage Efficaces', slug: 'brushing-technique', category: 'oral-hygiene' },
      ],
      relatedTreatments: ['Surfaçage radiculaire', 'Maintenance parodontale', 'Greffe gingivale'],
      relatedAnatomy: ['Gencive', 'Ligament parodontal', 'Os alvéolaire', 'Cément'],
      faqs: [
        {
          question: 'Peut-on guérir définitivement d’une parodontite ?',
          answer: 'La parodontite se stabilise de manière remarquable avec un traitement adéquat et une hygiène rigoureuse, mais nécessite une maintenance à vie pour éviter les récidives bactériennes.',
        },
      ],
      tags: ['parodontite', 'gencive', 'déchaussement', 'os', 'tartre', 'saignement'],
    },

    // --- TREATMENTS ---
    {
      id: 'art-root-canal',
      slug: 'root-canal',
      title: 'Le Traitement Endodontique : Préserver la Dent Naturelle',
      category: 'treatments',
      categoryLabel: 'Traitements',
      summary: 'Intervention minutieuse visant à désinfecter et obturer de façon étanche le réseau canalaire de la dent lorsque la pulpe est infectée ou nécrosée, évitant ainsi l’extraction.',
      readingTimeMinutes: 5,
      lastReviewed: 'Janvier 2026',
      reviewer: {
        name: 'Dr. Youssef Dali',
        title: 'Chirurgien-Dentiste, Docteur en Sciences Odontologiques',
        credentials: 'Chirurgien-Dentiste, Implantologie & Esthétique',
        role: 'Directeur Clinique & Réviseur Scientifique',
      },
      keyFacts: [
        'Réalisé sous anesthésie locale moderne : le traitement est totalement indolore.',
        'La pose d’une digue dentaire (champ opératoire étanche) est la norme de qualité absolue.',
        'Permet de conserver la racine naturelle et la proprioception osseuse pour des décennies.',
        'Une dent dévitalisée est plus fragile et nécessite le plus souvent une protection par couronne.',
      ],
      whenToSeekCare: [
        'Douleur lancinante spontanée non calmée par les antalgiques usuels',
        'Douleur vive et prolongée au chaud (plus de 10 secondes après retrait du stimulus)',
        'Gonflement de la gencive en regard de l’apex dentaire (abcès)',
        'Traumatisme dentaire sévère avec fracture exposant le nerf',
      ],
      sections: [
        {
          title: 'Pourquoi et quand dévitaliser ?',
          content: 'Lorsque les bactéries atteignent le tissu conjonctif pulpaire (nerfs et vaisseaux sanguins situés au cœur de la dent), l’inflammation aiguë provoque une compression nerveuse douloureuse au sein des parois dentinaires rigides. Si l’infection n’est pas traitée, la pulpe se nécrose et l’infection migre vers l’os de la mâchoire.',
        },
        {
          title: 'Les étapes du traitement moderne',
          content: '1. Anesthésie profonde et mise en place de la digue.\n2. Trépanation et localisation de l’ensemble des canaux radiculaires.\n3. Mise en forme mécanique rotative et irrigation antibactérienne abondante.\n4. Obturation tridimensionnelle étanche à la gutta-percha chaude et ciment biocompatible.\n5. Reconstitution coronaire étanche.',
          clinicalNote: 'La réussite du traitement dépend de l’élimination complète des micro-organismes et d’une étanchéité coronaire immédiate.',
        },
      ],
      relatedArticles: [
        { title: 'La Carie Dentaire : Étiologie et Soins', slug: 'dental-caries', category: 'conditions' },
        { title: 'La Pulpe Dentaire & le Complexe Pulpo-Dentinaire', slug: 'pulp', category: 'anatomy' },
        { title: 'Couronne Dentaire : Indications & Matériaux', slug: 'dental-crown', category: 'treatments' },
      ],
      relatedTreatments: ['Obturation canalaire', 'Pose de digue dentaire', 'Couronne céramique'],
      relatedAnatomy: ['Pulpe', 'Canal radiculaire', 'Apex dentaire'],
      faqs: [
        {
          question: 'Vais-je avoir mal pendant le traitement ?',
          answer: 'Non. Grâce aux techniques d’anesthésie actuelles, l’acte se déroule dans un confort complet. Une légère sensibilité post-opératoire de la zone de soutien peut survenir pendant 48 heures, facilement gérée par des antalgiques simples.',
        },
      ],
      tags: ['endodontie', 'dévitalisation', 'nerf', 'canal', 'infection', 'digue'],
    },

    {
      id: 'art-dental-implants',
      slug: 'dental-implants',
      title: 'Implantologie Dentaire : Restaurer Racine et Fonction',
      category: 'treatments',
      categoryLabel: 'Traitements',
      summary: 'Racine artificielle en titane biocompatible ou zircone insérée dans l’os alvéolaire pour remplacer une ou plusieurs dents absentes avec un résultat pérenne et naturel.',
      readingTimeMinutes: 7,
      lastReviewed: 'Mars 2026',
      reviewer: {
        name: 'Dr. Youssef Dali',
        title: 'Chirurgien-Dentiste, Docteur en Sciences Odontologiques',
        credentials: 'Chirurgien-Dentiste, Implantologie & Esthétique',
        role: 'Directeur Clinique & Réviseur Scientifique',
      },
      keyFacts: [
        'Taux de succès clinique supérieur à 95% documenté sur le long terme.',
        'L’ostéointégration assure une fusion biologique intime entre l’os et le titane.',
        'Évite de meuler les dents saines adjacentes contrairement au bridge traditionnel.',
        'Prévient la fonte osseuse alvéolaire consécutive à l’extraction dentaire.',
      ],
      whenToSeekCare: [
        'Perte d’une dent unitaire nécessitant un remplacement esthétique et fonctionnel',
        'Édentement partiel ou complet avec instabilité d’un appareil amovible',
        'Dent non conservable (fracture radiculaire verticale, lyse osseuse terminale)',
      ],
      sections: [
        {
          title: 'Le principe de l’ostéointégration',
          content: 'Découverte par le Pr Brånemark, l’ostéointégration est la connexion structurelle et fonctionnelle directe entre l’os vivant ordonné et la surface d’un implant en titane sans interposition de tissu fibreux. Cela confère à la prothèse une stabilité équivalente à celle d’une racine saine.',
        },
        {
          title: 'Le parcours clinique en implantologie',
          content: 'La démarche débute par un examen scanner 3D (Cone Beam) pour évaluer le volume osseux disponible. L’intervention de pose est réalisée en ambulatoire sous anesthésie locale. Une période de cicatrisation de 2 à 4 mois précède la prise d’empreinte optique numérique et la pose de la couronne céramique définitive.',
          clinicalNote: 'La réussite à long terme exige une excellente hygiène péri-implantaire et une maintenance clinique annuelle.',
        },
      ],
      relatedArticles: [
        { title: 'Matériaux Dentaires : Titane, Zircone & Céramiques', slug: 'dental-materials', category: 'treatments' },
        { title: 'Couronne Dentaire & Remplacement', slug: 'dental-crown', category: 'treatments' },
        { title: 'L’Os Alvéolaire & Résorption', slug: 'alveolar-bone', category: 'anatomy' },
      ],
      relatedTreatments: ['Pose d’implant', 'Couronne sur implant', 'Comblement osseux'],
      relatedAnatomy: ['Os alvéolaire', 'Gencive attachée'],
      faqs: [
        {
          question: 'Y a-t-il un risque de rejet de l’implant ?',
          answer: 'Le titane étant chimiquement inerte et hautement biocompatible, il n’y a pas de phénomène de rejet allergique. Les rares échecs précoces sont généralement liés à un défaut de cicatrisation osseuse ou à une contamination bactérienne.',
        },
      ],
      tags: ['implant', 'titane', 'ostéointégration', 'prothèse', 'édentement'],
    },

    // --- ANATOMY ---
    {
      id: 'art-enamel',
      slug: 'enamel',
      title: 'L’Émail Dentaire : La Barrière la Plus Dure du Corps Humain',
      category: 'anatomy',
      categoryLabel: 'Anatomie',
      summary: 'Composé à 96% d’hydroxyapatite minérale, l’émail protège la dent contre les agressions mécaniques de la mastication, les variations thermiques et les attaques chimiques acides.',
      readingTimeMinutes: 4,
      lastReviewed: 'Février 2026',
      reviewer: {
        name: 'Dr. Youssef Dali',
        title: 'Chirurgien-Dentiste, Docteur en Sciences Odontologiques',
        credentials: 'Chirurgien-Dentiste, Implantologie & Esthétique',
        role: 'Directeur Clinique & Réviseur Scientifique',
      },
      keyFacts: [
        'Tissu acellulaire et avasculaire : une fois détruit, l’émail ne peut pas se régénérer biologiquement.',
        'Minéralisé sous forme de prismes d’émail microscopiques hautement ordonnés.',
        'La dureté de l’émail est comparable à celle du quartz (dureté Mohs ~ 5).',
        'Sensible à l’érosion acide (agrumes, sodas, vinaigres) et à l’attrition par serrement (bruxisme).',
      ],
      whenToSeekCare: [
        'Translucidité accrue des bords incisifs ou effritements répétés',
        'Sensibilité au contact d’aliments froids ou d’agrumes',
        'Apparition de facettes d’usure brillantes et planes sur les dents',
      ],
      sections: [
        {
          title: 'Structure cristalline et reminéralisation',
          content: 'L’émail est composé de prismes d’hydroxyapatite orientés perpendiculairement à la jonction amélo-dentinaire. La salive joue un rôle protecteur constant en baignant l’émail d’ions calcium et phosphate. L’apport topique de fluor remplace le groupement hydroxyle par du fluorure, formant de la fluorapatite, nettement plus résistante aux attaques acides (seuil critique abaissé à pH 4,5).',
        },
      ],
      relatedArticles: [
        { title: 'La Carie Dentaire : Étiologie & Soins', slug: 'dental-caries', category: 'conditions' },
        { title: 'La Dentine : Structure Tubulaire & Sensibilité', slug: 'dentin', category: 'anatomy' },
        { title: 'Sensibilité Dentaire : Origines', slug: 'tooth-sensitivity', category: 'symptoms' },
      ],
      relatedTreatments: ['Fluoration topique', 'Scellement des sillons', 'Facettes céramiques'],
      relatedAnatomy: ['Émail', 'Dentine', 'Jonction amélo-dentinaire'],
      faqs: [
        {
          question: 'L’émail peut-il repousser ?',
          answer: 'Non, les cellules formatrices de l’émail (améloblastes) disparaissent à l’éruption de la dent. Toutefois, un émail déminéralisé superficiellement peut être reminéralisé et renforcé par des ions calcium, phosphate et fluor.',
        },
      ],
      tags: ['émail', 'hydroxyapatite', 'fluor', 'reminéralisation', 'dureté'],
    },

    // --- SYMPTOMS ---
    {
      id: 'art-toothache',
      slug: 'tooth-pain',
      title: 'Comprendre la Douleur Dentaire : Guide des Symptômes et Causes',
      category: 'symptoms',
      categoryLabel: 'Symptômes',
      summary: 'Décryptez les différentes typologies de douleurs dentaires (sensibilité au froid, douleur pulsatile, douleur à la mastication) pour comprendre leur origine clinique possible.',
      readingTimeMinutes: 5,
      lastReviewed: 'Mars 2026',
      reviewer: {
        name: 'Dr. Youssef Dali',
        title: 'Chirurgien-Dentiste, Docteur en Sciences Odontologiques',
        credentials: 'Chirurgien-Dentiste, Implantologie & Esthétique',
        role: 'Directeur Clinique & Réviseur Scientifique',
      },
      keyFacts: [
        'Une douleur aiguë au froid qui cesse immédiatement évoque une hypersensibilité dentinaire ou carie superficielle.',
        'Une douleur au chaud qui persiste après le stimulus indique fréquemment une inflammation pulpaire irréversible.',
        'Une douleur vive ressentie spécifiquement lors du relâchement de la morsure suggère une fêlure dentaire.',
        'La prise d’antibiotiques sans diagnostic ni geste mécanique local est inefficace et dangereuse.',
      ],
      whenToSeekCare: [
        'Douleur vive empêchant le sommeil ou non soulagée par le paracétamol',
        'Gonflement de la joue, de la gencive ou difficulté à déglutir (urgence absolue)',
        'Traumatisme avec dent déplacée ou mobile',
      ],
      sections: [
        {
          title: 'Classification clinique des douleurs bucco-dentaires',
          content: 'La douleur pulpaire est transmise par les fibres A-delta (douleur vive, aiguë, rapide) et les fibres C (douleur sourde, pulsatile, mal localisée). Selon l’intensité et la durée de la réponse, le praticien détermine si la pulpe peut être préservée ou si un traitement endodontique est requis.',
          clinicalNote: 'Attention : l’arrêt soudain d’une douleur très intense peut indiquer la nécrose totale du nerf, prélude à un abcès apical.',
        },
      ],
      relatedArticles: [
        { title: 'Traitement Endodontique & Racines', slug: 'root-canal', category: 'treatments' },
        { title: 'Abcès Dentaire : Signes & Traitement d’Urgence', slug: 'dental-abscess', category: 'emergencies' },
        { title: 'Guide des Urgences Dentaires', slug: 'emergency-guide', category: 'emergencies' },
      ],
      relatedTreatments: ['Soin d’urgence', 'Traitement de canal', 'Drainage d’abcès'],
      relatedAnatomy: ['Pulpe', 'Nerf alvéolaire', 'Ligament parodontal'],
      faqs: [
        {
          question: 'Que faire en attendant mon rendez-vous d’urgence ?',
          answer: 'Prendre un antalgique de type paracétamol selon la posologie médicale. Éviter impérativement l’aspirine ou les anti-inflammatoires sans avis en cas d’infection purulente. Ne pas appliquer d’aspirine directement sur la gencive (risque de brûlure chimique). Maintenir la tête surélevée.',
        },
      ],
      tags: ['douleur', 'rage de dent', 'pulpite', 'sensibilité', 'urgence'],
    },

    // --- EMERGENCIES ---
    {
      id: 'art-emergencies',
      slug: 'dental-abscess',
      title: 'Abcès Dentaire et Cellulite Faciale : Urgence Médicale',
      category: 'emergencies',
      categoryLabel: 'Urgences',
      summary: 'Infection bactérienne purulente d’origine dentaire ou parodontale nécessitant une prise en charge clinique rapide pour éviter toute diffusion aux espaces anatomiques profonds.',
      readingTimeMinutes: 5,
      lastReviewed: 'Mars 2026',
      reviewer: {
        name: 'Dr. Youssef Dali',
        title: 'Chirurgien-Dentiste, Docteur en Sciences Odontologiques',
        credentials: 'Chirurgien-Dentiste, Implantologie & Esthétique',
        role: 'Directeur Clinique & Réviseur Scientifique',
      },
      keyFacts: [
        'Résulte le plus souvent de la nécrose non traitée d’une pulpe dentaire ou d’une poche parodontale profonde.',
        'Se manifeste par une douleur battante, une tuméfaction gingivale ou faciale et parfois de la fièvre.',
        'La chaleur (compresse chaude) est formellement contre-indiquée car elle favorise l’extension bactérienne.',
        'Nécessite impérativement un geste chirurgical/endodontique local pour drainer la collection purulente.',
      ],
      whenToSeekCare: [
        'Gonflement visible du visage ou de la mâchoire',
        'Difficulté à ouvrir la bouche (trismus) ou à avaler la salive',
        'Fièvre associée à une douleur dentaire',
      ],
      sections: [
        {
          title: 'Protocoles d’urgence',
          content: 'L’éradication de l’abcès repose sur l’élimination de la cause infectieuse : drainage trans-canalaire ou incision de l’abcès collecté sous anesthésie, complété si nécessaire par une antibiothérapie ciblée prescrite par le chirurgien-dentiste.',
        },
      ],
      relatedArticles: [
        { title: 'Traitement de Canal & Endodontie', slug: 'root-canal', category: 'treatments' },
        { title: 'Guide des Urgences Dentaires', slug: 'emergency-guide', category: 'emergencies' },
      ],
      relatedTreatments: ['Drainage chirurgical', 'Traitement de canal', 'Antibiothérapie prescrite'],
      relatedAnatomy: ['Apex radiculaire', 'Os alvéolaire', 'Espaces aponévrotiques'],
      faqs: [
        {
          question: 'Les antibiotiques seuls peuvent-ils guérir un abcès ?',
          answer: 'Non. Les antibiotiques circulent dans le sang mais ne peuvent pénétrer dans la dent nécrosée dévascularisée. Seul le traitement mécanique par le praticien élimine la source infectieuse.',
        },
      ],
      tags: ['abcès', 'infection', 'urgence', 'gonflement', 'antibiotiques', 'cellulite'],
    }
  ]);

  private dictionaryTermsSignal = signal<DictionaryTerm[]>([
    {
      id: 'term-abces',
      term: 'Abcès dentaire',
      termFr: 'Abcès périapical / parodontal',
      termAr: 'خراج الأسنان',
      category: 'Pathologie',
      definition: 'Accumulation localisée de pus consécutive à une infection bactérienne de la pulpe ou de la gencive.',
      clinicalContext: 'Nécessite un drainage clinique rapide et le traitement étiologique de la dent causale.',
      relatedArticleSlug: 'dental-abscess',
      relatedCategory: 'emergencies',
    },
    {
      id: 'term-amelo',
      term: 'Améloblaste',
      termFr: 'Cellule améloblastique',
      termAr: 'خلية مكونة للميناء',
      category: 'Anatomie',
      definition: 'Cellule spécialisée d’origine ectodermique responsable de la synthèse et de la minéralisation de l’émail dentaire avant l’éruption.',
      clinicalContext: 'Disparaît à l’éruption dentaire, expliquant l’incapacité de l’émail à se régénérer biologiquement.',
      relatedArticleSlug: 'enamel',
      relatedCategory: 'anatomy',
    },
    {
      id: 'term-bruxisme',
      term: 'Bruxisme',
      termFr: 'Bruxisme du sommeil / diurne',
      termAr: 'صرير الأسنان',
      category: 'Fonction & Occlusion',
      definition: 'Mouvements parafonctionnels involontaires de serrement ou de grincement des dents.',
      clinicalContext: 'Engendre usure prématurée de l’émail, tensions musculaires masticatoires et fêlures coronaires.',
      relatedArticleSlug: 'dental-caries',
      relatedCategory: 'conditions',
    },
    {
      id: 'term-carie',
      term: 'Carie dentaire',
      termFr: 'Lésion carieuse',
      termAr: 'تسوس الأسنان',
      category: 'Pathologie',
      definition: 'Destruction des tissus minéralisés de la dent provoquée par les métabolites acides de bactéries du biofilm.',
      clinicalContext: 'Pathologie la plus répandue ; réversible uniquement au tout début par reminéralisation.',
      relatedArticleSlug: 'dental-caries',
      relatedCategory: 'conditions',
    },
    {
      id: 'term-cement',
      term: 'Cément',
      termFr: 'Cément radiculaire',
      termAr: 'ملاط السن',
      category: 'Anatomie',
      definition: 'Couche minéralisée fine recouvrant la surface de la racine dentaire et ancrant les fibres du ligament parodontal.',
      clinicalContext: 'Moins dur que l’émail, le cément s’érode rapidement en cas de rétraction gingivale.',
      relatedArticleSlug: 'periodontitis',
      relatedCategory: 'anatomy',
    },
    {
      id: 'term-conebeam',
      term: 'Cone Beam (CBCT)',
      termFr: 'Tomographie volumique à faisceau conique',
      termAr: 'التصوير المقطعي المحوسب للأسنان',
      category: 'Imagerie & Diagnostic',
      definition: 'Technique radiologique tridimensionnelle à haute résolution délivrant une dose d’irradiation nettement inférieure au scanner classique.',
      clinicalContext: 'Examen de référence pour la planification implantaire et l’endodontie complexe.',
      relatedArticleSlug: 'dental-implants',
      relatedCategory: 'treatments',
    },
    {
      id: 'term-dentine',
      term: 'Dentine',
      termFr: 'Dentine / Ivoire dentaire',
      termAr: 'عاج السن',
      category: 'Anatomie',
      definition: 'Tissu dur sous-jacent à l’émail traversé par des millions de canalicules microscopiques reliés à la pulpe.',
      clinicalContext: 'Responsable de la teinte naturelle de la dent et de la transmission des sensibilités thermiques.',
      relatedArticleSlug: 'enamel',
      relatedCategory: 'anatomy',
    },
    {
      id: 'term-digue',
      term: 'Digue dentaire',
      termFr: 'Champ opératoire étanche',
      termAr: 'الحاجز المطاطي',
      category: 'Thérapeutique & Qualité',
      definition: 'Feuille de latex ou de silicone isolant rigoureusement une ou plusieurs dents de la salive et de l’humidité buccale.',
      clinicalContext: 'Norme d’excellence indispensable pour le collage des résines et la décontamination endodontique.',
      relatedArticleSlug: 'root-canal',
      relatedCategory: 'treatments',
    },
    {
      id: 'term-email',
      term: 'Émail',
      termFr: 'Émail dentaire',
      termAr: 'ميناء السن',
      category: 'Anatomie',
      definition: 'Substance la plus minéralisée de l’organisme humain enveloppant la couronne anatomique.',
      clinicalContext: 'Barrière protectrice insensible mais vulnérable aux acides alimentaires et bactériens.',
      relatedArticleSlug: 'enamel',
      relatedCategory: 'anatomy',
    },
    {
      id: 'term-endodontie',
      term: 'Endodontie',
      termFr: 'Thérapeutique canalaire',
      termAr: 'علاج جذور الأسنان',
      category: 'Discipline clinique',
      definition: 'Discipline de l’odontologie consacrée à la biologie, à la prévention et au traitement de la pulpe et des tissus périapicaux.',
      clinicalContext: 'Permet de sauver des dents condamnées par une infection profonde.',
      relatedArticleSlug: 'root-canal',
      relatedCategory: 'treatments',
    },
    {
      id: 'term-gingivite',
      term: 'Gingivite',
      termFr: 'Inflammation gingivale',
      termAr: 'التهاب اللثة',
      category: 'Pathologie',
      definition: 'Inflammation réversible de la gencive marginale induite par la présence du biofilm dentaire.',
      clinicalContext: 'Se caractérise par des saignements sans perte d’attache osseuse.',
      relatedArticleSlug: 'periodontitis',
      relatedCategory: 'conditions',
    },
    {
      id: 'term-implant',
      term: 'Implant dentaire',
      termFr: 'Implant endo-osseux',
      termAr: 'زرعة الأسنان',
      category: 'Chirurgie & Prothèse',
      definition: 'Vis biocompatible insérée chirurgicalement dans l’os maxillaire pour remplacer une racine manquante.',
      clinicalContext: 'Sert de pilier pour supporter une couronne unitaire, un bridge ou stabiliser un appareil complet.',
      relatedArticleSlug: 'dental-implants',
      relatedCategory: 'treatments',
    },
    {
      id: 'term-odontogramme',
      term: 'Odontogramme',
      termFr: 'Schéma dentaire',
      termAr: 'مخطط الأسنان',
      category: 'Dossier clinique',
      definition: 'Représentation schématique conventionnelle des 32 dents permanentes ou 20 dents temporaires.',
      clinicalContext: 'Permet de consigner l’état bucco-dentaire, les restaurations et les plans de traitement.',
      relatedArticleSlug: 'enamel',
      relatedCategory: 'teeth',
    },
    {
      id: 'term-osteointegration',
      term: 'Ostéointégration',
      termFr: 'Intégration osseuse',
      termAr: 'الاندماج العظمي',
      category: 'Biologie implantaire',
      definition: 'Ancrage biologique direct et pérenne de l’os vivant sur la surface rugueuse de l’implant en titane.',
      clinicalContext: 'Garant de la stabilité mécanique et de la longévité des implants dentaires.',
      relatedArticleSlug: 'dental-implants',
      relatedCategory: 'treatments',
    },
    {
      id: 'term-parodonte',
      term: 'Parodonte',
      termFr: 'Tissus de soutien dentaire',
      termAr: 'النسيج الداعم للسن',
      category: 'Anatomie',
      definition: 'Ensemble fonctionnel constitué de la gencive, du desmodonte (ligament), du cément et de l’os alvéolaire.',
      clinicalContext: 'Toute dégradation du parodonte compromet l’ancrage naturel de la dent.',
      relatedArticleSlug: 'periodontitis',
      relatedCategory: 'anatomy',
    },
    {
      id: 'term-pulpe',
      term: 'Pulpe dentaire',
      termFr: 'Complexe vasculo-nerveux',
      termAr: 'لب السن',
      category: 'Anatomie',
      definition: 'Tissu conjonctif lâche richement vascularisé et innervé situé au centre de la dent.',
      clinicalContext: 'Confère la sensibilité thermique et assure la nutrition de la dentine.',
      relatedArticleSlug: 'root-canal',
      relatedCategory: 'anatomy',
    },
    {
      id: 'term-sealant',
      term: 'Scellement des sillons (Sealant)',
      termFr: 'Comblement prophylactique des sillons',
      termAr: 'سدادات الشقوق الوقائية',
      category: 'Prévention',
      definition: 'Application d’une résine fluide protectrice dans les micro-sillons anatomiques des molaires permanentes.',
      clinicalContext: 'Réduit de plus de 80% le risque de carie occlusale chez les enfants et adolescents.',
      relatedArticleSlug: 'dental-caries',
      relatedCategory: 'oral-hygiene',
    },
    {
      id: 'term-zircone',
      term: 'Zircone (ZrO2)',
      termFr: 'Dioxyde de zirconium stabilisé à l’yttrium',
      termAr: 'زركونيا الأسنان',
      category: 'Biomatériaux',
      definition: 'Céramique polycristalline ultra-résistante à haute ténacité et blancheur naturelle.',
      clinicalContext: 'Matériau de prédilection sans métal pour couronnes, bridges et piliers implantaires esthétiques.',
      relatedArticleSlug: 'dental-implants',
      relatedCategory: 'treatments',
    }
  ]);

  // Public readonly accessors
  articles = this.articlesSignal.asReadonly();
  dictionaryTerms = this.dictionaryTermsSignal.asReadonly();

  getArticleBySlug(slug: string): DentalArticle | undefined {
    return this.articles().find((a) => a.slug === slug);
  }

  getArticlesByCategory(category: string): DentalArticle[] {
    return this.articles().filter((a) => a.category === category);
  }

  search(query: string): {
    articles: DentalArticle[];
    terms: DictionaryTerm[];
  } {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { articles: [], terms: [] };
    }

    const matchedArticles = this.articles().filter((a) =>
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q)) ||
      a.keyFacts.some((k) => k.toLowerCase().includes(q))
    );

    const matchedTerms = this.dictionaryTerms().filter((t) =>
      t.term.toLowerCase().includes(q) ||
      t.termFr.toLowerCase().includes(q) ||
      t.definition.toLowerCase().includes(q) ||
      (t.termAr && t.termAr.includes(q))
    );

    return {
      articles: matchedArticles,
      terms: matchedTerms,
    };
  }
}
