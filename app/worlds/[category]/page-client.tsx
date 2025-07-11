"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { collection, getDocs, query, where, limit, startAfter, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Navbar } from "@/components/navbar";
import { ListedWorld } from "@/app/listings/page";
import WorldProductCard_03 from "@/components/commerce-ui/world-product-card-03";
import DisplayAd from "@/components/ads/display-ad";

interface pageProps {
  params: {
    category: string;
  };
}

export default function WorldCategoryPageClient({ params }: pageProps) {
  const { category } = params;

  const { user, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [listedWorlds, setListedWorlds] = useState<ListedWorld[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchingRef = useRef(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    setIsLoading(true);
    setListedWorlds([]);
    setLastDoc(null);
    setHasMore(true);
    fetchingRef.current = false;

    const fetchInitial = async () => {
      try {
        const q = query(
          collection(db, "AllWorldListings"),
          where("category", "==", category),
          limit(12)
        );

        const snapshot = await getDocs(q);
        const listings: ListedWorld[] = snapshot.docs.map(doc => ({
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        })) as ListedWorld[];

        setListedWorlds(listings);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);

        if (snapshot.docs.length < 6) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitial();
  }, [category]);

  const fetchMore = useCallback(async () => {
    if (!hasMore || isFetchingMore || fetchingRef.current) return;

    if (!lastDoc) return; 

    setIsFetchingMore(true);
    fetchingRef.current = true;

    try {
      const q = query(
        collection(db, "AllWorldListings"),
        where("category", "==", category),
        startAfter(lastDoc),
        limit(5)
      );

      const snapshot = await getDocs(q);
      const newListings: ListedWorld[] = snapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      })) as ListedWorld[];

      setListedWorlds(prev => [...prev, ...newListings]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);

      if (snapshot.docs.length < 5) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch more listings:", error);
    } finally {
      setIsFetchingMore(false);
      fetchingRef.current = false;
    }
  }, [category, lastDoc, hasMore, isFetchingMore]);

  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
        fetchMore();
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [fetchMore]);

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
        <h2 className="text-xl font-bold mb-4">
          {category.charAt(0).toUpperCase() + category.slice(1)} Worlds
        </h2>

        {listedWorlds.length === 0 ? (
          <p>No listings found for this category.</p>
        ) : (
          <>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              <DisplayAd />
              {listedWorlds.map((world, index) => (
                <WorldProductCard_03 key={index} world={world} />
              ))}
            </ul>
            {isFetchingMore && (
              <div className="text-center mt-4">Loading more...</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
