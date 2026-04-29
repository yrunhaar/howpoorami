import type { Metadata } from "next";
import { Playfair_Display, Fira_Code } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SupportRail from "@/components/SupportRail";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { buildHreflangAlternates } from "@/lib/i18n/urls";
import { SITE_URL } from "@/lib/seo";

const playfairDisplay = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://howpoorami.org"),
  title: {
    default: "How Poor Am I? · See Where You Stand in Global Wealth",
    template: "%s | How Poor Am I?",
  },
  description:
    "Find out where you really stand in the wealth distribution. Enter your income or net wealth and discover how you compare to the richest, and poorest, people in your country. Interactive charts for 30+ countries.",
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
    "wealth inequality by country",
    "income distribution",
    "billionaire comparison",
    "median income comparison",
  ],
  alternates: {
    canonical: SITE_URL,
    languages: buildHreflangAlternates(SITE_URL, "/"),
  },
  openGraph: {
    type: "website",
    title: "How Poor Am I? · See Where You Stand",
    description:
      "Think you're middle class? Enter your income and find out where you really stand in the wealth distribution. Interactive data for 30+ countries.",
    siteName: "How Poor Am I?",
    locale: "en_US",
    url: "https://howpoorami.org",
    images: [
      {
        url: "https://howpoorami.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "How Poor Am I? · See where you stand in the global wealth distribution",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How Poor Am I? · The Wealth Gap Visualized",
    description:
      "Enter your income or wealth and see where you stand. Interactive wealth inequality data for 30+ countries.",
    images: ["https://howpoorami.org/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/**
 * Inline script to set the theme before React hydration to prevent flash.
 * Resolution order:
 *   1. user's stored preference (localStorage 'theme'),
 *   2. system preference if it's explicitly dark (prefers-color-scheme: dark),
 *   3. default to light.
 *
 * Only an explicit `prefers-color-scheme: dark` flips us into dark mode 
 * otherwise (including the "no preference" case) we render light. This
 * matches the published default and avoids surprising users who haven't
 * configured a system theme.
 */
const themeScript = `
  (function() {
    try {
      var stored = localStorage.getItem('theme');
      var theme = stored || 'light';
      document.documentElement.setAttribute('data-theme', theme);
    } catch(e) {
      document.documentElement.setAttribute('data-theme', 'light');
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
      className={`${playfairDisplay.variable} ${firaCode.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
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
          <LanguageProvider>
            <Navigation />
            {children}
            <SupportRail />
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
