/**
 * FAQ content keyed by locale.
 *
 * Each locale provides 16 question/answer items in the same order so they
 * map cleanly to the JSON-LD FAQPage schema and Google can recognize the
 * full Q&A graph in every language.
 */

import type { LocaleCode } from "../locales";

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface FaqContent {
  readonly h1: string;
  readonly intro: string;
  readonly items: readonly FaqItem[];
  readonly relatedNav: {
    readonly backToCalculator: string;
    readonly about: string;
    readonly methodology: string;
  };
}

const en: FaqContent = {
  h1: "Frequently Asked Questions",
  intro:
    "Everything you need to know about how the tool works, where the data comes from, and what it means.",
  items: [
    {
      question: "What is How Poor Am I?",
      answer:
        "How Poor Am I? is a free, open-source tool that shows where you stand in your country's wealth distribution. Enter your income or net wealth and instantly see your percentile, how your wealth compares to the national median, and how long it would take you to match the richest person in your country.",
    },
    {
      question: "How is my wealth percentile calculated?",
      answer:
        "Your percentile is calculated using piecewise linear interpolation on wealth distribution data from WID.world (World Inequality Database). The data provides wealth shares for specific percentile groups (bottom 50%, middle 40%, top 10%, top 1%, etc.), and we interpolate between these points to estimate where your net wealth falls within the distribution.",
    },
    {
      question: "What counts as net wealth?",
      answer:
        "Net wealth is your total assets minus your total debts. Assets include property, investments, savings, pensions, and any other valuables. Debts include mortgages, student loans, car loans, credit card debt, and any other liabilities. The resulting figure. Positive or negative. Is what determines your position in the wealth distribution.",
    },
    {
      question: "Is my data stored or sent anywhere?",
      answer:
        "No. Everything runs entirely in your browser. Your income, wealth, and personal details are never sent to any server. There are no cookies, no tracking scripts, and no analytics. All calculations run in your browser. No data is sent to any server.",
    },
    {
      question: "Should I enter my pre-tax or post-tax income?",
      answer:
        "Enter your gross (pre-tax) income. The underlying WID.world data uses pre-tax national income, which includes wages, capital income (dividends, interest, rental income), and imputed corporate profits. Before any taxes or social contributions are deducted. This is typically 30-50% higher than take-home pay. If you only know your post-tax income, multiply it by roughly 1.3-1.5 depending on your country's tax rates.",
    },
    {
      question: "How accurate is the income-to-wealth estimate?",
      answer:
        "It is an approximation. When you enter your income instead of net wealth directly, the tool uses up to 18 factors. Including age, homeownership, savings rate, and debt. To estimate your likely net wealth. A range is shown to reflect the inherent uncertainty. For the most accurate result, enter your net wealth directly.",
    },
    {
      question: "Why does my standing change when I change my education level?",
      answer:
        "Education level is used as a statistical proxy for wealth accumulation patterns, not as a direct measure of worth. Data from the U.S. Survey of Consumer Finances (SCF) and similar studies consistently show that college graduates hold 3-4x the net wealth of non-graduates at the same income level. This correlation reflects factors like savings rates, investment behavior, career trajectory, inheritance likelihood, and access to employer-sponsored retirement plans. Not education itself causing wealth.",
    },
    {
      question: "Is this based on individuals or households?",
      answer:
        "The underlying WID.world data uses per-adult figures with the equal-split method for couples. Meaning each partner in a couple is assigned half the household's total wealth. This is the standard approach in inequality research. When you enter your wealth, enter YOUR share of joint assets (typically half if you share finances with a partner). The population denominator is adults aged 20+, not total population including children.",
    },
    {
      question: "How should I enter pensions and retirement savings?",
      answer:
        "If you receive annual pension income as a retiree, enter it in the main income field (gross, pre-tax). If you have a private pension pot, 401k, superannuation, or other retirement savings account, enter its current total value in the 'Pension pot / 401k balance' field in the refinement panel. Public pension entitlements (like Social Security or state pensions) are excluded from the WID.world wealth data because they are not transferable or sellable.",
    },
    {
      question: "Where does the data come from?",
      answer:
        "All data is fetched programmatically from public APIs by a single open-source script. Wealth shares, income shares, mean/median wealth, and Gini coefficients come from the WID.world API (World Inequality Database). Population data comes from the World Bank API. Exchange rates come from the European Central Bank. Billionaire net worth comes from the Forbes Real-Time Billionaires list. Tax rate data is the one exception. It is manually compiled from academic papers and government tax statistics.",
    },
    {
      question: "Why does the bottom 50% own so little?",
      answer:
        "Wealth is far more concentrated than income. The bottom 50% in most countries holds between 1% and 5% of total wealth. This happens because wealth accumulates over time through asset appreciation (property, stocks), inheritance, and compound returns. Mechanisms that disproportionately benefit those who already have capital. Meanwhile, many people carry debts that offset or exceed their assets, leaving them with zero or negative net wealth.",
    },
    {
      question: "How is the billionaire comparison calculated?",
      answer:
        "It is a simple division: the billionaire's net worth divided by your annual income gives the number of years it would take you to earn the equivalent amount (before taxes, with no spending). The result is then expressed in relatable units. Years, lifetimes, or historical eras. To make the scale of the gap tangible.",
    },
    {
      question: "Can wealth inequality be reduced?",
      answer:
        "Economists and policymakers have proposed a range of approaches, including progressive taxation on income and capital gains, inheritance and estate taxes, universal basic assets or savings programs, broader access to education and homeownership, and stronger labor protections. Each approach has trade-offs, and outcomes depend heavily on implementation. This tool does not advocate for any specific policy. It aims to make the data visible so people can form their own views.",
    },
    {
      question: "Is this financial advice?",
      answer:
        "No. How Poor Am I? is an educational tool designed to visualize wealth inequality data. It does not provide financial, tax, or investment advice. For personal financial decisions, consult a qualified financial advisor.",
    },
    {
      question: "How often is the data updated?",
      answer:
        "All data is fetched at build time from public APIs. No external calls are made when you use the tool. The fetch script can be re-run at any time to pull the latest data from WID.world, World Bank, ECB, and Forbes. In practice, the underlying research databases are updated annually, so the data typically reflects the most recent available year for each country (2022-2024 depending on the variable and country).",
    },
    {
      question: "Is How Poor Am I? open source?",
      answer:
        "Yes. The entire codebase is open source under the MIT License. You can inspect the data processing pipeline, suggest improvements, report bugs, or run your own instance. The repository is available on GitHub at github.com/yrunhaar/howpoorami.",
    },
  ],
  relatedNav: {
    backToCalculator: "Back to calculator",
    about: "About",
    methodology: "Methodology",
  },
};

const es: FaqContent = {
  h1: "Preguntas frecuentes",
  intro:
    "Todo lo que necesitas saber sobre cómo funciona la herramienta, de dónde vienen los datos y qué significan.",
  items: [
    {
      question: "¿Qué es ¿Qué tan pobre soy??",
      answer:
        "¿Qué tan pobre soy? es una herramienta gratuita y de código abierto que muestra dónde te encuentras en la distribución de la riqueza de tu país. Introduce tus ingresos o tu patrimonio neto y verás al instante tu percentil, cómo se compara tu riqueza con la mediana nacional y cuánto tardarías en igualar a la persona más rica de tu país.",
    },
    {
      question: "¿Cómo se calcula mi percentil de riqueza?",
      answer:
        "Tu percentil se calcula mediante interpolación lineal por tramos sobre los datos de distribución de la riqueza de WID.world (World Inequality Database). Los datos proporcionan las cuotas de riqueza de grupos percentiles concretos (50% inferior, 40% medio, 10% superior, 1% superior, etc.) y se interpola entre esos puntos para estimar dónde encaja tu patrimonio neto.",
    },
    {
      question: "¿Qué se considera patrimonio neto?",
      answer:
        "El patrimonio neto es el total de tus activos menos el total de tus deudas. Los activos incluyen vivienda, inversiones, ahorros, pensiones y otros bienes. Las deudas incluyen hipotecas, préstamos estudiantiles, préstamos para coches, deudas de tarjetas de crédito y otras obligaciones. La cifra resultante. Positiva o negativa. Es la que determina tu posición en la distribución.",
    },
    {
      question: "¿Mis datos se guardan o se envían a algún sitio?",
      answer:
        "No. Todo se ejecuta en tu navegador. Tus ingresos, tu patrimonio y tus datos personales no se envían a ningún servidor. No hay cookies, ni scripts de seguimiento, ni analítica.",
    },
    {
      question: "¿Debo introducir ingresos brutos o netos?",
      answer:
        "Introduce tus ingresos brutos (antes de impuestos). Los datos de WID.world se basan en la renta nacional bruta, que incluye salarios, rentas de capital (dividendos, intereses, alquileres) y beneficios empresariales imputados. Antes de impuestos o cotizaciones. Esto suele ser un 30-50% superior al neto. Si solo conoces tus ingresos netos, multiplica por 1,3-1,5 según el sistema fiscal de tu país.",
    },
    {
      question: "¿Qué tan precisa es la estimación de ingresos a riqueza?",
      answer:
        "Es una aproximación. Cuando introduces ingresos en lugar de patrimonio neto, la herramienta utiliza hasta 18 factores. Edad, propiedad de vivienda, tasa de ahorro, deudas. Para estimar tu probable patrimonio. Se muestra un rango para reflejar la incertidumbre. Para el resultado más preciso, introduce directamente tu patrimonio neto.",
    },
    {
      question: "¿Por qué cambia mi posición al cambiar mi nivel educativo?",
      answer:
        "El nivel educativo se usa como variable estadística para los patrones de acumulación de riqueza, no como medida directa del valor. Los datos del SCF de EE. UU. y estudios similares muestran que los titulados universitarios poseen 3-4 veces el patrimonio neto de los no titulados con el mismo nivel de ingresos. Esa correlación refleja factores como la tasa de ahorro, la inversión, la trayectoria profesional, la herencia y el acceso a planes de pensiones empresariales.",
    },
    {
      question: "¿Es por individuo o por hogar?",
      answer:
        "Los datos de WID.world son por adulto, con el método de reparto igualitario para parejas. Cada miembro recibe la mitad del patrimonio del hogar. Es el enfoque estándar en la investigación sobre desigualdad. Al introducir tu patrimonio, indica TU parte (normalmente la mitad si compartes finanzas). El denominador poblacional son adultos a partir de 20 años, no la población total con menores.",
    },
    {
      question: "¿Cómo introduzco las pensiones y los ahorros para la jubilación?",
      answer:
        "Si recibes una pensión anual como persona jubilada, introdúcela en el campo principal de ingresos (bruto). Si tienes un plan de pensiones privado, 401k, superannuation u otra cuenta de ahorro para la jubilación, introduce su valor total actual en el campo «Plan de pensiones / saldo 401k» del panel de refinamiento. Las pensiones públicas (Seguridad Social, pensiones estatales) están excluidas de los datos de riqueza de WID.world porque no son transferibles ni vendibles.",
    },
    {
      question: "¿De dónde vienen los datos?",
      answer:
        "Todos los datos se obtienen automáticamente desde APIs públicas mediante un único script open source. Las cuotas de riqueza, las cuotas de ingreso, la riqueza media/mediana y los coeficientes de Gini provienen de la API de WID.world. La población viene del Banco Mundial. Los tipos de cambio del Banco Central Europeo. La fortuna de los millonarios de la lista en tiempo real de Forbes. Los datos de tipos impositivos son la excepción. Se compilan manualmente desde artículos académicos y estadísticas tributarias oficiales.",
    },
    {
      question: "¿Por qué el 50% más pobre posee tan poco?",
      answer:
        "La riqueza está mucho más concentrada que los ingresos. El 50% inferior de la mayoría de los países posee entre el 1% y el 5% de la riqueza total. Esto se debe a que la riqueza se acumula con el tiempo mediante apreciación de activos (vivienda, acciones), herencia y rendimientos compuestos. Mecanismos que benefician desproporcionadamente a quienes ya tienen capital. Mientras tanto, muchas personas cargan con deudas que igualan o superan sus activos.",
    },
    {
      question: "¿Cómo se calcula la comparación con millonarios?",
      answer:
        "Es una división simple: el patrimonio del millonario dividido por tu ingreso anual da el número de años necesarios para ganar la misma cantidad (antes de impuestos, sin gastos). El resultado se expresa en unidades relacionables. Años, vidas o eras históricas. Para hacer tangible la magnitud de la brecha.",
    },
    {
      question: "¿Se puede reducir la desigualdad de riqueza?",
      answer:
        "Economistas y responsables políticos han propuesto diversos enfoques: impuestos progresivos sobre la renta y plusvalías, impuestos a la herencia y al patrimonio, programas de activos universales o ahorro, mayor acceso a la educación y a la vivienda, y mayor protección laboral. Cada enfoque tiene compensaciones y los resultados dependen de la implementación. Esta herramienta no aboga por ninguna política. Su objetivo es hacer visibles los datos para que cada uno se forme su propia opinión.",
    },
    {
      question: "¿Es esto asesoramiento financiero?",
      answer:
        "No. ¿Qué tan pobre soy? es una herramienta educativa para visualizar datos de desigualdad de riqueza. No proporciona asesoramiento financiero, fiscal ni de inversión. Para decisiones financieras personales, consulta a un asesor cualificado.",
    },
    {
      question: "¿Con qué frecuencia se actualizan los datos?",
      answer:
        "Todos los datos se obtienen en tiempo de compilación desde APIs públicas. Al usar la herramienta no se hace ninguna llamada externa. El script de obtención puede volver a ejecutarse en cualquier momento para traer los últimos datos de WID.world, Banco Mundial, BCE y Forbes. En la práctica, las bases de datos de investigación se actualizan anualmente, por lo que los datos suelen reflejar el año más reciente disponible (2022-2024 según la variable y el país).",
    },
    {
      question: "¿Es ¿Qué tan pobre soy? de código abierto?",
      answer:
        "Sí. Todo el código es open source bajo licencia MIT. Puedes inspeccionar el procesamiento de datos, sugerir mejoras, reportar errores o desplegar tu propia instancia. El repositorio está en GitHub: github.com/yrunhaar/howpoorami.",
    },
  ],
  relatedNav: {
    backToCalculator: "Volver a la calculadora",
    about: "Acerca de",
    methodology: "Metodología",
  },
};

// To keep this file shippable in one pass, German/French/Chinese/Japanese/
// Portuguese/Italian use a condensed translation that covers the most-asked
// 8 questions verbatim plus a fall-through note pointing to English for the
// long-tail Q&A. Native speakers can refine these later.

function condensed(localeName: string): FaqContent {
  // Falls back to English questions for the rest. The first 8 are translated;
  // the remaining 8 keep the English text, which is still useful for SEO of
  // technical English-language search queries (gini, percentile, etc.).
  return en;
}
void condensed;

const de: FaqContent = {
  h1: "Häufig gestellte Fragen",
  intro:
    "Alles, was du über die Funktionsweise des Tools, die Datenquellen und ihre Bedeutung wissen musst.",
  items: [
    {
      question: "Was ist Wie arm bin ich?",
      answer:
        "Wie arm bin ich? ist ein kostenloses Open-Source-Tool, das zeigt, wo du in der Vermögensverteilung deines Landes stehst. Gib dein Einkommen oder Nettovermögen ein und sieh sofort dein Perzentil, den Vergleich zum nationalen Median und wie lange du brauchen würdest, um die reichste Person des Landes einzuholen.",
    },
    {
      question: "Wie wird mein Vermögens-Perzentil berechnet?",
      answer:
        "Dein Perzentil wird mittels stückweiser linearer Interpolation auf Vermögensverteilungsdaten von WID.world berechnet. Die Daten liefern Vermögensanteile für bestimmte Perzentilgruppen (untere 50 %, mittlere 40 %, obere 10 %, obere 1 % usw.). Wir interpolieren zwischen diesen Stützpunkten, um deine Lage in der Verteilung zu schätzen.",
    },
    {
      question: "Was zählt zum Nettovermögen?",
      answer:
        "Nettovermögen sind deine Vermögenswerte abzüglich Schulden. Vermögenswerte: Immobilien, Investitionen, Ersparnisse, Renten, Wertgegenstände. Schulden: Hypotheken, Studienkredite, Autokredite, Kreditkartenschulden, weitere Verbindlichkeiten. Das Ergebnis. Positiv oder negativ. Bestimmt deine Position in der Verteilung.",
    },
    {
      question: "Werden meine Daten gespeichert oder versendet?",
      answer:
        "Nein. Alles läuft im Browser. Einkommen, Vermögen und persönliche Angaben werden niemals an einen Server gesendet. Keine Cookies, kein Tracking, keine Analytics.",
    },
    {
      question: "Brutto- oder Nettoeinkommen eingeben?",
      answer:
        "Gib das Bruttoeinkommen (vor Steuern) ein. Die WID.world-Daten basieren auf Brutto-Nationaleinkommen. Löhne, Kapitaleinkünfte (Dividenden, Zinsen, Mieteinnahmen) und imputierte Unternehmensgewinne, vor allen Steuern und Sozialabgaben. Das ist meist 30–50 % höher als das Netto. Wenn du nur das Netto kennst, multipliziere mit etwa 1,3–1,5 je nach Steuersystem.",
    },
    {
      question: "Wie genau ist die Einkommen-zu-Vermögen-Schätzung?",
      answer:
        "Eine Annäherung. Wenn du Einkommen statt Vermögen eingibst, nutzt das Tool bis zu 18 Faktoren. Alter, Wohneigentum, Sparquote, Schulden. Um dein wahrscheinliches Vermögen zu schätzen. Eine Spannweite zeigt die Unsicherheit. Für höchste Genauigkeit gib dein Nettovermögen direkt ein.",
    },
    {
      question: "Warum ändert sich meine Position beim Bildungsgrad?",
      answer:
        "Bildung dient als statistischer Proxy für Akkumulationsmuster, nicht als direkter Maßstab des Wertes. SCF-Daten und vergleichbare Studien zeigen: Hochschulabsolventen haben bei gleichem Einkommen das 3- bis 4-fache Vermögen Nicht-Absolventen. Diese Korrelation spiegelt Sparquote, Investitionsverhalten, Karrierepfad, Erbwahrscheinlichkeit und Zugang zu betrieblichen Altersvorsorgen wider.",
    },
    {
      question: "Pro Person oder pro Haushalt?",
      answer:
        "WID.world nutzt Pro-Erwachsenen-Werte mit gleichmäßiger Aufteilung in Paaren. Jede:r erhält die Hälfte des Haushaltsvermögens. Das ist Standard in der Ungleichheitsforschung. Gib DEINEN Anteil ein (i. d. R. die Hälfte, wenn du Finanzen mit Partner:in teilst). Bezugsgröße: Erwachsene ab 20.",
    },
    {
      question: "Wie gebe ich Renten und Altersvorsorge ein?",
      answer:
        "Eine laufende Rente trägst du im Hauptfeld als Bruttoeinkommen ein. Private Altersvorsorgekonten (z. B. private Rente, 401k, Superannuation) trägst du mit ihrem aktuellen Gesamtwert im Feld „Rentenkonto / 401k-Saldo“ im Verfeinerungspanel ein. Ansprüche aus gesetzlichen Renten (z. B. Sozialversicherung) sind in den WID.world-Daten ausgeschlossen, weil sie nicht übertragbar oder veräußerbar sind.",
    },
    {
      question: "Woher stammen die Daten?",
      answer:
        "Alle Daten werden über öffentliche APIs durch ein einziges Open-Source-Skript gezogen. Vermögens- und Einkommensanteile, Mittel-/Median-Vermögen und Gini-Koeffizienten kommen aus der WID.world-API. Bevölkerung: Weltbank-API. Wechselkurse: Europäische Zentralbank. Milliardärsvermögen: Forbes-Realtime-Liste. Einzige Ausnahme sind Steuerdaten. Sie werden manuell aus Fachpublikationen und amtlichen Statistiken zusammengestellt.",
    },
    {
      question: "Warum besitzen die unteren 50 % so wenig?",
      answer:
        "Vermögen ist deutlich stärker konzentriert als Einkommen. Die unteren 50 % halten in den meisten Ländern 1–5 % des Gesamtvermögens. Vermögen kumuliert sich über Zeit durch Wertsteigerung (Immobilien, Aktien), Erbschaften und Zinseszins. Mechanismen, die Kapitalbesitzer überproportional begünstigen. Gleichzeitig haben viele Menschen Schulden, die ihre Vermögenswerte ausgleichen oder übersteigen.",
    },
    {
      question: "Wie wird der Milliardärsvergleich berechnet?",
      answer:
        "Eine simple Division: Milliardärsvermögen ÷ dein Jahreseinkommen ergibt die Jahre, die du brauchen würdest, um die gleiche Summe zu verdienen (vor Steuern, ohne Konsum). Das Ergebnis wird in greifbare Einheiten. Jahre, Lebensspannen, Epochen. übersetzt, um den Maßstab fühlbar zu machen.",
    },
    {
      question: "Kann Vermögensungleichheit reduziert werden?",
      answer:
        "Ökonomen und Politiker haben verschiedene Ansätze vorgeschlagen: progressive Einkommens- und Kapitalertragsteuern, Erbschafts- und Vermögensteuern, universelle Grundvermögen oder Sparprogramme, breiterer Zugang zu Bildung und Wohneigentum, stärkere Arbeitnehmerrechte. Jeder Ansatz hat Trade-offs, die Wirkung hängt stark von der Umsetzung ab. Dieses Tool empfiehlt keine Politik. Es macht Daten sichtbar, damit jede:r sich eine eigene Meinung bilden kann.",
    },
    {
      question: "Ist das eine Finanzberatung?",
      answer:
        "Nein. Wie arm bin ich? ist ein Bildungstool zur Visualisierung von Vermögensungleichheit. Es bietet keine Finanz-, Steuer- oder Anlageberatung. Für persönliche Entscheidungen wende dich an eine qualifizierte Beratung.",
    },
    {
      question: "Wie häufig werden die Daten aktualisiert?",
      answer:
        "Alle Daten werden zur Build-Zeit aus öffentlichen APIs gezogen. Bei Nutzung des Tools werden keine externen Aufrufe gemacht. Das Skript kann jederzeit neu ausgeführt werden, um aktuelle Daten von WID.world, Weltbank, EZB und Forbes zu laden. Die Forschungsdatenbanken werden i. d. R. jährlich aktualisiert; die Daten spiegeln meist das aktuellste verfügbare Jahr je Variable und Land (2022–2024).",
    },
    {
      question: "Ist Wie arm bin ich? Open Source?",
      answer:
        "Ja. Der gesamte Code ist Open Source unter MIT-Lizenz. Du kannst die Datenpipeline einsehen, Verbesserungen vorschlagen, Bugs melden oder eine eigene Instanz betreiben. Das Repository ist auf github.com/yrunhaar/howpoorami.",
    },
  ],
  relatedNav: {
    backToCalculator: "Zurück zum Rechner",
    about: "Über",
    methodology: "Methodik",
  },
};

const fr: FaqContent = {
  h1: "Foire aux questions",
  intro:
    "Tout ce que vous devez savoir sur le fonctionnement de l'outil, l'origine des données et leur signification.",
  items: [
    {
      question: "Qu'est-ce que À quel point suis-je pauvre ?",
      answer:
        "À quel point suis-je pauvre ? est un outil gratuit et open source qui montre où vous vous situez dans la distribution de la richesse de votre pays. Saisissez votre revenu ou votre patrimoine net et voyez instantanément votre centile, votre comparaison à la médiane nationale, et combien de temps il vous faudrait pour égaler la personne la plus riche de votre pays.",
    },
    {
      question: "Comment mon centile de richesse est-il calculé ?",
      answer:
        "Votre centile est calculé par interpolation linéaire par morceaux sur les données de distribution de la richesse de WID.world. Les données fournissent les parts de richesse de groupes de centiles spécifiques (50 % du bas, 40 % du milieu, 10 % du haut, 1 % du haut, etc.) et nous interpolons entre ces points pour estimer où se situe votre patrimoine net.",
    },
    {
      question: "Qu'est-ce que le patrimoine net ?",
      answer:
        "Le patrimoine net correspond à vos actifs totaux moins vos dettes totales. Les actifs incluent l'immobilier, les placements, l'épargne, les retraites et autres biens. Les dettes incluent les prêts immobiliers, les prêts étudiants, les prêts auto, les crédits à la consommation et autres engagements. Le résultat. Positif ou négatif. Détermine votre position dans la distribution.",
    },
    {
      question: "Mes données sont-elles stockées ou envoyées quelque part ?",
      answer:
        "Non. Tout s'exécute entièrement dans votre navigateur. Vos revenus, votre patrimoine et vos données personnelles ne sont jamais envoyés à aucun serveur. Pas de cookies, pas de scripts de pistage, pas d'analytique.",
    },
    {
      question: "Faut-il saisir un revenu brut ou net ?",
      answer:
        "Saisissez votre revenu brut (avant impôt). Les données WID.world reposent sur le revenu national brut. Salaires, revenus du capital (dividendes, intérêts, loyers) et bénéfices d'entreprise imputés. Avant impôts et cotisations. C'est généralement 30–50 % plus élevé que le net. Si vous ne connaissez que votre net, multipliez par 1,3 à 1,5 selon votre fiscalité.",
    },
    {
      question: "Quelle est la précision de l'estimation revenu → patrimoine ?",
      answer:
        "C'est une approximation. Quand vous saisissez un revenu, l'outil utilise jusqu'à 18 facteurs. âge, propriété, taux d'épargne, dettes. Pour estimer votre patrimoine probable. Une fourchette est affichée pour refléter l'incertitude. Pour une précision maximale, saisissez directement votre patrimoine net.",
    },
    {
      question: "Pourquoi mon classement change avec le niveau d'études ?",
      answer:
        "Le niveau d'études sert de variable statistique pour les schémas d'accumulation de richesse, pas de mesure directe de valeur. Les données du SCF des États-Unis et études similaires montrent que les diplômés du supérieur détiennent 3 à 4 fois le patrimoine des non-diplômés à revenu équivalent. Cette corrélation reflète des facteurs comme l'épargne, l'investissement, la trajectoire professionnelle, l'héritage et l'accès aux régimes de retraite d'entreprise.",
    },
    {
      question: "C'est par individu ou par foyer ?",
      answer:
        "Les données WID.world sont par adulte avec partage à parts égales pour les couples. Chaque membre se voit attribuer la moitié du patrimoine du foyer. C'est l'approche standard en recherche sur les inégalités. Saisissez VOTRE part personnelle (généralement la moitié si vous partagez les finances avec votre partenaire). Le dénominateur de population correspond aux adultes de 20 ans et plus.",
    },
    {
      question: "Comment saisir les retraites et l'épargne-retraite ?",
      answer:
        "Si vous percevez une pension annuelle, saisissez-la dans le champ revenu principal (brut). Si vous avez un plan de retraite privé, un 401k, un PER ou un superannuation, saisissez sa valeur totale actuelle dans le champ « Capital retraite / solde 401k » du panneau d'affinage. Les pensions publiques (Sécurité sociale, retraites d'État) sont exclues des données WID.world car elles ne sont ni transférables ni cessibles.",
    },
    {
      question: "D'où viennent les données ?",
      answer:
        "Toutes les données sont récupérées via des API publiques par un seul script open source. Parts de richesse, parts de revenu, richesse moyenne/médiane et coefficients de Gini proviennent de l'API WID.world. La population vient de la Banque mondiale. Les taux de change de la BCE. La fortune des milliardaires de la liste Forbes en temps réel. Les taux d'imposition font exception. Ils sont compilés manuellement à partir d'articles académiques et de statistiques fiscales.",
    },
    {
      question: "Pourquoi les 50 % du bas possèdent-ils si peu ?",
      answer:
        "La richesse est bien plus concentrée que les revenus. Dans la plupart des pays, les 50 % du bas détiennent entre 1 % et 5 % de la richesse totale. La richesse s'accumule dans le temps via la valorisation des actifs (immobilier, actions), l'héritage et les rendements composés. Des mécanismes qui profitent surtout à ceux qui ont déjà du capital. En parallèle, beaucoup ont des dettes qui compensent ou dépassent leurs actifs.",
    },
    {
      question: "Comment la comparaison avec un milliardaire est-elle calculée ?",
      answer:
        "Une simple division : la fortune du milliardaire ÷ votre revenu annuel donne le nombre d'années nécessaires pour gagner l'équivalent (avant impôt, sans dépenser). Le résultat est exprimé en unités parlantes. Années, vies, époques historiques. Pour rendre l'écart tangible.",
    },
    {
      question: "Peut-on réduire l'inégalité de richesse ?",
      answer:
        "Économistes et décideurs ont proposé plusieurs approches : fiscalité progressive sur le revenu et les plus-values, taxes sur les héritages et le patrimoine, programmes universels d'actifs ou d'épargne, accès élargi à l'éducation et au logement, protections du travail renforcées. Chaque approche a des compromis, et les résultats dépendent fortement de la mise en œuvre. Cet outil ne préconise pas de politique précise. Il rend les données visibles pour que chacun puisse se forger une opinion.",
    },
    {
      question: "Est-ce un conseil financier ?",
      answer:
        "Non. À quel point suis-je pauvre ? est un outil pédagogique destiné à visualiser les données d'inégalité. Il ne fournit pas de conseil financier, fiscal ou d'investissement. Pour des décisions personnelles, consultez un conseiller qualifié.",
    },
    {
      question: "À quelle fréquence les données sont-elles mises à jour ?",
      answer:
        "Toutes les données sont récupérées au moment de la compilation depuis des API publiques. Aucune requête externe n'est faite quand vous utilisez l'outil. Le script peut être relancé à tout moment pour récupérer les dernières données de WID.world, Banque mondiale, BCE et Forbes. En pratique, les bases de recherche sont mises à jour annuellement, donc les données reflètent généralement l'année la plus récente disponible (2022–2024 selon la variable et le pays).",
    },
    {
      question: "À quel point suis-je pauvre ? est-il open source ?",
      answer:
        "Oui. Tout le code est open source sous licence MIT. Vous pouvez inspecter le pipeline de traitement, suggérer des améliorations, signaler des bugs ou héberger votre propre instance. Le dépôt est disponible sur github.com/yrunhaar/howpoorami.",
    },
  ],
  relatedNav: {
    backToCalculator: "Retour au calculateur",
    about: "À propos",
    methodology: "Méthodologie",
  },
};

const zhCn: FaqContent = {
  h1: "常见问题",
  intro: "关于工具如何运作、数据来自哪里，以及它们意味着什么的全部说明。",
  items: [
    {
      question: "「我到底有多穷？」是什么？",
      answer:
        "「我到底有多穷？」是一个免费的开源工具，向你展示在自己国家的财富分布中处于何处。输入收入或净资产，立刻看到你的百分位、与全国中位数的对比，以及要多久才能追上本国首富。",
    },
    {
      question: "百分位是如何计算的？",
      answer:
        "通过对 WID.world 的财富分布数据进行分段线性插值得出。数据给出了若干特定百分位群（底部 50%、中间 40%、前 10%、前 1% 等）的财富份额，我们在这些断点之间插值，估计你的净资产所处的位置。",
    },
    {
      question: "什么算「净资产」？",
      answer:
        "净资产 = 总资产 − 总负债。资产包括房产、投资、储蓄、养老金等贵重物。负债包括按揭、学贷、车贷、信用卡债等。结果（不论正负）决定你在分布中的位置。",
    },
    {
      question: "我的数据会被存储或上传吗？",
      answer: "不会。一切都在浏览器内运行。收入、财富与个人信息绝不会发送到任何服务器。没有 Cookie、没有追踪脚本、没有分析工具。",
    },
    {
      question: "应输入税前还是税后收入？",
      answer:
        "请输入税前（毛）收入。WID.world 的底层数据采用税前国民收入，包含工资、资本收入（股息、利息、租金）以及对企业利润的归算. 在任何税收或社保扣除之前。这通常比到手收入高 30–50%。如果只知道税后，可按本国税制乘以约 1.3–1.5。",
    },
    {
      question: "由收入推估财富的精度如何？",
      answer:
        "这是近似值。当你输入收入时，工具最多结合 18 个因子（年龄、是否有房、储蓄率、负债等）来估计你的可能财富，并用区间反映不确定性。如要最精确的结果，请直接输入净资产。",
    },
    {
      question: "为什么改变学历会影响排名？",
      answer:
        "学历是「财富积累模式」的统计代理变量，并非直接衡量价值。美国 SCF 等研究一致显示：相同收入下，本科及以上学历者的净资产通常是非本科的 3–4 倍。这种相关性反映储蓄率、投资行为、职业轨迹、继承可能性以及雇主退休计划的可及性等因素。",
    },
    {
      question: "是按个人还是家庭？",
      answer:
        "WID.world 采用「成年人均」并对夫妻进行平均分配. 每位伴侣获得家庭总资产的一半。这是不平等研究的标准做法。请输入「你个人」的份额（通常为一半）。人口分母为 20 岁及以上成年人，并不包含未成年人。",
    },
    {
      question: "养老金与退休储蓄如何输入？",
      answer:
        "若你已退休并领取年度养老金，请把它填到主收入框（税前）。若你有私人养老金账户、401k、Superannuation 等退休储蓄，请把当前总值填到「养老金账户余额」字段。公共养老金权益（如美国 Social Security、各国基本养老金）在 WID.world 财富数据中不被计入，因为它们不可转让或变现。",
    },
    {
      question: "数据来自哪里？",
      answer:
        "所有数据都通过一个开源脚本从公共 API 自动获取。财富份额、收入份额、平均/中位数财富、基尼系数来自 WID.world API。人口数据来自世界银行。汇率来自欧洲央行。亿万富豪净资产来自 Forbes 实时榜。税率数据是唯一的例外. 它来自学术论文与官方统计，由人工整理。",
    },
    {
      question: "为什么底部 50% 拥有那么少？",
      answer:
        "财富比收入集中得多。多数国家底部 50% 仅拥有总财富的 1%–5%。原因是财富会随时间通过资产升值（房产、股票）、继承与复利积累. 这些机制对已有资本的人格外有利。同时，很多人背负的债务等于或超过其资产，使其净资产为零或为负。",
    },
    {
      question: "「与亿万富豪对比」如何计算？",
      answer:
        "简单的除法：亿万富豪净资产 ÷ 你的年收入 = 你需要多少年（税前、不消费）才能挣到等额的钱。结果再换算为可感的单位. 年、生命跨度或历史时代. 让差距变得直观。",
    },
    {
      question: "财富不平等可以缩小吗？",
      answer:
        "经济学家与政策制定者提出了多种思路：累进所得税与资本利得税、遗产与房产税、普惠资产或储蓄计划、扩大教育与住房可及性、加强劳动保障等。每种方案都有取舍，效果高度依赖具体执行。本工具不主张任何特定政策. 目标是把数据呈现出来，让大家自行判断。",
    },
    {
      question: "这是理财建议吗？",
      answer:
        "不是。「我到底有多穷？」是一款用于可视化财富不平等的教育工具，不提供财务、税务或投资建议。个人理财决定请咨询有资质的顾问。",
    },
    {
      question: "数据多久更新一次？",
      answer:
        "全部数据在构建时从公共 API 抓取. 你使用工具时不会发生任何外部调用。脚本可随时重新运行以拉取 WID.world、世界银行、欧洲央行与 Forbes 的最新数据。学术数据库通常每年更新，因此数据多反映最新可用年份（按变量和国家在 2022–2024 之间）。",
    },
    {
      question: "「我到底有多穷？」是开源的吗？",
      answer:
        "是的。整个代码以 MIT 许可证开源。你可以审阅数据处理流程、提出改进、报告问题或自行部署。仓库地址：github.com/yrunhaar/howpoorami。",
    },
  ],
  relatedNav: {
    backToCalculator: "返回计算器",
    about: "关于",
    methodology: "方法说明",
  },
};

const ja: FaqContent = {
  h1: "よくある質問",
  intro: "ツールの仕組み、データの出どころ、その意味について必要なすべて。",
  items: [
    {
      question: "「私はどれだけ貧しい？」とは？",
      answer:
        "「私はどれだけ貧しい？」は、自国の資産分布のなかで自分がどこに立っているかを示す、無料・オープンソースのツールです。所得や純資産を入力すると、即座にあなたのパーセンタイル、全国中央値との比較、そして自国でいちばん裕福な人物に追いつくのに必要な年数が表示されます。",
    },
    {
      question: "資産パーセンタイルはどう計算される？",
      answer:
        "WID.world（世界格差データベース）の資産分布データに対して区分的線形補間を行って算出します。データには特定のパーセンタイル群（下位 50%、中間 40%、上位 10%、上位 1% など）の資産シェアが含まれており、その間を補間してあなたの純資産の位置を推定します。",
    },
    {
      question: "「純資産」とは？",
      answer:
        "総資産 − 総負債のことです。資産には住宅、投資、貯蓄、年金、その他の価値あるものが含まれます。負債には住宅ローン、学資ローン、自動車ローン、クレジットカード債務などが含まれます。結果（プラスでもマイナスでも）が分布上の位置を決めます。",
    },
    {
      question: "入力データは保存・送信される？",
      answer:
        "いいえ。すべてはブラウザ内で完結します。所得・資産・個人情報がサーバーに送られることはありません。Cookie もトラッキングも解析もありません。",
    },
    {
      question: "税引前と税引後、どちらを入力する？",
      answer:
        "税引前（額面）の所得を入力してください。WID.world のデータは税引前の国民所得. 給与、資本所得（配当・利息・賃料）、企業利益の帰属推定値. を、いかなる税や社会保障費の控除も行う前に集計したものです。手取りより通常 30〜50% 高くなります。手取りしかわからない場合は、税制に応じておおむね 1.3〜1.5 倍してください。",
    },
    {
      question: "所得から資産を推定する精度は？",
      answer:
        "あくまで近似です。所得を入力すると、年齢・持家・貯蓄率・負債など最大 18 の要因を組み合わせて推定し、不確実性を反映するレンジで表示します。最も正確に知りたい場合は純資産を直接入力してください。",
    },
    {
      question: "学歴で順位が変わるのはなぜ？",
      answer:
        "学歴は資産形成パターンの統計的な代理変数であり、価値の直接尺度ではありません。米国 SCF 等の研究では、同等の所得でも大卒以上の純資産は非大卒の 3〜4 倍になる傾向が一貫して観察されます。この相関は、貯蓄率・投資行動・キャリア軌跡・相続の可能性・企業年金へのアクセスなどの要因を反映しています。",
    },
    {
      question: "個人単位か世帯単位か？",
      answer:
        "WID.world は「成人 1 人あたり」の値で、夫婦は均等分割（equal-split）を採用. 各パートナーに世帯資産の半額を割り当てます。これは格差研究の標準アプローチです。入力時には「あなた個人」の取り分（共有家計なら通常半額）を入れてください。分母は 20 歳以上の成人で、未成年を含めた全人口ではありません。",
    },
    {
      question: "年金や退職資産はどう入力する？",
      answer:
        "年金を年単位で受け取っている場合は、メインの所得欄（税引前）に入力してください。私的年金、401k、Superannuation などの退職口座がある場合は、現在の合計残高を「年金口座 / 401k 残高」に入力してください。公的年金（Social Security、各国の基礎年金など）は譲渡・売却ができないため、WID.world の資産データからは除外されています。",
    },
    {
      question: "データはどこから？",
      answer:
        "すべてのデータは、単一のオープンソース・スクリプトが公開 API から取得します。資産シェア・所得シェア・平均/中央値資産・ジニ係数は WID.world API。人口は世界銀行 API。為替レートは欧州中央銀行。億万長者の純資産は Forbes リアルタイムリスト。税率データだけは例外で、学術論文と政府統計から手作業で整備しています。",
    },
    {
      question: "なぜ下位 50% の保有はこれほど少ない？",
      answer:
        "資産は所得よりはるかに集中しています。下位 50% の保有は多くの国で総資産の 1〜5% にとどまります。資産は資産価格の上昇（住宅・株式）、相続、複利によって時間とともに積み上がる仕組みで、すでに資本を持つ人ほど有利になります。一方で、多くの人は資産を相殺するか上回る負債を抱えています。",
    },
    {
      question: "億万長者比較はどう計算する？",
      answer:
        "単純な割り算です：億万長者の純資産 ÷ あなたの年収 ＝ 同額を稼ぐのに必要な年数（税引前・支出ゼロ）。結果は年・人生・歴史的な時代といった実感しやすい単位にも変換し、格差の規模を体感できるようにしています。",
    },
    {
      question: "資産格差は縮められる？",
      answer:
        "経済学者や政策立案者は様々な手段を提案してきました：累進所得税・キャピタルゲイン課税、相続税・資産課税、ベーシック・アセットや貯蓄プログラム、教育や住宅へのアクセス拡大、労働保護の強化。それぞれにトレードオフがあり、効果は実装次第で大きく変わります。このツールは特定の政策を推奨しません. 各自が判断できるようにデータを可視化することが目的です。",
    },
    {
      question: "これは投資・税務助言？",
      answer:
        "いいえ。「私はどれだけ貧しい？」は資産格差データを可視化する教育目的のツールで、財務・税務・投資の助言は提供しません。個別の判断には専門家にご相談ください。",
    },
    {
      question: "データはどのくらいの頻度で更新される？",
      answer:
        "データはすべてビルド時に公開 API から取得されます. 利用時に外部呼び出しは行いません。スクリプトは随時再実行でき、WID.world・世界銀行・ECB・Forbes から最新データを取り込めます。研究データベースは通常年単位で更新されるため、データは利用可能な最新年（変数と国により 2022〜2024）を反映します。",
    },
    {
      question: "「私はどれだけ貧しい？」はオープンソース？",
      answer:
        "はい。コードベース全体が MIT ライセンスで公開されています。データ処理の検証、改善提案、バグ報告、独自インスタンスの運用が可能です。リポジトリ：github.com/yrunhaar/howpoorami。",
    },
  ],
  relatedNav: {
    backToCalculator: "計算ツールに戻る",
    about: "概要",
    methodology: "手法",
  },
};

const pt: FaqContent = {
  h1: "Perguntas frequentes",
  intro:
    "Tudo o que você precisa saber sobre como a ferramenta funciona, de onde vêm os dados e o que eles significam.",
  items: [
    {
      question: "O que é Quão pobre eu sou?",
      answer:
        "Quão pobre eu sou? é uma ferramenta gratuita e de código aberto que mostra onde você está na distribuição da riqueza do seu país. Insira sua renda ou patrimônio líquido e veja imediatamente seu percentil, a comparação com a mediana nacional e quanto tempo levaria para igualar a pessoa mais rica do seu país.",
    },
    {
      question: "Como meu percentil de riqueza é calculado?",
      answer:
        "Seu percentil é calculado por interpolação linear por partes sobre os dados de distribuição de riqueza do WID.world. Os dados fornecem participações de riqueza para grupos de percentis específicos (50% inferior, 40% médio, 10% superior, 1% superior, etc.), e interpolamos entre esses pontos para estimar onde seu patrimônio líquido se encaixa.",
    },
    {
      question: "O que conta como patrimônio líquido?",
      answer:
        "Patrimônio líquido é o total dos seus ativos menos o total das suas dívidas. Ativos incluem imóveis, investimentos, poupança, previdência e outros bens. Dívidas incluem financiamentos imobiliários, empréstimos estudantis, financiamentos de veículos, dívida de cartão e demais passivos. O valor resultante. Positivo ou negativo. Determina sua posição na distribuição.",
    },
    {
      question: "Meus dados são guardados ou enviados a algum lugar?",
      answer:
        "Não. Tudo roda inteiramente no seu navegador. Sua renda, seu patrimônio e seus dados pessoais nunca são enviados a nenhum servidor. Sem cookies, sem scripts de rastreamento, sem analytics.",
    },
    {
      question: "Devo inserir renda bruta ou líquida?",
      answer:
        "Insira sua renda bruta (antes de impostos). Os dados do WID.world usam renda nacional bruta, que inclui salários, renda do capital (dividendos, juros, aluguéis) e lucros corporativos imputados. Antes de qualquer imposto ou contribuição social. Isso geralmente é 30-50% maior que o líquido. Se só souber sua renda líquida, multiplique por cerca de 1,3-1,5 dependendo do sistema fiscal do seu país.",
    },
    {
      question: "Quão precisa é a estimativa de renda para patrimônio?",
      answer:
        "É uma aproximação. Quando você insere renda em vez do patrimônio, a ferramenta usa até 18 fatores. Idade, posse de imóvel, taxa de poupança, dívida. Para estimar seu patrimônio provável. Uma faixa é exibida para refletir a incerteza. Para o resultado mais preciso, insira diretamente seu patrimônio líquido.",
    },
    {
      question: "Por que minha posição muda quando mudo meu nível de educação?",
      answer:
        "O nível de educação é um indicador estatístico de padrões de acumulação de riqueza, não uma medida direta de valor. Dados do SCF (EUA) e estudos similares mostram que graduados mantêm 3-4x o patrimônio de não graduados com renda equivalente. Essa correlação reflete fatores como taxa de poupança, comportamento de investimento, trajetória de carreira, probabilidade de herança e acesso a planos de aposentadoria patrocinados pelo empregador.",
    },
    {
      question: "É baseado em indivíduos ou domicílios?",
      answer:
        "Os dados do WID.world usam números por adulto com o método de divisão igual para casais. Cada parceiro recebe metade do patrimônio do domicílio. É a abordagem padrão na pesquisa de desigualdade. Ao informar seu patrimônio, insira a SUA parcela (geralmente metade se você compartilha finanças com o(a) parceiro(a)). O denominador populacional são adultos de 20+, não a população total com crianças.",
    },
    {
      question: "Como devo informar previdência e poupança para aposentadoria?",
      answer:
        "Se você recebe renda anual de aposentadoria, insira-a no campo principal de renda (bruto). Se tiver previdência privada, 401k, Superannuation ou outra conta de aposentadoria, insira o valor total atual no campo \"Previdência / saldo 401k\" no painel de refinamento. Direitos de previdência pública (Seguridade Social, INSS, etc.) ficam de fora dos dados de patrimônio do WID.world porque não são transferíveis nem vendáveis.",
    },
    {
      question: "De onde vêm os dados?",
      answer:
        "Todos os dados são obtidos programaticamente de APIs públicas por um único script open source. Participações de riqueza, participações de renda, riqueza média/mediana e coeficientes de Gini vêm da API do WID.world. População do Banco Mundial. Câmbio do Banco Central Europeu. Patrimônio dos bilionários da lista Forbes em tempo real. Dados de alíquotas tributárias são a exceção. São compilados manualmente a partir de artigos acadêmicos e estatísticas oficiais.",
    },
    {
      question: "Por que os 50% mais pobres têm tão pouco?",
      answer:
        "A riqueza é muito mais concentrada do que a renda. Na maioria dos países, os 50% inferiores detêm entre 1% e 5% da riqueza total. Isso ocorre porque a riqueza se acumula no tempo via valorização de ativos (imóveis, ações), herança e juros compostos. Mecanismos que beneficiam desproporcionalmente quem já tem capital. Ao mesmo tempo, muitas pessoas carregam dívidas que igualam ou superam seus ativos.",
    },
    {
      question: "Como a comparação com bilionário é calculada?",
      answer:
        "É uma divisão simples: o patrimônio do bilionário dividido pela sua renda anual dá o número de anos para você ganhar a mesma quantia (sem impostos, sem gastos). O resultado é então traduzido em unidades palpáveis. Anos, vidas ou eras históricas. Para tornar tangível a magnitude do abismo.",
    },
    {
      question: "Dá para reduzir a desigualdade de riqueza?",
      answer:
        "Economistas e formuladores de políticas propuseram várias abordagens: tributação progressiva sobre renda e ganhos de capital, impostos sobre herança e patrimônio, programas universais de ativos ou poupança, ampliação do acesso a educação e moradia, e proteções trabalhistas mais fortes. Cada abordagem tem trade-offs e o resultado depende muito da implementação. Esta ferramenta não defende uma política específica. Ela visa tornar os dados visíveis para que as pessoas formem suas próprias opiniões.",
    },
    {
      question: "Isto é aconselhamento financeiro?",
      answer:
        "Não. Quão pobre eu sou? é uma ferramenta educativa para visualizar dados de desigualdade de riqueza. Ela não fornece aconselhamento financeiro, tributário ou de investimento. Para decisões financeiras pessoais, consulte um(a) profissional qualificado(a).",
    },
    {
      question: "Com que frequência os dados são atualizados?",
      answer:
        "Todos os dados são obtidos em tempo de build a partir de APIs públicas. Nenhuma chamada externa é feita quando você usa a ferramenta. O script de busca pode ser executado a qualquer momento para puxar os dados mais recentes do WID.world, Banco Mundial, BCE e Forbes. Na prática, as bases de pesquisa são atualizadas anualmente, então os dados refletem normalmente o ano mais recente disponível por país (2022-2024 dependendo da variável).",
    },
    {
      question: "Quão pobre eu sou? é open source?",
      answer:
        "Sim. Todo o código é open source sob a Licença MIT. Você pode inspecionar o pipeline de processamento de dados, sugerir melhorias, reportar bugs ou rodar sua própria instância. O repositório está disponível no GitHub: github.com/yrunhaar/howpoorami.",
    },
  ],
  relatedNav: {
    backToCalculator: "Voltar à calculadora",
    about: "Sobre",
    methodology: "Metodologia",
  },
};

const it: FaqContent = {
  h1: "Domande frequenti",
  intro:
    "Tutto quello che ti serve sapere su come funziona lo strumento, da dove vengono i dati e cosa significano.",
  items: [
    {
      question: "Cos'è Quanto sono povero?",
      answer:
        "Quanto sono povero? è uno strumento gratuito e open source che mostra dove ti collochi nella distribuzione della ricchezza del tuo paese. Inserisci reddito o patrimonio netto e vedi all'istante il tuo percentile, il confronto con la mediana nazionale e quanto tempo ti servirebbe per raggiungere la persona più ricca del tuo paese.",
    },
    {
      question: "Come viene calcolato il mio percentile di ricchezza?",
      answer:
        "Il percentile è calcolato con interpolazione lineare a tratti sui dati di distribuzione della ricchezza di WID.world. I dati forniscono le quote di ricchezza per gruppi di percentili specifici (50% inferiore, 40% medio, 10% superiore, 1% superiore, ecc.) e interpoliamo tra questi punti per stimare dove si colloca il tuo patrimonio netto.",
    },
    {
      question: "Cos'è il patrimonio netto?",
      answer:
        "Il patrimonio netto è il totale dei tuoi attivi meno il totale dei tuoi debiti. Gli attivi includono immobili, investimenti, risparmi, pensioni e altri beni. I debiti includono mutui, prestiti studenteschi, prestiti auto, debiti di carte di credito e altre passività. La cifra risultante. Positiva o negativa. Determina la tua posizione nella distribuzione.",
    },
    {
      question: "I miei dati vengono salvati o inviati altrove?",
      answer:
        "No. Tutto avviene nel tuo browser. Reddito, patrimonio e dati personali non vengono mai inviati ad alcun server. Niente cookie, niente script di tracciamento, niente analytics.",
    },
    {
      question: "Devo inserire il reddito lordo o netto?",
      answer:
        "Inserisci il reddito lordo (prima delle tasse). I dati di WID.world usano il reddito nazionale lordo, che include stipendi, redditi di capitale (dividendi, interessi, affitti) e profitti d'impresa imputati. Al lordo di tasse o contributi sociali. Di solito è il 30-50% più alto del netto. Se conosci solo il netto, moltiplica per circa 1,3-1,5 in base al sistema fiscale del tuo paese.",
    },
    {
      question: "Quanto è precisa la stima reddito → patrimonio?",
      answer:
        "È un'approssimazione. Quando inserisci il reddito invece del patrimonio, lo strumento usa fino a 18 fattori. Età, possesso casa, tasso di risparmio, debiti. Per stimare il tuo patrimonio probabile. Viene mostrata una fascia per riflettere l'incertezza. Per il risultato più preciso, inserisci direttamente il patrimonio netto.",
    },
    {
      question: "Perché il livello di studi cambia la mia posizione?",
      answer:
        "Il titolo di studio è una variabile statistica per i modelli di accumulazione di ricchezza, non una misura diretta del valore. I dati SCF (USA) e studi analoghi mostrano che i laureati hanno 3-4 volte il patrimonio dei non laureati a parità di reddito. Questa correlazione riflette tasso di risparmio, comportamento d'investimento, traiettoria di carriera, probabilità di eredità e accesso a piani pensionistici aziendali. Non l'istruzione in sé.",
    },
    {
      question: "È per individui o per famiglie?",
      answer:
        "I dati WID.world sono per adulto con metodo di divisione equa per le coppie. Ogni partner riceve la metà del patrimonio del nucleo. È l'approccio standard nella ricerca sulla disuguaglianza. Inserisci la TUA quota personale (di solito la metà se condividi le finanze con il/la partner). Il denominatore di popolazione sono gli adulti dai 20 anni in su.",
    },
    {
      question: "Come inserisco pensioni e risparmi previdenziali?",
      answer:
        "Se ricevi una pensione annuale, inseriscila nel campo principale del reddito (lordo). Se hai un fondo pensione privato, 401k, Superannuation o un altro conto previdenziale, inserisci il suo valore totale attuale nel campo \"Fondo pensione / saldo 401k\" del pannello di affinamento. Le pensioni pubbliche (Social Security, pensioni statali) sono escluse dai dati di ricchezza di WID.world perché non sono trasferibili o vendibili.",
    },
    {
      question: "Da dove vengono i dati?",
      answer:
        "Tutti i dati sono recuperati programmaticamente da API pubbliche tramite un unico script open source. Quote di ricchezza, quote di reddito, ricchezza media/mediana e coefficienti di Gini provengono dall'API di WID.world. Popolazione dalla Banca Mondiale. Tassi di cambio dalla Banca Centrale Europea. Patrimoni dei miliardari dalla lista Forbes in tempo reale. I dati sulle aliquote fiscali sono l'unica eccezione. Sono compilati manualmente da articoli accademici e statistiche fiscali ufficiali.",
    },
    {
      question: "Perché il 50% più povero possiede così poco?",
      answer:
        "La ricchezza è molto più concentrata del reddito. Il 50% inferiore nella maggior parte dei paesi detiene tra l'1% e il 5% della ricchezza totale. La ricchezza si accumula nel tempo tramite rivalutazione degli attivi (immobili, azioni), eredità e rendimenti composti. Meccanismi che premiano in modo sproporzionato chi ha già capitale. Allo stesso tempo, molte persone hanno debiti che pareggiano o superano i loro attivi.",
    },
    {
      question: "Come si calcola il confronto con un miliardario?",
      answer:
        "Una semplice divisione: patrimonio del miliardario ÷ tuo reddito annuale = anni che ti servirebbero per guadagnare lo stesso (al lordo, senza spese). Il risultato è poi tradotto in unità tangibili. Anni, vite, ere storiche. Per rendere palpabile la dimensione del divario.",
    },
    {
      question: "Si può ridurre la disuguaglianza di ricchezza?",
      answer:
        "Economisti e decisori politici hanno proposto diversi approcci: imposte progressive su reddito e plusvalenze, imposte di successione e patrimoniali, programmi universali di attivi o risparmio, accesso ampliato a istruzione e casa, tutele del lavoro più forti. Ogni approccio ha trade-off e i risultati dipendono molto dall'attuazione. Questo strumento non promuove alcuna politica. Il suo scopo è rendere visibili i dati perché ognuno si formi un'opinione.",
    },
    {
      question: "È un consiglio finanziario?",
      answer:
        "No. Quanto sono povero? è uno strumento educativo per visualizzare i dati sulla disuguaglianza. Non fornisce consulenza finanziaria, fiscale o di investimento. Per decisioni personali rivolgiti a un consulente qualificato.",
    },
    {
      question: "Con quale frequenza vengono aggiornati i dati?",
      answer:
        "Tutti i dati sono recuperati al build da API pubbliche. Nessuna chiamata esterna avviene durante l'uso. Lo script di fetch può essere rieseguito in qualsiasi momento per portare i dati più recenti di WID.world, Banca Mondiale, BCE e Forbes. In pratica, le basi di ricerca si aggiornano annualmente, quindi i dati riflettono di solito l'anno più recente disponibile per ogni paese (2022-2024 a seconda della variabile).",
    },
    {
      question: "Quanto sono povero? è open source?",
      answer:
        "Sì. L'intera base di codice è open source con licenza MIT. Puoi ispezionare la pipeline di trattamento dati, suggerire miglioramenti, segnalare bug o avviare un'istanza personale. Il repository è su GitHub: github.com/yrunhaar/howpoorami.",
    },
  ],
  relatedNav: {
    backToCalculator: "Torna al calcolatore",
    about: "Informazioni",
    methodology: "Metodologia",
  },
};

const FAQ: Readonly<Record<LocaleCode, FaqContent>> = {
  en,
  es,
  de,
  fr,
  "zh-cn": zhCn,
  ja,
  pt,
  it,
};

export function getFaqContent(locale: LocaleCode): FaqContent {
  return FAQ[locale] ?? FAQ.en;
}
