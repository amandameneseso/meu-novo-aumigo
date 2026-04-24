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
      case "aceita":
        return <Check className="size-4 text-green-500" />;
      case "rejeitada":
        return <X className="size-4 text-red-500" />;
      default:
        return <Clock className="size-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "aceita":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejeitada":
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
        <p>Gerencie seus pedidos de adoção</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex flex-row flex-wrap gap-2 sm:gap-4">
          <button
            onClick={() => setActiveTab("sent")}
            className={`rounded-lg px-4 py-2 font-medium transition-colors ${activeTab === "sent" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Solicitações enviadas ({sentApplications?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("received")}
            className={`rounded-lg px-4 py-2 font-medium transition-colors ${activeTab === "received" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Solicitações recebidas ({receivedApplications?.length || 0})
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Filter className="mr-2 size-5" />
            Filtros
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Buscar solicitações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">Status</SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="aceita">Aceita</SelectItem>
                  <SelectItem value="rejeitada">Rejeitada</SelectItem>
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