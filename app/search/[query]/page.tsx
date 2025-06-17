"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Navbar } from "@/components/navbar";
import ProductCard_03 from "@/components/commerce-ui/product-card-03";
import { ListedItem } from "@/app/items/page";

export default function SearchResultsPage() {
  const params = useParams();
  const searchParam = (params?.query as string || "").replace(/-/g, " ").toLowerCase();
  const [listings, setListings] = useState<ListedItem[]>([]);
  const [filtered, setFiltered] = useState<ListedItem[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      const querySnapshot = await getDocs(collection(db, "AllListings"));
      const all: ListedItem[] = [];
      querySnapshot.forEach((doc) => {
        all.push(doc.data() as ListedItem);
      });
      setListings(all);
    };

    fetchListings();
  }, []);

  useEffect(() => {
    setFiltered(
      listings.filter((item) =>
        item.name.toLowerCase().includes(searchParam)
      )
    );
  }, [listings, searchParam]);

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">
          Search Results for "<span>{searchParam}</span>"
        </h2>
        {filtered.length === 0 ? (
          <p>No matching listings found.</p>
        ) : (
          <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {filtered.map((item, index) => (
              <ProductCard_03 key={index} item={item} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
