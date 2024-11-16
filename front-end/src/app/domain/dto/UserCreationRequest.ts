export class UserCreationRequest {
  private readonly _firstName: string;
  private readonly _lastName: string;
  private readonly _username: string;
  private readonly _password: string;
  private readonly _emailAddress: string;
  private readonly _countryCode: string;

  constructor(
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    emailAddress: string,
    countryCode: string
  ) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._username = username;
    this._password = password;
    this._emailAddress = emailAddress;
    this._countryCode = countryCode;
  }

  public toJson(): JSON {
    return JSON.parse(JSON.stringify(
      {
        "firstName": this.firstName,
        "lastName": this.lastName,
        "username": this.username,
        "password": this.password,
        "emailAddress": this.emailAddress,
        "countryCode": this.countryCode,
      }
    ));
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get username(): string {
    return this._username;
  }

  get password(): string {
    return this._password;
  }

  get emailAddress(): string {
    return this._emailAddress;
  }

  get countryCode(): string {
    return this._countryCode;
  }
}
