"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

import ProductCard_03 from "@/components/commerce-ui/product-card-03";
import { Navbar } from "@/components/navbar";
import { Timestamp } from "firebase/firestore";
import CreateListing from "@/components/create-listing";

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
  category: string;
  subcategory: string;
};

interface Props {
  params: { category: string; };
}

export default function SubcategoryPage({ params }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const { category } = params;
  const [listedItems, setListedItems] = useState<ListedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(
          collection(db, "AllListings"),
          where("category", "==", category),
        );

        const snapshot = await getDocs(q);
        const listings: ListedItem[] = snapshot.docs.map(doc => ({
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
  }, [category]);

  if (loading || !user || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">
          {category.charAt(0).toUpperCase() + category.slice(1)} &gt;{" "}
          {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
        </h2>
        <CreateListing />

        {listedItems.length === 0 ? (
          <p>No listings found for this category and subcategory.</p>
        ) : (
          <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {listedItems.map((item, index) => (
              <ProductCard_03 key={index} item={item} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}