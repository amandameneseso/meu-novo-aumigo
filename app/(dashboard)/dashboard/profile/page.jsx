"use client";

// import { useState } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import tabs
import {
  User,
  MapPin,
  Phone,
  Mail,
  PawPrint,
  PlusCircle,
  Settings,
  Calendar,
  Check,
  X,
  Clock,
} from "lucide-react";
import Link from "next/link";
import PetCard from "@/components/pet-card";
import LoadingSpinner from "@/components/loading-spinner";

export default function ProfilePage() {
  const { user } = useUser();

  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip",
  );
  const userPets = useQuery(
    api.pets.getPetsByOwner,
    currentUser?._id ? { ownerId: currentUser._id } : "skip",
  );
  const applications = useQuery(
    api.applications.getApplicationsByApplicant,
    currentUser?._id ? { applicantId: currentUser._id } : "skip",
  );
  const receivedApplications = useQuery(
    api.applications.getApplicationsByOwner,
    currentUser?._id ? { ownerId: currentUser._id } : "skip",
  );

  if (!currentUser) {
    return <LoadingSpinner />;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pendente":
        return <Clock className="size-4 text-yellow-500" />;
      case "aceita":
        return <Check className="size-4 text-green-500" />;
      case "rejeitada":
        return <X className="size-4 text-red-500" />;
      default:
        return <Clock className="size-4 text-gray-500" />;
    }
  };

// botões
  const getStatusColor = (status) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "aceita":
        return "bg-green-100 text-green-800";
      case "rejeitada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      {/* header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col items-start space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-6">
            <Avatar className="size-24">
              <AvatarImage src={user?.imageUrl} className="object-cover" />
              <AvatarFallback className="text-2xl">
                <User className="size-12" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="mb-2 text-3xl font-bold text-gray-900">
                    {currentUser.name}
                  </h1>

                  <div className="space-y-1 text-gray-600">
                    {currentUser.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="size-4" />
                        <span>{currentUser.location}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Mail className="size-4" />
                      <span>{user?.emailAddresses[0]?.emailAddress}</span>
                    </div>

                    {currentUser.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="size-4" />
                        <span>{currentUser.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex space-x-3 md:mt-0">
                  <Link href="/dashboard/settings">
                    <Button variant="outline">
                      <Settings className="mr-2 size-4" />
                      Editar perfil
                    </Button>
                  </Link>

                  <Link href="/dashboard/add-pet">
                    <Button>
                      <PlusCircle className="mr-2 size-4" />
                      Doar pet
                    </Button>
                  </Link>
                </div>
              </div>

              {currentUser.bio && (
                <p className="mt-4 leading-relaxed">{currentUser.bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* conteúdo */}
      <div className="space-y-8">
        {/* Meus pets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <PawPrint className="mr-2 size-5" />
                Meus pets
              </div>

              <Badge variant="secondary">{userPets?.length || 0} pets</Badge>
            </CardTitle>

            <CardDescription>Pets que você adicionou para doação</CardDescription>
          </CardHeader>

          <CardContent>
            {userPets && userPets.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {userPets.map((pet) => (
                  <PetCard
                    key={pet._id}
                    pet={pet}
                    currentUserId={currentUser._id}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <PawPrint className="mx-auto mb-4 size-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Nenhum pet cadastrado
                </h3>
                <p className="mb-4">
                  Comece adicionando um animal de estimação que precise de um lar amoroso.
                </p>
                <Link href="/dashboard/add-pet">
                  <Button>
                    <PlusCircle className="mr-2 size-4" />
                    Adicionar seu primeiro pet
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Solicitações */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Minhas solicitações</CardTitle>
              <CardDescription>Solicitações que você enviou</CardDescription>
            </CardHeader>

            <CardContent>
              {applications && applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div
                      key={application._id}
                      className="rounded-lg border p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium">Solicitação de adoção</h4>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(application.status)}
                          <Badge className={getStatusColor(application.status)}>
                            {application.status}
                          </Badge>
                        </div>
                      </div>

                      <p className="mb-2 text-sm text-gray-600">
                        Enviada em{" "}
                        {new Date(application.createdAt).toLocaleDateString()}
                      </p>

                      {application.status === "aceita" && (
                        <Link
                          href={`/dashboard/messages?application=${application._id}`}
                        >
                          <Button size="sm" variant="outline">
                            Enviar mensagem
                          </Button>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Calendar className="mx-auto mb-2 size-8 text-gray-400" />
                  <p className="text-gray-600">Nenhuma solicitação enviada</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Solicitações recebidas */}
          <Card>
            <CardHeader>
              <CardTitle>Solicitações recebidas</CardTitle>
              <CardDescription>
                Solicitações que você recebeu para seus pets
              </CardDescription>
            </CardHeader>

            <CardContent>
              <CardContent>
                {receivedApplications && receivedApplications.length > 0 ? (
                  <div className="space-y-4">
                    {receivedApplications.map((application) => (
                      <div
                        key={application._id}
                        className="rounded-lg border p-4"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="font-medium">Solicitação recebida</h4>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(application.status)}
                            <Badge
                              className={getStatusColor(application.status)}
                            >
                              {application.status}
                            </Badge>
                          </div>
                        </div>

                        <p className="mb-2 text-sm text-gray-600">
                          Recebida em{" "}
                          {new Date(application.createdAt).toLocaleDateString()}
                        </p>

                        {application.status === "aceita" && (
                          <Link
                            href={`/dashboard/applications/${application._id}`}
                          >
                            <Button size="sm" variant="outline">
                              Ver detalhes
                            </Button>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Calendar className="mx-auto mb-2 size-8 text-gray-400" />
                    <p className="text-gray-600">
                      Nenhuma solicitação recebida
                    </p>
                  </div>
                )}
              </CardContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}