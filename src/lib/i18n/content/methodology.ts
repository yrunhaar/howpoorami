/**
 * Methodology page content keyed by locale.
 *
 * The structure mirrors the page layout: an intro plus seven sections (one
 * of which renders the shared `<TaxSourcesTable />`). Bullet lists with a
 * `bold + description` pattern are common; `BulletedItem` covers that shape.
 */

import type { LocaleCode } from "../locales";

export interface BulletedItem {
  readonly bold: string;
  readonly description: string;
}

export interface MethodologyContent {
  readonly h1: string;
  readonly intro: string;

  readonly wealthData: {
    readonly heading: string;
    /** Body uses {widLink} placeholder for the WID.world hyperlink. */
    readonly bodyTemplate: string;
    readonly widLinkLabel: string;
    readonly groups: readonly BulletedItem[];
    readonly outro: string;
  };

  readonly incomeEstimation: {
    readonly heading: string;
    /** Body uses {modelEmphasis} for "18-factor estimation model" emphasis. */
    readonly bodyTemplate: string;
    readonly modelEmphasis: string;
    readonly factors: readonly string[];
    /** Outro uses {spreadHigh}, {spreadLow} for the ±X% emphasis. */
    readonly outroTemplate: string;
    readonly spreadHigh: string;
    readonly spreadLow: string;
  };

  readonly percentileCalc: {
    readonly heading: string;
    /** Body uses {interpEmphasis} for "piecewise linear interpolation". */
    readonly bodyTemplate: string;
    readonly interpEmphasis: string;
  };

  readonly billionaireComparison: {
    readonly heading: string;
    /** Body uses {forbesLink} placeholder. */
    readonly bodyOneTemplate: string;
    readonly forbesLinkLabel: string;
    readonly bodyTwo: string;
  };

  readonly taxData: {
    readonly heading: string;
    readonly body: string;
  };

  readonly limitations: {
    readonly heading: string;
    readonly items: readonly BulletedItem[];
  };

  readonly dataFreshness: {
    readonly heading: string;
    /** Body uses {fetchScript} for inline-code emphasis. */
    readonly bodyTemplate: string;
    readonly fetchScriptLabel: string;
    readonly sources: readonly BulletedItem[];
    readonly outro: string;
  };

  readonly relatedNav: {
    readonly backToCalculator: string;
    readonly about: string;
  };
}

const en: MethodologyContent = {
  h1: "Methodology",
  intro:
    "This page explains the data sources, models, and assumptions behind How Poor Am I?. The goal is full transparency — every number you see in the tool can be traced back to its source and calculation.",
  wealthData: {
    heading: "Wealth Distribution Data",
    bodyTemplate:
      "Wealth share data comes from the {widLink}, which publishes Distributional National Accounts (DINA) for dozens of countries. These accounts split national wealth into groups:",
    widLinkLabel: "World Inequality Database",
    groups: [
      { bold: "Bottom 50%", description: "The lower half of the population by net wealth" },
      { bold: "Middle 40%", description: "The 50th to 90th percentile, often called the \"middle class\"" },
      { bold: "Top 10%", description: "The wealthiest tenth, which in most countries holds 60-80% of total wealth" },
      { bold: "Top 1%", description: "A subset of the top 10%, typically holding 25-40% of total wealth" },
    ],
    outro:
      "These shares define the boundaries used to place you in the distribution. The more granular the boundary data for a country, the more precise the final percentile.",
  },
  incomeEstimation: {
    heading: "Income-to-Wealth Estimation",
    bodyTemplate:
      "Most people know their income but not their net wealth. To bridge this gap, the tool uses an {modelEmphasis} that adjusts the income-to-wealth ratio based on demographic and financial characteristics:",
    modelEmphasis: "18-factor estimation model",
    factors: [
      "Age brackets (younger people typically have lower wealth-to-income ratios)",
      "Education level (higher education correlates with higher lifetime earnings and savings)",
      "Employment type (self-employed vs. salaried, public vs. private)",
      "Savings rate and investment behavior",
      "Property ownership and mortgage status",
      "Outstanding debts (student loans, consumer debt)",
    ],
    outroTemplate:
      "Each factor narrows the uncertainty range. With no factors provided, the model carries a spread of roughly {spreadHigh}. With all 18 factors answered, uncertainty drops to approximately {spreadLow}. The tool always shows you the confidence band alongside your estimated percentile.",
    spreadHigh: "±70%",
    spreadLow: "±10%",
  },
  percentileCalc: {
    heading: "Percentile Calculation",
    bodyTemplate:
      "Once your estimated net wealth is computed, the tool places you in the distribution using {interpEmphasis} between the known wealth share boundaries. For example, if the bottom 50% holds 5% of total wealth and the middle 40% holds 35%, your position between those boundaries is interpolated linearly based on your estimated share. This is an approximation — real distributions are not perfectly linear between boundary points — but it provides a reasonable estimate given the available data.",
    interpEmphasis: "piecewise linear interpolation",
  },
  billionaireComparison: {
    heading: "Billionaire Comparison",
    bodyOneTemplate:
      "The \"How Long Would It Take?\" mode uses the {forbesLink} list. Net worth figures are bundled into the site at build time for the wealthiest individual in each country.",
    forbesLinkLabel: "Forbes Real-Time Billionaires",
    bodyTwo:
      "The \"years to earn\" calculation is deliberately simple: it divides the billionaire's net worth by your annual income with no adjustments for interest, compound growth, taxes, or inflation. This is intentional — the point is not financial planning but to viscerally illustrate the scale of the gap. When the answer is \"4 million years,\" whether it accounts for a 7% return rate is beside the point.",
  },
  taxData: {
    heading: "Tax Rate Data Sources",
    body: "Effective tax rates by wealth class are compiled from academic research and government statistics. Unlike wealth distribution data, these are not available through a single API and are maintained manually from the published sources below.",
  },
  limitations: {
    heading: "Limitations",
    items: [
      {
        bold: "Top-wealth underestimation",
        description:
          "Survey-based wealth data systematically underestimates the holdings of the ultra-rich, who are underrepresented in household surveys. WID partially corrects for this using tax data, but gaps remain.",
      },
      {
        bold: "Self-reported income bias",
        description:
          "Users enter their own income, which may not reflect total compensation (bonuses, equity, unrealized gains).",
      },
      {
        bold: "Country-specific caveats",
        description:
          "Data quality varies by country. Some nations have detailed tax-based wealth data; others rely on survey estimates with wider margins.",
      },
      {
        bold: "Model approximation",
        description:
          "The 18-factor income-to-wealth model is a statistical approximation, not personalized financial advice. Individual circumstances can diverge significantly from population averages.",
      },
    ],
  },
  dataFreshness: {
    heading: "Data Freshness",
    bodyTemplate:
      "All data is bundled at build time and served statically — no external API calls are made when you use the tool. A single fetch script ({fetchScript}) pulls data from:",
    fetchScriptLabel: "scripts/fetch-all-data.mjs",
    sources: [
      { bold: "WID.world API", description: "wealth shares, income shares, mean/median wealth, Gini coefficients" },
      { bold: "World Bank API", description: "population (SP.POP.TOTL)" },
      { bold: "ECB / Frankfurter API", description: "exchange rates for currency conversion" },
      { bold: "Forbes RTB API", description: "billionaire net worth data" },
      { bold: "OECD / FRED", description: "wages, CPI, house price indices" },
    ],
    outro:
      "Tax rate data is the exception — it comes from academic papers and is maintained manually with full source citations (see table above).",
  },
  relatedNav: {
    backToCalculator: "Back to calculator",
    about: "About",
  },
};

const es: MethodologyContent = {
  h1: "Metodología",
  intro:
    "Esta página explica las fuentes de datos, los modelos y los supuestos detrás de ¿Qué tan pobre soy?. El objetivo es la transparencia total — cada número que ves se puede rastrear hasta su fuente y su cálculo.",
  wealthData: {
    heading: "Datos de distribución de la riqueza",
    bodyTemplate:
      "Los datos de cuotas de riqueza provienen de {widLink}, que publica Cuentas Nacionales Distribucionales (DINA) para decenas de países. Estas cuentas dividen la riqueza nacional en grupos:",
    widLinkLabel: "World Inequality Database",
    groups: [
      { bold: "50% inferior", description: "La mitad inferior de la población por patrimonio neto" },
      { bold: "40% medio", description: "Del percentil 50 al 90, a menudo llamada la «clase media»" },
      { bold: "10% superior", description: "El décimo más rico, que en la mayoría de países posee el 60-80% de la riqueza total" },
      { bold: "1% superior", description: "Un subconjunto del 10% superior que suele poseer el 25-40% de la riqueza total" },
    ],
    outro:
      "Estas cuotas definen los límites usados para situarte en la distribución. Cuanto más granulares sean los datos de un país, más preciso es el percentil final.",
  },
  incomeEstimation: {
    heading: "Estimación de ingresos a riqueza",
    bodyTemplate:
      "La mayoría conoce sus ingresos pero no su patrimonio neto. Para cubrir esta brecha, la herramienta utiliza un {modelEmphasis} que ajusta la ratio ingresos/riqueza según características demográficas y financieras:",
    modelEmphasis: "modelo de estimación de 18 factores",
    factors: [
      "Tramos de edad (las personas más jóvenes suelen tener ratios riqueza/ingreso más bajos)",
      "Nivel educativo (la educación superior se correlaciona con mayores ingresos y ahorros a lo largo de la vida)",
      "Tipo de empleo (autónomo vs. asalariado, público vs. privado)",
      "Tasa de ahorro y comportamiento de inversión",
      "Propiedad de vivienda y estado de la hipoteca",
      "Deudas pendientes (préstamos estudiantiles, consumo)",
    ],
    outroTemplate:
      "Cada factor reduce el margen de incertidumbre. Sin factores, el modelo arrastra una dispersión de aproximadamente {spreadHigh}. Con los 18 factores respondidos, la incertidumbre baja a unos {spreadLow}. La herramienta siempre muestra el intervalo de confianza junto al percentil estimado.",
    spreadHigh: "±70%",
    spreadLow: "±10%",
  },
  percentileCalc: {
    heading: "Cálculo del percentil",
    bodyTemplate:
      "Una vez calculado tu patrimonio estimado, la herramienta te sitúa en la distribución mediante {interpEmphasis} entre los límites de cuotas conocidas. Por ejemplo, si el 50% inferior posee el 5% de la riqueza total y el 40% medio el 35%, tu posición entre esos límites se interpola linealmente. Es una aproximación — las distribuciones reales no son perfectamente lineales entre puntos — pero ofrece una estimación razonable con los datos disponibles.",
    interpEmphasis: "interpolación lineal por tramos",
  },
  billionaireComparison: {
    heading: "Comparación con millonarios",
    bodyOneTemplate:
      "El modo «¿Cuánto tiempo tardaría?» usa la lista {forbesLink}. Las cifras de patrimonio se incorporan al sitio en tiempo de compilación para la persona más rica de cada país.",
    forbesLinkLabel: "Forbes Real-Time Billionaires",
    bodyTwo:
      "El cálculo de «años para ganar» es deliberadamente simple: divide el patrimonio del millonario entre tu ingreso anual sin ajustes por intereses, crecimiento compuesto, impuestos o inflación. Es intencional — el objetivo no es planificación financiera, sino ilustrar de manera visceral la magnitud de la brecha. Cuando la respuesta es «4 millones de años», un 7% de rentabilidad anual no cambia el mensaje.",
  },
  taxData: {
    heading: "Fuentes de datos sobre tipos impositivos",
    body: "Los tipos impositivos efectivos por clase de riqueza se compilan a partir de investigación académica y estadísticas gubernamentales. A diferencia de los datos de distribución de riqueza, no están disponibles a través de una única API y se mantienen manualmente con las fuentes citadas a continuación.",
  },
  limitations: {
    heading: "Limitaciones",
    items: [
      {
        bold: "Subestimación de la riqueza alta",
        description:
          "Los datos de riqueza basados en encuestas subestiman sistemáticamente las posesiones de los ultrarricos, infrarrepresentados en encuestas de hogares. WID corrige parcialmente con datos fiscales, pero quedan vacíos.",
      },
      {
        bold: "Sesgo del ingreso autodeclarado",
        description:
          "Las personas usuarias declaran sus propios ingresos, que pueden no reflejar la compensación total (bonus, acciones, plusvalías no realizadas).",
      },
      {
        bold: "Salvedades por país",
        description:
          "La calidad de los datos varía por país. Algunos tienen datos fiscales detallados; otros dependen de estimaciones de encuesta con márgenes más amplios.",
      },
      {
        bold: "Aproximación del modelo",
        description:
          "El modelo de 18 factores es una aproximación estadística, no asesoramiento financiero personalizado. Las circunstancias individuales pueden divergir mucho de los promedios poblacionales.",
      },
    ],
  },
  dataFreshness: {
    heading: "Frescura de los datos",
    bodyTemplate:
      "Todos los datos se incorporan en tiempo de compilación y se sirven estáticamente — no se hacen llamadas externas al usar la herramienta. Un único script de obtención ({fetchScript}) extrae datos de:",
    fetchScriptLabel: "scripts/fetch-all-data.mjs",
    sources: [
      { bold: "API de WID.world", description: "cuotas de riqueza, cuotas de ingreso, riqueza media/mediana, coeficientes de Gini" },
      { bold: "API del Banco Mundial", description: "población (SP.POP.TOTL)" },
      { bold: "BCE / Frankfurter API", description: "tipos de cambio para conversión de moneda" },
      { bold: "API Forbes RTB", description: "patrimonio de millonarios" },
      { bold: "OCDE / FRED", description: "salarios, IPC, índices de precios de la vivienda" },
    ],
    outro:
      "Los datos de tipos impositivos son la excepción — provienen de artículos académicos y se mantienen manualmente con citas completas (ver tabla arriba).",
  },
  relatedNav: {
    backToCalculator: "Volver a la calculadora",
    about: "Acerca de",
  },
};

const de: MethodologyContent = {
  h1: "Methodik",
  intro:
    "Diese Seite erklärt die Datenquellen, Modelle und Annahmen hinter Wie arm bin ich?. Das Ziel: vollständige Transparenz — jede Zahl im Tool lässt sich bis zur Quelle und Berechnung zurückverfolgen.",
  wealthData: {
    heading: "Daten zur Vermögensverteilung",
    bodyTemplate:
      "Daten zu Vermögensanteilen stammen aus {widLink}, das Distributional National Accounts (DINA) für Dutzende Länder veröffentlicht. Diese Konten teilen das Nationalvermögen in Gruppen:",
    widLinkLabel: "World Inequality Database",
    groups: [
      { bold: "Untere 50 %", description: "Die untere Hälfte der Bevölkerung nach Nettovermögen" },
      { bold: "Mittlere 40 %", description: "Vom 50. bis 90. Perzentil, oft „Mittelschicht“ genannt" },
      { bold: "Obere 10 %", description: "Das reichste Zehntel, das in den meisten Ländern 60–80 % des Vermögens hält" },
      { bold: "Obere 1 %", description: "Eine Untergruppe der oberen 10 %, die typischerweise 25–40 % des Vermögens hält" },
    ],
    outro:
      "Diese Anteile definieren die Stützstellen, anhand derer du in der Verteilung verortet wirst. Je granularer die Stützstellen für ein Land, desto präziser das Endperzentil.",
  },
  incomeEstimation: {
    heading: "Einkommen-zu-Vermögen-Schätzung",
    bodyTemplate:
      "Die meisten kennen ihr Einkommen, aber nicht ihr Nettovermögen. Um diese Lücke zu schließen, nutzt das Tool ein {modelEmphasis}, das das Verhältnis Einkommen/Vermögen anhand demografischer und finanzieller Merkmale anpasst:",
    modelEmphasis: "18-Faktor-Schätzmodell",
    factors: [
      "Altersgruppen (jüngere Menschen haben meist niedrigere Vermögens-zu-Einkommens-Verhältnisse)",
      "Bildungsniveau (höhere Bildung korreliert mit höherem Lebenseinkommen und Sparen)",
      "Beschäftigungstyp (selbständig vs. angestellt, öffentlich vs. privat)",
      "Sparquote und Investitionsverhalten",
      "Wohneigentum und Hypothekenstatus",
      "Offene Schulden (Studienkredite, Konsumschulden)",
    ],
    outroTemplate:
      "Jeder Faktor verringert die Unsicherheit. Ohne Faktoren liegt die Streuung bei rund {spreadHigh}. Mit allen 18 Faktoren sinkt sie auf etwa {spreadLow}. Das Tool zeigt das Konfidenzband neben dem geschätzten Perzentil.",
    spreadHigh: "±70 %",
    spreadLow: "±10 %",
  },
  percentileCalc: {
    heading: "Perzentilberechnung",
    bodyTemplate:
      "Sobald dein geschätztes Nettovermögen feststeht, verortet das Tool dich in der Verteilung mittels {interpEmphasis} zwischen den bekannten Stützstellen. Beispiel: Halten die unteren 50 % 5 % und die mittleren 40 % 35 % des Gesamtvermögens, wird deine Position dazwischen linear interpoliert. Das ist eine Annäherung — reale Verteilungen sind nicht exakt linear — liefert aber mit den verfügbaren Daten eine vernünftige Schätzung.",
    interpEmphasis: "stückweise lineare Interpolation",
  },
  billionaireComparison: {
    heading: "Milliardärsvergleich",
    bodyOneTemplate:
      "Der Modus „Wie lange würde es dauern?“ verwendet die Liste {forbesLink}. Vermögensangaben werden zur Build-Zeit für die reichste Person jedes Landes gebündelt.",
    forbesLinkLabel: "Forbes Real-Time Billionaires",
    bodyTwo:
      "Die Berechnung „Jahre zum Verdienen“ ist bewusst einfach: das Vermögen des Milliardärs ÷ dein Jahreseinkommen, ohne Zinsen, Zinseszins, Steuern oder Inflation. Das ist Absicht — es geht nicht um Finanzplanung, sondern um eine fühlbare Darstellung der Lücke. Wenn die Antwort „4 Millionen Jahre“ lautet, ändert eine 7 %-Rendite nichts an der Aussage.",
  },
  taxData: {
    heading: "Quellen für Steuerdaten",
    body: "Effektive Steuersätze nach Vermögensklassen stammen aus akademischer Forschung und amtlichen Statistiken. Anders als bei Vermögensverteilungsdaten gibt es keine einheitliche API; sie werden manuell aus den unten zitierten Quellen gepflegt.",
  },
  limitations: {
    heading: "Grenzen",
    items: [
      {
        bold: "Unterschätzung an der Spitze",
        description:
          "Befragungsbasierte Vermögensdaten unterschätzen die Bestände Superreicher systematisch, da sie in Haushaltsbefragungen unterrepräsentiert sind. WID korrigiert teilweise mit Steuerdaten, Lücken bleiben.",
      },
      {
        bold: "Selbstauskunfts-Bias",
        description:
          "Nutzer:innen geben ihr Einkommen selbst ein, das nicht zwingend die Gesamtvergütung abbildet (Boni, Equity, nicht realisierte Gewinne).",
      },
      {
        bold: "Länderspezifische Vorbehalte",
        description:
          "Datenqualität variiert je Land. Einige haben detaillierte steuerbasierte Vermögensdaten, andere stützen sich auf Befragungsschätzungen mit größerer Unsicherheit.",
      },
      {
        bold: "Modellannäherung",
        description:
          "Das 18-Faktor-Modell ist eine statistische Annäherung, keine personalisierte Finanzberatung. Individuelle Lebensumstände können stark vom Bevölkerungsdurchschnitt abweichen.",
      },
    ],
  },
  dataFreshness: {
    heading: "Aktualität der Daten",
    bodyTemplate:
      "Alle Daten werden zur Build-Zeit gebündelt und statisch ausgeliefert — bei Nutzung des Tools werden keine externen Aufrufe gemacht. Ein einziges Fetch-Skript ({fetchScript}) zieht Daten aus:",
    fetchScriptLabel: "scripts/fetch-all-data.mjs",
    sources: [
      { bold: "WID.world-API", description: "Vermögens- und Einkommensanteile, Mittel-/Median-Vermögen, Gini-Koeffizienten" },
      { bold: "Weltbank-API", description: "Bevölkerung (SP.POP.TOTL)" },
      { bold: "EZB / Frankfurter-API", description: "Wechselkurse zur Währungsumrechnung" },
      { bold: "Forbes-RTB-API", description: "Vermögen der Milliardäre" },
      { bold: "OECD / FRED", description: "Löhne, VPI, Hauspreisindizes" },
    ],
    outro:
      "Steuerdaten sind die Ausnahme — sie stammen aus Fachpublikationen und werden manuell mit vollständigen Quellenangaben gepflegt (siehe Tabelle oben).",
  },
  relatedNav: {
    backToCalculator: "Zurück zum Rechner",
    about: "Über",
  },
};

const fr: MethodologyContent = {
  h1: "Méthodologie",
  intro:
    "Cette page explique les sources de données, les modèles et les hypothèses derrière À quel point suis-je pauvre ?. Objectif : une transparence totale — chaque chiffre que vous voyez peut être retracé jusqu'à sa source et son calcul.",
  wealthData: {
    heading: "Données de distribution de la richesse",
    bodyTemplate:
      "Les parts de richesse proviennent de {widLink}, qui publie des Comptes Nationaux Distributionnels (DINA) pour des dizaines de pays. Ces comptes répartissent la richesse nationale par groupes :",
    widLinkLabel: "World Inequality Database",
    groups: [
      { bold: "50 % du bas", description: "La moitié inférieure de la population par patrimoine net" },
      { bold: "40 % du milieu", description: "Du 50e au 90e centile, souvent appelé la « classe moyenne »" },
      { bold: "10 % du haut", description: "Le dixième le plus riche, qui dans la plupart des pays détient 60-80 % de la richesse" },
      { bold: "1 % du haut", description: "Sous-ensemble du top 10 %, détenant typiquement 25-40 % de la richesse" },
    ],
    outro:
      "Ces parts définissent les frontières utilisées pour vous situer dans la distribution. Plus les données frontières d'un pays sont granulaires, plus le centile final est précis.",
  },
  incomeEstimation: {
    heading: "Estimation revenu-richesse",
    bodyTemplate:
      "La plupart des gens connaissent leur revenu mais pas leur patrimoine net. Pour combler cet écart, l'outil utilise un {modelEmphasis} qui ajuste le ratio revenu/patrimoine selon des caractéristiques démographiques et financières :",
    modelEmphasis: "modèle d'estimation à 18 facteurs",
    factors: [
      "Tranches d'âge (les jeunes ont en général un ratio richesse/revenu plus faible)",
      "Niveau d'études (les études supérieures corrélent avec des revenus et une épargne plus élevés)",
      "Type d'emploi (indépendant vs salarié, public vs privé)",
      "Taux d'épargne et comportement d'investissement",
      "Propriété immobilière et statut hypothécaire",
      "Dettes en cours (prêts étudiants, crédit à la consommation)",
    ],
    outroTemplate:
      "Chaque facteur réduit la marge d'incertitude. Sans aucun facteur, le modèle a une dispersion d'environ {spreadHigh}. Avec les 18 facteurs renseignés, l'incertitude tombe à environ {spreadLow}. L'outil affiche toujours l'intervalle de confiance à côté du centile estimé.",
    spreadHigh: "±70 %",
    spreadLow: "±10 %",
  },
  percentileCalc: {
    heading: "Calcul du centile",
    bodyTemplate:
      "Une fois votre patrimoine net estimé calculé, l'outil vous place dans la distribution par {interpEmphasis} entre les frontières de parts connues. Par exemple, si les 50 % du bas détiennent 5 % de la richesse et les 40 % du milieu 35 %, votre position entre ces points est interpolée linéairement. C'est une approximation — les distributions réelles ne sont pas parfaitement linéaires entre les points — mais elle donne une estimation raisonnable avec les données disponibles.",
    interpEmphasis: "interpolation linéaire par morceaux",
  },
  billionaireComparison: {
    heading: "Comparaison avec un milliardaire",
    bodyOneTemplate:
      "Le mode « Combien de temps faudrait-il ? » utilise la liste {forbesLink}. Les chiffres de patrimoine sont intégrés au site lors de la compilation pour la personne la plus riche de chaque pays.",
    forbesLinkLabel: "Forbes Real-Time Billionaires",
    bodyTwo:
      "Le calcul « années pour gagner » est délibérément simple : le patrimoine du milliardaire ÷ votre revenu annuel, sans ajustement pour intérêt, intérêt composé, impôts ou inflation. C'est intentionnel — l'objectif n'est pas la planification financière mais d'illustrer l'ampleur de l'écart. Quand la réponse est « 4 millions d'années », un rendement de 7 % ne change pas le constat.",
  },
  taxData: {
    heading: "Sources des taux d'imposition",
    body: "Les taux d'imposition effectifs par classe de richesse sont compilés à partir de la recherche académique et des statistiques publiques. Contrairement aux données de distribution, ils ne sont pas disponibles via une API unique et sont maintenus manuellement à partir des sources publiées ci-dessous.",
  },
  limitations: {
    heading: "Limitations",
    items: [
      {
        bold: "Sous-estimation des plus hauts patrimoines",
        description:
          "Les données fondées sur enquêtes sous-estiment systématiquement les avoirs des ultra-riches, sous-représentés dans les enquêtes auprès des ménages. WID corrige partiellement avec des données fiscales, des écarts demeurent.",
      },
      {
        bold: "Biais de revenu autodéclaré",
        description:
          "Les utilisateur·rice·s saisissent leur propre revenu, qui peut ne pas refléter la rémunération totale (primes, equity, plus-values latentes).",
      },
      {
        bold: "Précautions par pays",
        description:
          "La qualité des données varie selon les pays. Certains disposent de données fiscales détaillées ; d'autres reposent sur des estimations d'enquête plus larges.",
      },
      {
        bold: "Approximation du modèle",
        description:
          "Le modèle revenu-richesse à 18 facteurs est une approximation statistique, pas un conseil financier personnalisé. Les situations individuelles peuvent diverger nettement des moyennes.",
      },
    ],
  },
  dataFreshness: {
    heading: "Fraîcheur des données",
    bodyTemplate:
      "Toutes les données sont intégrées au build et servies statiquement — aucune requête externe n'est faite à l'usage. Un seul script de récupération ({fetchScript}) extrait les données de :",
    fetchScriptLabel: "scripts/fetch-all-data.mjs",
    sources: [
      { bold: "API WID.world", description: "parts de richesse, parts de revenu, richesse moyenne/médiane, coefficients de Gini" },
      { bold: "API Banque mondiale", description: "population (SP.POP.TOTL)" },
      { bold: "BCE / API Frankfurter", description: "taux de change pour la conversion monétaire" },
      { bold: "API Forbes RTB", description: "patrimoine des milliardaires" },
      { bold: "OCDE / FRED", description: "salaires, IPC, indices des prix immobiliers" },
    ],
    outro:
      "Les données fiscales font exception — elles proviennent d'articles académiques et sont maintenues manuellement avec citations complètes (voir tableau ci-dessus).",
  },
  relatedNav: {
    backToCalculator: "Retour au calculateur",
    about: "À propos",
  },
};

const zhCn: MethodologyContent = {
  h1: "方法说明",
  intro:
    "本页解释「我到底有多穷？」背后的数据来源、模型与假设。目标是完全透明 — 工具中出现的每个数字都可以追溯到来源与计算方法。",
  wealthData: {
    heading: "财富分布数据",
    bodyTemplate:
      "财富份额数据来自 {widLink}，该数据库为数十个国家发布分布式国民账户（DINA）。这些账户把国家财富划分为以下群体：",
    widLinkLabel: "World Inequality Database",
    groups: [
      { bold: "底部 50%", description: "按净资产排序处于下半部分的人群" },
      { bold: "中间 40%", description: "第 50 到第 90 百分位，常被称作「中产阶层」" },
      { bold: "前 10%", description: "最富的十分之一，多数国家这部分人占总财富的 60–80%" },
      { bold: "前 1%", description: "前 10% 的子集，通常占总财富的 25–40%" },
    ],
    outro:
      "这些份额构成了把你定位到分布中的边界点。某国边界数据越细，最终百分位就越精确。",
  },
  incomeEstimation: {
    heading: "由收入估算财富",
    bodyTemplate:
      "大多数人知道自己的收入，但不知道净资产。为弥合这一缺口，工具使用 {modelEmphasis}，依据人口与财务特征调整收入对财富的比例：",
    modelEmphasis: "包含 18 个因子的估算模型",
    factors: [
      "年龄段（年轻人通常财富/收入比更低）",
      "学历（高学历与终身收入及储蓄正相关）",
      "就业形态（个体经营 vs. 受雇，公部门 vs. 私部门）",
      "储蓄率与投资行为",
      "是否拥有房产及房贷状态",
      "未偿债务（学贷、消费贷）",
    ],
    outroTemplate:
      "每个因子都会缩小不确定区间。未填任何因子时，模型大约有 {spreadHigh} 的散布；填完 18 个因子时，不确定性降至约 {spreadLow}。工具会与估算的百分位一并展示置信区间。",
    spreadHigh: "±70%",
    spreadLow: "±10%",
  },
  percentileCalc: {
    heading: "百分位的计算",
    bodyTemplate:
      "在估算出净资产后，工具采用 {interpEmphasis}，在已知的财富份额边界之间为你定位。例如，若底部 50% 占总财富的 5%、中间 40% 占 35%，则你处于这两个边界之间的位置按线性插值得出。这是一种近似 — 真实分布并不是严格线性的 — 但在已有数据下能给出合理估计。",
    interpEmphasis: "分段线性插值",
  },
  billionaireComparison: {
    heading: "亿万富豪对比",
    bodyOneTemplate:
      "「要多久？」模式使用 {forbesLink} 列表，构建时为各国最富的人打包好净资产数值。",
    forbesLinkLabel: "Forbes 实时亿万富豪榜",
    bodyTwo:
      "「需要多少年」是有意为之的简单算法：把亿万富豪的净资产除以你的年收入，不考虑利息、复利、税收或通货膨胀。这是有意的 — 重点不是理财规划，而是让差距「可感」。当答案是「400 万年」时，是否考虑 7% 的年化收益其实无关紧要。",
  },
  taxData: {
    heading: "税率数据来源",
    body: "按财富层级划分的有效税率来自学术研究与政府统计。和财富分布数据不同，它没有统一的 API，需根据下面的公开来源逐一手工维护。",
  },
  limitations: {
    heading: "局限性",
    items: [
      {
        bold: "顶端财富低估",
        description:
          "基于调查的财富数据系统性低估超富裕人群，他们在家庭调查中代表性不足。WID 用税务数据部分修正，但仍存在缺口。",
      },
      {
        bold: "自报收入偏差",
        description: "用户自填收入，可能未涵盖全部薪酬（奖金、股权、未实现收益）。",
      },
      {
        bold: "国别注意事项",
        description: "各国数据质量不同：一些有详尽税务型财富数据，另一些只能依赖误差更大的调查估计。",
      },
      {
        bold: "模型为近似",
        description: "18 因子收入-财富模型是统计近似，不是个人化财务建议。个人情况可能与人口平均值差异显著。",
      },
    ],
  },
  dataFreshness: {
    heading: "数据时效性",
    bodyTemplate:
      "所有数据在构建时打包并以静态形式提供 — 你使用工具时不会有任何外部 API 调用。一个抓取脚本（{fetchScript}）从以下来源拉取数据：",
    fetchScriptLabel: "scripts/fetch-all-data.mjs",
    sources: [
      { bold: "WID.world API", description: "财富份额、收入份额、平均/中位数财富、基尼系数" },
      { bold: "世界银行 API", description: "人口（SP.POP.TOTL）" },
      { bold: "ECB / Frankfurter API", description: "用于货币换算的汇率" },
      { bold: "Forbes RTB API", description: "亿万富豪的净资产数据" },
      { bold: "OECD / FRED", description: "工资、CPI、房价指数" },
    ],
    outro:
      "税率数据是例外 — 它来自学术论文，由人工维护并附上完整引用（见上方表格）。",
  },
  relatedNav: {
    backToCalculator: "返回计算器",
    about: "关于",
  },
};

const ja: MethodologyContent = {
  h1: "手法",
  intro:
    "このページでは「私はどれだけ貧しい？」のデータソース、モデル、前提を説明します。目標は完全な透明性 — ツールに表示されるすべての数値は、そのソースと計算までさかのぼれます。",
  wealthData: {
    heading: "資産分布データ",
    bodyTemplate:
      "資産シェアのデータは {widLink} から取得しています。WID は数十か国の Distributional National Accounts（DINA）を公表しており、国の資産を以下の群に分けています：",
    widLinkLabel: "World Inequality Database",
    groups: [
      { bold: "下位 50%", description: "純資産で並べたときの下半分" },
      { bold: "中間 40%", description: "第 50〜90 パーセンタイル。いわゆる「中流」" },
      { bold: "上位 10%", description: "最も裕福な 1/10。多くの国で総資産の 60〜80% を保有" },
      { bold: "上位 1%", description: "上位 10% の中の更に上層。総資産の 25〜40% を保有することが多い" },
    ],
    outro:
      "これらのシェアが、あなたを分布上に配置するための区切り点になります。区切りデータが詳細であるほど、最終的なパーセンタイルも精緻になります。",
  },
  incomeEstimation: {
    heading: "所得から資産への推定",
    bodyTemplate:
      "ほとんどの人は所得は把握していても、純資産は把握していません。このギャップを埋めるため、人口学的・財務的特性に基づいて所得-資産比を調整する {modelEmphasis} を用います：",
    modelEmphasis: "18 要因の推定モデル",
    factors: [
      "年齢層（若いほど資産/所得比が低い傾向）",
      "学歴（高学歴は生涯所得や貯蓄の高さと相関）",
      "就業形態（自営業 vs. 給与所得、公的 vs. 民間）",
      "貯蓄率と投資行動",
      "持家の有無と住宅ローン状況",
      "未払い債務（学資ローン、消費者債務）",
    ],
    outroTemplate:
      "各要因が不確実性の幅を狭めます。要因を入力しない場合、モデルの分布幅はおよそ {spreadHigh}。18 要因をすべて答えると、約 {spreadLow} まで縮小します。ツールは推定パーセンタイルとあわせて信頼区間を常に表示します。",
    spreadHigh: "±70%",
    spreadLow: "±10%",
  },
  percentileCalc: {
    heading: "パーセンタイルの計算",
    bodyTemplate:
      "推定純資産が決まると、ツールは既知の資産シェア境界の間で {interpEmphasis} を行ってあなたを分布に配置します。例：下位 50% が総資産の 5%、中間 40% が 35% を保有しているとき、その間の位置は推定シェアに基づいて線形に補間されます。実際の分布は境界点間で完全に線形ではないため近似ですが、利用可能なデータの下では妥当な見積もりを与えます。",
    interpEmphasis: "区分的線形補間",
  },
  billionaireComparison: {
    heading: "億万長者比較",
    bodyOneTemplate:
      "「どれだけかかる？」モードは {forbesLink} を使用します。各国の最も裕福な個人について、純資産の数値はビルド時にサイトへ組み込まれます。",
    forbesLinkLabel: "Forbes Real-Time Billionaires",
    bodyTwo:
      "「稼ぐのに必要な年数」はあえて単純に計算します：億万長者の純資産 ÷ あなたの年収（金利・複利・税・インフレを一切考慮しない）。意図的です — 目的は資産運用の計画ではなく、格差の「規模感」を体感的に示すこと。答えが「400 万年」になるなら、年 7% の運用利回りを足しても話の本質は変わりません。",
  },
  taxData: {
    heading: "税率データの出典",
    body: "資産階層別の実効税率は学術研究と政府統計から編集しています。資産分布データと違い単一の API では取得できないため、下表の公開資料を参照しつつ手作業で整備しています。",
  },
  limitations: {
    heading: "限界",
    items: [
      {
        bold: "上位資産の過小評価",
        description:
          "調査ベースの資産データは、家計調査で過少代表となる超富裕層の保有を体系的に過小評価します。WID は税務データで一部補正していますが、ギャップは残ります。",
      },
      {
        bold: "自己申告所得のバイアス",
        description:
          "ユーザーは所得を自己申告しますが、それが総報酬（賞与・株式報酬・未実現利益など）を反映しないことがあります。",
      },
      {
        bold: "国ごとの注意事項",
        description:
          "国によってデータの質は異なり、税務ベースの詳細データを持つ国もあれば、調査推計に頼らざるを得ず誤差幅が広い国もあります。",
      },
      {
        bold: "モデルは近似",
        description:
          "18 要因の所得-資産モデルは統計的近似であり、個別の財務助言ではありません。個人の状況は人口平均から大きく異なり得ます。",
      },
    ],
  },
  dataFreshness: {
    heading: "データの鮮度",
    bodyTemplate:
      "すべてのデータはビルド時にバンドルされ、静的に配信されます — 利用時に外部 API 呼び出しは行いません。単一のフェッチスクリプト（{fetchScript}）が以下のソースからデータを取得します：",
    fetchScriptLabel: "scripts/fetch-all-data.mjs",
    sources: [
      { bold: "WID.world API", description: "資産シェア・所得シェア・平均/中央値資産・ジニ係数" },
      { bold: "世界銀行 API", description: "人口（SP.POP.TOTL）" },
      { bold: "ECB / Frankfurter API", description: "通貨換算の為替レート" },
      { bold: "Forbes RTB API", description: "億万長者の純資産データ" },
      { bold: "OECD / FRED", description: "賃金、CPI、住宅価格指数" },
    ],
    outro:
      "税率データは例外で、学術論文に由来し、出典付きで手作業で整備しています（上の表を参照）。",
  },
  relatedNav: {
    backToCalculator: "計算ツールに戻る",
    about: "概要",
  },
};

const pt: MethodologyContent = {
  h1: "Metodologia",
  intro:
    "Esta página explica as fontes de dados, modelos e premissas por trás de Quão pobre eu sou?. O objetivo é total transparência — cada número que você vê pode ser rastreado até sua origem e cálculo.",
  wealthData: {
    heading: "Dados de distribuição da riqueza",
    bodyTemplate:
      "Os dados de participações de riqueza vêm da {widLink}, que publica Contas Nacionais Distribucionais (DINA) para dezenas de países. Essas contas dividem a riqueza nacional em grupos:",
    widLinkLabel: "World Inequality Database",
    groups: [
      { bold: "50% inferior", description: "A metade inferior da população por patrimônio líquido" },
      { bold: "40% do meio", description: "Do percentil 50 ao 90, frequentemente chamado de \"classe média\"" },
      { bold: "10% superior", description: "O décimo mais rico, que na maioria dos países detém 60-80% da riqueza total" },
      { bold: "1% superior", description: "Subconjunto do top 10%, geralmente detendo 25-40% da riqueza total" },
    ],
    outro:
      "Essas participações definem as fronteiras usadas para colocá-lo na distribuição. Quanto mais granulares os dados de fronteira de um país, mais preciso o percentil final.",
  },
  incomeEstimation: {
    heading: "Estimativa de renda para riqueza",
    bodyTemplate:
      "A maioria das pessoas conhece sua renda, mas não seu patrimônio líquido. Para preencher essa lacuna, a ferramenta usa um {modelEmphasis} que ajusta a razão renda/riqueza com base em características demográficas e financeiras:",
    modelEmphasis: "modelo de estimativa de 18 fatores",
    factors: [
      "Faixas etárias (pessoas mais jovens normalmente têm razões riqueza/renda menores)",
      "Nível educacional (educação superior correlaciona com maiores renda e poupança ao longo da vida)",
      "Tipo de emprego (autônomo vs. assalariado, público vs. privado)",
      "Taxa de poupança e comportamento de investimento",
      "Posse de imóvel e situação de financiamento",
      "Dívidas em aberto (empréstimos estudantis, dívida de consumo)",
    ],
    outroTemplate:
      "Cada fator estreita a faixa de incerteza. Sem fatores, o modelo carrega uma dispersão de aproximadamente {spreadHigh}. Com todos os 18 fatores respondidos, a incerteza cai para cerca de {spreadLow}. A ferramenta sempre mostra a faixa de confiança ao lado do percentil estimado.",
    spreadHigh: "±70%",
    spreadLow: "±10%",
  },
  percentileCalc: {
    heading: "Cálculo do percentil",
    bodyTemplate:
      "Com seu patrimônio líquido estimado calculado, a ferramenta o coloca na distribuição usando {interpEmphasis} entre os limites conhecidos de participação. Por exemplo, se os 50% inferiores detêm 5% da riqueza total e os 40% do meio detêm 35%, sua posição entre essas fronteiras é interpolada linearmente. É uma aproximação — distribuições reais não são perfeitamente lineares — mas oferece uma estimativa razoável dados os dados disponíveis.",
    interpEmphasis: "interpolação linear por partes",
  },
  billionaireComparison: {
    heading: "Comparação com bilionário",
    bodyOneTemplate:
      "O modo \"Quanto tempo levaria?\" usa a lista {forbesLink}. Os valores de patrimônio são empacotados no site em tempo de build para a pessoa mais rica de cada país.",
    forbesLinkLabel: "Forbes Real-Time Billionaires",
    bodyTwo:
      "O cálculo de \"anos para ganhar\" é deliberadamente simples: divide o patrimônio do bilionário pela sua renda anual, sem ajustes para juros, juros compostos, impostos ou inflação. É proposital — o ponto não é planejamento financeiro, mas ilustrar visceralmente a magnitude do abismo. Quando a resposta é \"4 milhões de anos\", saber se considera ou não 7% de retorno é irrelevante.",
  },
  taxData: {
    heading: "Fontes dos dados de alíquotas",
    body: "Alíquotas tributárias efetivas por classe de riqueza são compiladas a partir de pesquisa acadêmica e estatísticas governamentais. Diferente dos dados de distribuição de riqueza, não estão disponíveis em uma única API e são mantidas manualmente a partir das fontes publicadas abaixo.",
  },
  limitations: {
    heading: "Limitações",
    items: [
      {
        bold: "Subestimação no topo",
        description:
          "Dados de riqueza baseados em pesquisas subestimam sistematicamente os ativos dos ultrarricos, sub-representados em pesquisas domiciliares. O WID corrige parcialmente com dados fiscais, mas as lacunas permanecem.",
      },
      {
        bold: "Viés de renda autodeclarada",
        description:
          "Usuários informam sua própria renda, que pode não refletir a remuneração total (bônus, ações, ganhos não realizados).",
      },
      {
        bold: "Ressalvas por país",
        description:
          "A qualidade dos dados varia por país. Alguns têm dados detalhados baseados em registros fiscais; outros dependem de estimativas de pesquisa com margens maiores.",
      },
      {
        bold: "Aproximação do modelo",
        description:
          "O modelo de 18 fatores é uma aproximação estatística, não consultoria financeira personalizada. Circunstâncias individuais podem divergir bastante das médias populacionais.",
      },
    ],
  },
  dataFreshness: {
    heading: "Atualização dos dados",
    bodyTemplate:
      "Todos os dados são empacotados em tempo de build e servidos estaticamente — nenhuma chamada externa é feita ao usar a ferramenta. Um único script de fetch ({fetchScript}) puxa dados de:",
    fetchScriptLabel: "scripts/fetch-all-data.mjs",
    sources: [
      { bold: "API WID.world", description: "participações de riqueza, participações de renda, riqueza média/mediana, coeficientes de Gini" },
      { bold: "API do Banco Mundial", description: "população (SP.POP.TOTL)" },
      { bold: "BCE / API Frankfurter", description: "taxas de câmbio para conversão de moeda" },
      { bold: "API Forbes RTB", description: "patrimônio dos bilionários" },
      { bold: "OCDE / FRED", description: "salários, IPC, índices de preço de imóveis" },
    ],
    outro:
      "Os dados de alíquotas são a exceção — vêm de artigos acadêmicos e são mantidos manualmente com citações completas (ver tabela acima).",
  },
  relatedNav: {
    backToCalculator: "Voltar à calculadora",
    about: "Sobre",
  },
};

const it: MethodologyContent = {
  h1: "Metodologia",
  intro:
    "Questa pagina spiega le fonti dati, i modelli e le ipotesi dietro a Quanto sono povero?. L'obiettivo è la massima trasparenza — ogni numero che vedi può essere ricondotto alla fonte e al calcolo.",
  wealthData: {
    heading: "Dati di distribuzione della ricchezza",
    bodyTemplate:
      "I dati sulle quote di ricchezza provengono da {widLink}, che pubblica i Distributional National Accounts (DINA) per decine di paesi. Questi conti suddividono la ricchezza nazionale in gruppi:",
    widLinkLabel: "World Inequality Database",
    groups: [
      { bold: "50% inferiore", description: "La metà inferiore della popolazione per patrimonio netto" },
      { bold: "40% medio", description: "Dal 50° al 90° percentile, spesso definito \"classe media\"" },
      { bold: "10% superiore", description: "Il decimo più ricco, che nella maggior parte dei paesi detiene il 60-80% della ricchezza totale" },
      { bold: "1% superiore", description: "Sottoinsieme del top 10%, tipicamente con il 25-40% della ricchezza" },
    ],
    outro:
      "Queste quote definiscono i punti di confine usati per collocarti nella distribuzione. Più granulari sono i dati di un paese, più preciso è il percentile finale.",
  },
  incomeEstimation: {
    heading: "Stima reddito → ricchezza",
    bodyTemplate:
      "La maggior parte delle persone conosce il proprio reddito ma non il patrimonio netto. Per colmare questo divario, lo strumento usa un {modelEmphasis} che adatta il rapporto reddito/ricchezza in base a caratteristiche demografiche e finanziarie:",
    modelEmphasis: "modello di stima a 18 fattori",
    factors: [
      "Fasce d'età (i più giovani in genere hanno un rapporto ricchezza/reddito più basso)",
      "Livello di studi (l'istruzione superiore correla con redditi e risparmi più alti nel tempo)",
      "Tipo di impiego (autonomo vs. dipendente, pubblico vs. privato)",
      "Tasso di risparmio e comportamento d'investimento",
      "Possesso di casa e situazione del mutuo",
      "Debiti aperti (prestiti studenteschi, debiti al consumo)",
    ],
    outroTemplate:
      "Ogni fattore restringe l'intervallo di incertezza. Senza fattori, il modello porta una dispersione di circa {spreadHigh}. Con tutti i 18 fattori indicati, l'incertezza scende a circa {spreadLow}. Lo strumento mostra sempre la fascia di confidenza accanto al percentile stimato.",
    spreadHigh: "±70%",
    spreadLow: "±10%",
  },
  percentileCalc: {
    heading: "Calcolo del percentile",
    bodyTemplate:
      "Una volta calcolato il tuo patrimonio netto stimato, lo strumento ti colloca nella distribuzione tramite {interpEmphasis} fra i confini noti delle quote di ricchezza. Esempio: se il 50% inferiore detiene il 5% della ricchezza totale e il 40% medio il 35%, la tua posizione fra quei punti viene interpolata linearmente. È un'approssimazione — le distribuzioni reali non sono perfettamente lineari — ma fornisce una stima ragionevole con i dati disponibili.",
    interpEmphasis: "interpolazione lineare a tratti",
  },
  billionaireComparison: {
    heading: "Confronto con un miliardario",
    bodyOneTemplate:
      "La modalità «Quanto tempo serve?» usa la lista {forbesLink}. I valori di patrimonio sono inclusi nel sito al build per la persona più ricca di ciascun paese.",
    forbesLinkLabel: "Forbes Real-Time Billionaires",
    bodyTwo:
      "Il calcolo «anni per guadagnare» è deliberatamente semplice: divide il patrimonio del miliardario per il tuo reddito annuo, senza correzioni per interessi, capitalizzazione composta, tasse o inflazione. È voluto — l'obiettivo non è pianificazione finanziaria, ma rendere palpabile la dimensione del divario. Quando la risposta è «4 milioni di anni», che si consideri o meno un rendimento del 7% non cambia il senso.",
  },
  taxData: {
    heading: "Fonti dei dati sulle aliquote",
    body: "Le aliquote effettive per fascia di ricchezza sono compilate da ricerca accademica e statistiche pubbliche. A differenza dei dati di distribuzione, non sono disponibili tramite un'unica API e vengono mantenute manualmente a partire dalle fonti pubblicate sotto.",
  },
  limitations: {
    heading: "Limiti",
    items: [
      {
        bold: "Sottostima ai vertici",
        description:
          "I dati di ricchezza basati su indagini sottovalutano sistematicamente i patrimoni degli ultra-ricchi, sotto-rappresentati nelle indagini sui nuclei familiari. WID corregge parzialmente con dati fiscali, ma rimangono lacune.",
      },
      {
        bold: "Bias di reddito autodichiarato",
        description:
          "Le persone inseriscono il proprio reddito, che potrebbe non riflettere la retribuzione totale (bonus, equity, plusvalenze non realizzate).",
      },
      {
        bold: "Avvertenze per paese",
        description:
          "La qualità dei dati varia per paese. Alcuni dispongono di dati dettagliati basati sulle imposte; altri si affidano a stime da indagini con margini più ampi.",
      },
      {
        bold: "Approssimazione del modello",
        description:
          "Il modello a 18 fattori è un'approssimazione statistica, non una consulenza finanziaria personalizzata. Le situazioni individuali possono divergere molto dalle medie di popolazione.",
      },
    ],
  },
  dataFreshness: {
    heading: "Freschezza dei dati",
    bodyTemplate:
      "Tutti i dati sono inseriti al build time e serviti staticamente — nessuna chiamata API esterna avviene durante l'uso. Un unico script di fetch ({fetchScript}) recupera i dati da:",
    fetchScriptLabel: "scripts/fetch-all-data.mjs",
    sources: [
      { bold: "API WID.world", description: "quote di ricchezza, quote di reddito, ricchezza media/mediana, coefficienti di Gini" },
      { bold: "API Banca Mondiale", description: "popolazione (SP.POP.TOTL)" },
      { bold: "BCE / API Frankfurter", description: "tassi di cambio per la conversione valutaria" },
      { bold: "API Forbes RTB", description: "patrimoni dei miliardari" },
      { bold: "OCSE / FRED", description: "salari, IPC, indici dei prezzi delle case" },
    ],
    outro:
      "I dati sulle aliquote sono l'eccezione — provengono da articoli accademici e sono mantenuti manualmente con citazioni complete (vedi tabella sopra).",
  },
  relatedNav: {
    backToCalculator: "Torna al calcolatore",
    about: "Informazioni",
  },
};

const METHODOLOGY: Readonly<Record<LocaleCode, MethodologyContent>> = {
  en,
  es,
  de,
  fr,
  "zh-cn": zhCn,
  ja,
  pt,
  it,
};

export function getMethodologyContent(locale: LocaleCode): MethodologyContent {
  return METHODOLOGY[locale] ?? METHODOLOGY.en;
}
