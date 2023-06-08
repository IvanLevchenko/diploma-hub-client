import {UserRoles} from "../enums/user-roles";

export interface TokenPayload {
  id: string;
  email: string;
  role: UserRoles;
  firstName: string;
  lastName: string;
}