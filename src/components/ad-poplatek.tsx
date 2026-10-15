import { etfByTicker } from "@/data/etfs";
import { feeCost, formatCzk, formatPct } from "@/lib/fees";
import { AdMark, type AdFormat } from "./ad-page";

const MONTHLY = 5000;
const YEARS = 20;
const GROSS = 7;

export function PoplatekAd({ format }: { format: AdFormat }) {
  const story = format === "story";
  const rows = ["VOO", "IVV", "SPY"].map((ticker) => {
    const etf = etfByTicker(ticker);
    return { etf, cost: feeCost(MONTHLY, YEARS, GROSS, etf.ter) };
  });
  const cheapest = Math.min(...rows.map((row) => row.cost));
  const spread = Math.max(...rows.map((row) => row.cost)) - cheapest;

  return (
    <div className={`flex h-full flex-col ${story ? "p-4" : "p-5"}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[11px] font-bold tracking-[0.08em]">
          <AdMark /> ETF KOMPAS
        </span>
        <span className="text-right text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-3">
          Nezávislé srovnání
        </span>
      </div>

      <h2 className={`mt-3 font-bold leading-[1.05] tracking-tight ${story ? "text-[26px]" : "text-[30px]"}`}>
        Stejný index.
        <br />
        <span className="text-forest">Jiný poplatek.</span>
      </h2>
      <p className="mt-2 text-[13px] leading-snug text-ink-2">
        VOO, IVV a SPY sledují stejných 500 firem. Poplatek SPY je přesto víc než třikrát vyšší.
      </p>

      <div className="mt-3 rounded-card border border-line bg-card px-3 py-2.5 shadow-l1">
        <div className="flex items-baseline justify-between gap-2 border-b border-dashed border-line pb-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-3">
          <span>Účtenka za poplatky</span>
          <span className="num">
            {YEARS} let × {formatCzk(MONTHLY)}
          </span>
        </div>
        <ul>
          {rows.map(({ etf, cost }, index) => (
            <li key={etf.ticker} className="flex items-center justify-between gap-2 border-b border-dashed border-line py-1.5 last:border-b-0">
              <span className="flex min-w-0 items-center gap-1.5">
                <span className="text-[15px] font-bold">{etf.ticker}</span>
                {cost === cheapest && (
                  <span className="rounded-full bg-forest-soft px-1.5 py-0.5 text-[10px] font-semibold text-forest-deep">
                    nejlevnější
                  </span>
                )}
                {etf.ticker === "SPY" && (
                  <span className="rounded-full bg-amber-soft px-1.5 py-0.5 text-[10px] font-semibold text-[#92400e]">
                    3×
                  </span>
                )}
                <span className="num text-[11px] text-ink-3">TER {formatPct(etf.ter)}</span>
              </span>
              <span className="num shrink-0 text-[15px] font-bold">{formatCzk(cost)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-1 flex items-baseline justify-between gap-2 border-t-2 border-ink pt-2">
          <span className="text-[13px] font-semibold">Rozdíl za {YEARS} let</span>
          <span className="num text-[20px] font-bold leading-none text-forest">{formatCzk(spread)}</span>
        </div>
      </div>

      <p className="mt-2 text-[11px] leading-snug text-ink-3">
        {formatCzk(MONTHLY)} měsíčně, {YEARS} let, předpoklad {GROSS} % ročně. Není to prognóza.
      </p>

      <div className="mt-auto pt-3">
        <span className="flex h-11 items-center justify-center rounded-full bg-forest px-4 text-center text-[14px] font-semibold text-white group-hover:bg-forest-deep">
          Zjistit více o fondech zdarma
        </span>
      </div>
    </div>
  );
}
