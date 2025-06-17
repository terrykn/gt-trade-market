"use client";

import { ListedItem } from "@/app/items/page";
import Image from "next/image";
import { Button } from "./ui/button";
import { ListedWorld } from "@/app/listings/page";

interface FeaturedPreviewWorldsProps {
  worlds: ListedWorld[];
}

export function FeaturedPreviewWorlds({ worlds = [] }: FeaturedPreviewWorldsProps) {
  return (
    <div className="flex flex-col gap-2 m-4 justify-between w-full">
        <div className="flex flex-row items-center mb-2">
            <div className="relative mr-2">
                    {/* Glow Layer */}
                    <div className="absolute inset-1 z-0 animate-spin-slow pointer-events-none rounded-full bg-gradient-to-tr from-purple-400 via-pink-500 to-blue-500 blur-md opacity-60"></div>

                    {/* Image Layer */}
                    <Image
                        className="relative z-10"
                        width={48}
                        height={48}
                        src="https://static.wikia.nocookie.net/growtopia/images/8/8f/ItemSprites.png/revision/latest/window-crop/width/32/x-offset/2368/y-offset/320/window-width/32/window-height/32?format=png&fill=cb-20250612135320"
                        alt="globe"
                    />                  
            </div>
            <span className="text-lg font-semibold">Worlds</span>
        </div> 
        <div className="gap-1 overflow-auto">
            {worlds.map((world, index) => (
                <div className="flex flex-row text-sm" key={index}>
                    {world.name} - {world.price} {world.unit}
                </div>
            ))}
        </div>
        <div className="mt-2"><Button variant="outline" className="text-xs">See more...</Button></div>
    </div>
  );
}