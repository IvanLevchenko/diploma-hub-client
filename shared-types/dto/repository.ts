export abstract class RepositoryCreateDto {
  name: string;

  subject: string;

  groups: string[];
}

export abstract class RepositoryGetDto {
  id: string;
}

export abstract class RepositoryListDto {
  pageInfo?: {
    page: number;
    pageSize: number;
  };
  subjects?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  name?: string;
}

export abstract class RepositoryDeleteDto {
  id: string;
}
