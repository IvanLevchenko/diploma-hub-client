import { UserRoles } from "../enums/user-roles";

export abstract class UserListDto {}

export abstract class UserCastToRoleDto {
  id: string;

  role: UserRoles;
}
