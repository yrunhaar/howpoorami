"use client";

import CountrySearchDropdown from "./CountrySearchDropdown";
import { ALL_COUNTRIES } from "@/data/countries-extended";

interface CountrySelectorProps {
  readonly selected: string;
  readonly onSelect: (code: string) => void;
}

export default function CountrySelector({ selected, onSelect }: CountrySelectorProps) {
  return (
    <div className="flex justify-center">
      <CountrySearchDropdown
        selected={selected}
        onSelect={onSelect}
        countries={ALL_COUNTRIES}
      />
    </div>
  );
}
