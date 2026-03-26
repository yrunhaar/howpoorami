/**
 * Reference time durations for wealth comparisons.
 * Used on the /compare page to contextualize how absurdly long
 * it would take to earn a billionaire's wealth.
 */

export interface TimeReference {
  readonly id: string;
  readonly label: string;
  readonly years: number;
  readonly emoji: string;
  readonly category:
    | "historical"
    | "scientific"
    | "religious"
    | "pop_culture"
    | "human"
    | "comedic";
  readonly wittyTemplate: string;
  readonly wittyTemplateBelow: string;
}

const TIME_REFERENCES: readonly TimeReference[] = [
  // ---------------------------------------------------------------------------
  // Human scale
  // ---------------------------------------------------------------------------
  {
    id: "working-career",
    label: "Average working career",
    years: 45,
    emoji: "💼",
    category: "human",
    wittyTemplate:
      "{name} has accumulated more than {n} lifetimes of your labor",
    wittyTemplateBelow:
      "You wouldn't even fill one career — just {n} of it",
  },
  {
    id: "human-lifetime",
    label: "Average human lifetime",
    years: 80,
    emoji: "🧬",
    category: "human",
    wittyTemplate:
      "You'd need to live {n} full human lifetimes back-to-back",
    wittyTemplateBelow:
      "That's only {n} of a single lifetime — still depressing",
  },
  {
    id: "grandparents-born",
    label: "Time since your grandparents were born",
    years: 100,
    emoji: "👴",
    category: "human",
    wittyTemplate:
      "Your grandparents would need to be born {n} times over",
    wittyTemplateBelow:
      "Less than a grandparent ago — just {n} of that span",
  },
  {
    id: "dog-lifetime",
    label: "Average dog lifetime",
    years: 12,
    emoji: "🐕",
    category: "human",
    wittyTemplate:
      "Every dog on Earth could live a full life... {n} times",
    wittyTemplateBelow:
      "Not even one full dog life — just {n} of those precious years",
  },

  // ---------------------------------------------------------------------------
  // Historical (serious, sobering)
  // ---------------------------------------------------------------------------
  {
    id: "great-pyramid",
    label: "Great Pyramid construction",
    years: 20,
    emoji: "🔺",
    category: "historical",
    wittyTemplate:
      "You'd have to build the Great Pyramid {n} times over",
    wittyTemplateBelow:
      "Not even one pyramid — just {n} of the way through construction",
  },
  {
    id: "industrial-revolution",
    label: "Time since the Industrial Revolution",
    years: 250,
    emoji: "🏭",
    category: "historical",
    wittyTemplate:
      "That's {n} Industrial Revolutions stacked end to end",
    wittyTemplateBelow:
      "Just {n} of the time since we invented factories",
  },
  {
    id: "roman-empire",
    label: "Duration of the Roman Empire",
    years: 500,
    emoji: "🏛️",
    category: "historical",
    wittyTemplate:
      "That's {n} entire Roman Empires, rise to fall",
    wittyTemplateBelow:
      "Only {n} of a single Roman Empire — not even the good part",
  },
  {
    id: "renaissance",
    label: "Time since the Renaissance",
    years: 600,
    emoji: "🎨",
    category: "historical",
    wittyTemplate:
      "Da Vinci could have painted the Mona Lisa {n} Renaissance-lengths ago",
    wittyTemplateBelow:
      "Just {n} of the time since the Renaissance — barely a brushstroke",
  },
  {
    id: "cleopatra",
    label: "Time since Cleopatra lived",
    years: 2050,
    emoji: "👑",
    category: "historical",
    wittyTemplate:
      "Cleopatra would have to live and die {n} times",
    wittyTemplateBelow:
      "Only {n} of the time since Cleopatra — she'd barely notice",
  },
  {
    id: "democracy-invented",
    label: "Time since democracy was invented",
    years: 2500,
    emoji: "🗳️",
    category: "historical",
    wittyTemplate:
      "Democracy could be invented, forgotten, and reinvented {n} times",
    wittyTemplateBelow:
      "Just {n} of the time since the Greeks tried voting",
  },
  {
    id: "recorded-history",
    label: "All of recorded human history",
    years: 5000,
    emoji: "📜",
    category: "historical",
    wittyTemplate:
      "That's {n} times all of recorded human history — every war, every invention, every empire",
    wittyTemplateBelow:
      "A mere {n} of everything humanity has ever written down",
  },

  // ---------------------------------------------------------------------------
  // Religious / Cultural
  // ---------------------------------------------------------------------------
  {
    id: "muhammad",
    label: "Time since Muhammad lived",
    years: 1400,
    emoji: "☪️",
    category: "religious",
    wittyTemplate:
      "Islam could rise and spread {n} times over",
    wittyTemplateBelow:
      "Just {n} of the time since the Prophet — a blink in faith",
  },
  {
    id: "jesus",
    label: "Time since Jesus lived",
    years: 2000,
    emoji: "✝️",
    category: "religious",
    wittyTemplate:
      "Christianity could be founded {n} times over",
    wittyTemplateBelow:
      "Only {n} of the Christian era — barely past the manger",
  },
  {
    id: "buddha",
    label: "Time since Buddha lived",
    years: 2500,
    emoji: "☸️",
    category: "religious",
    wittyTemplate:
      "The Buddha could achieve enlightenment {n} times",
    wittyTemplateBelow:
      "Just {n} of the time since the Buddha — still meditating",
  },

  // ---------------------------------------------------------------------------
  // Scientific
  // ---------------------------------------------------------------------------
  {
    id: "agriculture-invented",
    label: "Time since agriculture was invented",
    years: 12_000,
    emoji: "🌾",
    category: "scientific",
    wittyTemplate:
      "Humanity could invent farming {n} times over",
    wittyTemplateBelow:
      "Just {n} of the time since we stopped being hunter-gatherers",
  },
  {
    id: "first-humans",
    label: "Time since first humans",
    years: 300_000,
    emoji: "🧍",
    category: "scientific",
    wittyTemplate:
      "Our entire species could evolve from scratch {n} times",
    wittyTemplateBelow:
      "Only {n} of the time humans have existed — still basically newborns",
  },
  {
    id: "dinosaurs-died",
    label: "Time since the dinosaurs died",
    years: 66_000_000,
    emoji: "🦕",
    category: "scientific",
    wittyTemplate:
      "The dinosaurs could go extinct {n} times and still not cover it",
    wittyTemplateBelow:
      "Just {n} of the time since the asteroid — the T-Rex would laugh",
  },
  {
    id: "age-of-earth",
    label: "Age of Earth",
    years: 4_500_000_000,
    emoji: "🌍",
    category: "scientific",
    wittyTemplate:
      "The Earth could form, cool, and develop life {n} times",
    wittyTemplateBelow:
      "A fraction of Earth's age — just {n} of our planet's existence",
  },
  {
    id: "age-of-universe",
    label: "Age of the universe",
    years: 13_800_000_000,
    emoji: "🌌",
    category: "scientific",
    wittyTemplate:
      "The entire universe could exist {n} times over — Big Bang to now, on repeat",
    wittyTemplateBelow:
      "Just {n} of the age of the universe — a cosmic eyeblink",
  },

  // ---------------------------------------------------------------------------
  // Comedic (but makes a serious point)
  // ---------------------------------------------------------------------------
  {
    id: "lotr-extended",
    label: "Rewatching all Lord of the Rings Extended Editions",
    years: 0.0041,
    emoji: "🧙",
    category: "comedic",
    wittyTemplate:
      "You could rewatch all of Lord of the Rings Extended Edition {n} times (bring snacks)",
    wittyTemplateBelow:
      "Not even one full LOTR marathon — just {n} of the way to Mordor",
  },
  {
    id: "phd-duration",
    label: "Average PhD duration",
    years: 6,
    emoji: "🎓",
    category: "comedic",
    wittyTemplate:
      "You could earn {n} PhDs — and still not understand where all that money went",
    wittyTemplateBelow:
      "Not even one PhD — just {n} of the suffering",
  },
  {
    id: "netflix-everything",
    label: "Time to watch every Netflix show ever made",
    years: 5,
    emoji: "📺",
    category: "comedic",
    wittyTemplate:
      "You could binge every Netflix show ever made {n} times and still have existential dread",
    wittyTemplateBelow:
      "You can't even finish Netflix — only {n} of the catalog",
  },
  {
    id: "blockbuster-closed",
    label: "Time since the last Blockbuster closed",
    years: 12,
    emoji: "📼",
    category: "comedic",
    wittyTemplate:
      "Blockbuster could close {n} more times (if it had {n} more lives)",
    wittyTemplateBelow:
      "Not even one Blockbuster lifetime — just {n} of nostalgia",
  },
  {
    id: "count-to-billion",
    label: "Time to count to a billion, one per second",
    years: 31.7,
    emoji: "🔢",
    category: "comedic",
    wittyTemplate:
      "You'd have to count to one billion {n} times — no breaks, no sleep, just numbers",
    wittyTemplateBelow:
      "You can't even count to a billion once — only {n} of the way there",
  },
] as const;

// ---------------------------------------------------------------------------
// Category priority for narrative ordering:
// Lead with human scale, then historical, religious, comedic, scientific
// ---------------------------------------------------------------------------
const CATEGORY_SORT_ORDER: Record<TimeReference["category"], number> = {
  human: 0,
  historical: 1,
  religious: 2,
  comedic: 3,
  pop_culture: 4,
  scientific: 5,
};

/**
 * Format a multiplier to a human-readable string.
 * - >= 1:   "3.2x", "14,500x"
 * - < 1:    "1/3rd", "0.04x"
 */
function formatMultiplier(multiplier: number): string {
  if (multiplier >= 1_000_000) {
    return `${(multiplier / 1_000_000).toFixed(1).replace(/\.0$/, "")} million`;
  }
  if (multiplier >= 1_000) {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(Math.round(multiplier));
  }
  if (multiplier >= 10) {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(Math.round(multiplier));
  }
  if (multiplier >= 1) {
    return multiplier.toFixed(1).replace(/\.0$/, "");
  }
  // Below 1 — express as fraction
  const inverse = Math.round(1 / multiplier);
  return `1/${inverse}`;
}

/**
 * Render a witty template by replacing {n} and {name} placeholders.
 */
function renderTemplate(
  template: string,
  formattedMultiplier: string,
  billionaireName: string,
): string {
  return template
    .replace(/\{n\}/g, formattedMultiplier)
    .replace(/\{name\}/g, billionaireName);
}

/**
 * "Impact score" heuristic: comparisons are most impactful when the
 * multiplier is large enough to shock but not so astronomical it loses
 * meaning. We prefer multipliers in the 2x-100,000x range.
 */
function impactScore(multiplier: number): number {
  if (multiplier < 0.01) return 0.1;
  if (multiplier < 1) return 0.5;
  if (multiplier >= 1 && multiplier <= 10) return 10;
  if (multiplier <= 100) return 9;
  if (multiplier <= 1_000) return 8;
  if (multiplier <= 100_000) return 7;
  if (multiplier <= 1_000_000) return 5;
  return 3;
}

export interface ComparisonResult {
  readonly ref: TimeReference;
  readonly multiplier: number;
  readonly formatted: string;
}

/**
 * Returns the ~8 most impactful comparisons for a given number of years,
 * sorted for best narrative flow:
 * human scale -> historical -> religious -> comedic -> scientific.
 *
 * Each result includes the reference, the raw multiplier, and a
 * pre-rendered witty string ready for display.
 */
export function getRelevantComparisons(
  years: number,
  billionaireName: string,
): readonly ComparisonResult[] {
  const TARGET_COUNT = 8;

  const scored = TIME_REFERENCES.map((ref) => {
    const multiplier = years / ref.years;
    return { ref, multiplier, impact: impactScore(multiplier) };
  });

  // Sort by impact descending, pick top entries ensuring category diversity
  const sortedByImpact = [...scored].sort((a, b) => b.impact - a.impact);

  const picked: typeof scored = [];
  const categoryCounts: Partial<Record<TimeReference["category"], number>> = {};

  for (const entry of sortedByImpact) {
    if (picked.length >= TARGET_COUNT) break;

    const catCount = categoryCounts[entry.ref.category] ?? 0;
    // Allow at most 2 per category to keep variety
    if (catCount >= 2) continue;

    picked.push(entry);
    categoryCounts[entry.ref.category] = catCount + 1;
  }

  // Sort picked results by narrative flow (category order), then by
  // multiplier descending within the same category
  const narrativeSorted = [...picked].sort((a, b) => {
    const catDiff =
      CATEGORY_SORT_ORDER[a.ref.category] -
      CATEGORY_SORT_ORDER[b.ref.category];
    if (catDiff !== 0) return catDiff;
    return b.multiplier - a.multiplier;
  });

  return narrativeSorted.map(({ ref, multiplier }) => {
    const formatted = formatMultiplier(multiplier);
    const template =
      multiplier >= 1 ? ref.wittyTemplate : ref.wittyTemplateBelow;
    const renderedText = renderTemplate(template, formatted, billionaireName);

    return {
      ref,
      multiplier,
      formatted: renderedText,
    };
  });
}

export { TIME_REFERENCES };
