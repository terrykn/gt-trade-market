"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Navbar } from "@/components/navbar";
import { ListedItem } from "./[category]/[subcategory]/page";
import { ListedWorld } from "./listings/page";
import { FeaturedPreview } from "@/components/featured-preview";
import { Card, CardContent } from "@/components/ui/card";
import { ComboBox } from "@/components/combobox";
import Image from "next/image";
import Link from "next/link";
import { FeaturedPreviewUnit } from "@/components/featured-preview-unit";

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

  const lowUnitPriceItems = getRandomElements(lowestUnitPriceItemsSorted, 4);

  return (
    <div>
      <Navbar />
      <div className="px-6 py-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card
            onClick={() => router.push("/events/voucher-dayz")}
            className="p-0 h-30 overflow-hidden rounded-lg hover:scale-102 transition-transform duration-300 ease-in-out cursor-pointer"
          >
            <CardContent className="relative w-full h-full p-0 overflow-hidden rounded-lg">
              <Image
                src="https://static.wikia.nocookie.net/growtopia/images/9/94/VD_NewsBanner.png/revision/latest/scale-to-width-down/500?cb=20250306225056"
                alt="voucher dayz"
                fill
                className="object-cover"
              />
            </CardContent>
          </Card>

          <div className="relative">
            {/* Badge */}
            <div className="absolute -top-2 -right-2 z-10">
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
            <div className="absolute -top-2 -right-2 z-10">
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
                <FeaturedPreviewUnit items={lowUnitPriceItems} />
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Column 1: Worlds*/}
          <Card className="aspect-square w-full">
            <CardContent className="p-4 h-full">Worlds</CardContent>
          </Card>

          {/* Column 2: Special */}
          <Card className="aspect-square w-full">
            <CardContent className="p-4 h-full">Special</CardContent>
          </Card>


          {/* Column 3: Events */}
          <div className="aspect-square w-full grid grid-rows-3 gap-4">
            <Card><CardContent className="p-4">Annual Events</CardContent></Card>
            <Card><CardContent className="p-4">Monthly Events</CardContent></Card>
            <Card><CardContent className="p-4">Daily Events</CardContent></Card>
          </div>

          {/* Column 4: Comboboxes 1 */}
          <div className="flex flex-col gap-2">
            <ComboBox label="Surgery" />
            <ComboBox label="Startopia" />
            <ComboBox label="Cooking" />
            <ComboBox label="Fishing" />
          </div>

          {/* Column 5: Comboboxes 2 */}
          <div className="flex flex-col gap-2">
            <ComboBox label="Clothes" />
            <ComboBox label="Building" />
            <ComboBox label="Farming" />
            <ComboBox label="Other" />
          </div>
        </div>
      </div>
    </div>
  );
}