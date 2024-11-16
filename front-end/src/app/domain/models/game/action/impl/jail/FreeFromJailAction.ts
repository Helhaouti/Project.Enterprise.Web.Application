import {GameAction} from "../../GameAction";
import {Player} from "../../../Player";

/**
 * TODO: Add JsDoc
 *
 * @author Hamza el Haouti
 */
export class FreeFromJailAction extends GameAction {

  public constructor(
    id: number,
    actor: Player,
    performedAt: Date,
  ) {
    super(FreeFromJailAction.name, id, actor, performedAt);
  }

  public static trueCopy(action: FreeFromJailAction): GameAction | null {
    return new FreeFromJailAction(
      action.id,
      Player.trueCopy(action.actor),
      new Date(action.performedAt),
    );
  }

  public override toString(): string {
    return `${this.actor.user.username} has freed from jail.`;
  }

}
