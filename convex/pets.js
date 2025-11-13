import { query } from "./_generated/server";
import { v } from "convex/values";

export const getRecommendedPets = query({
  args: {
    userId: v.id("users"),
    preferences: v.optional(
      v.object({
        petType: v.optional(v.array(v.string())),
        size: v.optional(v.array(v.string())),
        age: v.optional(v.array(v.string())),
        activityLevel: v.optional(v.string()),
        livingSpace: v.optional(v.string()),
        experience: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    let pets = await ctx.db
      .query("pets")
      .withIndex("by_availability", (q) => q.eq("isAvailable", true))
      .collect();

    // filtrar animais de estimação pertencentes ao usuário
    pets = pets.filter((pet) => pet.ownerId !== args.userId);

    // se não houver preferências, retornar todos os animais disponíveis
    if (!args.preferences) {
      return pets.slice(0, 12);
    }

    const { petType, size, age, activityLevel } = args.preferences;

    if (petType && petType.length > 0) {
      pets = pets.filter((pet) => petType.includes(pet.type));
    }

    if (size && size.length > 0) {
      pets = pets.filter((pet) => size.includes(pet.type));
    }

    if (activityLevel) {
      pets = pets.filter((pet) => pet.activityLevel === activityLevel);
    }

    if (age && age.length > 0) {
      pets = pets.filter((pet) => {
        return age.some((ageRange) => {
          switch (ageRange) {
            case "filhote":
              return pet.age <= 2;
            case "jovem":
              return pet.age >= 3 && pet.age <= 7;
            case "adulto":
              return pet.age >= 8;
            default:
              return true;
          }
        });
      });
    }

    // se não houver preferências, retornar animais aleatórios
    if (pets.length === 0) {
      pets = await ctx.db
        .query("pets")
        .withIndex("by_availability", (q) => q.eq("isAvailable", true))
        .collect();
      pets = pets.filter((pet) => pet.ownerId !== args.userId);
    }

    return pets.slice(0, 12);
  },
});

export const getPetsByOwner = query({
  args: { ownerId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pets")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .collect();
  },
});
