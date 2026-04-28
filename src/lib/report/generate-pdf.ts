/**
 * Client-side PDF report generator.
 *
 * Builds a multi-page personal wealth-inequality report from the user's
 * net-worth input + country data + active locale. All work happens in the
 * browser via jsPDF — nothing leaves the device, satisfying the privacy
 * promise on the landing page.
 *
 * The report is intentionally typographic + primitive-graphic. We don't
 * try to rasterize the live React/visx charts; instead we redraw the same
 * data using jsPDF primitives styled to match the site's palette. This
 * keeps the bundle small and the output crisp at any zoom.
 *
 * Structure (one page each unless flagged):
 *   1. Cover                          — headline percentile, net-worth box
 *   2. Where you stand + wealth share — stacked bar with marker + side-by-side
 *                                       population vs wealth bars
 *   3. Wealth in context              — table of national thresholds with
 *                                       comparison bars
 *   4. Cross-country comparison       — same wealth, 5 other countries
 *   5. Scale of the gap               — log-scale bars (you / median / mean /
 *                                       top 1% avg / richest)
 *   6. Century of change + double gap + closing       — combined editorial
 *      and small Ko-fi tip ribbon
 *
 * Note on fonts: jsPDF's bundled Helvetica only covers Latin glyphs. For
 * Chinese/Japanese the renderer substitutes at view time. The data stays
 * legible — improving CJK typography is a follow-up if usage justifies it.
 */

import jsPDF from "jspdf";
import QRCode from "qrcode";
import {
  ALL_COUNTRY_MAP,
  type AllCountryCode,
} from "@/data/countries-extended";
import {
  findPercentile,
  getWealthThresholds,
  type CountryData,
} from "@/data/wealth-data";
import { RICHEST_BY_COUNTRY } from "@/data/billionaires";
import { toUSD, fromUSD } from "@/lib/currency";
import { formatCurrency } from "@/lib/format";
import { getDictionary } from "@/lib/i18n";
import { interpolate } from "@/lib/i18n/dictionary";
import { localizedCountryName } from "@/lib/i18n/country-names";
import type { LocaleCode } from "@/lib/i18n/locales";
import type { ReportInputs } from "./types";

const KOFI_URL = "https://ko-fi.com/yrunhaar";

// A4 in millimetres. Margins kept tight enough that two charts can sit
// comfortably on one page without crowding.
const PAGE_W = 210;
const PAGE_H = 297;
const M = 18; // outer page margin
const W = PAGE_W - M * 2;

// Site-derived palette, flattened to RGB triples for jsPDF. Matches the
// LIGHT-mode CSS variables in globals.css so the PDF reads the same as
// the website at default theme.
const C = {
  ink: [28, 25, 23] as const,
  body: [68, 64, 60] as const,
  muted: [120, 113, 108] as const,
  rule: [214, 207, 199] as const,
  bandSoft: [245, 240, 235] as const,
  amber: [153, 119, 0] as const,
  amberSoft: [255, 247, 220] as const,
  rose: [165, 64, 78] as const,
  roseSoft: [253, 232, 235] as const,
  sage: [45, 142, 122] as const,
  sageSoft: [222, 240, 235] as const,
  periwinkle: [49, 112, 160] as const,
  periwinkleSoft: [222, 235, 247] as const,
  lavender: [123, 58, 150] as const,
  lavenderSoft: [240, 230, 248] as const,
};
type Color = readonly [number, number, number];

interface DrawContext {
  readonly doc: jsPDF;
  readonly t: ReturnType<typeof getDictionary>;
  readonly localeCountryName: string;
  readonly country: CountryData;
  cursorY: number;
  pageNumber: number;
}

// ─── Low-level draw helpers ────────────────────────────────────────────────

function setText(doc: jsPDF, c: Color): void {
  doc.setTextColor(c[0], c[1], c[2]);
}
function setFill(doc: jsPDF, c: Color): void {
  doc.setFillColor(c[0], c[1], c[2]);
}
function setStroke(doc: jsPDF, c: Color): void {
  doc.setDrawColor(c[0], c[1], c[2]);
}

function ensureSpace(ctx: DrawContext, needed: number): void {
  if (ctx.cursorY + needed > PAGE_H - M - 14) {
    drawFooter(ctx);
    ctx.doc.addPage();
    ctx.pageNumber += 1;
    ctx.cursorY = M;
  }
}

function newPage(ctx: DrawContext): void {
  drawFooter(ctx);
  ctx.doc.addPage();
  ctx.pageNumber += 1;
  ctx.cursorY = M;
}

function drawFooter(ctx: DrawContext): void {
  const { doc, t, pageNumber } = ctx;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setText(doc, C.muted);
  doc.text(t.report.pdfFooterAttribution, M, PAGE_H - 9);
  doc.text(`${t.report.pdfPageLabel} ${pageNumber}`, PAGE_W - M, PAGE_H - 9, {
    align: "right",
  });
}

// Numbered, color-chipped section heading. Numbered chip mirrors the
// website's section dividers and gives the PDF a research-brief tone.
function sectionHeading(
  ctx: DrawContext,
  number: string,
  text: string,
  accent: Color = C.amber,
): void {
  ensureSpace(ctx, 22);
  ctx.cursorY += 4;
  const { doc } = ctx;

  // chip
  setFill(doc, accent);
  const chipW = 7;
  const chipH = 7;
  const chipY = ctx.cursorY;
  doc.roundedRect(M, chipY, chipW, chipH, 1.4, 1.4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setText(doc, [255, 255, 255]);
  doc.text(number, M + chipW / 2, chipY + chipH / 2 + 1.4, { align: "center" });

  // title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  setText(doc, C.ink);
  doc.text(text, M + chipW + 4, chipY + chipH / 2 + 1.6);

  ctx.cursorY = chipY + chipH + 6;
}

function paragraph(
  ctx: DrawContext,
  text: string,
  opts: {
    readonly size?: number;
    readonly weight?: "normal" | "bold";
    readonly color?: Color;
    readonly leadingMm?: number;
    readonly marginTop?: number;
    readonly marginBottom?: number;
    readonly maxWidth?: number;
    readonly x?: number;
  } = {},
): void {
  const {
    size = 10.5,
    weight = "normal",
    color = C.body,
    leadingMm = 4.6,
    marginTop = 0,
    marginBottom = 4,
    maxWidth = W,
    x = M,
  } = opts;
  const { doc } = ctx;
  doc.setFont("helvetica", weight);
  doc.setFontSize(size);
  setText(doc, color);

  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  ctx.cursorY += marginTop;
  ensureSpace(ctx, lines.length * leadingMm + marginBottom);
  // splitTextToSize returns an array; jsPDF expects a string[] for multiline.
  doc.text(lines, x, ctx.cursorY + leadingMm * 0.7);
  ctx.cursorY += lines.length * leadingMm + marginBottom;
}

// ─── Higher-level primitives ───────────────────────────────────────────────

interface BarSegment {
  readonly label: string;
  readonly weight: number; // determines visual width within the bar
  readonly color: Color;
  readonly subLabel?: string;
}

/** Stacked horizontal bar. Width per segment is proportional to `weight`. */
function stackedBar(
  ctx: DrawContext,
  x: number,
  y: number,
  width: number,
  height: number,
  segments: readonly BarSegment[],
): void {
  const { doc } = ctx;
  const total = segments.reduce((s, seg) => s + Math.max(0, seg.weight), 0);
  if (total <= 0) return;

  // Outer rounded background so the bar feels card-like.
  setFill(doc, C.bandSoft);
  doc.roundedRect(x - 0.4, y - 0.4, width + 0.8, height + 0.8, 1.5, 1.5, "F");

  let cx = x;
  for (const seg of segments) {
    const segW = (Math.max(0, seg.weight) / total) * width;
    setFill(doc, seg.color);
    doc.rect(cx, y, segW, height, "F");
    if (segW > 18) {
      setText(doc, [255, 255, 255]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(`${seg.weight.toFixed(0)}%`, cx + segW / 2, y + height / 2 + 1, {
        align: "center",
      });
    }
    cx += segW;
  }

  // Captions under the bar.
  cx = x;
  for (const seg of segments) {
    const segW = (Math.max(0, seg.weight) / total) * width;
    if (segW > 16) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      setText(doc, C.muted);
      doc.text(seg.label, cx + segW / 2, y + height + 4, { align: "center" });
      if (seg.subLabel) {
        doc.text(seg.subLabel, cx + segW / 2, y + height + 8, {
          align: "center",
        });
      }
    }
    cx += segW;
  }
}

/** Tick marker over a horizontal bar. Maps `value` (0–100) to a tick X. */
function barMarker(
  ctx: DrawContext,
  barX: number,
  barY: number,
  barW: number,
  barH: number,
  percent: number,
  label: string,
  accent: Color = C.ink,
): void {
  const { doc } = ctx;
  const p = Math.min(100, Math.max(0, percent));
  const tx = barX + (p / 100) * barW;
  setStroke(doc, accent);
  doc.setLineWidth(0.7);
  doc.line(tx, barY - 3, tx, barY + barH + 3);

  setText(doc, accent);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(label, tx, barY - 4, { align: "center" });
}

/** Two stacked horizontal bars used to visualize population vs wealth. */
function populationVsWealthChart(
  ctx: DrawContext,
  x: number,
  y: number,
  width: number,
  shares: { bottom50: number; middle40: number; top10: number; top1: number },
): number {
  const { doc, t } = ctx;
  const rowH = 8;
  const gap = 14; // space between the two bars + their labels

  // Population row: literally 50/40/9/1 — fixed by design of the percentile groups.
  // We split top10 into top1 (1%) and the rest (9%) to mirror the wealth row.
  const popSegments = [
    { label: t.charts.bottom50, weight: 50, color: C.sage } as const,
    { label: t.charts.middle40, weight: 40, color: C.periwinkle } as const,
    { label: t.charts.top10, weight: 9, color: C.amber } as const,
    { label: t.charts.top1, weight: 1, color: C.rose } as const,
  ];
  const wealthSegments = [
    {
      label: t.charts.bottom50,
      weight: Math.max(0, shares.bottom50),
      color: C.sage,
    } as const,
    { label: t.charts.middle40, weight: shares.middle40, color: C.periwinkle } as const,
    {
      label: t.charts.top10,
      weight: Math.max(0, shares.top10 - shares.top1),
      color: C.amber,
    } as const,
    { label: t.charts.top1, weight: shares.top1, color: C.rose } as const,
  ];

  // row labels
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setText(doc, C.body);
  doc.text(t.report.pdfWealthShareLegendPopulation, x, y - 1);
  stackedBar(ctx, x, y, width, rowH, popSegments);

  const yWealth = y + rowH + gap;
  setText(doc, C.body);
  doc.text(t.report.pdfWealthShareLegendWealth, x, yWealth - 1);
  stackedBar(ctx, x, yWealth, width, rowH, wealthSegments);

  return yWealth + rowH + 12; // bottom Y of this block
}

// ─── Pages ─────────────────────────────────────────────────────────────────

function drawCover(
  ctx: DrawContext,
  inputs: ReportInputs,
  percentile: number,
): void {
  const { doc, t, country, localeCountryName } = ctx;
  const formatted = formatCurrency(inputs.netWorthLocal, country.currency, true);
  const date = new Date().toISOString().split("T")[0];

  // Top band — soft amber so the cover reads warm and editorial.
  setFill(doc, C.amberSoft);
  doc.rect(0, 0, PAGE_W, 118, "F");

  // Headline cluster
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  setText(doc, C.ink);
  const titleLines = doc.splitTextToSize(
    t.report.pdfCoverTitle,
    PAGE_W - M * 2 - 70,
  ) as string[];
  doc.text(titleLines, M, 38);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  setText(doc, C.body);
  doc.text(
    interpolate(t.report.pdfCoverSubtitleTemplate, {
      country: localeCountryName,
    }),
    M,
    38 + titleLines.length * 9 + 4,
  );

  doc.setFontSize(9);
  setText(doc, C.muted);
  doc.text(`${t.report.pdfCoverGeneratedLabel}: ${date}`, M, 78);

  // Big amber percentile callout.
  setText(doc, C.amber);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(t.report.pdfPercentileLeadIn, M, 92);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(64);
  doc.text(`${percentile.toFixed(1)}%`, M, 116);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  setText(doc, C.body);
  doc.text(t.report.pdfPercentilePopulation, M, 124);

  // Right-side floating net-worth card.
  const cardW = 70;
  const cardH = 32;
  const cardX = PAGE_W - M - cardW;
  const cardY = 84;
  setFill(doc, [255, 255, 255]);
  setStroke(doc, C.rule);
  doc.setLineWidth(0.4);
  doc.roundedRect(cardX, cardY, cardW, cardH, 3, 3, "FD");
  setText(doc, C.muted);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text(t.report.pdfYourNetWorthLabel, cardX + 4, cardY + 8);
  setText(doc, C.ink);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(formatted, cardX + 4, cardY + 22);

  ctx.cursorY = 140;

  // Cover lower body — small framing paragraph so the page isn't sparse.
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  setText(doc, C.body);
  const intro = doc.splitTextToSize(
    t.report.landingSubtitle,
    W,
  ) as string[];
  doc.text(intro, M, ctx.cursorY);
  ctx.cursorY += intro.length * 6 + 8;
}

function drawWhereYouStand(
  ctx: DrawContext,
  percentile: number,
): void {
  const { country, t } = ctx;
  sectionHeading(ctx, "1", t.report.pdfSection1Title, C.amber);
  paragraph(ctx, t.report.pdfSection1Body, { marginBottom: 8 });

  // Stacked bar with marker (this is the "where you sit on the headcount"
  // visualization — the marker maps the user's percentile to the
  // population axis).
  const barX = M;
  const barY = ctx.cursorY + 6;
  const barH = 16;
  const barW = W;

  const segments: readonly BarSegment[] = [
    { label: t.charts.bottom50, weight: 50, color: C.sage },
    { label: t.charts.middle40, weight: 40, color: C.periwinkle },
    { label: t.charts.top10, weight: 9, color: C.amber },
    { label: t.charts.top1, weight: 1, color: C.rose },
  ];
  stackedBar(ctx, barX, barY, barW, barH, segments);
  barMarker(
    ctx,
    barX,
    barY,
    barW,
    barH,
    percentile,
    `▼ ${percentile.toFixed(1)}%`,
    C.ink,
  );

  ctx.cursorY = barY + barH + 18;

  // Population vs Wealth — exact mirror of the WealthDistributionChart on
  // the home page.
  sectionHeading(ctx, "1b", t.report.pdfWealthShareTitle, C.periwinkle);
  ctx.cursorY = populationVsWealthChart(
    ctx,
    M,
    ctx.cursorY + 4,
    W,
    country.wealthShares,
  );
}

function drawWealthInContext(ctx: DrawContext, netWorthUSD: number): void {
  const { doc, t, country } = ctx;
  newPage(ctx);

  sectionHeading(ctx, "2", t.report.pdfSection2Title, C.periwinkle);

  const cc = country.currency;
  const thresholds = getWealthThresholds(country);
  const rows = [
    {
      label: t.report.pdfContextLabelMedian,
      value: country.medianWealthPerAdult,
      color: C.sage,
    },
    {
      label: t.report.pdfContextLabelMean,
      value: country.meanWealthPerAdult,
      color: C.periwinkle,
    },
    {
      label: t.report.pdfContextLabelTop10,
      value: thresholds.p90,
      color: C.amber,
    },
    {
      label: t.report.pdfContextLabelTop1,
      value: thresholds.p99,
      color: C.rose,
    },
    {
      label: t.report.pdfContextLabelTop01,
      value: thresholds.p999,
      color: C.lavender,
    },
  ] as const;

  // Table-with-bars layout: each row gets a comparison bar showing the
  // user's wealth relative to the row's threshold. Bars are clipped at
  // 100% to keep the visual readable.
  const rowH = 13;
  const labelW = 56;
  const valueW = 38;
  const ratioW = 18;
  const barX = M + labelW + valueW + 4;
  const barWMax = W - labelW - valueW - ratioW - 4;
  const tableY = ctx.cursorY + 2;

  // header rule
  setStroke(doc, C.rule);
  doc.setLineWidth(0.3);
  doc.line(M, tableY, M + W, tableY);

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const y = tableY + (i + 1) * rowH;
    const valueLocal = fromUSD(row.value, cc);
    const ratio = netWorthUSD / Math.max(1, row.value);
    const fraction = Math.min(1, ratio);

    // Label
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    setText(doc, C.body);
    doc.text(row.label, M + 1, y - 3);

    // Value
    setText(doc, C.ink);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(formatCurrency(valueLocal, cc, true), M + labelW, y - 3);

    // Background bar + filled portion.
    setFill(doc, C.bandSoft);
    doc.roundedRect(barX, y - 8, barWMax, 6, 1, 1, "F");
    setFill(doc, row.color);
    doc.roundedRect(barX, y - 8, Math.max(1, fraction * barWMax), 6, 1, 1, "F");

    // Ratio text
    setText(doc, C.muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`${ratio.toFixed(2)}×`, M + W, y - 3, { align: "right" });

    // Row separator
    setStroke(doc, C.rule);
    doc.line(M, y, M + W, y);
  }

  ctx.cursorY = tableY + (rows.length + 1) * rowH + 6;
}

/** Pick 5 representative countries to compare against. The user's own
 *  country always leads; the other four are a fixed cross-region set
 *  (US, DE, JP, BR), with a swap if the user's country is one of those. */
function pickComparisonCountries(
  userCountry: AllCountryCode,
): readonly AllCountryCode[] {
  const baseline: AllCountryCode[] = ["US", "DE", "JP", "BR", "ZA"];
  const filtered = baseline.filter((c) => c !== userCountry);
  return [userCountry, ...filtered].slice(0, 5);
}

function bracketLabel(percentile: number, t: ReturnType<typeof getDictionary>): string {
  if (percentile >= 99.9) return t.charts.top001 ?? "Top 0.01%";
  if (percentile >= 99) return t.charts.top1;
  if (percentile >= 90) return t.charts.top10;
  if (percentile >= 50) return t.charts.middle40;
  return t.charts.bottom50;
}

function drawCrossCountry(ctx: DrawContext, inputs: ReportInputs): void {
  const { doc, t, country } = ctx;
  newPage(ctx);

  sectionHeading(ctx, "3", t.report.pdfCrossCountryTitle, C.sage);
  paragraph(ctx, t.report.pdfCrossCountryBody, { marginBottom: 8 });

  const netWorthUSD = toUSD(inputs.netWorthLocal, country.currency);
  const codes = pickComparisonCountries(inputs.countryCode);

  // Header
  const tableY = ctx.cursorY + 2;
  const colCountry = M;
  const colBracket = M + 56;
  const colBar = M + 90;
  const colBarW = W - (colBar - M) - 22;
  const colPercent = M + W;
  const rowH = 11;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  setText(doc, C.muted);
  doc.text(t.report.pdfCrossCountryColCountry.toUpperCase(), colCountry, tableY);
  doc.text(t.report.pdfCrossCountryColBracket.toUpperCase(), colBracket, tableY);
  doc.text(
    t.report.pdfCrossCountryColPercentile.toUpperCase(),
    colPercent,
    tableY,
    { align: "right" },
  );
  setStroke(doc, C.rule);
  doc.setLineWidth(0.3);
  doc.line(M, tableY + 2, M + W, tableY + 2);

  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    const c = ALL_COUNTRY_MAP[code];
    if (!c) continue;
    const localized = localizedCountryName(code, inputs.locale, c.name);
    const p = findPercentile(netWorthUSD, c);
    const isYou = code === inputs.countryCode;
    const accent = isYou ? C.amber : C.periwinkle;
    const y = tableY + 8 + i * rowH;

    // Country name (bold for the user's own country)
    setText(doc, C.ink);
    doc.setFont("helvetica", isYou ? "bold" : "normal");
    doc.setFontSize(10);
    doc.text(`${c.flag} ${localized}`, colCountry, y);

    // Bracket
    setText(doc, C.body);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(bracketLabel(p, t), colBracket, y);

    // Bar
    setFill(doc, C.bandSoft);
    doc.roundedRect(colBar, y - 5, colBarW, 5, 1, 1, "F");
    setFill(doc, accent);
    doc.roundedRect(
      colBar,
      y - 5,
      Math.max(1, (p / 100) * colBarW),
      5,
      1,
      1,
      "F",
    );

    // Percentile number
    setText(doc, isYou ? C.amber : C.ink);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`${p.toFixed(1)}%`, colPercent, y, { align: "right" });

    setStroke(doc, C.rule);
    doc.line(M, y + 3, M + W, y + 3);
  }

  ctx.cursorY = tableY + 8 + codes.length * rowH + 8;
}

/** Log-scale bars showing user / median / mean / top1% avg / richest. The
 *  visual makes orders of magnitude readable without the user ever
 *  seeing a billion-pixel-wide bar. */
function drawScaleGap(ctx: DrawContext, netWorthUSD: number): void {
  const { doc, t, country } = ctx;
  newPage(ctx);

  sectionHeading(ctx, "4", t.report.pdfScaleGapTitle, C.rose);
  paragraph(ctx, t.report.pdfScaleGapBody, { marginBottom: 8 });

  // Compute the values in USD. Top 1% average wealth = (top1% share / 100)
  // * mean wealth / 0.01 — same calculation the StatisticsSection uses.
  const top1AvgUSD =
    ((country.wealthShares.top1 / 100) * country.meanWealthPerAdult) / 0.01;
  const richest = RICHEST_BY_COUNTRY[country.code];
  const richestUSD = richest?.netWorth ?? null;

  type Row = {
    readonly label: string;
    readonly valueUSD: number;
    readonly color: Color;
    readonly accentText?: boolean;
  };
  const rows: readonly Row[] = [
    { label: t.report.pdfScaleLabelYou, valueUSD: Math.max(1, netWorthUSD), color: C.amber, accentText: true },
    { label: t.report.pdfScaleLabelMedian, valueUSD: country.medianWealthPerAdult, color: C.sage },
    { label: t.report.pdfScaleLabelMean, valueUSD: country.meanWealthPerAdult, color: C.periwinkle },
    { label: t.report.pdfScaleLabelTop1Avg, valueUSD: top1AvgUSD, color: C.rose },
    ...(richestUSD
      ? [{ label: t.report.pdfScaleLabelRichest, valueUSD: richestUSD, color: C.lavender } as const]
      : []),
  ];

  // Log-scale: width is proportional to log10(value). Find the max log
  // across the rows, then map each to that.
  const logs = rows.map((r) => Math.log10(Math.max(1, r.valueUSD)));
  const maxLog = Math.max(...logs);
  const minLog = Math.min(...logs);
  const span = Math.max(1, maxLog - minLog);

  const labelW = 50;
  const ratioW = 36;
  const barX = M + labelW;
  const barWMax = W - labelW - ratioW - 4;
  const startY = ctx.cursorY + 2;
  const rowH = 13;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const y = startY + i * rowH;
    const lg = Math.log10(Math.max(1, row.valueUSD));
    // Anchor min value at 6% of barWMax so the user's bar isn't invisible.
    const fraction = 0.06 + 0.94 * ((lg - minLog) / span);
    const ratio = row.valueUSD / Math.max(1, netWorthUSD);

    // label
    setText(doc, row.accentText ? C.amber : C.body);
    doc.setFont("helvetica", row.accentText ? "bold" : "normal");
    doc.setFontSize(9.5);
    doc.text(row.label, M, y - 1);

    // bar (background + fill)
    setFill(doc, C.bandSoft);
    doc.roundedRect(barX, y - 7, barWMax, 8, 1, 1, "F");
    setFill(doc, row.color);
    doc.roundedRect(barX, y - 7, Math.max(2, fraction * barWMax), 8, 1, 1, "F");

    // value tag inside or outside the filled bar
    setText(doc, [255, 255, 255]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    if (fraction * barWMax > 28) {
      doc.text(
        formatCurrency(fromUSD(row.valueUSD, country.currency), country.currency, true),
        barX + 3,
        y - 2.5,
      );
    } else {
      setText(doc, C.body);
      doc.text(
        formatCurrency(fromUSD(row.valueUSD, country.currency), country.currency, true),
        barX + fraction * barWMax + 3,
        y - 2.5,
      );
    }

    // ratio
    setText(doc, C.muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    if (i === 0) {
      // user row — show literal "1×" for clarity
      doc.text("1×", M + W, y - 1, { align: "right" });
    } else {
      doc.text(
        interpolate(t.report.pdfScaleRatioTemplate, {
          ratio:
            ratio >= 1000
              ? `${(ratio / 1000).toFixed(0)}k`
              : ratio.toFixed(ratio >= 100 ? 0 : 1),
        }),
        M + W,
        y - 1,
        { align: "right" },
      );
    }
  }

  ctx.cursorY = startY + rows.length * rowH + 4;

  setText(doc, C.muted);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.text(t.report.pdfScaleNote, M, ctx.cursorY + 2);
  ctx.cursorY += 8;
}

async function drawClosingPage(ctx: DrawContext): Promise<void> {
  const { doc, t, localeCountryName } = ctx;
  newPage(ctx);

  // Combined editorial + methodology + small Ko-fi ribbon.
  sectionHeading(ctx, "5", t.report.pdfSection3Title, C.amber);
  paragraph(
    ctx,
    interpolate(t.report.pdfSection3BodyTemplate, {
      country: localeCountryName,
    }),
    { marginBottom: 8 },
  );

  sectionHeading(ctx, "6", t.report.pdfSection4Title, C.periwinkle);
  paragraph(ctx, t.report.pdfSection4Body, { marginBottom: 8 });

  sectionHeading(ctx, "7", t.report.pdfSection5Title, C.sage);
  paragraph(ctx, t.report.pdfSection5Body, { marginBottom: 8 });

  // Methodology block — small, set apart with a left rule.
  ensureSpace(ctx, 28);
  const mY = ctx.cursorY + 2;
  setStroke(doc, C.rule);
  doc.setLineWidth(0.6);
  doc.line(M, mY, M, mY + 22);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setText(doc, C.ink);
  doc.text(t.report.pdfMethodologyTitle, M + 4, mY + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setText(doc, C.muted);
  const methodLines = doc.splitTextToSize(t.report.pdfMethodologyBody, W - 4) as string[];
  doc.text(methodLines, M + 4, mY + 9);
  ctx.cursorY = mY + 9 + methodLines.length * 4 + 6;

  // Compact Ko-fi tip ribbon — much smaller than the previous big card.
  // Sits at the very bottom of the page just above the footer.
  await drawTipRibbon(ctx);
}

async function drawTipRibbon(ctx: DrawContext): Promise<void> {
  const { doc, t } = ctx;

  const ribbonH = 26;
  const ribbonY = PAGE_H - M - 14 - ribbonH;
  const ribbonX = M;
  const ribbonW = W;

  setFill(doc, C.amberSoft);
  setStroke(doc, C.amber);
  doc.setLineWidth(0.4);
  doc.roundedRect(ribbonX, ribbonY, ribbonW, ribbonH, 2.5, 2.5, "FD");

  // Left text block
  setText(doc, C.ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(t.report.pdfTipTitle, ribbonX + 6, ribbonY + 8);

  setText(doc, C.body);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const tipLines = doc.splitTextToSize(t.report.pdfTipBody, ribbonW - 36) as string[];
  doc.text(tipLines.slice(0, 2), ribbonX + 6, ribbonY + 13);

  // QR on the right (if it fits and generates).
  try {
    const qrDataUrl = await QRCode.toDataURL(KOFI_URL, {
      margin: 0,
      scale: 4,
      color: { dark: "#1c1917", light: "#fff7dc" },
    });
    const qrSize = ribbonH - 6;
    const qrX = ribbonX + ribbonW - qrSize - 4;
    const qrY = ribbonY + 3;
    doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);
  } catch {
    // non-fatal; the text-only ribbon still works
  }
}

/** Render the full report PDF and trigger a download. */
export async function generateReportPdf(inputs: ReportInputs): Promise<void> {
  const { locale, countryCode, netWorthLocal } = inputs;
  const t = getDictionary(locale);
  const country = ALL_COUNTRY_MAP[countryCode];
  if (!country) throw new Error(`Unknown country code: ${countryCode}`);

  const localeCountryName = localizedCountryName(
    countryCode,
    locale,
    country.name,
  );

  const netWorthUSD = toUSD(netWorthLocal, country.currency);
  const percentile = findPercentile(netWorthUSD, country);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setProperties({
    title: t.report.pdfCoverTitle,
    subject: interpolate(t.report.pdfCoverSubtitleTemplate, {
      country: localeCountryName,
    }),
    creator: "howpoorami.org",
    author: "howpoorami.org",
  });

  const ctx: DrawContext = {
    doc,
    t,
    localeCountryName,
    country,
    cursorY: M,
    pageNumber: 1,
  };

  drawCover(ctx, inputs, percentile);
  newPage(ctx);
  drawWhereYouStand(ctx, percentile);
  drawWealthInContext(ctx, netWorthUSD);
  drawCrossCountry(ctx, inputs);
  drawScaleGap(ctx, netWorthUSD);
  await drawClosingPage(ctx);
  drawFooter(ctx);

  const dateStr = new Date().toISOString().split("T")[0];
  const filename = interpolate(t.report.pdfFilenameTemplate, {
    country: countryCode.toLowerCase(),
    date: dateStr,
  });
  doc.save(filename);
}

export type { LocaleCode, AllCountryCode };
