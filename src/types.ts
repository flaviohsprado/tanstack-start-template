import type { Auth, Session, User } from "./server/auth";
import type { Db } from "./server/db";

export type Context = {
   headers: Headers;
   db: Db;
   auth: Auth;
   session: Session | null;
   user: User | null;
};

type CustomOption = {
   label: string;
   value: string;
};
export type CustomOptions = Array<CustomOption>;

export enum ContentType {
   AVATAR = "avatar",
   IMAGE = "image",
}
