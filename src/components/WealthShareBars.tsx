"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { type CountryData } from "@/data/wealth-data";

interface WealthShareBarsProps {
  readonly country: CountryData;
}

const SEGMENTS = [
  { key: "top1" as const, label: "Top 1%", color: "#CC6677", popWidth: 1 },
  { key: "top10" as const, label: "Next 9%", color: "#DDCC77", popWidth: 9 },
  { key: "middle40" as const, label: "Middle 40%", color: "#88CCEE", popWidth: 40 },
  { key: "bottom50" as const, label: "Bottom 50%", color: "#44AA99", popWidth: 50 },
];

export default function WealthShareBars({ country }: WealthShareBarsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const next9 = country.wealthShares.top10 - country.wealthShares.top1;
  const shares = [
    country.wealthShares.top1,
    next9,
    country.wealthShares.middle40,
    country.wealthShares.bottom50,
  ];

  return (
    <div ref={ref} className="space-y-6">
      {/* Population bar */}
      <div>
        <p className="text-text-secondary text-sm mb-2">Population share</p>
        <div className="flex h-10 rounded-xl overflow-hidden">
          {SEGMENTS.map((seg, i) => (
            <motion.div
              key={seg.key}
              initial={{ width: 0 }}
              animate={isInView ? { width: `${seg.popWidth}%` } : {}}
              transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
              className="flex items-center justify-center text-xs font-medium"
              style={{ backgroundColor: `${seg.color}33` }}
            >
              <span
                className="truncate px-1"
                style={{ color: seg.color }}
              >
                {seg.popWidth >= 10 ? seg.label : ""}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Wealth bar */}
      <div>
        <p className="text-text-secondary text-sm mb-2">Wealth share</p>
        <div className="flex h-10 rounded-xl overflow-hidden">
          {SEGMENTS.map((seg, i) => (
            <motion.div
              key={seg.key}
              initial={{ width: 0 }}
              animate={isInView ? { width: `${Math.max(0, shares[i])}%` } : {}}
              transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "easeOut" }}
              className="flex items-center justify-center text-xs font-medium"
              style={{ backgroundColor: seg.color }}
            >
              <span className="text-bg-primary truncate px-1 font-semibold">
                {shares[i] >= 5 ? `${shares[i].toFixed(1)}%` : ""}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend for small segments */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-xs text-text-secondary mt-2">
        {SEGMENTS.map((seg, i) => (
          <div key={seg.key} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <span>
              {seg.label}: <span className="text-text-primary tabular-nums">{shares[i].toFixed(1)}%</span> of wealth
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
