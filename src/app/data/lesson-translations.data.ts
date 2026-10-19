export interface LessonTranslationOverride {
  title: { en: string; ar: string };
  subtitle: { en: string; ar: string };
  categoryLabel?: { en: string; ar: string };
  badge?: { en: string; ar: string };
  introduction?: {
    summary: { en: string; ar: string };
    learningObjectives: { en: string[]; ar: string[] };
    clinicalRelevance: { en: string; ar: string };
  };
  stages?: {
    id: string;
    title: { en: string; ar: string };
    subtitle: { en: string; ar: string };
    explanation: { en: string; ar: string };
    whatIsHappening: { en: string; ar: string };
    whyItMatters: { en: string; ar: string };
  }[];
  didYouKnowFacts?: {
    title: { en: string; ar: string };
    text: { en: string; ar: string };
  }[];
  quizQuestions?: {
    id: string;
    question: { en: string; ar: string };
    options: {
      id: string;
      text: { en: string; ar: string };
      explanation: { en: string; ar: string };
    }[];
  }[];
  completionSummary?: {
    keyTakeaways: { en: string[]; ar: string[] };
    clinicalAdvice: { en: string; ar: string };
  };
}

export const LESSON_TRANSLATIONS: Record<string, LessonTranslationOverride> = {
  'permanent-dentition': {
    title: {
      en: 'The 32 Permanent Teeth & 3D Odontogram',
      ar: 'الأسنان الدائمة الـ 32 ومخطط الأسنان التفاعلي'
    },
    subtitle: {
      en: 'Complete 3D exploration of all 32 teeth with isolation, FDI numbering, and pulp canal',
      ar: 'استكشاف ثلاثي الأبعاد شامل لجميع الأسنان الـ 32 مع العزل، ترقيم FDI، وقناة اللب'
    },
    categoryLabel: {
      en: 'Dentition & Numbering',
      ar: 'الأسنان والترقيم'
    },
    badge: {
      en: 'Priority 1 Experience',
      ar: 'تجربة ذات أولوية 1'
    },
    introduction: {
      summary: {
        en: 'The adult permanent dentition consists of 32 teeth in 4 symmetrical quadrants. Explore the complete dental arches in 3D derived from ToothFairy3 CBCT dataset.',
        ar: 'تتكون الأسنان الدائمة للبالغين من 32 سناً في 4 أرباع متماثلة. استكشف أقواس الأسنان الكاملة ثلاثية الأبعاد المستمدة من مجموعة بيانات CBCT ToothFairy3.'
      },
      learningObjectives: {
        en: [
          'Navigate all 32 teeth using 2D odontogram and 3D view',
          'Isolate each tooth and identify its FDI number and dental family',
          'Switch between upper maxillary arch and lower mandibular arch',
          'Reveal the pulp and internal root canals of the selected tooth'
        ],
        ar: [
          'التنقل بين جميع الأسنان الـ 32 باستخدام مخطط الأسنان ثنائي الأبعاد وعرض 3D',
          'عزل كل سن وتحديد رقم FDI الخاص به والعائلة السنية',
          'التبديل بين الفك العلوي والفك السفلي',
          'كشف اللب والقنوات الجذرية الداخلية للسن المحدد'
        ]
      },
      clinicalRelevance: {
        en: 'The odontogram is the universal medical mapping used in clinical practice.',
        ar: 'مخطط الأسنان هو الخريطة الطبية العالمية المستخدمة في الممارسة السريرية.'
      }
    },
    stages: [
      {
        id: 'arch-overview',
        title: { en: '1. Occlusion Arch Overview', ar: '1. نظرة عامة على أقواس الإطباق' },
        subtitle: { en: 'All 32 permanent teeth in dental articulation', ar: 'جميع الأسنان الدائمة الـ 32 في تطابق الأسنان' },
        explanation: {
          en: 'The two dental arches intercuspidate in a harmonious parabolic curve. The upper maxillary arch slightly overhangs the lower mandibular arch.',
          ar: 'تتداخل الأقواس السنية في منحنى مكافئ متناسق. يتراكب القوس العلوي قليلاً فوق القوس السفلي.'
        },
        whatIsHappening: {
          en: 'What you see: Complete 3D visualization of 32 teeth in clinical occlusion from ToothFairy3 CBCT.',
          ar: 'ما تراه: تصور ثلاثي الأبعاد كامل لـ 32 سناً في الإطباق السريري من ToothFairy3 CBCT.'
        },
        whyItMatters: {
          en: 'Why it matters: A balanced dental articulation distributes masticatory forces and protects the temporomandibular joint.',
          ar: 'لماذا هذا مهم: يوزع الإطباق المتوازن قوى المضغ ويحمي المفصل الصدغي الفكي.'
        }
      },
      {
        id: 'quadrants-stage',
        title: { en: '2. Dental Quadrants & Families', ar: '2. أرباع الأسنان والعائلات' },
        subtitle: { en: 'Classification into 4 symmetrical quadrants', ar: 'التصنيف إلى 4 أرباع متماثلة' },
        explanation: {
          en: 'Dentition is organized into 4 quadrants of 8 teeth each (Q1 Upper Right, Q2 Upper Left, Q3 Lower Left, Q4 Lower Right), grouping Incisors, Canines, Premolars, and Molars.',
          ar: 'تتنظم الأسنان في 4 أرباع من 8 أسنان لكل منها (Q1 العلوي الأيمن، Q2 العلوي الأيسر، Q3 السفلي الأيسر، Q4 السفلي الأيمن)، وتضم القواطع، الأنياب، الضواحك، والأضراس.'
        },
        whatIsHappening: {
          en: 'What you see: Three-dimensional organization of the 4 dental families on the arches.',
          ar: 'ما تراه: التنظيم ثلاثي الأبعاد للعائلات السنية الأربع على الأقواس.'
        },
        whyItMatters: {
          en: 'Why it matters: Allows evaluation of arch symmetry and instant localization of each tooth.',
          ar: 'لماذا هذا مهم: يتيح تقييم تناسق القوس وتحديد موقع كل سن فوراً.'
        }
      },
      {
        id: 'interactive-selection',
        title: { en: '3. Isolation & Revealed Pulp', ar: '3. العزل واللب المكشوف' },
        subtitle: { en: 'Select a tooth to view its pulp chamber', ar: 'حدد سناً لعرض حجرة اللب' },
        explanation: {
          en: 'By clicking on a tooth, the model isolates the tooth and switches to X-ray mode to expose its pulp network and root canals.',
          ar: 'بالنقر على السن، يعزل النموذج السن ويتحول إلى وضع الأشعة السينية لكشف شبكة اللب والقنوات الجذرية.'
        },
        whatIsHappening: {
          en: 'What you see: Translucency of the selected tooth highlighting the internal endodontic system.',
          ar: 'ما تراه: شفافية السن المحدد مع إبراز نظام اللب الداخلي.'
        },
        whyItMatters: {
          en: 'Why it matters: Essential for planning root canal treatment or evaluating crown anchorage.',
          ar: 'لماذا هذا مهم: أساسي لتخطيط علاج قناة الجذر أو تقييم تثبيت التاج.'
        }
      }
    ],
    didYouKnowFacts: [
      {
        title: { en: 'A Unique Fingerprint', ar: 'بصمة فريدة' },
        text: {
          en: 'The arrangement of the 32 permanent teeth and their root curvatures are unique to each individual, constituting an infallible forensic identification marker.',
          ar: 'ترتيب الأسنان الدائمة الـ 32 وانحناءات جذورها فريدة لكل فرد، مما يشكل علامة تعريف جنائية لا تفشل.'
        }
      }
    ],
    quizQuestions: [
      {
        id: 'q_perm_1',
        question: {
          en: 'How many teeth are in a complete adult permanent dentition?',
          ar: 'كم عدد الأسنان في الأسنان الدائمة البالغة الكاملة؟'
        },
        options: [
          { id: 'a', text: { en: '32 teeth in 4 quadrants of 8', ar: '32 سناً مقسمة إلى 4 أرباع من 8' }, explanation: { en: 'Exact! 8 teeth per quadrant.', ar: 'صحيح تماماً! 8 أسنان لكل ربع.' } },
          { id: 'b', text: { en: '20 milk teeth', ar: '20 سناً لبنياً' }, explanation: { en: '20 is the number of primary pediatric teeth.', ar: '20 هو عدد الأسنان المؤقتة للأطفال.' } },
          { id: 'c', text: { en: '28 teeth without exception', ar: '28 سناً بدون استثناء' }, explanation: { en: 'Without wisdom teeth it is 28, but full is 32.', ar: 'بدون ضرس العقل يكون 28، لكن العدد الكامل 32.' } }
        ]
      }
    ],
    completionSummary: {
      keyTakeaways: {
        en: [
          'Adults have 32 teeth divided into 4 quadrants of 8.',
          '2D/3D synchronization isolates each tooth and reveals internal structure.',
          'Preserving occlusion protects the temporomandibular joint.'
        ],
        ar: [
          'يملك البالغون 32 سناً مقسمة إلى 4 أرباع من 8 أسنان.',
          'تزامن 2D/3D يعزل كل سن ويكشف بنيته الداخلية.',
          'الحفاظ على الإطباق يحمي المفصل الصدغي الفكي.'
        ]
      },
      clinicalAdvice: {
        en: 'A 3D and photographic check-up at Centre Dentaire Dali maps your 32 teeth for personalized follow-up.',
        ar: 'فحص التصوير ثلاثي الأبعاد والصور الفوتوغرافية في مركز دالي للأسنان يحدد خريطة أسنانك الـ 32 لمتابعة شخصية.'
      }
    }
  },
  'supporting-structures': {
    title: {
      en: 'Supporting Structures: Periodontal Ligament & Alveolus',
      ar: 'أنسجة الدعم: الرباط السنخي والسنخ'
    },
    subtitle: {
      en: 'Anatomical chain: Tooth → Root → Periodontal Ligament (PDL) → Alveolus → Bone',
      ar: 'السلسلة التشريحية: السن ← الجذر ← الرباط حول السن (PDL) ← السنخ ← العظم'
    },
    categoryLabel: {
      en: 'Jaws & Maxillofacial Bone',
      ar: 'الفكين والعظام الوجهية الفكية'
    },
    badge: {
      en: 'Priority 2 Experience',
      ar: 'تجربة ذات أولوية 2'
    },
    introduction: {
      summary: {
        en: 'Teeth are not rigidly fused to the jawbone; they are suspended by the periodontal ligament (PDL), a shock-absorbing network of collagen fibers.',
        ar: 'الأسنان ليست ملتحمة جامدة بعظم الفك، بل هي معلقة بواسطة الرباط حول السن (PDL)، وهو شبكة ماصة للصدمات من ألياف الكولاجين.'
      },
      learningObjectives: {
        en: [
          'Examine the microscopic width of the periodontal ligament',
          'Explore alveolar bone sockets supporting each root',
          'Understand how bite forces are dampened and transmitted to bone'
        ],
        ar: [
          'فحص العرض المجهري للرباط حول السن',
          'استكشاف تجاويف العظم السنخي الداعمة لكل جذر',
          'فهم كيف يتم تخفيف قوى العض ونقلها إلى العظم'
        ]
      },
      clinicalRelevance: {
        en: 'Periodontal ligament health is vital for natural tooth retention and orthodontic tooth movement.',
        ar: 'صحة الرباط حول السن حيوية لبقاء السن الطبيعي وحركة التقويم.'
      }
    },
    stages: [
      {
        id: 'stage-pdl-1',
        title: { en: '1. Alveolar Socket Overview', ar: '1. نظرة عامة على التجويف السنخي' },
        subtitle: { en: 'The bony socket housing the root', ar: 'التجويف العظمي الحاضن للجذر' },
        explanation: {
          en: 'Each tooth root fits precisely into a custom-molded bony cavity called the dental alveolus.',
          ar: 'يتناسب كل جذر سن بدقة مع تجويف عظمي مخصص يسمى السنخ.'
        },
        whatIsHappening: {
          en: 'What you see: 3D isolation of the alveolar bone surrounding the roots.',
          ar: 'ما تراه: عزل ثلاثي الأبعاد للعظم السنخي المحيط بالجذور.'
        },
        whyItMatters: {
          en: 'Why it matters: Alveolar bone relies on mechanical stimulation from chewing to maintain its density.',
          ar: 'لماذا هذا مهم: يعتمد العظم السنخي على التحفيز الميكانيكي من المضغ للحفاظ على كثافته.'
        }
      },
      {
        id: 'stage-pdl-2',
        title: { en: '2. Periodontal Ligament (PDL)', ar: '2. الرباط حول السن (PDL)' },
        subtitle: { en: 'Micro-fibers suspending the tooth', ar: 'الألياف الدقيقة المعلقة للسن' },
        explanation: {
          en: 'A thin connective tissue layer (0.2 mm) cushions the tooth against hard biting forces.',
          ar: 'طبقة نسيج ضام رقيقة (0.2 مم) تبطن السن ضد قوى العض الصلبة.'
        },
        whatIsHappening: {
          en: 'What you see: The specialized ligament layer between root cementum and bone.',
          ar: 'ما تراه: طبقة الرباط المتخصصة بين ملاط الجذر والعظم.'
        },
        whyItMatters: {
          en: 'Why it matters: Allows slight physiological tooth mobility and acts as sensory feedback.',
          ar: 'لماذا هذا مهم: يتيح حركة سنية طفيفة ويعمل كاستجابة حسية.'
        }
      }
    ],
    completionSummary: {
      keyTakeaways: {
        en: [
          'The PDL acts as a biological shock absorber.',
          'Alveolar bone depends on tooth presence to prevent resorption.'
        ],
        ar: [
          'يعمل الرباط حول السن كممتص صدمات بيولوجي.',
          'يعتمد العظم السنخي على وجود السن لمنع الانحلال.'
        ]
      },
      clinicalAdvice: {
        en: 'Protect your supporting tissues with regular dental check-ups and prompt treatment of gum inflammation.',
        ar: 'احمِ أنسجة الدعم الخاصة بك بفحوصات الأسنان المنتظمة والعلاج السريع لالتهابات اللثة.'
      }
    }
  },
  'bone-architecture': {
    title: {
      en: 'Maxillofacial Bone Architecture & Trabeculae',
      ar: 'بنية العظام الفكية والتربيعية'
    },
    subtitle: {
      en: 'Anatomy of cortical bone and alveolar cancellous bone',
      ar: 'تشريح العظم القشري والعظم الإسفنجي السنخي'
    },
    categoryLabel: {
      en: 'Jaws & Maxillofacial Bone',
      ar: 'الفكين والعظام الوجهية الفكية'
    },
    badge: {
      en: 'Priority 3 Experience',
      ar: 'تجربة ذات أولوية 3'
    },
    introduction: {
      summary: {
        en: 'Maxillofacial bone features a dense outer cortical shell enclosing a spongy trabecular network optimized for dental implant stability.',
        ar: 'تتميز عظام الوجه والفكين بغلاف قشري خارجي كثيف يحيط بشباك إسفنجية محسنة لاستقرار زراعة الأسنان.'
      },
      learningObjectives: {
        en: [
          'Differentiate dense cortical bone from trabecular cancellous bone',
          'Explore bone density variations across maxilla and mandible'
        ],
        ar: [
          'التمييز بين العظم القشري الكثيف والعظم الإسفنجي',
          'استكشاف اختلافات كثافة العظام عبر الفك العلوي والسفلي'
        ]
      },
      clinicalRelevance: {
        en: 'Bone architecture dictates implant primary stability and osseointegration success.',
        ar: 'تحدد بنية العظام الاستقرار الأساسي للزرعة ونجاح التكامل العظمي.'
      }
    },
    stages: [
      {
        id: 'bone-s1',
        title: { en: '1. Cortical Bone Shield', ar: '1. الدرع العظمي القشري' },
        subtitle: { en: 'External protective bone layer', ar: 'طبقة العظم الخارجي الواقية' },
        explanation: {
          en: 'The outer cortical plate provides rigidity and mechanical protection to the jaws.',
          ar: 'توفر الصفيحة القشرية الخارجية صلابة وحماية ميكانيكية للفكين.'
        },
        whatIsHappening: {
          en: 'What you see: Highlighting the dense outer cortical bone shell.',
          ar: 'ما تراه: إبراز غلاف العظم القشري الخارجي الكثيف.'
        },
        whyItMatters: {
          en: 'Why it matters: Cortical thickness ensures structural integrity during mastication.',
          ar: 'لماذا هذا مهم: تضمن ثخانة القشرة السلامة الهيكلية أثناء المضغ.'
        }
      }
    ],
    completionSummary: {
      keyTakeaways: {
        en: ['Cortical and trabecular bone work together for load distribution.'],
        ar: ['يعمل العظم القشري والإسفنجي معاً لتوزيع الأحمال.']
      },
      clinicalAdvice: {
        en: 'CBCT 3D imaging at Centre Dentaire Dali evaluates your bone volume before any procedure.',
        ar: 'يقيّم التصوير ثلاثي الأبعاد CBCT في مركز دالي حجم عظامك قبل أي إجراء.'
      }
    }
  },
  'pediatric-dentistry': {
    title: {
      en: 'Pediatric Dentition & Primary Teeth Eruption',
      ar: 'أسنان الأطفال وبزغ الأسنان المؤقتة'
    },
    subtitle: {
      en: 'Transition from primary dentition to mixed and permanent dentition',
      ar: 'التحول من الأسنان المؤقتة إلى الأسنان المختلطة والدائمة'
    },
    categoryLabel: {
      en: 'Treatments & Surgeries',
      ar: 'العلاجات والجراحات'
    },
    badge: {
      en: 'Pediatric Care',
      ar: 'رعاية الأطفال'
    },
    introduction: {
      summary: {
        en: 'Children develop 20 primary (milk) teeth that serve as natural guides and placeholders for the upcoming permanent teeth.',
        ar: 'يطور الأطفال 20 سناً مؤقتة (لبنية) تعمل كمرشدين طبيعيين ومكان للأسنان الدائمة القادمة.'
      },
      learningObjectives: {
        en: [
          'Understand milk teeth eruption timeline from 6 months to 3 years',
          'Explore permanent tooth germs developing underneath primary roots'
        ],
        ar: [
          'فهم الجدول الزمني لبزغ الأسنان اللبنية من 6 أشهر إلى 3 سنوات',
          'استكشاف براعم الأسنان الدائمة المتطورة تحت الجذور اللبنية'
        ]
      },
      clinicalRelevance: {
        en: 'Preserving primary teeth is crucial for proper jaw development and speech articulation.',
        ar: 'الحفاظ على الأسنان اللبنية أمر بالغ الأهمية لتطور الفك السليم ونطق الكلمات.'
      }
    },
    stages: [
      {
        id: 'ped-1',
        title: { en: '1. Primary Dentition (20 teeth)', ar: '1. الأسنان المؤقتة (20 سناً)' },
        subtitle: { en: 'The complete set of milk teeth in children', ar: 'المجموعة الكاملة للأسنان اللبنية لدى الأطفال' },
        explanation: {
          en: 'Children have 10 teeth per arch without premolars.',
          ar: 'يملك الأطفال 10 أسنان في كل قوس بدون ضواحك.'
        },
        whatIsHappening: {
          en: 'What you see: 3D pediatric dental arch showing primary tooth spacing.',
          ar: 'ما تراه: قوس أسنان الأطفال ثلاثي الأبعاد يظهر مسافات الأسنان المؤقتة.'
        },
        whyItMatters: {
          en: 'Why it matters: Spacing allows room for larger permanent teeth to emerge.',
          ar: 'لماذا هذا مهم: توفر المسافات مساحة لظهور الأسنان الدائمة الأكبر حجماً.'
        }
      }
    ],
    completionSummary: {
      keyTakeaways: {
        en: ['Milk teeth guide permanent tooth eruption.'],
        ar: ['ترشد الأسنان اللبنية بزغ الأسنان الدائمة.']
      },
      clinicalAdvice: {
        en: 'Introduce children to dental visits early to build lifelong oral health habits.',
        ar: 'عرّف الأطفال على زيارات الأسنان مبكراً لبناء عادات صحة الفم مدى الحياة.'
      }
    }
  },
  'anatomical-relationships': {
    title: {
      en: 'Anatomical Relationships: Alveolar Nerve & Sinuses',
      ar: 'العلاقات التشريحية: العصب السنخي والجيب الشدقي'
    },
    subtitle: {
      en: 'Surgical safety: root relationships with the mandibular canal and maxillary sinuses',
      ar: 'الأمان الجراحي: علاقات الجذور بالقناة الفكية والجيوب الأنفية'
    },
    categoryLabel: {
      en: 'Jaws & Maxillofacial Bone',
      ar: 'الفكين والعظام الوجهية الفكية'
    },
    badge: {
      en: 'Surgical Safety',
      ar: 'الأمان الجراحي'
    },
    introduction: {
      summary: {
        en: 'Maxillary posterior teeth lie close to the maxillary sinuses, while mandibular molars sit right above the inferior alveolar nerve canal.',
        ar: 'تقع أسنان الفك العلوي الخلفية بالقرب من الجيوب الأنفية، بينما تقع أضراس الفك السفلي مباشرة فوق قناة العصب السنخي السفلي.'
      },
      learningObjectives: {
        en: [
          'Trace the inferior alveolar nerve canal path in 3D',
          'Examine maxillary sinus proximity to upper molar roots'
        ],
        ar: [
          'تتبع مسار قناة العصب السنخي السفلي في 3D',
          'فحص قرب الجيب الفكي من جذور الأضراس العليا'
        ]
      },
      clinicalRelevance: {
        en: 'Precise 3D CBCT imaging prevents nerve injury during wisdom tooth extraction or implant placement.',
        ar: 'يمنع التصوير ثلاثي الأبعاد الدقيق إصابة الأعصاب أثناء خلع ضرس العقل أو وضع الزرعات.'
      }
    },
    stages: [
      {
        id: 'anat-1',
        title: { en: '1. Inferior Alveolar Nerve Canal', ar: '1. قناة العصب السنخي السفلي' },
        subtitle: { en: 'Sensory pathway inside the mandible', ar: 'المسار الحسي داخل الفك السفلي' },
        explanation: {
          en: 'The mandibular canal carries the nerve and vessels supplying the lower teeth and lip.',
          ar: 'تحمل قناة الفك السفلي العصب والأوعية المغذية للأسنان والشفة السفلى.'
        },
        whatIsHappening: {
          en: 'What you see: 3D tubular path running beneath mandibular molar roots.',
          ar: 'ما تراه: مسار أنبوبي ثلاثي الأبعاد يمر تحت جذور أضراس الفك السفلي.'
        },
        whyItMatters: {
          en: 'Why it matters: Must be protected during any surgical intervention in the lower jaw.',
          ar: 'لماذا هذا مهم: يجب حمايته أثناء أي تدخل جراحي في الفك السفلي.'
        }
      }
    ],
    completionSummary: {
      keyTakeaways: {
        en: ['3D planning is essential when roots are near nerves or sinuses.'],
        ar: ['التخطيط ثلاثي الأبعاد ضروري عندما تكون الجذور قريبة من الأعصاب أو الجيوب الأنفية.']
      },
      clinicalAdvice: {
        en: 'Centre Dentaire Dali uses advanced 3D Cone Beam technology for safe surgical planning.',
        ar: 'يستخدم مركز دالي للأسنان تقنية الأشعة المخروطية المتقدمة للتخطيط الجراحي الآمن.'
      }
    }
  },
  'inside-a-tooth': {
    title: {
      en: 'Inside a Tooth: Enamel, Dentin, and Pulp',
      ar: 'داخل السن: المينا، العاج، واللب'
    },
    subtitle: {
      en: 'Journey through the 3 protective layers and the living root canal network',
      ar: 'رحلة داخل طبقات الحماية الثلاث وشبكة القنوات الجذرية الحية'
    },
    categoryLabel: {
      en: 'Tooth Anatomy',
      ar: 'تشريح الأسنان'
    },
    badge: {
      en: 'Flagship Anatomy',
      ar: 'التشريح الأساسي'
    },
    introduction: {
      summary: {
        en: 'Every tooth is a marvel of biological engineering, featuring hard protective enamel, shock-absorbing dentin, and a living vascular pulp core.',
        ar: 'كل سن هو أععجوبة هندسية بيولوجية، ويتميز بطبقة مينا واقية صلبة، وعاج ماص للصدمات، ولب وعائي حي.'
      },
      learningObjectives: {
        en: [
          'Explore enamel hardness and protective function',
          'Understand dentin tubular structure',
          'Examine the living dental pulp chambers and canals'
        ],
        ar: [
          'استكشاف صلابة المينا ووظيفتها الواقية',
          'فهم بنية الأنابيب العاجية',
          'فحص حجرات وقنوات اللب السني الحي'
        ]
      },
      clinicalRelevance: {
        en: 'Knowing tooth layers helps patients understand why decay treatment must happen before reaching the pulp.',
        ar: 'معرفة طبقات السن تساعد المرضى على فهم سبب ضرورة علاج التسوس قبل وصوله إلى اللب.'
      }
    },
    stages: [
      {
        id: 'stage-enamel',
        title: { en: '1. Enamel Shield', ar: '1. درع المينا' },
        subtitle: { en: 'The hardest substance in the human body', ar: 'أصلب مادة في جسم الإنسان' },
        explanation: {
          en: 'Enamel is 96% mineral, protecting the inner tooth from bacteria and thermal shocks.',
          ar: 'المينا معدنية بنسبة 96%، وتحمي السن الداخلي من البكتيريا والصدمات الحرارية.'
        },
        whatIsHappening: {
          en: 'What you see: The glowing translucent outer enamel layer.',
          ar: 'ما تراه: طبقة المينا الخارجية الشفافة المضيئة.'
        },
        whyItMatters: {
          en: 'Why it matters: Once destroyed by decay, enamel cannot regenerate on its own.',
          ar: 'لماذا هذا مهم: بمجرد تدميرها بسبب التسوس، لا يمكن للمينا تجديد نفسها.'
        }
      },
      {
        id: 'stage-dentin',
        title: { en: '2. Dentin Cushion', ar: '2. وسادة العاج' },
        subtitle: { en: 'Resilient dentin layer with microscopic tubules', ar: 'طبقة العاج المرنة ذات الأنابيب المجهرية' },
        explanation: {
          en: 'Dentin makes up the bulk of the tooth and transmits stimuli to the nerve.',
          ar: 'يشكل العاج الجزء الأكبر من السن وينقل المؤثرات إلى العصب.'
        },
        whatIsHappening: {
          en: 'What you see: The yellowish supportive dentin underlying the enamel.',
          ar: 'ما تراه: العاج الداعم المصفر الموجود تحت المينا.'
        },
        whyItMatters: {
          en: 'Why it matters: Caries spreads faster inside softer dentin than hard enamel.',
          ar: 'لماذا هذا مهم: ينتشر التسوس بشكل أسرع داخل العاج الأطري مقارنة بالمينا الصلبة.'
        }
      },
      {
        id: 'stage-pulp',
        title: { en: '3. Living Pulp Chamber', ar: '3. حجرة اللب الحي' },
        subtitle: { en: 'Nerves, blood vessels, and living cells', ar: 'الأعصاب، الأوعية الدموية، والخلايا الحية' },
        explanation: {
          en: 'The pulp provides nutrition and sensory perception to the tooth.',
          ar: 'يوفر اللب التغذية والإدراك الحسي للسن.'
        },
        whatIsHappening: {
          en: 'What you see: The inner vascular chamber and root canals revealed in 3D.',
          ar: 'ما تراه: الحجرة الوعائية الداخلية والقنوات الجذرية مكشوفة في 3D.'
        },
        whyItMatters: {
          en: 'Why it matters: Bacterial infection here causes severe pain and requires root canal therapy.',
          ar: 'لماذا هذا مهم: العدوى البكتيرية هنا تسبب ألماً حاداً وتتطلب علاج جذور.'
        }
      }
    ],
    completionSummary: {
      keyTakeaways: {
        en: ['Teeth have 3 main layers: Enamel, Dentin, and Pulp.'],
        ar: ['تتكون الأسنان من 3 طبقات رئيسية: المينا، العاج، واللب.']
      },
      clinicalAdvice: {
        en: 'Brush twice daily with fluoride toothpaste to protect your enamel and prevent deep decay.',
        ar: 'فرش أسنانك مرتين يومياً مع معجون أسنان يحتوي على الفلورايد لحماية المينا ومنع التسوس العمييق.'
      }
    }
  },
  'tooth-types': {
    title: {
      en: 'Tooth Types: Incisors, Canines, Premolars, Molars',
      ar: 'أنواع الأسنان: القواطع، الأنياب، الضواحك، الأضراس'
    },
    subtitle: {
      en: 'Functional and biomechanical roles of each dental group',
      ar: 'الأدوار الوظيفية والميكانيكية الحيوية لكل مجموعة سنية'
    },
    categoryLabel: {
      en: 'Tooth Anatomy',
      ar: 'تشريح الأسنان'
    },
    badge: {
      en: 'Anatomy Guide',
      ar: 'دليل التشريح'
    },
    introduction: {
      summary: {
        en: 'Each tooth type is specialized for a precise task: cutting, tearing, crushing, or grinding food.',
        ar: 'كل نوع من الأسنان متخصص لمهمة دقيقة: قطع، تمزيق، سحق، أو طحن الطعام.'
      },
      learningObjectives: {
        en: [
          'Identify incisors for biting and cutting',
          'Explore canine tearing function',
          'Understand premolar and molar crushing mechanics'
        ],
        ar: [
          'تحديد القواطع للقطع',
          'استكشاف وظيفة تمزيق الأنياب',
          'فهم ميكانيكا سحق الضواحك والأضراس'
        ]
      },
      clinicalRelevance: {
        en: 'Balanced occlusion relies on harmonious interplay between all 4 tooth categories.',
        ar: 'يعتمد الإطباق المتوازن على التفاعل المتناغم بين جميع فئات الأسنان الأربع.'
      }
    },
    stages: [
      {
        id: 'tt-1',
        title: { en: '1. Incisors (Cutting)', ar: '1. القواطع (القطع)' },
        subtitle: { en: 'Front chisel-shaped teeth', ar: 'الأسنان الأمامية على شكل إزميل' },
        explanation: {
          en: 'Incisors slice food efficiently with sharp incisal edges.',
          ar: 'تقطع القواطع الطعام بكفاءة بحواف قاطعة حادة.'
        },
        whatIsHappening: {
          en: 'What you see: The 8 front incisors in upper and lower arches.',
          ar: 'ما تراه: القواطع الأمامية الـ 8 في الفكين العلوي والسفلي.'
        },
        whyItMatters: {
          en: 'Why it matters: First point of contact for food intake and aesthetics.',
          ar: 'لماذا هذا مهم: نقطة الاتصال الأولى لتناول الطعام والجماليات.'
        }
      }
    ],
    completionSummary: {
      keyTakeaways: {
        en: ['Each group works together for complete digestion starting in the mouth.'],
        ar: ['تعمل كل مجموعة معاً لهضم كامل يبدأ في الفم.']
      },
      clinicalAdvice: {
        en: 'Maintain all tooth groups to ensure proper chewing efficiency.',
        ar: 'حافظ على جميع مجموعات الأسنان لضمان كفاءة مضغ سليمة.'
      }
    }
  },
  'tooth-numbering': {
    title: {
      en: 'Dental Numbering Systems: FDI, Universal, Palmer',
      ar: 'أنظمة ترقيم الأسنان: FDI، العالمي، بالمر'
    },
    subtitle: {
      en: 'Mastering international dental chart reading and notation',
      ar: 'إتقان قراءة وكتابة صيغ الأسنان الدولية'
    },
    categoryLabel: {
      en: 'Dentition & Numbering',
      ar: 'الأسنان والترقيم'
    },
    badge: {
      en: 'Clinical Standard',
      ar: 'المعيار السريري'
    },
    introduction: {
      summary: {
        en: 'Dentists use standardized notation systems like ISO/FDI (e.g. Tooth 16 or 46) to record treatments universally.',
        ar: 'يستخدم أطباء الأسنان أنظمة تدوين معيارية مثل ISO/FDI (مثل السن 16 أو 46) لتسجيل العلاجات عالمياً.'
      },
      learningObjectives: {
        en: [
          'Master FDI two-digit quadrant notation system',
          'Compare Universal (1-32) and Palmer notations'
        ],
        ar: [
          'إتقان نظام ترقيم الأرباع ثنائي الأرقام FDI',
          'مقارنة التدوين العالمي (1-32) وبالمر'
        ]
      },
      clinicalRelevance: {
        en: 'Precise tooth numbering prevents treatment errors across dental records.',
        ar: 'ترقيم الأسنان الدقيق يمنع أخطاء العلاج عبر السجلات الطبية.'
      }
    },
    stages: [
      {
        id: 'num-fdi',
        title: { en: '1. FDI System (ISO 3950)', ar: '1. نظام FDI (ISO 3950)' },
        subtitle: { en: 'Two-digit quadrant and tooth number', ar: 'رقم الربع والسن المكون من رقمين' },
        explanation: {
          en: 'The first digit represents the quadrant (1 to 4 for adults) and the second digit the tooth position (1 to 8 from center).',
          ar: 'الرقم الأول يمثل الربع (من 1 إلى 4 للبالغين) والرقم الثاني موضع السن (من 1 إلى 8 من المركز).'
        },
        whatIsHappening: {
          en: 'What you see: FDI numbering mapping across the 32 teeth.',
          ar: 'ما تراه: خريطة ترقيم FDI عبر الأسنان الـ 32.'
        },
        whyItMatters: {
          en: 'Why it matters: International standard used by dental professionals worldwide.',
          ar: 'لماذا هذا مهم: المعيار الدولي المستخدم من قبل محترفي الأسنان في جميع أنحاء العالم.'
        }
      }
    ],
    completionSummary: {
      keyTakeaways: {
        en: ['Tooth 46 is the permanent lower right first molar in FDI notation.'],
        ar: ['السن 46 هو أول ضرس سفلي أيمن في ترقيم FDI.']
      },
      clinicalAdvice: {
        en: 'Learn your tooth numbers to better follow your treatment plan at Centre Dentaire Dali.',
        ar: 'تعلم أرقام أسنانك لمتابعة خطة علاجك بشكل أفضل في مركز دالي للأسنان.'
      }
    }
  },
  'tooth-decay': {
    title: {
      en: 'Dental Caries: From White Spot to Pulpitis',
      ar: 'تسوس الأسنان: من البقعة البيضاء إلى التهاب اللب'
    },
    subtitle: {
      en: 'Pathological progression of bacterial demineralization and treatment options',
      ar: 'التطور المرضي لإزالة المعادن البكتيرية وخيارات العلاج'
    },
    categoryLabel: {
      en: 'Conditions & Lesions',
      ar: 'الحالات والآفات'
    },
    badge: {
      en: 'Pathology',
      ar: 'علم الأمراض'
    },
    introduction: {
      summary: {
        en: 'Dental caries is caused by acid-producing bacteria that dissolve enamel and dentin over time if left untreated.',
        ar: 'ينتج تسوس الأسنان عن بكتيريا منتجة للحمض تذيب المينا والعاج بمرور الوقت إذا لم تُعالج.'
      },
      learningObjectives: {
        en: [
          'Witness early enamel demineralization (white spot)',
          'Observe cavity progression into dentin and pulp chamber'
        ],
        ar: [
          'مراقبة إزالة معادن المينا المبكرة (البقعة البيضاء)',
          'ملاحظة تقدم التجويف إلى العاج وحجرة اللب'
        ]
      },
      clinicalRelevance: {
        en: 'Early detection allows non-invasive remineralization or simple composite fillings.',
        ar: 'الكشف المبكر يتيح إعادة التعدين غير الغازي أو حشوات الكومبوزيت البسيطة.'
      }
    },
    stages: [
      {
        id: 'decay-s1',
        title: { en: '1. Initial White Spot', ar: '1. البقعة البيضاء الاولية' },
        subtitle: { en: 'Early enamel demineralization', ar: 'إزالة معادن المينا المبكرة' },
        explanation: {
          en: 'Acids leach minerals from subsurface enamel, creating a chalky white spot.',
          ar: 'تستخرج الأحماض المعادن من تحت سطح المينا، مما يخلق بقعة بيضاء طباشيرية.'
        },
        whatIsHappening: {
          en: 'What you see: Surface enamel opacity without cavity formation.',
          ar: 'ما تراه: تعتيم المينا السطحي بدون تكوين تجويف.'
        },
        whyItMatters: {
          en: 'Why it matters: Reversible stage with fluoride and strict oral hygiene.',
          ar: 'لماذا هذا مهم: مرحلة قابلة للعكس بالفلورايد والنظافة الفموية الصارمة.'
        }
      }
    ],
    completionSummary: {
      keyTakeaways: {
        en: ['Caries starts as demineralization and progresses if untreated.'],
        ar: ['يبدأ التسوس كإزالة معادن ويتقدم إذا لم يُعالج.']
      },
      clinicalAdvice: {
        en: 'Visit Centre Dentaire Dali every 6 months for professional cleaning and early caries checks.',
        ar: 'قم بزيارة مركز دالي للأسنان كل 6 أشهر للتنظيف الاحترافي وفحص التسوس المبكر.'
      }
    }
  },
  'root-canal-treatment': {
    title: {
      en: 'Root Canal Treatment & Endodontic Disinfection',
      ar: 'علاج العصب والتطهير اللبي'
    },
    subtitle: {
      en: 'Removal of pulp bacteria and hermetic three-dimensional obturation',
      ar: 'إزالة بكتيريا اللب والحشو ثلاثي الأبعاد المحكم'
    },
    categoryLabel: {
      en: 'Treatments & Surgeries',
      ar: 'العلاجات والجراحات'
    },
    badge: {
      en: 'Endodontics',
      ar: 'علاج العصب'
    },
    introduction: {
      summary: {
        en: 'When tooth pulp is infected, endodontic therapy cleans, disinfects, and seals the root canal system to save the natural tooth.',
        ar: 'عندما يُصاب لب السن بالعدوى، يقوم العلاج اللبي بتنظيف وتطهير وختم نظام قناة الجذر لإنقاذ السن الطبيعي.'
      },
      learningObjectives: {
        en: [
          'Understand why infected pulp must be removed',
          'Explore root canal disinfection and 3D filling'
        ],
        ar: [
          'فهم سبب ضرورة إزالة اللب المصاب بالعدوى',
          'استكشاف تطهير قناة الجذر والحشو ثلاثي الأبعاد'
        ]
      },
      clinicalRelevance: {
        en: 'Root canal treatment saves severely damaged teeth from extraction.',
        ar: 'ينقذ علاج العصب الأسنان التالفة بشدة من الخلع.'
      }
    },
    stages: [
      {
        id: 't-rc-1',
        title: { en: '1. Pulp Infection & Access', ar: '1. عدوى اللب والوصول' },
        subtitle: { en: 'Accessing the infected pulp chamber', ar: 'الوصول إلى حجرة اللب المصابة' },
        explanation: {
          en: 'The dentist creates a precise access opening through the crown to reach the root canals.',
          ar: 'ينشئ طبيب الأسنان فتحة وصول دقيقة عبر التاج للوصول إلى قنوات الجذر.'
        },
        whatIsHappening: {
          en: 'What you see: Opening into the infected pulp chamber.',
          ar: 'ما تراه: فتح حجرة اللب المصابة.'
        },
        whyItMatters: {
          en: 'Why it matters: Eliminates bacteria causing abscesses and pain.',
          ar: 'لماذا هذا مهم: يقضي على البكتيريا المسببة للخراجات والألم.'
        }
      }
    ],
    completionSummary: {
      keyTakeaways: {
        en: ['Root canals relieve pain and preserve your natural tooth structure.'],
        ar: ['تخفف قنوات الجذر الألم وتحافظ على بنية أسنانك الطبيعية.']
      },
      clinicalAdvice: {
        en: 'Post-treatment crown placement protects endodontically treated teeth from fracture.',
        ar: 'وضع التاج بعد العلاج يحمي الأسنان المعالجة لبياً من التكسر.'
      }
    }
  },
  'wisdom-teeth': {
    title: {
      en: 'Wisdom Teeth: Extraction and Anatomical Risks',
      ar: 'ضرس العقل: الخلع والمخاطر التشريحية'
    },
    subtitle: {
      en: '3D analysis of third molars and their proximity to vital structures',
      ar: 'تحليل ثلاثي الأبعاد للأضراس الثالثة وقربها من التراكيب الحيوية'
    },
    categoryLabel: {
      en: 'Conditions & Lesions',
      ar: 'الحالات والآفات'
    },
    badge: {
      en: 'Oral Surgery',
      ar: 'جراحة الفم'
    },
    introduction: {
      summary: {
        en: 'Wisdom teeth (third molars) often lack space to erupt properly, causing impaction, pain, or crowding.',
        ar: 'غالباً ما تفتقر أضراس العقل (الأضراس الثالثة) إلى المساحة للبروز بشكل صحيح، مما يسبب انحشاراً أو ألماً او ازدحاماً.'
      },
      learningObjectives: {
        en: [
          'Examine impacted wisdom teeth angles',
          'Analyze nerve proximity using 3D CBCT imaging'
        ],
        ar: [
          'فحص زوايا أضراس العقل المنحشرة',
          'تحليل قرب العصب باستخدام تصوير CBCT ثلاثي الأبعاد'
        ]
      },
      clinicalRelevance: {
        en: 'Early 3D assessment ensures safe surgical extraction without nerve damage.',
        ar: 'يضمن التقييم ثلاثي الأبعاد المبكر خلعاً جراحياً آمنياً بدون تلف الأعصاب.'
      }
    },
    stages: [
      {
        id: 'w-stage-1',
        title: { en: '1. Impacted Wisdom Tooth', ar: '1. ضرس العقل المنحشر' },
        subtitle: { en: 'Trapped beneath bone and adjacent teeth', ar: 'محاصر تحت العظم والأسنان المجاورة' },
        explanation: {
          en: 'Insufficient jaw length prevents third molars from erupting normally.',
          ar: 'طول الفك غير الكافي يمنع الأضراس الثالثة من البزغ بشكل طبيعي.'
        },
        whatIsHappening: {
          en: 'What you see: Horizontal or angled impaction against the second molar.',
          ar: 'ما تراه: انحشار أفقي أو مائل ضد الضرس الثاني.'
        },
        whyItMatters: {
          en: 'Why it matters: Can damage adjacent roots and cause chronic pericoronitis.',
          ar: 'لماذا هذا مهم: يمكن أن يتلف الجذور المجاورة ويسبب التهاب حول التاج مزمن.'
        }
      }
    ],
    completionSummary: {
      keyTakeaways: {
        en: ['Wisdom teeth extractions require precise 3D pre-surgical planning.'],
        ar: ['تتطلب خلع ضرس العقل تخطيطاً جراحياً دقيقاً ثلاثي الأبعاد قبل الجراحة.']
      },
      clinicalAdvice: {
        en: 'Consult Centre Dentaire Dali for a panoramic and 3D CBCT check of your wisdom teeth.',
        ar: 'استشر مركز دالي للأسنان لفحص بانورامي وثلاثي الأبعاد CBCT لأضرس العقل لديك.'
      }
    }
  },
  'dental-implant': {
    title: {
      en: 'Dental Implants & Osseointegration',
      ar: 'زراعة الأسنان والتكامل العظمي'
    },
    subtitle: {
      en: 'Fixed replacement with titanium screws anchored in alveolar bone',
      ar: 'التعويض الثابت بمسامير التيتانيوم المثبتة في العظم السنخي'
    },
    categoryLabel: {
      en: 'Treatments & Surgeries',
      ar: 'العلاجات والجراحات'
    },
    badge: {
      en: 'Implantology',
      ar: 'زراعة الأسنان'
    },
    introduction: {
      summary: {
        en: 'Dental implants are biocompatible titanium or zirconia screws that fuse with jawbone to replace missing tooth roots permanently.',
        ar: 'زرعات الأسنان هي مسامير من التيتانيوم أو الزركونيا متوافقة حيوياً تندمج مع عظم الفك لتحل محل جذور الأسنان المفقودة بشكل دائم.'
      },
      learningObjectives: {
        en: [
          'Understand titanium screw osseointegration into bone',
          'Explore implant abutment and crown connection'
        ],
        ar: [
          'فهم اندماج مسمار التيتانيوم في العظم',
          'استكشاف دعامة الزرعة وتوصيل التاج'
        ]
      },
      clinicalRelevance: {
        en: 'Implants restore chewing function and aesthetics without touching adjacent healthy teeth.',
        ar: 'تستعيد الزراعة وظيفة المضغ والجماليات بدون لمس الأسنان السليمة المجاورة.'
      }
    },
    stages: [
      {
        id: 'imp-1',
        title: { en: '1. Titanium Implant Placement', ar: '1. وضع زرعة التيتانيوم' },
        subtitle: { en: 'Surgical anchoring in the alveolar bone', ar: 'التثبيت الجراحي في العظم السنخي' },
        explanation: {
          en: 'The implant fixture is placed precisely into the healed bone site.',
          ar: 'يتم وضع تركيب الزرعة بدقة في موقع العظم الملتئم.'
        },
        whatIsHappening: {
          en: 'What you see: 3D view of titanium screw inside the jawbone.',
          ar: 'ما تراه: عرض ثلاثي الأبعاد لمسمار التيتانيوم داخل عظم الفك.'
        },
        whyItMatters: {
          en: 'Why it matters: Acts as an artificial root capable of withstanding heavy bite forces.',
          ar: 'لماذا هذا مهم: يعمل كجذر صناعي قادر على تحمل قوى العض الثقيلة.'
        }
      }
    ],
    completionSummary: {
      keyTakeaways: {
        en: ['Dental implants provide permanent, fixed tooth replacement.'],
        ar: ['توفر زراعة الأسنان بديلاً دائماً وثابتاً للأسنان.']
      },
      clinicalAdvice: {
        en: 'Regain your confident smile with state-of-the-art guided implantology at Centre Dentaire Dali.',
        ar: 'استعد ابتسامتك الواثقة باستخدام أحدث تقنيات زراعة الأسنان الموجهة في مركز دالي للأسنان.'
      }
    }
  },
  'dental-crown': {
    title: {
      en: 'Ceramic Crowns and Bridges',
      ar: 'التيجان والجسور الخزفية'
    },
    subtitle: {
      en: 'Single prosthetic restoration and smile esthetics',
      ar: 'الترميم التعويضي الفردي وجماليات الابتسامة'
    },
    categoryLabel: {
      en: 'Treatments & Surgeries',
      ar: 'العلاجات والجراحات'
    },
    badge: {
      en: 'Esthetics',
      ar: 'الجماليات'
    },
    introduction: {
      summary: {
        en: 'Custom-crafted ceramic crowns protect and restore severely decayed or cracked teeth to full strength and beauty.',
        ar: 'تحمي التيجان الخزفية المصنوعة خصيصاً وترمم الأسنان المتسوسة أو المتشققة بشدة إلى كامل قوتها وجمالها.'
      },
      learningObjectives: {
        en: [
          'Explore tooth preparation for crown placement',
          'Examine full coverage ceramic restoration'
        ],
        ar: [
          'استكشاف تحضير السن لوضع التاج',
          'فحص الترميم الخزفي ذو التغطية الكاملة'
        ]
      },
      clinicalRelevance: {
        en: 'Crowns prevent weak teeth from fracturing under biting pressure.',
        ar: 'تمنع التيجان الأسنان الضعيفة من الانكسار تحت ضغط العض.'
      }
    },
    stages: [
      {
        id: 'cr-1',
        title: { en: '1. Crown Preparation', ar: '1. تحضير التاج' },
        subtitle: { en: 'Shaping the tooth for restoration', ar: 'تشكيل السن للترميم' },
        explanation: {
          en: 'The dentist gently reduces the tooth outer surfaces to create space for the custom ceramic crown.',
          ar: 'يقوم طبيب الأسنان بتقليل الأسطح الخارجية للسن بلطف لخلق مساحة لتاج السيراميك المخصص.'
        },
        whatIsHappening: {
          en: 'What you see: Prepared tooth core ready for crown cementation.',
          ar: 'ما تراه: قلب السن المحضر الجاهز لتثبيت التاج.'
        },
        whyItMatters: {
          en: 'Why it matters: Ensures durable fit and natural esthetics.',
          ar: 'لماذا هذا مهم: يضمن ملاءمة متينة وجماليات طبيعية.'
        }
      }
    ],
    completionSummary: {
      keyTakeaways: {
        en: ['Ceramic crowns restore both function and natural smile esthetics.'],
        ar: ['تستعيد التيجان الخزفية كل من الوظيفة وجماليات الابتسامة الطبيعية.']
      },
      clinicalAdvice: {
        en: 'High-translucency ceramic crowns at Centre Dentaire Dali mimic your natural enamel perfectly.',
        ar: 'تطابق التيجان الخزفية عالية الشفافية في مركز دالي للأسنان مينا أسنانك الطبيعية تماماً.'
      }
    }
  },
  'gum-disease': {
    title: {
      en: 'Gingivitis and Periodontitis',
      ar: 'التهاب اللثة والتهاب دواعم السن'
    },
    subtitle: {
      en: 'Prevention and treatment of inflammation and periodontal attachment loss',
      ar: 'وقاية وعلاج الالتهابات وفقدان الارتباط حول السن'
    },
    categoryLabel: {
      en: 'Conditions & Lesions',
      ar: 'الحالات والآفات'
    },
    badge: {
      en: 'Periodontology',
      ar: 'أمراض اللثة'
    },
    introduction: {
      summary: {
        en: 'Gum disease starts as reversible surface inflammation (gingivitis) and can progress to bone-destroying periodontitis if neglected.',
        ar: 'تبدأ أمراض اللثة التهاباً سطحياً قابلاً للعكس (التهاب اللثة) ويمكن أن تتطور إلى التهاب دواعم السن المدمر للعظم إذا تم إهمالها.'
      },
      learningObjectives: {
        en: [
          'Differentiate gingivitis from advanced periodontitis',
          'Explore plaque and tartar accumulation effects'
        ],
        ar: [
          'التمييز بين التهاب اللثة والتهاب دواعم السن المتقدم',
          'استكشاف آثار تراكم البلاك والجير'
        ]
      },
      clinicalRelevance: {
        en: 'Early periodontal care prevents tooth loosening and bone loss.',
        ar: 'رعاية اللثة المبكرة تمنع تخلخل الأسنان وفقدان العظام.'
      }
    },
    stages: [
      {
        id: 'gum-s1',
        title: { en: '1. Plaque & Tartar Buildup', ar: '1. تراكم البلاك والجير' },
        subtitle: { en: 'Bacterial biofilm hardening at the gum line', ar: 'تصلب الغشاء الحيوي البكتيري عند خط اللثة' },
        explanation: {
          en: 'Unremoved dental plaque calcifies into tartar, irritating surrounding gum tissues.',
          ar: 'تتصلب لوحة الأسنان غير المزالة إلى جير، مما يهيج أنسجة اللثة المحيطة.'
        },
        whatIsHappening: {
          en: 'What you see: Yellow tartar deposits accumulating around tooth necks.',
          ar: 'ما تراه: رواسب الجير الصفراء المتراكمة حول أعناق الأسنان.'
        },
        whyItMatters: {
          en: 'Why it matters: Triggers chronic immune inflammation and bleeding gums.',
          ar: 'لماذا هذا مهم: يطلق التهاباً مناعياً مزمناً ونزيف اللثة.'
        }
      }
    ],
    completionSummary: {
      keyTakeaways: {
        en: ['Gingivitis is reversible; periodontitis requires professional periodontal therapy.'],
        ar: ['التهاب اللثة قابل للعكس؛ يتطلب التهاب دواعم السن علاجاً لثوياً متخصصاً.']
      },
      clinicalAdvice: {
        en: 'Regular professional scaling at Centre Dentaire Dali keeps your gums healthy and firm.',
        ar: 'التنظيف الاحترافي المنتظم في مركز دالي للأسنان يحافظ على صحة وسلامة لثتك.'
      }
    }
  },
  'the-jaw': {
    title: {
      en: 'The Jaw: Maxilla and Mandible',
      ar: 'الفك: الفك العلوي والفك السفلي'
    },
    subtitle: {
      en: 'Global bone anatomy and temporomandibular joints',
      ar: 'التشريح العظمي الشامل والمفاصل الصدغية الفكية'
    },
    categoryLabel: {
      en: 'Jaws & Maxillofacial Bone',
      ar: 'الفكين والعظام الوجهية الفكية'
    },
    badge: {
      en: 'Jaw Anatomy',
      ar: 'تشريح الفك'
    },
    introduction: {
      summary: {
        en: 'The upper maxilla and movable lower mandible form the facial skeletal framework supporting all 32 teeth and masticatory muscles.',
        ar: 'يشكل الفك العلوي الثابت والفَك السفلي المتحرك الإطار الهيكلي للوجه الداعم لجميع الأسنان الـ 32 وعضلات المضغ.'
      },
      learningObjectives: {
        en: [
          'Examine maxilla and mandible bony architecture',
          'Explore temporomandibular joint (TMJ) connection'
        ],
        ar: [
          'فحص بنية الفك العلوي والسفلي العظمية',
          'استكشاف اتصال المفصل الصدغي الفكي (TMJ)'
        ]
      },
      clinicalRelevance: {
        en: 'Understanding jaw anatomy is key for orthodontic and orthognathic treatments.',
        ar: 'فهم تشريح الفك هو المفتاح لعلاجات وتقويم الأسنان وتصحيح الفكين.'
      }
    },
    stages: [
      {
        id: 'jaw-1',
        title: { en: '1. Upper Maxilla & Lower Mandible', ar: '1. الفك العلوي والفك السفلي' },
        subtitle: { en: 'The two jaws in occlusion', ar: 'الفسان في الإطباق' },
        explanation: {
          en: 'The maxilla is fixed to the skull, while the mandible articulates via the TMJ for jaw movement.',
          ar: 'الفك العلوي مثبت بالجمجمة، بينما يتحرك الفك السفلي عبر المفصل الصدغي الفكي لحركة الفك.'
        },
        whatIsHappening: {
          en: 'What you see: Complete 3D skeletal view of upper and lower jawbones.',
          ar: 'ما تراه: عرض هيكلي ثلاثي الأبعاد كامل لعظام الفك العلوي والسفلي.'
        },
        whyItMatters: {
          en: 'Why it matters: Supports facial structure, speech, and chewing function.',
          ar: 'لماذا هذا مهم: يدعم بنية الوجه، النطق، ووظيفة المضغ.'
        }
      }
    ],
    completionSummary: {
      keyTakeaways: {
        en: ['Maxilla and mandible provide the solid bony foundation for dental arches.'],
        ar: ['يوفر الفك العلوي والفك السفلي الأساس العظمي الصلب لأقواس الأسنان.']
      },
      clinicalAdvice: {
        en: 'Centre Dentaire Dali offers comprehensive maxillofacial evaluations and 3D imaging.',
        ar: 'يقدم مركز دالي للأسنان تقييمات شاملة للوجه والفكين وتصوير ثلاثي الأبعاد.'
      }
    }
  }
};
