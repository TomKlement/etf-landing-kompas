export type Source = {
  url: string;
  /** Short human label, e.g. "iShares US – produktová stránka" */
  label: string;
  /** ISO date the figure is valid for (as stated by the issuer), if any */
  asOf?: string;
};

export type Listing = { exchange: string; ticker: string; currency: string };

/** Every number on the page traces back to one of these fields. */
export type SourcedField = "ter" | "aum" | "inception" | "distribution" | "index" | "holdings" | "isin" | "listings";

export type Etf = {
  ticker: string;
  name: string;
  issuer: string;
  /** "us" = US-listed fund (no PRIIPs KID), "ucits" = Irish UCITS fund available to EU retail */
  kind: "us" | "ucits";
  isin?: string;
  ter: number;
  terNote?: string;
  /** null = issuer page didn't give a verifiable figure */
  aum: { usd: number; scope: string; asOf?: string } | null;
  inception: string;
  distribution: "acc" | "dist" | null;
  distributionFrequency?: string;
  index: string | null;
  holdings?: { count: number; asOf: string };
  listings: Listing[];
  /** Default source for every field */
  source: Source;
  /** Field-level source when it differs from `source` */
  sourceFor?: Partial<Record<SourcedField, Source>>;
  caveat?: string;
};

export type Scenario = {
  id: "sp500" | "world" | "nasdaq" | "custom";
  label: string;
  kicker: string;
  /** US tickers compared head-to-head */
  us: string[];
  /** UCITS tickers you can buy from CZ instead */
  ucits: string[];
  indexNote?: string;
};
