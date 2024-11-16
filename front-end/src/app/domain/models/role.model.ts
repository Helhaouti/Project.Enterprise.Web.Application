export class UserRole {
  public static readonly ROLE_PREFIX: string = "ROLE_";
  public static readonly ADMIN: string = UserRole.ROLE_PREFIX + "ADMIN";
  public static readonly PLAYER: string = UserRole.ROLE_PREFIX + "PLAYER";

  private _id: number;
  private _authority: string;

  constructor(id: number,
              authority: string) {
    this._id = id;
    this._authority = authority;
  }

  public static trueCopy(role: UserRole) {
    return new UserRole(
      role.id,
      role.authority
    );
  }

  public toJson(): object {
    return {
      "id": this.id,
      "authority": this.authority
    }
  }

  get id(): number {
    return this._id;
  }

  get authority(): string {
    return this._authority;
  }
}
