import Calls from "../calls/calls";
import { AxiosResponse } from "axios";

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

  public isTokenValid(): Promise<{ isAuthorized: boolean }> {
    const authorizationHeader = `Bearer ${this.getToken()}`;
    return Calls.auth
      .isAuthorized(authorizationHeader)
      .then((response: AxiosResponse<{ isAuthorized: boolean }>) => {
        return response.data;
      });
  }
}

export default TokenHelper;
