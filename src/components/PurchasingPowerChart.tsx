"use client";

import { useMemo, useCallback } from "react";
import { Group } from "@visx/group";
import { LinePath, Line } from "@visx/shape";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { useTooltip, TooltipWithBounds } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import {
  PURCHASING_POWER,
  ECONOMIC_SOURCES,
  type EconomicDataPoint,
} from "@/data/purchasing-power";

interface PurchasingPowerChartProps {
  readonly countryCode: string;
  readonly width: number;
  readonly height: number;
}

interface TooltipPayload {
  readonly year: number;
  readonly wageIndex: number;
  readonly cpiIndex: number;
  readonly housePriceIndex: number;
}

const MARGIN = { top: 50, right: 30, bottom: 55, left: 60 };

const LINES = [
  {
    key: "wageIndex" as const,
    label: "Avg. Wages (real)",
    color: "#7eb8a8",
    dash: undefined,
  },
  {
    key: "cpiIndex" as const,
    label: "Consumer Prices",
    color: "#c9a87c",
    dash: undefined,
  },
  {
    key: "housePriceIndex" as const,
    label: "House Prices (real)",
    color: "#d4878f",
    dash: undefined,
  },
] as const;

export default function PurchasingPowerChart({
  countryCode,
  width,
  height,
}: PurchasingPowerChartProps) {
  const data = PURCHASING_POWER[countryCode];

  const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } =
    useTooltip<TooltipPayload>();

  const innerWidth = width - MARGIN.left - MARGIN.right;
  const innerHeight = height - MARGIN.top - MARGIN.bottom;

  const xScale = useMemo(() => {
    if (!data) return scaleLinear({ domain: [1995, 2023], range: [0, 1] });
    const years = data.series.map((d) => d.year);
    return scaleLinear({
      domain: [Math.min(...years), Math.max(...years)],
      range: [0, innerWidth],
    });
  }, [data, innerWidth]);

  const yScale = useMemo(() => {
    if (!data) return scaleLinear({ domain: [0, 200], range: [1, 0] });
    const allValues = data.series.flatMap((d) => [
      d.wageIndex,
      d.cpiIndex,
      d.housePriceIndex,
    ]);
    const maxVal = Math.max(...allValues);
    const minVal = Math.min(...allValues);
    const padding = (maxVal - minVal) * 0.1;
    return scaleLinear({
      domain: [Math.max(0, Math.floor((minVal - padding) / 10) * 10), Math.ceil((maxVal + padding) / 10) * 10],
      range: [innerHeight, 0],
      nice: true,
    });
  }, [data, innerHeight]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGRectElement>) => {
      if (!data) return;
      const point = localPoint(event);
      if (!point) return;

      const x0 = xScale.invert(point.x - MARGIN.left);
      // Find closest data point
      let closest = data.series[0];
      for (const d of data.series) {
        if (Math.abs(d.year - x0) < Math.abs(closest.year - x0)) {
          closest = d;
        }
      }

      const tooltipY = Math.min(
        Math.max(MARGIN.top, point.y),
        MARGIN.top + innerHeight
      );

      showTooltip({
        tooltipData: {
          year: closest.year,
          wageIndex: closest.wageIndex,
          cpiIndex: closest.cpiIndex,
          housePriceIndex: closest.housePriceIndex,
        },
        tooltipLeft: xScale(closest.year) + MARGIN.left,
        tooltipTop: tooltipY,
      });
    },
    [data, xScale, showTooltip],
  );

  if (!data || width < 10 || height < 10) {
    return (
      <div className="rounded-xl border border-border-subtle bg-bg-card p-8 text-center">
        <p className="text-text-secondary text-lg">
          Economic trend data is not available for this country.
        </p>
        <p className="text-text-muted mt-2 text-sm">
          Data is currently available for the US, UK, France, Germany, and the
          Netherlands.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Legend */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {LINES.map((line) => (
          <div key={line.key} className="flex items-center gap-2">
            <div
              className="h-0.5 w-5 rounded"
              style={{ backgroundColor: line.color }}
            />
            <span className="text-text-secondary text-xs">{line.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-5 border-t border-dashed border-text-muted" />
          <span className="text-text-secondary text-xs">Base (2000)</span>
        </div>
      </div>

      <svg width={width} height={height}>
        <Group left={MARGIN.left} top={MARGIN.top}>
          {/* Grid lines */}
          {yScale.ticks(5).map((tick) => (
            <Line
              key={tick}
              from={{ x: 0, y: yScale(tick) }}
              to={{ x: innerWidth, y: yScale(tick) }}
              stroke="var(--color-border-subtle)"
              strokeWidth={1}
              strokeOpacity={0.5}
            />
          ))}

          {/* Base line at 100 */}
          <Line
            from={{ x: 0, y: yScale(100) }}
            to={{ x: innerWidth, y: yScale(100) }}
            stroke="var(--color-text-muted)"
            strokeWidth={1}
            strokeDasharray="6,4"
            strokeOpacity={0.7}
          />
          <text
            x={innerWidth + 4}
            y={yScale(100)}
            dy="0.35em"
            fontSize={10}
            fill="var(--color-text-muted)"
          >
            100
          </text>

          {/* Data lines */}
          {LINES.map((line) => (
            <LinePath<EconomicDataPoint>
              key={line.key}
              data={data.series as EconomicDataPoint[]}
              x={(d) => xScale(d.year)}
              y={(d) => yScale(d[line.key])}
              stroke={line.color}
              strokeWidth={2.5}
              curve={curveMonotoneX}
            />
          ))}

          {/* Data points */}
          {LINES.map((line) =>
            data.series.map((d) => (
              <circle
                key={`${line.key}-${d.year}`}
                cx={xScale(d.year)}
                cy={yScale(d[line.key])}
                r={3.5}
                fill={line.color}
                stroke="var(--color-bg-primary)"
                strokeWidth={1.5}
              />
            )),
          )}

          {/* Tooltip hover line */}
          {tooltipData && (
            <Line
              from={{ x: xScale(tooltipData.year), y: 0 }}
              to={{ x: xScale(tooltipData.year), y: innerHeight }}
              stroke="var(--color-text-muted)"
              strokeWidth={1}
              strokeDasharray="3,3"
              pointerEvents="none"
            />
          )}

          {/* Axes */}
          <AxisBottom
            top={innerHeight}
            scale={xScale}
            tickValues={data.series.map((d) => d.year)}
            tickFormat={(v) => String(v)}
            stroke="var(--color-border-subtle)"
            tickStroke="var(--color-border-subtle)"
            tickLabelProps={() => ({
              fill: "var(--color-text-muted)",
              fontSize: 11,
              textAnchor: "middle" as const,
              dy: "0.25em",
            })}
          />
          <AxisLeft
            scale={yScale}
            numTicks={5}
            stroke="var(--color-border-subtle)"
            tickStroke="var(--color-border-subtle)"
            tickFormat={(v) => String(v)}
            tickLabelProps={() => ({
              fill: "var(--color-text-muted)",
              fontSize: 11,
              textAnchor: "end" as const,
              dx: "-0.5em",
              dy: "0.35em",
            })}
          />

          {/* Invisible overlay for mouse events */}
          <rect
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onMouseMove={handleMouseMove}
            onMouseLeave={hideTooltip}
          />
        </Group>
      </svg>

      {/* Tooltip */}
      {tooltipData && (
        <TooltipWithBounds
          left={(tooltipLeft ?? 0) + 12}
          top={(tooltipTop ?? 0) - 12}
          className="!bg-bg-card !border !border-border-subtle !rounded-lg !shadow-lg !px-3 !py-2"
          unstyled
          style={{ pointerEvents: "none" }}
        >
          <p className="text-text-primary text-sm font-semibold mb-1.5">
            {tooltipData.year}
          </p>
          {LINES.map((line) => (
            <div
              key={line.key}
              className="flex items-center justify-between gap-4 text-xs"
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: line.color }}
                />
                <span className="text-text-secondary">{line.label}</span>
              </span>
              <span className="text-text-primary font-medium tabular-nums">
                {tooltipData[line.key].toFixed(1)}
              </span>
            </div>
          ))}
          <p className="text-text-muted text-[10px] mt-1.5 border-t border-border-subtle pt-1">
            Indexed: 2000 = 100
          </p>
        </TooltipWithBounds>
      )}

      {/* Sources */}
      <div className="mt-4 space-y-0.5 text-center">
        <p className="text-text-muted text-[10px]">
          Wages:{" "}
          <a
            href={ECONOMIC_SOURCES.wages.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-periwinkle hover:underline"
          >
            {ECONOMIC_SOURCES.wages.name}
          </a>
          {" · "}CPI:{" "}
          <a
            href={ECONOMIC_SOURCES.cpi.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-periwinkle hover:underline"
          >
            {ECONOMIC_SOURCES.cpi.name}
          </a>
          {" · "}House prices:{" "}
          <a
            href={ECONOMIC_SOURCES.housePrices.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-periwinkle hover:underline"
          >
            {ECONOMIC_SOURCES.housePrices.name}
          </a>
        </p>
      </div>
    </div>
  );
}
