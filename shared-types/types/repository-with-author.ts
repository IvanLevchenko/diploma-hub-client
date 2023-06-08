import {PublicUser} from "./public-user";
import {Repository} from "../entities/repository";

export type RepositoryWithAuthor = Omit<Repository, "author"> & {
  author: PublicUser;
};