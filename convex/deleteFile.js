import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const deleteFile = mutation({
    args: {
      storageId: v.string(),
    },
    handler: async (ctx, args) => {
        const gg = await ctx.storage.delete(args.storageId);

        console.log(gg)
    },
  });