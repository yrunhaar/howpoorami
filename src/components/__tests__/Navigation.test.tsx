import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Navigation from "../Navigation";

// ── Mocks ──────────────────────────────────────────────────────────

let mockPathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/ThemeProvider", () => ({
  useTheme: () => ({ theme: "dark", toggleTheme: vi.fn() }),
}));

// ── Tests ──────────────────────────────────────────────────────────

describe("Navigation", () => {
  beforeEach(() => {
    mockPathname = "/";
  });

  it("renders nav items", () => {
    render(<Navigation />);

    // "How Poor Am I?" appears as both the brand link and a nav item
    const howPoorLinks = screen.getAllByText("How Poor Am I?");
    expect(howPoorLinks.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("How Long?")).toBeInTheDocument();
  });

  it("home link is active on country routes", () => {
    mockPathname = "/us";
    render(<Navigation />);

    // The home link "How Poor Am I?" should be marked active (aria-current="page")
    const homeLinks = screen.getAllByText("How Poor Am I?");
    // There are two: the brand link and the nav item. The nav item has aria-current.
    const activeLink = homeLinks.find(
      (el) => el.getAttribute("aria-current") === "page",
    );
    expect(activeLink).toBeDefined();
  });

  it("how-long link is active on /how-long routes", () => {
    mockPathname = "/how-long";
    render(<Navigation />);

    const howLongLink = screen.getByText("How Long?");
    expect(howLongLink.getAttribute("aria-current")).toBe("page");
  });

  it("compare-countries link is active on /compare-countries (and does not also activate How Long?)", () => {
    mockPathname = "/compare-countries";
    render(<Navigation />);

    const compareLink = screen.getByText("Compare");
    expect(compareLink.getAttribute("aria-current")).toBe("page");

    const howLongLink = screen.getByText("How Long?");
    expect(howLongLink.getAttribute("aria-current")).toBeNull();
  });
});
