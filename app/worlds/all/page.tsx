"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Navbar } from "@/components/navbar";
import { ListedWorld } from "@/app/listings/page";
import WorldProductCard_03 from "@/components/commerce-ui/world-product-card-03";

export default function AllWorldsPage() {

    const { user, loading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    const [listedWorlds, setListedWorlds] = useState<ListedWorld[]>([]);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [loading, user, router]);

    useEffect(() => {
        const fetchWorldListings = async () => {
            try {
                const q = query(
                    collection(db, "AllWorldListings")
                );

                const snapshot = await getDocs(q);
                const listings: ListedWorld[] = snapshot.docs.map(doc => ({
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
                    All Worlds
                </h2>

                {listedWorlds.length === 0 ? (
                    <p>No listings found for this category.</p>
                ) : (
                    <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                        {listedWorlds.map((world, index) => (
                            <WorldProductCard_03 key={index} world={world} />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}