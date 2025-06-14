"use client";

import { ListedItem } from "@/app/[category]/[subcategory]/page";
import Image from "next/image";
import { Button } from "./ui/button";

interface FeaturedPreviewUnitProps {
    items: ListedItem[];
}

export function FeaturedPreviewUnit({ items = [] }: FeaturedPreviewUnitProps) {
    return (
        <div className="items-center flex flex-row gap-2 m-2 justify-between w-full">
            <div className="flex flex-col">
                {items.map((item, index) => (
                    <div className="flex flex-row text-sm" key={index}>
                        {item.name} - {item.quantity} for {item.price} {item.unit}
                    </div>
                ))}
            </div>
            <div>
                <Button variant="outline" className="text-xs">See more...</Button>
            </div>
        </div>
    );
}