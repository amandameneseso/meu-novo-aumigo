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
import LoadingSpinner from "@/components/loading-spinner";

export default function AdoptPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    experience: "",
    livingSpace: "",
    workSchedule: "",
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
      toast.error("Missing required information");
      return;
    }

    // Validate required fields
    const requiredFields = [
      "experience",
      "livingSpace",
      "workSchedule",
      "otherPets",
      "reason",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field].trim(),
    );

    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create application
      const applicationId = await createApplication({
        petId: pet._id,
        applicantId: currentUser._id,
        ownerId: pet.ownerId,
        applicationData: formData,
      });

      // Create notification for the owner
      await createNotification({
        userId: pet.ownerId,
        type: "adoption_request",
        title: "New Adoption Application",
        message: `${currentUser.name} want to adopt ${pet.name}`,
        relatedId: applicationId,
      });

      toast.success("Application submitted successfully!");
      router.push(`/dashboard/pets/${pet._id}`);
    } catch (error) {
      console.error("Error submitting application", error);
      toast.error("Failed to submit application. Please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!pet || !currentUser) {
    return <LoadingSpinner />;
  }

  return <div>Adopt</div>;
}
