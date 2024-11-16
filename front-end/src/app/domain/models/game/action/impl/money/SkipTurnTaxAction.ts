import {MoneyExchangeAction} from "./MoneyExchangeAction";
import {Player} from "../../../Player";

/**
 * Representation, of the action, of a tax on skipping a turn, by for example not throwing dice, or picking a card.
 * This tax is paid by a player to the bank.
 *
 * @author Hamza el Haouti
 */
export class SkipTurnTaxAction extends MoneyExchangeAction {

  constructor(
    id: number,
    payee: Player,
    performedAt: Date,
    amount: number
  ) {
    super(SkipTurnTaxAction.name, id, payee, performedAt, null, amount);
  }

  public static trueCopy(action: SkipTurnTaxAction): SkipTurnTaxAction | null {
    return new SkipTurnTaxAction(
      action.id,
      Player.trueCopy(action.actor),
      new Date(action.performedAt),
      action.amount
    );
  }

  public override toString(): string {
    return `${this.actor.user.username} payed a tax of ${this.amount} for not doing anything during his turn.`;
  }

}
