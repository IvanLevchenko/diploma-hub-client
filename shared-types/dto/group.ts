export abstract class GroupAddUsersDto {
  userIdList: string[];

  groupId: string;
}

export abstract class GroupRemoveUsersDto {
  userIdList: string[];

  groupId: string;
}

export abstract class GroupGetDto {
  id: string;
}

export abstract class GroupCreateDto {
  name: string;
}

export abstract class GroupListDto {}

export abstract class GroupDeleteDto {
  id: string;
}

export abstract class GroupUpdateDto {
  id: string;

  name: string;
}
