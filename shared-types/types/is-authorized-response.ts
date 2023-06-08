import {TokenPayload} from "./token-payload";
import {AuthorizationResult} from "./authorization-result";

interface IsAuthorized {
  isAuthorized: boolean;
  tokens?: AuthorizationResult;
  tokenPayload?: TokenPayload;
}

export type IsAuthorizedResponse = Omit<IsAuthorized, "tokens"> & {
  token?: string;
  tokenPayload?: TokenPayload;
};