"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import ProductCard_03 from "@/components/commerce-ui/product-card-03";

import {
    Dialog,
    DialogContent,
    DialogDescription,
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

type Item = {
    name: string;
    imageUrl: string;
};

type ListedItem = {
    name: string;
    player: string;
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

export default function ListingsPage() {
    const [player, setPlayer] = useState("");
    const [world, setWorld] = useState("");
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [unit, setUnit] = useState("");

    return (
        <div>
            <Navbar />
            <div className="p-6">
                <div className="flex flex-row items-center gap-4">
                    <h2 className="text-xl font-bold mb-4">My Listings</h2>


                    <Dialog>
                        <form>
                            <DialogTrigger asChild>
                                <Button className="mb-4" variant="outline">Create New</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Listing</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details below to create a new listing.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-4">
                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="player">GrowID</Label>
                                            <Input id="player" placeholder="Enter your GrowID" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="world">World</Label>
                                            <Input id="world" placeholder="Enter the world containing your item" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Item Name</Label>
                                            <Input id="name" placeholder="Enter item name" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="quantity">Quantity</Label>
                                            <Input id="quantity" placeholder="Enter item quantity (how many items?)" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="price">Price</Label>
                                            <Input id="price" placeholder="Enter price" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="unit">Unit</Label>
                                            <Select>
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
                                        <Separator />
                                        <div className="grid gap-2">
                                            <Label>Preview</Label>
                                            <div className="w-full max-w-[200px] mx-auto">
                                                <ProductCard_03
                                                    item={{
                                                        name,
                                                        player,
                                                        quantity: Number(quantity),
                                                        price: Number(price),
                                                        unit,
                                                        world,
                                                        imageUrl: "https://static.wikia.nocookie.net/growtopia/images/8/8f/ItemSprites.png/revision/latest?cb=20230519125831",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </form>
                    </Dialog>


                </div>


            </div>
        </div>
    )
}