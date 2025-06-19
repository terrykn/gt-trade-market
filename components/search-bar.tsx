"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import itemsData from "@/data/items.json";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter } from "lucide-react";

const allTags = Array.from(
  new Set(
    (itemsData as any[]).flatMap((item) => item.tags || [])
  )
);

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [focused, setFocused] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTags, setShowTags] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      return;
    }

    const filtered = (itemsData as any[])
      .filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 50);

    setResults(filtered);
  }, [query]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("query", query.trim());
    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
    router.push(`/items?${params.toString()}`);
  };

  const filteredTags = allTags.filter((tag) =>
    tag.toLowerCase().includes(tagSearch)
  );

  const defaultImageUrl =
    "https://static.wikia.nocookie.net/growtopia/images/8/8f/ItemSprites.png/revision/latest/window-crop/width/32/x-offset/2912/y-offset/224/window-width/32/window-height/32?format=png&fill=cb-20250605082111";


  return (
    <div className="relative w-full max-w-lg z-12">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={query}
          placeholder="Search any item..."
          className="w-full"
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
        />
        <Popover open={showTags} onOpenChange={setShowTags}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`flex items-center cursor-pointer gap-1 ${selectedTags.length > 0 ? "bg-blue-100 border-blue-400" : ""}`}
              aria-label="Filter tags"
              type="button"
            >
              <Filter className="w-4 h-4" /> Tags
              <span className="sr-only">Filter</span>
              {selectedTags.length > 0 && (
                <span className="ml-1 text-xs text-blue-700">{selectedTags.length}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4 max-h-64 overflow-y-auto">
            <div className="mb-2 font-semibold text-sm">Filter by tags</div>

            <input
              type="text"
              placeholder="Search tags..."
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value.toLowerCase())}
              className="w-full mb-2 px-2 py-1 text-xs border rounded"
            />

            <div className="flex flex-wrap gap-2">
              {filteredTags.map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  size="sm"
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`text-xs px-2 py-1 rounded ${selectedTags.includes(tag) ? "bg-blue-600 text-white" : ""}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag.toLowerCase()}
                </Button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 text-xs text-red-500"
                onClick={() => setSelectedTags([])}
              >
                Clear tags
              </Button>
            )}
          </PopoverContent>
        </Popover>
        <Button variant="outline" className="cursor-pointer" onClick={handleSearch}>Search</Button>
      </div>


      {/* Autocomplete dropdown */}
      {focused && results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-background border border-gray-300 dark:border-gray-700 rounded-md shadow-md max-h-60 overflow-y-auto">
          {results.map((item, idx) => (
            <li key={idx} className="cursor-pointer" onMouseDown={() => setQuery(item.name)}>
              <div className="flex items-center px-3 py-2 hover:bg-accent transition-colors text-sm">
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
                    {item.tags?.map((tag: string) => (
<span
  key={tag}
  className="rounded px-2 py-0.5 text-xs bg-gray-300 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
>
  {tag.toLowerCase()}
</span>

                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}
