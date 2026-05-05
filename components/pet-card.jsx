"use client";

import { useState } from "react";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { PawPrint, MapPin, Calendar, Weight, User, ArrowRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";

export default function PetCard({ pet, currentUserId }) {
  const [imageError, setImageError] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const owner = useQuery(
    api.users.getUserById,
    pet.ownerId ? { id: pet.ownerId } : "skip",
  );
  const application = useQuery(
    api.applications.getApplicationByPetAndApplicant,
    currentUserId && pet._id
      ? {
          petId: pet._id,
          applicantId: currentUserId,
        }
      : "skip",
  );

  const getButtonContent = () => {
    // Se o usuario for o dono do pet
    if (pet.ownerId === currentUserId) {
      return {
        text: "Ver detalhes",
        variant: "outline",
        href: `/dashboard/pets/${pet._id}`,
      };
    }

    // Se nao for dono -> adotar pet
    if (!application) {
      return {
        text: `Conhecer ${pet.name}`,
        variant: "default",
        href: `/dashboard/pets/${pet._id}`,
      };
    }

    switch (application.status) {
      case "pendente":
        return {
          text: "Em progresso",
          variant: "secondary",
          disabled: true,
        };
      case "aprovado":
        return {
          text: "Aprovado",
          variant: "default",
          href: `/dashboard/pets/${pet._id}`,
        };
      case "rejeitado":
        return {
          text: "Rejeitado",
          variant: "destructive",
          disabled: true,
        };
      default:
        return {
          text: `Conhecer ${pet.name}`,
          variant: "default",
          href: `/dashboard/pets/${pet._id}`,
        };
    }
  };

  const buttonProps = getButtonContent();

  // Determine badge style based on status
  const getBadgeStyle = () => {
    if (!pet.isAvailable) {
      return "bg-neutral-100 text-neutral-600";
    }
    return "bg-secondary-100 text-secondary-700";
  };

  return (
    <div className="group cursor-pointer overflow-hidden rounded-[var(--radius-large)] border border-neutral-100 bg-white shadow-[0_4px_24px_-4px_rgba(30,30,30,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_-4px_rgba(30,30,30,0.18)]">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        {pet.images && pet.images.length > 0 && !imageError ? (
          <Image
            src={pet.images[0]}
            alt={pet.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-100">
            <PawPrint className="h-16 w-16 text-neutral-300" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute left-3 top-3 flex gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider ${getBadgeStyle()}`}>
            {pet.isAvailable ? "Disponivel" : "Indisponivel"}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Name and Age */}
        <div className="mb-1 flex items-start justify-between">
          <h3 className="font-heading text-xl font-bold text-neutral-900">{pet.name}</h3>
          <span className="rounded-[var(--radius-small)] bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-400">
            {pet.age} {pet.age === 1 ? "ano" : "anos"}
          </span>
        </div>

        {/* Breed, Type, Size */}
        <p className="mb-3 text-sm capitalize text-neutral-500">
          {pet.breed} &middot; {pet.gender} &middot; {pet.size}
        </p>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {pet.goodWithKids && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary-50 px-2.5 py-0.5 text-[0.7rem] font-semibold text-secondary-700">
              Bom com criancas
            </span>
          )}
          {pet.goodWithPets && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary-50 px-2.5 py-0.5 text-[0.7rem] font-semibold text-secondary-700">
              Bom com pets
            </span>
          )}
          {pet.isCastrado && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-[0.7rem] font-semibold text-primary-700">
              Castrado
            </span>
          )}
          {pet.isHouseTrained && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary-50 px-2.5 py-0.5 text-[0.7rem] font-semibold text-secondary-700">
              Adestrado
            </span>
          )}
        </div>

        {/* Location */}
        <div className="mb-3 flex items-center gap-1 text-sm text-neutral-500">
          <MapPin className="h-4 w-4" />
          <span className="capitalize">{pet.location}</span>
        </div>

        {/* Owner Info */}
        {owner && (
          <div className="mb-3 flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={owner.profileImage} />
              <AvatarFallback className="bg-neutral-100">
                <User className="h-3 w-3 text-neutral-400" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-neutral-600">{owner.name}</span>
          </div>
        )}

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-neutral-600">
          {pet.description}
        </p>

        {/* Action Button */}
        {buttonProps.disabled ? (
          <button
            disabled
            className={`flex w-full items-center justify-center gap-2 rounded-[var(--radius-small)] py-2.5 text-sm font-semibold transition-all ${
              buttonProps.variant === "secondary"
                ? "bg-neutral-100 text-neutral-500"
                : buttonProps.variant === "destructive"
                ? "bg-red-100 text-red-600"
                : "bg-primary-50 text-primary-700"
            }`}
          >
            {buttonProps.text}
          </button>
        ) : (
          <Link
            href={buttonProps.href}
            className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-small)] bg-primary-50 py-2.5 text-sm font-semibold text-primary-700 transition-all hover:bg-primary-500 hover:text-white"
          >
            {buttonProps.text}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
