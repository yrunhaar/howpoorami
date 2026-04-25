import type { Dictionary } from "../dictionary";

export const es: Dictionary = {
  meta: {
    siteName: "¿Qué tan pobre soy?",
    homeTitle:
      "¿Qué tan pobre soy? — Descubre dónde estás en la riqueza global",
    homeDescription:
      "Descubre dónde te encuentras realmente en la distribución de la riqueza. Introduce tus ingresos o patrimonio neto y compara tu situación con los más ricos — y los más pobres — de tu país. Gráficos interactivos para más de 30 países.",
    homeOgTitle: "¿Qué tan pobre soy? — Descubre dónde estás",
    homeOgDescription:
      "¿Te crees clase media? Introduce tus ingresos y descubre dónde estás realmente en la distribución de la riqueza. Datos interactivos para más de 30 países.",
    countryTitleTemplate:
      "¿Qué tan pobre soy en {country}? — Distribución de la riqueza y desigualdad",
    countryDescriptionTemplate:
      "Descubre dónde estás en la distribución de la riqueza de {country}. Compara tus ingresos y patrimonio con el 1% más rico, el 10% superior y el 50% inferior. Gráficos interactivos con datos de WID.world y la OCDE.",
    countryOgTitleTemplate: "¿Qué tan pobre soy en {country}?",
    countryOgDescriptionTemplate:
      "Introduce tus ingresos y descubre dónde estás realmente en la distribución de la riqueza de {country}. Datos interactivos sobre desigualdad con WID.world.",

    compareTitle:
      "¿Cuánto tiempo para igualar a un millonario? — Salario vs. megafortuna",
    compareDescription:
      "¿Cuántos años, vidas o eras enteras tardarías en ganar tanto como un millonario? Introduce tu salario y pon en perspectiva la megafortuna.",
    compareCountryTitleTemplate:
      "¿Cuánto se tarda en igualar al más rico de {country}? — Comparación con millonarios",
    compareCountryDescriptionTemplate:
      "¿Cuántos años tardarías en ganar tanto como la persona más rica de {country}?{richestSuffix} Introduce tu salario y averígualo.",

    compareCountriesTitle:
      "Compara tu riqueza entre 30 países — Calculadora de riqueza por país",
    compareCountriesDescription:
      "¿Cómo se clasificaría tu riqueza o ingreso en otro país? Introduce una cantidad y mira tu percentil en más de 30 países en paralelo.",

    aboutTitle: "Acerca de — ¿Qué tan pobre soy?",
    aboutDescription:
      "¿Qué tan pobre soy? es una herramienta gratuita y de código abierto que visualiza la desigualdad de la riqueza global con datos de WID.world, OCDE y SWIID.",
    faqTitle: "Preguntas frecuentes — ¿Qué tan pobre soy?",
    faqDescription:
      "Preguntas frecuentes sobre ¿Qué tan pobre soy?: los datos, los cálculos y lo que los percentiles significan realmente.",
    methodologyTitle: "Metodología — ¿Qué tan pobre soy?",
    methodologyDescription:
      "Dentro de la metodología de ¿Qué tan pobre soy?: fuentes de datos, estimación de percentiles, ajuste por edad y conversión PPA.",
  },
  nav: {
    home: "¿Qué tan pobre soy?",
    howLong: "¿Cuánto tiempo?",
    compareCountries: "Comparar",
    languageSwitchAria: "Cambiar idioma",
    themeToggleAria: "Alternar modo claro / oscuro",
  },
  home: {
    h1: "¿Qué tan pobre soy?",
    heroSubtitle:
      "Introduce tus ingresos o patrimonio y descubre dónde estás realmente.",
    scrollToExplore: "Desplázate para ver más",
    distributionTitle: "{flag} {country} — Distribución de la riqueza",
    distributionSubtitle:
      "Reparto de la riqueza por grupos de población (2023)",
    populationVsWealth: "Población vs. riqueza — {country}",
    scaleOfConcentrationH2: "La escala de la concentración",
    scaleOfConcentrationLead:
      "Cada rectángulo representa riqueza. El área muestra cuánto posee realmente cada grupo. Mira quién tiene qué.",
    statisticsH2: "Las cifras que definen la desigualdad",
    whoActuallyPaysH2: "¿Quién paga realmente?",
    whoActuallyPaysLead:
      "Los tipos impositivos efectivos cuentan otra historia que los nominales. Si se incluyen todos los impuestos realmente pagados — incluido cómo se trata la renta del capital, las plusvalías y las estructuras corporativas — el sistema suele volverse regresivo en la cúspide.",
    centuryOfChangeH2: "Un siglo de cambios",
    centuryOfChangeLead:
      "Cómo ha evolucionado la concentración de la riqueza en {country} — y qué decisiones políticas impulsaron cada cambio.",
    wagesKeepingUpH2: "¿Los salarios mantienen el ritmo?",
    wagesKeepingUpLead:
      "Salarios, precios al consumo y precios de la vivienda — todo indexado al año 2000. Cuando las líneas se separan, alguien se queda atrás.",
    seeBillionaireCta:
      "Mira cuánto tardarías en ganar tanto como la persona más rica de {country}",
    compareAcrossCountriesCta:
      "¿Cómo se clasificaría tu riqueza en otro país?",
    attribution:
      "Datos de WID.world, OCDE y SWIID. Proyecto de código abierto con fines educativos.",
  },
  input: {
    modeWealth: "Patrimonio neto",
    modeIncome: "Ingresos anuales",
    incomeLabelTemplate:
      "Introduce tus ingresos brutos (antes de impuestos) anuales en {currency}",
    wealthLabelTemplate: "Introduce tu patrimonio neto en {currency}",
    incomeHint:
      "Brutos incluye salarios, rentas del capital y pensiones antes de impuestos.",
    wealthHint:
      "Introduce TU parte personal — si compartes finanzas con tu pareja, introduce la mitad.",
    ageOptional: "Tu edad (opcional):",
    agePlaceholder: "p. ej. 30",
    knowYourAssets:
      "¿Conoces tus activos? Añade vivienda, inversiones y más para afinar la estimación",
    estimatedNetWealth: "Patrimonio neto estimado:",
    resultWealthTemplate: "En {country}, tienes más riqueza que",
    resultIncomeTemplate:
      "En {country}, según el patrimonio estimado a partir de tus ingresos, te sitúas por encima del",
    ofThePopulation: "de la población",
    inTheTop1: "Estás en el 1% más rico",
    belowTheMedian: "Por debajo del patrimonio mediano de {amount}",
    privacyNote:
      "Tus datos permanecen en tu navegador. No se guardan ni se envían a ningún sitio.",
    incomeConvertedNote:
      "Los ingresos se convierten en un rango estimado de patrimonio. Para resultados exactos, usa el modo «Patrimonio neto».",
  },
  share: {
    label: "Compartir:",
    nativeShareButton: "Compartir…",
    nativeShareAria: "Compartir con la opción del sistema",
    twitter: "X / Twitter",
    whatsapp: "WhatsApp",
    copyLink: "Copiar enlace",
    copied: "¡Copiado!",
    copyFailed: "Error al copiar",
    shareTextTemplate:
      "Tengo más riqueza que el {percentile} de la población en {country}. ¿Y tú?",
  },
  stats: {
    title: "Las cifras que definen la desigualdad",
    top1OwnsTemplate: "El 1% más rico de {country} posee",
    top1OwnsSublabel: "de la riqueza nacional total",
    bottom50Owns: "El 50% más pobre posee",
    bottom50OwnsSublabel: "de la riqueza nacional total",
    giniLabel: "Coeficiente de Gini de riqueza",
    giniSublabel: "0 = igualdad perfecta, 1 = una persona lo posee todo",
    meanWealthLabel: "Riqueza media por adulto",
    meanWealthSublabel: "Sesgada al alza por los más ricos",
    medianWealthLabel: "Riqueza mediana por adulto",
    medianWealthSublabel: "Lo que tiene realmente la persona típica",
    meanMedianRatioLabel: "Ratio media / mediana",
    meanMedianRatioSublabel: "Más alto = distribución más sesgada",
    togglePppOff: "Mostrar poder adquisitivo (PPA)",
    togglePppOn: "Mostrando poder adquisitivo",
    pppSublabelTemplate: "PPA: ~{value}K $ de poder adquisitivo",
    regionalContextTitleTemplate: "{country} en contexto regional",
    regionalAggregatesNote:
      "Los agregados regionales son medias ponderadas por población de los países cubiertos.",
    thisCountryRegion: "Región de {country}",

    thresholdsTitle: "¿Qué hace falta para entrar en cada grupo?",
    thresholdsLeadTemplate:
      "Patrimonio neto mínimo estimado para entrar en cada tramo de riqueza en {country}.",
    thresholdsNote:
      "Los umbrales son estimaciones basadas en datos de WID.world interpolados con Pareto.",
    thresholdTop50: "Top 50%",
    thresholdTop10: "Top 10%",
    thresholdTop1: "Top 1%",
    thresholdTop01: "Top 0,1%",

    impactLeadTemplate:
      "Una persona con ingresos medianos en {country} tendría que trabajar durante",
    impactYears: "años",
    impactTrailing: "para acumular el patrimonio medio del 1% más rico",
    impactNoteTemplate:
      "Basado en un ingreso nacional mediano antes de impuestos de {income}/año frente a un patrimonio medio del 1% más rico de {wealth}",

    doubleGapTitle: "Ingresos vs. riqueza: la doble brecha",
    incomeDistributionTitle: "Distribución del ingreso",
    wealthDistributionTitle: "Distribución de la riqueza",
    giniIncomeLineTemplate: "Gini (ingreso): {value}",
    giniWealthLineTemplate: "Gini (riqueza): {value}",
    barLabelTop1: "Top 1%",
    barLabelTop10: "Top 10%",
    barLabelMiddle40: "40% medio",
    barLabelBottom50: "50% inferior",

    globalPictureTitle: "El panorama global",
    globalTop1Owns: "El 1% global más rico posee",
    globalTop1OwnsSublabel: "de toda la riqueza global",
    globalBottom50Owns: "El 50% global más pobre posee",
    globalBottom50OwnsSublabel: "de toda la riqueza global",
    globalGiniLabel: "Gini de riqueza global",
    globalGiniSublabel: "Entre los más altos de cualquier métrica medida",
    sourceTemplate: "Fuente: {source}",

    medianWealthUsdLabel: "patrimonio mediano (USD)",
    regionTop1Template: "Top 1%: {value}%",
    regionBottom50Template: "50% inf.: {value}%",
  },
  footer: {
    about: "Acerca de",
    faq: "Preguntas frecuentes",
    methodology: "Metodología",
    github: "GitHub",
    buildDateTemplate: "Datos del {date}",
  },
};
