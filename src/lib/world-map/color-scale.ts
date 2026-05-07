/**
 * Sequential color scale helpers for the choropleth.
 *
 * Linear interpolation between two RGB colors based on a normalized [0, 1]
 * input. Sufficient for our 5-bin choropleth bands without pulling in d3-scale.
 */

export type RGB = readonly [number, number, number];

export function hexToRgb(hex: string): RGB {
  const h = hex.replace(/^#/, "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

export function rgbToHex([r, g, b]: RGB): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

/** Linearly interpolate between two RGB triplets. `t` clamped to [0, 1]. */
export function lerpColor(a: RGB, b: RGB, t: number): RGB {
  const tt = Math.max(0, Math.min(1, t));
  return [a[0] + (b[0] - a[0]) * tt, a[1] + (b[1] - a[1]) * tt, a[2] + (b[2] - a[2]) * tt];
}

/**
 * Build a 5-stop sequential interpolator across an arbitrary number of
 * color stops. Returns a function `(t: 0..1) => hex`.
 */
export function makeSequentialScale(stops: readonly string[]): (t: number) => string {
  const rgbStops = stops.map(hexToRgb);
  if (rgbStops.length < 2) {
    return () => stops[0] ?? "#000";
  }
  return (t: number) => {
    const tt = Math.max(0, Math.min(1, t));
    const segs = rgbStops.length - 1;
    const seg = Math.min(segs - 1, Math.floor(tt * segs));
    const local = tt * segs - seg;
    return rgbToHex(lerpColor(rgbStops[seg], rgbStops[seg + 1], local));
  };
}

export interface ScaleConfig {
  /** Smallest value mapped to the first color. */
  readonly min: number;
  /** Largest value mapped to the last color. Anything above is clamped. */
  readonly max: number;
  /** Color stops, low → high. */
  readonly stops: readonly string[];
  /** Color used for countries with no data. */
  readonly noData: string;
}

export function valueToColor(value: number | null | undefined, cfg: ScaleConfig): string {
  if (value == null || !Number.isFinite(value)) return cfg.noData;
  const t = (value - cfg.min) / Math.max(1e-9, cfg.max - cfg.min);
  const interp = makeSequentialScale(cfg.stops);
  return interp(Math.max(0, Math.min(1, t)));
}

/** Build evenly-spaced legend bins for the user-facing scale. */
export function buildLegendBins(
  cfg: ScaleConfig,
  count = 5,
): ReadonlyArray<{ readonly from: number; readonly to: number; readonly color: string }> {
  const interp = makeSequentialScale(cfg.stops);
  const out: { from: number; to: number; color: string }[] = [];
  for (let i = 0; i < count; i++) {
    const tFrom = i / count;
    const tTo = (i + 1) / count;
    const from = cfg.min + tFrom * (cfg.max - cfg.min);
    const to = cfg.min + tTo * (cfg.max - cfg.min);
    out.push({ from, to, color: interp((tFrom + tTo) / 2) });
  }
  return out;
}
