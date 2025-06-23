"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function ListingAd() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdsbyGoogle error:", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-4669967309974726"
      data-ad-slot="6338810466"
      data-ad-format="fluid"
      data-ad-layout-key="+2s+rd+16-67+cx"
    ></ins>
  );
}
