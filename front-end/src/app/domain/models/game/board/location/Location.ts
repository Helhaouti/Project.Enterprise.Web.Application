export abstract class Location {
  private _classType: string;
  private _id: number;
  private _position: number;
  private _description: string;

  protected constructor(
    classType: string,
    id: number,
    position: number,
    description: string
  ) {
    this._classType = classType;
    this._id = id;
    this._position = position;
    this._description = description;
  }

  public toJson(): object {
    return {
      "classType": this.classType,
      "id": this.id,
      "position": this.position,
      "description": this.description
    }
  }

  public get classType(): string {
    return this._classType;
  }

  public get id(): number {
    return this._id;
  }

  public get position(): number {
    return this._position;
  }

  public get description(): string {
    return this._description;
  }

  public abstract toString(): string;
}
