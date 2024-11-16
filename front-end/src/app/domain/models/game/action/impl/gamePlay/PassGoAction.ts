import {ReceiveFreeMoneyAction} from "../money/ReceiveFreeMoneyAction";
import {Player} from "../../../Player";

/**
 * Representation, of the action, of a player passing Go, position 1, of the game.
 *
 * @author Hamza el Haouti
 */
export class PassGoAction extends ReceiveFreeMoneyAction {

  public constructor(
    id: number,
    recipient: Player,
    performedAt: Date,
    amount: number
  ) {
    super(id, recipient, performedAt, amount);
    super.classType = PassGoAction.name;
  }

  public static override trueCopy(action: PassGoAction): PassGoAction | null {
    return new PassGoAction(
      action.id,
      Player.trueCopy(action.recipient),
      new Date(action.performedAt),
      action.amount
    );
  }

  public override toString(): string {
    return super.toString() + " for passing GO.";
  }

}
