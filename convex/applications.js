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
