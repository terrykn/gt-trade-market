"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import ProductCard_03 from "@/components/commerce-ui/product-card-03";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timestamp } from "firebase/firestore";
import WorldProductCard_03 from "@/components/commerce-ui/world-product-card-03";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import { CheckCircle2Icon, Trash2 } from "lucide-react";
import { AlertCircle } from "lucide-react";
import CreateListing from "@/components/create-listing";
import { ListedItem } from "../items/page";

export type ListedWorld = {
    id: string;
    userId: string;
    name: string;
    price: number;
    unit: string;
    category: string;
    description: string;
    createdAt: Timestamp | Date | null;
};

export default function ListingsPage() {
    const [listedItems, setListedItems] = useState<ListedItem[]>([]);
    const [listedWorlds, setListedWorlds] = useState<ListedWorld[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteWorldDialogOpen, setDeleteWorldDialogOpen] = useState(false);
    const [selectedListingId, setSelectedListingId] = useState<string>("");
    const [selectedWorldId, setSelectedWorldId] = useState<string>("");
    const [alert, setAlert] = useState<{
        type: "success" | "error";
        title: string;
        description: string;
    } | null>(null);

    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [loading, user, router]);

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => setAlert(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    useEffect(() => {
        if (user) fetchUserListings();
    }, [user]);

    useEffect(() => {
        if (user) fetchWorldListings();
    }, [user]);

    const fetchUserListings = async () => {
        if (!user) return;
        try {
            const q = query(collection(db, "users", user.uid, "listings"));
            const snapshot = await getDocs(q);
            const listings: ListedItem[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.() || new Date(),
            })) as ListedItem[];
            setListedItems(listings);
        } catch (err) {
            console.log(err)
            setAlert({
                type: "error",
                title: "Error loading listings",
                description: "Please try again later.",
            });
        }
    };

    const fetchWorldListings = async () => {
        if (!user) return;
        try {
            const qWorld = query(collection(db, "users", user.uid, "world-listings"));
            const snapshotWorld = await getDocs(qWorld);
            const worldListings: ListedWorld[] = snapshotWorld.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.() || new Date(),
            })) as ListedWorld[];
            setListedWorlds(worldListings);
        } catch (err) {
            console.log(err)
            setAlert({
                type: "error",
                title: "Error loading listings",
                description: "Please try again later.",
            });
        }
    };

    const handleDelete = async (listingId: string) => {
        if (!user) {
            setAlert({
                type: "error",
                title: "Authentication error",
                description: "You must be logged in to delete a listing.",
            });
            return;
        }
        try {
            await deleteDoc(doc(db, "users", user.uid, "listings", listingId));
            await deleteDoc(doc(db, "AllListings", listingId));
            setListedItems(prev => prev.filter(item => item.id !== listingId));
            setAlert({
                type: "success",
                title: "Listing deleted",
                description: "The listing was successfully removed.",
            });
            setDeleteDialogOpen(false);
        } catch (err) {
            console.log(err)
            setAlert({
                type: "error",
                title: "Failed to delete listing",
                description: "Please try again later.",
            });
        }
    };

    const handleDeleteWorld = async (worldListingId: string) => {
        if (!user) {
            setAlert({
                type: "error",
                title: "Authentication error",
                description: "You must be logged in to delete a listing.",
            });
            return;
        }
        try {
            await deleteDoc(doc(db, "users", user.uid, "world-listings", worldListingId));
            await deleteDoc(doc(db, "AllWorldListings", worldListingId));
            setListedWorlds(prev => prev.filter(item => item.id !== worldListingId));
            setAlert({
                type: "success",
                title: "Listing deleted",
                description: "The listing was successfully removed.",
            });
            setDeleteWorldDialogOpen(false);
        } catch (err) {
            console.log(err)
            setAlert({
                type: "error",
                title: "Failed to delete listing",
                description: "Please try again later.",
            });
        }
    };

    if (loading || !user ) {
        return (
        <div className="flex items-center justify-center h-screen w-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white" />
        </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="flex flex-col p-6 pt-24">
                <div className="flex flex-row items-center gap-4">
                    <h2 className="text-xl font-bold mb-6">My Listings</h2>
                    <span className="text-sm font-semibold mb-6">
                    ({listedItems.length + listedWorlds.length}/25)
                    </span>
                    {alert && (
                        <div
                            style={{
                                position: "fixed",
                                bottom: 20,
                                left: "50%",
                                transform: "translateX(-50%)",
                                zIndex: 9999,
                                width: "auto",
                                maxWidth: "90vw",
                            }}
                        >
                            <Alert
                                variant={alert.type === "success" ? "default" : "destructive"}
                                className="flex items-center shadow-lg"
                            >
                                {alert.type === "success" ? (
                                    <CheckCircle2Icon className="mr-2 h-6 w-6 text-green-600" />
                                ) : (
                                    <AlertCircle className="mr-2 h-6 w-6 text-red-600" />
                                )}
                                <AlertTitle>{alert.title}</AlertTitle>
                                <AlertDescription>{alert.description}</AlertDescription>
                            </Alert>
                        </div>
                    )}
              <div className="mb-6">
                <CreateListing
                    
                        onCreated={fetchUserListings}
                        onCreatedWorld={fetchWorldListings}
                    />
              </div>
                    
                </div>
                <Tabs defaultValue="items">
                    <TabsList className="mb-2">
                        <TabsTrigger value="items">Items</TabsTrigger>
                        <TabsTrigger value="worlds">Worlds</TabsTrigger>
                    </TabsList>
                    <TabsContent value="items">
                        {listedItems.length === 0 ? (
                            <p className="text-muted-foreground">You have no item listings yet.</p>
                        ) : (
                            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {listedItems.map((item) => (
                                    <div key={item.id}>
                                        <Dialog open={deleteDialogOpen && selectedListingId === item.id} onOpenChange={(open) => {
                                            setDeleteDialogOpen(open);
                                            if (!open) setSelectedListingId("");
                                        }}>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader className="mb-6">
                                                    <DialogTitle>Delete Listing</DialogTitle>
                                                    <DialogDescription>
                                                        Are you sure you want to delete this listing?
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="w-full max-w-[200px] mx-auto">
                                                    <ProductCard_03 item={item} />
                                                </div>
                                                <DialogFooter className="mt-6">
                                                    <DialogClose asChild>
                                                        <Button>Cancel</Button>
                                                    </DialogClose>
                                                    <Button variant="destructive" onClick={() => handleDelete(item.id)}>Delete</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        <div className="group relative flex w-full flex-col overflow-hidden rounded-xl">
                                            <div className="absolute top-3 right-3 z-10">
                                                <Button
                                                    size="sm"
                                                    className="bg-gradient-to-r from-red-500 to-red-700 text-white"
                                                    onClick={() => {
                                                        setSelectedListingId(item.id);
                                                        setDeleteDialogOpen(true);
                                                    }}
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                            <ProductCard_03 item={item} />
                                        </div>
                                    </div>
                                ))}
                            </ul>
                        )}
                    </TabsContent>
                    <TabsContent value="worlds">
                        {listedWorlds.length === 0 ? (
                            <p className="text-muted-foreground">You have no world listings yet.</p>
                        ) : (
                            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {listedWorlds.map((world) => (
                                    <div key={world.id}>
                                        <Dialog open={deleteWorldDialogOpen && selectedWorldId === world.id} onOpenChange={(open) => {
                                            setDeleteWorldDialogOpen(open);
                                            if (!open) setSelectedWorldId("");
                                        }}>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader className="mb-6">
                                                    <DialogTitle>Delete Listing</DialogTitle>
                                                    <DialogDescription>
                                                        Are you sure you want to delete this listing?
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="w-full max-w-[200px] mx-auto">
                                                    <WorldProductCard_03 world={world} />
                                                </div>
                                                <DialogFooter className="mt-6">
                                                    <DialogClose asChild>
                                                        <Button>Cancel</Button>
                                                    </DialogClose>
                                                    <Button variant="destructive" onClick={() => handleDeleteWorld(world.id)}>Delete</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        <div className="group relative flex w-full flex-col overflow-hidden rounded-xl">
                                            <div className="absolute top-3 right-3 z-10">
                                                <Button
                                                    size="sm"
                                                    className="bg-gradient-to-r from-red-500 to-red-700 text-white"
                                                    onClick={() => {
                                                        setSelectedWorldId(world.id);
                                                        setDeleteWorldDialogOpen(true);
                                                    }}
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                            <WorldProductCard_03 world={world} />
                                        </div>
                                    </div>
                                ))}
                            </ul>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}