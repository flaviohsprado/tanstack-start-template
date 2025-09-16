import { UserFormSchema, UserUpdateFormSchema } from "@/lib/schemas";
import { getS3Url, uploadToS3 } from "@/lib/services/s3";
import { ContentType } from "@/types";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";
import { user } from "../db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
   me: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) {
         throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return await ctx.db.query.user.findFirst({
         where: eq(user.id, ctx.user.id),
      });
   }),

   get: protectedProcedure.query(async ({ ctx }) => {
      return await ctx.db.query.user.findMany({
         orderBy: (users, { asc }) => [asc(users.name)],
      });
   }),

   find: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
      return await ctx.db.query.user.findMany({
         where: eq(user.id, input.id),
         orderBy: (users, { asc }) => [asc(users.name)],
      });
   }),

   create: publicProcedure.input(UserFormSchema).mutation(async ({ ctx, input }) => {
      const authUser = await ctx.auth.api.signUpEmail({
         body: {
            email: input.email ?? "",
            password: input.password,
            name: input.name,
         },
      });

      if (!authUser.user) {
         throw new Error("Failed to create user");
      }

      return authUser.user;
   }),

   update: protectedProcedure
      .input(z.object({ id: z.string(), data: UserUpdateFormSchema }))
      .mutation(async ({ ctx, input }) => {
         return await ctx.db.update(user).set(input.data).where(eq(user.id, input.id));
      }),

   uploadAvatar: protectedProcedure
      .input(
         z.object({
            file: z.string().min(1), // data URL base64
            fileName: z.string().min(1),
            contentType: z.string().optional(),
         }),
      )
      .mutation(async ({ ctx, input }) => {
         if (!ctx.user) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
         }

         // Parse data URL
         const matches = input.file.match(/^data:(.*?);base64,(.*)$/);
         const inferredContentType = matches?.[1] ?? input.contentType ?? "application/octet-stream";
         const base64Data = matches?.[2] ?? input.file;
         const buffer = Buffer.from(base64Data, "base64");

         const key = `${ContentType.AVATAR}/${ctx.user.id}/${Date.now()}-${input.fileName}`;
         await uploadToS3(key, buffer, inferredContentType);

         const url = getS3Url(ContentType.AVATAR, `${ctx.user.id}/${key.split("/").pop()}`);

         await ctx.db.update(user).set({ image: url }).where(eq(user.id, ctx.user.id));

         return { url };
      }),

   updatePassword: protectedProcedure
      .input(z.object({ currentPassword: z.string(), newPassword: z.string() }))
      .mutation(async ({ ctx, input }) => {
         if (!ctx.user) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
         }

         const { currentPassword, newPassword } = input;

         try {
            return await ctx.auth.api.changePassword({
               headers: ctx.headers,
               body: {
                  newPassword,
                  currentPassword,
               },
            });
         } catch (error) {
            console.error(error);
            throw new TRPCError({
               code: "INTERNAL_SERVER_ERROR",
               message: "Erro ao atualizar senha",
               cause: error,
            });
         }
      }),
});
