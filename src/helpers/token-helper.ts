import { AxiosResponse } from "axios";
import { IsAuthorizedResponse } from "../../shared-types/types/is-authorized-response";

import Calls from "../calls/calls";

class TokenHelper {
  public setToken(token: string): void {
    localStorage.setItem("token", token);
  }

  public isTokenExists(): boolean {
    return !!localStorage.getItem("token");
  }

  public getToken(): string | null {
    return localStorage.getItem("token");
  }

  public isTokenValid(): Promise<IsAuthorizedResponse> {
    const authorizationHeader = `Bearer ${this.getToken()}`;
    return Calls.auth
      .isAuthorized(authorizationHeader)
      .then((response: AxiosResponse<IsAuthorizedResponse>) => {
        return response.data;
      });
  }
}

export default TokenHelper;
