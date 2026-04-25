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
  },
  footer: {
    about: "Sobre",
    faq: "Perguntas frequentes",
    methodology: "Metodologia",
    github: "GitHub",
    buildDateTemplate: "Dados de {date}",
  },
};
