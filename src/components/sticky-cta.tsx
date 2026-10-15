"use client";

import { useEffect, useState } from "react";
import { useLead } from "./lead-context";

/** Mobile-only bar: appears once the comparator has scrolled away, hides near any form. */
export function StickyCta() {
  const { unlocked } = useLead();
  const [pastComparator, setPastComparator] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const comparator = document.getElementById("srovnani");
    const forms = Array.from(document.querySelectorAll("form"));
    if (!comparator) return;

    const io1 = new IntersectionObserver(([e]) =>
      setPastComparator(!e.isIntersecting && e.boundingClientRect.top < 0),
    );
    io1.observe(comparator);

    const visible = new Set<Element>();
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      setFormVisible(visible.size > 0);
    });
    forms.forEach((f) => io2.observe(f));

    return () => {
      io1.disconnect();
      io2.disconnect();
    };
  }, [unlocked]);

  const show = pastComparator && !formVisible && !unlocked;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/95 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-l3 backdrop-blur transition-transform duration-300 sm:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!show}
    >
      <a
        href="#ziskat"
        tabIndex={show ? 0 : -1}
        className="flex h-12 items-center justify-center rounded-btn bg-forest text-[15px] font-semibold text-white"
      >
        Které ETF koupit z Česka
      </a>
    </div>
  );
}
