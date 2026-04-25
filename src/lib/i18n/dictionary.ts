/**
 * Dictionary shape — every translated locale must provide all keys.
 *
 * Keys are organized by surface. To add a new surface or string:
 *   1. Add it here on the `Dictionary` type.
 *   2. Provide the English translation in `translations/en.ts`.
 *   3. Translate it in every other `translations/{locale}.ts`.
 *
 * Strings with `{placeholder}` segments are interpolated at render time via
 * the `t()` helper in `index.ts`.
 */

export interface Dictionary {
  /** Browser/SEO metadata used by `generateMetadata`. */
  readonly meta: {
    readonly siteName: string;
    readonly homeTitle: string;
    readonly homeDescription: string;
    readonly homeOgTitle: string;
    readonly homeOgDescription: string;
    /** "How Poor Am I in {country}? — Wealth Distribution & Inequality" */
    readonly countryTitleTemplate: string;
    /** Description for /{country}, with {country} placeholder */
    readonly countryDescriptionTemplate: string;
    readonly countryOgTitleTemplate: string;
    readonly countryOgDescriptionTemplate: string;

    // Compare (How Long?) page
    readonly compareTitle: string;
    readonly compareDescription: string;
    /** "How Long to Match the Richest in {country}? — Billionaire Comparison" */
    readonly compareCountryTitleTemplate: string;
    /** "How many years would it take you to earn as much as the richest person in {country}?{richestSuffix} Enter your salary and find out." */
    readonly compareCountryDescriptionTemplate: string;

    // Compare-countries page
    readonly compareCountriesTitle: string;
    readonly compareCountriesDescription: string;

    // About / FAQ / Methodology page meta
    readonly aboutTitle: string;
    readonly aboutDescription: string;
    readonly faqTitle: string;
    readonly faqDescription: string;
    readonly methodologyTitle: string;
    readonly methodologyDescription: string;
  };

  /** Top-of-page nav. */
  readonly nav: {
    readonly home: string;
    readonly howLong: string;
    readonly compareCountries: string;
    readonly languageSwitchAria: string;
    readonly themeToggleAria: string;
  };

  /** Home page hero + section headings. */
  readonly home: {
    readonly h1: string;
    readonly heroSubtitle: string;
    readonly scrollToExplore: string;
    readonly distributionTitle: string;
    readonly distributionSubtitle: string;
    readonly populationVsWealth: string;
    readonly scaleOfConcentrationH2: string;
    readonly scaleOfConcentrationLead: string;
    readonly statisticsH2: string;
    readonly whoActuallyPaysH2: string;
    readonly whoActuallyPaysLead: string;
    readonly centuryOfChangeH2: string;
    readonly centuryOfChangeLead: string;
    readonly wagesKeepingUpH2: string;
    readonly wagesKeepingUpLead: string;
    readonly seeBillionaireCta: string;
    readonly compareAcrossCountriesCta: string;
    readonly attribution: string;
  };

  /** Calculator input form. */
  readonly input: {
    readonly modeWealth: string;
    readonly modeIncome: string;
    /** "Enter your gross (pre-tax) annual income in {currency}" */
    readonly incomeLabelTemplate: string;
    /** "Enter your net wealth in {currency}" */
    readonly wealthLabelTemplate: string;
    readonly incomeHint: string;
    readonly wealthHint: string;
    readonly ageOptional: string;
    readonly agePlaceholder: string;
    readonly knowYourAssets: string;
    /** "Est. net wealth:" */
    readonly estimatedNetWealth: string;
    /** "In {country}, you are wealthier than" */
    readonly resultWealthTemplate: string;
    /** "In {country}, based on estimated wealth from your income, you rank higher than" */
    readonly resultIncomeTemplate: string;
    readonly ofThePopulation: string;
    readonly inTheTop1: string;
    readonly belowTheMedian: string;
    readonly privacyNote: string;
    readonly incomeConvertedNote: string;
  };

  /** Sharing UI under the calculator result. */
  readonly share: {
    readonly label: string;
    readonly nativeShareButton: string;
    readonly nativeShareAria: string;
    readonly twitter: string;
    readonly whatsapp: string;
    readonly copyLink: string;
    readonly copied: string;
    readonly copyFailed: string;
    /** "I'm wealthier than {percentile} of the population in {country}. Where do you stand?" */
    readonly shareTextTemplate: string;
  };

  /** Statistics section card labels. */
  readonly stats: {
    readonly title: string;
    /** "The top 1% in {country} owns" — fed via interpolation */
    readonly top1OwnsTemplate: string;
    readonly top1OwnsSublabel: string;
    readonly bottom50Owns: string;
    readonly bottom50OwnsSublabel: string;
    readonly giniLabel: string;
    readonly giniSublabel: string;
    readonly meanWealthLabel: string;
    readonly meanWealthSublabel: string;
    readonly medianWealthLabel: string;
    readonly medianWealthSublabel: string;
    readonly meanMedianRatioLabel: string;
    readonly meanMedianRatioSublabel: string;
    readonly togglePppOff: string;
    readonly togglePppOn: string;
    /** "PPP: ~${value}K purchasing power" */
    readonly pppSublabelTemplate: string;
    /** "{country} in Regional Context" */
    readonly regionalContextTitleTemplate: string;
    readonly regionalAggregatesNote: string;
    readonly thisCountryRegion: string;

    // Entry thresholds section
    readonly thresholdsTitle: string;
    /** "Estimated minimum net wealth to enter each wealth bracket in {country}." */
    readonly thresholdsLeadTemplate: string;
    readonly thresholdsNote: string;
    readonly thresholdTop50: string;
    readonly thresholdTop10: string;
    readonly thresholdTop1: string;
    readonly thresholdTop01: string;

    // Big impact statement
    /** "A median income earner in {country} would need to work for" */
    readonly impactLeadTemplate: string;
    readonly impactYears: string;
    readonly impactTrailing: string;
    /** "Based on median pre-tax national income of {income}/year vs. average top 1% wealth of {wealth}" */
    readonly impactNoteTemplate: string;

    // Income vs wealth section
    readonly doubleGapTitle: string;
    readonly incomeDistributionTitle: string;
    readonly wealthDistributionTitle: string;
    /** "Gini (income): {value}" */
    readonly giniIncomeLineTemplate: string;
    /** "Gini (wealth): {value}" */
    readonly giniWealthLineTemplate: string;
    readonly barLabelTop1: string;
    readonly barLabelTop10: string;
    readonly barLabelMiddle40: string;
    readonly barLabelBottom50: string;

    // Global context
    readonly globalPictureTitle: string;
    readonly globalTop1Owns: string;
    readonly globalTop1OwnsSublabel: string;
    readonly globalBottom50Owns: string;
    readonly globalBottom50OwnsSublabel: string;
    readonly globalGiniLabel: string;
    readonly globalGiniSublabel: string;
    /** "Source: {source}" */
    readonly sourceTemplate: string;

    // Regional cards
    readonly medianWealthUsdLabel: string;
    /** "Top 1%: {value}%" */
    readonly regionTop1Template: string;
    /** "Bot 50%: {value}%" */
    readonly regionBottom50Template: string;
  };

  /** Footer. */
  readonly footer: {
    readonly about: string;
    readonly faq: string;
    readonly methodology: string;
    readonly github: string;
    /** "Data built {date}" */
    readonly buildDateTemplate: string;
  };

  /** Chart axis, legend, tooltip, and tab labels shared across visualizations. */
  readonly charts: {
    // Detailed percentile group labels used by WealthHoardingChart,
    // WealthDistributionChart, and TaxRateChart. The first four reuse
    // stats.barLabel* spellings. The next four are finer-grained.
    readonly bottom50: string;
    readonly middle40: string;
    readonly top10: string;
    readonly top1: string;
    readonly top10to1: string;
    readonly top1to01: string;
    readonly top01to001: string;
    readonly top001: string;

    // Distribution chart tabs / axis
    readonly distributionViewAllGroups: string;
    readonly distributionViewTop10: string;
    readonly distributionViewTop1: string;
    readonly wealthShare: string;
    readonly populationShare: string;
    /** "{amount} to reach Top X" — interpolated as needed */
    readonly entryThresholdTemplate: string;
    /** "≈ {amount}" — currency callout next to a threshold marker */
    readonly approxTemplate: string;
    readonly youAreHere: string;
    readonly youAreHereInGroup: string;

    // Hoarding chart people-count formatter
    /** "~{count}M people" */
    readonly peopleMillionsTemplate: string;
    /** "~{count}K people" */
    readonly peopleThousandsTemplate: string;
    /** "~{count} people" */
    readonly peopleTemplate: string;

    // PurchasingPowerChart legend
    readonly wagesLabel: string;
    readonly costOfLivingLabel: string;
    readonly housePricesLabel: string;
    readonly indexedTo2000: string;

    // HistoricalEvolutionChart
    readonly historicalYAxis: string;
    readonly historicalCenturyTitle: string;

    // TaxRateChart
    readonly effectiveTaxRate: string;
    readonly taxRateYAxis: string;

    // Generic chart hints
    readonly hoverForDetails: string;
    readonly tapForDetails: string;
    readonly zoomToSeeTop: string;
  };

  /** Compare ("How long?") page UI strings used by CompareClient. */
  readonly compare: {
    readonly h1: string;
    readonly subtitle: string;
    readonly enterIncomeLabel: string;
    readonly enterIncomePlaceholder: string;
    readonly richestLabel: string;
    /** "Net worth: {amount}" */
    readonly netWorthTemplate: string;
    readonly yourSalary: string;
    readonly yearsLabel: string;
    readonly atYourPaceLabel: string;
    readonly historicalContext: string;
    readonly comparisonsTitle: string;
    /** "{name} earned this in a single lifetime." */
    readonly billionaireLifetimeTemplate: string;
    readonly tryDifferentSalary: string;

    // Empty-state when no billionaire data
    /** "Billionaire comparison data is not yet available for {country}." */
    readonly noDataTemplate: string;
    readonly noDataHint: string;

    // Salary input label/placeholder/hint
    /** "Enter your gross (pre-tax) annual income ({currency}) — or we'll use the median" */
    readonly salaryLabelTemplate: string;
    /** "Using median pre-tax national income: {amount}/year" */
    readonly usingMedianTemplate: string;
    readonly privacyNote: string;
    readonly currencyLabel: string;

    // Big-number block
    /** "At {amount}/year, you would need" */
    readonly atIncomeTemplate: string;
    readonly yearsOfWork: string;
    /** "to match {name}'s wealth" */
    readonly toMatchTemplate: string;
    readonly perspectiveTitle: string;

    // Richest card
    /** "Richest person in {country}" */
    readonly richestPersonInTemplate: string;

    // Comparison cards
    /** "{name} earns per second" */
    readonly earnsPerSecondTemplate: string;
    /** "If their wealth grew at {rate}%/year" */
    readonly growthAssumptionTemplate: string;
    readonly cardYourDailyEarnings: string;
    /** "vs. {name}'s {amount}/day" */
    readonly cardDailyVsBillionaireTemplate: string;
    readonly cardWealthRatio: string;
    /** "{name} has {x}× more wealth than you" */
    readonly cardWealthRatioSublabelTemplate: string;
    readonly cardHomesTheirWealthCouldBuy: string;
    /** "At average local home price" */
    readonly cardHomesSublabel: string;
    readonly cardYearsOfHealthcare: string;
    /** "At local healthcare costs" */
    readonly cardHealthcareSublabel: string;
  };

  /** Compare-Countries page UI strings used by CrossCountryCompare. */
  readonly compareCountries: {
    readonly h1: string;
    readonly subtitle: string;
    readonly amountLabel: string;
    readonly amountPlaceholder: string;
    readonly modeWealth: string;
    readonly modeIncome: string;
    readonly selectCountriesLabel: string;
    readonly resultsTitle: string;
    readonly noResults: string;
    /** "Buying power: {amount}" — local-currency PPP equivalent */
    readonly buyingPowerTemplate: string;
    /** "Need {amount} to reach {label}" */
    readonly needTemplate: string;
    readonly youRankHigherIn: string;
    readonly youRankLowerIn: string;
  };

  /** Income refinement panel — every form label and select option. */
  readonly refine: {
    readonly title: string;
    readonly subtitle: string;
    readonly precisionRough: string;
    readonly precisionModerate: string;
    readonly precisionPrecise: string;
    readonly closeLabel: string;
    readonly resetLabel: string;

    // Field group labels
    readonly fieldAge: string;
    readonly fieldEducation: string;
    readonly fieldEmployment: string;
    readonly fieldRelationship: string;
    readonly fieldHomeOwnership: string;
    readonly fieldHasMortgage: string;
    readonly fieldSavingsRate: string;
    readonly fieldHasInvestments: string;
    readonly fieldHasPension: string;
    readonly fieldChildren: string;
    readonly fieldHouseholdSize: string;
    readonly fieldHasInheritance: string;
    readonly fieldHasDebt: string;
    readonly fieldCountryEconomicStatus: string;

    // Common option words
    readonly optionYes: string;
    readonly optionNo: string;
    readonly optionUnknown: string;
    readonly optionHousehold: string;
    readonly optionPersonal: string;

    // Education options
    readonly eduNone: string;
    readonly eduHighSchool: string;
    readonly eduBachelor: string;
    readonly eduMaster: string;
    readonly eduDoctorate: string;

    // Employment options
    readonly empUnemployed: string;
    readonly empPublic: string;
    readonly empPrivate: string;
    readonly empBusinessOwner: string;
    readonly empRetired: string;
    readonly empStudent: string;

    // Relationship options
    readonly relSingle: string;
    readonly relPartnered: string;
    readonly relMarried: string;
    readonly relDivorced: string;
    readonly relWidowed: string;

    // Savings rate options
    readonly savingsVeryLow: string;
    readonly savingsLow: string;
    readonly savingsModerate: string;
    readonly savingsHigh: string;
    readonly savingsVeryHigh: string;

    // Section legends
    readonly legendDemographics: string;
    readonly legendFinancialProfile: string;
    readonly legendProperty: string;
    readonly legendDebts: string;

    // Header / counters
    readonly panelToggle: string;
    /** "{count} factor" / "{count} factors" — pluralize via {count} only */
    readonly factorsCountTemplate: string;
    readonly factorImpactTitle: string;

    // Confidence labels
    readonly precisionVeryRough: string;
    readonly precisionGood: string;
    readonly precisionVeryPrecise: string;

    // Demographic mini-inputs
    readonly fieldYearsWorked: string;
    readonly placeholderAge: string;
    readonly placeholderHousehold: string;
    readonly placeholderYearsWorked: string;
    readonly fieldMaritalStatus: string;
    readonly fieldSavingsHabit: string;

    // Education extra options (no_degree, doctorate already covered)
    readonly eduNoDegree: string;
    readonly eduPhd: string;

    // Employment extra options that map to factor enum
    readonly empPartTime: string;
    readonly empFullTime: string;
    readonly empSelfEmployed: string;

    // Property/asset toggles
    readonly toggleInvestments: string;
    readonly toggleRetirementFund: string;
    readonly toggleInheritance: string;
    readonly toggleOwnsProperty: string;
    readonly toggleMortgage: string;
    readonly toggleSignificantDebts: string;

    // Asset value labels — interpolate {currency}
    readonly investmentValueTemplate: string;
    readonly pensionPotTemplate: string;
    readonly propertyValueTemplate: string;
    readonly mortgageRemainingTemplate: string;
    readonly debtLevelLabel: string;
    readonly placeholderInvestment: string;
    readonly placeholderPension: string;
    readonly placeholderProperty: string;
    readonly placeholderMortgage: string;

    // Debt level options
    readonly debtLessThan1Yr: string;
    readonly debt1to3Yr: string;
    readonly debt3to5Yr: string;
    readonly debtMoreThan5Yr: string;

    // Methodology note — interpolate {spreadPct}
    readonly methodologyNoteTemplate: string;
  };

  /** DataProvenanceBanner strings. */
  readonly provenance: {
    readonly notice: string;
    readonly seeSources: string;
    readonly hideSources: string;
    readonly intro: string;
    readonly thData: string;
    readonly thSource: string;
    readonly thType: string;
    readonly typeApi: string;
    readonly typeManual: string;
    readonly outroPrefix: string;
    readonly outroSuffix: string;
    readonly methodologyLink: string;
    readonly rowWealthShares: string;
    readonly rowMeanMedian: string;
    readonly rowIncomeShares: string;
    readonly rowGini: string;
    readonly rowPopulation: string;
    readonly rowExchangeRates: string;
    readonly rowBillionaire: string;
    readonly rowTaxRates: string;
    readonly rowAcademicPapers: string;
  };

  /** SourcesSection strings. */
  readonly sources: {
    readonly title: string;
    readonly intro: string;
    readonly disclaimer: string;
    readonly closingLine: string;
    /** "Accessed: {date}" */
    readonly accessedTemplate: string;
  };
}

/**
 * Interpolate `{name}` placeholders in a template using `vars`.
 * Missing vars leave the placeholder unchanged so a key omission is visible.
 */
export function interpolate(
  template: string,
  vars: Readonly<Record<string, string | number>>,
): string {
  return template.replace(/\{(\w+)\}/g, (_match, key: string) => {
    const value = vars[key];
    return value === undefined ? `{${key}}` : String(value);
  });
}
