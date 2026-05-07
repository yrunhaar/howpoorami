"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { geoNaturalEarth1, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import type {
  Topology,
  GeometryCollection,
  GeometryObject,
} from "topojson-specification";
import topology from "@/lib/world-map/topology.json";
import { numericToAlpha2 } from "@/lib/world-map/iso-numeric";
import {
  buildLegendBins,
  valueToColor,
  type ScaleConfig,
} from "@/lib/world-map/color-scale";

const WIDTH = 1000;
const HEIGHT = 520;

interface CountryFeatureProps {
  readonly name?: string;
}

interface MapTooltip {
  readonly code: string;
  readonly name: string;
  readonly value: number | null;
  readonly x: number;
  readonly y: number;
}

interface WorldMapProps {
  /** ISO alpha-2 → metric value. Countries not in the map render as "no data". */
  readonly dataByCountry: Readonly<Record<string, number>>;
  /** Color/range config. */
  readonly scale: ScaleConfig;
  /** Display unit (e.g. "tCO2", "× income"). */
  readonly unit: string;
  /**
   * Where to navigate when a country is clicked. Defaults to `/{code}`
   * (lowercase). Set to null to disable navigation.
   */
  readonly hrefForCountry?: ((code: string) => string) | null;
  /** Highlight a specific country with a thicker stroke (e.g. user's own). */
  readonly highlightCode?: string | null;
  /** Locale-friendly value formatter (defaults to .toFixed(1)). */
  readonly formatValue?: (v: number) => string;
  /** Strings — exposed for i18n. */
  readonly noDataLabel?: string;
  readonly belowLabel?: string;
  readonly aboveLabel?: string;
}

/**
 * Single-view world choropleth. Pure SVG, no external runtime, no tile
 * dependency. Built once with d3-geo at render time; ~50 KB JSON + ~30 KB
 * d3-geo client bundle on the page where it ships.
 *
 * The component is locale-agnostic: it accepts ready-formatted strings
 * and a `dataByCountry` map. The owning page wires app-specific data and
 * dictionary values.
 */
export default function WorldMap({
  dataByCountry,
  scale,
  unit,
  hrefForCountry,
  highlightCode,
  formatValue,
  noDataLabel = "No data",
  belowLabel,
  aboveLabel,
}: WorldMapProps) {
  const router = useRouter();
  const [tooltip, setTooltip] = useState<MapTooltip | null>(null);

  // Project once on render.
  const { features, paths } = useMemo(() => {
    const topo = topology as unknown as Topology;
    const collection = topo.objects.countries as GeometryCollection;
    const fc = feature(topo, collection) as unknown as {
      readonly type: "FeatureCollection";
      readonly features: ReadonlyArray<{
        readonly id?: string | number;
        readonly properties?: CountryFeatureProps;
        readonly geometry: GeometryObject;
      }>;
    };
    const projection = geoNaturalEarth1().fitSize([WIDTH, HEIGHT], {
      type: "Sphere",
    });
    const path = geoPath(projection);
    const out = fc.features.map((f) => {
      const code = numericToAlpha2(String(f.id ?? ""));
      const value = code != null ? dataByCountry[code] ?? null : null;
      return {
        code,
        name: f.properties?.name ?? code ?? "",
        d: path(f as unknown as GeoPermissibleObjects) ?? "",
        value,
      };
    });
    return { features: fc.features, paths: out };
  }, [dataByCountry]);
  void features;

  const formatter = formatValue ?? ((v: number) => v.toFixed(1));

  const onPathEnter = (
    e: React.MouseEvent<SVGPathElement>,
    code: string | null,
    name: string,
    value: number | null,
  ): void => {
    if (!code) return;
    const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement | null)?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      code,
      name,
      value,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const onPathClick = (code: string | null): void => {
    if (!code || hrefForCountry === null) return;
    const href = (hrefForCountry ?? defaultHref)(code);
    router.push(href);
  };

  const onPathKeyDown = (e: React.KeyboardEvent<SVGPathElement>, code: string | null) => {
    if (!code || hrefForCountry === null) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push((hrefForCountry ?? defaultHref)(code));
    }
  };

  const legendBins = useMemo(() => buildLegendBins(scale, 5), [scale]);

  // City-state rail: countries with data but no path on the 110m world map
  // (they're too small to render at this resolution).
  const drawnCodes = new Set(paths.map((p) => p.code).filter((c): c is string => !!c));
  const cityStateCodes = Object.keys(dataByCountry).filter((c) => !drawnCodes.has(c));

  return (
    <div className="w-full">
      <div className="relative">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full h-auto"
          role="img"
          aria-label="World choropleth map"
          onMouseLeave={() => setTooltip(null)}
        >
          <defs>
            <pattern id="no-data-pattern" patternUnits="userSpaceOnUse" width="6" height="6">
              <rect width="6" height="6" fill={scale.noData} />
              <path
                d="M 0 6 L 6 0"
                stroke="rgba(0,0,0,0.04)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>

          {paths.map((p, i) => {
            const fill =
              p.value == null
                ? "url(#no-data-pattern)"
                : valueToColor(p.value, scale);
            const isHighlight = p.code != null && p.code === highlightCode;
            const interactive = p.code != null && p.value != null;
            return (
              <path
                key={`${p.code ?? "unknown"}-${i}`}
                d={p.d}
                fill={fill}
                stroke={isHighlight ? "var(--text-primary)" : "var(--bg-primary)"}
                strokeWidth={isHighlight ? 1.4 : 0.4}
                tabIndex={interactive ? 0 : -1}
                style={{
                  cursor: interactive ? "pointer" : "default",
                  outline: "none",
                  transition: "fill 200ms ease",
                }}
                onMouseEnter={(e) => onPathEnter(e, p.code, p.name, p.value)}
                onMouseMove={(e) => onPathEnter(e, p.code, p.name, p.value)}
                onClick={() => onPathClick(p.code)}
                onKeyDown={(e) => onPathKeyDown(e, p.code)}
                aria-label={
                  p.value != null
                    ? `${p.name}: ${formatter(p.value)} ${unit}`
                    : `${p.name}: ${noDataLabel}`
                }
              />
            );
          })}
        </svg>

        {tooltip && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg border border-border-subtle bg-bg-card px-3 py-1.5 text-xs shadow-lg"
            style={{
              left: tooltip.x + 12,
              top: tooltip.y + 12,
              transform: "translate(0, 0)",
            }}
          >
            <div className="font-semibold text-text-primary">{tooltip.name}</div>
            <div className="text-text-muted tabular-nums mt-0.5">
              {tooltip.value != null
                ? `${formatter(tooltip.value)} ${unit}`
                : noDataLabel}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-text-muted">
        <span className="text-text-secondary font-medium">{belowLabel ?? "Lower"}</span>
        <div className="flex items-center">
          {legendBins.map((bin, i) => (
            <div
              key={i}
              className="h-3 w-10 first:rounded-l-md last:rounded-r-md border-y border-border-subtle/60"
              style={{ background: bin.color }}
              title={`${formatter(bin.from)} – ${formatter(bin.to)} ${unit}`}
            />
          ))}
        </div>
        <span className="text-text-secondary font-medium">{aboveLabel ?? "Higher"}</span>
        <span className="ml-auto inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="inline-block w-3 h-3 rounded-sm border border-border-subtle"
            style={{ background: "var(--bg-secondary)" }}
          />
          {noDataLabel}
        </span>
      </div>

      {/* City-state rail: countries with data but no path at 110m resolution */}
      {cityStateCodes.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {cityStateCodes.map((code) => {
            const value = dataByCountry[code];
            const isHighlight = code === highlightCode;
            return (
              <button
                key={code}
                type="button"
                onClick={() =>
                  hrefForCountry !== null && router.push((hrefForCountry ?? defaultHref)(code))
                }
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${
                  isHighlight
                    ? "border-text-primary text-text-primary"
                    : "border-border-subtle text-text-secondary hover:text-text-primary"
                }`}
                style={{ background: valueToColor(value, scale) }}
              >
                <span className="font-semibold">{code}</span>
                <span className="tabular-nums opacity-80">{formatter(value)}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function defaultHref(code: string): string {
  return `/${code.toLowerCase()}`;
}
