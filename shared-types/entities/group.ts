import {PublicUser} from "../types/public-user";

export class Group {
  id: string;

  name: string;

  userIdList: string[];

  authorId: string;

  userList: PublicUser[];
}