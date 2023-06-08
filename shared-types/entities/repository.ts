import { User } from "./user";
import { File } from "@backend/entities/fily";

export class Repository {
  id: string;

  name: string;

  filesIdList: string[];

  subject: string;

  groups: string[];

  authorId: string;

  created: Date;

  author: User;

  filesList: File[];
}
