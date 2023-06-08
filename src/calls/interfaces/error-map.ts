export interface ErrorMap {
  message: string;
  useCase?: string;
  statusCode: number;
  params:
    | {
        [key: string]: string;
      }
    | {};
}
