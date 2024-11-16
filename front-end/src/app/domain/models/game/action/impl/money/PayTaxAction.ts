import {Player} from "../../../Player";
import {MoneyExchangeAction} from "./MoneyExchangeAction";

/**
 * A representation, of the action, of a tax payment within a GameSession,
 * this, for example occurs when landing on TaxLocation on the GameBoard.
 *
 * @author Hamza el Haouti
 */
export class PayTaxAction extends MoneyExchangeAction {

  constructor(
    id: number,
    payee: Player,
    performedAt: Date,
    amount: number
  ) {
    super(PayTaxAction.name, id, payee, performedAt, null, amount);
  }

  public static trueCopy(action: PayTaxAction): PayTaxAction | null {
    return new PayTaxAction(
      action.id,
      Player.trueCopy(action.actor),
      new Date(action.performedAt),
      action.amount
    );
  }

  public override toString(): string {
    return `${this.actor.user.username} payed a tax of $${this.amount}.`;
  }

}
