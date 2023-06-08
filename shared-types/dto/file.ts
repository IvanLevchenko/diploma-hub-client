import {File} from "../entities/fily";

export abstract class FileGetDto {
  id: string;

  isPreview?: string;
}

export abstract class FileCreateDto {
  filename: string;

  repositoryId: string;
}

export abstract class FileCreateDtoOut extends File {
  passed: boolean;
  percent: number;
}

export abstract class FileDeleteDto {
  id: string;
}

export abstract class FileUpdateDto {
  id: string;

  filename: string;
}