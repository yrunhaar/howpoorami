#!/usr/bin/env node
/**
 * Master data fetch script — downloads all external data into data/raw/.
 *
 * Usage: node scripts/fetch-all-data.mjs [--skip-billionaires] [--skip-wid] [--skip-economic] [--skip-metadata]
 *
 * Data sources:
 *   1. WID.world API — historical wealth shares + sub-percentile breakdown
 *   2. Forbes RTB API — richest person per country (komed3/rtb-api, MIT)
 *   3. OECD / World Bank / FRED — purchasing power indicators
 *   4. Frankfurter API (ECB) — exchange rates for currency conversion
 *   5. WID.world + World Bank — country metadata (mean/median wealth & income, Gini, population)
 *      + income/wealth distribution shares
 *
 * Output: data/raw/*.json files (committed to repo for transparency)
 *
 * After fetching, rebuild the site: pnpm build
 */

import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW_DIR = resolve(__dirname, "../data/raw");

const args = new Set(process.argv.slice(2));
const SKIP_WID = args.has("--skip-wid");
const SKIP_BILLIONAIRES = args.has("--skip-billionaires");
const SKIP_ECONOMIC = args.has("--skip-economic");
const SKIP_METADATA = args.has("--skip-metadata");

// ─── Country list ────────────────────────────────────────────────────────────

const ALL_COUNTRIES = [
  "US", "GB", "FR", "DE", "NL",
  "CA", "AU", "JP", "KR", "CN", "IN", "BR", "MX", "ZA",
  "SE", "NO", "DK", "CH", "IT", "ES", "SG", "IE",
  "BE", "AT", "PL", "CZ", "NZ", "PT", "CL", "FI",
];

// ─── Static constants (name, flag, currency — not API-fetchable) ────────────

const COUNTRY_CONSTANTS = {
  US: { name: "United States", flag: "🇺🇸", currency: "USD" },
  GB: { name: "United Kingdom", flag: "🇬🇧", currency: "GBP" },
  FR: { name: "France", flag: "🇫🇷", currency: "EUR" },
  DE: { name: "Germany", flag: "🇩🇪", currency: "EUR" },
  NL: { name: "The Netherlands", flag: "🇳🇱", currency: "EUR" },
  CA: { name: "Canada", flag: "🇨🇦", currency: "CAD" },
  AU: { name: "Australia", flag: "🇦🇺", currency: "AUD" },
  JP: { name: "Japan", flag: "🇯🇵", currency: "JPY" },
  KR: { name: "South Korea", flag: "🇰🇷", currency: "KRW" },
  CN: { name: "China", flag: "🇨🇳", currency: "CNY" },
  IN: { name: "India", flag: "🇮🇳", currency: "INR" },
  BR: { name: "Brazil", flag: "🇧🇷", currency: "BRL" },
  MX: { name: "Mexico", flag: "🇲🇽", currency: "MXN" },
  ZA: { name: "South Africa", flag: "🇿🇦", currency: "ZAR" },
  SE: { name: "Sweden", flag: "🇸🇪", currency: "SEK" },
  NO: { name: "Norway", flag: "🇳🇴", currency: "NOK" },
  DK: { name: "Denmark", flag: "🇩🇰", currency: "DKK" },
  CH: { name: "Switzerland", flag: "🇨🇭", currency: "CHF" },
  IT: { name: "Italy", flag: "🇮🇹", currency: "EUR" },
  ES: { name: "Spain", flag: "🇪🇸", currency: "EUR" },
  SG: { name: "Singapore", flag: "🇸🇬", currency: "SGD" },
  IE: { name: "Ireland", flag: "🇮🇪", currency: "EUR" },
  BE: { name: "Belgium", flag: "🇧🇪", currency: "EUR" },
  AT: { name: "Austria", flag: "🇦🇹", currency: "EUR" },
  PL: { name: "Poland", flag: "🇵🇱", currency: "PLN" },
  CZ: { name: "Czech Republic", flag: "🇨🇿", currency: "CZK" },
  NZ: { name: "New Zealand", flag: "🇳🇿", currency: "NZD" },
  PT: { name: "Portugal", flag: "🇵🇹", currency: "EUR" },
  CL: { name: "Chile", flag: "🇨🇱", currency: "CLP" },
  FI: { name: "Finland", flag: "🇫🇮", currency: "EUR" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function saveJSON(filename, data) {
  const path = resolve(RAW_DIR, filename);
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  console.log(`  → Saved ${path}`);
}

async function fetchJSON(url, headers = {}) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. WID.world — Historical wealth shares + sub-percentile data
// ═══════════════════════════════════════════════════════════════════════════════

const WID_API = process.env.WID_API_URL || "https://rfap9nitz6.execute-api.eu-west-1.amazonaws.com/prod";

// Public API key extracted from the official WID R package (sysdata.rda).
// This is a shared key distributed with the open-source wid-r-tool package
// (https://github.com/world-inequality-database/wid-r-tool), not a secret.
// Override via WID_API_KEY env var if WID issues a dedicated key in the future.
const WID_KEY = process.env.WID_API_KEY || "rYFByOB0ioaPATwHtllMI71zLOZSK0Ic5veQonJP";

async function fetchWID(countries, variables) {
  const url = `${WID_API}/countries-variables?countries=${countries.join(",")}&variables=${encodeURIComponent(variables.join(","))}`;
  const res = await fetch(url, { headers: { "x-api-key": WID_KEY } });
  if (!res.ok) throw new Error(`WID API: ${res.status} ${res.statusText}`);
  return res.json();
}

function parseWIDResponse(data) {
  const result = {};
  for (const [varKey, countryBlocks] of Object.entries(data)) {
    if (varKey === "error") continue;
    for (const block of countryBlocks) {
      for (const [cc, cdata] of Object.entries(block)) {
        if (!result[cc]) result[cc] = {};
        if (!result[cc][varKey]) result[cc][varKey] = {};
        for (const { y, v } of cdata.values || []) {
          result[cc][varKey][y] = v;
        }
      }
    }
  }
  return result;
}

async function fetchAllWID() {
  console.log("\n📊 Fetching WID.world data...");

  const HISTORICAL_VARS = [
    "shweal_p99p100_992_j",   // top 1%
    "shweal_p90p100_992_j",   // top 10%
    "shweal_p0p50_992_j",     // bottom 50%
  ];

  const SUB_PERCENTILE_VARS = [
    "shweal_p99p100_992_j",
    "shweal_p90p100_992_j",
    "shweal_p0p50_992_j",
    "shweal_p99.9p100_992_j",   // top 0.1%
    "shweal_p99.99p100_992_j",  // top 0.01%
  ];

  // Fetch historical data
  const historicalData = {};
  for (let i = 0; i < ALL_COUNTRIES.length; i += 10) {
    const batch = ALL_COUNTRIES.slice(i, i + 10);
    console.log(`  Historical: ${batch.join(", ")}...`);
    const data = await fetchWID(batch, HISTORICAL_VARS);
    Object.assign(historicalData, parseWIDResponse(data));
    if (i + 10 < ALL_COUNTRIES.length) await new Promise(r => setTimeout(r, 500));
  }

  saveJSON("wid-historical.json", {
    _meta: {
      description: "Historical wealth share time series from WID.world",
      source: "World Inequality Database (WID.world)",
      citation: "Chancel, L., Piketty, T., Saez, E., Zucman, G. et al.",
      url: "https://wid.world",
      variables: HISTORICAL_VARS,
      fetchedAt: new Date().toISOString(),
    },
    ...historicalData,
  });

  // Fetch sub-percentile data
  const subPercentileData = {};
  for (let i = 0; i < ALL_COUNTRIES.length; i += 10) {
    const batch = ALL_COUNTRIES.slice(i, i + 10);
    console.log(`  Sub-percentile: ${batch.join(", ")}...`);
    const data = await fetchWID(batch, SUB_PERCENTILE_VARS);
    const parsed = parseWIDResponse(data);
    for (const [cc, vars] of Object.entries(parsed)) {
      if (!subPercentileData[cc]) subPercentileData[cc] = {};
      Object.assign(subPercentileData[cc], vars);
    }
    if (i + 10 < ALL_COUNTRIES.length) await new Promise(r => setTimeout(r, 500));
  }

  saveJSON("wid-sub-percentile.json", {
    _meta: {
      description: "Sub-percentile wealth shares for detailed distribution charts",
      source: "World Inequality Database (WID.world)",
      variables: SUB_PERCENTILE_VARS,
      fetchedAt: new Date().toISOString(),
    },
    ...subPercentileData,
  });

  // Compute and save DETAILED_SHARES from sub-percentile data
  const detailedShares = {
    _meta: {
      description: "Sub-percentile wealth shares derived from WID.world (latest year per country)",
      source: "World Inequality Database (WID.world)",
      variables: SUB_PERCENTILE_VARS,
      methodology: "bottom50 = p0p50, middle40 = 100 - top10 - bottom50, next9 = top10 - top1, next09 = top1 - top0.1, next009 = top0.1 - top0.01, top001 = top0.01",
      generatedBy: "scripts/fetch-all-data.mjs",
      fetchedAt: new Date().toISOString(),
    },
  };

  for (const cc of ALL_COUNTRIES) {
    const d = subPercentileData[cc];
    if (!d) continue;

    const top1Data = d["shweal_p99p100_992_j"] || {};
    const top10Data = d["shweal_p90p100_992_j"] || {};
    const bot50Data = d["shweal_p0p50_992_j"] || {};
    const top01Data = d["shweal_p99.9p100_992_j"] || {};
    const top001Data = d["shweal_p99.99p100_992_j"] || {};

    const years = Object.keys(top1Data).map(Number).sort((a, b) => b - a);
    let bestYear = null;
    for (const y of years) {
      if (top1Data[y] != null && top10Data[y] != null && bot50Data[y] != null && top01Data[y] != null) {
        bestYear = y;
        break;
      }
    }
    if (!bestYear) continue;

    const r = (v) => Math.round(v * 1000) / 10;
    const b50 = r(bot50Data[bestYear]);
    const t10 = r(top10Data[bestYear]);
    const t1 = r(top1Data[bestYear]);
    const t01 = r(top01Data[bestYear]);
    const t001 = top001Data[bestYear] != null ? r(top001Data[bestYear]) : null;

    detailedShares[cc] = {
      year: bestYear,
      bottom50: b50,
      middle40: Math.round((100 - t10 - b50) * 10) / 10,
      next9: Math.round((t10 - t1) * 10) / 10,
      next09: Math.round((t1 - t01) * 10) / 10,
      next009: t001 != null ? Math.round((t01 - t001) * 10) / 10 : Math.round(t01 * 0.6 * 10) / 10,
      top001: t001 != null ? t001 : Math.round(t01 * 0.4 * 10) / 10,
    };
  }

  saveJSON("wid-detailed-shares.json", detailedShares);

  console.log(`  ✓ WID data fetched for ${ALL_COUNTRIES.length} countries`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Forbes RTB API — Billionaires
// ═══════════════════════════════════════════════════════════════════════════════

const RTB_BASE = "https://cdn.statically.io/gh/komed3/rtb-api/main/api";

async function fetchAllBillionaires() {
  console.log("\n💰 Fetching Forbes billionaire data...");

  const countryCodes = ALL_COUNTRIES.map(c => c.toLowerCase());

  // Fetch country list to get top billionaire slugs
  const listRes = await fetch(`${RTB_BASE}/stats/country/_list`);
  if (!listRes.ok) throw new Error(`RTB list: ${listRes.status}`);
  const listText = await listRes.text();

  const countryStats = {};
  for (const line of listText.trim().split("\n")) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 6) continue;
    const [code, , , topSlug, , topNW] = parts;
    countryStats[code] = { topSlug, topNetWorth: parseFloat(topNW) };
  }

  // Fetch profile for each country's richest person
  const result = {
    _meta: {
      description: "Richest person per country from Forbes Real-Time Billionaires",
      source: "Forbes Real-Time Billionaires via komed3/rtb-api (MIT license)",
      url: "https://github.com/komed3/rtb-api",
      generatedBy: "scripts/fetch-all-data.mjs",
      fetchedAt: new Date().toISOString(),
    },
  };

  for (const cc of countryCodes) {
    const stats = countryStats[cc];
    if (!stats) {
      console.log(`  ⚠ No billionaire data for ${cc.toUpperCase()}`);
      continue;
    }

    try {
      const profile = await fetchJSON(`${RTB_BASE}/person/${stats.topSlug}/profile`);
      result[cc.toUpperCase()] = {
        name: profile.name || stats.topSlug.replace(/-/g, " "),
        netWorth: Math.round(stats.topNetWorth * 1_000_000),
        source: Array.isArray(profile.source) ? profile.source.join(", ") : (profile.source || ""),
        photoDescription: `Photo of ${profile.name || stats.topSlug}`,
      };
      await new Promise(r => setTimeout(r, 100));
    } catch {
      console.log(`  ⚠ Could not fetch profile for ${stats.topSlug}`);
      result[cc.toUpperCase()] = {
        name: stats.topSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        netWorth: Math.round(stats.topNetWorth * 1_000_000),
        source: "",
        photoDescription: "",
      };
    }
  }

  // Add GLOBAL (world's richest person across all fetched countries)
  const richestEntry = Object.entries(result)
    .filter(([key]) => key !== "_meta")
    .sort(([, a], [, b]) => b.netWorth - a.netWorth)[0];
  if (richestEntry) {
    result.GLOBAL = { ...richestEntry[1] };
  }

  saveJSON("billionaires.json", result);
  console.log(`  ✓ Billionaire data fetched for ${Object.keys(result).length - 1} entries`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. OECD / World Bank / FRED — Economic indicators
// ═══════════════════════════════════════════════════════════════════════════════

const ECON_COUNTRIES = ["US", "GB", "FR", "DE", "NL"];
const ECON_YEARS = [1995, 2000, 2005, 2010, 2015, 2020, 2023];
const BASE_YEAR = 2000;
const WB_CODES = { US: "US", GB: "GB", FR: "FR", DE: "DE", NL: "NL" };
const OECD_CODES = { US: "USA", GB: "GBR", FR: "FRA", DE: "DEU", NL: "NLD" };
const FRED_SERIES = { US: "QUSR628BIS", GB: "QGBR628BIS", FR: "QFRR628BIS", DE: "QDER628BIS", NL: "QNLR628BIS" };
const FRED_API_KEY = process.env.FRED_API_KEY || "";

async function fetchWorldBankCPI() {
  console.log("  CPI: World Bank API...");
  const codes = Object.values(WB_CODES).join(";");
  const url = `https://api.worldbank.org/v2/country/${codes}/indicator/FP.CPI.TOTL?date=1990:2024&format=json&per_page=500`;
  const data = await fetchJSON(url);
  const records = data[1] || [];
  const result = {};
  for (const r of records) {
    const cc = Object.entries(WB_CODES).find(([, v]) => v === r.country.id)?.[0];
    if (!cc || r.value == null) continue;
    if (!result[cc]) result[cc] = {};
    result[cc][r.date] = r.value;
  }
  return result;
}

async function fetchOECDWages() {
  console.log("  Wages: OECD SDMX API...");
  const result = {};
  for (const [cc, oecd] of Object.entries(OECD_CODES)) {
    try {
      const url = `https://sdmx.oecd.org/public/rest/data/OECD.ELS.SAE,DSD_EARNINGS@AV_AN_WAGE,1.0/${oecd}.A.USD_PPP_CST..?startPeriod=1990&endPeriod=2024&dimensionAtObservation=AllDimensions`;
      const res = await fetch(url, { headers: { Accept: "application/vnd.sdmx.data+json;version=2.0.0" } });
      if (!res.ok) { console.log(`    ⚠ OECD ${cc}: ${res.status}`); continue; }
      const data = await res.json();
      result[cc] = {};
      const obs = data?.data?.dataSets?.[0]?.observations || {};
      const timeDim = data?.data?.structures?.[0]?.dimensions?.observation?.find(d => d.id === "TIME_PERIOD");
      const timeValues = timeDim?.values || [];
      for (const [key, val] of Object.entries(obs)) {
        const dimIndices = key.split(":");
        const timeIdx = parseInt(dimIndices[dimIndices.length - 1]);
        const year = timeValues[timeIdx]?.id;
        if (year && val[0] != null) result[cc][year] = val[0];
      }
    } catch (e) {
      console.log(`    ⚠ OECD ${cc}: ${e.message}`);
    }
  }
  return result;
}

async function fetchFREDHousePrices() {
  if (!FRED_API_KEY) {
    console.log("  House prices: FRED_API_KEY not set, skipping");
    return {};
  }
  console.log("  House prices: FRED API...");
  const result = {};
  for (const [cc, series] of Object.entries(FRED_SERIES)) {
    try {
      const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series}&api_key=${FRED_API_KEY}&file_type=json&observation_start=1990-01-01`;
      const data = await fetchJSON(url);
      result[cc] = {};
      for (const obs of data.observations || []) {
        if (obs.value === ".") continue;
        const year = parseInt(obs.date.substring(0, 4));
        // Keep only the first observation per year (Q1) — skip if year already recorded
        if (!(year in result[cc])) {
          result[cc][year] = parseFloat(obs.value);
        }
      }
    } catch (e) {
      console.log(`    ⚠ FRED ${cc}: ${e.message}`);
    }
  }
  return result;
}

function rebaseIndex(yearValueMap, baseYear) {
  const baseVal = yearValueMap[String(baseYear)];
  if (!baseVal) return yearValueMap;
  const result = {};
  for (const [y, v] of Object.entries(yearValueMap)) {
    result[y] = Math.round((v / baseVal) * 1000) / 10;
  }
  return result;
}

async function fetchAllEconomic() {
  console.log("\n📈 Fetching economic indicators...");

  const cpiRaw = await fetchWorldBankCPI();
  const wagesRaw = await fetchOECDWages();
  const housesRaw = await fetchFREDHousePrices();

  const result = {
    _meta: {
      description: "Economic indicators indexed to 2000 = 100",
      sources: {
        wages: { name: "OECD Average Annual Wages", indicator: "AV_AN_WAGE", unit: "USD constant prices constant PPP", url: "https://data-explorer.oecd.org" },
        cpi: { name: "World Bank Consumer Price Index", indicator: "FP.CPI.TOTL", url: "https://data.worldbank.org/indicator/FP.CPI.TOTL" },
        housePrices: { name: "BIS Residential Property Prices via FRED", unit: "Real CPI-deflated index", url: "https://data.bis.org/topics/RPP" },
      },
      baseYear: BASE_YEAR,
      generatedBy: "scripts/fetch-all-data.mjs",
      fetchedAt: new Date().toISOString(),
    },
  };

  for (const cc of ECON_COUNTRIES) {
    const cpiIndexed = rebaseIndex(cpiRaw[cc] || {}, BASE_YEAR);
    const wageIndexed = rebaseIndex(wagesRaw[cc] || {}, BASE_YEAR);
    const houseIndexed = rebaseIndex(housesRaw[cc] || {}, BASE_YEAR);

    const series = ECON_YEARS.map(year => ({
      year,
      wageIndex: wageIndexed[year] ?? null,
      cpiIndex: cpiIndexed[year] ?? null,
      housePriceIndex: houseIndexed[year] ?? null,
    })).filter(p => p.wageIndex != null || p.cpiIndex != null);

    result[cc] = { series };
  }

  saveJSON("purchasing-power.json", result);
  console.log(`  ✓ Economic data fetched for ${ECON_COUNTRIES.length} countries`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. Exchange rates — Frankfurter API (ECB rates)
// ═══════════════════════════════════════════════════════════════════════════════

async function fetchExchangeRates() {
  console.log("\n💱 Fetching exchange rates...");

  // Collect unique non-USD currencies
  const currencies = [...new Set(Object.values(COUNTRY_CONSTANTS).map(c => c.currency))]
    .filter(c => c !== "USD");

  // Frankfurter (ECB data) supports most major currencies; CLP is not covered
  const frankfurterCurrencies = currencies.filter(c => c !== "CLP");
  const url = `https://api.frankfurter.app/latest?from=USD&to=${frankfurterCurrencies.join(",")}`;
  const data = await fetchJSON(url);

  const rates = { USD: 1, ...data.rates };

  // CLP is not in the ECB basket — use World Bank official rate as fallback
  if (!rates.CLP) {
    try {
      const wbUrl = "https://api.worldbank.org/v2/country/CL/indicator/PA.NUS.FCRF?date=2023&format=json&per_page=5";
      const wbData = await fetchJSON(wbUrl);
      const wbRecords = wbData[1] || [];
      const clpRate = wbRecords.find(r => r.value != null)?.value;
      rates.CLP = clpRate ?? 950;
      console.log(`  CLP from World Bank: ${rates.CLP}`);
    } catch {
      rates.CLP = 950;
      console.log("  ⚠ CLP fallback: 950 (World Bank unavailable)");
    }
  }

  saveJSON("exchange-rates.json", {
    _meta: {
      description: "Exchange rates: units of local currency per 1 USD",
      source: "European Central Bank via Frankfurter API (https://api.frankfurter.app)",
      fallbacks: { CLP: "World Bank PA.NUS.FCRF or approximate market rate" },
      date: data.date,
      generatedBy: "scripts/fetch-all-data.mjs",
      fetchedAt: new Date().toISOString(),
    },
    rates,
  });

  console.log(`  ✓ Exchange rates fetched for ${Object.keys(rates).length} currencies`);
  return rates;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. Country metadata — WID.world + World Bank population + exchange rates
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch total population from World Bank (SP.POP.TOTL).
 * Returns { "US": 334.9, "GB": 68.3, ... } in millions.
 */
async function fetchWorldBankPopulation() {
  console.log("  Population: World Bank SP.POP.TOTL...");

  // World Bank accepts 2-letter ISO codes separated by semicolons
  const codes = ALL_COUNTRIES.join(";");
  const url = `https://api.worldbank.org/v2/country/${codes}/indicator/SP.POP.TOTL?date=2023:2024&format=json&per_page=500`;
  const data = await fetchJSON(url);
  const records = data[1] || [];

  const result = {};
  for (const r of records) {
    // World Bank uses country.id for 2-letter ISO codes (countryiso2code may be undefined)
    const cc = r.countryiso2code || r.country?.id;
    if (!cc || r.value == null) continue;
    // Keep latest year per country
    if (!result[cc] || Number(r.date) > result[cc].year) {
      result[cc] = { value: Math.round((r.value / 1_000_000) * 10) / 10, year: Number(r.date) };
    }
  }

  // World population
  try {
    const wUrl = "https://api.worldbank.org/v2/country/WLD/indicator/SP.POP.TOTL?date=2023:2024&format=json&per_page=5";
    const wData = await fetchJSON(wUrl);
    const wRecords = wData[1] || [];
    const latest = wRecords.find(r => r.value != null);
    if (latest) {
      result.GLOBAL = { value: Math.round((latest.value / 1_000_000) * 10) / 10, year: Number(latest.date) };
    }
  } catch {
    result.GLOBAL = { value: 8100, year: 2023 };
  }

  return Object.fromEntries(Object.entries(result).map(([cc, d]) => [cc, d.value]));
}

/**
 * Extract the latest available value from a WID year→value map.
 * Returns { value, year } or null.
 */
function getLatestWID(yearValueMap) {
  if (!yearValueMap || typeof yearValueMap !== "object") return null;
  const years = Object.keys(yearValueMap).map(Number).sort((a, b) => b - a);
  for (const y of years) {
    if (yearValueMap[String(y)] != null) {
      return { value: yearValueMap[String(y)], year: y };
    }
  }
  return null;
}

async function fetchCountryMetadataAndShares(exchangeRates) {
  console.log("\n🏛️  Fetching country metadata & income shares from WID...");

  // ── WID variables for country metadata ──
  const METADATA_VARS = [
    "ahweal_p0p100_992_j",   // mean wealth per adult (local currency)
    "thweal_p50p100_992_j",  // median wealth — threshold to enter top 50% (local currency)
    "ghweal_p0p100_992_j",   // wealth Gini coefficient
    "aptinc_p0p100_992_j",   // mean pre-tax national income per adult (local currency)
    "tptinc_p50p100_992_j",  // median pre-tax income — threshold to enter top 50% (local currency)
    "gptinc_p0p100_992_j",   // income Gini coefficient
  ];

  // ── WID variables for income shares (wealth shares already fetched in section 1) ──
  const INCOME_SHARE_VARS = [
    "sptinc_p99p100_992_j",  // top 1% pre-tax income share
    "sptinc_p90p100_992_j",  // top 10% pre-tax income share
    "sptinc_p0p50_992_j",    // bottom 50% pre-tax income share
  ];

  // ── WID variables for wealth shares (to match wealth-income-shares.json format) ──
  const WEALTH_SHARE_VARS = [
    "shweal_p99p100_992_j",  // top 1% wealth share
    "shweal_p90p100_992_j",  // top 10% wealth share
    "shweal_p0p50_992_j",    // bottom 50% wealth share
  ];

  const ALL_VARS = [...METADATA_VARS, ...INCOME_SHARE_VARS, ...WEALTH_SHARE_VARS];

  // Fetch from WID in batches (include "WO" for world/global)
  // WID uses "WO-MER" for world aggregates at market exchange rates
  const countriesWithWorld = [...ALL_COUNTRIES, "WO-MER"];
  const widData = {};

  for (let i = 0; i < countriesWithWorld.length; i += 8) {
    const batch = countriesWithWorld.slice(i, i + 8);
    console.log(`  WID metadata: ${batch.join(", ")}...`);
    try {
      const data = await fetchWID(batch, ALL_VARS);
      Object.assign(widData, parseWIDResponse(data));
    } catch (err) {
      console.log(`  ⚠ WID batch failed: ${err.message}`);
    }
    if (i + 8 < countriesWithWorld.length) await new Promise(r => setTimeout(r, 600));
  }

  // Fetch population from World Bank
  const populations = await fetchWorldBankPopulation();

  // ── Build country-metadata.json ──
  console.log("  Building country-metadata.json...");

  const metadata = {
    _meta: {
      description: "Country metadata — all monetary values in USD",
      sources: {
        meanWealth: "WID.world ahweal_p0p100_992_j (mean net personal wealth per adult)",
        medianWealth: "WID.world thweal_p50p100_992_j (wealth threshold to enter top 50%)",
        wealthGini: "WID.world ghweal_p0p100_992_j",
        meanIncome: "WID.world aptinc_p0p100_992_j (mean pre-tax national income per adult)",
        medianIncome: "WID.world tptinc_p50p100_992_j (income threshold to enter top 50%)",
        incomeGini: "WID.world gptinc_p0p100_992_j",
        population: "World Bank SP.POP.TOTL (millions)",
        exchangeRates: "ECB via Frankfurter API",
      },
      citation: "Chancel, L., Piketty, T., Saez, E., Zucman, G. et al. World Inequality Database, https://wid.world",
      methodology: "WID values are in local currency; converted to USD using ECB exchange rates at fetch time",
      generatedBy: "scripts/fetch-all-data.mjs",
      fetchedAt: new Date().toISOString(),
    },
  };

  const dataYears = {}; // Track data years for transparency

  for (const cc of ALL_COUNTRIES) {
    const constants = COUNTRY_CONSTANTS[cc];
    if (!constants) continue;

    const d = widData[cc];
    if (!d) {
      console.log(`  ⚠ No WID data for ${cc} — skipping`);
      continue;
    }

    const rate = exchangeRates[constants.currency] ?? 1;

    const meanWealth = getLatestWID(d["ahweal_p0p100_992_j"]);
    const medianWealth = getLatestWID(d["thweal_p50p100_992_j"]);
    const wealthGini = getLatestWID(d["ghweal_p0p100_992_j"]);
    const meanIncome = getLatestWID(d["aptinc_p0p100_992_j"]);
    const medianIncome = getLatestWID(d["tptinc_p50p100_992_j"]);
    const incomeGini = getLatestWID(d["gptinc_p0p100_992_j"]);
    const pop = populations[cc];

    metadata[cc] = {
      name: constants.name,
      flag: constants.flag,
      currency: constants.currency,
      population: pop ?? null,
      medianIncome: medianIncome ? Math.round(medianIncome.value / rate) : null,
      medianWealthPerAdult: medianWealth ? Math.round(medianWealth.value / rate) : null,
      meanWealthPerAdult: meanWealth ? Math.round(meanWealth.value / rate) : null,
      giniWealth: wealthGini ? Math.round(wealthGini.value * 100) / 100 : null,
      giniIncome: incomeGini ? Math.round(incomeGini.value * 100) / 100 : null,
    };

    dataYears[cc] = {
      wealth: meanWealth?.year ?? medianWealth?.year ?? null,
      income: meanIncome?.year ?? medianIncome?.year ?? null,
    };
  }

  // ── GLOBAL entry from WID "WO-MER" (world at market exchange rates, values in USD) ──
  const woData = widData["WO-MER"];
  if (woData) {
    const meanW = getLatestWID(woData["ahweal_p0p100_992_j"]);
    const medW = getLatestWID(woData["thweal_p50p100_992_j"]);
    const gW = getLatestWID(woData["ghweal_p0p100_992_j"]);
    const meanI = getLatestWID(woData["aptinc_p0p100_992_j"]);
    const medI = getLatestWID(woData["tptinc_p50p100_992_j"]);
    const gI = getLatestWID(woData["gptinc_p0p100_992_j"]);

    metadata.GLOBAL = {
      name: "Global",
      flag: "🌍",
      currency: "USD",
      population: populations.GLOBAL ?? 8100,
      medianIncome: medI ? Math.round(medI.value) : null,
      medianWealthPerAdult: medW ? Math.round(medW.value) : null,
      meanWealthPerAdult: meanW ? Math.round(meanW.value) : null,
      giniWealth: gW ? Math.round(gW.value * 100) / 100 : null,
      giniIncome: gI ? Math.round(gI.value * 100) / 100 : null,
    };
  } else {
    console.log("  ⚠ No WID world data (WO-MER) — using fallback for GLOBAL");
    metadata.GLOBAL = {
      name: "Global",
      flag: "🌍",
      currency: "USD",
      population: populations.GLOBAL ?? 8100,
      medianIncome: 3819,
      medianWealthPerAdult: 10079,
      meanWealthPerAdult: 87317,
      giniWealth: 0.88,
      giniIncome: 0.76,
    };
  }

  metadata._meta.dataYears = dataYears;
  saveJSON("country-metadata.json", metadata);

  // ── Build wealth-income-shares.json ──
  console.log("  Building wealth-income-shares.json...");

  const shares = {
    _meta: {
      description: "Wealth and income distribution shares from WID.world",
      sources: {
        wealthShares: "WID.world shweal variables (net personal wealth shares)",
        incomeShares: "WID.world sptinc variables (pre-tax national income shares)",
      },
      variables: [...WEALTH_SHARE_VARS, ...INCOME_SHARE_VARS],
      methodology: "middle40 = 100 - top10 - bottom50",
      citation: "Chancel, L., Piketty, T., Saez, E., Zucman, G. et al. World Inequality Database, https://wid.world",
      generatedBy: "scripts/fetch-all-data.mjs",
      fetchedAt: new Date().toISOString(),
    },
  };

  const allCodesForShares = [...ALL_COUNTRIES, "WO-MER"];

  for (const rawCC of allCodesForShares) {
    const cc = rawCC === "WO-MER" ? "GLOBAL" : rawCC;
    const d = widData[rawCC];
    if (!d) continue;

    const r = (v) => Math.round(v * 1000) / 10; // fraction → percentage with 1 decimal

    // Wealth shares
    const wTop1 = getLatestWID(d["shweal_p99p100_992_j"]);
    const wTop10 = getLatestWID(d["shweal_p90p100_992_j"]);
    const wBot50 = getLatestWID(d["shweal_p0p50_992_j"]);

    // Income shares
    const iTop1 = getLatestWID(d["sptinc_p99p100_992_j"]);
    const iTop10 = getLatestWID(d["sptinc_p90p100_992_j"]);
    const iBot50 = getLatestWID(d["sptinc_p0p50_992_j"]);

    const entry = {};

    if (wTop1 && wTop10 && wBot50) {
      const t1 = r(wTop1.value);
      const t10 = r(wTop10.value);
      const b50 = r(wBot50.value);
      entry.wealthShares = {
        top1: t1,
        top10: t10,
        middle40: Math.round((100 - t10 - b50) * 10) / 10,
        bottom50: b50,
      };
    }

    if (iTop1 && iTop10 && iBot50) {
      const t1 = r(iTop1.value);
      const t10 = r(iTop10.value);
      const b50 = r(iBot50.value);
      entry.incomeShares = {
        top1: t1,
        top10: t10,
        middle40: Math.round((100 - t10 - b50) * 10) / 10,
        bottom50: b50,
      };
    }

    if (entry.wealthShares || entry.incomeShares) {
      shares[cc] = entry;
    }
  }

  saveJSON("wealth-income-shares.json", shares);

  const metaCount = Object.keys(metadata).filter(k => k !== "_meta").length;
  const sharesCount = Object.keys(shares).filter(k => k !== "_meta").length;
  console.log(`  ✓ country-metadata.json: ${metaCount} countries`);
  console.log(`  ✓ wealth-income-shares.json: ${sharesCount} countries`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║  How Poor Am I? — Data Fetch Pipeline                   ║");
  console.log("║  Downloads raw data from public APIs → data/raw/        ║");
  console.log("╚══════════════════════════════════════════════════════════╝");

  if (!SKIP_WID) await fetchAllWID();
  if (!SKIP_BILLIONAIRES) await fetchAllBillionaires();
  if (!SKIP_ECONOMIC) await fetchAllEconomic();

  if (!SKIP_METADATA) {
    const exchangeRates = await fetchExchangeRates();
    await fetchCountryMetadataAndShares(exchangeRates);
  }

  console.log("\n✅ All data fetched. Raw JSON files in data/raw/");
  console.log("   Next: pnpm build");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
