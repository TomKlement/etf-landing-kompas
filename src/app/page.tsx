import { Comparator } from "@/components/comparator";
import { FromCzechia } from "@/components/from-czechia";
import { LeadProvider } from "@/components/lead-context";
import { LeadForm } from "@/components/lead-form";
import { Objections } from "@/components/objections";
import { StickyCta } from "@/components/sticky-cta";
import { ETFS } from "@/data/etfs";
import { formatDateCz } from "@/lib/fees";
import { HEADLINES, resolveVariant } from "@/lib/variants";

const DATA_DATE = "2026-10-15";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { utm_content } = await searchParams;
  const headline = HEADLINES[resolveVariant(utm_content)];
  const usCount = ETFS.filter((e) => e.kind === "us").length;
  const ucitsCount = ETFS.length - usCount;

  return (
    <LeadProvider>
      <div className="mx-auto max-w-[680px] px-4 pb-28 sm:px-6 sm:pb-16">
        <header className="flex items-center justify-between py-4">
          <a href="#" className="flex items-center gap-2 font-bold tracking-tight">
            <CompassMark />
            ETF Kompas
          </a>
          <a href="#zdroje" className="text-sm font-semibold text-ink-2 underline-offset-4 hover:underline">
            Zdroje dat
          </a>
        </header>

        {/* Hero – kept short so the comparator starts on the first mobile screen */}
        <section className="pt-4 pb-6 sm:pt-10 sm:pb-8">
          <h1 className="text-[34px] leading-[1.08] font-bold tracking-[-0.02em] sm:text-[48px]">
            {headline.lead}
            <br />
            <span className="text-forest">{headline.accent}</span>
          </h1>
          <p className="mt-4 max-w-[34ch] text-[17px] leading-relaxed text-ink-2 sm:max-w-none sm:text-lg">
            {headline.sub}
          </p>
          <ul className="num mt-5 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] font-medium text-ink-2">
            <li className="flex items-center gap-1.5">
              <Dot /> {usCount} amerických + {ucitsCount} evropských fondů
            </li>
            <li className="flex items-center gap-1.5">
              <Dot /> každé číslo s odkazem na emitenta
            </li>
            <li className="flex items-center gap-1.5">
              <Dot /> data k {formatDateCz(DATA_DATE)}
            </li>
          </ul>
        </section>

        <section id="srovnani" aria-label="Srovnání poplatků">
          <Comparator />
        </section>

        <div className="mt-16 sm:mt-20">
          <FromCzechia />
        </div>

        {/* What's in the e-mail */}
        <section className="mt-16 sm:mt-20" aria-labelledby="co-h">
          <h2 id="co-h" className="text-[26px] font-bold leading-tight tracking-tight">
            Co přesně dostanete
          </h2>
          <div className="mt-5 rounded-card border border-line bg-card shadow-l1">
            {[
              [
                "Tabulka všech " + ETFS.length + " fondů",
                "Americký originál vedle evropské verze: TER, ISIN, burza, měna, Acc/Dist, velikost fondu. S odkazem na zdroj u každého čísla.",
              ],
              [
                "Postup nákupu z Česka",
                "Čtyři kroky od výběru burzy po daňový časový test. Bez názvů brokerů za provizi.",
              ],
              ["Jeden e-mail, ne kurz", "Žádný „5denní e-mailový kurz“ ani webinář. Kopie toho, co odemknete tady."],
            ].map(([t, d], i) => (
              <div key={t} className={`flex gap-4 p-4 sm:p-5 ${i > 0 ? "border-t border-line" : ""}`}>
                <span className="num pt-0.5 text-sm font-bold text-forest">0{i + 1}</span>
                <div>
                  <p className="font-semibold">{t}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skeptic objections */}
        <section className="mt-16 sm:mt-20" aria-labelledby="namitky-h">
          <h2 id="namitky-h" className="text-[26px] font-bold leading-tight tracking-tight">
            Co by se zeptal skeptik
          </h2>
          <Objections />
        </section>

        {/* Final CTA */}
        <section className="mt-16 rounded-hero bg-forest-deep p-5 text-white sm:mt-20 sm:p-8" aria-labelledby="final-h">
          <h2 id="final-h" className="text-[26px] leading-tight font-bold tracking-tight">
            Celé srovnání do e-mailu
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-white/75">
            {ETFS.length} fondů, ISIN, burzy a postup nákupu z Česka. Za minutu to máte.
          </p>
          <div className="mt-5">
            <LeadForm placement="final" tone="dark" cta="Pošlete mi to" />
          </div>
        </section>

        {/* Sources */}
        <section id="zdroje" className="mt-16 scroll-mt-6 sm:mt-20" aria-labelledby="zdroje-h">
          <h2 id="zdroje-h" className="text-[20px] font-bold tracking-tight">
            Zdroje a metodika
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
            Údaje o fondech pocházejí z produktových stránek, factsheetů a KID emitentů, stažených{" "}
            {formatDateCz(DATA_DATE)}. Náklady v Kč počítáme jako rozdíl mezi hodnotou investice bez poplatku a s
            ročním TER, při měsíčním vkladu na začátku měsíce a zvoleném předpokladu výnosu. Nezahrnují poplatky
            brokera, převod měny, daně ani kurzové riziko.
          </p>
        </section>

        <footer className="mt-14 border-t border-line pt-6 text-[12px] leading-relaxed text-ink-3">
          <p>
            ETF Kompas není investiční poradce ani zprostředkovatel. Obsah je srovnání veřejně dostupných údajů, nikoli
            investiční doporučení. Investice do ETF nesou riziko ztráty; minulé výsledky ani předpoklady výnosu nejsou
            zárukou budoucích.
          </p>
          <p className="mt-3">© {new Date(DATA_DATE).getFullYear()} ETF Kompas</p>
        </footer>
      </div>

      <StickyCta />
    </LeadProvider>
  );
}

function Dot() {
  return <span className="size-1.5 rounded-full bg-forest" aria-hidden />;
}

function CompassMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
      <circle cx="13" cy="13" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-forest" />
      <path d="M13 4.5 L16 13 L13 21.5 L10 13 Z" className="fill-forest" />
      <path d="M13 13 L16 13 L13 21.5 Z" className="fill-amber" />
    </svg>
  );
}
