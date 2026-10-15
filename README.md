# ETF Kompas – lead magnet landing page

Jednostránkový web pro získání e-mailu. Výměnou za e-mail návštěvník dostane kompletní srovnání amerických ETF s jejich evropskými (UCITS) verzemi a postup, jak je koupit z Česka.

**Živě:** https://etf-landing-kompas.vercel.app/ · **Stack:** Next.js 16 (App Router), TypeScript, Tailwind v4, PostHog, Vercel

**Náhledy reklam** (čtverec do feedu a stories na mobil). Klik otevře stránku s nadpisem, který reklama slibuje.

- [Reklama A – Poplatek](https://etf-landing-kompas.vercel.app/reklama/poplatek), nadpis „Stejný index. Jiný poplatek.“
- [Reklama B – Háček](https://etf-landing-kompas.vercel.app/reklama/hacek), nadpis „VOO si z Česka nekoupíte. Tohle ano.“

Lokálně totéž na http://localhost:3000/reklama/poplatek a http://localhost:3000/reklama/hacek.

```bash
npm install
cp .env.example .env.local   # doplň NEXT_PUBLIC_POSTHOG_KEY
npm run dev
```

**Cílovka:** začínající až mírně pokročilý český investor, přichází z mobilní reklamy a má pár vteřin pozornosti. Ví, co je ETF a S&P 500, čte anglický obsah (Reddit, YouTube) a je skeptický a citlivý na poplatky. **Jediná metrika:** e-mail (`lead_submitted`).

---

## 1. Proč jsou sekce v tomhle pořadí

Princip: **nejdřív dát hodnotu, pak říct o e-mail**. Každá sekce odpovídá na otázku, kterou si návštěvník v tu chvíli klade.

| # | Sekce | Otázka návštěvníka | Proč je právě tady |
|---|---|---|---|
| 1 | **Nadpis podle reklamy** | „Jsem tam, kam jsem klikl?“ | Nadpis doslova opakuje slib reklamy (`utm_content`, viz [docs/ads.md](docs/ads.md)). Když se slib neshoduje, odchází se v prvních vteřinách. Nadpis je krátký, aby srovnávač začínal už na první obrazovce telefonu. |
| 2 | **Srovnávač ETF vs. ETF (účtenka)** | „Kolik mě to stojí?“ | Je to jádro hodnoty a je zdarma, bez registrace. Výsledek je **nad** posuvníky: s výchozími hodnotami (5 000 Kč, 20 let) vidí člověk odpověď dřív, než na cokoli sáhne. Skeptik dostane důkaz dřív, než ho žádáme o cokoli. |
| 3 | **Hlavní formulář** (pod účtenkou) | „Dobře, a co teď?“ | Formulář je ve chvíli nejvyššího zájmu: hned po výsledku a s háčkem „žádný z nich si z Česka nekoupíte“. Ten otevře otázku, na kterou odpovídá obsah za e-mailem. Rozmazaná hodnota „od 0,00 %“ vytváří zvědavost. |
| 4 | **Proč VOO v Česku nekoupíte + zamčené UCITS fondy** | „Opravdu? A co tedy?“ | Pro ty, kdo formulář přeskočili. Jedna karta (CSPX) je odkrytá jako důkaz, že za e-mailem je něco skutečného. Zbylých 8 je rozmazaných a pod nimi je druhý formulář. Karta také přiznává, že evropská verze bývá dražší, a to buduje důvěru u skeptika. |
| 5 | **Co přesně dostanete** | „Co za ten e-mail dostanu?“ | Konkrétní výčet snižuje riziko „dám e-mail a dostanu spam“. Explicitně slibuje „jeden e-mail, ne kurz“. |
| 6 | **Co by se zeptal skeptik** | „Kde je háček?“ | Tři námitky cílovky: setiny procenta, proč zdarma, je to doporučení? Odpovědi nejsou prodejní a jedna z nich přiznává, že rozdíl je někdy nulový. |
| 7 | **Závěrečný formulář** | „OK, chci to.“ | Poslední šance pro ty, kdo dočetli. Tmavý blok je vizuálně jiný, aby nesplynul s obsahem. |
| 8 | **Zdroje a metodika, upozornění** | „Odkud ta čísla máte?“ | Pro skeptika, který si to ověřuje. Zdroj je také přímo u každého čísla. |
| – | **Lišta s tlačítkem dole (mobil)** | – | Objeví se až po odscrollování za srovnávač a schová se, když je na obrazovce formulář nebo když už e-mail dal. Neruší čtení a připomíná akci jen tam, kde žádná výzva není vidět. |

Záměrně tu **není**: vyskakovací okno při vstupu, odpočet, fotky lidí ani obecné „3 ikonky výhod“. U skeptické cílovky to působí jako prodejní nátlak.

---

## 2. Očekávaná konverze

### Benchmarky (ověřené zdroje)

| Metrika | Hodnota | Zdroj |
|---|---|---|
| Medián konverze landing pages, všechny obory | 6,6 % | [Unbounce Conversion Benchmark Report](https://unbounce.com/average-conversion-rates-landing-pages/) (Q4 2024, 41 tis. stránek) |
| Medián, finanční služby | 8,3 % | [Unbounce – Finance & Insurance](https://unbounce.com/conversion-benchmark-report/finance-insurance-conversion-rate/) |
| Medián, **investování** (naše podkategorie) | **3,9 %** (horní kvartil 20,6 %) | tamtéž |
| Mobil vs. desktop ve financích | 11,5 % vs. 9 % | tamtéž |
| CTR reklam na Facebooku, Finance & Insurance (kampaně na návštěvnost) | 1,46 %, CPC 0,86 USD | [LocaliQ Facebook Ads Benchmarks 2026](https://localiq.com/blog/facebook-advertising-benchmarks/) |

Unbounce měří konverzi na jakýkoli cíl stránky (nejen e-mail) a na smíšeném provozu, ne jen na studeném z reklam. Proto je 3,9 % pro investování realistický základ, ne strop.

### Náš odhad: návštěva → e-mail

| Scénář | Konverze | Zdůvodnění |
|---|---|---|
| Pesimistický | 2,5 % | Studený provoz z reklam, finance a česká cílovka nedůvěřivá k e-mailům. |
| **Realistický (cíl)** | **4–6 %** | Nad mediánem pro investování: jen jedno pole, hodnota je vidět před žádostí, nadpis odpovídá reklamě a e-mail lze zadat na třech místech. |
| Optimistický | 8 %+ | Pokud zabere úhel „Háček“: lidé, kteří VOO opravdu chtěli koupit, mají silný důvod dát e-mail. |

**Odhad po krocích funnelu** (realistický scénář; jsou to hypotézy ke kalibraci, ne data):

| Krok (PostHog event) | Podíl z předchozího kroku | Kumulativně |
|---|---|---|
| `$pageview` | – | 100 % |
| `calculator_interacted` | ~40 % | 40 % |
| `lead_form_viewed` (calculator) | ~60 % všech návštěv* | – |
| `lead_submitted` | ~8 % z těch, kdo formulář viděli | **~5 %** |

\* Formulář je hned pod kalkulačkou, takže ho uvidí i lidé, kteří kalkulačku nepoužili. Proto je potřeba i druhý funnel bez kroku `calculator_interacted` (viz níže).

**Kdy odhad přepočítat:** po ~1 000 návštěvách z reklam, podle skutečných čísel z PostHogu.

---

## 3. Hypotézy pro A/B test (seřazené podle očekávaného dopadu)

Metrika u všech: `lead_submitted / $pageview` (unikátní návštěvy). Při základní konverzi 4 % a cíli zachytit relativní zlepšení o 20 % (4 % → 4,8 %) je potřeba **zhruba 10 000 návštěv na variantu** (95 % spolehlivost, 80 % síla testu). Proto testujeme jednu věc najednou a začínáme tou s největším dopadem.

### H1 – Úhel slibu: „Háček“ vs. „Poplatek“ · *největší dopad*
- **Hypotéza:** Pokud reklamu a nadpis postavíme na tom, že VOO z Česka nekoupíte, místo na rozdílu v poplatku, konverze stoupne o 25 % a víc. Informační mezera je osobní („to, co jsem chtěl koupit, nekoupím“), na rozdíl od abstraktních setin procenta. A obsah za e-mailem je přímou odpovědí na tuto mezeru.
- **Proč první:** Týká se 100 % návštěv a mění motivaci, ne jen tření. Už je připravené ([docs/ads.md](docs/ads.md), `utm_content=poplatek|hacek`).
- **Jak měřit:** funnel v PostHogu s breakdownem podle `headline_variant`. Test běží na úrovni reklama + stránka, takže porovnávej i CTR reklam a cenu za lead.

### H2 – Souhlas: povinné zaškrtávací pole vs. odeslání bez něj · *střední až velký dopad*
- **Hypotéza:** Pokud zrušíme povinné pole pro souhlas, odešle formulář o 15–25 % víc z těch, kdo začali vyplňovat. Doručení srovnání by bylo plnění požadavku a marketingový souhlas volitelné pole. Pole je dnes druhý povinný krok a jeho vynechání vede k chybové hlášce.
- **Proč druhé:** Působí na krok s nejvyšším záměrem. Před testem ale nutně potřebuje právní posouzení (GDPR), proto není první.
- **Jak měřit:** `lead_submitted / lead_form_viewed`. Doplnit event pro chybu „bez souhlasu“ a změřit, kolik lidí na ní odpadá.

### H3 – Odkrytá cena „od 0,07 %“ vs. rozmazaná „od 0,00 %“ · *menší dopad*
- **Hypotéza:** Pokud v bloku pod účtenkou ukážeme nejnižší TER evropské verze otevřeně místo rozmazání, konverze se nezhorší a důvěra skeptika stoupne. Rozmazání čísla, které je veřejně dohledatelné, může působit jako trik. Alternativní hypotéza je, že zvědavost z rozmazání konverzi zvedá o 5–10 %.
- **Proč třetí:** Mění jen jeden řádek textu u jednoho ze tří formulářů. Levný test, ale menší očekávaný rozdíl.
- **Jak měřit:** `lead_submitted` s `placement = calculator` / `lead_form_viewed` s `placement = calculator`.

---

## Technické poznámky

### Struktura
- `src/data/etfs.ts` – každý údaj o fondu s URL emitenta a datem platnosti (staženo 15. 10. 2026). `null` znamená, že stránka emitenta údaj neuvádí: nezobrazuje se a nedopočítává se.
- `src/data/sources.ts` – zdroje mimo fondy (PRIIPs, daňový zákon).
- `src/lib/fees.ts` – výpočet nákladů na poplatcích (měsíční vklady, TER aplikovaný na roční hrubý výnos).
- `src/lib/variants.ts` – nadpisy podle reklamy.
- `src/app/api/lead/route.ts` – endpoint pro leady.
- `src/app/reklama/` – náhledy obou reklam (čtverec a stories), odkazují na landing se stejným nadpisem.
- `docs/ads.md` – texty obou reklam.
- `ai-log/` – export konverzace s AI, ve které projekt vznikl.

### Leady
Lokálně se zapisují do `leads/leads.jsonl` (ignorováno gitem). **Na Vercelu se soubor nezachová.** Zapisuje se do `/tmp`, který se maže, a každý lead se proto vypíše do Runtime Logs (`[lead] {...}`). Logy mají krátkou retenci, takže před spuštěním placené kampaně je nutné napojit e-mailovou službu nebo databázi. E-mail se zatím nikomu neposílá; obsah se odemkne hned na stránce.

### Analytika (PostHog)
Proměnné jsou v `.env.example`. Bez klíče je měření vypnuté. Eventy jdou přes `/ingest` (rewrite v `next.config.ts`). Bez cookies (`persistence: memory`).

| Event | Kdy | Vlastnosti |
|---|---|---|
| `$pageview` | načtení stránky (automaticky) | `headline_variant`, `utm_*` |
| `calculator_interacted` | první dotyk ovládacího prvku kalkulačky, jednou za návštěvu | `control`, `scenario` |
| `lead_form_viewed` | aspoň 50 % formuláře na obrazovce, jednou pro každý formulář | `placement`: calculator / mapping / final |
| `lead_submitted` | `/api/lead` vrátil ok | `placement`, `scenario` |

Každý event nese `headline_variant` (poplatek / hacek).

### Aktualizace dat
Zkontroluj TER na stránkách emitentů a v KID. Uprav čísla a `asOf` v `src/data/etfs.ts` a `DATA_DATE` v `src/app/page.tsx`. Pokud se změní TER fondů SPY nebo VOO, zkontroluj i text reklamy A.
