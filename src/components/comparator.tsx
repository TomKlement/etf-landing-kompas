"use client";

import { useMemo, useState } from "react";
import { ETFS, SCENARIOS, etfByTicker } from "@/data/etfs";
import type { Etf, Scenario } from "@/data/types";
import { trackOnce } from "@/lib/analytics";
import { feeCost, formatCzk, formatPct } from "@/lib/fees";
import { LeadForm } from "./lead-form";
import { useLead } from "./lead-context";
import { SourceRef } from "./source-ref";

const RETURN_OPTIONS = [5, 7, 9] as const;

export function Comparator() {
  const [scenarioId, setScenarioId] = useState<Scenario["id"]>("sp500");
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(20);
  const [gross, setGross] = useState<(typeof RETURN_OPTIONS)[number]>(7);
  const [customA, setCustomA] = useState("SPY");
  const [customB, setCustomB] = useState("VOO");
  const { unlocked } = useLead();

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;

  // First touch of any control counts as "interacted"; one event per page load keeps the funnel clean.
  const interacted = (control: "scenario" | "monthly" | "years" | "return" | "custom_fund", next = scenarioId) =>
    trackOnce("calculator", "calculator_interacted", { control, scenario: next });

  const funds: Etf[] = useMemo(() => {
    const tickers = scenarioId === "custom" ? [customA, customB] : scenario.us;
    return [...new Set(tickers)].map(etfByTicker);
  }, [scenarioId, scenario.us, customA, customB]);

  const rows = useMemo(
    () =>
      funds
        .map((etf) => ({ etf, cost: feeCost(monthly, years, gross, etf.ter) }))
        .sort((a, b) => a.cost - b.cost),
    [funds, monthly, years, gross],
  );

  const spread = rows.length > 1 ? rows[rows.length - 1].cost - rows[0].cost : 0;
  const cheapestUcits =
    scenarioId === "custom" ? null : Math.min(...scenario.ucits.map((t) => etfByTicker(t).ter));
  const allUs = funds.every((f) => f.kind === "us");

  return (
    <div className="overflow-hidden rounded-hero border border-line bg-card shadow-l2">
      {/* Scenario tabs */}
      <div role="tablist" aria-label="Strategie" className="grid grid-cols-4 border-b border-line bg-paper/60 p-1.5">
        {SCENARIOS.map((s) => {
          const active = s.id === scenarioId;
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={active}
              aria-controls="srovnani-panel"
              onClick={() => {
                setScenarioId(s.id);
                interacted("scenario", s.id);
              }}
              // 17px sits on the 24px shell once the 1px border and 6px inset are taken off.
              className={`rounded-[17px] px-1 py-2.5 text-[13px] font-semibold leading-tight transition sm:text-sm ${
                active ? "bg-card text-ink shadow-l1" : "text-ink-2 hover:text-ink"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <div id="srovnani-panel" role="tabpanel" className="p-4 sm:p-6">
        <p className="text-[15px] leading-relaxed text-ink-2">{scenario.kicker}</p>

        <div
          className="reveal"
          data-open={scenarioId === "custom" || undefined}
          inert={scenarioId !== "custom"}
        >
          <div>
            <div className="grid grid-cols-2 gap-2 pt-4">
            {[
              { value: customA, set: setCustomA, label: "Fond A" },
              { value: customB, set: setCustomB, label: "Fond B" },
            ].map(({ value, set, label }) => (
              <label key={label} className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.05em] text-ink-3">{label}</span>
                <select
                  value={value}
                  onChange={(e) => {
                    set(e.target.value);
                    interacted("custom_fund");
                  }}
                  className="mt-1 h-12 w-full rounded-btn border border-line-strong bg-card px-3 text-[15px] font-semibold"
                >
                  <optgroup label="Americké (z ČR nekoupíte)">
                    {ETFS.filter((e) => e.kind === "us").map((e) => (
                      <option key={e.ticker} value={e.ticker}>
                        {e.ticker} · {formatPct(e.ter)}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Evropské UCITS">
                    {ETFS.filter((e) => e.kind === "ucits").map((e) => (
                      <option key={e.ticker} value={e.ticker}>
                        {e.ticker} · {formatPct(e.ter)}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </label>
            ))}
            </div>
          </div>
        </div>

        {/* Receipt */}
        <div className="receipt-edge mt-4 bg-canvas px-4 pt-4 pb-7 sm:px-5" aria-live="polite">
          <div className="flex items-baseline justify-between border-b border-dashed border-line-strong pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">
            <span>Účtenka za poplatky</span>
            <span className="num">
              {years} let × {formatCzk(monthly)}
            </span>
          </div>

          <ul className="divide-y divide-dashed divide-line">
            {rows.map(({ etf, cost }, i) => (
              <li key={etf.ticker} className="py-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-[17px] font-bold tracking-tight">{etf.ticker}</span>
                  {rows.length > 1 && i === 0 && (
                    <span className="rounded-full bg-forest-soft px-2 py-0.5 text-[11px] font-semibold text-forest-deep">
                      nejlevnější
                    </span>
                  )}
                  <span className="dotted-leader h-3 flex-1" aria-hidden />
                  <span className="num text-[17px] font-bold">{formatCzk(cost)}</span>
                </div>
                <div className="mt-0.5 flex items-baseline justify-between gap-3 text-[13px] text-ink-2">
                  <span className="truncate">{etf.name}</span>
                  <span className="num shrink-0">
                    TER {formatPct(etf.ter)}
                    <SourceRef etf={etf} field="ter" />
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {rows.length > 1 && (
            <div className="mt-1 border-t-2 border-ink pt-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold">Rozdíl mezi nimi</span>
                <span className="num text-[28px] font-bold leading-none tracking-tight text-forest">
                  {formatCzk(spread)}
                </span>
              </div>
              <p className="mt-2 text-[13px] leading-snug text-ink-2">
                {spread < 1000
                  ? "Prakticky nic. U těchhle dvojčat rozhoduje spíš, jestli je vůbec koupíte – a za kolik u brokera."
                  : `Tolik vás za ${years} let stojí sáhnout po dražším fondu na ${
                      scenarioId === "world" ? "podobný" : "stejný"
                    } index.`}
              </p>
            </div>
          )}
          {scenario.indexNote && <p className="mt-3 text-[12px] leading-snug text-ink-3">{scenario.indexNote}</p>}
        </div>

        {/* Inputs – below the receipt so the answer is visible first */}
        <div className="mt-5 space-y-4 rounded-card border border-line p-4">
          <Slider
            label="Měsíčně investuji"
            value={monthly}
            display={formatCzk(monthly)}
            min={1000}
            max={50000}
            step={500}
            onChange={(v) => {
              setMonthly(v);
              interacted("monthly");
            }}
          />
          <Slider
            label="Po dobu"
            value={years}
            display={`${years} let`}
            min={5}
            max={40}
            step={1}
            onChange={(v) => {
              setYears(v);
              interacted("years");
            }}
          />
          <fieldset>
            <legend className="text-sm font-semibold text-ink">
              Předpoklad výnosu trhu <span className="font-normal text-ink-3">(ne prognóza)</span>
            </legend>
            <div className="mt-2 flex gap-2">
              {RETURN_OPTIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={gross === r}
                  onClick={() => {
                    setGross(r);
                    interacted("return");
                  }}
                  className={`num h-10 flex-1 rounded-btn border text-sm font-semibold transition ${
                    gross === r
                      ? "border-forest bg-forest-soft text-forest-deep"
                      : "border-line bg-card text-ink-2 hover:border-line-strong"
                  }`}
                >
                  {r} % ročně
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Bridge to the twist + primary lead capture */}
        <div id="ziskat" className="mt-5 scroll-mt-24 rounded-card border border-line bg-paper/50 p-4 sm:p-5">
          {allUs ? (
            <p className="text-[17px] font-bold leading-snug tracking-tight">
              Háček: žádný z nich si jako drobný investor z Česka nekoupíte.
            </p>
          ) : (
            <p className="text-[17px] font-bold leading-snug tracking-tight">
              Chcete celé srovnání všech {ETFS.length} fondů na jednom místě?
            </p>
          )}
          {cheapestUcits !== null && (
            <p className="mt-1.5 text-[15px] text-ink-2">
              Evropská verze stejného indexu stojí od{" "}
              {unlocked ? (
                <strong className="num text-ink">{formatPct(cheapestUcits)}</strong>
              ) : (
                <span className="num rounded bg-ink/8 px-1.5 font-semibold text-ink/40 blur-[3px] select-none" aria-label="skryto">
                  0,00 %
                </span>
              )}{" "}
              ročně. Které to jsou, kde je koupit a pod jakým ISIN vám pošleme.
            </p>
          )}
          <div className="mt-4">
            <LeadForm placement="calculator" scenario={scenarioId} cta="Ukažte mi je" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider(props: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-ink">{props.label}</span>
        <span className="num text-lg font-bold text-forest">{props.display}</span>
      </span>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
        className="mt-2 h-6 w-full cursor-pointer"
      />
    </label>
  );
}
