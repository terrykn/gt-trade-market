"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { CheckCircle2Icon, AlertCircle } from "lucide-react";
import ItemNameAutocomplete from "@/components/item-name-autocomplete";
import ProductCard_03Preview from "@/components/commerce-ui/product-card-03-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorldProductCard_03 from "@/components/commerce-ui/world-product-card-03";
import itemsData from "@/data/items.json";

import { query, getCountFromServer } from "firebase/firestore";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Filter } from "lucide-react";

const MAX_LISTINGS = 25;

async function canCreateListing(userId: string) {
  const itemsCol = collection(db, "users", userId, "listings");
  const worldsCol = collection(db, "users", userId, "world-listings");

  const [itemsCountSnap, worldsCountSnap] = await Promise.all([
    getCountFromServer(query(itemsCol)),
    getCountFromServer(query(worldsCol)),
  ]);

  const totalCount = itemsCountSnap.data().count + worldsCountSnap.data().count;
  return totalCount < MAX_LISTINGS;
}

const allTags = Array.from(
    new Set(
        (itemsData as Item[]).flatMap((item) => item.tags || [])
    )
);

export default function CreateListing({
    onCreated,
    onCreatedWorld,
}: {
    onCreated?: () => void;
    onCreatedWorld?: () => void;
}) {

    const [world, setWorld] = useState("");
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(1);
    const [unit, setUnit] = useState("WL");
    const [unitPrice, setUnitPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("https://static.wikia.nocookie.net/growtopia/images/8/8f/ItemSprites.png/revision/latest/window-crop/width/32/x-offset/2912/y-offset/224/window-width/32/window-height/32?format=png&fill=cb-20250605082111");
    const [tags, setTags] = useState<string[]>([]);
    const [description, setDescription] = useState("");

    const [worldForSale, setWorldForSale] = useState("");
    const [worldCategory, setWorldCategory] = useState("");
    const [worldDescription, setWorldDescription] = useState("");
    const [worldPrice, setWorldPrice] = useState(1);
    const [worldUnit, setWorldUnit] = useState("WL");

    const [dialogOpen, setDialogOpen] = useState(false);

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

    const TagSelector = ({
        selected,
        setSelected,
        label = "Tags",
    }: {
        selected: string[];
        setSelected: (tags: string[]) => void;
        label?: string;
    }) => {
        const [open, setOpen] = useState(false);

        const handleTagToggle = (tag: string) => {
            if (selected.includes(tag)) {
                setSelected(selected.filter((t) => t !== tag));
            } else if (selected.length < 6) {
                setSelected([...selected, tag]);
            }
        };

        return (
            <div>
                <Label className="mb-2 block">{label}</Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className={`flex items-center gap-1 ${selected.length > 0 ? "bg-blue-100 border-blue-400" : ""
                                }`}
                        >
                            <Filter className="w-4 h-4" />
                            {selected.length > 0 ? (
                                <span className="text-xs text-blue-700">
                                    {selected.length === 6
                                        ? "6 selected (max)"
                                        : `${selected.length} selected`}
                                </span>
                            ) : (
                                <span className="text-xs">Select tags</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-4 max-h-48 overflow-y-auto">
                        <div className="flex flex-wrap gap-2">
                            {allTags.map((tag) => (
                                <Button
                                    key={tag}
                                    type="button"
                                    size="sm"
                                    variant={selected.includes(tag) ? "default" : "outline"}
                                    className={`text-xs px-2 py-1 rounded ${selected.includes(tag) ? "bg-blue-600 text-white" : ""
                                        }`}
                                    onClick={() => handleTagToggle(tag)}
                                >
                                    {tag.toLowerCase()}
                                </Button>
                            ))}
                        </div>
                        {selected.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="mt-3 text-xs text-red-500"
                                onClick={() => setSelected([])}
                            >
                                Clear all
                            </Button>
                        )}
                    </PopoverContent>
                </Popover>
            </div>
        );
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

const handleCreateWorld = async () => {
  if (isSubmitting) return;
  setIsSubmitting(true);

  if (!user) {
    setAlert({
      type: "error",
      title: "Authentication error",
      description: "You must be logged in to create a listing.",
    });
    setIsSubmitting(false);
    return;
  }

  const allowed = await canCreateListing(user.uid);
  if (!allowed) {
    setAlert({
      type: "error",
      title: "Listing limit reached",
      description: `You can only have up to ${MAX_LISTINGS} combined listings.`,
    });
    setIsSubmitting(false);
    return;
  }

  const newWorldListing = {
    userId: user.uid,
    name: worldForSale,
    price: Number(worldPrice),
    unit: worldUnit,
    category: worldCategory,
    description: worldDescription,
    createdAt: new Date(),
  };

  try {
    const newWorldDocRef = doc(collection(db, "users", user.uid, "world-listings"));
    await setDoc(newWorldDocRef, newWorldListing);
    await setDoc(doc(db, "AllWorldListings", newWorldDocRef.id), newWorldListing);

    setAlert({
      type: "success",
      title: "Listing created!",
      description: "Your new listing was added successfully.",
    });

    setDialogOpen(false);
    if (onCreatedWorld) onCreatedWorld();
  } catch (err) {
    console.error("Error creating listing:", err);
    setAlert({
      type: "error",
      title: "Failed to create listing.",
      description: "Please try again later.",
    });
  } finally {
    setIsSubmitting(false);
  }
};


const handleCreate = async (e: React.FormEvent) => {
  e.preventDefault();
  if (isSubmitting) return;
  setIsSubmitting(true);

  if (!user) {
    setAlert({
      type: "error",
      title: "Authentication error",
      description: "You must be logged in to create a listing.",
    });
    setIsSubmitting(false);
    return;
  }

  const allowed = await canCreateListing(user.uid);
  if (!allowed) {
    setAlert({
      type: "error",
      title: "Listing limit reached",
      description: `You can only have up to ${MAX_LISTINGS} combined listings.`,
    });
    setIsSubmitting(false);
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
    tags,
    createdAt: new Date(),
    description,
  };

  try {
    const newDocRef = doc(collection(db, "users", user.uid, "listings"));
    await setDoc(newDocRef, newListing);
    await setDoc(doc(db, "AllListings", newDocRef.id), newListing);

    setAlert({
      type: "success",
      title: "Listing created!",
      description: "Your new listing was added successfully.",
    });

    setDialogOpen(false);
    if (onCreated) onCreated();
  } catch (err) {
    console.error("Error creating listing:", err);
    setAlert({
      type: "error",
      title: "Failed to create listing.",
      description: "Please try again later.",
    });
  } finally {
    setIsSubmitting(false);
  }
};



    if (loading || !user) {
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
                    <Button className="" variant="outline">Create New Listing</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-black/40 backdrop-blur-sm shadow-md">
                    <form onSubmit={handleCreate}>
                        <DialogHeader className="mb-6">
                            <DialogTitle>Create New Listing</DialogTitle>
                            <DialogDescription>
                                Fill in the details below to create a new listing.
                            </DialogDescription>
                        </DialogHeader>

                        <Tabs defaultValue="item">
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
                                                        setTags(item.tags || []);
                                                    } else {
                                                        setImageUrl("https://static.wikia.nocookie.net/growtopia/images/8/8f/ItemSprites.png/revision/latest/window-crop/width/32/x-offset/2912/y-offset/224/window-width/32/window-height/32?format=png&fill=cb-20250605082111");
                                                        setTags([]);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <TagSelector selected={tags} setSelected={setTags} />
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
                                        <div className="grid gap-2">
                                            <Label htmlFor="description">Description (optional)</Label>
                                            <Input id="description" maxLength={30} onChange={(e) => setDescription(e.target.value)} placeholder="Additional item details" />
                                        </div>

                                        <Separator />
                                        <div className="grid gap-2 mb-4">
                                            <Label>Preview</Label>
                                            <div className="w-full max-w-[200px] mx-auto">
                                                <ProductCard_03Preview
                                                    item={{
                                                        id: name,
                                                        userId: user?.uid || 'null',
                                                        name,
                                                        quantity: Number(quantity),
                                                        price: Number(price),
                                                        unit,
                                                        unitPrice: Number(unitPrice),
                                                        world,
                                                        imageUrl: imageUrl,
                                                        createdAt: new Date(),
                                                        tags: tags,
                                                        description
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
                                    <Button type="submit" disabled={isSubmitting}>Create</Button>
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
                                        <div className="grid gap-2">
                                            <Label htmlFor="worldDescription">Description (optional)</Label>
                                            <Input id="worldDescription" maxLength={30} onChange={(e) => setWorldDescription(e.target.value)} placeholder="Additional world details" />
                                        </div>
                                        <Separator />
                                        <div className="grid gap-2 mb-4">
                                            <Label>Preview</Label>
                                            <div className="w-full max-w-[200px] mx-auto">
                                                <WorldProductCard_03
                                                    world={{
                                                        id: worldForSale,
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
                                    <Button type="button" disabled={isSubmitting} onClick={() => handleCreateWorld()}>Create</Button>
                                </DialogFooter>
                            </TabsContent>
                        </Tabs>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}