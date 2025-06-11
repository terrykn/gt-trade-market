"use client";

import { Navbar } from "@/components/navbar";

export default function Home() {


  return (
    <div>
      <Navbar />
      <main className="p-6">
        <h1 className="text-2xl font-bold">Welcome, Growtopian!</h1>
      </main>
    </div>
  );
}