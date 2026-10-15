"use client";

import { SCENARIOS, etfByTicker } from "@/data/etfs";
import { EXTRA_SOURCES } from "@/data/sources";
import type { Etf } from "@/data/types";
import { formatPct, formatUsdBn } from "@/lib/fees";
import { useLead } from "./lead-context";
import { LeadForm } from "./lead-form";
import { SourceRef } from "./source-ref";

const GROUPS = SCENARIOS.filter((s) => s.id !== "custom");

export function FromCzechia() {
  const { unlocked } = useLead();

  // One fund stays visible as proof of what's behind the gate.
  const [first, ...rest] = GROUPS.flatMap((g) => g.ucits.map((t) => ({ group: g, etf: etfByTicker(t) })));

  return (
    <section id="z-ceska" aria-labelledby="z-ceska-h" className="scroll-mt-6">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-amber">Na tohle narazíte až u brokera</p>
      <h2 id="z-ceska-h" className="mt-2 text-[28px] font-bold leading-[1.15] tracking-tight sm:text-[32px]">
        Proč VOO v Česku nekoupíte
      </h2>
      <div className="mt-4 space-y-3 text-[17px] leading-relaxed text-ink-2">
        <p>
          Americké ETF nevydávají evropský sdělovací dokument (KID). Bez něj vám broker jako drobnému investorovi nový
          nákup nepovolí – už držené kusy můžete jen prodat.
          <SourceRef source={EXTRA_SOURCES.priips} />
        </p>
        <p>
          Řešení jsou <strong className="font-semibold text-ink">irské UCITS fondy</strong> na stejný index. Mají jiný
          ticker, jiné ISIN a někdy i jiný poplatek – a ne vždy nižší.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <UcitsCard etf={first.etf} replaces={first.group.us} />

        <div className="relative">
          <div
            className={unlocked ? "space-y-3" : "pointer-events-none max-h-[420px] space-y-3 overflow-hidden blur-[5px] select-none"}
            aria-hidden={!unlocked}
          >
            {rest.map(({ group, etf }) => (
              <UcitsCard key={etf.ticker} etf={etf} replaces={group.us} />
            ))}
          </div>

          {!unlocked && (
            <div className="absolute inset-0 flex items-end bg-gradient-to-b from-canvas/30 via-canvas/85 to-canvas pt-16">
              <div className="w-full rounded-card border border-line bg-card p-4 shadow-l3 sm:p-5">
                <p className="text-[17px] font-bold leading-snug tracking-tight">
                  Dalších {rest.length} fondů, ISIN a postup nákupu krok za krokem
                </p>
                <p className="mt-1 text-[14px] text-ink-2">
                  Odemknete hned tady na stránce a kopii dostanete e-mailem.
                </p>
                <div className="mt-4">
                  <LeadForm placement="mapping" cta="Odemknout" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {unlocked && <HowToBuy />}
    </section>
  );
}

function UcitsCard({ etf, replaces }: { etf: Etf; replaces: string[] }) {
  const usCheapest = Math.min(...replaces.map((t) => etfByTicker(t).ter));
  const pricier = etf.ter > usCheapest;
  return (
    <article className="rounded-card border border-line bg-card p-4 shadow-l1">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-semibold uppercase tracking-[0.05em] text-ink-3">
        <span>Místo {replaces.join(" / ")}</span>
      </div>
      <div className="mt-1.5 flex items-baseline justify-between gap-3">
        <h3 className="text-xl font-bold tracking-tight">{etf.ticker}</h3>
        <span className="num text-lg font-bold">
          {formatPct(etf.ter)}
          <SourceRef etf={etf} field="ter" />
        </span>
      </div>
      <p className="text-[14px] text-ink-2">{etf.name}</p>
      {etf.terNote && <p className="mt-1 text-[13px] text-forest">{etf.terNote}</p>}
      {pricier && (
        <p className="mt-2 rounded-btn bg-amber-soft px-3 py-2 text-[13px] leading-snug text-[#92400e]">
          Dražší než nejlevnější americká verze ({formatPct(usCheapest)}).
        </p>
      )}
      <dl className="num mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-dashed border-line pt-3 text-[13px]">
        <Item label="ISIN">
          <span className="font-mono text-[12.5px] tracking-tight">{etf.isin}</span>
          <SourceRef etf={etf} field="isin" />
        </Item>
        <Item label="Dividendy">
          {etf.distribution === "acc" ? "reinvestuje (Acc)" : `vyplácí ${etf.distributionFrequency ?? ""} (Dist)`}
        </Item>
        <Item label="Burzy">
          {etf.listings
            .slice(0, 2)
            .map((l) => `${l.exchange}: ${l.ticker} (${l.currency})`)
            .join(" · ")}
          <SourceRef etf={etf} field="listings" />
        </Item>
        {etf.aum && (
          <Item label="Velikost">
            {formatUsdBn(etf.aum.usd)}
            <SourceRef etf={etf} field="aum" />
          </Item>
        )}
      </dl>
    </article>
  );
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-3">{label}</dt>
      <dd className="mt-0.5 font-medium break-words text-ink">{children}</dd>
    </div>
  );
}

function HowToBuy() {
  const steps = [
    {
      title: "Hledejte podle ISIN, ne podle tickeru",
      body: "Stejný fond má na každé burze jiný ticker – CSPX v Londýně je SXR8 na Xetře. ISIN je pořád stejné.",
    },
    {
      title: "Vyberte burzu podle měny",
      body: "Xetra obchoduje v eurech, londýnská LSE často v dolarech. Rozhoduje, kde vám broker účtuje nižší převod z korun.",
    },
    {
      title: "Acc, nebo Dist",
      body: "Akumulační (Acc) fond dividendy sám reinvestuje, distribuční (Dist) je vyplácí na účet. Pro dlouhodobé spoření se obvykle volí Acc.",
    },
    {
      title: "Držte aspoň 3 roky",
      body: (
        <>
          Zisk z prodeje cenných papírů držených déle než 3 roky je osvobozen od daně z příjmů.
          <SourceRef source={EXTRA_SOURCES.timeTest} /> Limit 40 mil. Kč se na cenné papíry od roku 2026 nevztahuje.
          <SourceRef source={EXTRA_SOURCES.timeTestCap} /> Osvobozené jsou i prodeje, které za rok celkem nepřesáhnou
          100 000 Kč.
          <SourceRef source={EXTRA_SOURCES.timeTest} />
        </>
      ),
    },
  ];

  return (
    <div className="mt-10">
      <h3 className="text-[22px] font-bold tracking-tight">Jak je koupit z Česka</h3>
      <ol className="mt-4 space-y-3">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-4 rounded-card border border-line bg-card p-4">
            <span className="num flex size-8 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-bold text-white">
              {i + 1}
            </span>
            <div>
              <p className="font-semibold">{s.title}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
