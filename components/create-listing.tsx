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

import { ListedItem } from "@/app/[category]/[subcategory]/page";
import { ListedWorld } from "@/app/listings/page";

import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, setDoc } from "firebase/firestore";
import { useAuth } from "@/context/auth-context";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

import { CheckCircle2Icon, Trash2 } from "lucide-react";
import { AlertCircle } from "lucide-react";
import ItemNameAutocomplete from "@/components/item-name-autocomplete";
import ProductCard_03Preview from "@/components/commerce-ui/product-card-03-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";
import WorldProductCard_03 from "@/components/commerce-ui/world-product-card-03";


export default function CreateListing() {
    // listed item parameters
    const [world, setWorld] = useState("");
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(1);
    const [unit, setUnit] = useState("WL");
    const [unitPrice, setUnitPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("https://static.wikia.nocookie.net/growtopia/images/8/8f/ItemSprites.png/revision/latest/window-crop/width/32/x-offset/2912/y-offset/224/window-width/32/window-height/32?format=png&fill=cb-20250605082111");
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");

    // listed world parameters
    const [worldForSale, setWorldForSale] = useState("");
    const [worldCategory, setWorldCategory] = useState("");
    const [worldDescription, setWorldDescription] = useState("");
    const [worldPrice, setWorldPrice] = useState(1);
    const [worldUnit, setWorldUnit] = useState("WL");

    const [selectedListingId, setSelectedListingId] = useState("");
    const [selectedWorldId, setSelectedWorldId] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteWorldDialogOpen, setDeleteWorldDialogOpen] = useState(false);

    const [listedItems, setListedItems] = useState<ListedItem[]>([]);
    const [listedWorlds, setListedWorlds] = useState<ListedWorld[]>([]);

    const [isLoading, setIsLoading] = useState(true);

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
        if (!quantity || !price || !unit) {
            setUnitPrice("");
            return;
        }
        let priceInWL = Number(price);
        if (unit === "DL") priceInWL = Number(price) * 100;
        if (unit === "BGL") priceInWL = Number(price) * 100 * 100;
        if (Number(quantity) > 0) {
            setUnitPrice((priceInWL / Number(quantity)).toString());
        } else {
            setUnitPrice("");
        }
    }, [quantity, price, unit]);

    const handleCreateWorld = async () => {
        if (!user) {
            setAlert({
                type: "error",
                title: "Authentication error",
                description: "You must be logged in to create a listing.",
            });
            return;
        }

        const newWorldListing = {
            userId: user.uid,
            name: worldForSale,
            price: Number(worldPrice),
            unit: worldUnit,
            category: worldCategory,
            description: worldDescription,
            createdAt: new Date()
        }

        try {
            // generate a shared ID
            const newWorldDocRef = doc(collection(db, "users", user.uid, "world-listings"));

            // use the same ID for both collections
            await setDoc(newWorldDocRef, newWorldListing);
            await setDoc(doc(db, "AllWorldListings", newWorldDocRef.id), newWorldListing);

            setAlert({
                type: "success",
                title: "Listing created!",
                description: "Your new listing was added successfully.",
            });

            
            setDialogOpen(false);
            window.location.reload();
        } catch (err) {
            console.error("Error creating listing:", err);
            setAlert({
                type: "error",
                title: "Failed to create listing.",
                description: "Please try again later.",
            });
        }
    }

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
            // generate a shared ID
            const newDocRef = doc(collection(db, "users", user.uid, "listings"));

            // use the same ID for both collections
            await setDoc(newDocRef, newListing);
            await setDoc(doc(db, "AllListings", newDocRef.id), newListing);

            setAlert({
                type: "success",
                title: "Listing created!",
                description: "Your new listing was added successfully.",
            });

            setDialogOpen(false);
            window.location.reload();
        } catch (err) {
            console.error("Error creating listing:", err);
            setAlert({
                type: "error",
                title: "Failed to create listing.",
                description: "Please try again later.",
            });
        }
    };

    if (loading || !user || isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
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
                    <Button className="mb-6" variant="outline">Create New Listing</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleCreate}>
                        <DialogHeader className="mb-6">
                            <DialogTitle>Create New Listing</DialogTitle>
                            <DialogDescription>
                                Fill in the details below to create a new listing.
                            </DialogDescription>
                        </DialogHeader>

                        <Tabs defaultValue="Item">
                            <TabsList className="mb-4">
                                <TabsTrigger value="item">Sell Item</TabsTrigger>
                                <TabsTrigger value="world">Sell World</TabsTrigger>
                            </TabsList>

                            <TabsContent value="item">
                                <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-4">
                                    <div className="flex flex-col gap-4">
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
                                                <Input min={1} max={200} required id="quantity" type="number" onChange={(e) => setQuantity(Number(e.target.value))} placeholder="# of items" />
                                            </div>
                                            <div className="grid gap-2 w-full">
                                                <Label htmlFor="price">Price</Label>
                                                <Input min={1} max={200} required id="price" type="number" onChange={(e) => setPrice(Number(e.target.value))} placeholder="Enter price" />
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
                                        <div className="grid gap-2">
                                            <Label htmlFor="world">World</Label>
                                            <Input required id="world" maxLength={24} onChange={(e) => setWorld(e.target.value.toUpperCase())} placeholder="Enter world selling your item" />
                                        </div>

                                        <Separator />
                                        <div className="grid gap-2 mb-4">
                                            <Label>Preview</Label>
                                            <div className="w-full max-w-[200px] mx-auto">
                                                <ProductCard_03Preview
                                                    item={{
                                                        id: selectedListingId,
                                                        userId: user?.uid || 'null',
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
                            </TabsContent>

                            <TabsContent value="world">
                                <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-4">
                                    <div className="flex flex-col gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="worldForSale">World</Label>
                                            <Input required id="worldForSale" maxLength={24} onChange={(e) => setWorldForSale(e.target.value.toUpperCase())} placeholder="Enter world name" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="worldCategory">Category</Label>
                                            <Select onValueChange={(val) => setWorldCategory(val)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="trade">Trade</SelectItem>
                                                    <SelectItem value="main">Main</SelectItem>
                                                    <SelectItem value="shop">Shop</SelectItem>
                                                    <SelectItem value="farm">Farm</SelectItem>
                                                    <SelectItem value="music">Music</SelectItem>
                                                    <SelectItem value="social">Social</SelectItem>
                                                    <SelectItem value="storage">Storage</SelectItem>
                                                    <SelectItem value="art">Art</SelectItem>
                                                    <SelectItem value="game">Game</SelectItem>
                                                    <SelectItem value="information">Information</SelectItem>
                                                    <SelectItem value="parkour">Parkour</SelectItem>
                                                    <SelectItem value="puzzle">Puzzle</SelectItem>
                                                    <SelectItem value="roleplay">Roleplay</SelectItem>
                                                    <SelectItem value="story">Story</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="worldDescription">Description / Contact Info (optional)</Label>
                                            <Input id="worldDescription" maxLength={50} onChange={(e) => setWorldDescription(e.target.value)} placeholder="Describe world or contact info to buy" />
                                        </div>
                                        <div className="flex flex-row gap-2">
                                            <div className="grid gap-2 w-full">
                                                <Label htmlFor="worldPrice">Price</Label>
                                                <Input min={1} max={200} required id="price" type="number" onChange={(e) => setWorldPrice(Number(e.target.value))} placeholder="Enter price" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="worldUnit">Unit</Label>
                                                <Select onValueChange={(val) => setWorldUnit(val)}>
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
                                                <WorldProductCard_03
                                                    world={{
                                                        id: selectedWorldId,
                                                        userId: user.uid,
                                                        name: worldForSale,
                                                        price: Number(worldPrice),
                                                        unit: worldUnit,
                                                        createdAt: new Date(),
                                                        category: worldCategory,
                                                        description: worldDescription
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
                                    <Button type="button" onClick={() => handleCreateWorld()}>Create</Button>
                                </DialogFooter>
                            </TabsContent>
                        </Tabs>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}