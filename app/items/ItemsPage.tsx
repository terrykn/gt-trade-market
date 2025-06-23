"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  startAfter,
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
  Query,
  CollectionReference,
} from "firebase/firestore";
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
import DisplayAd from "@/components/ads/display-ad";

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
  createdAt: Date | null;
  tags: string[];
  description?: string;
};

const PAGE_SIZE = 5;

export default function ItemsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [listedItems, setListedItems] = useState<ListedItem[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  const fetchListings = async (startAfterDoc: QueryDocumentSnapshot<DocumentData> | null) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const collectionRef: CollectionReference<DocumentData> = collection(db, "AllListings");

      let baseQuery: Query<DocumentData> = collectionRef;

      if (tags.length > 0) {
        baseQuery = query(collectionRef, where("tags", "array-contains-any", tags));
      }

      let q = query(
        baseQuery,
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );

      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }

      const snapshot = await getDocs(q);

      const newListings: ListedItem[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          name: data.name,
          unit: data.unit,
          price: data.price,
          quantity: data.quantity,
          unitPrice: data.unitPrice,
          world: data.world,
          imageUrl: data.imageUrl,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          tags: data.tags || [],
          description: data.description,
        };
      });

      const filteredListings = searchTerm
        ? newListings.filter(
            (item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.description?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : newListings;

      if (startAfterDoc) {
        setListedItems((prev) => [...prev, ...filteredListings]);
      } else {
        setListedItems(filteredListings);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setListedItems([]);
    setLastDoc(null);
    setHasMore(true);
    fetchListings(null);
  }, [tags.join(","), searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        !isLoading &&
        hasMore
      ) {
        fetchListings(lastDoc);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastDoc, isLoading, hasMore]);

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
        return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
    }
  });

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("sortBy", value);
    router.push(`/items?${params.toString()}`);
  };

  if (loading || !user) {
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
            Showing results for &quot;{searchTerm}&quot;
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            {tags.length > 0 ? (
              <>
                <span className="text-muted-foreground text-sm">Tags:</span>
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-sm px-2 py-0.5"
                  >
                    {tag}
                  </Badge>
                ))}
              </>
            ) : !searchTerm ? (
              <span className="text-muted-foreground text-sm">All listings</span>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="sort"
              className="text-sm text-muted-foreground"
            >
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
            <DisplayAd />
            {sortedItems.map((item, index) => (
              <ProductCard_03 key={item.id || index} item={item} />
            ))}
          </ul>
        )}

        {isLoading && (
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white" />
          </div>
        )}
      </div>
    </div>
  );
}
