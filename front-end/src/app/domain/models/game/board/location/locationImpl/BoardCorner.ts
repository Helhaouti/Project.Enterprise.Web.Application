import {Location} from "../Location";

export enum BoardCornerType {
  FREE_PARKING = "FREE_PARKING",
  GO = "GO",
  GO_TO_JAIL = "GO_TO_JAIL",
  JAIL = "JAIL"
}

export class BoardCorner extends Location {
  public static readonly DEFAULT_GO_LOCATION: number = 1
  public static readonly DEFAULT_JAIL_LOCATION: number = 11
  public static readonly DEFAULT_FREE_PARKING_LOCATION: number = 21
  public static readonly DEFAULT_GO_TO_JAIL_LOCATION: number = 31

  private _type: BoardCornerType;

  public constructor(
    id: number,
    position: number,
    description: string,
    type: BoardCornerType
  ) {
    super(BoardCorner.name, id, position, description);
    this._type = type;
  }

  public static trueCopy(location: BoardCorner): BoardCorner | null {
    return new BoardCorner(
      location.id,
      location.position,
      location.description,
      location.type,
    );
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(),
      {
        "type": this.type,
      }
    );
  }

  public get type(): BoardCornerType {
    return this._type;
  }

  public override toString(): string {
    switch (this.type) {
      case BoardCornerType.FREE_PARKING:
        return "Free parking"
      case BoardCornerType.JAIL:
        return "Jail"
      case BoardCornerType.GO_TO_JAIL:
        return "Go to jail"
      case BoardCornerType.GO:
        return "Go"
      default:
        return "Board corner";
    }
  }

}
