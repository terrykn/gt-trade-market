"use client";
import { useEffect, useState, useRef } from "react";
import itemsData from "@/data/items_sample.json";
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

const allItems = Object.entries(itemsData).flatMap(([category, blocks]: [string, any]) =>
  blocks.flatMap((block: any) =>
    block.items.map((item: any) => ({
      ...item,
      category, // e.g. "Blocks"
      subcategory: block.name, // e.g. "Earth Blocks"
    }))
  )
);

export default function ItemNameAutocomplete({ value, onChange }: Props) {
  const [results, setResults] = useState<any[]>([]);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.length === 0) {
      setResults([]);
      return;
    }

    const filtered = allItems
      .filter((item) => item.name.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 10);

    setResults(filtered);
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
                  {item.category} &mdash; {item.subcategory}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}