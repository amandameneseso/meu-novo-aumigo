import { v } from "convex/values";
import { query } from "./_generated/server";

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