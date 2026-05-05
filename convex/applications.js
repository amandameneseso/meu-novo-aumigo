import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createApplication = mutation({
  args: {
    petId: v.id("pets"),
    applicantId: v.id("users"),
    ownerId: v.id("users"),
    applicationData: v.object({
      experience: v.string(),
      livingSpace: v.string(),
      // workSchedule: v.string(),
      otherPets: v.string(),
      reason: v.string(),
      references: v.optional(v.string()),
      additionalInfo: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const applicationId = await ctx.db.insert("adoptionApplications", {
      ...args,
      status: "pendente",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const pet = await ctx.db.get(args.petId);
    const applicant = await ctx.db.get(args.applicantId);

    if (pet && applicant) {
      await ctx.db.insert("notifications", {
        userId: args.ownerId,
        type: "adoption_request",
        title: "Nova solicitação de adoção",
        message: `${applicant.name} se candidatou para adotar ${pet.name}.`,
        relatedId: applicationId,
        isRead: false,
        createdAt: Date.now(),
      });
    }

    return applicationId;
  },
});

export const getApplicationById = query({
  args: { id: v.id("adoptionApplications") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getApplicationsByApplicant = query({
  args: { applicantId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("adoptionApplications")
      .withIndex("by_applicant", (q) => q.eq("applicantId", args.applicantId))
      .collect();
  },
});

export const getApplicationsByOwner = query({
  args: { ownerId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("adoptionApplications")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .collect();
  },
});

export const updateApplicationStatus = mutation({
  args: {
    id: v.id("adoptionApplications"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });

    const application = await ctx.db.get(args.id);
    if (application) {
      // Se a solicitação for aprovada, marcar o pet como indisponível
      if (args.status === "aprovado") {
        await ctx.db.patch(application.petId, {
          isAvailable: false,
          updatedAt: Date.now(),
        });
      }

      const pet = await ctx.db.get(application.petId);
      if (pet) {
        let title = "Atualização na solicitação";
        let message = `Sua solicitação para adotar ${pet.name} foi atualizada para: ${args.status}.`;

        if (args.status === "aprovado") {
          title = "Solicitação aprovada! 🎉";
          message = `Parabéns! Sua solicitação para adotar ${pet.name} foi aprovada. O dono entrará em contato em breve.`;
        } else if (args.status === "rejeitado") {
          title = "Solicitação não aprovada";
          message = `Infelizmente sua solicitação para adotar ${pet.name} não foi aprovada desta vez.`;
        }

        await ctx.db.insert("notifications", {
          userId: application.applicantId,
          type: "application_update",
          title,
          message,
          relatedId: application._id,
          isRead: false,
          createdAt: Date.now(),
        });
      }
    }

    return args.id;
  },
});

export const getApplicationByPetAndApplicant = query({
  args: {
    petId: v.id("pets"),
    applicantId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const applications = await ctx.db
      .query("adoptionApplications")
      .withIndex("by_pet", (q) => q.eq("petId", args.petId))
      .collect();

    return applications.find((app) => app.applicantId === args.applicantId);
  },
});