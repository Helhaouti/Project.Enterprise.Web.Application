import {GameAction} from "../../GameAction";
import {Player} from "../../../Player";

/**
 * TODO: Add JsDoc
 *
 * @author Hamza el Haouti
 */
export class WinGameAction extends GameAction {

  public constructor(
    id: number,
    actor: Player,
    performedAt: Date,
  ) {
    super(WinGameAction.name, id, actor, performedAt);
  }

  public static trueCopy(action: WinGameAction): WinGameAction | null {
    return new WinGameAction(
      action.id,
      Player.trueCopy(action.actor),
      new Date(action.performedAt),
    );
  }

  public override toJson(): object {
    return super.toJson();
  }

  public override toString(): string {
    return `The game is finished. ${this.actor.user.username} won.`;
  }

}
