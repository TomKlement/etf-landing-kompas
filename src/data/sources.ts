import type { Etf, Source, SourcedField } from "./types";

/** Non-fund sources cited in the copy. */
export const EXTRA_SOURCES = {
  priips: {
    url: "https://www.lynxbroker.com/service/products-and-regulations/regulations/key-information-document/",
    label: "LYNX Broker – Key Information Document (PRIIPs): fondy bez KID nejsou pro retail klienty",
  },
  timeTest: {
    url: "https://www.zakonyprolidi.cz/cs/1992-586",
    label: "Zákon č. 586/1992 Sb., o daních z příjmů – § 4 odst. 1 písm. u) a t)",
    asOf: "2026-08-01",
  },
  timeTestCap: {
    url: "https://www.zakonyprolidi.cz/cs/2025-360",
    label: "Zákon č. 360/2025 Sb. – zrušení limitu 40 mil. Kč pro cenné papíry od 1. 1. 2026",
  },
  vwceFeeCut: {
    url: "https://www.ch.vanguard/en/private-investor/insights/we-are-lowering-fees-on-one-of-our-most-popular-etfs",
    label: "Vanguard – oznámení snížení poplatku FTSE All-World UCITS (0,19 % → 0,14 %)",
  },
} satisfies Record<string, Source>;

export function sourceOf(etf: Etf, field: SourcedField): Source {
  return etf.sourceFor?.[field] ?? etf.source;
}
