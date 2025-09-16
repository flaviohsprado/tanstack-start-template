import { env } from "@/lib/env";
import { db } from "@/server/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, multiSession } from "better-auth/plugins";
import { reactStartCookies } from "better-auth/react-start";
import { t } from "./trpc";

export const auth = betterAuth({
   trpc: t,
   database: drizzleAdapter(db, {
      provider: "pg",
   }),
   emailAndPassword: {
      enabled: true,
   },
   user: {
      additionalFields: {
         phone: {
            type: "string",
            required: false,
         },
      },
   },
   trustedOrigins: [env.BETTER_AUTH_TRUSTED_ORIGINS!],
   jwt: {
      enabled: true,
      secret: env.BETTER_AUTH_SECRET,
   },
   plugins: [
      admin({
         adminRoles: ["admin"],
         rolePath: "role",
      }),
      reactStartCookies(),
      multiSession(),
   ],
});

export type AuthAPI = typeof auth.api;
export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
