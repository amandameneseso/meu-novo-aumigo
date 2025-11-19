"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import PetCard from "@/components/pet-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/loading-spinner";

export default function DiscoverPage() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    breed: "",
    size: "",
    age: "",
    gender: "",
    activityLevel: "",
    goodWithKids: "",
    goodWithPets: "",
    isHouseTrained: "",
    isCastrado: "",
    location: "",
  });

  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip",
  );
  const allPets = useQuery(api.pets.getAllPets);
  const filteredPets = useQuery(api.pets.getFilteredPets, {
    searchTerm,
    filters,
  });
  const pets = filteredPets || allPets || [];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? "" : value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      breed: "",
      size: "",
      age: "",
      gender: "",
      activityLevel: "",
      goodWithKids: "",
      goodWithPets: "",
      isHouseTrained: "",
      isCastrado: "",
      location: "",
    });
    setSearchTerm("");
  };

  const activeFiltersCount =
    Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0);

  if (!currentUser) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Encontrar pets</h1>
        <p>
          Encontre o companheiro perfeito entre todos os animais de estimação
          disponíveis.
        </p>
      </div>

      {/* busca e filtros */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="size-5" />
              <span>Pesquisar e filtrar</span>

              {activeFiltersCount > 0 && (
                <Badge variant="secondary">{activeFiltersCount} ativo(s)</Badge>
              )}
            </div>

            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="mr-2 size-4" />
                Limpar filtros
              </Button>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* barra de pesquisa */}

          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 !-translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Pesquise por nome, raça ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* grid de filtros */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5">
            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700">
                Tipo
              </Label>
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange("type", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="cachorro">Cachorro</SelectItem>
                  <SelectItem value="gato">Gato</SelectItem>
                  <SelectItem value="aves">Aves</SelectItem>
                  <SelectItem value="coelho">Coelho</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700">
                Tamanho
              </Label>
              <Select
                value={filters.size}
                onValueChange={(value) => handleFilterChange("size", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Pequeno">Pequeno</SelectItem>
                  <SelectItem value="Médio">Médio</SelectItem>
                  <SelectItem value="Grande">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700">
                Idade
              </Label>
              <Select
                value={filters.age}
                onValueChange={(value) => handleFilterChange("age", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="filhote">Filhote (0-2 anos)</SelectItem>
                  <SelectItem value="jovem">Jovem (3-7 anos)</SelectItem>
                  <SelectItem value="adulto">
                    Adulto (8 anos ou mais)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700">
                Gênero
              </Label>
              <Select
                value={filters.gender}
                onValueChange={(value) => handleFilterChange("gender", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Macho">Macho</SelectItem>
                  <SelectItem value="Fêmea">Fêmea</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700">
                Nível de atividade
              </Label>
              <Select
                value={filters.activityLevel}
                onValueChange={(value) =>
                  handleFilterChange("activityLevel", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
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

            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700">
                Sociável com crianças
              </Label>
              <Select
                value={filters.goodWithKids}
                onValueChange={(value) =>
                  handleFilterChange("goodWithKids", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sem preferência" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">Sem preferência</SelectItem>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700">
                Sociável com animais
              </Label>
              <Select
                value={filters.goodWithPets}
                onValueChange={(value) =>
                  handleFilterChange("goodWithPets", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sem preferência" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">Sem preferência</SelectItem>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700">
                Adestrado
              </Label>
              <Select
                value={filters.isHouseTrained}
                onValueChange={(value) =>
                  handleFilterChange("isHouseTrained", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sem preferência" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">Sem preferência</SelectItem>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700">
                Castrado
              </Label>
              <Select
                value={filters.isCastrado}
                onValueChange={(value) =>
                  handleFilterChange("isCastrado", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sem preferência" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">Sem preferência</SelectItem>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700">
                Localização
              </Label>
              <Input
                placeholder="Digite a cidade"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* seção de resultados */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {pets.length} {pets.length === 1 ? "pet encontrado" : "pets encontrados"}
          </h2>
        </div>

        {pets.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {pets.map((pet) => (
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
              <Search className="mx-auto mb-4 size-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Nenhum pet encontrado
              </h3>
              <p className="mb-4">
                Tente ajustar seus critérios de busca ou filtros para encontrar mais animais de estimação.
              </p>

              <Button onClick={clearFilters}>Limpar filtros</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
