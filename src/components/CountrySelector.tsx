"use client";

import { useMemo } from "react";
import CountrySearchDropdown from "./CountrySearchDropdown";
import { ALL_COUNTRIES, GLOBAL_COUNTRY } from "@/data/countries-extended";
import type { CountryData } from "@/data/wealth-data";

interface CountrySelectorProps {
  readonly selected: string;
  readonly onSelect: (code: string) => void;
}

export default function CountrySelector({ selected, onSelect }: CountrySelectorProps) {
  const countriesWithGlobal = useMemo(() => {
    const globalEntry: CountryData = GLOBAL_COUNTRY;
    return [globalEntry, ...ALL_COUNTRIES];
  }, []);

  return (
    <div className="flex justify-center">
      <CountrySearchDropdown
        selected={selected}
        onSelect={onSelect}
        countries={countriesWithGlobal}
      />
    </div>
  );
}
