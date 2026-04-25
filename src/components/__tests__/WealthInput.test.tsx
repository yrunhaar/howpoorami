import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import WealthInput from "../WealthInput";
import type { CountryData } from "@/data/wealth-data";

// ── Mocks ──────────────────────────────────────────────────────────

vi.mock("@/data/wealth-data", () => ({
  findPercentile: vi.fn(() => 55),
}));

vi.mock("@/lib/format", () => ({
  formatCurrency: vi.fn((v: number) => `$${v.toLocaleString()}`),
  getCurrencySymbol: vi.fn(() => "$"),
}));

vi.mock("@/lib/i18n/content/comedic", () => ({
  getPercentileLineFor: vi.fn(() => "Not bad at all!"),
  getYearsToMatchLineFor: vi.fn(() => "Take a long time."),
}));

vi.mock("@/lib/wealth-estimate", () => ({
  DEFAULT_INCOME_FACTORS: {
    age: "30-39",
    householdSize: "1",
    hasProperty: false,
    propertyValue: "0",
    hasMortgage: false,
    mortgageRemaining: "0",
    hasDebts: false,
    debtLevel: "none",
    savingsRate: "medium",
  },
  estimateWealthRange: vi.fn(() => ({ low: 50000, high: 150000 })),
  computePercentileRange: vi.fn(() => ({ low: 40, mid: 55, high: 70 })),
}));

vi.mock("../IncomeRefinementPanel", () => ({
  default: () => <div data-testid="refinement-panel">Refinement Panel</div>,
}));

// ── Helpers ────────────────────────────────────────────────────────

const MOCK_COUNTRY: CountryData = {
  code: "US",
  name: "United States",
  flag: "us",
  wealthShares: { top1: 30, top10: 70, middle40: 25, bottom50: 5 },
  incomeShares: { top1: 20, top10: 50, middle40: 35, bottom50: 15 },
  giniWealth: 0.85,
  giniIncome: 0.39,
  medianWealthPerAdult: 80000,
  meanWealthPerAdult: 500000,
  population: 330,
  currency: "USD",
  medianIncome: 40000,
  historicalWealthTop1: [],
  historicalWealthTop10: [],
  historicalWealthBottom50: [],
};

function renderWealthInput(onPercentileChange = vi.fn()) {
  return render(
    <WealthInput country={MOCK_COUNTRY} onPercentileChange={onPercentileChange} />,
  );
}

// ── Tests ──────────────────────────────────────────────────────────

describe("WealthInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    renderWealthInput();
    expect(screen.getByLabelText(/enter your net wealth/i)).toBeInTheDocument();
  });

  it('shows "Net Wealth" mode by default', () => {
    renderWealthInput();
    // The Net Wealth button should have the active styling class
    const wealthButton = screen.getByRole("button", { name: /net wealth/i });
    expect(wealthButton.className).toContain("bg-accent-periwinkle");

    // Label should reference net wealth
    expect(screen.getByLabelText(/enter your net wealth/i)).toBeInTheDocument();
  });

  it("entering a value updates the display", () => {
    const onChange = vi.fn();
    renderWealthInput(onChange);

    const input = screen.getByLabelText(/enter your net wealth/i);
    fireEvent.change(input, { target: { value: "50000" } });

    // The callback should have been called with the computed percentile
    expect(onChange).toHaveBeenCalledWith(55);
  });

  it("zero income shows validation message", () => {
    renderWealthInput();

    // Switch to income mode
    const incomeButton = screen.getByRole("button", { name: /annual income/i });
    fireEvent.click(incomeButton);

    // Enter zero
    const input = screen.getByLabelText(/enter your gross.*annual income/i);
    fireEvent.change(input, { target: { value: "0" } });

    expect(
      screen.getByText(/enter your annual income to see where you stand\. for zero/i),
    ).toBeInTheDocument();
  });

  it("negative wealth is accepted in wealth mode", () => {
    const onChange = vi.fn();
    renderWealthInput(onChange);

    const input = screen.getByLabelText(/enter your net wealth/i);
    fireEvent.change(input, { target: { value: "-25000" } });

    // Should still compute a percentile (findPercentile mock returns 55)
    expect(onChange).toHaveBeenCalledWith(55);
  });
});
