"use client";

import LoadingSpinner from "@/components/loading-spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Heart,
  Home,
  Mail,
  MapPin,
  PawPrint,
  Phone,
  Smile,
  Stethoscope,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function Pet() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip",
  );
  const pet = useQuery(api.pets.getPetById, { id: id });
  const owner = useQuery(
    api.users.getUserById,
    pet?.ownerId ? { id: pet.ownerId } : "skip",
  );
  const application = useQuery(
    api.applications.getApplicationByPetAndApplicant,
    currentUser?._id && pet?._id
      ? {
          petId: pet._id,
          applicantId: currentUser._id,
        }
      : "skip",
  );

  if (!pet || !currentUser) {
    return <LoadingSpinner />;
  }

  const isOwner = pet.ownerId === currentUser._id;

  const getApplicationStatus = () => {
    if (!application) return null;
    return application.status;
  };

  const getActionButton = () => {
    if (isOwner) {
      return (
        <Link href={`/dashboard/pets/${pet._id}/edit`} className="block w-full">
          <button className="flex w-full transform items-center justify-center gap-2 rounded-[var(--radius-small)] bg-primary-500 py-4 font-bold text-white shadow-[var(--shadow-custom)] transition-all hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-[var(--shadow-custom-hover)]">
            Editar detalhes do pet
            <ArrowRight className="h-5 w-5" />
          </button>
        </Link>
      );
    }

    const status = getApplicationStatus();

    if (!status) {
      return (
        <Link href={`/dashboard/pets/${pet._id}/adopt`} className="block w-full">
          <button className="flex w-full transform items-center justify-center gap-2 rounded-[var(--radius-small)] bg-primary-500 py-4 font-bold text-white shadow-[var(--shadow-custom)] transition-all hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-[var(--shadow-custom-hover)]">
            Adotar {pet.name}
            <ArrowRight className="h-5 w-5" />
          </button>
        </Link>
      );
    }

    switch (status) {
      case "pendente":
        return (
          <button
            disabled
            className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-small)] bg-neutral-100 py-4 font-bold text-neutral-500"
          >
            Solicitacao em progresso
          </button>
        );
      case "aceita":
        return (
          <Link href={`/dashboard/applications/${application._id}`} className="block w-full">
            <button className="flex w-full transform items-center justify-center gap-2 rounded-[var(--radius-small)] bg-secondary-500 py-4 font-bold text-white shadow-[var(--shadow-custom)] transition-all hover:-translate-y-0.5 hover:bg-secondary-600 hover:shadow-[var(--shadow-custom-hover)]">
              Ver detalhes da solicitacao
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        );
      case "rejeitada":
        return (
          <button
            disabled
            className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-small)] bg-red-100 py-4 font-bold text-red-600"
          >
            Solicitacao Rejeitada
          </button>
        );
      default:
        return (
          <Link href={`/dashboard/pets/${pet._id}/adopt`} className="block w-full">
            <button className="flex w-full transform items-center justify-center gap-2 rounded-[var(--radius-small)] bg-primary-500 py-4 font-bold text-white shadow-[var(--shadow-custom)] transition-all hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-[var(--shadow-custom-hover)]">
              Adotar {pet.name}
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        );
    }
  };

  return (
    <>
      {/* Breadcrumbs */}
      <div className="border-b border-neutral-100 bg-background-50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center text-sm text-neutral-500">
            <Link href="/dashboard" className="transition-colors hover:text-primary-600">
              Inicio
            </Link>
            <ChevronRight className="mx-2 h-4 w-4 text-neutral-300" />
            <Link href="/dashboard/discover" className="transition-colors hover:text-primary-600">
              Descobrir
            </Link>
            <ChevronRight className="mx-2 h-4 w-4 text-neutral-300" />
            <span className="font-medium capitalize text-neutral-900">{pet.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* Left Column: Gallery & Bio */}
          <div className="space-y-10 lg:col-span-7 xl:col-span-8">
            {/* Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-large)] shadow-[var(--shadow-soft)] md:aspect-[16/10]">
                {pet.images && pet.images.length > 0 && !imageError ? (
                  <Image
                    src={pet.images[selectedImageIndex]}
                    alt={`${pet.name} - imagem principal`}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-100">
                    <PawPrint className="h-24 w-24 text-neutral-300" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute left-4 top-4 flex gap-2">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide shadow-sm ${
                      pet.isAvailable
                        ? "bg-secondary-500 text-white"
                        : "bg-neutral-500 text-white"
                    }`}
                  >
                    {pet.isAvailable ? "Disponivel" : "Indisponivel"}
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {pet.images && pet.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3 md:gap-4">
                  {pet.images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square overflow-hidden rounded-[var(--radius-large)] border-2 transition-all ${
                        selectedImageIndex === index
                          ? "border-primary-500 shadow-sm"
                          : "border-transparent opacity-70 hover:border-primary-300 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${pet.name} - miniatura ${index + 1}`}
                        width={200}
                        height={200}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                  {pet.images.length > 4 && (
                    <div className="flex aspect-square cursor-pointer items-center justify-center rounded-[var(--radius-large)] bg-neutral-100 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-200">
                      +{pet.images.length - 4} Mais
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* About Section */}
            <div>
              <h2 className="mb-6 flex items-center gap-3 font-heading text-3xl font-bold text-neutral-900">
                Sobre {pet.name}
                <div className="ml-4 h-px flex-1 bg-neutral-200"></div>
              </h2>

              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed text-neutral-600">
                  {pet.description}
                </p>

                {pet.medicalInfo && (
                  <>
                    <h3 className="mt-8 mb-3 flex items-center font-heading text-xl font-bold text-neutral-900">
                      <Stethoscope className="mr-2 h-5 w-5 text-primary-500" />
                      Informacoes Medicas
                    </h3>
                    <p className="text-neutral-600">{pet.medicalInfo}</p>
                  </>
                )}
              </div>
            </div>

            {/* Compatibility & Health Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Personality & Traits */}
              <div className="rounded-[var(--radius-large)] border border-neutral-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold text-neutral-900">
                  <Smile className="h-5 w-5 text-secondary-500" />
                  Personalidade
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-neutral-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary-500"></span>
                    Nivel de atividade: <span className="capitalize">{pet.activityLevel}</span>
                  </li>
                  {pet.goodWithKids && (
                    <li className="flex items-center gap-3 text-sm text-neutral-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary-500"></span>
                      Bom com criancas
                    </li>
                  )}
                  {pet.goodWithPets && (
                    <li className="flex items-center gap-3 text-sm text-neutral-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary-500"></span>
                      Bom com outros animais
                    </li>
                  )}
                  {pet.isHouseTrained && (
                    <li className="flex items-center gap-3 text-sm text-neutral-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary-500"></span>
                      Adestrado
                    </li>
                  )}
                </ul>
              </div>

              {/* Health & History */}
              <div className="rounded-[var(--radius-large)] border border-neutral-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold text-neutral-900">
                  <Check className="h-5 w-5 text-primary-500" />
                  Saude
                </h3>
                <ul className="space-y-3">
                  {pet.isCastrado && (
                    <li className="flex items-center gap-3 text-sm text-neutral-700">
                      <Check className="h-4 w-4 text-secondary-500" />
                      Castrado
                    </li>
                  )}
                  <li className="flex items-center gap-3 text-sm text-neutral-700">
                    <Check className="h-4 w-4 text-secondary-500" />
                    Vacinacao em dia
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-700">
                    <Check className="h-4 w-4 text-secondary-500" />
                    Vermifugado
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Adoption Card */}
          <div className="relative lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Main Profile Card */}
              <div className="overflow-hidden rounded-[var(--radius-large)] border border-neutral-100 bg-white shadow-[var(--shadow-custom)]">
                <div className="p-6 md:p-8">
                  <div className="mb-2 flex items-start justify-between">
                    <h1 className="font-heading text-4xl font-bold capitalize text-neutral-900">
                      {pet.name}
                    </h1>
                    <button className="p-1 text-neutral-400 transition-colors hover:text-red-500">
                      <Heart className="h-7 w-7" />
                    </button>
                  </div>
                  <p className="mb-6 text-lg font-medium capitalize text-neutral-500">
                    {pet.breed} &middot; {pet.gender}
                  </p>

                  {/* Key Stats Grid */}
                  <div className="mb-8 grid grid-cols-3 gap-4 border-y border-neutral-100 py-6">
                    <div className="text-center">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        Idade
                      </span>
                      <span className="block text-lg font-bold text-neutral-900">
                        {pet.age} {pet.age === 1 ? "ano" : "anos"}
                      </span>
                    </div>
                    <div className="border-l border-neutral-100 text-center">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        Porte
                      </span>
                      <span className="block text-lg font-bold capitalize text-neutral-900">
                        {pet.size}
                      </span>
                    </div>
                    <div className="border-l border-neutral-100 text-center">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        Local
                      </span>
                      <span className="block text-lg font-bold capitalize text-neutral-900">
                        {pet.location}
                      </span>
                    </div>
                  </div>

                  {/* Adoption Fee */}
                  {pet.adoptionFee !== undefined && pet.adoptionFee !== null && (
                    <div className="mb-6 flex items-center justify-between">
                      <span className="font-medium text-neutral-600">Taxa de adocao</span>
                      <span className="font-heading text-2xl font-bold text-primary-600">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(pet.adoptionFee)}
                      </span>
                    </div>
                  )}

                  {/* CTAs */}
                  <div className="space-y-3">
                    {getActionButton()}

                    {!isOwner && owner && (
                      <Link
                        href={`/dashboard/users/${owner._id}`}
                        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-small)] border border-neutral-200 bg-white py-3.5 font-semibold text-neutral-700 transition-all hover:bg-neutral-50"
                      >
                        <User className="h-5 w-5 text-primary-500" />
                        Ver perfil do protetor
                      </Link>
                    )}
                  </div>
                </div>

                {/* Owner Info Footer */}
                {owner && (
                  <div className="flex items-center gap-3 border-t border-neutral-100 bg-neutral-50 px-6 py-4">
                    <Avatar className="h-10 w-10 border border-neutral-200 bg-white">
                      <AvatarImage src={owner.profileImage} />
                      <AvatarFallback>
                        <User className="h-5 w-5 text-neutral-400" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-neutral-400">
                        Protetor
                      </p>
                      <p className="text-sm font-semibold text-neutral-900">{owner.name}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Application Status Card */}
              {application && (
                <div className="rounded-[var(--radius-large)] border border-neutral-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 font-heading text-lg font-bold text-neutral-900">
                    Status da Solicitacao
                  </h3>
                  <div className="flex items-center gap-3">
                    {application.status === "pendente" && (
                      <>
                        <div className="h-3 w-3 animate-pulse rounded-full bg-yellow-500"></div>
                        <span className="font-medium text-yellow-700">Aguardando revisao</span>
                      </>
                    )}
                    {application.status === "aceita" && (
                      <>
                        <Check className="h-5 w-5 text-secondary-500" />
                        <span className="font-medium text-secondary-700">Aceita</span>
                      </>
                    )}
                    {application.status === "rejeitada" && (
                      <>
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <span className="font-medium text-red-700">Rejeitada</span>
                      </>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-neutral-500">
                    Enviada em {new Date(application.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              )}

              {/* Adoption Process Steps */}
              {!isOwner && !application && (
                <div className="rounded-[var(--radius-large)] border border-neutral-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 font-heading text-lg font-bold text-neutral-900">
                    Processo de Adocao
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600">
                          1
                        </div>
                        <div className="my-1 h-full w-px bg-neutral-100"></div>
                      </div>
                      <div className="pb-4">
                        <h4 className="text-sm font-bold text-neutral-900">Enviar Solicitacao</h4>
                        <p className="mt-1 text-xs text-neutral-500">
                          Preencha o formulario para nos ajudar a encontrar o melhor lar.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600">
                          2
                        </div>
                        <div className="my-1 h-full w-px bg-neutral-100"></div>
                      </div>
                      <div className="pb-4">
                        <h4 className="text-sm font-bold text-neutral-900">Conhecer o Pet</h4>
                        <p className="mt-1 text-xs text-neutral-500">
                          Agende uma visita para conhecer {pet.name} pessoalmente.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600">
                          3
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900">Lar Doce Lar</h4>
                        <p className="mt-1 text-xs text-neutral-500">
                          Complete a documentacao e leve seu novo melhor amigo para casa.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:hidden">
        <div className="flex items-center gap-3">
          {pet.adoptionFee !== undefined && pet.adoptionFee !== null && (
            <div className="flex-1">
              <p className="text-xs font-medium uppercase text-neutral-500">Taxa de adocao</p>
              <p className="font-heading text-xl font-bold text-primary-600">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(pet.adoptionFee)}
              </p>
            </div>
          )}
          <div className={pet.adoptionFee ? "flex-[2]" : "flex-1"}>
            {isOwner ? (
              <Link href={`/dashboard/pets/${pet._id}/edit`}>
                <button className="w-full rounded-[var(--radius-small)] bg-primary-500 py-3.5 font-bold text-white shadow-[var(--shadow-custom)] transition-all hover:bg-primary-600">
                  Editar Pet
                </button>
              </Link>
            ) : (
              <Link href={`/dashboard/pets/${pet._id}/adopt`}>
                <button className="w-full rounded-[var(--radius-small)] bg-primary-500 py-3.5 font-bold text-white shadow-[var(--shadow-custom)] transition-all hover:bg-primary-600">
                  Adotar {pet.name}
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
