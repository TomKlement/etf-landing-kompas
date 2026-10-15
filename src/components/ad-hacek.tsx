import { ETFS, etfByTicker } from "@/data/etfs";
import { formatPct } from "@/lib/fees";
import { AdMark, type AdFormat } from "./ad-page";

export function HacekAd({ format }: { format: AdFormat }) {
  const story = format === "story";
  const voo = etfByTicker("VOO");
  const cspx = etfByTicker("CSPX");
  const exchanges = cspx.listings
    .slice(0, 2)
    .map((listing) => `${listing.exchange} (${listing.ticker})`)
    .join(" · ");

  return (
    <div className={`flex h-full flex-col ${story ? "p-4" : "p-5"}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[11px] font-bold tracking-[0.08em]">
          <AdMark /> ETF KOMPAS
        </span>
        <span className="text-right text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-3">
          Regulace EU · KID
        </span>
      </div>

      <h2 className={`mt-3 font-bold leading-[1.05] tracking-tight ${story ? "text-[26px]" : "text-[28px]"}`}>
        {story ? (
          <>
            VOO si z Česka
            <br />
            nekoupíte.
          </>
        ) : (
          "VOO si z Česka nekoupíte."
        )}
        <br />
        <span className="text-forest">Tohle ano.</span>
      </h2>
      <p className="mt-2 text-[13px] leading-snug text-ink-2">
        Americká ETF nemají evropský KID, broker v Česku nový nákup nepovolí.
      </p>

      <div className={`mt-3 ${story ? "flex flex-1 flex-col gap-2" : "grid grid-cols-2 gap-2"}`}>
        <article className="rounded-card border border-line bg-paper/70 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-3">Americký originál</p>
          <p className="mt-1 text-[24px] font-bold leading-none tracking-tight text-ink-2">{voo.ticker}</p>
          <p className="mt-2 rounded-btn bg-[#fde8e4] px-2 py-1.5 text-[12px] font-semibold leading-snug text-loss">
            Blokováno v Česku a EU
          </p>
          <p className="mt-2 text-[11px] leading-snug text-ink-3">
            {voo.listings[0].exchange} · {voo.listings[0].currency}
          </p>
        </article>

        <article className="rounded-card border border-forest/30 bg-card p-3 shadow-l1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-forest">Evropská UCITS verze</p>
          <div className="mt-1 flex items-baseline justify-between gap-2">
            <p className="text-[24px] font-bold leading-none tracking-tight">{cspx.ticker}</p>
            <p className="num text-[16px] font-bold text-forest">{formatPct(cspx.ter)}</p>
          </div>
          <p className="num mt-2 text-[12px] font-semibold">{cspx.isin}</p>
          <p className="mt-1 text-[11px] leading-snug text-ink-3">{exchanges}</p>
        </article>
      </div>

      <div className="mt-auto pt-3">
        <span className="flex h-11 items-center justify-center rounded-full bg-forest px-4 text-center text-[14px] font-semibold text-white group-hover:bg-forest-deep">
          Odemknout srovnání {ETFS.length} fondů
        </span>
      </div>
    </div>
  );
}
