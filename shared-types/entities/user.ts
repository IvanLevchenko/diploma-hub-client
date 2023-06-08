import {UserRoles} from "../enums/user-roles";
import {Group} from "./group";

export class User {
  id: string;

  refreshToken?: string;

  firstName: string;

  lastName: string;

  email: string;

  password: string;

  role: UserRoles;

  groupId: string | null;

  group: Group;
}