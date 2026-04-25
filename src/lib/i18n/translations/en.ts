import type { Dictionary } from "../dictionary";

export const en: Dictionary = {
  meta: {
    siteName: "How Poor Am I?",
    homeTitle: "How Poor Am I? — See Where You Stand in Global Wealth",
    homeDescription:
      "Find out where you really stand in the wealth distribution. Enter your income or net wealth and discover how you compare to the richest — and poorest — people in your country. Interactive charts for 30+ countries.",
    homeOgTitle: "How Poor Am I? — See Where You Stand",
    homeOgDescription:
      "Think you're middle class? Enter your income and find out where you really stand in the wealth distribution. Interactive data for 30+ countries.",
    countryTitleTemplate:
      "How Poor Am I in {country}? — Wealth Distribution & Inequality",
    countryDescriptionTemplate:
      "See where you stand in {country}'s wealth distribution. Compare your income and net worth to the top 1%, top 10%, and bottom 50%. Interactive charts with data from WID.world and OECD.",
    countryOgTitleTemplate: "How Poor Am I in {country}?",
    countryOgDescriptionTemplate:
      "Enter your income and discover where you really stand in {country}'s wealth distribution. Interactive inequality data powered by WID.world.",

    compareTitle: "How Long to Match a Billionaire? — Salary vs. Mega-Wealth",
    compareDescription:
      "How many years, lifetimes, or entire historical eras would it take to earn as much as a billionaire? Enter your salary and put mega-wealth into perspective.",
    compareCountryTitleTemplate:
      "How Long to Match the Richest in {country}? — Billionaire Comparison",
    compareCountryDescriptionTemplate:
      "How many years would it take you to earn as much as the richest person in {country}?{richestSuffix} Enter your salary and find out.",

    compareCountriesTitle:
      "Compare Your Wealth Across 30 Countries — Cross-Country Wealth Calculator",
    compareCountriesDescription:
      "How would your wealth or income rank in another country? Enter an amount and see your percentile in 30+ countries side by side.",

    aboutTitle: "About — How Poor Am I?",
    aboutDescription:
      "How Poor Am I is a free, open-source tool that visualizes global wealth inequality using data from WID.world, OECD, and SWIID.",
    faqTitle: "FAQ — How Poor Am I?",
    faqDescription:
      "Frequently asked questions about How Poor Am I — the data, the calculations, and what the percentiles really mean.",
    methodologyTitle: "Methodology — How Poor Am I?",
    methodologyDescription:
      "Inside the methodology behind How Poor Am I — data sources, percentile estimation, age adjustment, and PPP conversion.",
  },
  nav: {
    home: "How Poor Am I?",
    howLong: "How Long?",
    compareCountries: "Compare",
    languageSwitchAria: "Change language",
    themeToggleAria: "Toggle dark / light mode",
  },
  home: {
    h1: "How Poor Am I?",
    heroSubtitle:
      "Enter your income or wealth and discover where you really stand.",
    scrollToExplore: "Scroll to explore more",
    distributionTitle: "{flag} {country} — Wealth Distribution",
    distributionSubtitle: "Wealth share by population group (2023)",
    populationVsWealth: "Population vs. Wealth — {country}",
    scaleOfConcentrationH2: "The Scale of Concentration",
    scaleOfConcentrationLead:
      "Each rectangle below represents wealth. The area shows how much each group actually owns. Look at who has what.",
    statisticsH2: "The Numbers That Define Inequality",
    whoActuallyPaysH2: "Who Actually Pays?",
    whoActuallyPaysLead:
      "Effective tax rates tell a different story than statutory rates. When you account for all taxes actually paid — including how investment income, capital gains, and corporate structures are treated — the system often becomes regressive at the very top.",
    centuryOfChangeH2: "A Century of Change",
    centuryOfChangeLead:
      "How wealth concentration in {country} has evolved — and what policy choices drove each shift.",
    wagesKeepingUpH2: "Are Wages Keeping Up?",
    wagesKeepingUpLead:
      "Wages, consumer prices, and house prices — all indexed to 2000. When the lines diverge, someone is falling behind.",
    seeBillionaireCta:
      "See how long it would take you to earn as much as the richest person in {country}",
    compareAcrossCountriesCta:
      "How would your wealth rank in a different country?",
    attribution:
      "Data sourced from WID.world, OECD, and SWIID. Open-source project for educational purposes.",
  },
  input: {
    modeWealth: "Net Wealth",
    modeIncome: "Annual Income",
    incomeLabelTemplate: "Enter your gross (pre-tax) annual income in {currency}",
    wealthLabelTemplate: "Enter your net wealth in {currency}",
    incomeHint:
      "Pre-tax includes wages, capital income, and pensions before tax.",
    wealthHint:
      "Enter YOUR personal share — if you share finances with a partner, enter half.",
    ageOptional: "Your age (optional):",
    agePlaceholder: "e.g. 30",
    knowYourAssets:
      "Know your assets? Add property, investments & more for a tighter estimate",
    estimatedNetWealth: "Est. net wealth:",
    resultWealthTemplate: "In {country}, you are wealthier than",
    resultIncomeTemplate:
      "In {country}, based on estimated wealth from your income, you rank higher than",
    ofThePopulation: "of the population",
    inTheTop1: "You are in the top 1%",
    belowTheMedian: "Below the median wealth of {amount}",
    privacyNote:
      "Your data stays in your browser. Nothing is stored or sent anywhere.",
    incomeConvertedNote:
      "Income is converted to an estimated wealth range. For exact results, use \"Net Wealth\" mode.",
  },
  share: {
    label: "Share:",
    nativeShareButton: "Share…",
    nativeShareAria: "Share via system share sheet",
    twitter: "X / Twitter",
    whatsapp: "WhatsApp",
    copyLink: "Copy link",
    copied: "Copied!",
    copyFailed: "Copy failed",
    shareTextTemplate:
      "I'm wealthier than {percentile} of the population in {country}. Where do you stand?",
  },
  stats: {
    title: "The Numbers That Define Inequality",
    top1OwnsTemplate: "The top 1% in {country} owns",
    top1OwnsSublabel: "of total national wealth",
    bottom50Owns: "The bottom 50% owns",
    bottom50OwnsSublabel: "of total national wealth",
    giniLabel: "Wealth Gini coefficient",
    giniSublabel: "0 = perfect equality, 1 = one person owns everything",
    meanWealthLabel: "Mean wealth per adult",
    meanWealthSublabel: "Skewed upward by the ultra-wealthy",
    medianWealthLabel: "Median wealth per adult",
    medianWealthSublabel: "What the typical person actually has",
    meanMedianRatioLabel: "Mean / Median ratio",
    meanMedianRatioSublabel: "Higher = more skewed distribution",
    togglePppOff: "Show purchasing power (PPP)",
    togglePppOn: "Showing purchasing power",
    pppSublabelTemplate: "PPP: ~${value}K purchasing power",
    regionalContextTitleTemplate: "{country} in Regional Context",
    regionalAggregatesNote:
      "Regional aggregates are population-weighted averages of covered countries.",
    thisCountryRegion: "{country}'s region",

    thresholdsTitle: "What Does It Take to Join Each Group?",
    thresholdsLeadTemplate:
      "Estimated minimum net wealth to enter each wealth bracket in {country}.",
    thresholdsNote:
      "Thresholds are estimates based on Pareto-interpolated WID.world data.",
    thresholdTop50: "Top 50%",
    thresholdTop10: "Top 10%",
    thresholdTop1: "Top 1%",
    thresholdTop01: "Top 0.1%",

    impactLeadTemplate:
      "A median income earner in {country} would need to work for",
    impactYears: "years",
    impactTrailing: "to accumulate the average wealth of the top 1%",
    impactNoteTemplate:
      "Based on median pre-tax national income of {income}/year vs. average top 1% wealth of {wealth}",

    doubleGapTitle: "Income vs. Wealth: The Double Gap",
    incomeDistributionTitle: "Income Distribution",
    wealthDistributionTitle: "Wealth Distribution",
    giniIncomeLineTemplate: "Gini (income): {value}",
    giniWealthLineTemplate: "Gini (wealth): {value}",
    barLabelTop1: "Top 1%",
    barLabelTop10: "Top 10%",
    barLabelMiddle40: "Middle 40%",
    barLabelBottom50: "Bottom 50%",

    globalPictureTitle: "The Global Picture",
    globalTop1Owns: "Global top 1% owns",
    globalTop1OwnsSublabel: "of all global wealth",
    globalBottom50Owns: "Global bottom 50% owns",
    globalBottom50OwnsSublabel: "of all global wealth",
    globalGiniLabel: "Global wealth Gini",
    globalGiniSublabel: "Among the highest of any metric measured",
    sourceTemplate: "Source: {source}",

    medianWealthUsdLabel: "median wealth (USD)",
    regionTop1Template: "Top 1%: {value}%",
    regionBottom50Template: "Bot 50%: {value}%",
  },
  footer: {
    about: "About",
    faq: "FAQ",
    methodology: "Methodology",
    github: "GitHub",
    buildDateTemplate: "Data built {date}",
  },
};
