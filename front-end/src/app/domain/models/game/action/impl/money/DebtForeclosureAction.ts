import {Player} from "../../../Player";
import {GameActionUtil} from "../../GameActionUtil";
import {MoneyExchangeAction} from "./MoneyExchangeAction";

/**
 * Representation, of the action, of a foreclosure when a player defaults on debt. After this action the debtor needs to
 * be declared bankrupt.
 *
 * @author Hamza el Haouti
 */
export class DebtForeclosureAction extends MoneyExchangeAction {

  public constructor(
    id: number,
    payee: Player,
    performedAt: Date,
    recipient: Player,
    amount: number,
    reasonOfDebt: MoneyExchangeAction
  ) {
    super(DebtForeclosureAction.name, id, payee, performedAt, recipient, amount);
    this._reasonOfDebt = reasonOfDebt;
  }

  private _reasonOfDebt: MoneyExchangeAction;

  public get reasonOfDebt(): MoneyExchangeAction {
    return this._reasonOfDebt;
  }

  public static trueCopy(action: DebtForeclosureAction): DebtForeclosureAction | null {
    return new DebtForeclosureAction(
      action.id,
      Player.trueCopy(action.actor),
      new Date(action.performedAt),
      action.recipient ? Player.trueCopy(action.recipient) : null,
      action.amount,
      <MoneyExchangeAction>GameActionUtil.trueCopy(action.reasonOfDebt)
    );
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(), {
        "reasonOfDebt": this.reasonOfDebt.toJson(),
      });
  }

  public override toString(): string {
    return `${this.actor.user.username} could not pay ${this.reasonOfDebt.amount}. This resulted in the ` +
      `player's money ($${this.amount}) being foreclosed, and given to: ${this.recipient == null ? "the bank" : this.recipient.user.username}`;
  }

}
