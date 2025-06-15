"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const optionsMap: Record<string, { label: string; image: string; options: string[] }> = {
  special: {
    label: "Special",
    image: "https://static.wikia.nocookie.net/growtopia/images/8/8f/ItemSprites.png/revision/latest/window-crop/width/32/x-offset/1664/y-offset/96/window-width/32/window-height/32?format=png&fill=cb-20250612135320",
    options: [
      "Item of the Season (IOTS)",
      "Legendary",
      "Marvelous",
      "Rare",
      "Unobtainable",
      "Growtoken",
      "Subscription"
    ],
  },
  "annual-events": {
    label: "Annual Events",
    image: "https://static.wikia.nocookie.net/growtopia/images/8/8f/ItemSprites.png/revision/latest/window-crop/width/32/x-offset/1472/y-offset/64/window-width/32/window-height/32?format=png&fill=cb-20250612135320",
    options: [
      "Valentine’s Week",
      "St. Patrick’s Week",
      "Easter Week",
      "SummerFest",
      "Halloween Week",
      "WinterFest",
    ],
  },
  "monthly-events": {
    label: "Monthly Events",
    image: "https://static.wikia.nocookie.net/growtopia/images/8/8f/ItemSprites.png/revision/latest/window-crop/width/32/x-offset/2336/y-offset/32/window-width/32/window-height/32?format=png&fill=cb-20250612135320",
    options: [
      "Role Clash",
      "Startopia",
      "Harvest Fest",
      "Surgery Day",
      "Carnival",
      "Adventure Month",
    ],
  },
};

interface Props {
  input: "special" | "annual-events" | "monthly-events";
}

export function FeaturedPreviewCombobox({ input }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const config = optionsMap[input];

  return (
    <div className="flex flex-col gap-2 justify-between w-full h-auto">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full h-auto px-4 py-2 flex items-center justify-between min-w-0 overflow-hidden"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex items-center justify-center w-10 h-10 flex-shrink-0">
                <div className="absolute inset-2 z-0 animate-spin-slow pointer-events-none rounded-full bg-gradient-to-tr from-purple-400 via-pink-500 to-blue-500 blur-md opacity-60" />
                <Image
                  className="relative z-10"
                  width={32}
                  height={32}
                  src={config.image}
                  alt={config.label}
                />
              </div>
              <span className="text-lg font-semibold truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[min(100%,12rem)] flex-shrink">
                {value || config.label}
              </span>
            </div>
            <ChevronsUpDown className="h-4 w-4 opacity-50 flex-shrink-0" />
          </Button>

        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search type..." />
            <CommandList>
              <CommandGroup>
                {config.options.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
