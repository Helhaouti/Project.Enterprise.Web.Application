import {Card, CardType} from "../Card";

export class PayMoneyCard extends Card {
  private _amount: number;

  public constructor(
    id: number,
    description: string,
    type: CardType,
    amount: number
  ) {
    super(PayMoneyCard.name, id, description, type);
    this._amount = amount;
  }

  public static trueCopy(action: PayMoneyCard): PayMoneyCard | null {
    return new PayMoneyCard(
      action.id,
      action.description,
      action.type,
      action.amount,
    );
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(),
      {
        "amount": this.amount
      }
    );
  }

  public get amount(): number {
    return this._amount;
  }

  public override toString(): string {
    return `Pay money card: requiring you to pay ${this.amount} to the bank.`;
  }

}
