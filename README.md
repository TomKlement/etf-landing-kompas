# ETF Kompas – lead magnet landing page

One-page Next.js (App Router) + TypeScript + Tailwind v4 site. Single goal: collect an e-mail in exchange for the full US ETF → UCITS comparison and the "how to buy from Czechia" guide.

```bash
npm install
npm run dev
```

## Where things live

- `src/data/etfs.ts` – every fund figure, with the issuer URL and as-of date (collected 2026-10-15). `null` means the issuer page didn't give a verifiable number; it's hidden, never estimated.
- `src/data/sources.ts` – non-fund sources (PRIIPs, Czech tax law).
- `src/lib/fees.ts` – fee-drag model (monthly contributions, TER applied on the annual gross return).
- `src/app/api/lead/route.ts` – lead endpoint.

## Leads

Leads are appended to `leads/leads.jsonl` (git-ignored). **This does not persist on Vercel**: its filesystem is read-only/ephemeral. Before going live, swap the `appendFile` call for an ESP (e.g. Ecomail) or a database. No e-mail is sent yet; the page unlocks the content instantly.

## Updating data

Re-check TERs against the issuer pages/KIDs, update the figures and `asOf` dates in `src/data/etfs.ts` and `DATA_DATE` in `src/app/page.tsx`.
