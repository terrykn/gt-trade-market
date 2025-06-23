"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function DisplayAd() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsbygoogle push error:", e);
    }
  }, []);

  return (
    <>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-4669967309974726"
        data-ad-slot="4834157100"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </>
  );
}
