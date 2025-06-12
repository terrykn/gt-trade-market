"use client";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

import Link from "next/link";
import { Button } from "./ui/button";
import { DarkModeToggle } from "./darkmode-toggle";
import pagesData from '@/data/pages.json';

import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { DarkModeToggleText } from "./darkmode-toggle-text";
import { SearchBar } from "./search-bar";

const pages = pagesData;

type Subcategory = {
  title: string
  href: string
}

type ListItemProps = React.ComponentPropsWithoutRef<"li"> & {
  title: string
  href: string
  subcategories?: Subcategory[]
}

function ListItem({ title, href, subcategories }: ListItemProps) {
  return (
    <NavigationMenuLink asChild>
      <div>
        <div className="text-sm leading-none font-medium">{title}</div>
        {subcategories && subcategories.length > 0 && (
          <ul className="mt-2 space-y-1">
            {subcategories.map((subcategory) => (
              <li key={subcategory.title}>
                <Link
                  href={subcategory.href}
                  className="group inline-flex w-full items-center justify-start rounded-md px-2 py-1 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
                >
                  {subcategory.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </NavigationMenuLink>
  )
}

export function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav className="border-b">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold p-6">Growtopia Trade Market</div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-4"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          <SearchBar />

          <NavigationMenu>
            <NavigationMenuList className="flex items-center">
              <NavigationMenuItem>
                <NavigationMenuTrigger>All Items</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-2 max-h-64 overflow-y-auto">
                    <li>
                      {pages.map((page) => (
                        <ListItem
                          key={page.title}
                          title={page.title}
                          href={page.href}
                          subcategories={page.subcategories}
                        />
                      ))}
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/listings" className="text-sm font-medium">
                    My Listings
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <DarkModeToggle />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Button className="mr-2" variant="outline" size="icon" onClick={handleLogout}>
                    <LogOut />
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="flex flex-col gap-2 mt-2 lg:hidden p-4">
          <Link href="/listings" className="text-sm font-medium">
            My Listings
          </Link>
          <div className="text-sm font-medium">
            <button
              onClick={handleLogout}
              className="cursor-pointer"
            >
              Log Out
            </button>
          </div>
          <DarkModeToggleText />
          <div className="flex flex-row gap-2">
            <SearchBar />
          </div>
          <div>
            <ul className="max-h-64 overflow-y-auto">
              {pages.map((page) => (
                <div key={page.title}>
                  <div className="text-sm leading-none font-medium">{page.title}</div>
                  {page.subcategories && page.subcategories.length > 0 && (
                    <ul className="mt-2 mb-2 space-y-1">
                      {page.subcategories.map((subcategory) => (
                        <li key={subcategory.title}>
                          <Link
                            href={subcategory.href}
                            className="group inline-flex w-full items-center justify-start rounded-md px-2 py-1 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
                          >
                            {subcategory.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}