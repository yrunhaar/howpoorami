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
  },
  footer: {
    about: "Acerca de",
    faq: "Preguntas frecuentes",
    methodology: "Metodología",
    github: "GitHub",
    buildDateTemplate: "Datos del {date}",
  },
};
