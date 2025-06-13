"use client";

import { useEffect, useState, useRef } from "react";
import itemsData from "@/data/items_sample.json";
import missingItemsData from "@/data/missing_items.json";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface Props {
  value: string;
  onChange: (
    value: string,
    item?: {
      name: string;
      imageUrl: string;
      category: string;
      subcategory: string;
    }
  ) => void;
}

const defaultImageUrl =
  "https://static.wikia.nocookie.net/growtopia/images/8/8f/ItemSprites.png/revision/latest/window-crop/width/32/x-offset/2912/y-offset/224/window-width/32/window-height/32?format=png&fill=cb-20250605082111";

const allItems = Object.entries(itemsData).flatMap(
  ([category, blocks]: [string, any]) =>
    blocks.flatMap((block: any) =>
      block.items.map((item: any) => ({
        ...item,
        category: category.toLowerCase().replace(/\s+/g, "-"),
        subcategory: block.name.toLowerCase().replace(/\s+/g, "-"),
      }))
    )
);

const missingItems = missingItemsData.map((item: any) => ({
  ...item,
  imageUrl: defaultImageUrl,
  category: "other-category",
  subcategory: "other-subcategory",
}));

const combinedItems = [...allItems, ...missingItems];

export default function ItemNameAutocomplete({ value, onChange }: Props) {
  const [results, setResults] = useState<any[]>([]);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.length === 0) {
      setResults([]);
      return;
    }

    const lowerQuery = value.toLowerCase();

    const partialMatches = combinedItems
      .filter((item) => item.name.toLowerCase().includes(lowerQuery))
      .slice(0, 10);

    // If there's an exact match, prioritize it
    const exactMatch = combinedItems.find(
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
                src={item.imageUrl}
                alt={item.name}
                width={24}
                height={24}
                className="mr-2"
              />
              <div>
                <div>{item.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {item.category.replace(/-/g, " ")} &mdash; {item.subcategory.replace(/-/g, " ")}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}