"use client";

import React from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import PetCard from "@/components/pet-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PawPrint, Settings } from "lucide-react";
import Link from "next/link";
import LoadingSpinner from "@/components/loading-spinner";

export default function DashboardPage() {
  const { user } = useUser();

  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip",
  );
  const recommendedPets = useQuery(
    api.pets.getRecommendedPets,
    currentUser?._id
      ? {
          userId: currentUser._id,
          preferences: currentUser.preferences,
        }
      : "skip",
  );

  if (!currentUser) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">
          Bem-vindo(a), {user?.firstName}!
        </h1>
        <p>Descubra o animalzinho perfeito para você, com base nas suas preferências.</p>
      </div>
    </div>
  );
}
