/**
 * Shared types for the comedic-line content modules.
 *
 * Each locale provides one `ComedicLines` object with:
 *   - `percentileTiers` — 10 tiers covering 0-100, each with ~12 lines
 *   - `yearsTiers` — 6 tiers covering 0-Infinity, each with ~10-12 lines
 *
 * Lines may include `{country}`, `{name}`, or `{years}` placeholders that
 * are interpolated by the caller.
 */

export interface PercentileTier {
  readonly min: number;
  readonly max: number;
  readonly lines: readonly string[];
}

export interface YearsTier {
  readonly min: number;
  readonly max: number;
  readonly lines: readonly string[];
}

export interface ComedicLines {
  readonly percentileTiers: readonly PercentileTier[];
  readonly yearsTiers: readonly YearsTier[];
}
