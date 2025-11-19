"use client";

import { useEffect, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { UploadButton } from "@uploadthing/react";
import { PawPrint, Save, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LoadingSpinner from "@/components/loading-spinner";
import { toast } from "sonner";

export default function EditPetPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [petData, setPetData] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    size: "",
    gender: "",
    description: "",
    images: [],
    activityLevel: "",
    goodWithKids: false,
    goodWithPets: false,
    isHouseTrained: false,
    isCastrado: false,
    medicalInfo: "",
    adoptionFee: "",
    location: "",
  });

  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip",
  );
  const pet = useQuery(api.pets.getPetById, { id: id });
  const updatePet = useMutation(api.pets.updatePet);
  const deletePet = useMutation(api.pets.deletePet);

  useEffect(() => {
    if (pet) {
      setPetData({
        name: pet.name || "",
        type: pet.type || "",
        breed: pet.breed || "",
        age: parseInt(pet.age) || "",
        size: pet.size || "",
        gender: pet.gender || "",
        description: pet.description || "",
        images: pet.images || [],
        activityLevel: pet.activityLevel || "",
        goodWithKids: pet.goodWithKids || false,
        goodWithPets: pet.goodWithPets || false,
        isHouseTrained: pet.isHouseTrained || false,
        isCastrado: pet.isCastrado || false,
        medicalInfo: pet.medicalInfo || "",
        adoptionFee: pet.adoptionFee?.toString() || "",
        location: pet.location || "",
        isAvailable: pet.isAvailable !== undefined ? pet.isAvailable : true,
      });
    }
  }, [pet]);

  const handleInputChange = (field, value) => {
    setPetData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (field, checked) => {
    setPetData((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser || !pet) {
      toast.error("Informações obrigatórias ausentes");
      return;
    }

    // Verifica se o usuário possui este animal de estimação
    if (pet.ownerId !== currentUser._id) {
      toast.error("Você só pode editar seus próprios pets.");
      return;
    }

    // Validar campos obrigatórios
    const requiredFields = [
      "name",
      "type",
      "breed",
      "age",
      "size",
      "gender",
      "description",
      "activityLevel",
      "location",
    ];
    const missingFields = requiredFields.filter((field) => !petData[field]);

    if (missingFields.length > 0) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (petData.images.length === 0) {
      toast.error("Por favor, envie pelo menos uma imagem.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updatePet({
        id: pet._id,
        name: petData.name,
        type: petData.type,
        breed: petData.breed,
        age: parseInt(petData.age),
        size: petData.size,
        gender: petData.gender,
        description: petData.description,
        images: petData.images,
        activityLevel: petData.activityLevel,
        goodWithKids: petData.goodWithKids,
        goodWithPets: petData.goodWithPets,
        isHouseTrained: petData.isHouseTrained,
        isCastrado: petData.isCastrado,
        medicalInfo: petData.medicalInfo,
        adoptionFee: petData.adoptionFee
          ? parseFloat(petData.adoptionFee)
          : undefined,
        location: petData.location,
        isAvailable: petData.isAvailable,
      });

      toast.success("Pet atualizado.");
      router.push(`/dashboard/pets/${pet._id}`);
    } catch (error) {
      console.error("Erro ao atualizar pet", error);
      toast.error("Falha ao atualizar o pet. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!pet || !currentUser) return;

    if (pet.ownerId !== currentUser._id) {
      toast.error("Você só pode excluir seus próprios pets.");
      return;
    }

    if (
      !confirm(
        "Tem certeza de que deseja excluir este pet? Esta ação não pode ser desfeita.",
      )
    ) {
      return;
    }

    try {
      await deletePet({ id: pet._id });
      toast.success("Pet deletado.");
      router.push("/dashboard/profile");
    } catch (error) {
      console.error("Erro ao deletar pet.", error);
      toast.error("Falha ao deletar o pet. Tente novamente.");
    }
  };

  if (!currentUser || !pet) return <LoadingSpinner />;

  if (pet.ownerId !== currentUser._id) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="mb-2 text-xl font-semibold">Acesso negado.</h2>
            <p className="mb-4">Você só pode editar seus próprios pets.</p>

            <Link href="/dashboard/profile">
              <Button>Ir para o perfil</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
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
            Atualizar informações de {pet.name}
          </h1>
          <p>Atualize as informações sobre seu pet</p>
        </div>
      </div>

      {/* formulário */}
      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
          <CardDescription>
            Forneça informações detalhadas sobre o animal de estimação para
            ajudar os potenciais adotantes.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* informações básicas */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={petData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Digite o nome do pet"
                />
              </div>

              <div>
                <Label htmlFor="type">Tipo *</Label>
                <Select
                  value={petData.type}
                  onValueChange={(value) => handleInputChange("type", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tipo de pet" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="cachorro">Cachorro</SelectItem>
                    <SelectItem value="gato">Gato</SelectItem>
                    <SelectItem value="aves">Aves</SelectItem>
                    <SelectItem value="coelho">Coelho</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="breed">Raça *</Label>
                <Input
                  id="breed"
                  value={petData.breed}
                  onChange={(e) => handleInputChange("breed", e.target.value)}
                  placeholder="Digite a raça"
                />
              </div>

              <div>
                <Label htmlFor="age">Idade *</Label>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  max="30"
                  value={petData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="Idade em anos"
                />
              </div>

              <div>
                <Label htmlFor="gender">Gênero *</Label>
                <Select
                  value={petData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Macho">Macho</SelectItem>
                    <SelectItem value="Fêmea">Fêmea</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="size">Tamanho *</Label>
                <Select
                  value={petData.size}
                  onValueChange={(value) => handleInputChange("size", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tamanho" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Pequeno">Pequeno</SelectItem>
                    <SelectItem value="Médio">Médio</SelectItem>
                    <SelectItem value="Grande">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="activityLevel">Nível de atividade *</Label>
                <Select
                  value={petData.activityLevel}
                  onValueChange={(value) =>
                    handleInputChange("activityLevel", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o nível de atividade" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Baixo">
                      Baixo (animais calmos e relaxados)
                    </SelectItem>
                    <SelectItem value="Médio">
                      Médio (animais moderadamente ativos)
                    </SelectItem>
                    <SelectItem value="Alto">
                      Alto (animais de estimação muito ativos e enérgicos)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Localização */}
            <div>
              <Label htmlFor="location">Localização *</Label>
              <Input
                id="location"
                value={petData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Digite a cidade ou região"
              />
            </div>

            {/* Descrição */}
            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={petData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Descreva a personalidade, os hábitos e quaisquer necessidades especiais do animal de estimação..."
                rows={4}
              />
            </div>

            {/* Imagens */}
            <div>
              <Label>Imagens do animal de estimação *</Label>
              <div className="mt-2">
                <UploadButton
                  endpoint="petImages"
                  onClientUploadComplete={(res) => {
                    const urls = res.map((file) => file.ufsUrl);
                    setPetData((prev) => ({
                      ...prev,
                      images: [...prev.images, ...urls],
                    }));
                    toast.success("Imagens carregadas com sucesso!");
                  }}
                  onUploadError={(error) => {
                    toast.error("Falha no upload:", {
                      description: error.message,
                    });
                  }}
                />

                {petData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {petData.images.map((url, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={url}
                          alt={`Imagem ${index + 1}`}
                          width={200}
                          height={200}
                          className="h-40 w-64 rounded-lg object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setPetData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index),
                            }));
                          }}
                        >
                          <X className="size-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Características */}
            <div>
              <Label className="text-base font-medium">Características</Label>
              <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="goodWithKids"
                    checked={petData.goodWithKids}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("goodWithKids", checked)
                    }
                  />
                  <Label htmlFor="goodWithKids">Sociável com crianças</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="goodWithPets"
                    checked={petData.goodWithPets}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("goodWithPets", checked)
                    }
                  />
                  <Label htmlFor="goodWithPets">Sociável com animais</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isHouseTrained"
                    checked={petData.isHouseTrained}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("isHouseTrained", checked)
                    }
                  />
                  <Label htmlFor="isHouseTrained">Adestrado</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isCastrado"
                    checked={petData.isCastrado}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("isCastrado", checked)
                    }
                  />
                  <Label htmlFor="isCastrado">Castrado</Label>
                </div>
              </div>
            </div>

            {/* informações opcionais */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="adoptionFee">Taxa de adoção (opcional)</Label>
                <Input
                  id="adoptionFee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={petData.adoptionFee}
                  onChange={(e) =>
                    handleInputChange("adoptionFee", e.target.value)
                  }
                  placeholder="Digite a taxa de adoção"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="medicalInfo">
                Informações médicas (opcional)
              </Label>
              <Textarea
                id="medicalInfo"
                value={petData.medicalInfo}
                onChange={(e) =>
                  handleInputChange("medicalInfo", e.target.value)
                }
                placeholder="Quaisquer condições médicas, vacinas ou necessidades especiais de cuidados..."
                rows={3}
              />
            </div>

            {/* botão enviar */}
            {/* <div className="flex justify-end space-x-4">
              <Link href="/dashboard/profile">
                <Button variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 size-4 animate-spin rounded-full border-b-2 border-white"></div>
                    Atualizando pet...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 size-4" />
                    Atualizar pet
                  </>
                )}
              </Button>
            </div> */}
            <div className="mt-6 flex justify-between">
              {/* Botão deletar */}
              <Button
                type="button"
                // variant="destructive"
                onClick={handleDelete}
              >
                <X className="mr-2 size-4" />
                Deletar pet
              </Button>

              {/* Botões salvar / cancelar */}
              <div className="space-x-4">
                <Link href="/dashboard/profile">
                  <Button variant="outline">Cancelar</Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 size-4 animate-spin rounded-full border-b-2 border-white"></div>
                      Atualizando pet...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 size-4" />
                      Atualizar pet
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
