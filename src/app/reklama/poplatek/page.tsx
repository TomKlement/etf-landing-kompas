import type { Metadata } from "next";
import { AdPage } from "@/components/ad-page";
import { PoplatekAd } from "@/components/ad-poplatek";

export const metadata: Metadata = {
  title: "Reklama A – Poplatek",
  description: "Náhled reklamy, která otevírá nadpis Stejný index. Jiný poplatek.",
};

export default function PoplatekAdPage() {
  return (
    <AdPage kicker="Reklama A – Poplatek" variant="poplatek">
      {(format) => <PoplatekAd format={format} />}
    </AdPage>
  );
}
