import {Location} from "../Location";
import {CardType} from "../../../card/Card";

export class PickCardLocation extends Location {
  private _type: CardType;

  public constructor(
    id: number,
    position: number,
    description: string,
    type: CardType
  ) {
    super(PickCardLocation.name, id, position, description);
    this._type = type;
  }

  public static trueCopy(location: PickCardLocation): PickCardLocation | null {
    return new PickCardLocation(
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

  public get type(): CardType {
    return this._type;
  }

  public override toString(): string {
    switch (this.type) {
      case CardType.CHEST:
        return "Community chest"
      case CardType.CHANCE:
        return "Chance"
      default:
        return "A pick card location.";
    }
  }
}
