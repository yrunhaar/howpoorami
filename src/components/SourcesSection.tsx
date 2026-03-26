"use client";

import { motion } from "framer-motion";
import { DATA_SOURCES } from "@/data/wealth-data";

export default function SourcesSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="border-t border-border-subtle pt-16"
    >
      <h3 className="font-[family-name:var(--font-bitter)] text-2xl sm:text-3xl text-center mb-4 text-text-primary">
        Data Sources & Methodology
      </h3>
      <p className="text-text-secondary text-center text-sm max-w-2xl mx-auto mb-12">
        All data in this visualization comes from peer-reviewed academic research
        and official statistical databases. Wealth shares refer to personal net
        wealth (assets minus debts) among the adult population (20+), using the
        equal-split method for couples.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {DATA_SOURCES.map((source, i) => (
          <motion.div
            key={source.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
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
                Accessed: {source.accessed}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-text-muted text-xs max-w-xl mx-auto leading-relaxed">
          This visualization is for educational purposes. Wealth inequality
          measurement involves complex methodological choices. Different
          definitions of wealth, unit of analysis, and data sources can produce
          varying estimates. For the most up-to-date data, visit{" "}
          <a
            href="https://wid.world"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-periwinkle hover:underline"
          >
            WID.world
          </a>
          .
        </p>
        <p className="text-text-muted text-xs mt-6">
          Built with publicly available data. No personal data is collected or stored.
        </p>
      </div>
    </motion.section>
  );
}
