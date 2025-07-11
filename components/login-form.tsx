"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, getRedirectResult, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
//import { signInWithRedirect } from "firebase/auth";
//import { googleProvider } from "@/lib/firebase";
//import { signInWithPopup } from "firebase/auth";

import { UserCredential } from "firebase/auth";
import { FirebaseError } from "firebase/app";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  //const isMobile = typeof window !== "undefined" && /Mobi|Android/i.test(navigator.userAgent);

/*
  const handleGoogleLogin = async () => {
    try {
      if (isMobile) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        await handleLoginResult(result);
      }
    } catch (error) {
      console.error("Google login error:", error);
      alert("Failed to login with Google");
    }
  };
*/

  const handleLoginResult = async (result: UserCredential) => {
    const user = result.user;
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
      });
    }

    router.push("/");
  };

  const handleExampleLogin = async () => {
    const email = "paelen13@gmail.com";
    const password = "testpassword";

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await handleUserLogin(result);
    } catch (error: unknown) {
      if (error instanceof FirebaseError && error.code === "auth/user-not-found") {
        try {
          const newUser = await createUserWithEmailAndPassword(auth, email, password);
          await handleUserLogin(newUser);
        } catch (createError) {
          console.error("Failed to create example user:", createError);
        }
      } else if (error instanceof Error) {
        console.error("Login failed:", error.message);
      } else {
        console.error("Unknown login error:", error);
      }
    }
  };

  const handleUserLogin = async (result: UserCredential) => {
    const user = result.user;
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "Example User",
        photoURL: user.photoURL || "",
        createdAt: new Date().toISOString(),
      });
      console.log("User document created.");
    } else {
      console.log("User data:", docSnap.data());
    }

    router.push("/");
  };

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          await handleLoginResult(result);
        }
      } catch (error) {
        console.error("Redirect login error:", error);
      }
    };
    checkRedirectResult();
  }, []);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full max-w-xs mx-auto bg-black/40 backdrop-blur-sm shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Growtopia Trade Market</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full cursor-pointer" onClick={handleExampleLogin} type="button">
                  {/* Google icon svg */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
