export abstract class LoginDto {
  email: string;

  password: string;
}

export abstract class RegisterDto {
  email: string;

  password: string;

  firstName: string;

  lastName: string;
}

export abstract class UpdateRefreshTokenDto {
  id: string;

  refreshToken: string;
}

export abstract class LogoutDto {}

export abstract class LogoutServiceDto {
  authorizationHeader: string | undefined;
}

export abstract class IsAuthorizedDto {
  authorizationHeader: string;
  refreshToken: string;
}