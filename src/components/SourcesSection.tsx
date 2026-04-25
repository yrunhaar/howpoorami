"use client";

import { DATA_SOURCES } from "@/data/wealth-data";
import { useDictionary } from "@/components/LanguageProvider";
import { interpolate } from "@/lib/i18n/dictionary";

export default function SourcesSection() {
  const t = useDictionary();
  return (
    <section className="border-t border-border-subtle pt-16">
      <h3 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl text-center mb-4 text-text-primary">
        {t.sources.title}
      </h3>
      <p className="text-text-secondary text-center text-sm max-w-2xl mx-auto mb-12">
        {t.sources.intro}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {DATA_SOURCES.map((source) => (
          <div
            key={source.name}
            className="bg-bg-card border border-border-subtle rounded-xl p-5"
          >
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-periwinkle hover:text-accent-lavender transition-colors font-medium text-sm"
            >
              {source.name} ↗
            </a>
            <p className="text-text-secondary text-xs mt-2 leading-relaxed">
              {source.description}
            </p>
            {"citation" in source && source.citation && (
              <p className="text-text-muted text-xs mt-2 italic">
                {source.citation}
              </p>
            )}
            {"accessed" in source && source.accessed && (
              <p className="text-text-muted text-xs mt-1">
                {interpolate(t.sources.accessedTemplate, {
                  date: source.accessed,
                })}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-text-muted text-xs max-w-xl mx-auto leading-relaxed">
          {t.sources.disclaimer}
        </p>
        <p className="text-text-muted text-xs mt-6">{t.sources.closingLine}</p>
      </div>
    </section>
  );
}
