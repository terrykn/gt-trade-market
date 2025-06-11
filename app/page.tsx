"use client";

import { Navbar } from '@/components/navbar';

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
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


  return (
    <div>
      <Navbar />
      <main className='p-6'>
        <h1 className="text-2xl font-bold">Welcome, Growtopian!</h1>
      </main>
    </div>
  );
}