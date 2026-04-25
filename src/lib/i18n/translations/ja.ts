import type { Dictionary } from "../dictionary";

export const ja: Dictionary = {
  meta: {
    siteName: "私はどれだけ貧しい？",
    homeTitle:
      "私はどれだけ貧しい？— 世界の富のなかでの自分の立ち位置を知る",
    homeDescription:
      "資産分布のなかで自分が本当にどこに位置するのかを確かめましょう。所得や純資産を入力すると、自国の最富裕層・最貧困層と比較できます。30 か国以上に対応したインタラクティブなチャート。",
    homeOgTitle: "私はどれだけ貧しい？— 自分の立ち位置を見る",
    homeOgDescription:
      "中流だと思っていますか？所得を入力して、資産分布のなかで本当はどこにいるのかを確かめましょう。30 か国以上に対応したインタラクティブデータ。",
    countryTitleTemplate:
      "{country}での「私はどれだけ貧しい？」— 資産分布と不平等",
    countryDescriptionTemplate:
      "{country}の資産分布のなかで自分の位置を確認しましょう。所得や純資産を上位 1%、上位 10%、下位 50% と比較できます。WID.world と OECD のデータに基づくインタラクティブなチャート。",
    countryOgTitleTemplate: "{country}での「私はどれだけ貧しい？」",
    countryOgDescriptionTemplate:
      "所得を入力して、{country}の資産分布のなかで本当の位置を確かめましょう。WID.world に基づくインタラクティブな不平等データ。",

    compareTitle:
      "億万長者に追いつくには？— 年収 vs. 巨大資産",
    compareDescription:
      "億万長者と同じ額を稼ぐには、何年、何世代、あるいは何時代分かかるのか。年収を入力して、巨大資産を実感としてとらえ直しましょう。",
    compareCountryTitleTemplate:
      "{country}の最富裕者に追いつくには？— 億万長者比較",
    compareCountryDescriptionTemplate:
      "{country}の最富裕者と同じ額を稼ぐには、何年かかるか。{richestSuffix}年収を入力して試算しましょう。",

    compareCountriesTitle:
      "30 か国であなたの資産を比較 — 国別資産計算ツール",
    compareCountriesDescription:
      "別の国だったら、あなたの資産や所得は何位に来るのか。金額を入力して、30 か国以上のパーセンタイルを並べて確かめましょう。",

    aboutTitle: "概要 — 私はどれだけ貧しい？",
    aboutDescription:
      "「私はどれだけ貧しい？」は、WID.world・OECD・SWIID のデータをもとに世界の資産格差を可視化する、無料・オープンソースのツールです。",
    faqTitle: "よくある質問 — 私はどれだけ貧しい？",
    faqDescription:
      "「私はどれだけ貧しい？」のよくある質問：データ、計算、そしてパーセンタイルが本当に意味するもの。",
    methodologyTitle: "手法 — 私はどれだけ貧しい？",
    methodologyDescription:
      "「私はどれだけ貧しい？」の手法：データソース、パーセンタイル推定、年齢調整、PPP 換算。",
  },
  nav: {
    home: "私はどれだけ貧しい？",
    howLong: "どれだけかかる？",
    compareCountries: "国別比較",
    languageSwitchAria: "言語を切り替える",
    themeToggleAria: "ライト/ダークモードを切り替える",
  },
  home: {
    h1: "私はどれだけ貧しい？",
    heroSubtitle:
      "所得または資産を入力して、自分が本当にどこにいるのかを知りましょう。",
    scrollToExplore: "スクロールしてもっと見る",
    distributionTitle: "{flag} {country} — 資産分布",
    distributionSubtitle: "人口グループごとの資産シェア（2023 年）",
    populationVsWealth: "人口と資産の比較 — {country}",
    scaleOfConcentrationH2: "資産集中の規模",
    scaleOfConcentrationLead:
      "下の各長方形が「資産」を表します。面積は各グループが実際に保有している量を示します。誰が何を持っているのか見てください。",
    statisticsH2: "不平等を定義する数字",
    whoActuallyPaysH2: "本当に誰が払っているのか？",
    whoActuallyPaysLead:
      "実効税率は名目税率とは別の物語を語ります。投資収益・キャピタルゲイン・法人スキームの扱いを含め、実際に支払われた税をすべて踏まえると、税制は最上位で逆進的になることが少なくありません。",
    centuryOfChangeH2: "1 世紀の変化",
    centuryOfChangeLead:
      "{country}の資産集中度がどのように移り変わってきたのか、そして各転換を生んだ政策的選択を見ましょう。",
    wagesKeepingUpH2: "賃金は追いついている？",
    wagesKeepingUpLead:
      "賃金、消費者物価、住宅価格 — すべて 2000 年を基準にしています。線が乖離するとき、誰かが取り残されています。",
    seeBillionaireCta:
      "{country}で最も裕福な人と同じ額を稼ぐのに、どれくらいかかるか見てみましょう",
    compareAcrossCountriesCta:
      "別の国だったら、あなたの資産はどの位に来るでしょう？",
    attribution:
      "データ提供：WID.world、OECD、SWIID。教育目的のオープンソースプロジェクトです。",
  },
  input: {
    modeWealth: "純資産",
    modeIncome: "年間所得",
    incomeLabelTemplate: "{currency} 建ての税引前年間所得を入力",
    wealthLabelTemplate: "{currency} 建ての純資産を入力",
    incomeHint: "税引前は給与・資本所得・年金などの税引前合計を指します。",
    wealthHint:
      "「あなた本人」の取り分を入力してください — 配偶者と家計を共有している場合は半額を入力。",
    ageOptional: "あなたの年齢（任意）：",
    agePlaceholder: "例：30",
    knowYourAssets:
      "資産がわかるなら、不動産・投資などを追加してより精度の高い見積もりに",
    estimatedNetWealth: "推定純資産：",
    resultWealthTemplate: "{country}では、あなたは次より裕福です：",
    resultIncomeTemplate:
      "{country}では、所得から推定した資産に基づくと、あなたは次より上位です：",
    ofThePopulation: "の人口",
    inTheTop1: "あなたは上位 1% に入っています",
    belowTheMedian: "中央値 {amount} を下回ります",
    privacyNote:
      "入力データはブラウザに留まります。保存も送信も行いません。",
    incomeConvertedNote:
      "所得は推定の資産レンジに換算されます。正確な結果が必要な場合は「純資産」モードをご利用ください。",
  },
  share: {
    label: "共有：",
    nativeShareButton: "共有…",
    nativeShareAria: "システムの共有メニューで共有",
    twitter: "X / Twitter",
    whatsapp: "WhatsApp",
    copyLink: "リンクをコピー",
    copied: "コピーしました！",
    copyFailed: "コピーに失敗しました",
    shareTextTemplate:
      "{country}で、私は {percentile} の人より裕福です。あなたは？",
  },
  stats: {
    title: "不平等を定義する数字",
    top1OwnsTemplate: "{country}の上位 1% が保有する割合",
    top1OwnsSublabel: "全国総資産に占める比率",
    bottom50Owns: "下位 50% が保有する割合",
    bottom50OwnsSublabel: "全国総資産に占める比率",
    giniLabel: "資産ジニ係数",
    giniSublabel: "0＝完全平等、1＝1 人がすべてを所有",
    meanWealthLabel: "成人 1 人あたり平均資産",
    meanWealthSublabel: "超富裕層に押し上げられた値",
    medianWealthLabel: "成人 1 人あたり中央値資産",
    medianWealthSublabel: "典型的な人が実際に持っている水準",
    meanMedianRatioLabel: "平均 / 中央値 比",
    meanMedianRatioSublabel: "値が大きいほど分布の偏りが強い",
    togglePppOff: "購買力で表示（PPP）",
    togglePppOn: "購買力で表示中",
    pppSublabelTemplate: "PPP：約 {value}K USD の購買力",
    regionalContextTitleTemplate: "地域内での{country}",
    regionalAggregatesNote:
      "地域集計は対象国の人口加重平均です。",
    thisCountryRegion: "{country}の所属地域",

    thresholdsTitle: "各層に入るのに必要な額は？",
    thresholdsLeadTemplate:
      "{country}で各資産層に入るために必要な推定最低純資産。",
    thresholdsNote:
      "しきい値は WID.world データを Pareto 内挿で推定したものです。",
    thresholdTop50: "上位 50%",
    thresholdTop10: "上位 10%",
    thresholdTop1: "上位 1%",
    thresholdTop01: "上位 0.1%",

    impactLeadTemplate:
      "{country}の中央値所得者がこの額を貯めるのに必要な年数",
    impactYears: "年",
    impactTrailing: "上位 1% の平均資産に到達するまで",
    impactNoteTemplate:
      "中央値の税引前国民所得 {income}/年と上位 1% の平均資産 {wealth} に基づく",

    doubleGapTitle: "所得 vs. 資産：二重格差",
    incomeDistributionTitle: "所得分布",
    wealthDistributionTitle: "資産分布",
    giniIncomeLineTemplate: "ジニ係数（所得）：{value}",
    giniWealthLineTemplate: "ジニ係数（資産）：{value}",
    barLabelTop1: "上位 1%",
    barLabelTop10: "上位 10%",
    barLabelMiddle40: "中間 40%",
    barLabelBottom50: "下位 50%",

    globalPictureTitle: "世界全体の構図",
    globalTop1Owns: "世界の上位 1% が保有する割合",
    globalTop1OwnsSublabel: "世界の総資産に対して",
    globalBottom50Owns: "世界の下位 50% が保有する割合",
    globalBottom50OwnsSublabel: "世界の総資産に対して",
    globalGiniLabel: "世界の資産ジニ係数",
    globalGiniSublabel: "計測されたあらゆる指標の中でも最も高い水準",
    sourceTemplate: "出典：{source}",

    medianWealthUsdLabel: "中央値資産（USD）",
    regionTop1Template: "上位 1%：{value}%",
    regionBottom50Template: "下位 50%：{value}%",
  },
  footer: {
    about: "概要",
    faq: "よくある質問",
    methodology: "手法",
    github: "GitHub",
    buildDateTemplate: "データ更新日 {date}",
  },
};
