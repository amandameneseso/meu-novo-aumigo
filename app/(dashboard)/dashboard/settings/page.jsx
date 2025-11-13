"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  // AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings,
  User,
  Bell,
  Save,
  Trash2,
  AlertTriangle,
  PawPrint,
} from "lucide-react";
import { toast } from "sonner";
import LoadingSpinner from "@/components/loading-spinner";

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    location: "",
    phone: "",
  });
  const [preferences, setPreferences] = useState({
    petType: [],
    size: [],
    age: [],
    activityLevel: "",
    livingSpace: "",
    experience: "",
  });

  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip",
  );
  const updateUser = useMutation(api.users.updateUser);
  const deleteUser = useMutation(api.users.deleteUser);

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
        phone: currentUser.phone || "",
      });

      if (currentUser.preferences) {
        setPreferences({
          petType: currentUser.preferences.petType || [],
          size: currentUser.preferences.size || [],
          age: currentUser.preferences.age || [],
          activityLevel: currentUser.preferences.activityLevel || "",
          livingSpace: currentUser.preferences.livingSpace || "",
          experience: currentUser.preferences.experience || "",
        });
      }
    }
  }, [currentUser]);

  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrefenceChange = (field, value) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayPreferenceChange = (field, value, checked) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }));
  };

  const handleSave = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      await updateUser({
        id: currentUser._id,
        ...profileData,
        preferences,
      });
      toast.success("Configurações salvas");
    } catch (error) {
      console.error("Erro ao salvar as configurações", error);
      toast.error("Não foi possível salvar as configurações. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;

    setIsDeleting(true);
    try {
      await deleteUser({ id: currentUser._id });
      toast.success("Conta excluída");
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Erro ao excluir a conta", error);
      toast.error("Não foi possível excluir a conta. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!currentUser) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          Configurações
        </h1>
        <p>Gerencie seu perfil e preferências</p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Informações do perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 size-5" />
              Informações do perfil
            </CardTitle>
            <CardDescription>
              Atualize suas informações pessoais e detalhes do perfil
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name" className="mb-2">
                  Nome completo/instituição
                </Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => handleProfileChange("name", e.target.value)}
                  placeholder="Digite seu nome completo ou instituição"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="mb-2">
                  Celular (opcional)
                </Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                  placeholder="Digite seu número de celular"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location" className="mb-2">
                Localização
              </Label>
              <Input
                id="location"
                value={profileData.location}
                onChange={(e) =>
                  handleProfileChange("location", e.target.value)
                }
                placeholder="Digite sua cidade ou região"
              />
            </div>

            <div>
              <Label htmlFor="bio" className="mb-2">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => handleProfileChange("bio", e.target.value)}
                placeholder="Conte-nos sobre você...."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferências */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PawPrint className="mr-2 size-5" />
              Preferências
            </CardTitle>
            <CardDescription>
              Defina suas preferências para receber melhores recomendações de
              pets
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* tipo */}
            <div>
              <Label className="text-base font-medium">Tipo</Label>
              <p className="mb-3 text-sm">Selecione uma ou mais opções</p>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {["cachorro", "gato", "aves", "coelho", "outros"].map(
                  (type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={preferences.petType.includes(type)}
                        onCheckedChange={(checked) =>
                          handleArrayPreferenceChange("petType", type, checked)
                        }
                      />
                      <Label htmlFor={type} className="capitalize">
                        {type}
                      </Label>
                    </div>
                  ),
                )}
              </div>
            </div>

            <Separator />

            {/* tamanho */}
            <div>
              <Label className="text-base font-medium">Tamanho</Label>
              <p className="mb-3 text-sm">Selecione uma ou mais opções</p>

              <div className="grid grid-cols-3 gap-3">
                {["pequeno", "médio", "grande"].map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={size}
                      checked={preferences.size.includes(size)}
                      onCheckedChange={(checked) =>
                        handleArrayPreferenceChange("size", size, checked)
                      }
                    />
                    <Label htmlFor={size} className="capitalize">
                      {size}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-base font-medium">Faixa etária</Label>
              <p className="mb-3 text-sm">Selecione uma ou mais opções</p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { value: "filhote", label: "Filhote (0-2 anos)" },
                  { value: "jovem", label: "Jovem (3-7 anos)" },
                  { value: "adulto", label: "Adulto (8+ anos)" },
                ].map((age) => (
                  <div key={age.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={age.value}
                      checked={preferences.age.includes(age.value)}
                      onCheckedChange={(checked) =>
                        handleArrayPreferenceChange("age", age.value, checked)
                      }
                    />
                    <Label htmlFor={age.value} className="capitalize">
                      {age.value}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Activity Level */}
              <div>
                <Label htmlFor="activityLevel" className="mb-2">
                  Nível de atividade
                </Label>
                <Select
                  value={preferences.activityLevel}
                  onValueChange={(value) =>
                    handlePrefenceChange("activityLevel", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o nível de atividade" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="none">Sem preferência</SelectItem>
                    <SelectItem value="low">
                      Baixo (animais calmos e relaxados)
                    </SelectItem>
                    <SelectItem value="medium">
                      Médio (animais moderadamente ativos)
                    </SelectItem>
                    <SelectItem value="high">
                      Alto (animais de estimação muito ativos e enérgicos)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Espaço habitacional */}
              <div>
                <Label htmlFor="livingSpace" className="mb-2">
                  Espaço habitacional
                </Label>
                <Select
                  value={preferences.livingSpace}
                  onValueChange={(value) =>
                    handlePrefenceChange("livingSpace", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o espaço habitacional" />
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
            </div>

            {/* experiência */}
            <div>
              <Label htmlFor="experience" className="mb-2">
                Sua experiência com animais de estimação
              </Label>
              <Select
                value={preferences.experience}
                onValueChange={(value) =>
                  handlePrefenceChange("experience", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione seu nível de experiência" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="first-time">
                    Dono de pet pela primeira vez
                  </SelectItem>
                  <SelectItem value="some">Pouca experiência</SelectItem>
                  <SelectItem value="experienced">Muita experiência</SelectItem>
                  <SelectItem value="professional">
                    Profissional (veterinário, treinador, etc.)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Deletar conta */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-2 size-5" />
              Deletar conta
            </CardTitle>
            <CardDescription>
              Exclua permanentemente sua conta e todos os dados associados. Esta
              ação é irreversível. Isso excluirá permanentemente sua conta,
              todos os seus animais de estimação, solicitações, mensagens e
              removerá todos os dados associados.
            </CardDescription>
          </CardHeader>

          <div className="pl-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  <Trash2 className="mr-2 size-4" />
                  {isDeleting ? "Deletando..." : "Deletar minha conta"}
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                  {/* <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      you account and remove all your data from our servers,
                      including:
                      <ul className="mt-2 list-inside list-disc space-y-1">
                        <li>Your profile and personal information</li>
                        <li>All pets you have listed for adoption</li>
                        <li>All adoption applications (sent and received)</li>
                        <li>All messages and conversations</li>
                        <li>All notifications and preferences</li>
                      </ul>
                    </AlertDialogDescription> */}
                  <div className="text-muted-foreground text-sm">
                    Esta ação é irreversível. Ela excluirá permanentemente sua conta e removerá todos os seus dados de nossos servidores, incluindo:
                    <ul className="mt-2 list-inside list-disc space-y-1">
                      <li>Seu perfil e informações pessoais;</li>
                      <li>Todos os animais que você adicionou para adoção;</li>
                      <li>Todas as solicitações de adoção (enviados e recebidos);</li>
                      <li>Todas as mensagens e conversas;</li>
                      <li>Todas as notificações e preferências.</li>
                    </ul>
                  </div>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Sim, deletar minha conta
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>

        {/* Botão salvar */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <div className="mr-2 size-4 animate-spin rounded-full border-b-2 border-white"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Salvar
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
