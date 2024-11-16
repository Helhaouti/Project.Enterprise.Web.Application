import {GameAction} from "../../GameAction";
import {Player} from "../../../Player";

/**
 * TODO: Add JsDoc
 *
 * @author Hamza el Haouti
 */
export class SwitchPlayerAction extends GameAction {
  private _newPlayer: Player;
  private _turnEndsAt: Date;

  public constructor(
    id: number,
    actor: Player,
    performedAt: Date,
    newPlayer: Player,
    turnEndsAt: Date
  ) {
    super(SwitchPlayerAction.name, id, actor, performedAt);
    this._newPlayer = newPlayer;
    this._turnEndsAt = turnEndsAt;
  }

  public get newPlayer(): Player {
    return this._newPlayer;
  }

  public get turnEndsAt(): Date {
    return this._turnEndsAt;
  }

  public static trueCopy(action: SwitchPlayerAction): GameAction | null {
    return new SwitchPlayerAction(
      action.id,
      Player.trueCopy(action.actor),
      new Date(action.performedAt),
      Player.trueCopy(action.newPlayer),
      new Date(action.turnEndsAt)
    );
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(), {
        "newPlayer": this.newPlayer.toJson(),
        "turnEndsAt": this.turnEndsAt.toJSON(),
      });
  }

  public override toString(): string {
    return `Turn of ${super.actor.user.username} ended. It's now the turn of ${this.newPlayer.user.username}`;
  }

}
