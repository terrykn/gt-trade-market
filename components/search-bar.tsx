"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import itemsData from "@/data/items_sample.json";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const allItems = Object.entries(itemsData).flatMap(([category, blocks]: [string, any]) =>
  blocks.flatMap((block: any) =>
    block.items.map((item: any) => ({
      ...item,
      category: category.toLowerCase().replace(/\s+/g, "-"),
      subcategory: block.name.toLowerCase().replace(/\s+/g, "-"),
    }))
  )
);

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      return;
    }

    const filtered = allItems
      .filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10);

    setResults(filtered);
  }, [query]);

  const handleSearch = () => {
    if (query.trim() === "") return;
    router.push(`/search/${query.toLowerCase().replace(/\s+/g, "-")}`);
  };

  return (
    <div className="relative w-64">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={query}
          placeholder="Search items..."
          className="w-full"
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
        />
        <Button variant="outline" onClick={handleSearch}>Search</Button>
      </div>
      {focused && results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-background border border-gray-300 dark:border-gray-700 rounded-md shadow-md max-h-60 overflow-y-auto">
          {results.map((item, idx) => (
            <li key={idx}>
              <Link
                href={`/${item.category}/${item.subcategory}`}
                className="flex items-center px-3 py-2 hover:bg-accent transition-colors text-sm"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <div>
                  <div>{item.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {item.category} &mdash; {item.subcategory}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}