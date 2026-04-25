"use client";

import { useState } from "react";
import Link from "next/link";
import { useDictionary, useLanguage } from "@/components/LanguageProvider";
import { localePath } from "@/lib/i18n/urls";

/**
 * A compact, always-visible disclaimer that all figures are estimates,
 * with an expandable panel linking to methodology and data sources.
 */
export default function DataProvenanceBanner() {
  const [expanded, setExpanded] = useState(false);
  const t = useDictionary();
  const { locale } = useLanguage();

  return (
    <div className="max-w-2xl mx-auto text-center mb-6">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="text-text-muted text-xs hover:text-text-secondary transition-colors inline-flex items-center gap-1.5"
      >
        <span className="inline-block w-3.5 h-3.5 rounded-full border border-text-muted/40 text-[9px] leading-none flex items-center justify-center font-semibold">
          i
        </span>
        {t.provenance.notice}{" "}
        <span className="text-accent-periwinkle underline underline-offset-2">
          {expanded ? t.provenance.hideSources : t.provenance.seeSources}
        </span>
      </button>

      {expanded && (
        <div className="mt-3 bg-bg-card border border-border-subtle rounded-lg p-4 text-left text-xs text-text-secondary animate-fade-in">
          <p className="mb-3 leading-relaxed">{t.provenance.intro}</p>

          <table className="w-full text-[11px] mb-3">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left py-1 text-text-muted font-medium">{t.provenance.thData}</th>
                <th className="text-left py-1 text-text-muted font-medium">{t.provenance.thSource}</th>
                <th className="text-left py-1 text-text-muted font-medium">{t.provenance.thType}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50">
              <tr>
                <td className="py-1.5">{t.provenance.rowWealthShares}</td>
                <td className="py-1.5">
                  <a href="https://wid.world" target="_blank" rel="noopener noreferrer" className="text-accent-periwinkle hover:underline">
                    WID.world
                  </a>
                </td>
                <td className="py-1.5 text-text-muted">{t.provenance.typeApi}</td>
              </tr>
              <tr>
                <td className="py-1.5">{t.provenance.rowMeanMedian}</td>
                <td className="py-1.5">
                  <a href="https://wid.world" target="_blank" rel="noopener noreferrer" className="text-accent-periwinkle hover:underline">
                    WID.world
                  </a>
                </td>
                <td className="py-1.5 text-text-muted">{t.provenance.typeApi}</td>
              </tr>
              <tr>
                <td className="py-1.5">{t.provenance.rowIncomeShares}</td>
                <td className="py-1.5">
                  <a href="https://wid.world" target="_blank" rel="noopener noreferrer" className="text-accent-periwinkle hover:underline">
                    WID.world
                  </a>
                </td>
                <td className="py-1.5 text-text-muted">{t.provenance.typeApi}</td>
              </tr>
              <tr>
                <td className="py-1.5">{t.provenance.rowGini}</td>
                <td className="py-1.5">
                  <a href="https://wid.world" target="_blank" rel="noopener noreferrer" className="text-accent-periwinkle hover:underline">
                    WID.world
                  </a>
                </td>
                <td className="py-1.5 text-text-muted">{t.provenance.typeApi}</td>
              </tr>
              <tr>
                <td className="py-1.5">{t.provenance.rowPopulation}</td>
                <td className="py-1.5">
                  <a href="https://data.worldbank.org/indicator/SP.POP.TOTL" target="_blank" rel="noopener noreferrer" className="text-accent-periwinkle hover:underline">
                    World Bank
                  </a>
                </td>
                <td className="py-1.5 text-text-muted">{t.provenance.typeApi}</td>
              </tr>
              <tr>
                <td className="py-1.5">{t.provenance.rowExchangeRates}</td>
                <td className="py-1.5">
                  <a href="https://www.ecb.europa.eu" target="_blank" rel="noopener noreferrer" className="text-accent-periwinkle hover:underline">
                    ECB
                  </a>
                </td>
                <td className="py-1.5 text-text-muted">{t.provenance.typeApi}</td>
              </tr>
              <tr>
                <td className="py-1.5">{t.provenance.rowBillionaire}</td>
                <td className="py-1.5">
                  <a href="https://www.forbes.com/real-time-billionaires/" target="_blank" rel="noopener noreferrer" className="text-accent-periwinkle hover:underline">
                    Forbes RTB
                  </a>
                </td>
                <td className="py-1.5 text-text-muted">{t.provenance.typeApi}</td>
              </tr>
              <tr>
                <td className="py-1.5">{t.provenance.rowTaxRates}</td>
                <td className="py-1.5">{t.provenance.rowAcademicPapers}</td>
                <td className="py-1.5 text-text-muted">{t.provenance.typeManual}</td>
              </tr>
            </tbody>
          </table>

          <p className="text-text-muted leading-relaxed">
            {t.provenance.outroPrefix}
            <Link href={localePath(locale, "/methodology")} className="text-accent-periwinkle hover:underline">
              {t.provenance.methodologyLink}
            </Link>
            {t.provenance.outroSuffix}
          </p>
        </div>
      )}
    </div>
  );
}
