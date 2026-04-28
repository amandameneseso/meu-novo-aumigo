"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LoadingSpinner from "@/components/loading-spinner";

export default function DashboardLayout({ children }) {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();

  const createUser = useMutation(api.users.createUser);
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip",
  );

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isSignedIn, isLoaded, router]);

  useEffect(() => {
    if (user && !currentUser) {
      createUser({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.fullName || `${user.firstName} ${user.lastName}` || "User",
        profileImage: user.imageUrl || undefined,
      });
    }
  }, [user, currentUser, createUser]);

  if (!isLoaded || !isSignedIn) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-50">
      <Header />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  );
}
