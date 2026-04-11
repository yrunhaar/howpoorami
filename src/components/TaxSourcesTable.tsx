import { TAX_RATES } from "@/data/tax-rates";
import rawMetadata from "../../data/raw/country-metadata.json";

type RawMeta = Record<string, { name?: string; flag?: string }>;

interface TaxSourceEntry {
  readonly countryCode: string;
  readonly countryName: string;
  readonly flag: string;
  readonly source: string;
  readonly year: number;
}

function buildSourceEntries(): readonly TaxSourceEntry[] {
  const meta = rawMetadata as RawMeta;

  return Object.entries(TAX_RATES)
    .map(([code, rates]) => ({
      countryCode: code,
      countryName: meta[code]?.name ?? code,
      flag: meta[code]?.flag ?? "",
      source: rates.source,
      year: rates.year,
    }))
    .sort((a, b) => a.countryName.localeCompare(b.countryName));
}

export default function TaxSourcesTable() {
  const entries = buildSourceEntries();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border-subtle">
            <th className="text-left py-3 px-3 text-text-primary font-semibold text-xs uppercase tracking-wider">
              Country
            </th>
            <th className="text-left py-3 px-3 text-text-primary font-semibold text-xs uppercase tracking-wider">
              Source
            </th>
            <th className="text-center py-3 px-3 text-text-primary font-semibold text-xs uppercase tracking-wider w-20">
              Year
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.countryCode}
              className="border-b border-border-subtle/50 hover:bg-bg-card/50 transition-colors"
            >
              <td className="py-2.5 px-3 text-text-primary whitespace-nowrap">
                <span className="mr-1.5">{entry.flag}</span>
                {entry.countryName}
              </td>
              <td className="py-2.5 px-3 text-text-secondary text-xs leading-relaxed">
                {entry.source}
              </td>
              <td className="py-2.5 px-3 text-text-muted text-center text-xs">
                {entry.year}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-text-muted text-[11px] mt-4 leading-relaxed">
        Effective tax rates include all taxes: income, payroll, corporate
        (allocated to shareholders), property, estate, and consumption taxes,
        divided by total pre-tax economic income. Sources combine academic
        research, government tax statistics, and the{" "}
        <a
          href="https://www.taxobservatory.eu"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-periwinkle hover:underline"
        >
          EU Tax Observatory
        </a>{" "}
        Global Tax Evasion Report (2024). Tax rate data is not API-fetchable
        and is maintained manually from published government statistics and academic papers.
      </p>
    </div>
  );
}
