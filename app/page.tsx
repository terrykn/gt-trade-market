"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Navbar } from "@/components/navbar";
import { ListedItem } from "./items/page";
import { ListedWorld } from "./listings/page";
import { FeaturedPreview } from "@/components/featured-preview";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { ComboBox } from "@/components/combobox";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeaturedPreviewWorlds } from "@/components/featured-preview-worlds";
import { FeaturedPreviewCombobox } from "@/components/featured-preview-combobox";
import comboBoxOptions from "@/data/combobox_options.json";


export default function FeaturedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [listedItems, setListedItems] = useState<ListedItem[]>([]);
  const [listedWorlds, setListedWorlds] = useState<ListedWorld[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(collection(db, "AllListings"));
        const snapshot = await getDocs(q);
        const listings: ListedItem[] = snapshot.docs.map((doc) => ({
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        })) as ListedItem[];

        setListedItems(listings);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  useEffect(() => {
    const fetchWorldListings = async () => {
      try {
        const q = query(collection(db, "AllWorldListings"));
        const snapshot = await getDocs(q);
        const listings: ListedWorld[] = snapshot.docs.map((doc) => ({
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        })) as ListedWorld[];

        setListedWorlds(listings);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorldListings();
  }, []);

  const mostRecentItems = [...listedItems]
    .sort(
      (a, b) =>
        (a.createdAt as Date).getTime() < (b.createdAt as Date).getTime() ? 1 : -1
    )
    .slice(0, 3);

  const mostRecentWorlds = [...listedWorlds]
    .sort((a, b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime())
    .slice(0, 4);


  function getRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const lowestPerItemNameMap = new Map<string, ListedItem>();

  listedItems.forEach((item) => {
    const unitPrice = item.price / item.quantity;
    const existing = lowestPerItemNameMap.get(item.name);
    const existingUnitPrice = existing ? existing.price / existing.quantity : Infinity;

    if (!existing || unitPrice < existingUnitPrice) {
      lowestPerItemNameMap.set(item.name, item);
    }
  });

  const lowestUnitPriceItemsSorted = Array.from(lowestPerItemNameMap.values())
    .sort((a, b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime())
    .slice(0, 20);

  const lowUnitPriceItems = getRandomElements(lowestUnitPriceItemsSorted, 3);

  const renderComboBox = (categoryKey: keyof typeof comboBoxOptions) => {
    const items = comboBoxOptions[categoryKey];
    return (
      <ComboBox
        key={categoryKey}
        label={categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}
        options={items.map((item) => item.title)}
        onSelect={(selectedTitle) => {
          const selectedItem = items.find((item) => item.title === selectedTitle);
          if (selectedItem?.href) {
            router.push(selectedItem.href);
          }
        }}
      />
    );
  };

  return (
    <div>
      <Navbar />
      <div className="px-6 py-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card>
            <CardContent className="flex flex-row h-full items-center justify-center gap-4">
              <div className="relative">
                {/* Glow Layer */}
                <div className="absolute inset-0 z-0 animate-spin-slow pointer-events-none rounded-full bg-gradient-to-tr from-purple-400 via-pink-500 to-blue-500 blur-md opacity-60"></div>

                {/* Image Layer */}
                <Image
                  className="relative z-10"
                  width={48}
                  height={48}
                  src="https://static.wikia.nocookie.net/growtopia/images/8/8f/ItemSprites.png/revision/latest/window-crop/width/32/x-offset/2368/y-offset/1408/window-width/32/window-height/32?format=png&fill=cb-20250612135320"
                  alt="item name"
                />
              </div> 
              <span className="font-semibold text-lg">Event: Voucher Dayz</span>
              <Button variant="outline" className="text-xs">See more...</Button>
            </CardContent>
          </Card>

          <div className="relative">
            {/* Badge */}
            <div className="absolute -top-2 -left-2 z-10">
              <span className="relative inline-block rounded-full bg-gradient-to-r from-purple-500 to-blue-700 px-3 py-1.5 text-xs font-semibold text-white">
                NEW
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-purple-500"></span>
                </span>
              </span>
            </div>
            <Card onClick={() => router.push("/events/voucher-dayz")} className="p-2 h-30 overflow-hidden rounded-lg">
              <CardContent className="relative items-center flex h-full w-full p-0 overflow-hidden rounded-lg">
                <FeaturedPreview items={mostRecentItems} />
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            {/* Badge */}
            <div className="absolute -top-2 -left-2 z-10">
              <span className="relative inline-block rounded-full bg-gradient-to-r from-purple-500 to-blue-700 px-3 py-1.5 text-xs font-semibold text-white">
                LOW PRICE
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-purple-500"></span>
                </span>
              </span>
            </div>
            <Card onClick={() => router.push("/events/voucher-dayz")} className="p-2 h-30 overflow-hidden rounded-lg">
              <CardContent className="relative items-center flex h-full w-full p-0 overflow-hidden rounded-lg">
                <FeaturedPreview items={lowUnitPriceItems} />
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 md: grid-cols-2 gap-4">

          {/* Column 1: Worlds*/}
          <Card onClick={() => router.push("/events/voucher-dayz")} className="p-2 w-full h-auto overflow-hidden rounded-lg">
            <CardContent className="relative items-center flex h-full w-full p-0 overflow-hidden rounded-lg">
              <FeaturedPreviewWorlds worlds={mostRecentWorlds} />
            </CardContent>
          </Card>

          {/* Column 2: Special, Events */}
          <Card className="p-4 w-full h-auto">
            <FeaturedPreviewCombobox input="special" />
            <FeaturedPreviewCombobox input="annual-events" />
            <FeaturedPreviewCombobox input="monthly-events" />
          </Card>

      {/* Column 3: Comboboxes 1 */}
      <div className="flex flex-col gap-2">
        {renderComboBox("surgery")}
        {renderComboBox("startopia")}
        {renderComboBox("cooking")}
        {renderComboBox("fishing")}
      </div>

      {/* Column 4: Comboboxes 2 */}
      <div className="flex flex-col gap-2">
        {renderComboBox("clothes")}
        {renderComboBox("building")}
        {renderComboBox("farming")}
        {renderComboBox("other")}
      </div>
        </div>
      </div>
    </div>
  );
}