"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import PetCard from "@/components/pet-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, Filter, X, Heart, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import LoadingSpinner from "@/components/loading-spinner";

export default function DiscoverPage() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
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
    <div className="min-h-screen bg-background-50">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-white" style={{ maxHeight: "420px" }}>
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Animais esperando adocao"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 via-neutral-900/50 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="max-w-xl">
            <span className="mb-4 inline-flex items-center gap-1 rounded-full border border-primary-400/30 bg-primary-500/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary-200">
              <Heart className="h-3 w-3" fill="currentColor" />
              Encontre seu par perfeito
            </span>
            <h1 className="mb-4 font-heading text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl" style={{ letterSpacing: "-0.02em" }}>
              Abra seu coracao,<br />Abra sua casa
            </h1>
            <p className="mb-8 text-lg font-light text-neutral-200">
              Navegue pela nossa familia de animais esperando por um lar. Cada um deles tem uma historia - e a sua esta prestes a comecar.
            </p>
            {/* Search Bar */}
            <div className="flex max-w-lg overflow-hidden rounded-[var(--radius-small)] bg-white shadow-[var(--shadow-custom)]">
              <div className="flex items-center pl-4 text-neutral-400">
                <Search className="h-5 w-5" />
              </div>
              <Input
                type="text"
                placeholder="Buscar por nome, raca ou tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border-0 bg-transparent px-4 py-3.5 text-sm font-medium text-neutral-900 placeholder-neutral-400 focus-visible:ring-0"
              />
              <Button className="rounded-none bg-primary-500 px-6 text-sm font-semibold text-white hover:bg-primary-600">
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Sidebar + Grid */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-start gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden w-72 flex-shrink-0 flex-col gap-6 lg:flex">
            {/* Results count + clear */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-500">
                <span className="font-bold text-neutral-900">{pets.length}</span> animais disponiveis
              </p>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-primary-600 hover:underline"
                >
                  Limpar tudo
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="rounded-[var(--radius-large)] border border-neutral-100 bg-white p-5 shadow-[0_4px_24px_-4px_rgba(30,30,30,0.08)]">
              <h3 className="mb-3 font-heading text-base font-bold text-neutral-900">Ordenar por</h3>
              <Select defaultValue="newest">
                <SelectTrigger className="w-full border-neutral-200 bg-white">
                  <SelectValue placeholder="Mais recentes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mais recentes</SelectItem>
                  <SelectItem value="oldest">Mais antigos</SelectItem>
                  <SelectItem value="name">Nome A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tipo/Species */}
            <div className="rounded-[var(--radius-large)] border border-neutral-100 bg-white p-5 shadow-[0_4px_24px_-4px_rgba(30,30,30,0.08)]">
              <h3 className="mb-4 font-heading text-base font-bold text-neutral-900">Especie</h3>
              <div className="space-y-2.5">
                {[
                  { label: "Cachorros", value: "cachorro", count: pets.filter(p => p.type === "cachorro").length },
                  { label: "Gatos", value: "gato", count: pets.filter(p => p.type === "gato").length },
                  { label: "Aves", value: "aves", count: pets.filter(p => p.type === "aves").length },
                  { label: "Coelhos", value: "coelho", count: pets.filter(p => p.type === "coelho").length },
                ].map((item) => (
                  <label key={item.value} className="group flex cursor-pointer items-center gap-3">
                    <Checkbox
                      checked={filters.type === item.value}
                      onCheckedChange={(checked) => handleFilterChange("type", checked ? item.value : "all")}
                      className="h-4 w-4 accent-primary-500"
                    />
                    <span className="text-sm text-neutral-700 group-hover:text-neutral-900">{item.label}</span>
                    <span className="ml-auto rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-400">
                      {item.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Idade */}
            <div className="rounded-[var(--radius-large)] border border-neutral-100 bg-white p-5 shadow-[0_4px_24px_-4px_rgba(30,30,30,0.08)]">
              <h3 className="mb-4 font-heading text-base font-bold text-neutral-900">Idade</h3>
              <div className="space-y-2.5">
                {[
                  { label: "Filhote (0-2 anos)", value: "filhote" },
                  { label: "Jovem (3-7 anos)", value: "jovem" },
                  { label: "Adulto (8+ anos)", value: "adulto" },
                ].map((item) => (
                  <label key={item.value} className="group flex cursor-pointer items-center gap-3">
                    <Checkbox
                      checked={filters.age === item.value}
                      onCheckedChange={(checked) => handleFilterChange("age", checked ? item.value : "all")}
                      className="h-4 w-4 accent-primary-500"
                    />
                    <span className="text-sm text-neutral-700 group-hover:text-neutral-900">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tamanho */}
            <div className="rounded-[var(--radius-large)] border border-neutral-100 bg-white p-5 shadow-[0_4px_24px_-4px_rgba(30,30,30,0.08)]">
              <h3 className="mb-4 font-heading text-base font-bold text-neutral-900">Tamanho</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Pequeno", "Medio", "Grande"].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFilterChange("size", filters.size === size ? "all" : size)}
                    className={`rounded-[var(--radius-small)] border px-3 py-2 text-xs font-semibold transition-all ${
                      filters.size === size
                        ? "border-primary-400 bg-primary-50 text-primary-600"
                        : "border-neutral-200 text-neutral-600 hover:border-primary-400 hover:text-primary-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Genero */}
            <div className="rounded-[var(--radius-large)] border border-neutral-100 bg-white p-5 shadow-[0_4px_24px_-4px_rgba(30,30,30,0.08)]">
              <h3 className="mb-4 font-heading text-base font-bold text-neutral-900">Genero</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => handleFilterChange("gender", filters.gender === "Macho" ? "all" : "Macho")}
                  className={`flex-1 rounded-[var(--radius-small)] border py-2.5 text-sm font-semibold transition-all ${
                    filters.gender === "Macho"
                      ? "border-primary-400 bg-primary-50 text-primary-600"
                      : "border-neutral-200 text-neutral-600 hover:border-primary-400"
                  }`}
                >
                  Macho
                </button>
                <button
                  onClick={() => handleFilterChange("gender", filters.gender === "Femea" ? "all" : "Femea")}
                  className={`flex-1 rounded-[var(--radius-small)] border py-2.5 text-sm font-semibold transition-all ${
                    filters.gender === "Femea"
                      ? "border-primary-400 bg-primary-50 text-primary-600"
                      : "border-neutral-200 text-neutral-600 hover:border-primary-400"
                  }`}
                >
                  Femea
                </button>
              </div>
            </div>

            {/* Sociavel com */}
            <div className="rounded-[var(--radius-large)] border border-neutral-100 bg-white p-5 shadow-[0_4px_24px_-4px_rgba(30,30,30,0.08)]">
              <h3 className="mb-4 font-heading text-base font-bold text-neutral-900">Sociavel com</h3>
              <div className="space-y-2.5">
                <label className="group flex cursor-pointer items-center gap-3">
                  <Checkbox
                    checked={filters.goodWithKids === "true"}
                    onCheckedChange={(checked) => handleFilterChange("goodWithKids", checked ? "true" : "all")}
                    className="h-4 w-4 accent-primary-500"
                  />
                  <span className="text-sm text-neutral-700 group-hover:text-neutral-900">Criancas</span>
                </label>
                <label className="group flex cursor-pointer items-center gap-3">
                  <Checkbox
                    checked={filters.goodWithPets === "true"}
                    onCheckedChange={(checked) => handleFilterChange("goodWithPets", checked ? "true" : "all")}
                    className="h-4 w-4 accent-primary-500"
                  />
                  <span className="text-sm text-neutral-700 group-hover:text-neutral-900">Outros animais</span>
                </label>
              </div>
            </div>

            {/* Castrado */}
            <div className="rounded-[var(--radius-large)] border border-neutral-100 bg-white p-5 shadow-[0_4px_24px_-4px_rgba(30,30,30,0.08)]">
              <h3 className="mb-4 font-heading text-base font-bold text-neutral-900">Castrado</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => handleFilterChange("isCastrado", filters.isCastrado === "true" ? "all" : "true")}
                  className={`flex-1 rounded-[var(--radius-small)] border py-2.5 text-sm font-semibold transition-all ${
                    filters.isCastrado === "true"
                      ? "border-primary-400 bg-primary-50 text-primary-600"
                      : "border-neutral-200 text-neutral-600 hover:border-primary-400"
                  }`}
                >
                  Sim
                </button>
                <button
                  onClick={() => handleFilterChange("isCastrado", filters.isCastrado === "false" ? "all" : "false")}
                  className={`flex-1 rounded-[var(--radius-small)] border py-2.5 text-sm font-semibold transition-all ${
                    filters.isCastrado === "false"
                      ? "border-primary-400 bg-primary-50 text-primary-600"
                      : "border-neutral-200 text-neutral-600 hover:border-primary-400"
                  }`}
                >
                  Nao
                </button>
              </div>
            </div>

            {/* Localizacao */}
            <div className="rounded-[var(--radius-large)] border border-neutral-100 bg-white p-5 shadow-[0_4px_24px_-4px_rgba(30,30,30,0.08)]">
              <h3 className="mb-4 font-heading text-base font-bold text-neutral-900">Localizacao</h3>
              <Input
                placeholder="Digite a cidade..."
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="border-neutral-200"
              />
            </div>

            {/* Apply Filters Button */}
            <Button
              onClick={clearFilters}
              className="w-full transform rounded-[var(--radius-small)] bg-primary-500 py-3.5 font-bold text-white shadow-[var(--shadow-custom)] transition-all hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-[var(--shadow-custom-hover)]"
            >
              Limpar Filtros
            </Button>
          </aside>

          {/* Animal Grid */}
          <div className="min-w-0 flex-1">
            {/* Top bar: count + view toggle + mobile filter btn */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-neutral-500">
                  Mostrando <span className="font-bold text-neutral-900">{pets.length}</span> animais
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowMobileFilters(true)}
                  className="flex items-center gap-2 border-neutral-200 bg-white lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <span className="rounded-full bg-primary-500 px-1.5 py-0.5 text-xs font-bold text-white">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
                {/* View Toggle */}
                <div className="hidden overflow-hidden rounded-[var(--radius-small)] border border-neutral-200 sm:flex">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-colors ${
                      viewMode === "grid"
                        ? "bg-primary-500 text-white"
                        : "bg-white text-neutral-400 hover:text-neutral-700"
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-colors ${
                      viewMode === "list"
                        ? "bg-primary-500 text-white"
                        : "bg-white text-neutral-400 hover:text-neutral-700"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid View */}
            {pets.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              }`}>
                {pets.map((pet, index) => (
                  <div
                    key={pet._id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <PetCard pet={pet} currentUserId={currentUser._id} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[var(--radius-large)] border border-neutral-100 bg-white py-16 text-center shadow-[0_4px_24px_-4px_rgba(30,30,30,0.08)]">
                <Search className="mx-auto mb-4 h-12 w-12 text-neutral-300" />
                <h3 className="mb-2 font-heading text-lg font-bold text-neutral-900">
                  Nenhum pet encontrado
                </h3>
                <p className="mb-6 text-neutral-500">
                  Tente ajustar seus criterios de busca ou filtros para encontrar mais animais.
                </p>
                <Button
                  onClick={clearFilters}
                  className="bg-primary-500 text-white hover:bg-primary-600"
                >
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-background-50 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-neutral-900">Filtros</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileFilters(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Mobile Filter Content - Same as sidebar */}
              <div className="rounded-[var(--radius-large)] border border-neutral-100 bg-white p-5">
                <h3 className="mb-4 font-heading text-base font-bold text-neutral-900">Especie</h3>
                <div className="space-y-2.5">
                  {[
                    { label: "Cachorros", value: "cachorro" },
                    { label: "Gatos", value: "gato" },
                    { label: "Aves", value: "aves" },
                    { label: "Coelhos", value: "coelho" },
                  ].map((item) => (
                    <label key={item.value} className="group flex cursor-pointer items-center gap-3">
                      <Checkbox
                        checked={filters.type === item.value}
                        onCheckedChange={(checked) => handleFilterChange("type", checked ? item.value : "all")}
                      />
                      <span className="text-sm text-neutral-700">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-[var(--radius-large)] border border-neutral-100 bg-white p-5">
                <h3 className="mb-4 font-heading text-base font-bold text-neutral-900">Idade</h3>
                <div className="space-y-2.5">
                  {[
                    { label: "Filhote (0-2 anos)", value: "filhote" },
                    { label: "Jovem (3-7 anos)", value: "jovem" },
                    { label: "Adulto (8+ anos)", value: "adulto" },
                  ].map((item) => (
                    <label key={item.value} className="group flex cursor-pointer items-center gap-3">
                      <Checkbox
                        checked={filters.age === item.value}
                        onCheckedChange={(checked) => handleFilterChange("age", checked ? item.value : "all")}
                      />
                      <span className="text-sm text-neutral-700">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-[var(--radius-large)] border border-neutral-100 bg-white p-5">
                <h3 className="mb-4 font-heading text-base font-bold text-neutral-900">Genero</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleFilterChange("gender", filters.gender === "Macho" ? "all" : "Macho")}
                    className={`flex-1 rounded-[var(--radius-small)] border py-2.5 text-sm font-semibold transition-all ${
                      filters.gender === "Macho"
                        ? "border-primary-400 bg-primary-50 text-primary-600"
                        : "border-neutral-200 text-neutral-600"
                    }`}
                  >
                    Macho
                  </button>
                  <button
                    onClick={() => handleFilterChange("gender", filters.gender === "Femea" ? "all" : "Femea")}
                    className={`flex-1 rounded-[var(--radius-small)] border py-2.5 text-sm font-semibold transition-all ${
                      filters.gender === "Femea"
                        ? "border-primary-400 bg-primary-50 text-primary-600"
                        : "border-neutral-200 text-neutral-600"
                    }`}
                  >
                    Femea
                  </button>
                </div>
              </div>

              <div className="rounded-[var(--radius-large)] border border-neutral-100 bg-white p-5">
                <h3 className="mb-4 font-heading text-base font-bold text-neutral-900">Tamanho</h3>
                <div className="grid grid-cols-3 gap-2">
                  {["Pequeno", "Medio", "Grande"].map((size) => (
                    <button
                      key={size}
                      onClick={() => handleFilterChange("size", filters.size === size ? "all" : size)}
                      className={`rounded-[var(--radius-small)] border px-3 py-2 text-xs font-semibold transition-all ${
                        filters.size === size
                          ? "border-primary-400 bg-primary-50 text-primary-600"
                          : "border-neutral-200 text-neutral-600"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[var(--radius-large)] border border-neutral-100 bg-white p-5">
                <h3 className="mb-4 font-heading text-base font-bold text-neutral-900">Localizacao</h3>
                <Input
                  placeholder="Digite a cidade..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  className="border-neutral-200"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex-1"
                >
                  Limpar
                </Button>
                <Button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 bg-primary-500 text-white hover:bg-primary-600"
                >
                  Aplicar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
