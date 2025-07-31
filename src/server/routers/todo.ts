import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const todoRouter = createTRPCRouter({
   create: publicProcedure.input(z.object({ title: z.string(), description: z.string() })).mutation(async ({ ctx, input }) => {
      return {
         id: "1",
         title: input.title,
         description: input.description,
      };
   }),
});
