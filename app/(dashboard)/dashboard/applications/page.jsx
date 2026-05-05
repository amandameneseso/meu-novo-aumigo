"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import LoadingSpinner from "@/components/loading-spinner";
import Link from "next/link";
import {
  Calendar,
  Search,
  Filter,
  PawPrint,
  Clock,
  Check,
  X,
} from "lucide-react";
import ApplicationCard from "@/components/application-card";

export default function ApplicationsPage() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("sent");

  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip",
  );
  const sentApplications = useQuery(
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
      case "aprovado":
        return <Check className="size-4 text-green-500" />;
      case "rejeitado":
        return <X className="size-4 text-red-500" />;
      default:
        return <Clock className="size-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "aprovado":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejeitado":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filterApplications = (applications) => {
    if (!applications) return [];

    let filtered = applications;

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter((app) =>
        app._id.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return filtered;
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:px-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          Solicitações
        </h1>
        <p className="text-gray-600">Gerencie seus pedidos de adoção e acompanhe o status.</p>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("sent")}
            className={`pb-4 text-sm font-semibold transition-all relative ${
              activeTab === "sent" 
                ? "text-orange-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Solicitações enviadas
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {sentApplications?.length || 0}
            </span>
            {activeTab === "sent" && (
              <div className="absolute bottom-0 left-0 h-0.5 w-full bg-orange-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("received")}
            className={`pb-4 text-sm font-semibold transition-all relative ${
              activeTab === "received" 
                ? "text-orange-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Solicitações recebidas
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {receivedApplications?.length || 0}
            </span>
            {activeTab === "received" && (
              <div className="absolute bottom-0 left-0 h-0.5 w-full bg-orange-500" />
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg font-medium">
            <Filter className="mr-2 size-4" />
            Filtrar por
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Buscar por ID ou nome do pet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <span>{statusFilter === "all" ? "Todos os status" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="rejeitado">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {activeTab === "sent" ? (
          filterApplications(sentApplications).length > 0 ? (
            filterApplications(sentApplications).map((application) => (
              <ApplicationCard
                key={application._id}
                application={application}
                type="sent"
                getStatusIcon={() => getStatusIcon(application.status)}
                getStatusColor={() => getStatusColor(application.status)}
              />
            ))
          ) : (
            <Card className="py-12 text-center">
              <CardContent>
                <PawPrint className="mx-auto mb-4 size-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Ainda não há solicitações.
                </h3>
                <p className="mb-4">
                  Comece a navegar pelos animais de estimação e envie seu primeiro pedido de adoção.
                </p>

                <Link href="/dashboard/discover">
                  <Button>Ver pets</Button>
                </Link>
              </CardContent>
            </Card>
          )
        ) : filterApplications(receivedApplications).length > 0 ? (
          filterApplications(receivedApplications).map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              type="received"
              getStatusIcon={() => getStatusIcon(application.status)}
              getStatusColor={() => getStatusColor(application.status)}
            />
          ))
        ) : (
          <Card className="py-12 text-center">
            <CardContent>
              <PawPrint className="mx-auto mb-4 size-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Você ainda não recebeu solicitações.
              </h3>
              <p className="mb-4">
                Quando alguém enviar uma solicitação para adotar seu pet, ela aparecerá aqui.
              </p>

              <Link href="/dashboard/discover">
                <Button>Ver pets</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}