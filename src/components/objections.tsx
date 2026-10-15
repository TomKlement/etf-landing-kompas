"use client";

import { useState } from "react";

const ITEMS: [string, string][] = [
  [
    "Není pár setin procenta prkotina?",
    "Často ano – VOO a IVV stojí totéž. U ACWI proti VT už ale za 20 let jde o desítky tisíc korun. Spočítejte si to nahoře se svou částkou. A u brokera zkontrolujte poplatek za převod měny: do TER se nepočítá.",
  ],
  [
    "Proč to dáváte zadarmo?",
    "Výměnou za e-mail. Občas pošleme další srovnání stejného typu, odhlásit se dá jedním klikem. Adresu nikomu nepředáváme.",
  ],
  [
    "Je to investiční doporučení?",
    "Ne. Je to srovnání veřejných údajů od emitentů fondů. Jestli a do čeho investovat, je vaše rozhodnutí.",
  ],
];

export function Objections() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="mt-5 divide-y divide-line border-y border-line">
      {ITEMS.map(([question, answer], index) => {
        const expanded = open === index;
        return (
          <div key={question}>
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : index)}
              className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-[17px] font-semibold"
            >
              {question}
              <span
                className={`text-xl leading-none text-ink-3 transition-transform duration-500 ease-out ${
                  expanded ? "rotate-45" : ""
                }`}
                aria-hidden
              >
                +
              </span>
            </button>
            <div className="reveal" data-open={expanded || undefined} inert={!expanded}>
              <div>
                <p className="pb-4 text-[15px] leading-relaxed text-ink-2">{answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
