"use client";

import { useState } from "react";
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
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator";

import { Item } from "../[category]/[subcategory]/page";
import { ListedItem } from "../[category]/[subcategory]/page";
import { Items } from "../[category]/[subcategory]/page";
import { ListedItems } from "../[category]/[subcategory]/page";

import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/context/auth-context";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

import { CheckCircle2Icon } from "lucide-react";
import { AlertCircle } from "lucide-react";
import ItemNameAutocomplete from "@/components/item-name-autocomplete";
import ProductCard_03Preview from "@/components/commerce-ui/product-card-03-preview";

interface Props {
    params: { category: string; subcategory: string };
}

export default function ListingsPage() {
    const [world, setWorld] = useState("");
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(1);
    const [unit, setUnit] = useState("WL");
    const [unitPrice, setUnitPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("https://static.wikia.nocookie.net/growtopia/images/8/8f/ItemSprites.png/revision/latest/window-crop/width/32/x-offset/2912/y-offset/224/window-width/32/window-height/32?format=png&fill=cb-20250605082111");
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");

    const [listedItems, setListedItems] = useState<ListedItem[]>([]);

    const [dialogOpen, setDialogOpen] = useState(false);

    const [alert, setAlert] = useState<{
        type: "success" | "error";
        title: string;
        description: string;
    } | null>(null);

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

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => setAlert(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [alert]);


    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            setAlert({
                type: "error",
                title: "Authentication error",
                description: "You must be logged in to create a listing.",
            });
            return;
        }

        const newListing = {
            userId: user.uid,
            name,
            quantity: Number(quantity),
            price: Number(price),
            unit,
            unitPrice: Number(unitPrice),
            world,
            imageUrl,
            category,
            subcategory,
            createdAt: new Date(),
        };

        try {
            await addDoc(
                collection(db, "users", user.uid, "listings"),
                newListing
            );
            await addDoc(collection(db, "AllListings"), newListing);
            setAlert({
                type: "success",
                title: "Listing created!",
                description: "Your new listing was added successfully.",
            });
            fetchUserListings();
            setDialogOpen(false);
        } catch (err) {
            console.error("Error creating listing:", err);
            setAlert({
                type: "error",
                title: "Failed to create listing.",
                description: "Please try again later.",
            });
        }
    };

        const fetchUserListings = async () => {
        if (!user) return;

        try {
            const q = query(collection(db, "users", user.uid, "listings"));
            const snapshot = await getDocs(q);
            const listings: ListedItem[] = snapshot.docs.map(doc => ({
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.() || new Date(),
            })) as ListedItem[];

            setListedItems(listings);
        } catch (err) {
            console.error("Failed to fetch user listings:", err);
            setAlert({
                type: "error",
                title: "Error loading listings",
                description: "Please try again later.",
            });
        }
    };

    useEffect(() => {
        fetchUserListings();
    }, [user]);

    return (
        <div>
            <Navbar />
            <div className="flex flex-col p-6">
                <div className="flex flex-row items-center gap-4">
                    <h2 className="text-xl font-bold mb-6">My Listings</h2>
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
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="mb-6" variant="outline">Create New</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleCreate}>
                                <DialogHeader className="mb-6">
                                    <DialogTitle>Create New Listing</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details below to create a new listing.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-4">
                                    <div className="flex flex-col gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="world">World</Label>
                                            <Input required id="world" maxLength={24} onChange={(e) => setWorld(e.target.value.toUpperCase())} placeholder="Enter world name" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Item Name</Label>
                                            <ItemNameAutocomplete
                                            value={name}
                                            onChange={(name, item) => {
                                                setName(name);
                                                if (item) {
                                                    setImageUrl(item.imageUrl);
                                                    setCategory(item.category.toLowerCase().replace(/\s+/g, "-"),);
                                                    setSubcategory(item.subcategory.toLowerCase().replace(/\s+/g, "-"),);
                                                } else {
                                                    setImageUrl("https://static.wikia.nocookie.net/growtopia/images/8/8f/ItemSprites.png/revision/latest/window-crop/width/32/x-offset/2912/y-offset/224/window-width/32/window-height/32?format=png&fill=cb-20250605082111");
                                                    setCategory("");
                                                    setSubcategory("");
                                                }
                                            }}
                                            />
                                        </div>
                                        <div className="flex flex-row gap-2">
                                            <div className="grid gap-2 w-full">
                                                <Label htmlFor="quantity">Quantity</Label>
                                                <Input min={1} max={200} required id="quantity" type="number" onChange={(e) => setQuantity(e.target.value)} placeholder="Number of items" />
                                            </div>
                                            <div className="grid gap-2 w-full">
                                                <Label htmlFor="price">Price</Label>
                                                <Input min={1} max={200} required id="price" type="number"  onChange={(e) => setPrice(e.target.value)} placeholder="Enter price" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="unit">Unit</Label>
                                                <Select onValueChange={(val) => setUnit(val)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Unit" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="WL">World Lock</SelectItem>
                                                        <SelectItem value="DL">Diamond Lock</SelectItem>
                                                        <SelectItem value="BGL">Blue Gem Lock</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <Separator />
                                        <div className="grid gap-2 mb-4">
                                            <Label>Preview</Label>
                                            <div className="w-full max-w-[200px] mx-auto">
                                                <ProductCard_03Preview
                                                    item={{
                                                        name,
                                                        quantity: Number(quantity),
                                                        price: Number(price),
                                                        unit,
                                                        unitPrice: Number(unitPrice),
                                                        world,
                                                        imageUrl: imageUrl,
                                                        createdAt: new Date(),
                                                        category: category,
                                                        subcategory: subcategory
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter className="mt-6">
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit">Create</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {listedItems.length === 0 ? (
                    <p className="text-muted-foreground">You have no listings yet.</p>
                ) : (
                    <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                        {listedItems.map((item, index) => (
                            <ProductCard_03 key={index} item={item} />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}