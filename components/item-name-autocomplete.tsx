"use client";

import { useEffect, useState, useRef } from "react";
import itemsData from "@/data/items.json";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface Props {
  value: string;
  onChange: (
    value: string,
    item?: {
      name: string;
      imageUrl: string;
      tags: string[];
    }
  ) => void;
}

const defaultImageUrl =
  "https://static.wikia.nocookie.net/growtopia/images/8/8f/ItemSprites.png/revision/latest/window-crop/width/32/x-offset/2912/y-offset/224/window-width/32/window-height/32?format=png&fill=cb-20250605082111";


const allItems = itemsData as Array<{
  name: string;
  imageUrl: string;
  tags: string[];
}>;

export default function ItemNameAutocomplete({ value, onChange }: Props) {
  const [results, setResults] = useState<typeof allItems>([]);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.length === 0) {
      setResults([]);
      return;
    }

    const lowerQuery = value.toLowerCase();

    const partialMatches = allItems
      .filter((item) => item.name.toLowerCase().includes(lowerQuery))
      .slice(0, 10);

    const exactMatch = allItems.find(
      (item) => item.name.toLowerCase() === lowerQuery
    );

    if (exactMatch) {
      setResults([exactMatch, ...partialMatches.filter(i => i.name.toLowerCase() !== lowerQuery)]);
    } else {
      setResults(partialMatches);
    }
  }, [value]);

  return (
    <div className="relative">
      <Input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter item name"
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
      />
      {focused && results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-background border border-gray-300 dark:border-gray-700 rounded-md shadow-md max-h-60 overflow-y-auto">
          {results.map((item, idx) => (
            <li
              key={idx}
              onMouseDown={() => onChange(item.name, item)}
              className="flex items-center px-3 py-2 hover:bg-accent cursor-pointer transition-colors text-sm"
            >
              <Image
                src={item.imageUrl || defaultImageUrl}
                alt={item.name}
                width={24}
                height={24}
                className="mr-2"
              />
              <div>
                <div>{item.name}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-200 rounded px-2 py-0.5 text-xs text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}