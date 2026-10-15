"use client";

import { useId, useState } from "react";
import { useLead } from "./lead-context";

type Props = {
  placement: "calculator" | "mapping" | "final";
  scenario?: string;
  cta?: string;
  tone?: "light" | "dark";
};

export function LeadForm({ placement, scenario, cta = "Pošlete mi celé srovnání", tone = "light" }: Props) {
  const { unlocked, email: savedEmail, unlock } = useLead();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const id = useId();
  const dark = tone === "dark";

  if (unlocked) {
    return (
      <div
        role="status"
        className={`rounded-btn border px-4 py-3 text-[15px] leading-snug ${
          dark ? "border-white/20 bg-white/10 text-white" : "border-forest/20 bg-forest-soft text-forest-deep"
        }`}
      >
        <strong className="font-semibold">Odemčeno.</strong> Celou tabulku a postup nákupu máte níže
        {savedEmail ? (
          <>
            {" "}– kopie půjde na <span className="font-semibold break-all">{savedEmail}</span>.
          </>
        ) : (
          "."
        )}{" "}
        {placement !== "mapping" && (
          <a href="#z-ceska" className="font-semibold underline underline-offset-4">
            Přejít na tabulku
          </a>
        )}
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) {
      setStatus("error");
      setError("Zaškrtněte prosím souhlas – bez něj vám nic poslat nesmíme.");
      return;
    }
    setStatus("sending");
    setError(null);
    const company = (new FormData(e.currentTarget).get("company") as string) ?? "";
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, scenario, placement, company }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Nepovedlo se to.");
      unlock(email.trim().toLowerCase());
      requestAnimationFrame(() =>
        document.getElementById("z-ceska")?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Nepovedlo se to. Zkuste to znovu.");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3" aria-describedby={`${id}-note`}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`${id}-email`} className="sr-only">
          E-mail
        </label>
        <input
          id={`${id}-email`}
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="vas@email.cz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`h-12 w-full min-w-0 rounded-btn sm:flex-1 border px-4 text-base outline-none transition focus:ring-[3px] ${
            dark
              ? "border-white/25 bg-white/10 text-white placeholder:text-white/50 focus:border-mint focus:ring-mint/25"
              : "border-line-strong bg-card text-ink placeholder:text-ink-3 focus:border-forest focus:ring-forest/12"
          }`}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className={`h-12 shrink-0 rounded-btn px-5 text-[15px] font-semibold transition disabled:opacity-60 ${
            dark ? "bg-white text-forest-deep hover:bg-paper" : "bg-forest text-white hover:bg-forest-deep"
          }`}
        >
          {status === "sending" ? "Odesílám…" : cta}
        </button>
      </div>

      {/* honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <label className={`flex items-start gap-2.5 text-[13px] leading-snug ${dark ? "text-white/75" : "text-ink-2"}`}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-forest"
        />
        <span>
          Souhlasím se zasláním srovnání a občasných e-mailů od ETF Kompasu. Odhlásit se dá jedním klikem.
        </span>
      </label>

      <p id={`${id}-note`} className={`text-[13px] ${dark ? "text-white/60" : "text-ink-3"}`}>
        Jen e-mail. Žádný telefon, žádný „poradce se vám ozve“.
      </p>

      {status === "error" && error && (
        <p role="alert" className={`text-sm font-medium ${dark ? "text-amber-200" : "text-loss"}`}>
          {error}
        </p>
      )}
    </form>
  );
}
