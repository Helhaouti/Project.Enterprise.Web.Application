import {GameAction} from "../../GameAction";
import {Player} from "../../../Player";

/**
 * An abstract representation, of the action, of money exchange among two parties within a GameSession,
 * with at least one being an instance of Player. The (fictional monopoly) bank being represented by null.
 *
 * @author Hamza el Haouti
 */
export abstract class MoneyExchangeAction extends GameAction {

  protected constructor(
    classType: string,
    id: number,
    payee: Player,
    performedAt: Date,
    recipient: Player,
    amount: number
  ) {
    super(classType, id, payee, performedAt);
    this._recipient = recipient;
    this._amount = amount;
  }

  private _recipient: Player;

  public get recipient(): Player {
    return this._recipient;
  }

  private _amount: number;

  public get amount(): number {
    return this._amount;
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(), {
        "recipient": this.recipient?.toJson(),
        "amount": this.amount,
      }
    );
  }

}
