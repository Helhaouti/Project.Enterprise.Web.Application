import {Player} from "../../../Player";
import {MoneyExchangeAction} from "./MoneyExchangeAction";

export class ReceiveFreeMoneyAction extends MoneyExchangeAction {

  public constructor(
    id: number,
    recipient: Player,
    performedAt: Date,
    amount: number
  ) {
    super(ReceiveFreeMoneyAction.name, id, null, performedAt, recipient, amount);
  }

  public static trueCopy(action: ReceiveFreeMoneyAction): ReceiveFreeMoneyAction | null {
    return new ReceiveFreeMoneyAction(
      action.id,
      Player.trueCopy(action.recipient),
      new Date(action.performedAt),
      action.amount
    );
  }

  public override toString(): string {
    return `${super.recipient.user.username} received: $${this.amount}`;
  }

}
