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
      {/* Bem-vindo */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">
          Bem-vindo(a), {user?.firstName}!
        </h1>
        <p>
          Descubra o animalzinho perfeito para você, com base nas suas
          preferências.
        </p>
      </div>

      {!currentUser.preferences && (
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <Settings className="mr-2 size-5" />
              Defina suas preferências
            </CardTitle>
            <CardDescription className="text-orange-700">
              Ajude-nos a encontrar os animais de estimação perfeitos para você,
              definindo suas preferências nas configurações do seu perfil.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Link href="/dashboard/settings">
              <Button>Atualizar preferências</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Recomendações */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Recomendado para você</h2>

          <Link href="/dashboard/discover">
            <Button variant="outline">Ver todos os pets</Button>
          </Link>
        </div>

        {recommendedPets && recommendedPets.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {recommendedPets.slice(0, 8).map((pet) => (
              <PetCard
                key={pet._id}
                pet={pet}
                currentUserId={currentUser._id}
              />
            ))}
          </div>
        ) : (
          <Card className="py-12 text-center">
            <CardContent>
              <PawPrint className="mx-auto mb-4 size-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold">
                Nenhum animal de estimação encontrado
              </h3>
              <p className="mb-4">
                Não encontramos nenhum pet que corresponda às suas preferências.
                Tente atualizar suas configurações ou navegue por todos os pets
                disponíveis.
              </p>

              <div className="flex flex-col justify-center space-y-3 sm:w-auto sm:flex-row sm:space-y-0 sm:space-x-4">
                <Link href="/dashboard/settings">
                  <Button>
                    Atualizar preferências
                  </Button>
                </Link>

                <Link href="/dashboard/discover">
                  <Button variant="outline">
                    Ver todos os pets
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
