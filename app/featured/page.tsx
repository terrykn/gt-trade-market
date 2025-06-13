"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

import ProductCard_03 from "@/components/commerce-ui/product-card-03";
import { Navbar } from "@/components/navbar";
import { ListedItem } from "../[category]/[subcategory]/page";

export default function featuredPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    const [listedItems, setListedItems] = useState<ListedItem[]>([]);

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
    }, []);

    return(
        <div>
            <Navbar />

        </div>
    )
}