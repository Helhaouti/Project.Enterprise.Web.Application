export class LoginRequest {
  private readonly _username: string;
  private readonly _password: string;

  public constructor(username: string, password: string) {
    this._username = username;
    this._password = password;
  }

  public toJson(): JSON {
    return JSON.parse(JSON.stringify(
      {
        "username": this.username,
        "password": this.password
      }
    ));
  }

  get username(): string {
    return this._username;
  }

  get password(): string {
    return this._password;
  }
}
