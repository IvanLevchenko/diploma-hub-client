import {User} from "./user";
import {Repository} from "./repository";

export class File {
  id: string;

  filename: string;

  filepath: string;

  authorId: string;

  repositoryId: string;

  author: User;

  repository: Repository;
}