/**
 * About-page content keyed by locale.
 *
 * Each locale provides the same structure so the rendering component can be
 * shared. To translate to a new locale: copy the English block, change the
 * key to your locale code, translate every string in place.
 */

import type { LocaleCode } from "../locales";

export interface AboutContent {
  readonly h1: string;
  readonly intro: string;
  readonly howItWorks: {
    readonly heading: string;
    readonly intro: string;
    readonly modes: ReadonlyArray<{
      readonly title: string;
      readonly description: string;
    }>;
  };
  readonly dataSources: {
    readonly heading: string;
    readonly intro: string;
    /** Each item: prefix label + description that follows in the same line. */
    readonly items: ReadonlyArray<{
      readonly label: string;
      readonly url: string;
      readonly description: string;
    }>;
  };
  readonly openSource: {
    readonly heading: string;
    /** Body uses {license} and {github} placeholders for emphasis. */
    readonly body: string;
    readonly licenseLabel: string;
    readonly githubLabel: string;
  };
  readonly privacy: {
    readonly heading: string;
    readonly body: string;
  };
  /** Optional Ko-fi support section. Body should make it clear that
   *  contributions are voluntary and the site stays free + ad-free. */
  readonly support: {
    readonly heading: string;
    readonly body: string;
    readonly ctaLabel: string;
  };
  /** Bookshop.org reading list — affiliate links to the canonical
   *  scholarship behind the site. Tone here is invitational, not
   *  promotional. Body discloses the affiliate relationship plainly. */
  readonly furtherReading: {
    readonly heading: string;
    readonly body: string;
    readonly ctaLabel: string;
    readonly disclosure: string;
  };
  readonly relatedNav: {
    readonly backToCalculator: string;
    readonly methodology: string;
  };
}

const en: AboutContent = {
  h1: "About How Poor Am I?",
  intro:
    "How Poor Am I? is a free tool that makes wealth inequality tangible. Instead of abstract Gini coefficients and quintile tables, it shows you exactly where you stand in your country's wealth distribution — and how long it would take you to match the fortune of a billionaire. The goal is simple: turn dry economic data into something you can feel.",
  howItWorks: {
    heading: "How It Works",
    intro: "The tool has two modes:",
    modes: [
      {
        title: "Wealth Percentile",
        description:
          "Enter your net wealth (or income with optional refinement factors) and see which percentile you fall into within your country's wealth distribution.",
      },
      {
        title: "Billionaire Comparison",
        description:
          "See how many years, lifetimes, or entire historical eras it would take to earn as much as the wealthiest person in your country.",
      },
    ],
  },
  dataSources: {
    heading: "Data Sources",
    intro:
      "All calculations are grounded in peer-reviewed or institutionally maintained datasets:",
    items: [
      {
        label: "WID.world",
        url: "https://wid.world",
        description:
          "Wealth shares by percentile group (Distributional National Accounts)",
      },
      {
        label: "OECD",
        url: "https://data.oecd.org",
        description: "Economic indicators and household statistics",
      },
      {
        label: "SWIID",
        url: "https://fsolt.org/swiid/",
        description:
          "Standardized World Income Inequality Database (Gini coefficients)",
      },
      {
        label: "Forbes",
        url: "https://www.forbes.com/real-time-billionaires/",
        description: "Real-Time Billionaires list",
      },
    ],
  },
  openSource: {
    heading: "Open Source",
    body: "The entire codebase is open source under the {license}. You can inspect the data processing, suggest improvements, or run your own instance. Find the repository on {github}.",
    licenseLabel: "MIT License",
    githubLabel: "GitHub",
  },
  privacy: {
    heading: "Privacy",
    body: "All computation happens entirely in your browser. Your income, wealth, and personal details are never sent to any server. There is no tracking, no analytics, and no cookies.",
  },
  support: {
    heading: "Support this project",
    body: "How Poor Am I? is free, open-source, and ad-free. Maintaining the data pipeline, adding new countries, and keeping translations fresh takes real time. If the site has helped you understand inequality better, a small contribution keeps the site running and free for everyone.",
    ctaLabel: "Buy me a coffee",
  },
  furtherReading: {
    heading: "Further reading",
    body: "If the site sparked your curiosity, the books that informed it are the deeper read — Piketty, Saez & Zucman, Wilkinson, Milanović, and others. We've curated the canonical titles into a list at Bookshop.org, which sends a portion of every sale to independent bookstores rather than Amazon.",
    ctaLabel: "Browse the reading list",
    disclosure: "Affiliate links — purchases also help support this project.",
  },
  relatedNav: {
    backToCalculator: "Back to calculator",
    methodology: "Methodology",
  },
};

const es: AboutContent = {
  h1: "Acerca de ¿Qué tan pobre soy?",
  intro:
    "¿Qué tan pobre soy? es una herramienta gratuita que hace tangible la desigualdad de la riqueza. En lugar de coeficientes de Gini abstractos y tablas por quintiles, te muestra exactamente dónde estás en la distribución de la riqueza de tu país — y cuánto tardarías en igualar la fortuna de un millonario. El objetivo es simple: convertir datos económicos áridos en algo que se pueda sentir.",
  howItWorks: {
    heading: "Cómo funciona",
    intro: "La herramienta tiene dos modos:",
    modes: [
      {
        title: "Percentil de riqueza",
        description:
          "Introduce tu patrimonio neto (o tus ingresos con factores opcionales de refinamiento) y mira en qué percentil te sitúas dentro de la distribución de la riqueza de tu país.",
      },
      {
        title: "Comparación con millonarios",
        description:
          "Mira cuántos años, vidas o eras enteras tardarías en ganar tanto como la persona más rica de tu país.",
      },
    ],
  },
  dataSources: {
    heading: "Fuentes de datos",
    intro:
      "Todos los cálculos se basan en bases de datos revisadas por pares o mantenidas por instituciones:",
    items: [
      {
        label: "WID.world",
        url: "https://wid.world",
        description:
          "Cuotas de riqueza por grupo percentil (Cuentas Nacionales Distribucionales)",
      },
      {
        label: "OCDE",
        url: "https://data.oecd.org",
        description: "Indicadores económicos y estadísticas de hogares",
      },
      {
        label: "SWIID",
        url: "https://fsolt.org/swiid/",
        description:
          "Base estandarizada mundial de desigualdad de ingresos (coeficientes de Gini)",
      },
      {
        label: "Forbes",
        url: "https://www.forbes.com/real-time-billionaires/",
        description: "Listado de millonarios en tiempo real",
      },
    ],
  },
  openSource: {
    heading: "Código abierto",
    body: "Todo el código es libre bajo la {license}. Puedes inspeccionar el procesamiento de datos, sugerir mejoras o desplegar tu propia instancia. Encuentra el repositorio en {github}.",
    licenseLabel: "Licencia MIT",
    githubLabel: "GitHub",
  },
  privacy: {
    heading: "Privacidad",
    body: "Todos los cálculos ocurren íntegramente en tu navegador. Tus ingresos, tu riqueza y tus datos personales nunca se envían a ningún servidor. No hay seguimiento, ni analítica, ni cookies.",
  },
  support: {
    heading: "Apoya este proyecto",
    body: "¿Qué tan pobre soy? es gratis, de código abierto y sin publicidad. Mantener el pipeline de datos, añadir nuevos países y conservar las traducciones cuesta tiempo real. Si el sitio te ha ayudado a entender mejor la desigualdad, una pequeña contribución lo mantiene funcionando y gratis para todo el mundo.",
    ctaLabel: "Invítame a un café",
  },
  furtherReading: {
    heading: "Lecturas recomendadas",
    body: "Si el sitio te despertó la curiosidad, los libros que lo inspiraron son la lectura más profunda: Piketty, Saez y Zucman, Wilkinson, Milanović y otros. Hemos seleccionado los títulos canónicos en una lista en Bookshop.org, que envía una parte de cada venta a librerías independientes en lugar de a Amazon.",
    ctaLabel: "Ver la lista de lecturas",
    disclosure:
      "Enlaces de afiliado — las compras también ayudan a sostener este proyecto.",
  },
  relatedNav: {
    backToCalculator: "Volver a la calculadora",
    methodology: "Metodología",
  },
};

const de: AboutContent = {
  h1: "Über Wie arm bin ich?",
  intro:
    "Wie arm bin ich? ist ein kostenloses Tool, das Vermögensungleichheit greifbar macht. Statt abstrakter Gini-Koeffizienten und Quintilstabellen zeigt es dir genau, wo du in der Vermögensverteilung deines Landes stehst — und wie lange du brauchen würdest, um das Vermögen eines Milliardärs zu erreichen. Das Ziel: trockene Wirtschaftsdaten erfahrbar machen.",
  howItWorks: {
    heading: "So funktioniert es",
    intro: "Das Tool hat zwei Modi:",
    modes: [
      {
        title: "Vermögens-Perzentil",
        description:
          "Gib dein Nettovermögen ein (oder dein Einkommen mit optionalen Verfeinerungsfaktoren) und sieh, in welchem Perzentil du innerhalb der Vermögensverteilung deines Landes liegst.",
      },
      {
        title: "Milliardärsvergleich",
        description:
          "Sieh, wie viele Jahre, Lebensspannen oder ganze Epochen du brauchst, um so viel zu verdienen wie die reichste Person deines Landes.",
      },
    ],
  },
  dataSources: {
    heading: "Datenquellen",
    intro:
      "Alle Berechnungen basieren auf peer-reviewten oder institutionell gepflegten Datensätzen:",
    items: [
      {
        label: "WID.world",
        url: "https://wid.world",
        description:
          "Vermögensanteile nach Perzentilgruppen (Distributional National Accounts)",
      },
      {
        label: "OECD",
        url: "https://data.oecd.org",
        description: "Wirtschaftsindikatoren und Haushaltsstatistiken",
      },
      {
        label: "SWIID",
        url: "https://fsolt.org/swiid/",
        description:
          "Standardisierte Weltdatenbank zur Einkommensungleichheit (Gini-Koeffizienten)",
      },
      {
        label: "Forbes",
        url: "https://www.forbes.com/real-time-billionaires/",
        description: "Echtzeit-Liste der Milliardäre",
      },
    ],
  },
  openSource: {
    heading: "Open Source",
    body: "Der gesamte Code ist quelloffen unter der {license}. Du kannst die Datenverarbeitung einsehen, Verbesserungen vorschlagen oder eine eigene Instanz betreiben. Das Repository ist auf {github}.",
    licenseLabel: "MIT-Lizenz",
    githubLabel: "GitHub",
  },
  privacy: {
    heading: "Datenschutz",
    body: "Alle Berechnungen laufen vollständig im Browser. Dein Einkommen, dein Vermögen und persönliche Angaben werden niemals an einen Server gesendet. Kein Tracking, keine Analytics, keine Cookies.",
  },
  support: {
    heading: "Dieses Projekt unterstützen",
    body: "Wie arm bin ich? ist kostenlos, quelloffen und werbefrei. Die Datenpipeline zu pflegen, neue Länder hinzuzufügen und Übersetzungen aktuell zu halten kostet echte Zeit. Wenn dir die Seite geholfen hat, Ungleichheit besser zu verstehen, hilft ein kleiner Beitrag, sie am Laufen und für alle kostenlos zu halten.",
    ctaLabel: "Spendier mir einen Kaffee",
  },
  furtherReading: {
    heading: "Weiterlesen",
    body: "Wenn die Seite deine Neugier geweckt hat, sind die Bücher, die sie geprägt haben, die tiefere Lektüre — Piketty, Saez und Zucman, Wilkinson, Milanović und andere. Die kanonischen Titel haben wir in einer Liste auf Bookshop.org zusammengestellt, das einen Teil jeder Bestellung an unabhängige Buchhandlungen weitergibt statt an Amazon.",
    ctaLabel: "Leseliste ansehen",
    disclosure:
      "Affiliate-Links — Käufe unterstützen auch dieses Projekt.",
  },
  relatedNav: {
    backToCalculator: "Zurück zum Rechner",
    methodology: "Methodik",
  },
};

const fr: AboutContent = {
  h1: "À propos d'À quel point suis-je pauvre ?",
  intro:
    "À quel point suis-je pauvre ? est un outil gratuit qui rend l'inégalité de richesse tangible. Au lieu de coefficients de Gini abstraits et de tableaux par quintiles, il vous montre précisément où vous vous situez dans la distribution de la richesse de votre pays — et combien de temps il vous faudrait pour égaler la fortune d'un milliardaire. Le but est simple : transformer des données économiques arides en quelque chose que vous pouvez ressentir.",
  howItWorks: {
    heading: "Comment ça marche",
    intro: "L'outil propose deux modes :",
    modes: [
      {
        title: "Centile de richesse",
        description:
          "Saisissez votre patrimoine net (ou votre revenu avec des facteurs d'affinage optionnels) et voyez dans quel centile vous vous situez dans la distribution de la richesse de votre pays.",
      },
      {
        title: "Comparaison avec un milliardaire",
        description:
          "Voyez combien d'années, de vies ou d'époques entières il vous faudrait pour gagner autant que la personne la plus riche de votre pays.",
      },
    ],
  },
  dataSources: {
    heading: "Sources de données",
    intro:
      "Tous les calculs reposent sur des bases de données évaluées par les pairs ou maintenues par des institutions :",
    items: [
      {
        label: "WID.world",
        url: "https://wid.world",
        description:
          "Parts de richesse par groupe de centile (Comptes Nationaux Distributionnels)",
      },
      {
        label: "OCDE",
        url: "https://data.oecd.org",
        description: "Indicateurs économiques et statistiques des ménages",
      },
      {
        label: "SWIID",
        url: "https://fsolt.org/swiid/",
        description:
          "Base mondiale standardisée d'inégalité des revenus (coefficients de Gini)",
      },
      {
        label: "Forbes",
        url: "https://www.forbes.com/real-time-billionaires/",
        description: "Liste des milliardaires en temps réel",
      },
    ],
  },
  openSource: {
    heading: "Open source",
    body: "Tout le code est open source sous {license}. Vous pouvez inspecter le traitement des données, suggérer des améliorations ou déployer votre propre instance. Le dépôt est sur {github}.",
    licenseLabel: "Licence MIT",
    githubLabel: "GitHub",
  },
  privacy: {
    heading: "Vie privée",
    body: "Tous les calculs ont lieu intégralement dans votre navigateur. Votre revenu, votre patrimoine et vos données personnelles ne sont jamais envoyés à aucun serveur. Pas de pistage, pas d'analytique, pas de cookies.",
  },
  support: {
    heading: "Soutenir ce projet",
    body: "À quel point suis-je pauvre ? est gratuit, open source et sans publicité. Maintenir le pipeline de données, ajouter de nouveaux pays et garder les traductions à jour prend un vrai temps. Si le site vous a aidé à mieux comprendre les inégalités, une petite contribution permet de le maintenir en ligne et gratuit pour tout le monde.",
    ctaLabel: "Offrez-moi un café",
  },
  furtherReading: {
    heading: "Pour aller plus loin",
    body: "Si le site a piqué votre curiosité, les livres qui l'ont inspiré offrent la lecture en profondeur — Piketty, Saez et Zucman, Wilkinson, Milanović et d'autres. Les titres canoniques sont rassemblés dans une liste sur Bookshop.org, qui reverse une part de chaque achat à des librairies indépendantes plutôt qu'à Amazon.",
    ctaLabel: "Voir la liste de lectures",
    disclosure:
      "Liens d'affiliation — les achats soutiennent aussi ce projet.",
  },
  relatedNav: {
    backToCalculator: "Retour à la calculatrice",
    methodology: "Méthodologie",
  },
};

const zhCn: AboutContent = {
  h1: "关于「我到底有多穷？」",
  intro:
    "「我到底有多穷？」是一个免费工具，让财富不平等变得可感。它不停留在抽象的基尼系数和五分位表格，而是直接告诉你在自己国家的财富分布中处于何处——以及需要多久才能追上亿万富豪的财富。目标很简单：把枯燥的经济数据变成你能切身感受到的东西。",
  howItWorks: {
    heading: "工作原理",
    intro: "工具有两种模式：",
    modes: [
      {
        title: "财富百分位",
        description:
          "输入你的净资产（或带可选修正因子的收入），看你处于本国财富分布的哪个百分位。",
      },
      {
        title: "亿万富豪对比",
        description:
          "看看你需要几年、几生几世，乃至几个时代才能挣到本国首富那么多钱。",
      },
    ],
  },
  dataSources: {
    heading: "数据来源",
    intro: "所有计算均基于经过同行评议或由机构维护的数据集：",
    items: [
      {
        label: "WID.world",
        url: "https://wid.world",
        description: "按百分位分组的财富份额（分布式国民账户）",
      },
      {
        label: "OECD",
        url: "https://data.oecd.org",
        description: "经济指标与家庭统计",
      },
      {
        label: "SWIID",
        url: "https://fsolt.org/swiid/",
        description: "标准化世界收入不平等数据库（基尼系数）",
      },
      {
        label: "Forbes",
        url: "https://www.forbes.com/real-time-billionaires/",
        description: "实时亿万富豪榜",
      },
    ],
  },
  openSource: {
    heading: "开源",
    body: "全部代码以 {license} 开源。你可以审查数据处理流程、提出改进建议或自行部署。仓库地址：{github}。",
    licenseLabel: "MIT 许可",
    githubLabel: "GitHub",
  },
  privacy: {
    heading: "隐私",
    body: "所有运算均在你的浏览器内完成。你的收入、财富与个人信息绝不会上传到任何服务器。没有追踪、没有分析脚本、没有 Cookie。",
  },
  support: {
    heading: "支持本项目",
    body: "「我到底有多穷？」完全免费、开源、无广告。维护数据管线、新增国家、持续更新各语种翻译都需要真实的时间投入。如果本站让你更清楚地看见不平等，一杯咖啡的小额支持能帮它继续运行，并对所有人免费开放。",
    ctaLabel: "请我喝杯咖啡",
  },
  furtherReading: {
    heading: "延伸阅读",
    body: "如果本站让你产生了兴趣，那些塑造了它的书籍才是更深入的阅读 —— Piketty、Saez 与 Zucman、Wilkinson、Milanović 等。我们把经典书目整理到了 Bookshop.org 的一个书单里；该平台会把每笔交易的一部分分给独立书店，而不是亚马逊。",
    ctaLabel: "查看书单",
    disclosure: "联盟链接 —— 购书也会支持本项目。",
  },
  relatedNav: {
    backToCalculator: "返回计算器",
    methodology: "方法说明",
  },
};

const ja: AboutContent = {
  h1: "「私はどれだけ貧しい？」について",
  intro:
    "「私はどれだけ貧しい？」は、資産格差を実感できる形に変える無料のツールです。抽象的なジニ係数や五分位表ではなく、自国の資産分布のなかであなたがどこに立っているのか、そして億万長者の資産に追いつくのに何年かかるのかを直接示します。目的はひとつ — 無味乾燥な経済データを「肌で感じられるもの」にすることです。",
  howItWorks: {
    heading: "使い方",
    intro: "ツールには 2 つのモードがあります：",
    modes: [
      {
        title: "資産パーセンタイル",
        description:
          "純資産（または任意の補正要因を加えた所得）を入力すると、自国の資産分布のなかで何パーセンタイルにいるかを表示します。",
      },
      {
        title: "億万長者比較",
        description:
          "自国でいちばん裕福な人物と同じ額を稼ぐのに、何年・何世代・何時代かかるのかが分かります。",
      },
    ],
  },
  dataSources: {
    heading: "データソース",
    intro:
      "すべての計算は査読済みもしくは公的機関が維持するデータセットに基づきます：",
    items: [
      {
        label: "WID.world",
        url: "https://wid.world",
        description:
          "パーセンタイル群別の資産シェア（分配的国民勘定）",
      },
      {
        label: "OECD",
        url: "https://data.oecd.org",
        description: "経済指標と家計統計",
      },
      {
        label: "SWIID",
        url: "https://fsolt.org/swiid/",
        description:
          "世界所得格差標準化データベース（ジニ係数）",
      },
      {
        label: "Forbes",
        url: "https://www.forbes.com/real-time-billionaires/",
        description: "リアルタイム億万長者リスト",
      },
    ],
  },
  openSource: {
    heading: "オープンソース",
    body: "コード全体は {license} のもとオープンソースで公開されています。データ処理を検証したり、改善を提案したり、自分の環境で実行したりできます。リポジトリは {github} にあります。",
    licenseLabel: "MIT ライセンス",
    githubLabel: "GitHub",
  },
  privacy: {
    heading: "プライバシー",
    body: "すべての計算はブラウザ内で完結します。所得・資産・個人情報がサーバーに送られることはありません。トラッキングも、解析も、Cookie もありません。",
  },
  support: {
    heading: "このプロジェクトを支援する",
    body: "「私はどれだけ貧しい？」は無料・オープンソース・広告なしです。データパイプラインの維持、新しい国の追加、翻訳のアップデートには実際の時間がかかります。サイトが格差の理解に役立ったなら、小さなサポートが運営を続け、すべての人に無料で提供する助けになります。",
    ctaLabel: "コーヒーをおごる",
  },
  furtherReading: {
    heading: "さらに読む",
    body: "サイトが興味を引いたなら、その土台となった本は最良の深掘り素材です — Piketty、Saez と Zucman、Wilkinson、Milanović など。古典的なタイトルを Bookshop.org のリストにまとめました。Bookshop.org は売上の一部を Amazon ではなく独立系書店に還元します。",
    ctaLabel: "リーディングリストを見る",
    disclosure: "アフィリエイトリンク — 購入はこのプロジェクトの支援にもなります。",
  },
  relatedNav: {
    backToCalculator: "計算ツールに戻る",
    methodology: "手法",
  },
};

const pt: AboutContent = {
  h1: "Sobre Quão pobre eu sou?",
  intro:
    "Quão pobre eu sou? é uma ferramenta gratuita que torna a desigualdade de riqueza palpável. Em vez de coeficientes de Gini abstratos e tabelas por quintis, ela mostra exatamente onde você está na distribuição da riqueza do seu país — e quanto tempo levaria para igualar a fortuna de um bilionário. O objetivo é simples: transformar dados econômicos áridos em algo que você possa sentir.",
  howItWorks: {
    heading: "Como funciona",
    intro: "A ferramenta tem dois modos:",
    modes: [
      {
        title: "Percentil de riqueza",
        description:
          "Insira seu patrimônio líquido (ou sua renda com fatores opcionais de refinamento) e veja em qual percentil você está dentro da distribuição da riqueza do seu país.",
      },
      {
        title: "Comparação com bilionário",
        description:
          "Veja quantos anos, vidas ou eras inteiras levaria para ganhar tanto quanto a pessoa mais rica do seu país.",
      },
    ],
  },
  dataSources: {
    heading: "Fontes de dados",
    intro:
      "Todos os cálculos baseiam-se em conjuntos de dados revisados por pares ou mantidos por instituições:",
    items: [
      {
        label: "WID.world",
        url: "https://wid.world",
        description:
          "Participações de riqueza por grupo de percentil (Contas Nacionais Distribucionais)",
      },
      {
        label: "OCDE",
        url: "https://data.oecd.org",
        description: "Indicadores econômicos e estatísticas dos lares",
      },
      {
        label: "SWIID",
        url: "https://fsolt.org/swiid/",
        description:
          "Banco mundial padronizado de desigualdade de renda (coeficientes de Gini)",
      },
      {
        label: "Forbes",
        url: "https://www.forbes.com/real-time-billionaires/",
        description: "Lista de bilionários em tempo real",
      },
    ],
  },
  openSource: {
    heading: "Código aberto",
    body: "Todo o código é open source sob a {license}. Você pode inspecionar o processamento de dados, sugerir melhorias ou rodar sua própria instância. O repositório está no {github}.",
    licenseLabel: "Licença MIT",
    githubLabel: "GitHub",
  },
  privacy: {
    heading: "Privacidade",
    body: "Todos os cálculos acontecem inteiramente no seu navegador. Sua renda, patrimônio e dados pessoais nunca são enviados a nenhum servidor. Sem rastreamento, sem analytics, sem cookies.",
  },
  support: {
    heading: "Apoie este projeto",
    body: "Quão pobre eu sou? é gratuito, de código aberto e sem anúncios. Manter o pipeline de dados, adicionar novos países e conservar as traduções dá trabalho real. Se o site te ajudou a entender melhor a desigualdade, uma pequena contribuição mantém o projeto no ar e gratuito para todo mundo.",
    ctaLabel: "Me pague um café",
  },
  furtherReading: {
    heading: "Leituras complementares",
    body: "Se o site despertou sua curiosidade, os livros que o inspiraram são a leitura mais aprofundada — Piketty, Saez e Zucman, Wilkinson, Milanović e outros. Reunimos os títulos canônicos em uma lista no Bookshop.org, que repassa parte de cada venda a livrarias independentes em vez da Amazon.",
    ctaLabel: "Ver a lista de leituras",
    disclosure:
      "Links de afiliado — as compras também ajudam a sustentar este projeto.",
  },
  relatedNav: {
    backToCalculator: "Voltar à calculadora",
    methodology: "Metodologia",
  },
};

const it: AboutContent = {
  h1: "Su Quanto sono povero?",
  intro:
    "Quanto sono povero? è uno strumento gratuito che rende la disuguaglianza di ricchezza tangibile. Invece di coefficienti di Gini astratti e tabelle per quintili, ti mostra esattamente dove ti collochi nella distribuzione della ricchezza del tuo paese — e quanto tempo ti servirebbe per eguagliare la fortuna di un miliardario. L'obiettivo è semplice: trasformare dati economici aridi in qualcosa che puoi percepire.",
  howItWorks: {
    heading: "Come funziona",
    intro: "Lo strumento ha due modalità:",
    modes: [
      {
        title: "Percentile di ricchezza",
        description:
          "Inserisci il tuo patrimonio netto (o il tuo reddito con fattori opzionali di affinamento) e vedi in quale percentile ti collochi nella distribuzione della ricchezza del tuo paese.",
      },
      {
        title: "Confronto con un miliardario",
        description:
          "Scopri quanti anni, vite o intere epoche serviresti a guadagnare quanto la persona più ricca del tuo paese.",
      },
    ],
  },
  dataSources: {
    heading: "Fonti dati",
    intro:
      "Tutti i calcoli si basano su dataset peer-reviewed o mantenuti da istituzioni:",
    items: [
      {
        label: "WID.world",
        url: "https://wid.world",
        description:
          "Quote di ricchezza per gruppo di percentile (Distributional National Accounts)",
      },
      {
        label: "OCSE",
        url: "https://data.oecd.org",
        description: "Indicatori economici e statistiche delle famiglie",
      },
      {
        label: "SWIID",
        url: "https://fsolt.org/swiid/",
        description:
          "Base dati mondiale standardizzata della disuguaglianza di reddito (coefficienti di Gini)",
      },
      {
        label: "Forbes",
        url: "https://www.forbes.com/real-time-billionaires/",
        description: "Elenco in tempo reale dei miliardari",
      },
    ],
  },
  openSource: {
    heading: "Open source",
    body: "L'intero codice è open source con licenza {license}. Puoi ispezionare il trattamento dei dati, proporre miglioramenti o avviare un'istanza personale. Il repository è su {github}.",
    licenseLabel: "Licenza MIT",
    githubLabel: "GitHub",
  },
  privacy: {
    heading: "Privacy",
    body: "Tutti i calcoli avvengono interamente nel tuo browser. Reddito, patrimonio e dati personali non vengono mai inviati ad alcun server. Niente tracciamento, niente analytics, niente cookie.",
  },
  support: {
    heading: "Sostieni questo progetto",
    body: "Quanto sono povero? è gratuito, open source e senza pubblicità. Mantenere la pipeline dati, aggiungere nuovi paesi e tenere aggiornate le traduzioni richiede tempo reale. Se il sito ti ha aiutato a capire meglio la disuguaglianza, un piccolo contributo aiuta a tenerlo online e gratuito per tutti.",
    ctaLabel: "Offrimi un caffè",
  },
  furtherReading: {
    heading: "Approfondimenti",
    body: "Se il sito ha acceso la tua curiosità, i libri che lo hanno ispirato sono la lettura più approfondita — Piketty, Saez e Zucman, Wilkinson, Milanović e altri. Abbiamo raccolto i titoli canonici in una lista su Bookshop.org, che gira una parte di ogni vendita alle librerie indipendenti invece di Amazon.",
    ctaLabel: "Vai alla lista di letture",
    disclosure: "Link affiliati — gli acquisti aiutano anche questo progetto.",
  },
  relatedNav: {
    backToCalculator: "Torna al calcolatore",
    methodology: "Metodologia",
  },
};

const ABOUT: Readonly<Record<LocaleCode, AboutContent>> = {
  en,
  es,
  de,
  fr,
  "zh-cn": zhCn,
  ja,
  pt,
  it,
};

export function getAboutContent(locale: LocaleCode): AboutContent {
  return ABOUT[locale] ?? ABOUT.en;
}
