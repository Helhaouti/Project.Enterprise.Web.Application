import {Card, CardType} from "../Card";

export class MoveTokenToPositionCard extends Card {
  public constructor(
    id: number,
    description: string,
    type: CardType,
    skipGo: boolean,
    distance: number
  ) {
    super(MoveTokenToPositionCard.name, id, description, type);
    this._skipGo = skipGo;
    this._toPosition = distance;
  }

  private _skipGo: boolean;

  public get skipGo(): boolean {
    return this._skipGo;
  }

  private _toPosition: number;

  public get toPosition(): number {
    return this._toPosition;
  }

  public static trueCopy(action: MoveTokenToPositionCard): MoveTokenToPositionCard | null {
    return new MoveTokenToPositionCard(
      action.id,
      action.description,
      action.type,
      action.skipGo,
      action.toPosition
    );
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(),
      {
        "skipGo": this.skipGo,
        "toPosition": this.toPosition,
      }
    );
  }

  public override toString(): string {
    return `Move token card: requiring a move to position ${this.toPosition} of the board.`;
  }

}
