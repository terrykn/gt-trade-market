"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function RouteLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 400); 

    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;

  return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white" />
      </div>
  );
}
