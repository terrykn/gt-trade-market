"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

import { ListedItem } from "@/app/[category]/[subcategory]/page";

interface ProductCard_03Props {
  item?: ListedItem;
}

function ProductCard_03Preview({
  item
}: ProductCard_03Props = {}) {
  return (
    <div className="group relative flex w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      
      {/* Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="relative inline-block rounded-full bg-gradient-to-r from-purple-500 to-blue-700 px-3 py-1.5 text-xs font-semibold text-white">
          NEW
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-purple-500"></span>
          </span>
        </span>
      </div>

      {/* Image container with background glow effect */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 p-6 dark:from-blue-950/30 dark:to-purple-950/30">
        <div className="absolute -bottom-10 left-1/2 h-40 w-40 -translate-x-1/2 transform rounded-full bg-rose-500/20 blur-3xl"></div>
        <div className="flex justify-center items-center transition-transform duration-500 group-hover:scale-105">
          <Image src={item?.imageUrl} width={75} height={75} priority alt={item?.name}/>
        </div>
      </div>

      {/* Product details */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <h3 className="text-md font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {item?.name}
          </h3>
          <div>
            {item?.quantity} for {item?.price} {item?.unit}
          </div>
          <div>
            <p className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400">
              World: {item?.world}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard_03Preview;
export type { ProductCard_03Props };