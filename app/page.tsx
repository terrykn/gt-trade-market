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
import comboBoxOptions from "@/data/combobox_options.json";
import ProductCard_03 from "@/components/commerce-ui/product-card-03";
import WorldProductCard_03 from "@/components/commerce-ui/world-product-card-03";

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
    .slice(0, 10);

  const mostRecentWorlds = [...listedWorlds]
    .sort((a, b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime())
    .slice(0, 10);


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
      <div className="px-6 py-6 pt-24">
        <div className="text-2xl mb-6 font-bold">Featured</div>
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Card className="relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('gt_beach_party.png')" }}>
            <div className="absolute -bottom-px left-0 right-0 h-5/6 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-0 rounded-b-lg" />
            <CardContent className="z-10 flex flex-row h-full items-center justify-center gap-4">
              <div className="relative">
                {/* Glow Layer */}
                <div className="absolute inset-0 z-0 animate-spin-slow pointer-events-none rounded-full bg-gradient-to-tr from-purple-400 via-pink-500 to-blue-500 blur-md opacity-60"></div>

                {/* Image Layer */}
                <Image
                  className="relative z-10"
                  width={48}
                  height={48}
                  src="https://static.wikia.nocookie.net/growtopia/images/8/8f/ItemSprites.png/revision/latest/window-crop/width/32/x-offset/320/y-offset/1312/window-width/32/window-height/32?format=png&fill=cb-20250619095551"
                  alt="item name"
                />
              </div>
              <span className="font-bold text-xl">Event: Beach Party</span>
              <Button variant="outline" className="text-xs cursor-pointer bg-black/20 backdrop-blur-sm shadow-md" onClick={() => router.push("/items?tags=beach-party")}>See more...</Button>
            </CardContent>
          </Card>

          <Card className="relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('gt_nebula.png')" }}>
            <div className="absolute -bottom-px left-0 right-0 h-5/6 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-0 rounded-b-lg" />
            <CardContent className="z-10 flex flex-row h-full items-center justify-center gap-4">
              <div className="relative">
                {/* Glow Layer */}
                <div className="absolute inset-0 z-0 animate-spin-slow pointer-events-none rounded-full bg-gradient-to-tr from-purple-400 via-pink-500 to-blue-500 blur-md opacity-60"></div>

                {/* Image Layer */}
                <Image
                  className="relative z-10"
                  width={48}
                  height={48}
                  src="https://static.wikia.nocookie.net/growtopia/images/8/8f/ItemSprites.png/revision/latest/window-crop/width/32/x-offset/2368/y-offset/320/window-width/32/window-height/32?format=png&fill=cb-20250612135320"
                  alt="globe"
                />
              </div>
              <span className="font-bold text-xl">Worlds</span>
              <Button variant="outline" className="text-xs cursor-pointer bg-black/20 backdrop-blur-sm shadow-md" onClick={() => router.push("/worlds/all")}>See more...</Button>
            </CardContent>
          </Card>

        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 md: grid-cols-3 gap-4">

          {/* Column 1: Special, Events */}
          <div className="flex flex-col gap-2">
            {renderComboBox("special")}
            {renderComboBox("annual events")}
            {renderComboBox("monthly events")}
            {renderComboBox("role")}
          </div>

          {/* Column 2: Comboboxes 1 */}
          <div className="flex flex-col gap-2">
            {renderComboBox("surgery")}
            {renderComboBox("startopia")}
            {renderComboBox("food")}
            {renderComboBox("fishing")}
          </div>

          {/* Column 3: Comboboxes 2 */}
          <div className="flex flex-col gap-2">
            {renderComboBox("clothes")}
            {renderComboBox("building")}
            {renderComboBox("farming")}
            {renderComboBox("other")}
          </div>
        </div>

        {/* Row 3 */}
        <div className="text-2xl mt-6 mb-6 font-bold flex items-center gap-4">
          New Items 
          <Button variant="outline" className="text-xs cursor-pointer" onClick={() => router.push("/items?sortBy=newest")}>See more...</Button>
        </div>
        
        {mostRecentItems.length === 0 ? (
          <p>No listings found for your search.</p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {mostRecentItems.map((item, index) => (
              <ProductCard_03 key={item.id || index} item={item} />
            ))}
          </ul>
        )}

        {/* Row 4 */}
        <div className="text-2xl mt-6 mb-6 font-bold flex items-center gap-4">
          Worlds 
          <Button variant="outline" className="text-xs cursor-pointer" onClick={() => router.push("/worlds/all")}>See more...</Button>
        </div>
        {mostRecentWorlds.length === 0 ? (
          <p>No listings found for your search.</p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {mostRecentWorlds.map((world, index) => (
              <WorldProductCard_03 key={world.id || index} world={world} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}