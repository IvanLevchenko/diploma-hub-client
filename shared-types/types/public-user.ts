import {User} from "../entities/user";

export type PublicUser = Omit<User, "password" | "refreshToken">;