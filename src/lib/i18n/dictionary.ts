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
