"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, PawPrint, Send } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import LoadingSpinner from "@/components/loading-spinner";

export default function AdoptPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    experience: "",
    livingSpace: "",
    // workSchedule: "",
    otherPets: "",
    reason: "",
    references: "",
    additionalInfo: "",
  });

  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip",
  );
  const pet = useQuery(api.pets.getPetById, { id: id });
  const owner = useQuery(
    api.users.getUserById,
    pet?.ownerId ? { id: pet.ownerId } : "skip",
  );

  const createApplication = useMutation(api.applications.createApplication);
  const createNotification = useMutation(api.notifications.createNotification);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser || !pet || !owner) {
      toast.error("Informações obrigatórias ausentes");
      return;
    }

    // Validar campos obrigatórios
    const requiredFields = [
      "experience",
      "livingSpace",
      // "workSchedule",
      "otherPets",
      "reason",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field].trim(),
    );

    if (missingFields.length > 0) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Criar solicitação
      const applicationId = await createApplication({
        petId: pet._id,
        applicantId: currentUser._id,
        ownerId: pet.ownerId,
        applicationData: formData,
      });

      // Criar notificação para o proprietário
      await createNotification({
        userId: pet.ownerId,
        type: "adoption_request",
        title: "Nova solicitação de adoção",
        message: `${currentUser.name} quer adotar ${pet.name}`,
        relatedId: applicationId,
      });

      toast.success("Solicitação enviada com sucesso!");
      router.push(`/dashboard/pets/${pet._id}`);
    } catch (error) {
      console.error("Erro ao enviar a solicitação.", error);
      toast.error("Falha ao enviar a solicitação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!pet || !currentUser) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-8">
        <Link href={`/dashboard/pets/${pet._id}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 size-4" />
            Voltar ao perfil de {pet.name}
          </Button>
        </Link>

        <div className="text-center">
          <PawPrint className="mx-auto mb-4 size-12 text-orange-500" />
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Adotar {pet.name}
          </h1>
          <p className="w-[65%] mx-auto">Preencha este formulário para iniciar o processo de adoção. O dono do pet será notificado e receberá a solicitação.</p>
        </div>
      </div>

      {/* resumo do pet */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center space-x-5">
            <div className="relative size-23 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {pet.images && pet.images.length > 0 ? (
                <Image
                  src={pet.images[0]} // Usa a primeira imagem
                  alt={`Foto de ${pet.name}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <PawPrint className="size-8 text-gray-400" />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold">{pet.name}</h3>
              <p>
                {pet.breed} &middot; {pet.type}
              </p>
              <p>
                &quot;Obrigado por querer me adotar e me dar um novo lar
                :D&quot;
              </p>
              <p className="text-sm text-gray-500">
                {pet.age} anos &middot; {pet.location}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* formulário */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitação de adoção</CardTitle>
          <CardDescription>
            Por favor, forneça informações detalhadas para nos ajudar a garantir o novo lar perfeito para {pet.name}.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="experience">Experiência com bichinhos *</Label>
              <Select
                value={formData.experience}
                onValueChange={(value) =>
                  handleInputChange("experience", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione seu nível de experiência" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="first-time">
                    Dono de um bichinho pela primeira vez
                  </SelectItem>
                  <SelectItem value="some">Pouca experiência</SelectItem>
                  <SelectItem value="experienced">Muita experiência</SelectItem>
                  <SelectItem value="professional">
                    Profissional (veterinário, treinador, etc.)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="livingSpace">Espaço habitacional *</Label>
              <Select
                value={formData.livingSpace}
                onValueChange={(value) =>
                  handleInputChange("livingSpace", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Descreva seu espaço habitacional" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="apartment">Apartamento</SelectItem>
                  <SelectItem value="house-no-yard">
                    Casa sem quintal
                  </SelectItem>
                  <SelectItem value="house-small-yard">
                    Casa com quintal pequeno
                  </SelectItem>
                  <SelectItem value="house-large-yard">
                    Casa com quintal grande
                  </SelectItem>
                  <SelectItem value="farm">Propriedade rural</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="otherPets">Outros bichinhos na casa *</Label>
              <Select
                value={formData.otherPets}
                onValueChange={(value) => handleInputChange("otherPets", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Você tem outros animais de estimação?" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="none">Nenhum outro animal</SelectItem>
                  <SelectItem value="dogs">Cachorro(s)</SelectItem>
                  <SelectItem value="cats">Gato(s)</SelectItem>
                  <SelectItem value="both">Cachorro(s) e gato(s)</SelectItem>
                  <SelectItem value="other">Outros animais</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reason">
                Por que você quer adotar {pet.name}? *
              </Label>
              <Textarea
                id="reason"
                placeholder="Conte-nos por que você tem interesse em adotar este animal de estimação..."
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                rows={3}
                maxLength={450}
              />
            </div>

            <div>
              <Label htmlFor="references">Referências (opcional)</Label>
              <Textarea
                id="references"
                placeholder="Por favor, forneça informações para referências (veterinário, experiência anterior com animais de estimação, etc.)..."
                value={formData.references}
                onChange={(e) =>
                  handleInputChange("references", e.target.value)
                }
                rows={3}
                maxLength={450}
              />
            </div>

            <div>
              <Label htmlFor="additionalInfo">
                Informações adicionais (opcional)
              </Label>
              <Textarea
                id="additionalInfo"
                placeholder="Qualquer informação adicional que você queira compartilhar..."
                value={formData.additionalInfo}
                onChange={(e) =>
                  handleInputChange("additionalInfo", e.target.value)
                }
                rows={3}
                maxLength={450}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Link href={`/dashboard/pets/${pet._id}`}>
                <Button variant="outline">Cancelar</Button>
              </Link>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 size-4 animate-spin rounded-full border-b-2 border-white"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 size-4" />
                    Enviar solicitação
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
