import {GameAction} from "../../GameAction";
import {Player} from "../../../Player";

/**
 * TODO: Add JsDoc
 *
 * @author Hamza el Haouti
 */
export class PlayerMoveAction extends GameAction {
  public constructor(
    id: number,
    actor: Player,
    performedAt: Date,
    fromPosition: number,
    toPosition: number,
    skipGo: boolean
  ) {
    super(PlayerMoveAction.name, id, actor, performedAt);
    this._fromPosition = fromPosition;
    this._toPosition = toPosition;
    this._skipGo = skipGo;
  }

  private _fromPosition: number;

  public get fromPosition(): number {
    return this._fromPosition;
  }

  private _toPosition: number;

  public get toPosition(): number {
    return this._toPosition;
  }

  private _skipGo: boolean;

  public get skipGo(): boolean {
    return this._skipGo;
  }

  public static trueCopy(action: PlayerMoveAction): GameAction | null {
    return new PlayerMoveAction(
      action.id,
      Player.trueCopy(action.actor),
      new Date(action.performedAt),
      action.fromPosition,
      action.toPosition,
      action.skipGo
    );
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(), {
        "fromPosition": this.fromPosition,
        "toPosition": this.toPosition,
        "skipGo": this.skipGo
      }
    );
  }

  public override toString(): string {
    const SKIPPED_GO_TEXT = this.skipGo ? "did skip" : "passed";
    return `${super.actor.user.username} moved from position ${this.fromPosition} to ${this.toPosition}, ` +
      `and ${SKIPPED_GO_TEXT} GO`;
  }

}
