"use client";

import { useMemo, useState, useCallback } from "react";
import { Group } from "@visx/group";
import { motion, AnimatePresence } from "framer-motion";
import { type CountryData } from "@/data/wealth-data";
import { getDetailedShares, type DetailedWealthShares } from "@/data/billionaires";
import { formatNumber } from "@/lib/format";
import { useDictionary } from "@/components/LanguageProvider";
import { interpolate, type Dictionary } from "@/lib/i18n/dictionary";
import ChartTooltip from "./ChartTooltip";

interface WealthHoardingChartProps {
  readonly country: CountryData;
  readonly width: number;
  readonly height: number;
}

// Paul Tol qualitative palette — colorblind-safe
const COLORS: Record<keyof DetailedWealthShares, string> = {
  bottom50: "#44AA99",
  middle40: "#88CCEE",
  next9: "#DDCC77",
  next09: "#CC6677",
  next009: "#AA4499",
  top001: "#882255",
};

function buildGroupLabels(
  t: Dictionary,
): Record<keyof DetailedWealthShares, string> {
  return {
    bottom50: t.charts.bottom50,
    middle40: t.charts.middle40,
    next9: t.charts.top10to1,
    next09: t.charts.top1to01,
    next009: t.charts.top01to001,
    top001: t.charts.top001,
  };
}

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

function formatPeopleCount(count: number, t: Dictionary): string {
  if (count >= 1_000_000) {
    const millions = count / 1_000_000;
    const value =
      millions >= 10 ? `${Math.round(millions)}` : `${millions.toFixed(1)}`;
    return interpolate(t.charts.peopleMillionsTemplate, { count: value });
  }
  if (count >= 1_000) {
    return interpolate(t.charts.peopleThousandsTemplate, {
      count: formatNumber(Math.round(count / 1_000)),
    });
  }
  return interpolate(t.charts.peopleTemplate, { count: formatNumber(count) });
}

function buildRectangles(
  shares: DetailedWealthShares,
  population: number,
  innerWidth: number,
  innerHeight: number,
  groupLabels: Record<keyof DetailedWealthShares, string>,
): readonly RectData[] {
  // Calculate widths proportional to wealth share, laid out horizontally
  // Clamp negative shares (real: bottom 50% can have negative net wealth) to 0 for display
  const clampedShares = Object.fromEntries(
    SEGMENT_KEYS.map((k) => [k, Math.max(0, shares[k])])
  ) as Record<string, number>;
  const totalShare = SEGMENT_KEYS.reduce((sum, k) => sum + clampedShares[k], 0);

  let currentX = 0;
  return SEGMENT_KEYS.map((key) => {
    const fraction = totalShare > 0 ? clampedShares[key] / totalShare : 0;
    const rectWidth = fraction * innerWidth;
    const rect: RectData = {
      key,
      label: groupLabels[key],
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

function shouldShowLabel(rect: RectData): boolean {
  // Only show label if the bar is wide enough for text to be readable (min ~40px)
  return rect.w >= 40;
}

function shouldShowPercent(rect: RectData): boolean {
  // Need a bit more room for the percentage line (~60px)
  return rect.w >= 60;
}

export default function WealthHoardingChart({
  country,
  width,
  height,
}: WealthHoardingChartProps) {
  const [hoveredRect, setHoveredRect] = useState<RectData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const t = useDictionary();
  const groupLabels = useMemo(() => buildGroupLabels(t), [t]);

  const shares = useMemo(
    () => getDetailedShares(country),
    [country.code, country.wealthShares.bottom50, country.wealthShares.middle40, country.wealthShares.top10, country.wealthShares.top1],
  );

  const innerWidth = width - MARGIN.left - MARGIN.right;
  const innerHeight = height - MARGIN.top - MARGIN.bottom;

  const rectangles = useMemo(
    () =>
      buildRectangles(shares, country.population, innerWidth, innerHeight, groupLabels),
    [shares, country.population, innerWidth, innerHeight, groupLabels]
  );

  const topGroup = useMemo(
    () => rectangles.find((r) => r.key === "top001"),
    [rectangles]
  );

  const bottomGroup = useMemo(
    () => rectangles.find((r) => r.key === "bottom50"),
    [rectangles]
  );

  const handleMouseMove = useCallback(
    (rect: RectData, e: React.MouseEvent<SVGRectElement>) => {
      const svg = e.currentTarget.closest("svg");
      if (!svg) return;
      const point = svg.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - point.left,
        y: e.clientY - point.top,
      });
      setHoveredRect(rect);
    },
    []
  );

  const handleTouchStart = useCallback(
    (rect: RectData, e: React.TouchEvent<SVGRectElement>) => {
      const touch = e.touches[0];
      if (!touch) return;
      const svg = e.currentTarget.closest("svg");
      if (!svg) return;
      const point = svg.getBoundingClientRect();
      setTooltipPos({
        x: touch.clientX - point.left,
        y: touch.clientY - point.top,
      });
      setHoveredRect(rect);
    },
    []
  );

  const handleTouchEnd = useCallback(() => {
    setHoveredRect(null);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredRect(null);
  }, []);

  if (width < 10) return null;

  const topPeopleCount = topGroup?.peopleCount ?? 0;
  const bottomPeopleCount = bottomGroup?.peopleCount ?? 0;
  const topShare = topGroup?.wealthShare ?? 0;
  const bottomShare = bottomGroup?.wealthShare ?? 0;

  return (
    <div className="relative">
      <svg width={width} height={height} role="img" aria-label={`Wealth concentration by population group for ${country.name}`}>
        <Group left={MARGIN.left} top={MARGIN.top}>
          <AnimatePresence mode="wait">
            {rectangles.map((rect) => {
              const showLabel = shouldShowLabel(rect);
              const showPercent = shouldShowPercent(rect);
              const textColor =
                rect.key === "bottom50" || rect.key === "middle40" || rect.key === "next9"
                  ? "#1a1a2e"
                  : "#ffffff";

              return (
                <motion.g
                  key={rect.key}
                  initial={{ opacity: 0, x: rect.x }}
                  animate={{
                    opacity: 1,
                    x: rect.x,
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
                    style={{ opacity: 0.88, cursor: "pointer" }}
                    onMouseMove={(e) => handleMouseMove(rect, e)}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={(e) => handleTouchStart(rect, e)}
                    onTouchEnd={handleTouchEnd}
                  />

                  {showLabel && (
                    <foreignObject
                      x={0}
                      y={rect.y}
                      width={rect.w}
                      height={rect.h}
                      style={{ pointerEvents: "none" }}
                    >
                      <div
                        className="flex flex-col items-center justify-center h-full px-1 text-center select-none overflow-hidden"
                        style={{ color: textColor }}
                      >
                        <span className="font-semibold text-[10px] leading-tight truncate w-full">
                          {rect.label}
                        </span>
                        {showPercent && (
                          <span className="font-bold text-xs leading-tight mt-0.5 tabular-nums">
                            {rect.wealthShare.toFixed(1)}%
                          </span>
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

      {/* Tooltip on hover */}
      {hoveredRect && (
        <ChartTooltip
          left={tooltipPos.x}
          top={tooltipPos.y}
          containerWidth={width}
          containerHeight={height}
        >
          <div className="text-xs space-y-1">
            <p className="font-semibold text-text-primary flex items-center gap-1.5">
              <span
                className="inline-block w-2 h-2 rounded-sm shrink-0"
                style={{ backgroundColor: hoveredRect.color }}
              />
              {hoveredRect.label}
            </p>
            <p className="text-text-secondary tabular-nums">
              {t.charts.wealthShare}: <span className="font-medium text-text-primary">{hoveredRect.wealthShare.toFixed(1)}%</span>
            </p>
            <p className="text-text-secondary">
              {formatPeopleCount(hoveredRect.peopleCount, t)}
            </p>
            <p className="text-text-muted text-[10px]">
              {(hoveredRect.populationFraction * 100).toFixed(
                hoveredRect.populationFraction < 0.001 ? 2 : hoveredRect.populationFraction < 0.01 ? 1 : 0
              )}% of the population
            </p>
          </div>
        </ChartTooltip>
      )}

      {/* Legend — always readable, even for tiny segments */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 mt-4">
        {rectangles.map((rect) => (
          <div key={rect.key} className="flex items-center gap-1.5 min-w-0">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: rect.color }}
            />
            <div className="min-w-0 truncate">
              <span className="text-text-primary text-xs sm:text-sm font-medium">
                {rect.label}
              </span>
              <span className="text-text-secondary text-xs sm:text-sm ml-1 tabular-nums">
                {rect.wealthShare.toFixed(1)}%
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
          {formatPeopleCount(topPeopleCount, t)}
        </span>{" "}
        own{" "}
        <span className="font-semibold tabular-nums">{topShare.toFixed(1)}%</span>{" "}
        of all wealth, while{" "}
        <span className="font-semibold" style={{ color: COLORS.bottom50 }}>
          {formatPeopleCount(bottomPeopleCount, t)}
        </span>{" "}
        share just{" "}
        <span className="font-semibold tabular-nums">
          {bottomShare.toFixed(1)}%
        </span>
      </motion.p>
    </div>
  );
}
