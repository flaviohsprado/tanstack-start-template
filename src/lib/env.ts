import { z } from "zod";

const serverSchema = z.object({
   DATABASE_URL: z.string().url(),
   BETTER_AUTH_SECRET: z.string(),
   BETTER_AUTH_TRUSTED_ORIGINS: z.string(),
   DEV: z.boolean().default(false),
});

const clientSchema = z.object({
   VITE_DATABASE_URL: z.string().url(),
   VITE_DEV: z.boolean().default(false),
});

const serverEnv = serverSchema.parse(process.env);
const clientEnv = clientSchema.parse(import.meta.env);

export const env = {
   ...serverEnv,
   ...clientEnv,
};
