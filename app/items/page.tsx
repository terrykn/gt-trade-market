"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

import ProductCard_03 from "@/components/commerce-ui/product-card-03";
import { Navbar } from "@/components/navbar";
import CreateListing from "@/components/create-listing";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ListedItem = {
  id: string;
  userId: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  unitPrice: number;
  world: string;
  imageUrl: string;
  createdAt: Timestamp | Date | null;
  tags: string[];
  description?: string;
};

export default function ItemsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [listedItems, setListedItems] = useState<ListedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchTerm = searchParams.get("query") || "";
  const sortParam = searchParams.get("sortBy") || "newest";
  const [sortBy, setSortBy] = useState(sortParam);

  const tags = (searchParams.get("tags") || "")
    .split(",")
    .filter(Boolean)
    .map((t) => t.toLowerCase());

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    setSortBy(sortParam);
  }, [sortParam]);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        let q;
        if (tags.length > 0) {
          q = query(collection(db, "AllListings"), where("tags", "array-contains-any", tags));
        } else {
          q = query(collection(db, "AllListings"));
        }

        const snapshot = await getDocs(q);
        let listings: ListedItem[] = snapshot.docs.map((doc) => ({
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        })) as ListedItem[];

        if (searchTerm) {
          listings = listings.filter(
            (item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.description?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setListedItems(listings);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [tags.join(","), searchTerm]);

  const sortedItems = [...listedItems].sort((a, b) => {
    switch (sortBy) {
      case "lowest":
        return a.unitPrice - b.unitPrice;
      case "highest":
        return b.unitPrice - a.unitPrice;
      case "az":
        return a.name.localeCompare(b.name);
      case "za":
        return b.name.localeCompare(a.name);
      case "newest":
      default:
        const dateA = a.createdAt ? (a.createdAt instanceof Date ? a.createdAt.getTime() : a.createdAt.toDate().getTime()) : 0;
        const dateB = b.createdAt ? (b.createdAt instanceof Date ? b.createdAt.getTime() : b.createdAt.toDate().getTime()) : 0;
        return dateB - dateA;

    }
  });

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("sortBy", value);
    router.push(`/items?${params.toString()}`);
  };

  if (loading || !user || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      <div className="p-6 pt-24">
        <div className="mb-6 space-y-2">
          <h2 className="text-xl font-bold">
            Showing results for "{searchTerm}"
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            {tags.length > 0 ? (
              <>
                <span className="text-muted-foreground text-sm">Tags:</span>
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm px-2 py-0.5">
                    {tag}
                  </Badge>
                ))}
              </>
            ) : !searchTerm ? (
              <span className="text-muted-foreground text-sm">All listings</span>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-muted-foreground">
              Sort by:
            </label>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[160px] h-8">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="lowest">Lowest Price</SelectItem>
                <SelectItem value="highest">Highest Price</SelectItem>
                <SelectItem value="az">A-Z</SelectItem>
                <SelectItem value="za">Z-A</SelectItem>
              </SelectContent>
            </Select>

            <CreateListing />
          </div>
        </div>

        {sortedItems.length === 0 ? (
          <p>No listings found for your search.</p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {sortedItems.map((item, index) => (
              <ProductCard_03 key={item.id || index} item={item} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}