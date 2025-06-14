"use client";

import { ListedItem } from "@/app/[category]/[subcategory]/page";
import Image from "next/image";
import { Button } from "./ui/button";

interface FeaturedPreviewProps {
  items: ListedItem[];
}

export function FeaturedPreview({ items = [] }: FeaturedPreviewProps) {
  return (
    <div className="items-center flex flex-row gap-2 m-2 justify-between w-full">
      {items.map((item, index) => (
        <div>
          <div key={index}>
            <div className="relative w-[56] h-[56]">

              {/* Glowing spinning circle */}

              
              <div className="absolute inset-2 rounded-full animate-spin-slow z-0 pointer-events-none">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-purple-400 via-pink-500 to-blue-500 blur-md opacity-60"></div>
              </div>

              {/* The actual image on top */}
              <Image
                className="hover:scale-105 transition-transform duration-300 ease-in-out z-10"
                src={
                  item.imageUrl ||
                  "https://static.wikia.nocookie.net/growtopia/images/8/8f/ItemSprites.png/revision/latest/window-crop/width/32/x-offset/2912/y-offset/224/window-width/32/window-height/32?format=png&fill=cb-20250605082111"
                }
                alt={item.name}
                fill
              />
            </div>
          </div>
          <div className="text-sm font-semibold text-center mt-1.5">
            {item.quantity} / {item.price} {item.unit}
          </div>
        </div>
      ))}
      <div>
        <Button variant="outline" className="text-xs">See more...</Button>
      </div>
    </div>
  );
}