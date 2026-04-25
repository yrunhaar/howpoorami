import type { Dictionary } from "../dictionary";

export const pt: Dictionary = {
  meta: {
    siteName: "Quão pobre eu sou?",
    homeTitle:
      "Quão pobre eu sou? — Veja onde você está na riqueza global",
    homeDescription:
      "Descubra onde você realmente está na distribuição da riqueza. Insira sua renda ou patrimônio líquido e compare-se com as pessoas mais ricas — e mais pobres — do seu país. Gráficos interativos para mais de 30 países.",
    homeOgTitle: "Quão pobre eu sou? — Veja onde você está",
    homeOgDescription:
      "Acha que é classe média? Insira sua renda e descubra onde realmente está na distribuição da riqueza. Dados interativos para mais de 30 países.",
    countryTitleTemplate:
      "Quão pobre eu sou em {country}? — Distribuição da riqueza e desigualdade",
    countryDescriptionTemplate:
      "Veja onde você está na distribuição da riqueza em {country}. Compare sua renda e patrimônio com o 1% mais rico, os 10% do topo e os 50% da base. Gráficos interativos com dados do WID.world e da OCDE.",
    countryOgTitleTemplate: "Quão pobre eu sou em {country}?",
    countryOgDescriptionTemplate:
      "Insira sua renda e descubra onde realmente está na distribuição da riqueza em {country}. Dados interativos sobre desigualdade, com base em WID.world.",

    compareTitle:
      "Quanto tempo para igualar um bilionário? — Salário vs. megafortuna",
    compareDescription:
      "Quantos anos, vidas ou eras inteiras você levaria para ganhar tanto quanto um bilionário? Insira seu salário e coloque a megafortuna em perspectiva.",
    compareCountryTitleTemplate:
      "Quanto tempo para igualar a pessoa mais rica de {country}? — Comparação com bilionário",
    compareCountryDescriptionTemplate:
      "Quantos anos você levaria para ganhar tanto quanto a pessoa mais rica de {country}?{richestSuffix} Insira seu salário e descubra.",

    compareCountriesTitle:
      "Compare sua riqueza em 30 países — Calculadora de riqueza por país",
    compareCountriesDescription:
      "Como sua renda ou patrimônio se classificaria em outro país? Insira um valor e veja seu percentil em mais de 30 países lado a lado.",

    aboutTitle: "Sobre — Quão pobre eu sou?",
    aboutDescription:
      "Quão pobre eu sou? é uma ferramenta gratuita e de código aberto que visualiza a desigualdade global da riqueza com dados de WID.world, OCDE e SWIID.",
    faqTitle: "Perguntas frequentes — Quão pobre eu sou?",
    faqDescription:
      "Perguntas frequentes sobre Quão pobre eu sou?: os dados, os cálculos e o que os percentis realmente significam.",
    methodologyTitle: "Metodologia — Quão pobre eu sou?",
    methodologyDescription:
      "Por dentro da metodologia de Quão pobre eu sou?: fontes de dados, estimativa de percentis, ajuste por idade e conversão PPC.",
  },
  nav: {
    home: "Quão pobre eu sou?",
    howLong: "Quanto tempo?",
    compareCountries: "Comparar",
    languageSwitchAria: "Alterar idioma",
    themeToggleAria: "Alternar modo claro / escuro",
  },
  home: {
    h1: "Quão pobre eu sou?",
    heroSubtitle:
      "Insira sua renda ou patrimônio e descubra onde realmente está.",
    scrollToExplore: "Role para ver mais",
    distributionTitle: "{flag} {country} — Distribuição da riqueza",
    distributionSubtitle:
      "Participação na riqueza por grupo populacional (2023)",
    populationVsWealth: "População vs. riqueza — {country}",
    scaleOfConcentrationH2: "A escala da concentração",
    scaleOfConcentrationLead:
      "Cada retângulo abaixo representa riqueza. A área mostra quanto cada grupo realmente possui. Veja quem tem o quê.",
    statisticsH2: "Os números que definem a desigualdade",
    whoActuallyPaysH2: "Quem realmente paga?",
    whoActuallyPaysLead:
      "Alíquotas efetivas contam uma história diferente das alíquotas nominais. Quando se levam em conta todos os impostos efetivamente pagos — incluindo a tributação de rendimentos de capital, ganhos de capital e estruturas societárias — o sistema costuma se tornar regressivo no topo.",
    centuryOfChangeH2: "Um século de mudanças",
    centuryOfChangeLead:
      "Como a concentração de riqueza em {country} evoluiu — e quais escolhas políticas conduziram cada virada.",
    wagesKeepingUpH2: "Os salários estão acompanhando?",
    wagesKeepingUpLead:
      "Salários, preços ao consumidor e preços de imóveis — todos indexados ao ano 2000. Quando as curvas divergem, alguém está ficando para trás.",
    seeBillionaireCta:
      "Veja quanto tempo levaria para você ganhar tanto quanto a pessoa mais rica de {country}",
    compareAcrossCountriesCta:
      "Como sua riqueza se classificaria em outro país?",
    attribution:
      "Dados de WID.world, OCDE e SWIID. Projeto de código aberto para fins educativos.",
  },
  input: {
    modeWealth: "Patrimônio líquido",
    modeIncome: "Renda anual",
    incomeLabelTemplate:
      "Insira sua renda anual bruta (antes dos impostos) em {currency}",
    wealthLabelTemplate: "Insira seu patrimônio líquido em {currency}",
    incomeHint:
      "Bruto inclui salários, rendimentos de capital e pensões antes dos impostos.",
    wealthHint:
      "Insira a SUA parte pessoal — se compartilha as finanças com seu/sua parceiro(a), informe a metade.",
    ageOptional: "Sua idade (opcional):",
    agePlaceholder: "ex.: 30",
    knowYourAssets:
      "Conhece seus ativos? Adicione imóveis, investimentos e mais para uma estimativa mais precisa",
    estimatedNetWealth: "Patrimônio líquido estimado:",
    resultWealthTemplate: "Em {country}, você é mais rico(a) do que",
    resultIncomeTemplate:
      "Em {country}, com base no patrimônio estimado a partir da sua renda, você está acima de",
    ofThePopulation: "da população",
    inTheTop1: "Você está no 1% mais rico",
    belowTheMedian: "Abaixo da mediana de patrimônio de {amount}",
    privacyNote:
      "Seus dados ficam no seu navegador. Nada é armazenado nem enviado.",
    incomeConvertedNote:
      "A renda é convertida em uma faixa estimada de patrimônio. Para resultados exatos, use o modo «Patrimônio líquido».",
  },
  share: {
    label: "Compartilhar:",
    nativeShareButton: "Compartilhar…",
    nativeShareAria: "Compartilhar pelo menu do sistema",
    twitter: "X / Twitter",
    whatsapp: "WhatsApp",
    copyLink: "Copiar link",
    copied: "Copiado!",
    copyFailed: "Falha ao copiar",
    shareTextTemplate:
      "Sou mais rico(a) que {percentile} da população em {country}. E você?",
  },
  stats: {
    title: "Os números que definem a desigualdade",
    top1OwnsTemplate: "O 1% mais rico em {country} possui",
    top1OwnsSublabel: "da riqueza nacional total",
    bottom50Owns: "Os 50% mais pobres possuem",
    bottom50OwnsSublabel: "da riqueza nacional total",
    giniLabel: "Coeficiente de Gini da riqueza",
    giniSublabel: "0 = igualdade perfeita, 1 = uma pessoa detém tudo",
    meanWealthLabel: "Patrimônio médio por adulto",
    meanWealthSublabel: "Puxado para cima pelos super-ricos",
    medianWealthLabel: "Patrimônio mediano por adulto",
    medianWealthSublabel:
      "O que a pessoa típica realmente possui",
    meanMedianRatioLabel: "Razão média / mediana",
    meanMedianRatioSublabel: "Maior = distribuição mais enviesada",
    togglePppOff: "Mostrar poder de compra (PPC)",
    togglePppOn: "Mostrando poder de compra",
    pppSublabelTemplate: "PPC: ~{value}K USD de poder de compra",
    regionalContextTitleTemplate: "{country} no contexto regional",
    regionalAggregatesNote:
      "Agregados regionais são médias ponderadas pela população dos países cobertos.",
    thisCountryRegion: "Região de {country}",

    thresholdsTitle: "Quanto é preciso para entrar em cada grupo?",
    thresholdsLeadTemplate:
      "Patrimônio líquido mínimo estimado para entrar em cada faixa de riqueza em {country}.",
    thresholdsNote:
      "Os limites são estimativas baseadas em dados do WID.world interpolados por Pareto.",
    thresholdTop50: "Top 50%",
    thresholdTop10: "Top 10%",
    thresholdTop1: "Top 1%",
    thresholdTop01: "Top 0,1%",

    impactLeadTemplate:
      "Quem ganha a renda mediana em {country} precisaria trabalhar por",
    impactYears: "anos",
    impactTrailing: "para acumular o patrimônio médio do 1% mais rico",
    impactNoteTemplate:
      "Com base na renda nacional bruta mediana de {income}/ano vs. patrimônio médio do 1% mais rico de {wealth}",

    doubleGapTitle: "Renda vs. patrimônio: a dupla distância",
    incomeDistributionTitle: "Distribuição da renda",
    wealthDistributionTitle: "Distribuição do patrimônio",
    giniIncomeLineTemplate: "Gini (renda): {value}",
    giniWealthLineTemplate: "Gini (patrimônio): {value}",
    barLabelTop1: "Top 1%",
    barLabelTop10: "Top 10%",
    barLabelMiddle40: "40% do meio",
    barLabelBottom50: "50% mais pobres",

    globalPictureTitle: "O panorama global",
    globalTop1Owns: "O 1% global mais rico possui",
    globalTop1OwnsSublabel: "de toda a riqueza global",
    globalBottom50Owns: "Os 50% globais mais pobres possuem",
    globalBottom50OwnsSublabel: "de toda a riqueza global",
    globalGiniLabel: "Gini global de riqueza",
    globalGiniSublabel: "Entre os mais altos de qualquer métrica medida",
    sourceTemplate: "Fonte: {source}",

    medianWealthUsdLabel: "patrimônio mediano (USD)",
    regionTop1Template: "Top 1%: {value}%",
    regionBottom50Template: "50% inf.: {value}%",
  },
  footer: {
    about: "Sobre",
    faq: "Perguntas frequentes",
    methodology: "Metodologia",
    github: "GitHub",
    buildDateTemplate: "Dados de {date}",
  },
};
