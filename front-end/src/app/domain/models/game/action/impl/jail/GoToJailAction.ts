import {GameAction} from "../../GameAction";
import {Player} from "../../../Player";

/**
 * TODO: Add JsDoc
 *
 * @author Hamza el Haouti
 */
export class GoToJailAction extends GameAction {

  public constructor(
    id: number,
    actor: Player,
    performedAt: Date,
  ) {
    super(GoToJailAction.name, id, actor, performedAt);
  }

  public static trueCopy(action: GoToJailAction): GoToJailAction | null {
    return new GoToJailAction(
      action.id,
      Player.trueCopy(action.actor),
      new Date(action.performedAt)
    );
  }

  public override toString(): string {
    return `${this.actor.user.username} has been jailed.`;
  }

}
