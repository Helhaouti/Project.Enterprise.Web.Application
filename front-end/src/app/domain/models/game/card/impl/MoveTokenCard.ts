import {Card, CardType} from "../Card";

export class MoveTokenCard extends Card {
  private _skipGo: boolean;
  private _distance: number;

  public constructor(
    id: number,
    description: string,
    type: CardType,
    skipGo: boolean,
    distance: number
  ) {
    super(MoveTokenCard.name, id, description, type);
    this._skipGo = skipGo;
    this._distance = distance;
  }

  public static trueCopy(action: MoveTokenCard): MoveTokenCard | null {
    return new MoveTokenCard(
      action.id,
      action.description,
      action.type,
      action.skipGo,
      action.distance
    );
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(),
      {
        "skipGo": this.skipGo,
        "distance": this.distance,
      }
    );
  }

  public get skipGo(): boolean {
    return this._skipGo;
  }

  public get distance(): number {
    return this._distance;
  }

  public override toString(): string {
    return `Move token card: requiring a move of ${this.distance} on the board, ${this.skipGo ? "" : "not"}`
      + `requiring skipping GO`;
  }

}
