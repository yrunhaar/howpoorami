"use client";

import { useEffect, useState } from "react";
import { type AllCountryCode, ALL_COUNTRY_MAP } from "@/data/countries-extended";

/**
 * Attempts to detect the user's country from browser geolocation or timezone.
 * Returns a valid AllCountryCode if found, or null.
 */
export function useGeoCountry(): AllCountryCode | null {
  const [detected, setDetected] = useState<AllCountryCode | null>(null);

  useEffect(() => {
    // First try timezone-based detection (no permission needed)
    const tzCountry = detectFromTimezone();
    if (tzCountry) {
      setDetected(tzCountry);
      return;
    }

    // Fallback: try navigator language
    const langCountry = detectFromLanguage();
    if (langCountry) {
      setDetected(langCountry);
    }
  }, []);

  return detected;
}

const TIMEZONE_TO_COUNTRY: Readonly<Record<string, AllCountryCode>> = {
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Anchorage": "US",
  "Pacific/Honolulu": "US",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "Europe/London": "GB",
  "Europe/Paris": "FR",
  "Europe/Berlin": "DE",
  "Europe/Amsterdam": "NL",
  "Europe/Stockholm": "SE",
  "Europe/Oslo": "NO",
  "Europe/Copenhagen": "DK",
  "Europe/Helsinki": "FI",
  "Europe/Zurich": "CH",
  "Europe/Rome": "IT",
  "Europe/Madrid": "ES",
  "Europe/Lisbon": "PT",
  "Europe/Vienna": "AT",
  "Europe/Brussels": "BE",
  "Europe/Dublin": "IE",
  "Europe/Warsaw": "PL",
  "Europe/Prague": "CZ",
  "Asia/Tokyo": "JP",
  "Asia/Seoul": "KR",
  "Asia/Shanghai": "CN",
  "Asia/Kolkata": "IN",
  "Asia/Singapore": "SG",
  "Australia/Sydney": "AU",
  "Australia/Melbourne": "AU",
  "Pacific/Auckland": "NZ",
  "America/Sao_Paulo": "BR",
  "America/Mexico_City": "MX",
  "America/Santiago": "CL",
  "Africa/Johannesburg": "ZA",
};

function detectFromTimezone(): AllCountryCode | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const code = TIMEZONE_TO_COUNTRY[tz];
    if (code && code in ALL_COUNTRY_MAP) return code;
  } catch {
    // Timezone detection failed
  }
  return null;
}

const LANG_TO_COUNTRY: Readonly<Record<string, AllCountryCode>> = {
  "en-US": "US",
  "en-GB": "GB",
  "en-AU": "AU",
  "en-CA": "CA",
  "en-NZ": "NZ",
  "en-IE": "IE",
  "en-ZA": "ZA",
  "fr-FR": "FR",
  "fr-BE": "BE",
  "fr-CA": "CA",
  "de-DE": "DE",
  "de-AT": "AT",
  "de-CH": "CH",
  "nl-NL": "NL",
  "nl-BE": "BE",
  "ja-JP": "JP",
  "ko-KR": "KR",
  "zh-CN": "CN",
  "pt-BR": "BR",
  "pt-PT": "PT",
  "es-ES": "ES",
  "es-MX": "MX",
  "es-CL": "CL",
  "it-IT": "IT",
  "sv-SE": "SE",
  "nb-NO": "NO",
  "nn-NO": "NO",
  "da-DK": "DK",
  "fi-FI": "FI",
  "pl-PL": "PL",
  "cs-CZ": "CZ",
};

function detectFromLanguage(): AllCountryCode | null {
  try {
    const lang = navigator.language;
    const code = LANG_TO_COUNTRY[lang];
    if (code && code in ALL_COUNTRY_MAP) return code;
  } catch {
    // Language detection failed
  }
  return null;
}
