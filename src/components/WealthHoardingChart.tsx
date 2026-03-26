"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { motion, AnimatePresence } from "framer-motion";
import { type CountryData } from "@/data/wealth-data";
import { DETAILED_SHARES, type DetailedWealthShares } from "@/data/billionaires";
import { formatNumber } from "@/lib/format";

interface WealthHoardingChartProps {
  readonly country: CountryData;
  readonly width: number;
  readonly height: number;
}

const COLORS: Record<keyof DetailedWealthShares, string> = {
  bottom50: "#7eb8a8",
  middle40: "#929ee8",
  next9: "#b49ad4",
  next09: "#c9a87c",
  next009: "#d4878f",
  top001: "#e8636b",
};

const GROUP_LABELS: Record<keyof DetailedWealthShares, string> = {
  bottom50: "Bottom 50%",
  middle40: "Middle 40%",
  next9: "Top 10-1%",
  next09: "Top 1-0.1%",
  next009: "Top 0.1-0.01%",
  top001: "Top 0.01%",
};

const GROUP_POP_FRACTIONS: Record<keyof DetailedWealthShares, number> = {
  bottom50: 0.5,
  middle40: 0.4,
  next9: 0.09,
  next09: 0.009,
  next009: 0.0009,
  top001: 0.0001,
};

const SEGMENT_KEYS: ReadonlyArray<keyof DetailedWealthShares> = [
  "bottom50",
  "middle40",
  "next9",
  "next09",
  "next009",
  "top001",
];

const MARGIN = { top: 16, right: 16, bottom: 16, left: 16 };

interface RectData {
  readonly key: string;
  readonly label: string;
  readonly wealthShare: number;
  readonly peopleCount: number;
  readonly color: string;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly populationFraction: number;
}

function computePopulationCount(
  populationMillions: number,
  fraction: number
): number {
  return Math.round(populationMillions * 1_000_000 * fraction);
}

function formatPeopleCount(count: number): string {
  if (count >= 1_000_000) {
    const millions = count / 1_000_000;
    return millions >= 10
      ? `~${Math.round(millions)}M people`
      : `~${millions.toFixed(1)}M people`;
  }
  if (count >= 1_000) {
    return `~${formatNumber(Math.round(count / 1_000) * 1_000)} people`;
  }
  return `~${formatNumber(count)} people`;
}

function buildRectangles(
  shares: DetailedWealthShares,
  population: number,
  innerWidth: number,
  innerHeight: number
): readonly RectData[] {
  const totalArea = innerWidth * innerHeight;

  // Calculate widths proportional to wealth share, laid out horizontally
  const totalShare = SEGMENT_KEYS.reduce((sum, k) => sum + shares[k], 0);

  let currentX = 0;
  return SEGMENT_KEYS.map((key) => {
    const fraction = shares[key] / totalShare;
    const rectWidth = fraction * innerWidth;
    const rect: RectData = {
      key,
      label: GROUP_LABELS[key],
      wealthShare: shares[key],
      peopleCount: computePopulationCount(population, GROUP_POP_FRACTIONS[key]),
      color: COLORS[key],
      x: currentX,
      y: 0,
      w: rectWidth,
      h: innerHeight,
      populationFraction: GROUP_POP_FRACTIONS[key],
    };
    currentX += rectWidth;
    return rect;
  });
}

function shouldShowLabel(rect: RectData, innerWidth: number): boolean {
  return rect.w > innerWidth * 0.04;
}

function shouldShowDetails(rect: RectData, innerWidth: number): boolean {
  return rect.w > innerWidth * 0.08;
}

function PopulationDots({
  topCount,
  bottomCount,
}: {
  readonly topCount: number;
  readonly bottomCount: number;
}) {
  // Show the ratio visually: 1 dot for top 0.01%, proportional dots for bottom 50%
  const ratio = Math.round(bottomCount / topCount);
  // Cap displayed dots for readability
  const displayDots = Math.min(ratio, 50);
  const dotsPerRow = 10;
  const rows = Math.ceil(displayDots / dotsPerRow);

  return (
    <div className="flex items-start gap-8 mt-4">
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center justify-center">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: COLORS.top001 }}
          />
        </div>
        <span className="text-text-muted text-[10px] text-center leading-tight">
          Top 0.01%
          <br />({formatPeopleCount(topCount)})
        </span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <div
          className="flex flex-wrap gap-[2px] justify-center"
          style={{ maxWidth: dotsPerRow * 14 }}
        >
          {Array.from({ length: displayDots }, (_, i) => (
            <span
              key={i}
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS.bottom50 }}
            />
          ))}
        </div>
        <span className="text-text-muted text-[10px] text-center leading-tight">
          Bottom 50%
          <br />({formatPeopleCount(bottomCount)})
          <br />
          <span className="text-text-secondary font-medium">
            1 dot = {formatNumber(Math.round(ratio / displayDots))}x
          </span>
        </span>
      </div>
    </div>
  );
}

export default function WealthHoardingChart({
  country,
  width,
  height,
}: WealthHoardingChartProps) {
  const shares = DETAILED_SHARES[country.code] ?? {
    bottom50: country.wealthShares.bottom50,
    middle40: country.wealthShares.middle40,
    next9: country.wealthShares.top10 - country.wealthShares.top1,
    next09: country.wealthShares.top1 * 0.55,
    next009: country.wealthShares.top1 * 0.28,
    top001: country.wealthShares.top1 * 0.17,
  };

  const innerWidth = width - MARGIN.left - MARGIN.right;
  const innerHeight = height - MARGIN.top - MARGIN.bottom;

  const rectangles = useMemo(
    () => buildRectangles(shares, country.population, innerWidth, innerHeight),
    [shares, country.population, innerWidth, innerHeight]
  );

  const topGroup = useMemo(
    () => rectangles.find((r) => r.key === "top001"),
    [rectangles]
  );

  const bottomGroup = useMemo(
    () => rectangles.find((r) => r.key === "bottom50"),
    [rectangles]
  );

  if (width < 10 || !shares) return null;

  const topPeopleCount = topGroup?.peopleCount ?? 0;
  const bottomPeopleCount = bottomGroup?.peopleCount ?? 0;
  const topShare = topGroup?.wealthShare ?? 0;
  const bottomShare = bottomGroup?.wealthShare ?? 0;

  return (
    <div className="relative">
      <svg width={width} height={height}>
        <Group left={MARGIN.left} top={MARGIN.top}>
          <AnimatePresence mode="wait">
            {rectangles.map((rect) => {
              const showLabel = shouldShowLabel(rect, innerWidth);
              const showDetails = shouldShowDetails(rect, innerWidth);
              const textColor =
                rect.key === "bottom50" || rect.key === "middle40"
                  ? "#1a1a2e"
                  : "#ffffff";

              return (
                <motion.g
                  key={rect.key}
                  initial={{ opacity: 0, x: rect.x, width: 0 }}
                  animate={{
                    opacity: 1,
                    x: rect.x,
                    width: rect.w,
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <motion.rect
                    x={0}
                    y={rect.y}
                    width={rect.w}
                    height={rect.h}
                    fill={rect.color}
                    rx={4}
                    ry={4}
                    initial={{ width: 0 }}
                    animate={{ width: rect.w }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{ opacity: 0.88 }}
                  />

                  {showLabel && (
                    <foreignObject
                      x={0}
                      y={rect.y}
                      width={rect.w}
                      height={rect.h}
                    >
                      <div
                        className="flex flex-col items-center justify-center h-full px-2 text-center select-none"
                        style={{ color: textColor }}
                      >
                        <span className="font-bold text-sm leading-tight">
                          {rect.label}
                        </span>
                        <span className="font-semibold text-lg leading-tight mt-1 tabular-nums">
                          {rect.wealthShare.toFixed(1)}%
                        </span>
                        {showDetails && (
                          <>
                            <span className="text-[11px] leading-tight mt-1.5 opacity-80">
                              {formatPeopleCount(rect.peopleCount)}
                            </span>
                            {rect.key === "bottom50" && (
                              <span className="text-[10px] leading-tight mt-1 opacity-70 italic">
                                sharing just {rect.wealthShare.toFixed(1)}%
                              </span>
                            )}
                            {rect.key === "top001" && (
                              <span className="text-[10px] leading-tight mt-1 opacity-70 italic">
                                of all wealth
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </foreignObject>
                  )}
                </motion.g>
              );
            })}
          </AnimatePresence>
        </Group>
      </svg>

      {/* Legend — always readable, even for tiny segments */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 mt-4">
        {rectangles.map((rect) => (
          <div key={rect.key} className="flex items-center gap-2 min-w-0">
            <span
              className="inline-block w-3 h-3 rounded-sm shrink-0"
              style={{ backgroundColor: rect.color }}
            />
            <div className="min-w-0">
              <span className="text-text-primary text-sm font-medium">
                {rect.label}
              </span>
              <span className="text-text-secondary text-sm ml-1.5 tabular-nums">
                {rect.wealthShare.toFixed(1)}%
              </span>
              <span className="text-text-muted text-xs ml-1">
                ({formatPeopleCount(rect.peopleCount)})
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Callout text */}
      <motion.p
        className="text-center text-text-secondary text-sm mt-4 max-w-lg mx-auto leading-relaxed"
        key={country.code}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <span className="font-semibold" style={{ color: COLORS.top001 }}>
          {formatPeopleCount(topPeopleCount)}
        </span>{" "}
        own{" "}
        <span className="font-semibold tabular-nums">{topShare.toFixed(1)}%</span>{" "}
        of all wealth, while{" "}
        <span className="font-semibold" style={{ color: COLORS.bottom50 }}>
          {formatPeopleCount(bottomPeopleCount)}
        </span>{" "}
        share just{" "}
        <span className="font-semibold tabular-nums">
          {bottomShare.toFixed(1)}%
        </span>
      </motion.p>
    </div>
  );
}
