"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import ProductCard_03 from "@/components/commerce-ui/product-card-03";
import { Navbar } from "@/components/navbar";

import ItemsRaw from "@/data/items.json";
import ListedItemsRaw from "@/data/listed-items.json";

type Item = {
  name: string;
  imageUrl: string;
};

type ListedItem = {
  name: string;
  player: string;
  unit: string;
  price: number;
  quantity: number;
  world: string;
  imageUrl: string;
};

type Items = {
  [category: string]: {
    [subcategory: string]: Item[];
  };
};

type ListedItems = {
  [category: string]: {
    [subcategory: string]: ListedItem[];
  };
};

interface Props {
  params: { category: string; subcategory: string };
}

export default function SubcategoryPage({ params }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();
  console.log(user?.displayName);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  const { category, subcategory } = params;
  const Items = ItemsRaw as Items;
  const ListedItems = ListedItemsRaw as ListedItems;

  if (!(category in Items)) {
    return <div>Category not found</div>;
  }
  const validSubcategories = Object.keys(Items[category]);
  if (!validSubcategories.includes(subcategory)) {
    return <div>Subcategory not found</div>;
  }

  const listedItems = ListedItems[category]?.[subcategory] || [];

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">
          {category.charAt(0).toUpperCase() + category.slice(1)} &gt;{" "}
          {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {listedItems.map((listedItem, index) => (
            <ProductCard_03 key={index} item={listedItem} />
          ))}
        </ul>
      </div>
    </div>
  );
}
