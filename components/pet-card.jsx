"use client";

import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { PawPrint, MapPin, Calendar, Weight, User } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";

export default function PetCard({ pet, currentUserId }) {
  const [imageError, setImageError] = useState(false);

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
    if (!application) {
      return {
        text: "Quero adotar",
        variant: "default",
        href: `/dashboard/pets/${pet._id}`,
      };
    }

    switch (application.status) {
      case "pendente":
        return {
          text: "Pendente",
          variant: "secondary",
          disabled: true,
        };
      case "aceita":
        return {
          text: "Aceita",
          variant: "default",
          href: `/dashboard/messages?application=${application._id}`,
        };
      case "rejeitada":
        return {
          text: "Rejeitada",
          variant: "destructive",
          disabled: true,
        };
      default:
        return {
          text: "Quero adotar",
          variant: "default",
          href: `/dashboard/pets/${pet._id}`,
        };
    }
  };

  const buttonProps = getButtonContent();

  return (
    <Card className="overflow-hidden p-0 transition-shadow duration-300 hover:shadow-lg">
      <div className="relative">
        <div className="relative aspect-square bg-gray-100">
          {pet.images && pet.images.length > 0 && !imageError ? (
            <Image
              src={pet.images[0]}
              alt={pet.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <PawPrint className="size-16 text-gray-300" />
            </div>
          )}

          <div className="absolute top-3 right-3">
            <Badge variant={pet.isAvailable ? "default" : "secondary"}>
              {pet.isAvailable ? "Disponível" : "Indisponível"}
            </Badge>
          </div>
        </div>
      </div>

      <CardContent>
        <div className="space-y-3">
          {/* informações */}
          <div>
            <h3 className="text-lg font-semibold">{pet.name}</h3>
            <p className="text-sm capitalize">
              {pet.breed} &middot; {pet.type}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="size-4" />
              <span>
                {pet.age} {pet.age === 1 ? "ano" : "anos"}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <Weight className="size-4" />
              <span className="capitalize">{pet.size}</span>
            </div>
          </div>

          {/* localização */}
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <MapPin className="size-4" />
            <span className="capitalize">{pet.location}</span>
          </div>

          {/* informações do dono */}
          {owner && (
            <div className="flex items-center space-x-2">
              <Avatar className="size-6">
                <AvatarImage src={owner.profileImage} />
                <AvatarFallback>
                  <User className="size-3" />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">{owner.name}</span>
            </div>
          )}

          {/* descrição */}
          <p className="line-clamp-3 text-sm">{pet.description}</p>

          {/* botões */}
          <div className="pt-2 pb-4">
            {buttonProps.disabled ? (
              <Button className="w-full" variant={buttonProps.variant} disabled>
                {buttonProps.text}
              </Button>
            ) : (
              <Link href={buttonProps.href} className="block">
                <Button className="w-full" variant={buttonProps.variant}>
                  {buttonProps.text}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
