# Reklamy – 2 verze (Meta / Instagram, mobil)

Každá reklama slibuje jednu konkrétní věc a stránka ji v nadpisu zopakuje doslova. Varianta nadpisu se vybírá podle `utm_content` (viz `src/lib/variants.ts`), takže člověk z reklamy B nikdy neuvidí nadpis z reklamy A. PostHog posílá variantu jako `headline_variant` u každého eventu.

Všechna čísla v reklamách jsou ze stejných zdrojů jako stránka (`src/data/etfs.ts`). Reklamy neslibují výnos, mluví jen o poplatcích a dostupnosti.

---

## Reklama A – „Poplatek“ (úhel: šetřím na poplatcích)

Pro: člověk, který už ví, že chce S&P 500, a řeší, který fond vybrat.

| Pole | Text |
|---|---|
| **Primary text** | VOO, IVV a SPY kopírují stejný index S&P 500. Roční poplatek SPY je přitom víc než 3× vyšší než u VOO (0,0945 % vs. 0,03 %). Spočítejte si, kolik vás ten rozdíl stojí za 20 let – u každého čísla je odkaz na factsheet. |
| **Headline** | Stejný index. Jiný poplatek. |
| **Description** | Srovnání ETF zdarma |
| **CTA tlačítko** | Zjistit více |
| **Vizuál** | Výřez „účtenky“ ze stránky: VOO 9 300 Kč · IVV 9 300 Kč · SPY 29 300 Kč, pod tím „Rozdíl 20 000 Kč“. Drobně: „5 000 Kč měsíčně, 20 let, předpoklad 7 % ročně“. |
| **URL** | `https://etf-landing-kompas.vercel.app/?utm_source=meta&utm_medium=paid_social&utm_campaign=etf_kompas&utm_content=poplatek` |

**Nadpis na stránce:** „Stejný index. **Jiný poplatek.**“
**Proč to navazuje:** reklama ukáže rozdíl a stránka hned pod nadpisem otevře stejnou účtenku. První věc, kterou člověk vidí, je číslo, kvůli kterému klikl.

---

## Reklama B – „Háček“ (úhel: tohle jsem nevěděl)

Pro: člověk, který čte anglické fóra / YouTube a chystá se koupit VOO nebo VT.

| Pole | Text |
|---|---|
| **Primary text** | Chystáte se koupit VOO nebo VT? Jako drobný investor z Česka je u brokera nekoupíte – americké ETF nemají evropský dokument KID. Ukážeme vám evropské verze stejných indexů: ISIN, burzu a poplatek. |
| **Headline** | VOO si z Česka nekoupíte. Tohle ano. |
| **Description** | 17 fondů, zdroj u každého čísla |
| **CTA tlačítko** | Zjistit více |
| **Vizuál** | Dvě karty vedle sebe: „VOO – nedostupné pro drobné investory v EU“ (šedá, zámek) → „CSPX · IE00B5BMR087 · 0,07 %“ (zelená). Žádné logo ani UI skutečného brokera. |
| **URL** | `https://etf-landing-kompas.vercel.app/?utm_source=meta&utm_medium=paid_social&utm_campaign=etf_kompas&utm_content=hacek` |

**Nadpis na stránce:** „VOO si z Česka nekoupíte. **Tohle ano.**“
**Proč to navazuje:** reklama vyvolá otázku „a co tedy?“, nadpis ji zopakuje a slíbí odpověď. Ta je částečně vidět (karta CSPX) a celá za e-mailem.

---

## Na co si dát pozor

- Reklama B se opírá o tvrzení o PRIIPs/KID. Zdrojem je stránka brokera LYNX, primární zdroj od regulátora se nenašel. Pro jistotu ho před spuštěním doplň.
- Číslo „víc než 3×“ platí, dokud SPY uvádí 0,0945 % a VOO 0,03 %. Při aktualizaci dat zkontroluj i reklamu.
- Meta řadí finanční reklamy do zvláštní kategorie. Podle cílení může vyžadovat ověření inzerenta.
