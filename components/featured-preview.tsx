"use client";

import { ListedItem } from "@/app/items/page";
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
                <div className="flex flex-row text-sm" key={index}>
                    <Image className="mr-2" src={item.imageUrl} width={20} height={20} alt='item image' /> {item.name} - {item.quantity} for {item.price} {item.unit}
                </div>
            ))}
        </div>
        <div>
            <Button variant="outline" className="text-xs">See more...</Button>
        </div>
    </div>
  );
}