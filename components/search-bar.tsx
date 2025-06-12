"use client";
import { useEffect, useState, useRef } from "react";
import itemsData from "@/data/items_sample.json";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

const allItems = itemsData.Blocks.flatMap((block: any) => block.items);

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      return;
    }

    const filtered = allItems
      .filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10); // 10 suggestions
    setResults(filtered);
  }, [query]);

  return (
    <div className="relative w-64">
      <Input
        ref={inputRef}
        value={query}
        placeholder="Search items..."
        className="w-full"
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)} // delay blur to allow click
      />
      {focused && results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-background border border-gray-300 dark:border-gray-700 rounded-md shadow-md max-h-60 overflow-y-auto">
          {results.map((item, idx) => (
            <li key={idx}>
              <Link
                href={`/items/${encodeURIComponent(item.name)}`}
                className="flex items-center px-3 py-2 hover:bg-accent transition-colors text-sm"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
