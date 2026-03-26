# How Poor Am I?

An interactive wealth and income inequality visualization. Enter your income or net wealth and see where you really stand in the global wealth distribution.

**Live site:** [howpoorami.com](https://howpoorami.com)

## Features

- **Wealth Percentile Calculator** -- Enter your income or net wealth and instantly see your percentile ranking within your country's wealth distribution.
- **30+ Countries** -- Covers major economies with data from authoritative sources. Auto-detects your country via geolocation.
- **Billionaire Comparison** (/compare) -- See how long it would take to earn what a billionaire has, with real-time countdowns and historical context.
- **Interactive Charts** -- Wealth distribution treemaps, historical evolution (1980-2023), income share bars, tax rate comparisons, and purchasing power timelines.
- **Dark / Light Mode** -- Toggle between themes with smooth transitions. Persists your preference via localStorage and respects system settings.
- **Fully Accessible** -- Semantic HTML, ARIA attributes, keyboard navigation, focus indicators, reduced-motion support, and high contrast ratios.
- **Privacy First** -- All calculations run client-side. No data is stored or sent anywhere.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, static export)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with CSS custom properties for theming
- **Charts:** [visx](https://airbnb.io/visx/) (low-level composable visualization primitives)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Fonts:** [Bitter](https://fonts.google.com/specimen/Bitter) (headings) + [Raleway](https://fonts.google.com/specimen/Raleway) (body) via `next/font`

## Data Sources

All data files live in `src/data/` with inline source citations:

| File | Description | Primary Sources |
|------|-------------|-----------------|
| `wealth-data.ts` | Wealth/income distribution, Gini coefficients, population for 30+ countries | [WID.world](https://wid.world), [OECD](https://www.oecd.org), [SWIID](https://fsolt.org/swiid/) |
| `billionaires.ts` | Top billionaire per country with net worth (March 2026) | [Bloomberg Billionaires Index](https://www.bloomberg.com/billionaires/), [Forbes](https://www.forbes.com/real-time-billionaires/) |
| `tax-rates.ts` | Income tax, wealth tax, capital gains, and notable policies per country | OECD Tax Database, national tax authority publications |
| `purchasing-power.ts` | Historical prices (bread, milk, gas, rent, etc.) for US, UK, JP | BLS CPI data, ONS UK, Statistics Bureau Japan |
| `time-comparisons.ts` | Historical time periods and cultural milestones for wealth context | Various historical references |
| `countries-extended.ts` | Country metadata: codes, names, flags, currencies, regions | ISO 3166, World Bank |

## Project Structure

```
src/
  app/
    layout.tsx          # Root layout with fonts, theme script, metadata
    page.tsx            # Main calculator page
    globals.css         # Theme variables (dark/light), Tailwind tokens
    compare/
      page.tsx          # Billionaire comparison page
  components/
    ThemeProvider.tsx    # Dark/light mode context + toggle logic
    Navigation.tsx      # Top nav bar with theme toggle
    CountrySearchDropdown.tsx  # Accessible combobox country selector
    WealthDistributionChart.tsx  # Treemap wealth visualization
    HistoricalChart.tsx          # Top 1%/10%/Bottom 50% over time
    HistoricalEvolutionChart.tsx # Stacked area wealth evolution
    TaxRateChart.tsx             # Effective tax rate bar chart
    PurchasingPowerChart.tsx     # Historical price comparison
    StatisticsSection.tsx        # Key statistics cards
    ...
  data/               # All datasets with source citations
  hooks/              # Custom hooks (geolocation, etc.)
  lib/                # Utility functions (formatting, etc.)
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) to view.

## Contributing

Contributions are welcome! If you find inaccurate data, please open an issue with a link to the authoritative source.

## License

MIT
