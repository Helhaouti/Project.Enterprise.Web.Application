export enum CardType {
  CHEST = "CHEST",
  CHANCE = "CHANCE"
}

export abstract class Card {
  private _classType: string;
  private _id: number;
  private _description: string;
  private _type: CardType;

  protected constructor(
    classType: string,
    id: number,
    description: string,
    type: CardType
  ) {
    this._classType = classType;
    this._id = id;
    this._description = description;
    this._type = type;
  }

  public toJson(): object {
    return {
      "classType": this.classType,
      "id": this.id,
      "description": this.description,
      "type": this.type
    }
  }

  public get classType(): string {
    return this._classType;
  }

  public get id(): number {
    return this._id;
  }

  get description(): string {
    return this._description;
  }

  public get type(): CardType {
    return this._type;
  }

  public abstract toString(): string;
}
