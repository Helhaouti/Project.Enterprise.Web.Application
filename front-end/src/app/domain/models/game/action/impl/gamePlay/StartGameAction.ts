import {GameAction} from "../../GameAction";
import {Player} from "../../../Player";

/**
 * TODO: Add JsDoc
 *
 * @author Hamza el Haouti
 */
export class StartGameAction extends GameAction {
  private _startCapital: number;
  private _firstTurnEndsAt: Date;

  public constructor(
    id: number,
    actor: Player,
    performedAt: Date,
    startCapital: number,
    firstTurnEndsAt: Date
  ) {
    super(StartGameAction.name, id, actor, performedAt);
    this._startCapital = startCapital;
    this._firstTurnEndsAt = firstTurnEndsAt;
  }

  public static trueCopy(action: StartGameAction): GameAction | null {
    return new StartGameAction(
      action.id,
      Player.trueCopy(action.actor),
      new Date(action.performedAt),
      action.startCapital,
      new Date(action.firstTurnEndsAt)
    );
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(), {
        "startCapital": this.startCapital,
        "firstTurnEndsAt": this.firstTurnEndsAt.toJSON(),
      });
  }

  public get startCapital(): number {
    return this._startCapital;
  }


  public get firstTurnEndsAt(): Date {
    return this._firstTurnEndsAt;
  }

  public override toString(): string {
    return `${this.actor.user.username} started the game. The start capital is $${this.startCapital}`;
  }

}
