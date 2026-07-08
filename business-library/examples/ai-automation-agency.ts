import { businessGenomeSchema, BUSINESS_GENOME_SCHEMA_VERSION, type BusinessGenome } from "../schema";

/**
 * The single reference Business Genome for the Business Genome Library.
 * This is real, production-intended content — not a placeholder — for one
 * BusinessType: an AI Automation Agency. It exists to demonstrate every
 * section of the schema fully populated, and to serve as the template
 * future BusinessTypes should copy and adapt (see ../README.md).
 *
 * businessGenomeSchema.parse() at the bottom of this file means an
 * invalid edit here fails at import time, not silently.
 */
const aiAutomationAgency: BusinessGenome = {
  schemaVersion: BUSINESS_GENOME_SCHEMA_VERSION,

  identity: {
    id: "b7e6c8f0-3a2b-4c3d-9e0f-1a2b3c4d5e6f",
    slug: "ai-automation-agency",
    version: "1.0.0",
    name: { en: "AI Automation Agency", ro: "Agenție de Automatizare AI" },
    tagline: {
      en: "Build the AI-powered workflows other businesses don't have time to build themselves.",
      ro: "Construiește fluxurile de lucru bazate pe AI pe care alte afaceri nu au timp să le construiască singure.",
    },
    createdAt: "2026-07-08T00:00:00.000Z",
    updatedAt: "2026-07-08T00:00:00.000Z",
    status: "published",
  },

  description: {
    short: {
      en: "A service business that designs, builds, and maintains AI-powered automations for other companies — replacing manual, repetitive work with reliable systems.",
      ro: "O afacere de servicii care proiectează, construiește și întreține automatizări bazate pe AI pentru alte companii — înlocuind munca manuală și repetitivă cu sisteme fiabile.",
    },
    long: {
      en: "An AI Automation Agency helps small and mid-size businesses identify repetitive, time-consuming processes — customer support triage, lead qualification, invoice processing, internal reporting — and replaces them with AI-powered workflows built on tools like Zapier, Make, and LLM APIs. The agency's work spans discovery (mapping a client's actual workflow), implementation (building and testing the automation), and ongoing maintenance (monitoring, fixing, and extending it as the client's needs change). Revenue comes from a mix of fixed-fee implementation projects and monthly retainers for maintenance and iteration.",
      ro: "O Agenție de Automatizare AI ajută afacerile mici și mijlocii să identifice procesele repetitive și consumatoare de timp — trierea suportului pentru clienți, calificarea lead-urilor, procesarea facturilor, raportarea internă — și le înlocuiește cu fluxuri de lucru bazate pe AI, construite pe unelte precum Zapier, Make și API-uri LLM. Activitatea agenției acoperă descoperirea (cartografierea fluxului real de lucru al clientului), implementarea (construirea și testarea automatizării) și mentenanța continuă (monitorizare, remediere și extindere pe măsură ce nevoile clientului evoluează). Veniturile provin dintr-o combinație de proiecte de implementare cu preț fix și abonamente lunare pentru mentenanță și iterare.",
    },
    idealFor: {
      en: "Best suited to someone who is genuinely comfortable with AI tools and basic scripting, enjoys mapping out messy processes and turning them into clean systems, and is willing to sell consultatively rather than through high-volume outbound.",
      ro: "Se potrivește cel mai bine cuiva care este cu adevărat confortabil cu uneltele AI și scripting de bază, care se bucură să cartografieze procese haotice și să le transforme în sisteme clare și care este dispus să vândă consultativ, nu prin volum mare de outbound.",
    },
  },

  industry: {
    primary: "tech",
    secondary: [],
  },

  category: {
    slug: "ai-implementation-services",
    name: { en: "AI Implementation Services", ro: "Servicii de Implementare AI" },
  },

  businessModel: {
    primary: "service",
    secondary: ["subscription"],
    revenueModelSummary: {
      en: "A fixed-fee implementation project per automation, followed by an optional monthly retainer for monitoring, fixes, and incremental improvements.",
      ro: "Un proiect de implementare cu preț fix per automatizare, urmat de un abonament lunar opțional pentru monitorizare, remedieri și îmbunătățiri incrementale.",
    },
  },

  founderProfile: {
    idealArchetypes: ["theBuilder", "theOperator"],
    summary: {
      en: "A hands-on operator who can sit with a client, map out how their business actually runs today, and translate that into a working system — not a purely technical hire who waits to be told what to build.",
      ro: "Un operator implicat direct, capabil să stea alături de client, să cartografieze cum funcționează cu adevărat afacerea acestuia astăzi și să transforme asta într-un sistem funcțional — nu doar o persoană tehnică ce așteaptă să i se spună ce să construiască.",
    },
    minimumExperienceYears: 2,
  },

  requiredSkills: [
    { key: "ai", importance: 5 },
    { key: "programming", importance: 4 },
    { key: "communication", importance: 4 },
    { key: "sales", importance: 3 },
    { key: "management", importance: 3 },
  ],

  requiredPersonality: [
    { trait: "systemOriented", importance: 5 },
    { trait: "analytical", importance: 4 },
    { trait: "detailOriented", importance: 4 },
    { trait: "patient", importance: 3 },
  ],

  difficulty: {
    level: "high",
    notes: {
      en: "Requires genuine technical fluency with AI/automation tools plus the consultative skill to translate a client's messy reality into a buildable system.",
      ro: "Necesită fluență tehnică reală cu unelte AI/automatizare, plus abilitatea consultativă de a transforma realitatea haotică a unui client într-un sistem construibil.",
    },
  },

  budget: {
    minInvestment: 3000,
    maxInvestment: 12000,
    currency: "EUR",
    ongoingMonthlyCostMin: 200,
    ongoingMonthlyCostMax: 800,
    notes: {
      en: "Mostly software subscriptions and a professional website/portfolio — this business does not require inventory or a physical location.",
      ro: "În mare parte abonamente software și un website/portofoliu profesional — această afacere nu necesită stoc sau un spațiu fizic.",
    },
  },

  revenueSpeed: {
    level: "moderate",
    notes: {
      en: "The first paid project typically follows 4-8 weeks of relationship-building and discovery calls; retainers compound after that.",
      ro: "Primul proiect plătit urmează de obicei după 4-8 săptămâni de construire a relației și apeluri de descoperire; abonamentele se acumulează după aceea.",
    },
  },

  profitMargin: {
    level: "high",
    notes: {
      en: "Once a workflow is built, maintaining it costs a fraction of the original build time — margins on retainers are typically very strong.",
      ro: "Odată ce un flux de lucru este construit, mentenanța lui costă o fracțiune din timpul inițial de construcție — marjele la abonamente sunt de obicei foarte solide.",
    },
  },

  scalability: {
    level: "moderate",
    notes: {
      en: "Bounded by founder delivery capacity until processes and templates are productized; a library of reusable automation templates raises the ceiling significantly.",
      ro: "Limitată de capacitatea de livrare a fondatorului până când procesele și șabloanele sunt transformate în produs; o bibliotecă de șabloane de automatizare reutilizabile ridică semnificativ plafonul.",
    },
  },

  automation: {
    level: "high",
    notes: {
      en: "The operational side of running the agency itself (client onboarding, status reporting, invoicing) is highly automatable using the same tools the agency sells.",
      ro: "Partea operațională a agenției în sine (onboarding clienți, raportare status, facturare) este puternic automatizabilă folosind aceleași unelte pe care agenția le vinde.",
    },
  },

  aiResistance: {
    level: "moderate",
    notes: {
      en: "AI tools are the product, not a threat to it — but as those tools become easier to use directly, the agency's moat shifts toward trust, integration complexity, and ongoing reliability rather than raw tool access.",
      ro: "Uneltele AI sunt produsul, nu o amenințare la adresa lui — dar pe măsură ce aceste unelte devin mai ușor de folosit direct, avantajul competitiv al agenției se mută spre încredere, complexitatea integrării și fiabilitatea continuă, nu spre accesul brut la unelte.",
    },
  },

  legalComplexity: {
    level: "low",
    notes: {
      en: "Standard service agreements and data processing terms; complexity rises if clients are in regulated industries (health, finance).",
      ro: "Contracte de servicii standard și termeni de procesare a datelor; complexitatea crește dacă clienții activează în industrii reglementate (sănătate, finanțe).",
    },
  },

  marketingComplexity: {
    level: "moderate",
    notes: {
      en: "Case studies and demonstrable before/after workflow comparisons do most of the work; less effective through generic broad-audience marketing.",
      ro: "Studiile de caz și comparațiile demonstrabile ale fluxurilor de lucru înainte/după fac cea mai mare parte a muncii; mai puțin eficient prin marketing generic către un public larg.",
    },
  },

  salesComplexity: {
    level: "moderate",
    notes: {
      en: "A consultative sale — usually a discovery call, a short proposal, and a scoped pilot rather than a self-serve checkout.",
      ro: "O vânzare consultativă — de obicei un apel de descoperire, o propunere scurtă și un pilot cu scop clar definit, nu un checkout de tip self-service.",
    },
  },

  learningCurve: {
    level: "high",
    notes: {
      en: "Requires ongoing learning as the underlying AI tools and APIs change quickly.",
      ro: "Necesită învățare continuă pe măsură ce uneltele AI și API-urile de bază se schimbă rapid.",
    },
  },

  locationDependency: {
    level: "none",
    notes: {
      en: "Fully deliverable remotely; client meetings can happen over video call.",
      ro: "Complet livrabilă remote; întâlnirile cu clienții se pot desfășura prin apel video.",
    },
  },

  lifestyle: {
    workMode: "remote",
    travelRequirement: "none",
    onlineOffline: "online",
    salesChannel: "b2b",
    minWeeklyHours: 30,
    maxWeeklyHours: 50,
    freedomLevel: 4,
    notes: {
      en: "Schedule flexibility is high day-to-day, but client delivery deadlines create real weekly structure.",
      ro: "Flexibilitatea programului este mare zi de zi, dar termenele de livrare către clienți creează o structură reală săptămânală.",
    },
  },

  teamSize: {
    atLaunch: "solo",
    atScale: "small",
    notes: {
      en: "Typically solo or founder-plus-one for the first year; scales to a small team of automation builders and one client-success role.",
      ro: "De obicei solo sau fondator-plus-unul în primul an; se extinde către o echipă mică de constructori de automatizări și un rol de client-success.",
    },
  },

  growthPotential: {
    level: "high",
    ceilingNotes: {
      en: "Ceiling rises substantially once the agency productizes its most common automations into repeatable, faster-to-deliver packages.",
      ro: "Plafonul crește semnificativ odată ce agenția transformă cele mai comune automatizări în pachete repetabile, livrabile mai rapid.",
    },
    timeHorizonMonths: 24,
  },

  financialInformation: {
    startupCosts: [
      {
        key: "website",
        label: { en: "Website & portfolio", ro: "Website și portofoliu" },
        typicalMin: 0,
        typicalMax: 2000,
      },
      {
        key: "legal",
        label: { en: "Contract templates & business registration", ro: "Șabloane de contracte și înregistrarea afacerii" },
        typicalMin: 300,
        typicalMax: 1500,
      },
    ],
    recurringCosts: [
      {
        key: "software",
        label: { en: "Automation platform & AI API subscriptions", ro: "Abonamente platformă de automatizare și API-uri AI" },
        typicalMonthlyMin: 100,
        typicalMonthlyMax: 500,
      },
      {
        key: "crm",
        label: { en: "CRM & proposal tools", ro: "CRM și unelte pentru propuneri" },
        typicalMonthlyMin: 50,
        typicalMonthlyMax: 200,
      },
    ],
    revenueStreams: [
      { key: "implementation", label: { en: "Fixed-fee implementation projects", ro: "Proiecte de implementare cu preț fix" } },
      { key: "retainer", label: { en: "Monthly maintenance retainers", ro: "Abonamente lunare de mentenanță" } },
      { key: "templates", label: { en: "Productized automation templates", ro: "Șabloane de automatizare transformate în produs" } },
    ],
    targetMonthlyIncomeMin: 4000,
    targetMonthlyIncomeMax: 15000,
    breakEvenTimelineMonths: 4,
    currency: "EUR",
  },

  customerProfile: {
    description: {
      en: "Owners or operations leads at small-to-mid-size service businesses (10-100 employees) who feel the pain of repetitive manual work but lack in-house technical capacity to fix it.",
      ro: "Proprietari sau responsabili operaționali din afaceri de servicii mici și mijlocii (10-100 de angajați) care simt durerea muncii manuale repetitive, dar nu au capacitate tehnică internă pentru a o rezolva.",
    },
    segments: [
      { en: "Professional services firms (agencies, consultancies, law firms)", ro: "Firme de servicii profesionale (agenții, consultanță, firme de avocatură)" },
      { en: "E-commerce operations teams", ro: "Echipe operaționale de e-commerce" },
      { en: "Local service businesses with high call/inquiry volume", ro: "Afaceri locale de servicii cu volum mare de apeluri/solicitări" },
    ],
    painPoints: [
      { en: "Staff spending hours a day on manual data entry or triage", ro: "Personalul petrece ore pe zi cu introducere manuală de date sau triaj" },
      { en: "Inconsistent follow-up with leads and customers", ro: "Urmărire inconsistentă a lead-urilor și clienților" },
      { en: "No internal technical staff to build or maintain automations", ro: "Fără personal tehnic intern pentru a construi sau întreține automatizări" },
    ],
    buyingTriggers: [
      { en: "A key employee who did this work manually just left", ro: "Un angajat cheie care făcea această muncă manual tocmai a plecat" },
      { en: "Growth has outpaced what manual processes can handle", ro: "Creșterea a depășit ce pot gestiona procesele manuale" },
    ],
  },

  marketingStrategy: {
    positioning: {
      en: "Positioned as a hands-on implementation partner, not a generic \"AI consultancy\" — proof comes from specific before/after workflow case studies, not broad claims about AI.",
      ro: "Poziționată ca un partener de implementare implicat direct, nu o „consultanță AI” generică — dovada vine din studii de caz specifice înainte/după ale fluxurilor de lucru, nu din afirmații generale despre AI.",
    },
    channels: [
      {
        channelType: "linkedInContent",
        description: {
          en: "Founder posts specific, concrete automation breakdowns (\"how we cut invoice processing from 3 hours to 12 minutes\") rather than generic AI commentary.",
          ro: "Fondatorul publică analize concrete și specifice de automatizări („cum am redus procesarea facturilor de la 3 ore la 12 minute”), nu comentarii generale despre AI.",
        },
        priority: "primary",
      },
      {
        channelType: "referralPartnerships",
        description: {
          en: "Partnerships with accountants, bookkeepers, and business consultants who already see which clients are drowning in manual work.",
          ro: "Parteneriate cu contabili, ținători de registre și consultanți de afaceri care văd deja care clienți sunt copleșiți de muncă manuală.",
        },
        priority: "primary",
      },
      {
        channelType: "coldOutreach",
        description: {
          en: "Targeted outreach to operations leads at companies showing public signs of scaling pain (hiring sprees, negative reviews about slow response times).",
          ro: "Outreach direcționat către responsabili operaționali din companii care arată semne publice de dificultăți de scalare (angajări masive, recenzii negative despre timpi de răspuns lenți).",
        },
        priority: "secondary",
      },
    ],
  },

  salesStrategy: {
    approach: {
      en: "A short discovery call to map the client's actual workflow, followed by a scoped, fixed-price proposal for one automation rather than a broad, vague engagement.",
      ro: "Un apel scurt de descoperire pentru a cartografia fluxul real de lucru al clientului, urmat de o propunere cu scop clar și preț fix pentru o automatizare, nu un angajament larg și vag.",
    },
    salesCycleLengthDays: 21,
    pricingModel: {
      en: "Fixed fee per implementation project, plus an optional flat monthly retainer for maintenance.",
      ro: "Preț fix per proiect de implementare, plus un abonament lunar fix opțional pentru mentenanță.",
    },
  },

  operations: {
    coreProcesses: [
      { en: "Discovery call and workflow mapping", ro: "Apel de descoperire și cartografierea fluxului de lucru" },
      { en: "Automation build and internal testing", ro: "Construirea automatizării și testare internă" },
      { en: "Client handoff, documentation, and training", ro: "Predarea către client, documentație și instruire" },
      { en: "Ongoing monitoring and incident response", ro: "Monitorizare continuă și răspuns la incidente" },
    ],
    dailyWorkflow: {
      en: "A mix of client calls, hands-on building in automation platforms, and monitoring dashboards for existing client workflows.",
      ro: "O combinație de apeluri cu clienți, construcție directă în platformele de automatizare și monitorizarea dashboard-urilor pentru fluxurile de lucru existente ale clienților.",
    },
    fulfillmentModel: {
      en: "Delivered entirely by the founder (and later, automation builders) working directly in the client's own tools rather than shipping a packaged product.",
      ro: "Livrată în întregime de fondator (și ulterior, de constructori de automatizări) care lucrează direct în uneltele proprii ale clientului, nu prin livrarea unui produs ambalat.",
    },
  },

  scaling: {
    path: {
      en: "Start fully bespoke, then extract the most commonly requested automations into semi-productized packages that can be delivered faster and by a small team rather than only the founder.",
      ro: "Începe complet personalizat, apoi extrage cele mai des solicitate automatizări în pachete semi-productizate, livrabile mai rapid și de o echipă mică, nu doar de fondator.",
    },
    bottlenecks: [
      { en: "Founder is the only person who can scope and sell new projects", ro: "Fondatorul este singura persoană care poate defini scopul și vinde proiecte noi" },
      { en: "Custom, one-off builds don't reuse well across clients without deliberate templating", ro: "Construcțiile personalizate, unice, nu se reutilizează bine între clienți fără șablonizare deliberată" },
    ],
    milestones: [
      {
        monthsFromLaunch: 6,
        description: {
          en: "First three retainer clients signed, validating the maintenance-revenue model.",
          ro: "Primii trei clienți cu abonament semnați, validând modelul de venit din mentenanță.",
        },
      },
      {
        monthsFromLaunch: 12,
        description: {
          en: "First hire (a second automation builder) to handle delivery capacity beyond the founder.",
          ro: "Prima angajare (un al doilea constructor de automatizări) pentru a gestiona capacitatea de livrare dincolo de fondator.",
        },
      },
      {
        monthsFromLaunch: 18,
        description: {
          en: "First productized automation template package sold to a new client with under a week of customization.",
          ro: "Primul pachet de șablon de automatizare transformat în produs, vândut unui client nou cu mai puțin de o săptămână de personalizare.",
        },
      },
    ],
  },

  risks: [
    {
      description: {
        en: "Underlying AI/automation platforms change their pricing or capabilities, breaking existing client workflows.",
        ro: "Platformele AI/automatizare de bază își schimbă prețurile sau capacitățile, defectând fluxurile de lucru existente ale clienților.",
      },
      severity: "moderate",
      mitigation: {
        en: "Build with platform-agnostic patterns where possible and maintain a change log per client workflow.",
        ro: "Construiește folosind pattern-uri agnostice de platformă acolo unde este posibil și menține un jurnal de modificări per flux de lucru al clientului.",
      },
    },
    {
      description: {
        en: "Client dependency on the founder personally, making delivery hard to delegate early on.",
        ro: "Dependența clientului de fondator personal, ceea ce face livrarea greu de delegat la început.",
      },
      severity: "moderate",
      mitigation: {
        en: "Document every build thoroughly from day one so a second builder can be onboarded without the founder re-explaining everything.",
        ro: "Documentează temeinic fiecare construcție încă din prima zi, astfel încât un al doilea constructor să poată fi integrat fără ca fondatorul să reexplice totul.",
      },
    },
    {
      description: {
        en: "As no-code AI tools become easier to use directly, some prospective clients may attempt to self-serve instead of hiring the agency.",
        ro: "Pe măsură ce uneltele AI no-code devin mai ușor de folosit direct, unii clienți potențiali ar putea încerca să se autodeservească în loc să angajeze agenția.",
      },
      severity: "low",
      mitigation: {
        en: "Compete on reliability, integration complexity, and time saved rather than on tool access alone.",
        ro: "Concurează pe fiabilitate, complexitatea integrării și timpul economisit, nu doar pe accesul la unelte.",
      },
    },
  ],

  advantages: [
    { description: { en: "Very low startup capital compared to most service businesses.", ro: "Capital de pornire foarte redus comparativ cu majoritatea afacerilor de servicii." } },
    { description: { en: "High profit margins once a workflow is built and stable.", ro: "Marje de profit ridicate odată ce un flux de lucru este construit și stabil." } },
    { description: { en: "Fully remote and location-independent from day one.", ro: "Complet remote și independentă de locație încă din prima zi." } },
    { description: { en: "Strong demand tailwind as more businesses look to adopt AI without in-house expertise.", ro: "Cerere puternică în creștere, pe măsură ce tot mai multe afaceri vor să adopte AI fără expertiză internă." } },
  ],

  aiUsage: {
    useCases: [
      {
        area: "clientDelivery",
        description: {
          en: "AI is the actual product: LLM-powered agents, classification, and generation are built directly into client-facing workflows.",
          ro: "AI este chiar produsul: agenți bazați pe LLM, clasificare și generare sunt integrate direct în fluxurile de lucru orientate către client.",
        },
        maturity: "coreToModel",
      },
      {
        area: "internalOperations",
        description: {
          en: "The agency uses AI internally for proposal drafting, meeting summarization, and code-assisted automation building.",
          ro: "Agenția folosește AI intern pentru redactarea propunerilor, sumarizarea întâlnirilor și construirea de automatizări asistată de cod.",
        },
        maturity: "established",
      },
    ],
    aiDependencyLevel: "high",
  },

  recommendedTools: [
    { name: "Make", category: "automationPlatform", isRequired: true, websiteUrl: "https://www.make.com" },
    { name: "Zapier", category: "automationPlatform", isRequired: false, websiteUrl: "https://zapier.com" },
    { name: "OpenAI API", category: "aiProvider", isRequired: true, websiteUrl: "https://platform.openai.com" },
    { name: "Notion", category: "documentation", isRequired: false, websiteUrl: "https://www.notion.so" },
    { name: "HubSpot", category: "crm", isRequired: false, websiteUrl: "https://www.hubspot.com" },
  ],

  kpis: [
    {
      key: "activeRetainerClients",
      label: { en: "Active retainer clients", ro: "Clienți activi cu abonament" },
      targetDescription: { en: "8-12 active retainer clients by month 12.", ro: "8-12 clienți activi cu abonament până în luna 12." },
    },
    {
      key: "avgProjectValue",
      label: { en: "Average implementation project value", ro: "Valoarea medie a unui proiect de implementare" },
      targetDescription: { en: "EUR 2,500-5,000 per implementation project.", ro: "2.500-5.000 EUR per proiect de implementare." },
    },
    {
      key: "workflowUptime",
      label: { en: "Client workflow uptime", ro: "Timp de funcționare a fluxurilor de lucru ale clienților" },
      targetDescription: { en: "99%+ uptime across all maintained client automations.", ro: "peste 99% timp de funcționare pentru toate automatizările clienților întreținute." },
    },
    {
      key: "retainerRetention",
      label: { en: "Retainer client retention rate", ro: "Rata de retenție a clienților cu abonament" },
      targetDescription: { en: "90%+ month-over-month retention.", ro: "peste 90% retenție lună de lună." },
    },
  ],

  ninetyDayPlan: {
    theme: {
      en: "Land the first three paying implementation projects and turn at least one into a retainer.",
      ro: "Obține primele trei proiecte de implementare plătite și transformă cel puțin unul într-un abonament.",
    },
    tasks: [
      {
        week: 1,
        title: { en: "Define the initial service package and pricing", ro: "Definește pachetul de servicii inițial și prețurile" },
        description: {
          en: "Decide the first 2-3 automation types to specialize in and set fixed-fee pricing for each.",
          ro: "Decide primele 2-3 tipuri de automatizări pe care te specializezi și stabilește prețuri fixe pentru fiecare.",
        },
      },
      {
        week: 3,
        title: { en: "Publish the first case study", ro: "Publică primul studiu de caz" },
        description: {
          en: "Document a real or pilot automation build as a concrete before/after story for marketing.",
          ro: "Documentează o construcție reală sau pilot de automatizare ca poveste concretă înainte/după, pentru marketing.",
        },
      },
      {
        week: 6,
        title: { en: "Start referral partner outreach", ro: "Începe outreach-ul către parteneri de recomandare" },
        description: {
          en: "Reach out to 15-20 accountants/consultants who work with the target customer profile.",
          ro: "Contactează 15-20 de contabili/consultanți care lucrează cu profilul de client țintă.",
        },
      },
      {
        week: 9,
        title: { en: "Deliver first paid implementation project", ro: "Livrează primul proiect de implementare plătit" },
        description: {
          en: "Complete discovery, build, and handoff for the first paying client.",
          ro: "Finalizează descoperirea, construcția și predarea pentru primul client plătitor.",
        },
      },
      {
        week: 13,
        title: { en: "Convert first client to a maintenance retainer", ro: "Convertește primul client la un abonament de mentenanță" },
        description: {
          en: "Propose an ongoing monthly retainer once the first workflow proves its value.",
          ro: "Propune un abonament lunar continuu odată ce primul flux de lucru își dovedește valoarea.",
        },
      },
    ],
  },

  exitPotential: {
    viable: true,
    typicalPaths: ["acquisition", "acquihire", "managementBuyout"],
    notes: {
      en: "Most exits in this space are small acquihires by larger consultancies or software companies wanting an implementation arm, or acquisitions of the client book and retainer revenue by a similar agency.",
      ro: "Majoritatea ieșirilor în acest domeniu sunt acquihire-uri mici realizate de consultanțe mai mari sau companii de software care doresc un braț de implementare, sau achiziții ale portofoliului de clienți și veniturilor din abonamente de către o agenție similară.",
    },
  },

  blueprintStructure: {
    sections: [
      "executiveSummary",
      "businessDescription",
      "targetAudience",
      "marketAnalysis",
      "competitorAnalysis",
      "swot",
      "businessModelCanvas",
      "marketingPlan",
      "salesStrategy",
      "financialForecast",
      "operations",
      "launchPlan",
      "growthPlan",
      "riskAnalysis",
      "exitStrategy",
    ],
    promptContext: {
      en: "Emphasize concrete before/after workflow examples over abstract AI capability claims throughout the generated plan.",
      ro: "Pune accent pe exemple concrete de fluxuri de lucru înainte/după, nu pe afirmații abstracte despre capacitățile AI, pe tot parcursul planului generat.",
    },
  },

  matchingMetadata: {
    requiredSkills: [
      { key: "ai", importance: 5 },
      { key: "programming", importance: 4 },
    ],
    preferredSkills: [
      { key: "sales", importance: 3 },
      { key: "communication", importance: 4 },
    ],
    requiredPersonality: [{ trait: "systemOriented", importance: 5 }],
    preferredPersonality: [
      { trait: "analytical", importance: 4 },
      { trait: "patient", importance: 3 },
    ],
    requiredBudget: { min: 3000, max: 12000, currency: "EUR" },
    preferredBudget: { min: 5000, max: 8000, currency: "EUR" },
    riskProfile: "moderate",
    timeAvailability: { minWeeklyHours: 30, maxWeeklyHours: 50 },
    communicationStyle: ["consultative", "direct"],
    technicalLevel: 4,
    leadershipLevel: 3,
    creativityLevel: 3,
    salesAffinity: 3,
    automationAffinity: 5,
    remotePreference: "remote",
    travelPreference: "none",
    idealFounderArchetypes: ["theBuilder", "theOperator"],
  },
};

export const validatedAiAutomationAgencyGenome = businessGenomeSchema.parse(aiAutomationAgency);

export default aiAutomationAgency;
