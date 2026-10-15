import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

// Leads go to a local JSONL file for now. On Vercel only /tmp is writable and it is
// wiped between invocations, so there each lead is also printed to the runtime log.
// Swap for an ESP or a database before running paid traffic.
const ON_VERCEL = Boolean(process.env.VERCEL);
const LEADS_DIR = process.env.LEADS_DIR ?? (ON_VERCEL ? "/tmp/leads" : path.join(process.cwd(), "leads"));
const LEADS_FILE = path.join(LEADS_DIR, "leads.jsonl");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type LeadBody = {
  email?: unknown;
  consent?: unknown;
  scenario?: unknown;
  placement?: unknown;
  company?: unknown; // honeypot
};

export async function POST(req: Request) {
  let body: LeadBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Neplatný požadavek." }, { status: 400 });
  }

  // Bots fill the hidden field; pretend success so they don't retry.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "Tenhle e-mail nevypadá správně." }, { status: 422 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ ok: false, error: "Potřebujeme souhlas se zasláním." }, { status: 422 });
  }

  const record = {
    email,
    scenario: typeof body.scenario === "string" ? body.scenario.slice(0, 32) : null,
    placement: typeof body.placement === "string" ? body.placement.slice(0, 32) : null,
    consent: true,
    createdAt: new Date().toISOString(),
    userAgent: req.headers.get("user-agent")?.slice(0, 200) ?? null,
  };

  if (ON_VERCEL) console.log("[lead]", JSON.stringify(record));

  try {
    await mkdir(LEADS_DIR, { recursive: true });
    await appendFile(LEADS_FILE, JSON.stringify(record) + "\n", "utf8");
  } catch (err) {
    console.error("lead write failed", err);
    // The lead is already in the runtime log; don't punish the visitor for our storage.
    if (ON_VERCEL) return NextResponse.json({ ok: true });
    return NextResponse.json(
      { ok: false, error: "Nepovedlo se uložit. Zkuste to prosím za chvíli." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
