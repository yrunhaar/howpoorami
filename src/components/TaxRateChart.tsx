"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { Bar, Line } from "@visx/shape";
import { scaleLinear, scaleBand } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { motion } from "framer-motion";
import { TAX_RATES, type TaxRateByClass } from "@/data/tax-rates";

interface TaxRateChartProps {
  readonly countryCode: string;
  readonly width: number;
  readonly height: number;
}

interface WealthClassEntry {
  readonly label: string;
  readonly key: keyof TaxRateByClass;
  readonly rate: number;
  readonly color: string;
}

const MARGIN = { top: 20, right: 80, bottom: 50, left: 120 };

const BAR_COLORS: Record<string, string> = {
  "Bottom 50%": "#7eb8a8",
  "Middle 40%": "#929ee8",
  "Top 10-1%": "#b49ad4",
  "Top 1-0.1%": "#c9a87c",
  "Top 0.1-0.01%": "#d4878f",
  "Top 0.01%": "#e8636b",
};

const WEALTH_CLASS_CONFIG: ReadonlyArray<{
  readonly label: string;
  readonly key: keyof TaxRateByClass;
}> = [
  { label: "Bottom 50%", key: "bottom50" },
  { label: "Middle 40%", key: "middle40" },
  { label: "Top 10-1%", key: "top10to1" },
  { label: "Top 1-0.1%", key: "top1to01" },
  { label: "Top 0.1-0.01%", key: "top01to001" },
  { label: "Top 0.01%", key: "top001" },
];

function buildEntries(rates: TaxRateByClass): ReadonlyArray<WealthClassEntry> {
  return WEALTH_CLASS_CONFIG.map((cfg) => ({
    label: cfg.label,
    key: cfg.key,
    rate: rates[cfg.key] as number,
    color: BAR_COLORS[cfg.label],
  }));
}

function findPeakClass(
  entries: ReadonlyArray<WealthClassEntry>
): WealthClassEntry {
  return entries.reduce((peak, entry) =>
    entry.rate > peak.rate ? entry : peak
  );
}

export default function TaxRateChart({
  countryCode,
  width,
  height,
}: TaxRateChartProps) {
  const rates = TAX_RATES[countryCode];

  const entries = useMemo(
    () => (rates ? buildEntries(rates) : []),
    [rates]
  );

  const peakClass = useMemo(
    () => (entries.length > 0 ? findPeakClass(entries) : null),
    [entries]
  );

  const innerWidth = width - MARGIN.left - MARGIN.right;
  const innerHeight = height - MARGIN.top - MARGIN.bottom;

  const yScale = useMemo(
    () =>
      scaleBand<string>({
        domain: entries.map((e) => e.label),
        range: [0, innerHeight],
        padding: 0.25,
      }),
    [entries, innerHeight]
  );

  const xMax = useMemo(() => {
    if (!rates) return 60;
    const highestValue = Math.max(
      ...entries.map((e) => e.rate),
      rates.nominalTopRate
    );
    return Math.ceil(highestValue / 10) * 10 + 5;
  }, [entries, rates]);

  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [0, xMax],
        range: [0, innerWidth],
      }),
    [xMax, innerWidth]
  );

  if (width < 10) return null;

  if (!rates) {
    return (
      <div className="flex items-center justify-center" style={{ width, height }}>
        <div className="text-center px-8">
          <p className="text-text-secondary text-sm">
            Tax rate data is not yet available for this country.
          </p>
          <p className="text-text-muted text-xs mt-2">
            We currently cover {Object.keys(TAX_RATES).length} countries.
            More are being added as data becomes available.
          </p>
        </div>
      </div>
    );
  }

  const middle40Entry = entries.find((e) => e.key === "middle40");
  const top001Entry = entries.find((e) => e.key === "top001");
  const isRegressive =
    middle40Entry && top001Entry && top001Entry.rate < middle40Entry.rate;
  const regressivityGap = isRegressive
    ? (middle40Entry.rate - top001Entry.rate).toFixed(1)
    : null;

  const nominalLineX = xScale(rates.nominalTopRate);

  return (
    <div className="relative">
      {/* Narrative title */}
      {peakClass && (
        <p className="text-text-secondary text-xs text-center mb-1 italic">
          The peak rate is at the {peakClass.label} level, then it drops
        </p>
      )}

      {/* Regressivity callout */}
      {isRegressive && regressivityGap && (
        <p className="text-center text-xs font-semibold mb-3" style={{ color: "#e8636b" }}>
          The ultra-wealthy pay {regressivityGap}% less than the middle class
        </p>
      )}

      <svg width={width} height={height}>
        <Group left={MARGIN.left} top={MARGIN.top}>
          {/* Vertical grid lines */}
          {xScale.ticks(6).map((tick) => (
            <Line
              key={`grid-${tick}`}
              from={{ x: xScale(tick), y: 0 }}
              to={{ x: xScale(tick), y: innerHeight }}
              stroke="var(--border-subtle)"
              strokeWidth={1}
              strokeDasharray="4,4"
              opacity={0.3}
            />
          ))}

          {/* Nominal top marginal rate line */}
          <Line
            from={{ x: nominalLineX, y: -10 }}
            to={{ x: nominalLineX, y: innerHeight + 10 }}
            stroke="var(--text-muted)"
            strokeWidth={1.5}
            strokeDasharray="6,4"
          />
          <text
            x={nominalLineX}
            y={-12}
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize={10}
            fontFamily="var(--font-raleway)"
          >
            Nominal top rate {rates.nominalTopRate}%
          </text>

          {/* Animated horizontal bars */}
          {entries.map((entry, i) => {
            const barY = yScale(entry.label) ?? 0;
            const barHeight = yScale.bandwidth();
            const barWidth = xScale(entry.rate);

            return (
              <g key={entry.label}>
                <motion.rect
                  x={0}
                  y={barY}
                  height={barHeight}
                  rx={3}
                  ry={3}
                  fill={entry.color}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: barWidth, opacity: 0.85 }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
                />
                {/* Rate label at end of bar */}
                <motion.text
                  x={barWidth + 6}
                  y={barY + barHeight / 2}
                  dy="0.35em"
                  fill={entry.color}
                  fontSize={12}
                  fontWeight={600}
                  fontFamily="var(--font-raleway)"
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: barWidth + 6 }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.08 + 0.4,
                    ease: "easeOut",
                  }}
                >
                  {entry.rate.toFixed(1)}%
                </motion.text>
              </g>
            );
          })}

          {/* Regressivity bracket annotation */}
          {isRegressive && middle40Entry && top001Entry && (() => {
            const middle40Y = (yScale("Middle 40%") ?? 0) + yScale.bandwidth() / 2;
            const top001Y = (yScale("Top 0.01%") ?? 0) + yScale.bandwidth() / 2;
            const middle40X = xScale(middle40Entry.rate);
            const top001X = xScale(top001Entry.rate);
            const bracketX = Math.max(middle40X, top001X) + 45;

            return (
              <g>
                {/* Bracket lines */}
                <Line
                  from={{ x: bracketX - 8, y: middle40Y }}
                  to={{ x: bracketX, y: middle40Y }}
                  stroke="#e8636b"
                  strokeWidth={1.5}
                />
                <Line
                  from={{ x: bracketX, y: middle40Y }}
                  to={{ x: bracketX, y: top001Y }}
                  stroke="#e8636b"
                  strokeWidth={1.5}
                />
                <Line
                  from={{ x: bracketX - 8, y: top001Y }}
                  to={{ x: bracketX, y: top001Y }}
                  stroke="#e8636b"
                  strokeWidth={1.5}
                />
                {/* Gap label */}
                <text
                  x={bracketX + 6}
                  y={(middle40Y + top001Y) / 2}
                  dy="0.35em"
                  fill="#e8636b"
                  fontSize={10}
                  fontWeight={600}
                  fontFamily="var(--font-raleway)"
                >
                  -{regressivityGap}%
                </text>
              </g>
            );
          })()}

          {/* Axes */}
          <AxisBottom
            top={innerHeight}
            scale={xScale}
            numTicks={6}
            tickFormat={(v) => `${v}%`}
            stroke="var(--border-subtle)"
            tickStroke="var(--border-subtle)"
            tickLabelProps={{
              fill: "var(--text-secondary)",
              fontSize: 11,
              textAnchor: "middle",
              fontFamily: "var(--font-raleway)",
            }}
            label="Effective tax rate"
            labelOffset={30}
            labelProps={{
              fill: "var(--text-secondary)",
              fontSize: 12,
              textAnchor: "middle",
              fontFamily: "var(--font-raleway)",
            }}
          />
          <AxisLeft
            scale={yScale}
            stroke="var(--border-subtle)"
            tickStroke="transparent"
            tickLabelProps={{
              fill: "var(--text-secondary)",
              fontSize: 11,
              textAnchor: "end",
              fontFamily: "var(--font-raleway)",
            }}
          />
        </Group>
      </svg>

      {/* Source attribution */}
      <p className="text-text-muted text-[10px] text-center mt-1">
        Source: {rates.source} ({rates.year})
      </p>
    </div>
  );
}
