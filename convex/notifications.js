import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUnreadCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_read_status", (q) =>
        q.eq("userId", args.userId).eq("isRead", false),
      )
      .collect();

    return notifications.length;
  },
});