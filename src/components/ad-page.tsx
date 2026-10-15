import { HEADLINES, landingHref, type HeadlineVariant } from "@/lib/variants";

export type AdFormat = "square" | "story";

const FORMATS: { id: AdFormat; label: string; frame: string; board: string; art: string }[] = [
  {
    id: "square",
    label: "Čtverec · feed 1:1",
    frame: "w-[440px] max-w-full",
    board: "aspect-square w-full",
    art: "ad-art-square",
  },
  {
    id: "story",
    label: "Mobil · stories 9:16",
    frame: "w-[300px] max-w-full",
    board: "aspect-[9/16] w-full",
    art: "ad-art-story",
  },
];

export function AdPage({
  kicker,
  variant,
  children,
}: {
  kicker: string;
  variant: HeadlineVariant;
  children: (format: AdFormat) => React.ReactNode;
}) {
  const href = landingHref(variant);
  const headline = HEADLINES[variant];

  return (
    <main className="min-h-screen bg-[#141414] px-4 py-8 text-white sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/50">{kicker}</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          {headline.lead} {headline.accent}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
          Klik na reklamu otevře stránku s tímhle nadpisem.
        </p>
        <a
          href={href}
          className="mt-2 block max-w-full break-all font-mono text-[13px] text-mint underline underline-offset-4"
        >
          {href}
        </a>

        <div className="mt-10 flex flex-wrap items-start gap-10">
          {FORMATS.map((format) => (
            <figure key={format.id} className={format.frame}>
              <figcaption className="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-white/50">
                {format.label}
              </figcaption>
              <div className={`ad-board overflow-hidden rounded-hero shadow-l3 ${format.board}`}>
                <a
                  href={href}
                  aria-label={`${headline.lead} ${headline.accent} Otevřít stránku.`}
                  className={`ad-art ${format.art} group flex flex-col bg-canvas text-ink outline-none focus-visible:ring-[3px] focus-visible:ring-mint`}
                >
                  {children(format.id)}
                </a>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}

export function AdMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 26 26" aria-hidden>
      <circle cx="13" cy="13" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-forest" />
      <path d="M13 4.5 L16 13 L13 21.5 L10 13 Z" className="fill-forest" />
      <path d="M13 13 L16 13 L13 21.5 Z" className="fill-amber" />
    </svg>
  );
}
