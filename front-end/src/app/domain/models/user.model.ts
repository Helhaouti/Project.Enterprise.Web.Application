import {UserRole} from "./role.model";

export class User {
  private _id: number;
  private _username: string;

  private _createdAt: Date;
  private _modifiedAt: Date;

  private _roles: UserRole[];

  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _countryCode: string;

  constructor(id: number,
              createdAt: Date,
              modifiedAt: Date,
              username: string,
              email: string,
              roles: UserRole[],
              firstName: string,
              lastName: string,
              countryCode: string) {
    this._id = id;
    this._createdAt = createdAt;
    this._modifiedAt = modifiedAt;
    this._username = username;
    this._email = email;
    this._roles = roles;
    this._firstName = firstName;
    this._lastName = lastName;
    this._countryCode = countryCode;
  }

  public static trueCopy(o: User): User {
    return new User(
      o.id,
      new Date(o.createdAt),
      new Date(o.modifiedAt),
      o.username,
      o.email,
      o.roles.map(UserRole.trueCopy),
      o.firstName,
      o.lastName,
      o.countryCode,
    );
  }

  public toJson(): object {
    return {
      "id": this.id,
      "createdAt": this.createdAt,
      "modifiedAt": this.modifiedAt,
      "username": this.username,
      "email": this.email,
      "roles": this.roles.map(role => role.toJson()),
      "firstName": this.firstName,
      "lastName": this.lastName,
      "countryCode": this.countryCode,
    };
  }

  get determinePlayerPrivilege(): boolean {
    return !!this.roles.find(role => role.authority === UserRole.PLAYER);
  }

  get determineAdminPrivilege(): boolean {
    return !!this.roles.find(role => role.authority === UserRole.ADMIN);
  }

  get id(): number {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get modifiedAt(): Date {
    return this._modifiedAt;
  }

  get username(): string {
    return this._username;
  }

  get email(): string {
    return this._email;
  }

  get roles(): UserRole[] {
    return this._roles;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get countryCode(): string {
    return this._countryCode;
  }
}
