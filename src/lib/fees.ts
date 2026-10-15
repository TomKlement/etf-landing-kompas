/**
 * Fee drag of an ETF on a regular monthly investment.
 *
 * Model: contributions at the start of each month, gross market return `grossPct`
 * compounded monthly, TER deducted as (1 + g)(1 − ter) on the annual rate.
 * The gross return is a user-chosen assumption, not a forecast and not fund data.
 */
export function futureValue(monthly: number, years: number, annualPct: number): number {
  const m = Math.pow(1 + annualPct / 100, 1 / 12) - 1;
  const n = Math.round(years * 12);
  if (m === 0) return monthly * n;
  return monthly * ((Math.pow(1 + m, n) - 1) / m) * (1 + m);
}

export function netAnnualPct(grossPct: number, terPct: number): number {
  return ((1 + grossPct / 100) * (1 - terPct / 100) - 1) * 100;
}

export function feeCost(monthly: number, years: number, grossPct: number, terPct: number): number {
  return (
    futureValue(monthly, years, grossPct) -
    futureValue(monthly, years, netAnnualPct(grossPct, terPct))
  );
}

const czk = new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 });
export const formatCzk = (v: number) => `${czk.format(Math.round(v / 100) * 100)} Kč`;

// Up to 4 decimals so issuer figures like SPY's 0.0945 % aren't rounded away.
const pct = new Intl.NumberFormat("cs-CZ", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
export const formatPct = (v: number) => `${pct.format(v)} %`;

export function formatUsdBn(usd: number): string {
  const bn = usd / 1e9;
  return `${new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: bn < 10 ? 1 : 0 }).format(bn)} mld. USD`;
}

export function formatDateCz(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d}. ${m}. ${y}`;
}
