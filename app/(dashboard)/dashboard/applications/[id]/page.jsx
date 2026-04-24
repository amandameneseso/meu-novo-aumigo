"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MessageCircle,
} from "lucide-react";
import LoadingSpinner from "@/components/loading-spinner";

export default function ApplicationDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);

  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip",
  );
  const application = useQuery(api.applications.getApplicationById, { id: id });
  const pet = useQuery(
    api.pets.getPetById,
    application?.petId ? { id: application.petId } : "skip",
  );
  const applicant = useQuery(
    api.users.getUserById,
    application?.applicantId ? { id: application.applicantId } : "skip",
  );
  const updateApplicationStatus = useMutation(
    api.applications.updateApplicationStatus,
  );
  const createNotification = useMutation(api.notifications.createNotification);

  const handleStatusUpdate = async (status) => {
    if (!applicant || !applicant || !pet || !currentUser) return;

    setIsUpdating(true);
    try {
      await updateApplicationStatus({
        id: application._id,
        status,
      });

      // Create notification for applicant
      await createNotification({
        userId: application.applicantId,
        type: "application_update",
        title: `Solicitação ${status}`,
        message: `Sua solicitação para ${pet.name} está ${status}`,
      });

      toast.success(`Solicitação ${status} com sucesso.`);
      router.push("/dashboard/profile");
    } catch (error) {
      console.error("Erro ao atualizar a solicitação", error);
      toast.error("Falha ao atualizar a solicitação. Tente novamente.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!application || !pet || !applicant || !currentUser) {
    return <LoadingSpinner />;
  }

  const isOwner = application.ownerId === currentUser._id;

  const experienceLabels = {
    "first-time": "Iniciante",
    some: "Pouca experiência",
    experienced: "Experiente",
    professional: "Profissional (veterinário, treinador, etc.)",
  };

  const livingSpaceLabels = {
    apartment: "Apartamento",
    "house-no-yard": "Casa sem quintal",
    "house-small-yard": "Casa com quintal pequeno",
    "house-large-yard": "Casa com quintal grande",
    farm: "Propriedade rural",
  };

  const otherPetsLabels = {
    none: "Nenhum outro animal",
    dogs: "Cachorro(s)",
    cats: "Gato(s)",
    both: "Cachorro(s) e gato(s)",
    other: "Outros animais",
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 size-4" />
          Voltar
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Solicitação de adoção
            </h1>
            <p>Solicitação para o(a) {pet.name}</p>
          </div>

          <Badge
            className={
              application.status === "pendente"
                ? "bg-yellow-100 text-yellow-800"
                : application.status === "aceita"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
            }
          >
            {application.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações do pet</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="flex size-16 items-center justify-center rounded-lg bg-gray-100">
                  <User className="size-8 text-gray-400" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold">{pet.name}</h3>
                  <p>
                    {pet.breed} &middot; {pet.type}
                  </p>
                  <p className="text-sm text-gray-500">
                    {pet.age} ano(s) &middot; {pet.location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application data */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da solicitação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium text-gray-900">
                  Experiência com pets
                </h4>
                <p className="text-gray-700">
                  {experienceLabels[application.applicationData.experience]}
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="mb-2 font-medium text-gray-900">Espaço habitacional</h4>
                <p className="text-gray-700">
                  {livingSpaceLabels[application.applicationData.livingSpace]}
                </p>
              </div>

              <Separator />

              {/* <div>
                <h4 className="mb-2 font-medium text-gray-900">
                  Work schedule
                </h4>
                <p className="text-gray-700">
                  {application.applicationData.workSchedule}
                </p>
              </div>

              <Separator /> */}

              <div>
                <h4 className="mb-2 font-medium text-gray-900">Outros bichinhos na casa</h4>
                <p className="text-gray-700">
                  {otherPetsLabels[application.applicationData.otherPets]}
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="mb-2 font-medium text-gray-900">
                  Motivo da adoção
                </h4>
                <p className="text-gray-700">
                  {application.applicationData.reason}
                </p>
              </div>

              {application.applicationData.references && (
                <>
                  <Separator />

                  <div>
                    <h4 className="mb-2 font-medium text-gray-900">
                      Referências
                    </h4>
                    <p className="text-gray-700">
                      {application.applicationData.references}
                    </p>
                  </div>
                </>
              )}

              {application.applicationData.additionalInfo && (
                <>
                  <Separator />

                  <div>
                    <h4 className="mb-2 font-medium text-gray-900">
                      Informações adicionais
                    </h4>
                    <p className="text-gray-700">
                      {application.applicationData.additionalInfo}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Applicant info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do solicitante</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="size-12">
                  <AvatarImage
                    src={applicant.profileImage}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    <User className="size-6" />
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-medium">{applicant.name}</p>
                  <p className="text-sm">{applicant.location}</p>
                </div>
              </div>

              {applicant.bio && (
                <p className="text-sm text-gray-700">{applicant.bio}</p>
              )}

              <div className="space-y-2 text-gray-600">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="size-4" />
                  <span>{applicant.email}</span>
                </div>

                {applicant.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="size-4" />
                    <span>{applicant.phone}</span>
                  </div>
                )}

                {applicant.location && (
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="size-4" />
                    <span>{applicant.location}</span>
                  </div>
                )}
              </div>

              <Link href={`/dashboard/users/${applicant._id}`}>
                <Button variant="outline" className="w-full">
                  Ver perfil
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status da solicitação</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="size-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Pedido em{" "}
                  {new Date(application.createdAt).toLocaleDateString()}
                </span>
              </div>

              {isOwner && application.status === "pendente" && (
                <div className="space-y-3">
                  <Button
                    onClick={() => handleStatusUpdate("aceita")}
                    disabled={isUpdating}
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    <Check className="mr-2 size-4" />
                    Aceitar
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => handleStatusUpdate("rejeitada")}
                    disabled={isUpdating}
                    className="w-full"
                  >
                    <X className="mr-2 size-4" />
                    Rejeitar
                  </Button>
                </div>
              )}

              {application.status === "aceita" && (
                <Link
                  href={`/dashboard/messages?application=${application._id}`}
                >
                  <Button className="w-full">
                    <MessageCircle className="mr-2 size-4" />
                    Enviar mensagem
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
