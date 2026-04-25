import type { Dictionary } from "../dictionary";

export const fr: Dictionary = {
  meta: {
    siteName: "À quel point suis-je pauvre ?",
    homeTitle:
      "À quel point suis-je pauvre ? — Voyez où vous vous situez dans la richesse mondiale",
    homeDescription:
      "Découvrez où vous vous situez réellement dans la distribution de la richesse. Saisissez votre revenu ou votre patrimoine net et comparez-vous aux personnes les plus riches — et les plus pauvres — de votre pays. Graphiques interactifs pour plus de 30 pays.",
    homeOgTitle: "À quel point suis-je pauvre ? — Voyez où vous vous situez",
    homeOgDescription:
      "Vous vous croyez de la classe moyenne ? Saisissez votre revenu et découvrez votre place réelle dans la distribution de la richesse. Données interactives pour plus de 30 pays.",
    countryTitleTemplate:
      "À quel point suis-je pauvre en {country} ? — Distribution de la richesse et inégalités",
    countryDescriptionTemplate:
      "Voyez où vous vous situez dans la distribution de la richesse en {country}. Comparez votre revenu et votre patrimoine au 1 % le plus riche, aux 10 % du haut et aux 50 % du bas. Graphiques interactifs avec des données de WID.world et de l'OCDE.",
    countryOgTitleTemplate: "À quel point suis-je pauvre en {country} ?",
    countryOgDescriptionTemplate:
      "Saisissez votre revenu et découvrez votre place réelle dans la distribution de la richesse en {country}. Données interactives sur les inégalités, basées sur WID.world.",

    compareTitle:
      "Combien de temps pour égaler un milliardaire ? — Salaire vs. méga-fortune",
    compareDescription:
      "Combien d'années, de vies ou d'époques entières faudrait-il pour gagner autant qu'un milliardaire ? Saisissez votre salaire et mettez les méga-fortunes en perspective.",
    compareCountryTitleTemplate:
      "Combien de temps pour égaler la personne la plus riche de {country} ? — Comparaison avec un milliardaire",
    compareCountryDescriptionTemplate:
      "Combien d'années vous faudrait-il pour gagner autant que la personne la plus riche de {country} ?{richestSuffix} Saisissez votre salaire et découvrez-le.",

    compareCountriesTitle:
      "Comparez votre richesse dans 30 pays — Calculateur multinational de richesse",
    compareCountriesDescription:
      "Comment votre richesse ou votre revenu se classerait-il dans un autre pays ? Saisissez un montant et voyez votre centile dans plus de 30 pays côte à côte.",

    aboutTitle: "À propos — À quel point suis-je pauvre ?",
    aboutDescription:
      "À quel point suis-je pauvre ? est un outil gratuit et open source qui visualise les inégalités de richesse mondiales à partir des données de WID.world, l'OCDE et SWIID.",
    faqTitle: "FAQ — À quel point suis-je pauvre ?",
    faqDescription:
      "Foire aux questions sur À quel point suis-je pauvre ? — les données, les calculs et le sens réel des centiles.",
    methodologyTitle: "Méthodologie — À quel point suis-je pauvre ?",
    methodologyDescription:
      "Au cœur de la méthodologie d'À quel point suis-je pauvre ? : sources de données, estimation des centiles, ajustement par âge et conversion PPA.",
  },
  nav: {
    home: "À quel point suis-je pauvre ?",
    howLong: "Combien de temps ?",
    compareCountries: "Comparer",
    languageSwitchAria: "Changer de langue",
    themeToggleAria: "Basculer le mode clair / sombre",
  },
  home: {
    h1: "À quel point suis-je pauvre ?",
    heroSubtitle:
      "Saisissez votre revenu ou votre patrimoine et découvrez votre place réelle.",
    scrollToExplore: "Faites défiler pour en voir plus",
    distributionTitle: "{flag} {country} — Distribution de la richesse",
    distributionSubtitle:
      "Part de richesse par groupe de population (2023)",
    populationVsWealth: "Population vs richesse — {country}",
    scaleOfConcentrationH2: "L'échelle de la concentration",
    scaleOfConcentrationLead:
      "Chaque rectangle représente la richesse. La surface montre ce que possède réellement chaque groupe. Voyez qui détient quoi.",
    statisticsH2: "Les chiffres qui définissent l'inégalité",
    whoActuallyPaysH2: "Qui paie vraiment ?",
    whoActuallyPaysLead:
      "Les taux d'imposition effectifs racontent une autre histoire que les taux nominaux. En tenant compte de tous les impôts réellement payés — y compris la fiscalité des revenus du capital, des plus-values et des structures d'entreprise — le système devient souvent régressif tout en haut.",
    centuryOfChangeH2: "Un siècle de changements",
    centuryOfChangeLead:
      "Comment la concentration de la richesse en {country} a évolué — et quelles décisions politiques ont produit chaque virage.",
    wagesKeepingUpH2: "Les salaires suivent-ils ?",
    wagesKeepingUpLead:
      "Salaires, prix à la consommation et prix de l'immobilier — tous indexés sur l'an 2000. Lorsque les courbes divergent, quelqu'un décroche.",
    seeBillionaireCta:
      "Voyez combien de temps il vous faudrait pour gagner autant que la personne la plus riche en {country}",
    compareAcrossCountriesCta:
      "Quelle serait votre place dans un autre pays ?",
    attribution:
      "Données de WID.world, OCDE et SWIID. Projet open source à but éducatif.",
  },
  input: {
    modeWealth: "Patrimoine net",
    modeIncome: "Revenu annuel",
    incomeLabelTemplate:
      "Saisissez votre revenu annuel brut (avant impôt) en {currency}",
    wealthLabelTemplate: "Saisissez votre patrimoine net en {currency}",
    incomeHint:
      "Le brut inclut salaires, revenus du capital et pensions avant impôt.",
    wealthHint:
      "Saisissez VOTRE part personnelle — si vous partagez vos finances avec votre partenaire, indiquez la moitié.",
    ageOptional: "Votre âge (facultatif) :",
    agePlaceholder: "ex. 30",
    knowYourAssets:
      "Vous connaissez vos actifs ? Ajoutez immobilier, placements et plus pour affiner l'estimation",
    estimatedNetWealth: "Patrimoine net estimé :",
    resultWealthTemplate: "En {country}, vous êtes plus riche que",
    resultIncomeTemplate:
      "En {country}, d'après le patrimoine estimé à partir de votre revenu, vous vous classez devant",
    ofThePopulation: "de la population",
    inTheTop1: "Vous faites partie du 1 % le plus riche",
    belowTheMedian: "En dessous du patrimoine médian de {amount}",
    privacyNote:
      "Vos données restent dans votre navigateur. Rien n'est stocké ni transmis.",
    incomeConvertedNote:
      "Le revenu est converti en une fourchette estimée de patrimoine. Pour des résultats exacts, utilisez le mode « Patrimoine net ».",
  },
  share: {
    label: "Partager :",
    nativeShareButton: "Partager…",
    nativeShareAria: "Partager via le menu système",
    twitter: "X / Twitter",
    whatsapp: "WhatsApp",
    copyLink: "Copier le lien",
    copied: "Copié !",
    copyFailed: "Échec de la copie",
    shareTextTemplate:
      "Je suis plus riche que {percentile} de la population en {country}. Et vous ?",
  },
  stats: {
    title: "Les chiffres qui définissent l'inégalité",
    top1OwnsTemplate: "Le 1 % le plus riche en {country} détient",
    top1OwnsSublabel: "de la richesse nationale totale",
    bottom50Owns: "Les 50 % du bas détiennent",
    bottom50OwnsSublabel: "de la richesse nationale totale",
    giniLabel: "Coefficient de Gini de la richesse",
    giniSublabel:
      "0 = égalité parfaite, 1 = une seule personne possède tout",
    meanWealthLabel: "Patrimoine moyen par adulte",
    meanWealthSublabel: "Tiré vers le haut par les ultra-riches",
    medianWealthLabel: "Patrimoine médian par adulte",
    medianWealthSublabel:
      "Ce que possède réellement la personne typique",
    meanMedianRatioLabel: "Ratio moyenne / médiane",
    meanMedianRatioSublabel: "Plus élevé = distribution plus déséquilibrée",
    togglePppOff: "Afficher le pouvoir d'achat (PPA)",
    togglePppOn: "Pouvoir d'achat affiché",
    pppSublabelTemplate: "PPA : ~{value}K $ de pouvoir d'achat",
    regionalContextTitleTemplate: "{country} dans son contexte régional",
    regionalAggregatesNote:
      "Les agrégats régionaux sont des moyennes pondérées par la population des pays couverts.",
    thisCountryRegion: "Région de {country}",

    thresholdsTitle: "Que faut-il pour rejoindre chaque groupe ?",
    thresholdsLeadTemplate:
      "Patrimoine net minimum estimé pour entrer dans chaque tranche de richesse en {country}.",
    thresholdsNote:
      "Les seuils sont des estimations basées sur des données WID.world interpolées par Pareto.",
    thresholdTop50: "Top 50 %",
    thresholdTop10: "Top 10 %",
    thresholdTop1: "Top 1 %",
    thresholdTop01: "Top 0,1 %",

    impactLeadTemplate:
      "Une personne au revenu médian en {country} devrait travailler pendant",
    impactYears: "ans",
    impactTrailing: "pour accumuler le patrimoine moyen du 1 % le plus riche",
    impactNoteTemplate:
      "Sur la base d'un revenu national médian avant impôt de {income}/an face à un patrimoine moyen du 1 % le plus riche de {wealth}",

    doubleGapTitle: "Revenu vs patrimoine : le double écart",
    incomeDistributionTitle: "Distribution du revenu",
    wealthDistributionTitle: "Distribution du patrimoine",
    giniIncomeLineTemplate: "Gini (revenu) : {value}",
    giniWealthLineTemplate: "Gini (patrimoine) : {value}",
    barLabelTop1: "Top 1 %",
    barLabelTop10: "Top 10 %",
    barLabelMiddle40: "40 % moyens",
    barLabelBottom50: "50 % du bas",

    globalPictureTitle: "Le tableau mondial",
    globalTop1Owns: "Le 1 % mondial le plus riche détient",
    globalTop1OwnsSublabel: "de la richesse mondiale totale",
    globalBottom50Owns: "Les 50 % mondiaux du bas détiennent",
    globalBottom50OwnsSublabel: "de la richesse mondiale totale",
    globalGiniLabel: "Gini mondial de la richesse",
    globalGiniSublabel: "Parmi les plus élevés de toutes les métriques mesurées",
    sourceTemplate: "Source : {source}",

    medianWealthUsdLabel: "patrimoine médian (USD)",
    regionTop1Template: "Top 1 % : {value} %",
    regionBottom50Template: "50 % bas : {value} %",
  },
  footer: {
    about: "À propos",
    faq: "FAQ",
    methodology: "Méthodologie",
    github: "GitHub",
    buildDateTemplate: "Données du {date}",
  },
};
