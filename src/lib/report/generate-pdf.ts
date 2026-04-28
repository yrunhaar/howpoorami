/**
 * Client-side PDF report generator.
 *
 * Builds a 6-page personal wealth-inequality report from the user's net-worth
 * input + country data + active locale. Pure client work (jsPDF) so the
 * privacy promise holds: nothing leaves the browser.
 *
 * The PDF is intentionally typographic, not chart-heavy. Embedding live
 * chart images means rasterizing offscreen DOM, which is brittle. Instead we
 * draw the small "where you stand" bar with jsPDF primitives — it survives
 * any locale, any country, any device.
 *
 * Note on fonts: jsPDF's bundled Helvetica only covers Latin glyphs. For
 * Chinese/Japanese, headings/body fall back to the renderer's default which
 * Acrobat will substitute at view time. We rely on system fallback and
 * accept that the report typography is less refined for CJK locales — the
 * data is still legible, which is what matters for v1.
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
import { toUSD, fromUSD } from "@/lib/currency";
import { formatCurrency } from "@/lib/format";
import { getDictionary } from "@/lib/i18n";
import { interpolate } from "@/lib/i18n/dictionary";
import { localizedCountryName } from "@/lib/i18n/country-names";
import type { LocaleCode } from "@/lib/i18n/locales";
import type { ReportInputs } from "./types";

const KOFI_URL = "https://ko-fi.com/yrunhaar";

// Page geometry — A4 in millimetres, with conservative margins for screen
// reading at 100% zoom.
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 18;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

// Colors — borrowed from the site palette but flattened to RGB triples that
// jsPDF's `setFillColor` accepts directly.
const C = {
  ink: [28, 25, 23] as const, // text-primary on light mode
  body: [68, 64, 60] as const, // text-secondary
  muted: [120, 113, 108] as const, // text-muted
  rule: [214, 207, 199] as const, // border-subtle
  band: [245, 240, 235] as const, // bg-secondary
  amber: [153, 119, 0] as const, // accent-amber light
  rose: [165, 64, 78] as const, // accent-rose light
  sage: [45, 142, 122] as const, // accent-sage light
  periwinkle: [49, 112, 160] as const, // accent-periwinkle light
};

interface DrawContext {
  readonly doc: jsPDF;
  readonly t: ReturnType<typeof getDictionary>;
  readonly localeCountryName: string;
  readonly country: CountryData;
  cursorY: number;
  pageNumber: number;
}

function setColor(
  doc: jsPDF,
  rgb: readonly [number, number, number],
  kind: "text" | "fill" | "draw" = "text",
): void {
  const [r, g, b] = rgb;
  if (kind === "text") doc.setTextColor(r, g, b);
  else if (kind === "fill") doc.setFillColor(r, g, b);
  else doc.setDrawColor(r, g, b);
}

function ensureSpace(ctx: DrawContext, needed: number): void {
  if (ctx.cursorY + needed > PAGE_HEIGHT - MARGIN - 12) {
    addPageFooter(ctx);
    ctx.doc.addPage();
    ctx.pageNumber += 1;
    ctx.cursorY = MARGIN;
  }
}

function addPageFooter(ctx: DrawContext): void {
  const { doc, t, pageNumber } = ctx;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setColor(doc, C.muted);
  doc.text(t.report.pdfFooterAttribution, MARGIN, PAGE_HEIGHT - 8);
  doc.text(
    `${t.report.pdfPageLabel} ${pageNumber}`,
    PAGE_WIDTH - MARGIN,
    PAGE_HEIGHT - 8,
    { align: "right" },
  );
}

function paragraph(
  ctx: DrawContext,
  text: string,
  opts: {
    readonly size?: number;
    readonly weight?: "normal" | "bold";
    readonly color?: readonly [number, number, number];
    readonly leading?: number;
    readonly marginTop?: number;
    readonly marginBottom?: number;
  } = {},
): void {
  const {
    size = 11,
    weight = "normal",
    color = C.body,
    leading = 1.5,
    marginTop = 0,
    marginBottom = 4,
  } = opts;
  const { doc } = ctx;
  doc.setFont("helvetica", weight);
  doc.setFontSize(size);
  setColor(doc, color);

  const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
  const lineHeight = (size * leading) / 2.83465; // pt → mm
  const blockHeight = lineHeight * lines.length;
  ensureSpace(ctx, blockHeight + marginTop + marginBottom);
  ctx.cursorY += marginTop;
  doc.text(lines, MARGIN, ctx.cursorY + lineHeight * 0.7);
  ctx.cursorY += blockHeight + marginBottom;
}

function sectionHeading(ctx: DrawContext, text: string): void {
  ensureSpace(ctx, 18);
  ctx.cursorY += 4;
  paragraph(ctx, text, {
    size: 14,
    weight: "bold",
    color: C.ink,
    leading: 1.3,
    marginBottom: 2,
  });
  // thin amber rule under the heading
  setColor(ctx.doc, C.amber, "draw");
  ctx.doc.setLineWidth(0.4);
  ctx.doc.line(MARGIN, ctx.cursorY - 2, MARGIN + 22, ctx.cursorY - 2);
  ctx.cursorY += 4;
}

function drawCover(
  ctx: DrawContext,
  inputs: ReportInputs,
  percentile: number,
): void {
  const { doc, t, country, localeCountryName } = ctx;
  const cc = country.currency;
  const formattedNW = formatCurrency(inputs.netWorthLocal, cc, true);
  const dateStr = new Date().toISOString().split("T")[0];

  // Background tint at the very top
  setColor(doc, C.band, "fill");
  doc.rect(0, 0, PAGE_WIDTH, 110, "F");

  // Headline
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  setColor(doc, C.ink);
  doc.text(t.report.pdfCoverTitle, MARGIN, 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  setColor(doc, C.body);
  doc.text(
    interpolate(t.report.pdfCoverSubtitleTemplate, {
      country: localeCountryName,
    }),
    MARGIN,
    50,
  );

  doc.setFontSize(10);
  setColor(doc, C.muted);
  doc.text(
    `${t.report.pdfCoverGeneratedLabel}: ${dateStr}`,
    MARGIN,
    58,
  );

  // Big percentile callout
  setColor(doc, C.amber);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(t.report.pdfPercentileLeadIn, MARGIN, 78);

  setColor(doc, C.amber);
  doc.setFontSize(60);
  doc.setFont("helvetica", "bold");
  doc.text(`${percentile.toFixed(1)}%`, MARGIN, 102);

  setColor(doc, C.body);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(t.report.pdfPercentilePopulation, MARGIN, 110);

  // Net-worth box on the right side of cover
  const boxX = PAGE_WIDTH - MARGIN - 70;
  const boxY = 75;
  setColor(doc, C.rule, "draw");
  doc.setLineWidth(0.3);
  doc.roundedRect(boxX, boxY, 70, 28, 3, 3, "S");
  setColor(doc, C.muted);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(t.report.pdfYourNetWorthLabel, boxX + 4, boxY + 7);
  setColor(doc, C.ink);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(formattedNW, boxX + 4, boxY + 18);

  ctx.cursorY = 120;
}

function drawWhereYouStand(
  ctx: DrawContext,
  netWorthUSD: number,
  percentile: number,
): void {
  const { doc, t, country } = ctx;
  sectionHeading(ctx, t.report.pdfSection1Title);
  paragraph(ctx, t.report.pdfSection1Body, { marginBottom: 6 });

  // Horizontal stacked bar: bottom 50 / middle 40 / top 10 / top 1, scaled
  // by their wealth share so the visual is intuitive (groups that hold
  // more wealth take more horizontal space).
  const shares = country.wealthShares;
  const segments = [
    { label: t.charts.bottom50, value: Math.max(0, shares.bottom50), color: C.sage },
    { label: t.charts.middle40, value: shares.middle40, color: C.periwinkle },
    {
      label: t.charts.top10,
      value: Math.max(0, shares.top10 - shares.top1),
      color: C.amber,
    },
    { label: t.charts.top1, value: shares.top1, color: C.rose },
  ];
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  const barX = MARGIN;
  const barY = ctx.cursorY + 4;
  const barW = CONTENT_WIDTH;
  const barH = 14;

  let x = barX;
  for (const seg of segments) {
    const w = (seg.value / total) * barW;
    setColor(doc, seg.color, "fill");
    doc.rect(x, barY, w, barH, "F");
    if (w > 18) {
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      setColor(doc, [255, 255, 255]);
      doc.text(`${seg.value.toFixed(0)}%`, x + w / 2, barY + barH / 2 + 1, {
        align: "center",
      });
    }
    x += w;
  }

  // Group labels under the bar
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  setColor(doc, C.muted);
  let lx = barX;
  for (const seg of segments) {
    const w = (seg.value / total) * barW;
    if (w > 20) {
      doc.text(seg.label, lx + w / 2, barY + barH + 5, { align: "center" });
    }
    lx += w;
  }

  // "You are here" tick — position by mapping the percentile to the bar.
  // Bar visually represents wealth share, but the percentile maps to
  // population position; for the marker we use percentile directly so the
  // user sees their *headcount* position on the bar.
  const pPct = Math.min(100, Math.max(0, percentile));
  const tickX = barX + (pPct / 100) * barW;
  setColor(doc, C.ink, "draw");
  doc.setLineWidth(0.7);
  doc.line(tickX, barY - 3, tickX, barY + barH + 3);
  setColor(doc, C.ink);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(`▼ ${percentile.toFixed(1)}%`, tickX, barY - 4, { align: "center" });

  ctx.cursorY = barY + barH + 14;
  void netWorthUSD;
}

function drawWealthInContext(
  ctx: DrawContext,
  netWorthUSD: number,
): void {
  const { doc, t, country } = ctx;
  sectionHeading(ctx, t.report.pdfSection2Title);

  const cc = country.currency;
  const thresholds = getWealthThresholds(country);
  const rows = [
    {
      label: t.report.pdfContextLabelMedian,
      value: country.medianWealthPerAdult,
    },
    {
      label: t.report.pdfContextLabelMean,
      value: country.meanWealthPerAdult,
    },
    {
      label: t.report.pdfContextLabelTop10,
      value: thresholds.p90,
    },
    {
      label: t.report.pdfContextLabelTop1,
      value: thresholds.p99,
    },
    {
      label: t.report.pdfContextLabelTop01,
      value: thresholds.p999,
    },
  ];

  const tableX = MARGIN;
  const tableY = ctx.cursorY;
  const rowH = 8;
  const labelColW = 70;

  // Header rule
  setColor(doc, C.rule, "draw");
  doc.setLineWidth(0.3);
  doc.line(tableX, tableY, tableX + CONTENT_WIDTH, tableY);

  for (let i = 0; i < rows.length; i++) {
    const y = tableY + (i + 1) * rowH;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    setColor(doc, C.body);
    doc.text(rows[i].label, tableX + 2, y - 2);

    setColor(doc, C.ink);
    doc.setFont("helvetica", "bold");
    const localValue = fromUSD(rows[i].value, cc);
    doc.text(formatCurrency(localValue, cc, true), tableX + labelColW + 4, y - 2);

    // Comparison ratio: how does the user's net worth compare to this row?
    const ratio = netWorthUSD / Math.max(1, rows[i].value);
    setColor(doc, C.muted);
    doc.setFont("helvetica", "normal");
    doc.text(
      ratio >= 0.01 ? `${ratio.toFixed(2)}×` : "—",
      tableX + CONTENT_WIDTH - 2,
      y - 2,
      { align: "right" },
    );

    setColor(doc, C.rule, "draw");
    doc.line(tableX, y, tableX + CONTENT_WIDTH, y);
  }

  ctx.cursorY = tableY + (rows.length + 1) * rowH + 4;
}

async function drawTipPage(ctx: DrawContext): Promise<void> {
  const { doc, t } = ctx;
  // Add an explicit page so the tip CTA sits on its own canvas.
  addPageFooter(ctx);
  doc.addPage();
  ctx.pageNumber += 1;
  ctx.cursorY = MARGIN;

  // Methodology block at top
  sectionHeading(ctx, t.report.pdfMethodologyTitle);
  paragraph(ctx, t.report.pdfMethodologyBody, { marginBottom: 12 });

  // Tip box
  const boxX = MARGIN;
  const boxY = ctx.cursorY + 6;
  const boxW = CONTENT_WIDTH;
  const boxH = 78;
  setColor(doc, C.amber, "draw");
  doc.setLineWidth(0.6);
  setColor(doc, [253, 246, 227], "fill");
  doc.roundedRect(boxX, boxY, boxW, boxH, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  setColor(doc, C.ink);
  doc.text(t.report.pdfTipTitle, boxX + 8, boxY + 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  setColor(doc, C.body);
  const lines = doc.splitTextToSize(t.report.pdfTipBody, boxW - 64);
  doc.text(lines, boxX + 8, boxY + 22);

  // QR code on the right of the tip box
  try {
    const qrDataUrl = await QRCode.toDataURL(KOFI_URL, {
      margin: 1,
      scale: 6,
      color: { dark: "#1c1917", light: "#ffffff" },
    });
    const qrSize = 38;
    const qrX = boxX + boxW - qrSize - 8;
    const qrY = boxY + 8;
    doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);
    doc.setFontSize(8);
    setColor(doc, C.muted);
    const cap = doc.splitTextToSize(t.report.pdfTipQrCaption, qrSize + 4);
    doc.text(cap, qrX + qrSize / 2, qrY + qrSize + 4, { align: "center" });
  } catch {
    // QR generation failures are non-fatal — fall back to text-only CTA.
  }
}

/**
 * Render the full report PDF and trigger a download. Resolves once the
 * blob has been created and `save()` has fired the download.
 */
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
    cursorY: MARGIN,
    pageNumber: 1,
  };

  drawCover(ctx, inputs, percentile);
  drawWhereYouStand(ctx, netWorthUSD, percentile);
  drawWealthInContext(ctx, netWorthUSD);

  // Section 3: a century of change
  sectionHeading(ctx, t.report.pdfSection3Title);
  paragraph(
    ctx,
    interpolate(t.report.pdfSection3BodyTemplate, {
      country: localeCountryName,
    }),
  );

  // Section 4: income vs wealth
  sectionHeading(ctx, t.report.pdfSection4Title);
  paragraph(ctx, t.report.pdfSection4Body);

  // Section 5: what it means
  sectionHeading(ctx, t.report.pdfSection5Title);
  paragraph(ctx, t.report.pdfSection5Body);

  // Methodology + tip page (forces a new page)
  await drawTipPage(ctx);
  addPageFooter(ctx);

  // Trigger download
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = interpolate(t.report.pdfFilenameTemplate, {
    country: countryCode.toLowerCase(),
    date: dateStr,
  });
  doc.save(filename);
}

// Re-export for the wizard.
export type { LocaleCode, AllCountryCode };
