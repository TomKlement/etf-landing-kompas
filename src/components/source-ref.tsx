import { sourceOf } from "@/data/sources";
import type { Etf, Source, SourcedField } from "@/data/types";

export function SourceRef({ etf, field, source }: { etf?: Etf; field?: SourcedField; source?: Source }) {
  const src = source ?? (etf && field ? sourceOf(etf, field) : undefined);
  if (!src) return null;
  return (
    <a
      href={src.url}
      target="_blank"
      rel="noopener noreferrer"
      className="ml-1 text-[12px] font-semibold text-forest/80 underline decoration-dotted underline-offset-2 hover:text-forest"
      aria-label={src.label}
      title={src.label}
    >
      zdroj
    </a>
  );
}
