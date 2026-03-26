import type { Metadata } from "next";
import { Raleway, Bitter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { ThemeProvider } from "@/components/ThemeProvider";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
});

const bitter = Bitter({
  variable: "--font-bitter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "How Poor Am I? — See Where You Stand in Global Wealth",
    template: "%s | How Poor Am I?",
  },
  description:
    "Find out where you really stand in the wealth distribution. Enter your income or net wealth and discover how you compare to the richest — and poorest — people in your country. Interactive charts for 30+ countries.",
  keywords: [
    "how poor am I",
    "wealth inequality",
    "income inequality",
    "wealth distribution",
    "wealth percentile calculator",
    "income percentile",
    "wealth gap",
    "Gini coefficient",
    "how rich am I",
    "net worth percentile",
    "global wealth comparison",
    "billionaire wealth",
    "top 1 percent",
    "wealth concentration",
  ],
  openGraph: {
    type: "website",
    title: "How Poor Am I? — See Where You Stand",
    description:
      "Think you're middle class? Enter your income and find out where you really stand in the wealth distribution. Spoiler: it's probably worse than you think.",
    siteName: "How Poor Am I?",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "How Poor Am I? — The Wealth Gap Visualized",
    description:
      "Enter your income or wealth and see where you stand. Interactive wealth inequality data for 30+ countries.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Inline script to set the theme before React hydration to prevent flash.
 * Reads from localStorage, falls back to system preference, defaults to dark.
 */
const themeScript = `
  (function() {
    try {
      var stored = localStorage.getItem('theme');
      var theme = stored || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
      document.documentElement.setAttribute('data-theme', theme);
    } catch(e) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${raleway.variable} ${bitter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="canonical" href="https://howpoorami.com" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "How Poor Am I?",
              description:
                "Interactive wealth and income inequality visualization. See where you stand in the global wealth distribution.",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Navigation />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
