import { z } from "zod";

const serverSchema = z.object({
   DATABASE_URL: z.url().optional(),
   BETTER_AUTH_SECRET: z.string().optional(),
   BETTER_AUTH_TRUSTED_ORIGINS: z.string().optional(),
   AWS_ACCESS_KEY_ID: z.string().optional(),
   AWS_SECRET_ACCESS_KEY: z.string().optional(),
   AWS_REGION: z.string().optional(),
   AWS_S3_BUCKET: z.string().optional(),
   DEV: z.boolean().default(false),
   NEXT_PUBLIC_APP_URL: z.string().optional(),
});

const clientSchema = z.object({
   VITE_DEV: z.boolean().default(false),
});

const serverEnv = serverSchema.parse(process.env);
const clientEnv = clientSchema.parse(import.meta.env);

export const env = {
   ...serverEnv,
   ...clientEnv,
};
