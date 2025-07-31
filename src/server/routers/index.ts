import { createTRPCRouter } from "../trpc";
import { todoRouter } from "./todo";

export const trpcRouter = createTRPCRouter({
   todo: todoRouter,
});

export type TRPCRouter = typeof trpcRouter;
