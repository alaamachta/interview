import type { HeroSlideKey } from '../data/heroSlides';

export type SupportedLanguage = 'en' | 'de' | 'ar';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'de', 'ar'];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
export const LANGUAGE_STORAGE_KEY = 'app_language';

export type TranslationSchema = {
  languageSwitcher: {
    label: string;
  };
  header: {
    contact: string;
    startInterview: string;
  };
  hero: {
    label: string;
    title: string;
    description: string;
    actions: {
      primary: string;
      github: string;
      secondary: string;
    };
  };
  about: {
    label: string;
    title: string;
    paragraphs: string[];
  };
  businessValue: {
    label: string;
    title: string;
    text: string;
  };
  showcase: {
    label: string;
    title: string;
    intro: string;
    linkParagraph: {
      beforeLink: string;
      linkText: string;
      afterLink: string;
    };
  };
  useCases: {
    label: string;
    title: string;
    items: string[];
  };
  howBuilt: {
    label: string;
    title: string;
    cards: {
      title: string;
      text: string;
    }[];
  };
  strengths: {
    label: string;
    title: string;
    items: string[];
  };
  chatHistory: {
    label: string;
    title: string;
    cards: {
      title: string;
      text: string;
    }[];
  };
  comingSoon: {
    label: string;
    title: string;
    text: string;
  };
  contact: {
    label: string;
    title: string;
    intro: string;
    demoParagraph: {
      beforeLink: string;
      linkText: string;
      afterLink: string;
    };
    emailLabel: string;
    linkedinLabel: string;
  };
  footer: {
    description: string;
    githubLabel: string;
  };
  floatingChat: {
    triggerLabel: string;
    avatarAlt: string;
    buttonText: string;
    widgetTitle: string;
    widgetAriaLabel: string;
    openInNewTab: string;
    closeChat: string;
    iframeTitle: string;
  };
  interview: {
    srTitle: string;
    header: {
      eyebrow: string;
      title: string;
      description: string;
      highlights: string[];
    };
    loading: string;
    sessionExpired: {
      title: string;
      paragraphs: string[];
      restartButton: string;
    };
    technicalErrors: {
      rate_limit: string;
      quota: string;
      network: string;
      server: string;
      unknown: string;
    };
    escalation: {
      successLines: string[];
      errorLines: string[];
    };
  };
  heroSlider: {
    prev: string;
    next: string;
    dotLabel: string;
  };
  lightbox: {
    close: string;
    prev: string;
    next: string;
    description: string;
    zoomOut: string;
    zoomIn: string;
    reset: string;
    roleDescription: string;
  };
  heroSlides: Record<HeroSlideKey, {
    alt: string;
    title: string;
    subtitle: string;
    detail: string;
  }>;
};

const baseTranslation: TranslationSchema = {
  languageSwitcher: {
    label: 'Change language',
  },
  header: {
    contact: 'Contact',
    startInterview: 'Launch Interview Assistant',
  },
  hero: {
    label: 'Interview Assistant Demo',
    title: 'Inside the Interview Assistant',
    description:
      'This project is a personal AI demo that shows how modern AI assistants can be used in real communication and business scenarios. The assistant answers typical questions automatically and demonstrates how I design, integrate, and document AI solutions with logging, monitoring, and a transparent dashboard.',
    actions: {
      primary: 'Launch Interview Assistant',
      github: 'Code & projects on GitHub',
      secondary: "What's behind it?",
    },
  },
  about: {
    label: 'What is the Interview Assistant?',
    title: 'An AI companion that proves how productive company chats can be',
    paragraphs: [
      'I — Alaa Mashta — built the Interview Assistant to playfully show what trustworthy AI communication looks like. It leads clear, structured dialogues, explains my way of working, and demonstrates with support, HR, and internal communication examples how organizations can use AI chats for productive purposes.',
      'The assistant responds politely and transparently — based on curated knowledge, predefined content, and the connected systems.',
      'It is a personal demo project. It highlights how modern AI workflows, multilingual replies, 24/7 availability, ticket escalation, follow-up suggestions, and a dashboard for incoming requests can be implemented.',
    ],
  },
  businessValue: {
    label: 'Why is this exciting for companies?',
    title: 'Real automation with OpenAI agents for SMBs',
    text:
      'With this Interview Assistant I demonstrate in practice how companies can deploy AI-powered assistants. OpenAI agents take over repetitive questions, learn from feedback, and prepare vetted answers — results remain traceable. Communication and service scale without losing quality or transparency, giving teams more time for demanding tasks.',
  },
  showcase: {
    label: 'AI Automation & Cloud',
    title: 'AI Interview Assistant Demo as an end-to-end automation example',
    intro:
      'The LandKI stack combines OpenAI agents, curated knowledge, FastAPI, and a lightweight dashboard to log interviews, collect feedback, and forward tickets. I focus on transparent flows and safe escalations — skills I rely on in AI automation roles every day.',
    linkParagraph: {
      beforeLink: 'In the ',
      linkText: 'AI Interview Assistant Demo',
      afterLink:
        ', recruiters, agency teams, or hiring managers experience how LLMs, backend automation, and cloud deployment work together and how I adapt these workflows for companies.',
    },
  },
  useCases: {
    label: 'Use cases for SMBs & industries',
    title: 'Concrete scenarios for service, support, and knowledge',
    items: [
      'Assistant agents that schedule meetings, send reminders, or answer simple status updates.',
      'FAQ & support chat for restaurants, boutiques, workshops, or small shops.',
      'Support for medical practices, hospitals, tax advisors, and consultancies.',
      'Internal knowledge assistant for employees with secure access to policies.',
      'Learning companion for theory & practice that explains knowledge and prepares exercises.',
      'Ticket pre-qualification: AI sorts topics, documents requests, and routes them to the right person.',
      'Onboarding helper for new team members with process and culture FAQ.',
    ],
  },
  howBuilt: {
    label: 'How was the Interview Assistant built?',
    title: 'Transparent architecture with OpenAI Agent Builder',
    cards: [
      {
        title: 'Agent setup',
        text:
          'OpenAI Agent Builder with File Search & Vector Store keeps answers verifiable and documents versioned automatically.',
      },
      {
        title: 'Specialized roles',
        text: 'Multiple agents for small talk, knowledge, and escalation. Each agent knows its context.',
      },
      {
        title: 'Backend & dashboard',
        text: 'FastAPI backend plus dashboard for escalations, tickets, and feedback. Humans can take over at any time.',
      },
      {
        title: 'Quality & documentation',
        text: 'Structured logging, feedback loops, and transparent answers. Focus on reliability, transparency, and documentation.',
      },
    ],
  },
  strengths: {
    label: 'Strengths of the Interview Assistant',
    title: 'Why this demo convinces',
    items: [
      'Automatically detects each request’s category and intent and responds accordingly.',
      'Can prepare escalations & tickets and hand them over to me seamlessly.',
      'Learns from feedback — responses are documented and improved continuously.',
      'Available 24/7 with clear language, honest tone, and traceable sources.',
      'Combines modern AI with pragmatic process understanding for SMBs.',
    ],
  },
  chatHistory: {
    label: 'History & trust',
    title: 'Conversation history stays available',
    cards: [
      {
        title: 'Conversation history stays available',
        text:
          'Your chat with the Interview Assistant expires after roughly ten minutes for security reasons. Your previous conversations stay stored locally on your device, so you can revisit earlier answers and continue exactly where you left off.',
      },
      {
        title: 'Privacy & control',
        text:
          'Chats are processed securely via OpenAI. We use an anonymous browser identifier so only you can see your previous conversations.',
      },
    ],
  },
  comingSoon: {
    label: 'Coming soon',
    title: 'Outlook: additional AI agents & automations',
    text:
      'AI agents can support much more than interviews — scheduling, support requests, or admin workflows, for example. LandKI is my playground to prototype these ideas in demos and adapt them to real business requirements later.',
  },
  contact: {
    label: 'Contact',
    title: 'Personal AI demos by Alaa Mashta',
    intro:
      'I develop LandKI as a portfolio project and I am happy to discuss concrete ideas or feedback about the Interview Assistant. Send me a note directly:',
    demoParagraph: {
      beforeLink: 'For a quick impression I recommend the ',
      linkText: 'AI Interview Assistant Demo',
      afterLink:
        ' — it shows how I document LLM responses, trigger backend automations, and escalate tickets cleanly.',
    },
    emailLabel: 'Email',
    linkedinLabel: 'LinkedIn',
  },
  footer: {
    description:
      '© {year} Alaa Mashta · LandKI. Interview Assistant is a real demo for OpenAI agents and productive AI communication.',
    githubLabel: 'GitHub',
  },
  floatingChat: {
    triggerLabel: 'Open Interview Assistant',
    avatarAlt: 'Chat with the Interview Assistant by Alaa Mashta',
    buttonText: 'Chat with Interview Assistant',
    widgetTitle: 'Interview Assistant',
    widgetAriaLabel: 'Interview Assistant chat',
    openInNewTab: 'Open in new tab',
    closeChat: 'Close chat',
    iframeTitle: 'Interview Assistant',
  },
  interview: {
    srTitle: 'AI Interview Assistant Demo – LandKI by Alaa Mashta',
    header: {
      eyebrow: 'Interview Assistant',
      title: 'Structured recruiter chat with live OpenAI agents',
      description:
        'This standalone assistant explains LandKI and shows how I scope interviews, escalate tickets, and document every message.',
      highlights: [
        'Use it to explore hiring or automation scenarios in English, German, or Arabic.',
        'Each request is routed through specialized agents with safeguards, dashboards, and escalation flows.',
      ],
    },
    loading: 'Loading Interview Assistant…',
    sessionExpired: {
      title: 'Session expired',
      paragraphs: [
        'Each conversation ends after roughly ten minutes to keep things secure.',
        'Your chats stay stored locally in the chat history and are only visible on your device.',
        'Reopen an earlier thread or start a new chat whenever you like.',
      ],
      restartButton: 'Start new chat',
    },
    technicalErrors: {
      rate_limit:
        'There is a usage limit right now. Your previous messages stay available — please try again shortly.',
      quota:
        'There is a usage limit right now. Your previous messages stay available — please try again shortly.',
      network:
        'A technical issue occurred. Your previous messages stay available — please reload the page or try again later.',
      server:
        'A technical issue occurred. Your previous messages stay available — please reload the page or try again later.',
      unknown:
        'A technical issue occurred. Your previous messages stay available — please reload the page or try again later.',
    },
    escalation: {
      successLines: [
        'Your message was forwarded to Alaa.',
        'Thank you very much! 😊',
        'Feel free to continue the conversation here if you have more questions.',
      ],
      errorLines: ['❌ The message could not be sent.', 'Please try again later.'],
    },
  },
  heroSlider: {
    prev: 'Previous image',
    next: 'Next image',
    dotLabel: 'Go to slide',
  },
  lightbox: {
    close: 'Close',
    prev: 'Previous image',
    next: 'Next image',
    description: 'Screenshot description',
    zoomOut: 'Zoom out',
    zoomIn: 'Zoom in',
    reset: 'Reset',
    roleDescription: 'Lightbox',
  },
  heroSlides: {
    slide1: {
      alt: 'Escalation dashboard with all tickets from the Interview Assistant',
      title: 'Escalation dashboard',
      subtitle: 'All tickets created by the AI chat — including status, category, and contact at a glance.',
      detail:
        'The “Escalations” dashboard lists every ticket created by the AI assistant — with date, time, name, contact, category, and status (open/closed). Recruiters or teams immediately see which conversations resulted in concrete action items.',
    },
    slide2: {
      alt: 'Workflow of the Interview Assistant with classifier and multiple AI agents',
      title: 'Multiple AI agents instead of one-size-fits-all bot',
      subtitle:
        'A classifier routes every request to the right agent: small talk, knowledge, escalation, or ticket widget.',
      detail:
        'The Interview Assistant consists of several specialized AI agents. A classifier decides whether a message is small talk, a knowledge request, an escalation, or a ticket. It then routes the message accordingly. The dialog stays structured and easy to extend.',
    },
    slide3: {
      alt: 'Chat with support request and matching ticket in the escalation dashboard',
      title: 'Support request from the chat',
      subtitle:
        'If the bot cannot continue, it prepares a structured support message with name, email, and phone number.',
      detail:
        'In this chat Sarah describes a technical issue. The escalation agent summarizes everything and creates a structured support request — including name, email, and phone number. The ticket lands directly in the dashboard so Alaa can follow up.',
    },
    slide4: {
      alt: 'Feedback dialog with anonymous response inside the escalation dashboard',
      title: 'Direct feedback to the assistant',
      subtitle:
        'Users can leave feedback, for example when answers are too generic or if more examples are required.',
      detail:
        'Here someone reports that an answer was too generic and asks for more focus on concrete projects and technologies. The assistant turns it into a feedback ticket that anonymously appears on the dashboard. This makes it easy to improve the content.',
    },
    slide5: {
      alt: 'Support dialog with open issue and ticket inside the dashboard',
      title: 'Make open issues visible',
      subtitle:
        'If a topic remains unresolved in the chat, the assistant creates a ticket with a clear problem description.',
      detail:
        'Daniel shares that the previous reply did not help and his problem is still open. The assistant transforms the conversation into a clean ticket and tags it as a “technical issue”. No open request gets lost in the chat history.',
    },
    slide6: {
      alt: 'Chat excerpt where the AI assistant declines tax advice and offers alternatives',
      title: 'Safety limits & responsibility',
      subtitle:
        'The assistant does not provide tax or legal advice and explains where it can help instead.',
      detail:
        'This example highlights the safety boundaries: the assistant does not give binding tax or legal advice. Instead it explains which topics fall within its responsibility, e.g., questions about Alaa’s profile or general advice when planning AI/automation projects.',
    },
  },
};

export const translations: Record<SupportedLanguage, TranslationSchema> = {
  en: baseTranslation,
  de: {
    languageSwitcher: {
      label: 'Sprache ändern',
    },
    header: {
      contact: 'Kontakt',
      startInterview: 'Interview-Assistent starten',
    },
    hero: {
      label: 'Interview-Assistent Demo',
      title: 'Über den Interview-Assistenten',
      description:
        'Dieses Projekt ist ein persönliches KI-Demo, das zeigt, wie moderne KI-Assistenten in echten Kommunikations- und Business-Szenarien eingesetzt werden können. Der Assistent beantwortet typische Fragen automatisch und demonstriert, wie ich KI-Lösungen technisch aufbaue, integriere und mit Logging, Monitoring sowie einem Dashboard nachvollziehbar mache.',
      actions: {
        primary: 'Interview-Assistent starten',
        github: 'Code & Projekte auf GitHub',
        secondary: 'Was steckt dahinter?',
      },
    },
    about: {
      label: 'Was ist der Interview Assistent?',
      title: 'Ein KI-Begleiter – als Beispiel für produktive Unternehmens-Chats',
      paragraphs: [
        'Ich – Alaa Mashta – habe den Interview Assistent entwickelt, um spielerisch zu zeigen, wie vertrauensvolle KI-Kommunikation aussehen kann. Er führt klare, strukturierte Dialoge, erklärt meine Arbeitsweise und demonstriert anhand typischer Szenarien aus Support, HR und interner Kommunikation, wie Unternehmen KI-Chats für produktive Zwecke nutzen können.',
        'Der Assistent antwortet klar, höflich und nachvollziehbar – basierend auf integriertem Wissen, vordefinierten Inhalten und den eingebundenen Systemen.',
        'Der Assistent ist ein persönliches Demo-Projekt von Alaa Mashta. Es zeigt, wie moderne KI-Workflows, mehrsprachige Antworten, 24/7-Erreichbarkeit, Ticket-Eskalation, Follow-up-Vorschläge und ein Dashboard für eingehende Anfragen umgesetzt werden können.',
      ],
    },
    businessValue: {
      label: 'Warum ist das spannend für Unternehmen?',
      title: 'Reale Automatisierung mit OpenAI-Agents für KMU',
      text:
        'Mit diesem Interview-Assistenten zeige ich ganz praktisch, wie Unternehmen KI-gestützte Assistenten nutzen können. OpenAI-Agents übernehmen wiederkehrende Fragen, können aus Feedback lernen und bereiten geprüfte Antworten vor – so bleiben Aussagen besser nachvollziehbar. Kommunikation und Service lassen sich damit skalieren, ohne Qualität oder Transparenz zu verlieren, und Teams haben mehr Zeit für anspruchsvolle Aufgaben.',
    },
    showcase: {
      label: 'AI Automation & Cloud',
      title: 'AI Interview Assistant Demo als ganzheitliches Automatisierungsbeispiel',
      intro:
        'Der LandKI Stack verbindet OpenAI Agents, kuratiertes Wissen, FastAPI und ein leichtgewichtiges Dashboard, um Interviews zu protokollieren, Feedback zu sammeln und Tickets weiterzuleiten. Ich setze bewusst auf nachvollziehbare Abläufe und sichere Eskalationen – Skills, die ich in AI Automation Rollen täglich brauche.',
      linkParagraph: {
        beforeLink: 'Im ',
        linkText: 'AI Interview Assistant Demo',
        afterLink:
          ' erleben Recruiter:innen, Agentur-Teams oder Hiring-Manager:innen, wie LLMs, Backend-Automatisierung und Cloud-Deployment zusammenspielen und wie ich diese Workflows für Unternehmen adaptiere.',
      },
    },
    useCases: {
      label: 'Use Cases für KMU & Branchen',
      title: 'Konkrete Szenarien für Service, Support und Wissen',
      items: [
        'Assistenz-Agents: zum Beispiel Termine planen, Erinnerungen verschicken oder einfache Statusabfragen beantworten.',
        'FAQ- & Support-Chat für Restaurants, Boutiquen, Werkstätten oder kleine Shops.',
        'Unterstützung für Arztpraxen, Krankenhäuser, Steuerberater:innen und Beratungen.',
        'Interner Wissensassistent für Mitarbeitende mit sicheren Zugriffen auf Richtlinien.',
        'Lern-Begleiter für Theorie & Praxis, der Wissen erklärt und Übungen vorbereitet.',
        'Ticket-Vorqualifizierung: KI sortiert Themen, dokumentiert Anliegen und leitet an die richtige Person weiter.',
        'Onboarding-Helfer für neue Teammitglieder mit Prozess- und Kultur-FAQ.',
      ],
    },
    howBuilt: {
      label: 'Wie wurde der Interview Assistent gebaut?',
      title: 'Transparente Architektur mit OpenAI Agent Builder',
      cards: [
        {
          title: 'Agenten-Setup',
          text:
            'OpenAI Agent Builder mit File Search & Vector Store, damit Antworten belegbar bleiben und Dokumente automatisch versioniert werden.',
        },
        {
          title: 'Spezialisierte Rollen',
          text: 'Mehrere Agents für Smalltalk, Wissen und Eskalation. Jeder Agent kennt seinen Kontext.',
        },
        {
          title: 'Backend & Dashboard',
          text: 'FastAPI-Backend plus Dashboard für Eskalationen, Tickets und Feedback. Menschen können jederzeit übernehmen.',
        },
        {
          title: 'Qualität & Dokumentation',
          text: 'Klares Logging, Feedback-Schleifen und nachvollziehbare Antworten. Fokus auf Zuverlässigkeit, Transparenz und Dokumentation.',
        },
      ],
    },
    strengths: {
      label: 'Stärken des Interview Assistenten',
      title: 'Warum diese Demo überzeugt',
      items: [
        'Erkennt automatisch Kategorie & Zweck jeder Anfrage und reagiert passend.',
        'Kann Eskalationen & Tickets vorbereiten und nahtlos an mich weiterleiten.',
        'Lernt aus Feedback – Rückmeldungen werden dokumentiert und verbessern die Antworten.',
        '24/7 verfügbar mit klarer Sprache, ehrlichem Stil und nachvollziehbaren Quellen.',
        'Kombiniert moderne KI mit pragmatischem Prozessverständnis für KMU.',
      ],
    },
    chatHistory: {
      label: 'Verlauf & Vertrauen',
      title: 'Gesprächsverlauf bleibt erhalten',
      cards: [
        {
          title: 'Gesprächsverlauf bleibt erhalten',
          text:
            'Ihr Chat mit dem Interview-Assistenten läuft aus Sicherheitsgründen nach ca. 10 Minuten aus. Ihre bisherigen Gespräche bleiben jedoch im persönlichen Chatverlauf gespeichert und sind nur auf Ihrem Gerät sichtbar. So können Sie jederzeit frühere Antworten nachlesen und ein Interview genau dort fortsetzen, wo Sie aufgehört haben.',
        },
        {
          title: 'Datenschutz & Kontrolle',
          text:
            'Die Chats werden über OpenAI sicher verarbeitet. Wir verwenden eine anonyme Browser-Kennung, damit nur Sie Ihre früheren Gespräche sehen.',
        },
      ],
    },
    comingSoon: {
      label: 'Demnächst',
      title: 'Ausblick: Weitere KI-Agents & Automatisierungen',
      text:
        'KI-Agents lassen sich nicht nur für Interviews einsetzen, sondern auch für viele andere Aufgaben – etwa Terminvereinbarungen, Support-Anfragen oder einfache Admin-Workflows. LandKI dient mir als Spielwiese, um solche Ideen in Demo-Projekten auszuprobieren und später auf reale Unternehmensanforderungen zu übertragen.',
    },
    contact: {
      label: 'Kontakt',
      title: 'Persönliche KI-Demos von Alaa Mashta',
      intro:
        'Ich entwickle LandKI als Portfolio-Projekt und tausche mich gern über konkrete Ideen oder Feedback zum Interview-Assistenten aus. Schreiben Sie mir einfach direkt:',
      demoParagraph: {
        beforeLink: 'Für einen schnellen Eindruck empfehle ich den ',
        linkText: 'AI Interview Assistant Demo',
        afterLink:
          ' – dort zeige ich, wie ich LLM-Antworten dokumentiere, Backend-Automationen auslöse und Tickets sauber eskaliere.',
      },
      emailLabel: 'E-Mail',
      linkedinLabel: 'LinkedIn',
    },
    footer: {
      description:
        '© {year} Alaa Mashta · LandKI. Interview Assistent ist eine reale Demo für OpenAI-Agents und produktive KI-Kommunikation.',
      githubLabel: 'GitHub',
    },
    floatingChat: {
      triggerLabel: 'Interview Assistent öffnen',
      avatarAlt: 'Chat mit Interview Assistent von Alaa Mashta',
      buttonText: 'Mit Interview Assistent chatten',
      widgetTitle: 'Interview Assistent',
      widgetAriaLabel: 'Interview Assistent Chat',
      openInNewTab: 'Im neuen Tab öffnen',
    closeChat: 'Chat schließen',
    iframeTitle: 'Interview Assistent',
  },
    interview: {
      srTitle: 'AI Interview Assistant Demo – LandKI von Alaa Mashta',
      header: {
        eyebrow: 'Interview Assistent',
        title: 'Strukturierter Recruiter-Chat mit echten OpenAI-Agents',
        description:
          'Dieser eigenständige Assistent beantwortet Fragen zu LandKI und zeigt, wie ich Interviews strukturiere, Tickets eskaliere und jede Nachricht dokumentiere.',
        highlights: [
          'Nutzen Sie ihn, um Hiring- oder Automatisierungs-Szenarien auf Deutsch, Englisch oder Arabisch zu testen.',
          'Jede Anfrage läuft über spezialisierte Agents mit Sicherheitsregeln, Dashboard und klaren Eskalationspfaden.',
        ],
      },
      loading: 'Lädt Interview Assistent…',
      sessionExpired: {
        title: 'Die Sitzung ist abgelaufen',
        paragraphs: [
          'Aus Sicherheitsgründen endet eine Unterhaltung nach ca. 10 Minuten.',
          'Ihre bisherigen Chats bleiben im Chatverlauf gespeichert und sind nur auf Ihrem Gerät sichtbar.',
          'Sie können frühere Gespräche öffnen oder jederzeit einen neuen Chat starten.',
        ],
        restartButton: 'Neuen Chat starten',
      },
      technicalErrors: {
        rate_limit:
          'Aktuell gibt es ein Nutzungs-Limit oder eine kurzzeitige Begrenzung. Ihre bisherigen Nachrichten bleiben erhalten – bitte versuchen Sie es in kurzer Zeit erneut.',
        quota:
          'Aktuell gibt es ein Nutzungs-Limit oder eine kurzzeitige Begrenzung. Ihre bisherigen Nachrichten bleiben erhalten – bitte versuchen Sie es in kurzer Zeit erneut.',
        network:
          'Es ist ein technischer Fehler aufgetreten. Ihre bisherigen Nachrichten bleiben erhalten – bitte laden Sie die Seite neu oder versuchen Sie es später erneut.',
        server:
          'Es ist ein technischer Fehler aufgetreten. Ihre bisherigen Nachrichten bleiben erhalten – bitte laden Sie die Seite neu oder versuchen Sie es später erneut.',
        unknown:
          'Es ist ein technischer Fehler aufgetreten. Ihre bisherigen Nachrichten bleiben erhalten – bitte laden Sie die Seite neu oder versuchen Sie es später erneut.',
      },
      escalation: {
        successLines: [
          'Ihre Nachricht wurde an Alaa gesendet.',
          'Vielen Dank! 😊',
          'Wenn Sie weitere Fragen haben, können Sie sie einfach hier im Chat stellen.',
        ],
        errorLines: ['❌ Die Nachricht konnte leider nicht gesendet werden.', 'Bitte versuchen Sie es später erneut.'],
      },
    },
    heroSlider: {
      prev: 'Vorheriges Bild',
      next: 'Nächstes Bild',
      dotLabel: 'Zum Slide wechseln',
    },
    lightbox: {
      close: 'Schließen',
      prev: 'Vorheriges Bild',
      next: 'Nächstes Bild',
      description: 'Beschreibung des Screenshots',
      zoomOut: 'Verkleinern',
      zoomIn: 'Vergrößern',
      reset: 'Zurücksetzen',
      roleDescription: 'Lightbox',
    },
    heroSlides: {
      slide1: {
        alt: 'Eskalations-Dashboard mit allen Tickets des Interview-Assistenten',
        title: 'Eskalations-Dashboard',
        subtitle:
          'Alle Tickets aus dem KI-Chat – inklusive Status, Kategorie und Kontakt auf einen Blick.',
        detail:
          'Das Dashboard „Eskalationen“ zeigt alle Tickets, die der KI-Assistent erstellt hat – mit Datum, Uhrzeit, Name, Kontakt, Kategorie und Status (offen/erledigt). So sehen Recruiter oder Fachbereiche sofort, welche Gespräche zu konkreten Aufgaben geführt haben.',
      },
      slide2: {
        alt: 'Workflow des Interview-Assistenten mit Classifier und mehreren KI-Agenten',
        title: 'Mehrere KI-Agenten statt Einheitsbot',
        subtitle:
          'Ein Classifier leitet jede Anfrage an den passenden Agenten: Smalltalk, Wissen, Eskalation oder Ticket-Widget.',
        detail:
          'Der Interview-Assistent besteht aus mehreren spezialisierten KI-Agenten. Ein Classifier entscheidet, ob eine Nachricht Smalltalk, Wissensfrage, Eskalation oder Ticket-Erstellung ist und routet sie an den passenden Agenten. So bleibt der Dialog übersichtlich und erweiterbar.',
      },
      slide3: {
        alt: 'Chat mit Support-Anfrage und passendem Ticket im Eskalations-Dashboard',
        title: 'Support-Anfrage aus dem Chat',
        subtitle:
          'Wenn der Bot nicht weiterkommt, baut er eine strukturierte Support-Nachricht mit Name, E-Mail und Telefonnummer.',
        detail:
          'Im Chat beschreibt Sarah ihr technisches Problem. Der Eskalations-Agent fasst alles zusammen und erstellt eine strukturierte Support-Anfrage – inklusive Name, E-Mail und Telefonnummer. Das Ticket landet direkt im Dashboard und kann von Alaa weiterbearbeitet werden.',
      },
      slide4: {
        alt: 'Feedback-Dialog mit anonymer Rückmeldung im Eskalations-Dashboard',
        title: 'Direktes Feedback an den Assistenten',
        subtitle:
          'Nutzende können Rückmeldungen geben, z. B. wenn Antworten zu allgemein sind oder mehr Beispiele gewünscht werden.',
        detail:
          'Hier meldet eine Person zurück, dass die Antwort zu allgemein war und sich mehr Fokus auf konkrete Projekte und Technologien wünscht. Der Assistent baut daraus ein Feedback-Ticket, das anonym im Dashboard landet. So kann Alaa die Inhalte gezielt verbessern.',
      },
      slide5: {
        alt: 'Support-Dialog mit offenem Problem und Ticket im Dashboard',
        title: 'Offene Probleme sichtbar machen',
        subtitle:
          'Wenn ein Anliegen im Chat offen bleibt, erstellt der Assistent ein Ticket mit klarer Problembeschreibung.',
        detail:
          'Daniel schreibt, dass die letzte Antwort nicht geholfen hat und sein Problem weiterhin offen ist. Der Assistent verwandelt das in einen sauberen Ticket-Text und markiert das Thema als „Technisches Problem“. So geht keine offene Anfrage im Chatverlauf verloren.',
      },
      slide6: {
        alt: 'Chat-Ausschnitt, in dem der KI-Assistent Steuerberatung ablehnt und Alternativen anbietet',
        title: 'Sicherheitsgrenzen & Verantwortung',
        subtitle:
          'Der Assistent gibt keine Steuer- oder Rechtsberatung und erklärt klar, wobei er stattdessen unterstützen kann.',
        detail:
          'Dieses Beispiel zeigt die Sicherheitsgrenzen des Systems: Der Assistent gibt keine verbindliche Steuer- oder Rechtsberatung. Stattdessen erklärt er, welche Themen in seine Verantwortung fallen, z. B. Fragen zu Alaa’s Profil oder allgemeine Hinweise zur Planung von KI-/Automatisierungsprojekten.',
      },
    },
  },
  ar: {
    languageSwitcher: {
      label: 'تغيير اللغة',
    },
    header: {
      contact: 'تواصل',
      startInterview: 'تشغيل مساعد المقابلات',
    },
    hero: {
      label: 'عرض مساعد المقابلات',
      title: 'داخل مساعد المقابلات',
      description:
        'هذا المشروع هو عرض شخصي يوضح كيف يمكن توظيف مساعدي الذكاء الاصطناعي الحديثين في سيناريوهات أعمال واتصال حقيقية. يجيب المساعد عن الأسئلة المتكررة تلقائياً ويُظهر كيف أبني حلول الذكاء الاصطناعي وأربطها وأوثّقها من خلال المراقبة ولوحة تحكم شفافة.',
      actions: {
        primary: 'تشغيل مساعد المقابلات',
        github: 'المشاريع و الشيفرة على GitHub',
        secondary: 'ما الذي يقف وراءه؟',
      },
    },
    about: {
      label: 'ما هو مساعد المقابلات؟',
      title: 'مرافق ذكاء اصطناعي يثبت كيف يمكن أن تكون محادثات الشركات منتجة',
      paragraphs: [
        'أنا — علاء مشطة — طوّرت مساعد المقابلات لأعرض بطريقة ممتعة كيف تبدو المحادثة الموثوقة مع الذكاء الاصطناعي. يقود حواراً واضحاً ومنظماً، يشرح أسلوبي في العمل، ويُبرز من خلال أمثلة في الدعم والموارد البشرية والاتصال الداخلي كيف يمكن للشركات استخدام محادثات الذكاء الاصطناعي لأغراض منتجة.',
        'يجيب المساعد بلغة مهذّبة وشفافة مستنداً إلى معرفة منسّقة ومحتوى مُعد سلفاً والأنظمة الموصولة به.',
        'إنه مشروع تجريبي شخصي يوضح كيف أبني تدفقات عمل حديثة للذكاء الاصطناعي، وإجابات متعددة اللغات، وتوافرًا على مدار الساعة، وتصعيداً للتذاكر، واقتراحات متابعة، ولوحة لطلبات العملاء الواردة.',
      ],
    },
    businessValue: {
      label: 'لماذا هذا مهم للشركات؟',
      title: 'أتمتة حقيقية مع وكلاء OpenAI للشركات الصغيرة والمتوسطة',
      text:
        'من خلال مساعد المقابلات أُظهر عملياً كيف يمكن للشركات نشر مساعدين مدعومين بالذكاء الاصطناعي. يتولى وكلاء OpenAI الأسئلة المتكررة، ويتعلمون من الملاحظات، ويُعدّون إجابات موثقة — مما يجعل النتائج قابلة للتتبع. يمكن توسيع نطاق الاتصال والخدمة من دون فقدان الجودة أو الشفافية، بينما يتفرغ الفريق للمهام المعقدة.',
    },
    showcase: {
      label: 'أتمتة الذكاء الاصطناعي والسحابة',
      title: 'عرض مساعد المقابلات كنموذج أتمتة متكامل',
      intro:
        'يجمع تكديس LandKI بين وكلاء OpenAI والمعرفة المنسقة وFastAPI ولوحة تحكم خفيفة لتسجيل المقابلات وجمع الملاحظات وتمرير التذاكر. أركّز على مسارات عمل شفافة وتصعيدات آمنة — وهي مهارات أعتمد عليها يومياً في أدوار أتمتة الذكاء الاصطناعي.',
      linkParagraph: {
        beforeLink: 'في ',
        linkText: 'عرض مساعد المقابلات',
        afterLink:
          ' يعيش مسؤولو التوظيف وفرق الوكالات أو مدراء التوظيف تجربة تمازج نماذج اللغة الكبيرة مع أتمتة الخلفية ونشر السحابة وكيف أُهيئ هذه التدفقات للشركات.',
      },
    },
    useCases: {
      label: 'حالات استخدام للشركات الصغيرة والقطاعات',
      title: 'سيناريوهات ملموسة للخدمة والدعم والمعرفة',
      items: [
        'وكلاء مساعدون يرتبون المواعيد، يرسلون التذكيرات أو يجيبون عن تحديثات الحالة البسيطة.',
        'دردشة للأسئلة الشائعة والدعم للمطاعم والمتاجر والورش أو المحال الصغيرة.',
        'مساندة لعيادات الأطباء والمستشفيات والمحاسبين والمكاتب الاستشارية.',
        'مساعد معرفة داخلي للموظفين مع وصول آمن إلى السياسات والإرشادات.',
        'رفيق تعلم للنظري والعملي يشرح المعرفة ويحضّر التمارين.',
        'تأهيل أولي للتذاكر: يصنّف الذكاء الاصطناعي المواضيع، يوثق الطلبات ويحوّلها للشخص المناسب.',
        'مساعد اندماج للأعضاء الجدد في الفريق مع أسئلة شائعة حول العمليات والثقافة.',
      ],
    },
    howBuilt: {
      label: 'كيف بُني مساعد المقابلات؟',
      title: 'معمارية شفافة مع OpenAI Agent Builder',
      cards: [
        {
          title: 'إعداد الوكلاء',
          text:
            'OpenAI Agent Builder مع البحث في الملفات وVector Store للحفاظ على إجابات موثوقة وتوثيق الإصدارات تلقائياً.',
        },
        {
          title: 'أدوار متخصصة',
          text: 'عدة وكلاء للمحادثة العامة والمعرفة والتصعيد. كل وكيل يعرف سياقه.',
        },
        {
          title: 'الواجهة الخلفية ولوحة التحكم',
          text: 'خلفية FastAPI مع لوحة تصعيد وتذاكر وملاحظات. يمكن للبشر التدخل في أي لحظة.',
        },
        {
          title: 'الجودة والتوثيق',
          text: 'تسجيل واضح، حلقات تغذية راجعة وإجابات شفافة. التركيز على الاعتمادية والوضوح والتوثيق.',
        },
      ],
    },
    strengths: {
      label: 'نقاط قوة مساعد المقابلات',
      title: 'لماذا يلفت هذا العرض الانتباه',
      items: [
        'يحدد تلقائياً فئة وهدف كل طلب ويستجيب بالشكل الأنسب.',
        'يستطيع تحضير التصعيدات والتذاكر وتسليمها لي بسلاسة.',
        'يتعلم من الملاحظات — يتم توثيق الردود وتحسينها باستمرار.',
        'متاح طوال الوقت بلغة واضحة وأسلوب صادق ومصادر قابلة للتتبع.',
        'يُزاوج بين الذكاء الاصطناعي الحديث وفهم عملي للعمليات في الشركات الصغيرة.',
      ],
    },
    chatHistory: {
      label: 'السجل والثقة',
      title: 'سجل المحادثة يبقى متاحاً',
      cards: [
        {
          title: 'سجل المحادثة يبقى متاحاً',
          text:
            'تنتهي جلسة الدردشة مع مساعد المقابلات بعد نحو عشر دقائق لأسباب أمنية، لكن الحوارات السابقة تُخزَّن محلياً على جهازك وبإمكانك العودة إليها واستكمال المقابلة من النقطة نفسها.',
        },
        {
          title: 'الخصوصية والتحكم',
          text:
            'تُعالج الدردشات بأمان عبر OpenAI. نستخدم معرف متصفح مجهول بحيث لا يرى المحادثات السابقة إلا أنت.',
        },
      ],
    },
    comingSoon: {
      label: 'قريباً',
      title: 'نظرة إلى الأمام: وكلاء وأتمتة إضافية',
      text:
        'وكلاء الذكاء الاصطناعي لا يقتصرون على المقابلات فقط، بل يمكنهم دعم جدولة المواعيد وطلبات الدعم أو سير العمل الإدارية البسيطة. بالنسبة لي يُعد LandKI مساحة تجريبية لأختبر هذه الأفكار في عروض توضيحية ثم أطبقها على احتياجات الأعمال الفعلية.',
    },
    contact: {
      label: 'تواصل',
      title: 'عروض ذكاء اصطناعي شخصية من علاء مشطة',
      intro:
        'أطوّر LandKI كمشروع عرض وأرحّب بالنقاش حول الأفكار العملية أو أي ملاحظات عن مساعد المقابلات. أرسل لي رسالة مباشرة:',
      demoParagraph: {
        beforeLink: 'للحصول على لمحة سريعة أنصح بـ ',
        linkText: 'عرض مساعد المقابلات',
        afterLink:
          ' — حيث أُظهر كيف أوثّق إجابات نماذج اللغة الكبيرة، وأطلق أتمتة الواجهة الخلفية وأصعّد التذاكر بشكل منظّم.',
      },
      emailLabel: 'البريد الإلكتروني',
      linkedinLabel: 'لينكدإن',
    },
    footer: {
      description:
        '© {year} علاء مشطة · LandKI. مساعد المقابلات هو عرض حقيقي لوكلاء OpenAI واتصال إنتاجي يعتمد على الذكاء الاصطناعي.',
      githubLabel: 'غِتهاب',
    },
    floatingChat: {
      triggerLabel: 'فتح مساعد المقابلات',
      avatarAlt: 'دردشة مع مساعد المقابلات من علاء مشطة',
      buttonText: 'دردشة مع مساعد المقابلات',
      widgetTitle: 'مساعد المقابلات',
      widgetAriaLabel: 'دردشة مساعد المقابلات',
      openInNewTab: 'فتح في علامة تبويب جديدة',
    closeChat: 'إغلاق الدردشة',
    iframeTitle: 'مساعد المقابلات',
  },
    interview: {
      srTitle: 'عرض مساعد المقابلات بالذكاء الاصطناعي – LandKI من علاء مشطة',
      header: {
        eyebrow: 'مساعد المقابلات',
        title: 'دردشة منظمة للتوظيف مع وكلاء OpenAI مباشرين',
        description:
          'هذا المساعد يشرح LandKI ويبين كيف أتعامل مع المقابلات، وأصعّد التذاكر، وأوثّق كل رسالة.',
        highlights: [
          'جرّبه لاستكشاف سيناريوهات التوظيف أو الأتمتة بالعربية أو بالألمانية أو بالإنجليزية.',
          'كل طلب يمر عبر وكلاء متخصصين مع ضوابط أمان ولوحات تحكم ومسارات تصعيد واضحة.',
        ],
      },
      loading: 'جارٍ تحميل مساعد المقابلات…',
      sessionExpired: {
        title: 'انتهت الجلسة',
        paragraphs: [
          'ولأسباب أمنية تنتهي كل محادثة بعد نحو عشر دقائق.',
          'يُحفظ سجل الدردشة محلياً على جهازك ولا يراه غيرك.',
          'يمكنك فتح المحادثات السابقة أو بدء جلسة جديدة في أي وقت.',
        ],
        restartButton: 'ابدأ محادثة جديدة',
      },
      technicalErrors: {
        rate_limit:
          'يوجد حالياً حد استخدام مؤقت. ستبقى رسائلك السابقة محفوظة — يرجى المحاولة من جديد خلال وقت قصير.',
        quota:
          'يوجد حالياً حد استخدام مؤقت. ستبقى رسائلك السابقة محفوظة — يرجى المحاولة من جديد خلال وقت قصير.',
        network:
          'حدث خلل تقني. ستبقى رسائلك السابقة محفوظة — حدّث الصفحة أو حاول مرة أخرى لاحقاً.',
        server:
          'حدث خلل تقني. ستبقى رسائلك السابقة محفوظة — حدّث الصفحة أو حاول مرة أخرى لاحقاً.',
        unknown:
          'حدث خلل تقني. ستبقى رسائلك السابقة محفوظة — حدّث الصفحة أو حاول مرة أخرى لاحقاً.',
      },
      escalation: {
        successLines: [
          'تم تمرير رسالتك إلى علاء.',
          'شكراً جزيلاً! 😊',
          'إذا احتجت إلى شيء إضافي فتابع المحادثة هنا بكل بساطة.',
        ],
        errorLines: ['❌ تعذّر إرسال الرسالة.', 'يرجى المحاولة مرة أخرى لاحقاً.'],
      },
    },
    heroSlider: {
      prev: 'الصورة السابقة',
      next: 'الصورة التالية',
      dotLabel: 'اذهب إلى الشريحة',
    },
    lightbox: {
      close: 'إغلاق',
      prev: 'الصورة السابقة',
      next: 'الصورة التالية',
      description: 'وصف لقطة الشاشة',
      zoomOut: 'تصغير',
      zoomIn: 'تكبير',
      reset: 'إعادة ضبط',
      roleDescription: 'عارض صور',
    },
    heroSlides: {
      slide1: {
        alt: 'لوحة تصعيد تعرض كل التذاكر التي أنشأها مساعد المقابلات',
        title: 'لوحة التصعيد',
        subtitle:
          'كل التذاكر الناتجة عن الدردشة مع حالة وفئة وبيانات المتصل في نظرة واحدة.',
        detail:
          'تعرض لوحة "التصعيد" جميع التذاكر التي أنشأها المساعد مع التاريخ والوقت والاسم وبيانات التواصل والفئة والحالة (مفتوح/مغلق). يرى مسؤولو التوظيف أو الفرق فوراً أي المحادثات أدت إلى مهام ملموسة.',
      },
      slide2: {
        alt: 'مخطط سير مساعد المقابلات مع مصنّف وعدة وكلاء ذكاء اصطناعي',
        title: 'عدة وكلاء بدلاً من روبوت واحد',
        subtitle:
          'مصنّف يوجه كل طلب إلى الوكيل المناسب: دردشة خفيفة أو معرفة أو تصعيد أو عنصر إنشاء تذكرة.',
        detail:
          'يتكون مساعد المقابلات من عدة وكلاء متخصصين. يقرر المصنّف ما إذا كانت الرسالة دردشة عامة أو سؤال معرفة أو تصعيداً أو طلب تذكرة ويُمررها بحسب ذلك. هكذا يبقى الحوار منظماً ويسهل توسيعه.',
      },
      slide3: {
        alt: 'دردشة تحتوي طلب دعم وتذكرة مطابقة في لوحة التصعيد',
        title: 'طلب دعم مباشرة من الدردشة',
        subtitle:
          'إذا تعذر على الروبوت المتابعة، فإنه ينشئ رسالة دعم منظمة تتضمن الاسم والبريد ورقم الهاتف.',
        detail:
          'تصف سارة في الدردشة مشكلة تقنية. يلخّص وكيل التصعيد كل شيء ويُنشئ طلب دعم منظم — مع الاسم والبريد ورقم الهاتف. تصل التذكرة مباشرة إلى اللوحة ليتمكن علاء من متابعتها.',
      },
      slide4: {
        alt: 'حوار ملاحظات مع رد مجهول داخل لوحة التصعيد',
        title: 'ملاحظات مباشرة إلى المساعد',
        subtitle:
          'يمكن للمستخدمين ترك ملاحظات عندما تكون الإجابات عامة جداً أو عندما يحتاجون إلى أمثلة إضافية.',
        detail:
          'في هذا المثال يطلب شخص مزيداً من الأمثلة ويرى أن الإجابة كانت عامة. يحوّل المساعد الطلب إلى تذكرة ملاحظات تظهر بشكل مجهول على اللوحة، ما يسهل تحسين المحتوى.',
      },
      slide5: {
        alt: 'حوار دعم مع مشكلة مفتوحة وتذكرة في اللوحة',
        title: 'جعل المشكلات المفتوحة مرئية',
        subtitle:
          'إذا بقي موضوع ما غير محلول في الدردشة، ينشئ المساعد تذكرة بوصف واضح للمشكلة.',
        detail:
          'يخبر دانيال أن الرد السابق لم يساعد وأن مشكلته ما تزال مفتوحة. يحوّل المساعد المحادثة إلى نص تذكرة منظم ويصنفها كمشكلة تقنية كي لا تضيع أي طلبات.',
      },
      slide6: {
        alt: 'مقتطف دردشة يرفض فيه المساعد تقديم نصيحة ضريبية ويعرض بدائل',
        title: 'حدود الأمان والمسؤولية',
        subtitle:
          'لا يقدم المساعد استشارات ضريبية أو قانونية ويوضح المجالات التي يمكنه دعمها بدلاً من ذلك.',
        detail:
          'يوضح هذا المثال حدود الأمان: لا يعطي المساعد نصائح ضريبية أو قانونية ملزمة، بل يوضح ما يقع ضمن مسؤوليته مثل الأسئلة حول ملف علاء أو إرشادات عامة لتخطيط مشاريع الذكاء الاصطناعي والأتمتة.',
      },
    },
  },
};
