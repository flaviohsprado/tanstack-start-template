import { auth } from "@/server/auth";
import { db } from "@/server/db";
import type { Context } from "@/types";

export const createTRPCContext = async (opts: { req: Request }): Promise<Context> => {
   const { req } = opts;
   const session = await auth.api.getSession({ headers: req.headers });

   if (!session) {
      throw new Error("Unauthorized");
   }

   if (!session.user) {
      throw new Error("Unauthorized");
   }

   return {
      headers: req.headers,
      db,
      auth,
      session,
      user: session.user,
   };
};
