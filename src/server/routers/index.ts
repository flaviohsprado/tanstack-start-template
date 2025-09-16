import { createTRPCRouter } from "../trpc";
import { userRouter } from "./user";

export const trpcRouter = createTRPCRouter({
   user: userRouter,
});

export type TRPCRouter = typeof trpcRouter;
