import type { Dictionary } from "../dictionary";

export const de: Dictionary = {
  meta: {
    siteName: "Wie arm bin ich?",
    homeTitle:
      "Wie arm bin ich? — Sieh, wo du in der globalen Vermögensverteilung stehst",
    homeDescription:
      "Finde heraus, wo du wirklich in der Vermögensverteilung stehst. Gib dein Einkommen oder Nettovermögen ein und vergleiche dich mit den reichsten — und ärmsten — Menschen deines Landes. Interaktive Charts für über 30 Länder.",
    homeOgTitle: "Wie arm bin ich? — Wo stehst du wirklich?",
    homeOgDescription:
      "Hältst du dich für Mittelschicht? Gib dein Einkommen ein und sieh, wo du wirklich in der Vermögensverteilung stehst. Interaktive Daten für über 30 Länder.",
    countryTitleTemplate:
      "Wie arm bin ich in {country}? — Vermögensverteilung & Ungleichheit",
    countryDescriptionTemplate:
      "Sieh, wo du in der Vermögensverteilung von {country} stehst. Vergleiche dein Einkommen und Nettovermögen mit den oberen 1 %, 10 % und unteren 50 %. Interaktive Charts mit Daten von WID.world und OECD.",
    countryOgTitleTemplate: "Wie arm bin ich in {country}?",
    countryOgDescriptionTemplate:
      "Gib dein Einkommen ein und sieh, wo du wirklich in der Vermögensverteilung von {country} stehst. Interaktive Daten zur Ungleichheit, basierend auf WID.world.",
  },
  nav: {
    home: "Wie arm bin ich?",
    howLong: "Wie lange?",
    compareCountries: "Vergleichen",
    languageSwitchAria: "Sprache wechseln",
    themeToggleAria: "Hell-/Dunkelmodus umschalten",
  },
  home: {
    h1: "Wie arm bin ich?",
    heroSubtitle:
      "Gib dein Einkommen oder Vermögen ein und entdecke, wo du wirklich stehst.",
    scrollToExplore: "Scrolle für mehr",
    distributionTitle: "{flag} {country} — Vermögensverteilung",
    distributionSubtitle: "Vermögensanteil nach Bevölkerungsgruppen (2023)",
    populationVsWealth: "Bevölkerung vs. Vermögen — {country}",
    scaleOfConcentrationH2: "Das Ausmaß der Konzentration",
    scaleOfConcentrationLead:
      "Jedes Rechteck steht für Vermögen. Die Fläche zeigt, wie viel jede Gruppe tatsächlich besitzt. Sieh, wem was gehört.",
    statisticsH2: "Die Zahlen hinter der Ungleichheit",
    whoActuallyPaysH2: "Wer zahlt wirklich?",
    whoActuallyPaysLead:
      "Effektive Steuersätze erzählen eine andere Geschichte als nominale. Wenn man alle tatsächlich gezahlten Steuern einbezieht — inklusive Kapitalerträge, Veräußerungsgewinne und Unternehmensstrukturen — wird das System an der Spitze oft regressiv.",
    centuryOfChangeH2: "Ein Jahrhundert des Wandels",
    centuryOfChangeLead:
      "Wie sich die Vermögenskonzentration in {country} entwickelt hat — und welche politischen Entscheidungen jeden Wandel ausgelöst haben.",
    wagesKeepingUpH2: "Halten die Löhne mit?",
    wagesKeepingUpLead:
      "Löhne, Verbraucherpreise und Immobilienpreise — alle auf das Jahr 2000 indexiert. Wenn die Linien auseinanderlaufen, fällt jemand zurück.",
    seeBillionaireCta:
      "Sieh, wie lange du brauchst, um so viel zu verdienen wie die reichste Person in {country}",
    compareAcrossCountriesCta:
      "Wie würde dein Vermögen in einem anderen Land abschneiden?",
    attribution:
      "Daten von WID.world, OECD und SWIID. Open-Source-Projekt zu Bildungszwecken.",
  },
  input: {
    modeWealth: "Nettovermögen",
    modeIncome: "Jahreseinkommen",
    incomeLabelTemplate:
      "Gib dein Brutto-Jahreseinkommen (vor Steuern) in {currency} ein",
    wealthLabelTemplate: "Gib dein Nettovermögen in {currency} ein",
    incomeHint:
      "Brutto bedeutet Löhne, Kapitaleinkünfte und Renten vor Steuern.",
    wealthHint:
      "Trage DEINEN persönlichen Anteil ein — wenn du Finanzen mit Partner:in teilst, halbieren.",
    ageOptional: "Dein Alter (optional):",
    agePlaceholder: "z. B. 30",
    knowYourAssets:
      "Kennst du dein Vermögen? Füge Immobilien, Investitionen u. m. für eine genauere Schätzung hinzu",
    estimatedNetWealth: "Geschätztes Nettovermögen:",
    resultWealthTemplate: "In {country} bist du wohlhabender als",
    resultIncomeTemplate:
      "In {country} liegst du, gemessen am geschätzten Vermögen aus deinem Einkommen, vor",
    ofThePopulation: "der Bevölkerung",
    inTheTop1: "Du gehörst zum obersten 1 %",
    belowTheMedian: "Unter dem Median-Vermögen von {amount}",
    privacyNote:
      "Deine Daten bleiben im Browser. Nichts wird gespeichert oder versendet.",
    incomeConvertedNote:
      "Einkommen wird in eine geschätzte Vermögensspanne umgerechnet. Für genaue Ergebnisse den Modus „Nettovermögen“ nutzen.",
  },
  share: {
    label: "Teilen:",
    nativeShareButton: "Teilen…",
    nativeShareAria: "Über System-Teilen-Dialog teilen",
    twitter: "X / Twitter",
    whatsapp: "WhatsApp",
    copyLink: "Link kopieren",
    copied: "Kopiert!",
    copyFailed: "Kopieren fehlgeschlagen",
    shareTextTemplate:
      "Ich bin reicher als {percentile} der Bevölkerung in {country}. Wo stehst du?",
  },
  stats: {
    title: "Die Zahlen hinter der Ungleichheit",
    top1OwnsTemplate: "Das oberste 1 % in {country} besitzt",
    top1OwnsSublabel: "des gesamten Nettovermögens",
    bottom50Owns: "Die unteren 50 % besitzen",
    bottom50OwnsSublabel: "des gesamten Nettovermögens",
    giniLabel: "Vermögens-Gini-Koeffizient",
    giniSublabel:
      "0 = vollkommene Gleichheit, 1 = eine Person besitzt alles",
    meanWealthLabel: "Durchschnittsvermögen pro Erwachsenem",
    meanWealthSublabel: "Wird durch Ultrareiche nach oben verzerrt",
    medianWealthLabel: "Median-Vermögen pro Erwachsenem",
    medianWealthSublabel: "Was eine typische Person tatsächlich hat",
    meanMedianRatioLabel: "Verhältnis Durchschnitt / Median",
    meanMedianRatioSublabel: "Höher = stärker verzerrte Verteilung",
    togglePppOff: "Kaufkraft anzeigen (PPP)",
    togglePppOn: "Kaufkraft wird angezeigt",
    pppSublabelTemplate: "PPP: ~${value}K Kaufkraft",
    regionalContextTitleTemplate: "{country} im regionalen Kontext",
    regionalAggregatesNote:
      "Regionale Werte sind bevölkerungsgewichtete Durchschnitte der erfassten Länder.",
    thisCountryRegion: "Region von {country}",
  },
  footer: {
    about: "Über",
    faq: "FAQ",
    methodology: "Methodik",
    github: "GitHub",
    buildDateTemplate: "Daten Stand {date}",
  },
};
