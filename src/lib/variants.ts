/**
 * Hero copy per ad. The ad's promise must be the first thing the visitor reads,
 * so each ad links with ?utm_content=<id> and gets its matching headline.
 * Full ad copy lives in docs/ads.md.
 */
export const HEADLINES = {
  // Ad A "Poplatek": same index, up to 3× the fee (SPY 0,0945 % vs VOO 0,03 %).
  poplatek: {
    lead: "Stejný index.",
    accent: "Jiný poplatek.",
    sub: "Porovnejte americké ETF, o kterých čtete, mezi sebou – a zjistěte, kterou verzi si z Česka opravdu koupíte.",
  },
  // Ad B "Háček": US ETFs can't be bought by Czech retail investors.
  hacek: {
    lead: "VOO si z Česka nekoupíte.",
    accent: "Tohle ano.",
    sub: "Porovnejte poplatky amerických ETF a zjistěte, které evropské verze stejných indexů koupíte z Česka – s ISIN i burzou.",
  },
} as const;

export type HeadlineVariant = keyof typeof HEADLINES;

export function resolveVariant(utmContent: string | string[] | null | undefined): HeadlineVariant {
  const v = Array.isArray(utmContent) ? utmContent[0] : utmContent;
  return v === "hacek" ? "hacek" : "poplatek";
}

/** Same query the ad brief uses, so the landing headline matches this creative. */
export function landingHref(variant: HeadlineVariant): string {
  const params = new URLSearchParams({
    utm_source: "meta",
    utm_medium: "paid_social",
    utm_campaign: "etf_kompas",
    utm_content: variant,
  });
  return `/?${params.toString()}`;
}
