"use client";

import { ListedItem } from "@/app/items/ItemsPage";
import Image from "next/image";
import { Button } from "./ui/button";

interface FeaturedPreviewProps {
  items: ListedItem[];
}

export function FeaturedPreview({ items = [] }: FeaturedPreviewProps) {
  return (
    <div className="items-center flex flex-row gap-2 m-2 justify-between w-full">
        <div className="flex flex-col gap-1">
        {items.map((item, index) => (
          <div className="flex items-start text-sm gap-1" key={index}>
            <Image
              src={item.imageUrl}
              width={20}
              height={20}
              alt="item image"
              className="shrink-0 mt-0.5"
            />
            <span>
              {item.name} - {item.quantity} for {item.price} {item.unit}
            </span>
          </div>
        ))}
        </div>
        <div>
            <Button variant="outline" className="text-xs cursor-pointer">See more...</Button>
        </div>
    </div>
  );
}