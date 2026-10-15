import type { Metadata } from "next";
import { AdPage } from "@/components/ad-page";
import { HacekAd } from "@/components/ad-hacek";

export const metadata: Metadata = {
  title: "Reklama B – Háček",
  description: "Náhled reklamy, která otevírá nadpis VOO si z Česka nekoupíte. Tohle ano.",
};

export default function HacekAdPage() {
  return (
    <AdPage kicker="Reklama B – Háček" variant="hacek">
      {(format) => <HacekAd format={format} />}
    </AdPage>
  );
}
