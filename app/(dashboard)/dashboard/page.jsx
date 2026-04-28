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
} from "@/components/ui/card";
import { 
  PawPrint, 
  Settings, 
  Sparkles, 
  Heart, 
  ArrowRight 
} from "lucide-react";
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

  const hasPreferences = currentUser.preferences && 
    (currentUser.preferences.petType?.length > 0 || 
     currentUser.preferences.activityLevel || 
     currentUser.preferences.livingSpace);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Welcome Header - Minimalist */}
      <div className="mb-12">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold tracking-wider text-primary-600 uppercase">
          <Sparkles className="size-3" />
          Feed Personalizado
        </div>
        <h1 className="font-heading text-4xl font-bold text-neutral-900 sm:text-5xl leading-tight">
          Olá, <span>{user?.firstName}</span>
        </h1>
        <p className="mt-4 text-lg text-neutral-500 max-w-2xl leading-relaxed">
          Encontramos alguns amigos especiais que adorariam viver você.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {/* Recommendations Header */}
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-neutral-900">Recomendados para você</h2>
              <div className="mt-1 h-1 w-12 bg-primary-500 rounded-full"></div>
            </div>
            <Link href="/dashboard/discover" className="hidden sm:block">
              <Button variant="ghost" className="text-neutral-500 hover:text-primary-600 hover:bg-primary-50">
                Ver todos <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>

          {/* Recommendations Grid */}
          {recommendedPets && recommendedPets.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {recommendedPets.slice(0, 9).map((pet) => (
                <PetCard
                  key={pet._id}
                  pet={pet}
                  currentUserId={currentUser._id}
                />
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 border-neutral-200 bg-neutral-50/50 py-16 text-center shadow-none">
              <CardContent>
                <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-white border border-neutral-100">
                  <Heart className="size-8 text-neutral-200" />
                </div>
                <h3 className="mb-2 font-heading text-xl font-bold text-neutral-900">
                  Nenhuma recomendação ainda
                </h3>
                <p className="mx-auto mb-8 max-w-sm text-neutral-500 text-sm">
                  Não encontramos nenhum pet que corresponda às suas preferências atuais. 
                  Tente ajustar seus filtros ou explore nossa lista completa.
                </p>

                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                  <Link href="/dashboard/settings">
                    <Button variant="outline" className="border-neutral-200">
                      <Settings className="mr-2 size-4" />
                      Ajustar Perfil
                    </Button>
                  </Link>
                  <Link href="/dashboard/discover">
                    <Button className="bg-primary-500 hover:bg-primary-600 text-white">
                      Ver Todos os Pets
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Area */}
        <aside className="space-y-8">
          {/* Preferences Quick Info */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-neutral-900">
              <Settings className="size-4 text-primary-500" />
              Suas preferências
            </h3>
            
            {!hasPreferences ? (
              <div className="space-y-4">
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Defina o que você procura para receber sugestões melhores.
                </p>
                <Link href="/dashboard/settings" className="block">
                  <Button variant="outline" className="w-full border-primary-100 text-primary-600 hover:bg-primary-50">
                    Configurar Perfil
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-4">
                  {currentUser.preferences.petType && currentUser.preferences.petType.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Tipos</p>
                      <div className="flex flex-wrap gap-1">
                        {currentUser.preferences.petType.map(t => (
                          <span key={t} className="rounded-md bg-neutral-50 px-2 py-0.5 text-[10px] font-bold text-neutral-600 uppercase">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentUser.preferences.size && currentUser.preferences.size.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Tamanho</p>
                      <div className="flex flex-wrap gap-1">
                        {currentUser.preferences.size.map(s => (
                          <span key={s} className="rounded-md bg-neutral-50 px-2 py-0.5 text-[10px] font-bold text-neutral-600 uppercase">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentUser.preferences.age && currentUser.preferences.age.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Faixa Etária</p>
                      <div className="flex flex-wrap gap-1">
                        {currentUser.preferences.age.map(a => (
                          <span key={a} className="rounded-md bg-neutral-50 px-2 py-0.5 text-[10px] font-bold text-neutral-600 uppercase">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(currentUser.preferences.activityLevel || currentUser.preferences.livingSpace) && (
                    <div className="space-y-2 pt-1 border-t border-neutral-50">
                      {currentUser.preferences.activityLevel && (
                        <p className="text-xs text-neutral-500">
                          Atividade: <span className="font-bold text-neutral-700">
                            {currentUser.preferences.activityLevel === 'none' ? 'Sem preferência' : currentUser.preferences.activityLevel}
                          </span>
                        </p>
                      )}
                      {currentUser.preferences.livingSpace && (
                        <p className="text-xs text-neutral-500">
                          Espaço: <span className="font-bold text-neutral-700">
                            {
                              {
                                'apartment': 'Apartamento',
                                'house-no-yard': 'Casa sem quintal',
                                'house-small-yard': 'Casa com quintal pequeno',
                                'house-large-yard': 'Casa com quintal grande',
                                'farm': 'Propriedade rural'
                              }[currentUser.preferences.livingSpace] || currentUser.preferences.livingSpace
                            }
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <Link href="/dashboard/settings" className="block pt-2">
                  <Button variant="ghost" className="w-full h-8 text-xs text-neutral-400 hover:text-primary-600">
                    Editar preferências
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="rounded-2xl bg-secondary-50 border-1 border-secondary-300 p-6">
            <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-white text-secondary-500 shadow-sm">
              <PawPrint className="size-5" />
            </div>
            <h4 className="mb-2 font-bold text-secondary-900">Dica do dia</h4>
            <p className="text-xs leading-relaxed text-secondary-800/60">
              O tempo médio de adaptação de um pet idoso é de apenas 2 semanas. Eles são ótimos companheiros para quem busca tranquilidade!
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
