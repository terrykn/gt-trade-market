"use client";

import Image from "next/image";

import { ListedItem } from "@/app/items/ItemsPage";
import { Separator } from "../ui/separator";

import { Timestamp } from "firebase/firestore";

function isTimestamp(obj: unknown): obj is Timestamp {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "toDate" in obj &&
    typeof (obj as { toDate?: unknown }).toDate === "function"
  );
}

interface ProductCard_03Props {
  item?: ListedItem;
}


function formatTimeAgo(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  return `${years} yr ago`;
}

function ProductCard_03({
  item
}: ProductCard_03Props = {}) {

  const defaultImageUrl =
  "https://static.wikia.nocookie.net/growtopia/images/8/8f/ItemSprites.png/revision/latest/window-crop/width/32/x-offset/2912/y-offset/224/window-width/32/window-height/32?format=png&fill=cb-20250605082111";


  const rawDate = item?.createdAt as Date | Timestamp | null | undefined;
  const date =
    rawDate instanceof Date
      ? rawDate
      : isTimestamp(rawDate)
        ? rawDate.toDate()
        : null;

  const timeAgo = date ? formatTimeAgo(date) : "";

  return (
    <div className="group relative flex w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">

      {/* Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="relative inline-block rounded-full bg-gradient-to-r from-purple-500 to-blue-700 px-3 py-1.5 text-xs font-semibold text-white">
          {timeAgo}
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
  <Image
    src={item?.imageUrl && item.imageUrl.trim() !== "" ? item.imageUrl : defaultImageUrl}
    width={60}
    height={60}
    priority
    alt={item?.name ?? "item image"}
  />
</div>
      </div>

      {/* Product details */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <h3 className="text-md font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {item?.name}
          </h3>

          <div className="flex flex-col">
            <div>
              {item?.quantity} for {item?.price} {item?.unit}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Unit Price: {item?.unitPrice} WL
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              World: {item?.world}
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 mt-1 mb-2 flex flex-wrap gap-1">
              {item?.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                >
                  {tag.toLowerCase()}
                </span>
              ))}
            </div>
          </div>
          {item?.description && (
            <>
              <Separator className="mt-2 mb-2"/>
              <div className="flex flex-1 flex-col gap-2 p-0">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-normal break-words">
                    Details: {item.description}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard_03;
export type { ProductCard_03Props };