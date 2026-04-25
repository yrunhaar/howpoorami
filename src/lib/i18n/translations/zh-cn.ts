import type { Dictionary } from "../dictionary";

export const zhCn: Dictionary = {
  meta: {
    siteName: "我到底有多穷？",
    homeTitle: "我到底有多穷？— 看看你在全球财富分布中的位置",
    homeDescription:
      "了解你在财富分布中真正的位置。输入你的收入或净资产，看看你与所在国家最富有和最贫穷的人相比如何。涵盖 30 多个国家的交互式图表。",
    homeOgTitle: "我到底有多穷？— 看看你在哪一档",
    homeOgDescription:
      "你以为自己是中产？输入你的收入，看看你在财富分布中的真实位置。30 多个国家的交互式数据。",
    countryTitleTemplate: "在{country}我到底有多穷？— 财富分布与不平等",
    countryDescriptionTemplate:
      "看看你在{country}的财富分布中处于什么位置。把你的收入和净资产与最富的 1%、前 10% 以及后 50% 进行对比。基于 WID.world 与 OECD 数据的交互式图表。",
    countryOgTitleTemplate: "在{country}我到底有多穷？",
    countryOgDescriptionTemplate:
      "输入你的收入，看看你在{country}的财富分布中真正处于哪一档。基于 WID.world 的交互式不平等数据。",
  },
  nav: {
    home: "我到底有多穷？",
    howLong: "要多久？",
    compareCountries: "跨国比较",
    languageSwitchAria: "切换语言",
    themeToggleAria: "切换浅色/深色模式",
  },
  home: {
    h1: "我到底有多穷？",
    heroSubtitle: "输入你的收入或财富，看看你真正处于什么位置。",
    scrollToExplore: "向下滚动了解更多",
    distributionTitle: "{flag} {country} — 财富分布",
    distributionSubtitle: "按人群划分的财富份额（2023 年）",
    populationVsWealth: "人口对比财富 — {country}",
    scaleOfConcentrationH2: "财富集中的程度",
    scaleOfConcentrationLead:
      "下面每个矩形代表一份财富，面积反映各群体真正拥有多少。看看谁拥有什么。",
    statisticsH2: "定义不平等的关键数字",
    whoActuallyPaysH2: "谁真正在交税？",
    whoActuallyPaysLead:
      "实际税率与名义税率讲的是两个故事。把所有真正缴纳的税考虑进来——包括投资收益、资本利得以及公司架构的处理方式——税制在最富一端往往变得递减。",
    centuryOfChangeH2: "百年变迁",
    centuryOfChangeLead:
      "{country}的财富集中度是如何演变的——以及每一次转折背后的政策选择。",
    wagesKeepingUpH2: "工资跟上了吗？",
    wagesKeepingUpLead:
      "工资、消费品价格与房价——全部以 2000 年为基准。当曲线分叉时，总有人被甩下。",
    seeBillionaireCta: "看看你需要多久才能赚到 {country}最富有的人那么多钱",
    compareAcrossCountriesCta: "如果换一个国家，你的财富会排在第几？",
    attribution:
      "数据来源：WID.world、OECD、SWIID。开源项目，仅供教育用途。",
  },
  input: {
    modeWealth: "净资产",
    modeIncome: "年收入",
    incomeLabelTemplate: "请输入以 {currency} 计的税前年收入",
    wealthLabelTemplate: "请输入以 {currency} 计的净资产",
    incomeHint: "税前包括工资、资本收入以及税前的养老金。",
    wealthHint: "请输入“你个人”的份额——若与伴侣共同理财，请填一半。",
    ageOptional: "你的年龄（可选）：",
    agePlaceholder: "如 30",
    knowYourAssets: "知道自己的资产明细？添加房产、投资等，让估算更精准",
    estimatedNetWealth: "估算的净资产：",
    resultWealthTemplate: "在{country}，你比这部分人更富有：",
    resultIncomeTemplate:
      "在{country}，根据你收入估算出的财富，你超过了：",
    ofThePopulation: "的人口",
    inTheTop1: "你处在最富 1% 的行列",
    belowTheMedian: "低于 {amount} 的中位数财富",
    privacyNote: "你的数据仅保留在浏览器本地，不会被存储或上传。",
    incomeConvertedNote:
      "收入会被换算为一个估算的财富区间。若想得到精确结果，请改用「净资产」模式。",
  },
  share: {
    label: "分享：",
    nativeShareButton: "分享…",
    nativeShareAria: "通过系统分享菜单分享",
    twitter: "X / Twitter",
    whatsapp: "WhatsApp",
    copyLink: "复制链接",
    copied: "已复制！",
    copyFailed: "复制失败",
    shareTextTemplate:
      "在{country}，我比 {percentile} 的人更富有。你呢？",
  },
  stats: {
    title: "定义不平等的关键数字",
    top1OwnsTemplate: "{country}最富 1% 拥有",
    top1OwnsSublabel: "占全国财富总额的比例",
    bottom50Owns: "最贫穷 50% 拥有",
    bottom50OwnsSublabel: "占全国财富总额的比例",
    giniLabel: "财富基尼系数",
    giniSublabel: "0 = 完全平等，1 = 一人独占全部",
    meanWealthLabel: "成年人均财富（平均值）",
    meanWealthSublabel: "被超富人群拉高",
    medianWealthLabel: "成年人均财富（中位数）",
    medianWealthSublabel: "典型个体真正拥有的水平",
    meanMedianRatioLabel: "平均/中位数 比",
    meanMedianRatioSublabel: "数值越大代表分布越偏斜",
    togglePppOff: "显示购买力（PPP）",
    togglePppOn: "正在显示购买力",
    pppSublabelTemplate: "PPP：约 {value}K 美元购买力",
    regionalContextTitleTemplate: "{country}在区域中的位置",
    regionalAggregatesNote: "区域汇总为所覆盖国家的人口加权平均。",
    thisCountryRegion: "{country}所在区域",
  },
  footer: {
    about: "关于",
    faq: "常见问题",
    methodology: "方法说明",
    github: "GitHub",
    buildDateTemplate: "数据更新于 {date}",
  },
};
