import {Card, CardType} from "../Card";

export class FreeMoneyCard extends Card {
  private _amount: number;

  public constructor(
    id: number,
    description: string,
    type: CardType,
    amount: number
  ) {
    super(FreeMoneyCard.name, id, description, type);
    this._amount = amount;
  }

  public static trueCopy(action: FreeMoneyCard): FreeMoneyCard | null {
    return new FreeMoneyCard(
      action.id,
      action.description,
      action.type,
      action.amount
    );
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(),
      {
        "amount": this.amount,
      }
    );
  }

  public get amount(): number {
    return this._amount;
  }

  public override toString(): string {
    return `Free money card of ${this.amount}`;
  }

}
