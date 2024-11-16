import {LoginRequest} from "./LoginRequest";

export class UpdateUserRequest {
  private _id: number;

  private _username: string | null;
  private _firstName: string | null;
  private _lastName: string | null;
  private _email: string | null;
  private _countryCode: string | null;
  private _password: string | null;
  private _loginRequest: LoginRequest | null;

  constructor(id: number,
              username: string | null,
              firstName: string | null,
              lastName: string | null,
              email: string | null,
              countryCode: string | null,
              password: string | null) {
    this._id = id;
    this._username = username;
    this._firstName = firstName;
    this._lastName = lastName;
    this._email = email;
    this._countryCode = countryCode;
    this._password = password;
    this._loginRequest = null;
  }

  public toJson(): object {
    return {
      "id": this.id,
      "username": this.username,
      "firstName": this.firstName,
      "lastName": this.lastName,
      "email": this.email,
      "countryCode": this.countryCode,
      "password": this.password,
      "loginRequest": this.loginRequest?.toJson()
    }
  }

  get id(): number {
    return this._id;
  }

  get password(): string | null {
    return this._password;
  }

  get username(): string | null {
    return this._username;
  }

  get firstName(): string | null {
    return this._firstName;
  }

  get lastName(): string | null {
    return this._lastName;
  }

  get email(): string | null {
    return this._email;
  }

  get countryCode(): string | null {
    return this._countryCode;
  }

  get loginRequest(): LoginRequest | null {
    return this._loginRequest;
  }

  set loginRequest(value: LoginRequest | null) {
    this._loginRequest = value;
  }
}
