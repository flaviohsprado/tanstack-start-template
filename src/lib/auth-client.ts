import type { auth } from "@/server/auth";
import { adminClient, customSessionClient, multiSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
   baseURL: typeof window !== "undefined" ? window.location.origin : "",
   plugins: [adminClient(), multiSessionClient(), customSessionClient<typeof auth>()],
   user: {
      additionalFields: {
         phone: {
            type: "string",
            required: false,
         },
      },
   },
});

export const { signIn, signUp, signOut, useSession } = authClient;
