import type { Dictionary } from "../dictionary";

export const it: Dictionary = {
  meta: {
    siteName: "Quanto sono povero?",
    homeTitle:
      "Quanto sono povero? — Scopri dove ti collochi nella ricchezza globale",
    homeDescription:
      "Scopri dove ti collochi davvero nella distribuzione della ricchezza. Inserisci il tuo reddito o patrimonio netto e confrontati con i più ricchi — e i più poveri — del tuo paese. Grafici interattivi per oltre 30 paesi.",
    homeOgTitle: "Quanto sono povero? — Scopri dove ti collochi",
    homeOgDescription:
      "Pensi di essere classe media? Inserisci il tuo reddito e scopri dove ti collochi davvero nella distribuzione della ricchezza. Dati interattivi per oltre 30 paesi.",
    countryTitleTemplate:
      "Quanto sono povero in {country}? — Distribuzione della ricchezza e disuguaglianze",
    countryDescriptionTemplate:
      "Scopri dove ti collochi nella distribuzione della ricchezza in {country}. Confronta reddito e patrimonio con l'1% più ricco, il top 10% e il 50% più povero. Grafici interattivi con dati di WID.world e OCSE.",
    countryOgTitleTemplate: "Quanto sono povero in {country}?",
    countryOgDescriptionTemplate:
      "Inserisci il tuo reddito e scopri la tua reale collocazione nella distribuzione della ricchezza in {country}. Dati interattivi sulle disuguaglianze, da WID.world.",
  },
  nav: {
    home: "Quanto sono povero?",
    howLong: "Quanto tempo?",
    compareCountries: "Confronta",
    languageSwitchAria: "Cambia lingua",
    themeToggleAria: "Modalità chiara / scura",
  },
  home: {
    h1: "Quanto sono povero?",
    heroSubtitle:
      "Inserisci il tuo reddito o patrimonio e scopri dove ti collochi davvero.",
    scrollToExplore: "Scorri per scoprire di più",
    distributionTitle: "{flag} {country} — Distribuzione della ricchezza",
    distributionSubtitle:
      "Quota di ricchezza per gruppi di popolazione (2023)",
    populationVsWealth: "Popolazione vs. ricchezza — {country}",
    scaleOfConcentrationH2: "La scala della concentrazione",
    scaleOfConcentrationLead:
      "Ogni rettangolo rappresenta della ricchezza. L'area mostra quanto possiede davvero ciascun gruppo. Guarda chi ha cosa.",
    statisticsH2: "I numeri che definiscono la disuguaglianza",
    whoActuallyPaysH2: "Chi paga davvero?",
    whoActuallyPaysLead:
      "Le aliquote effettive raccontano una storia diversa da quelle nominali. Includendo tutte le tasse realmente versate — tra cui il trattamento dei redditi di capitale, delle plusvalenze e delle strutture societarie — il sistema diventa spesso regressivo all'estremo superiore.",
    centuryOfChangeH2: "Un secolo di cambiamenti",
    centuryOfChangeLead:
      "Come la concentrazione della ricchezza in {country} è cambiata — e quali scelte politiche hanno guidato ogni svolta.",
    wagesKeepingUpH2: "I salari stanno tenendo il passo?",
    wagesKeepingUpLead:
      "Salari, prezzi al consumo e prezzi delle case — tutti indicizzati al 2000. Quando le linee divergono, qualcuno resta indietro.",
    seeBillionaireCta:
      "Vedi quanto tempo ti servirebbe per guadagnare quanto la persona più ricca di {country}",
    compareAcrossCountriesCta:
      "Come si classificherebbe la tua ricchezza in un altro paese?",
    attribution:
      "Dati da WID.world, OCSE e SWIID. Progetto open source a scopo didattico.",
  },
  input: {
    modeWealth: "Patrimonio netto",
    modeIncome: "Reddito annuo",
    incomeLabelTemplate:
      "Inserisci il tuo reddito annuo lordo (al lordo delle imposte) in {currency}",
    wealthLabelTemplate: "Inserisci il tuo patrimonio netto in {currency}",
    incomeHint:
      "Lordo include stipendi, redditi di capitale e pensioni al lordo delle imposte.",
    wealthHint:
      "Inserisci la TUA quota personale — se condividi le finanze con il/la partner, indica la metà.",
    ageOptional: "La tua età (facoltativa):",
    agePlaceholder: "es. 30",
    knowYourAssets:
      "Conosci i tuoi asset? Aggiungi immobili, investimenti e altro per una stima più precisa",
    estimatedNetWealth: "Patrimonio netto stimato:",
    resultWealthTemplate: "In {country} sei più ricco/a di",
    resultIncomeTemplate:
      "In {country}, sulla base del patrimonio stimato dal tuo reddito, ti collochi davanti al",
    ofThePopulation: "della popolazione",
    inTheTop1: "Sei nell'1% più ricco",
    belowTheMedian: "Sotto il patrimonio mediano di {amount}",
    privacyNote:
      "I tuoi dati restano nel tuo browser. Nulla viene salvato o inviato.",
    incomeConvertedNote:
      "Il reddito viene convertito in una fascia stimata di patrimonio. Per risultati precisi usa la modalità «Patrimonio netto».",
  },
  share: {
    label: "Condividi:",
    nativeShareButton: "Condividi…",
    nativeShareAria: "Condividi tramite il menu di sistema",
    twitter: "X / Twitter",
    whatsapp: "WhatsApp",
    copyLink: "Copia il link",
    copied: "Copiato!",
    copyFailed: "Copia non riuscita",
    shareTextTemplate:
      "Sono più ricco/a di {percentile} della popolazione in {country}. E tu?",
  },
  stats: {
    title: "I numeri che definiscono la disuguaglianza",
    top1OwnsTemplate: "L'1% più ricco in {country} possiede",
    top1OwnsSublabel: "della ricchezza nazionale totale",
    bottom50Owns: "Il 50% più povero possiede",
    bottom50OwnsSublabel: "della ricchezza nazionale totale",
    giniLabel: "Coefficiente di Gini della ricchezza",
    giniSublabel: "0 = uguaglianza perfetta, 1 = una sola persona possiede tutto",
    meanWealthLabel: "Patrimonio medio per adulto",
    meanWealthSublabel: "Spinto verso l'alto dagli ultra-ricchi",
    medianWealthLabel: "Patrimonio mediano per adulto",
    medianWealthSublabel:
      "Quanto possiede davvero la persona tipica",
    meanMedianRatioLabel: "Rapporto media / mediana",
    meanMedianRatioSublabel: "Più alto = distribuzione più sbilanciata",
    togglePppOff: "Mostra potere d'acquisto (PPP)",
    togglePppOn: "Mostro il potere d'acquisto",
    pppSublabelTemplate: "PPP: ~{value}K USD di potere d'acquisto",
    regionalContextTitleTemplate: "{country} nel contesto regionale",
    regionalAggregatesNote:
      "Gli aggregati regionali sono medie ponderate per popolazione dei paesi coperti.",
    thisCountryRegion: "Regione di {country}",
  },
  footer: {
    about: "Informazioni",
    faq: "FAQ",
    methodology: "Metodologia",
    github: "GitHub",
    buildDateTemplate: "Dati al {date}",
  },
};
