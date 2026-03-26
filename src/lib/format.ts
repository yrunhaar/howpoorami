export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(1)}B`;
    }
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}K`;
    }
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatYears(days: number): string {
  const years = Math.floor(days / 365);
  if (years >= 1000) {
    return `${formatNumber(years)} years`;
  }
  if (years >= 1) {
    return `${formatNumber(years)} year${years !== 1 ? "s" : ""}`;
  }
  return `${formatNumber(days)} day${days !== 1 ? "s" : ""}`;
}
