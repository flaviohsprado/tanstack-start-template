import type { Auth, Session, User } from "./server/auth";
import type { Db } from "./server/db";

export type Context = {
    headers: Headers;
    db: Db;
    auth: Auth;
    session: Session | null;
    user: User;
 };