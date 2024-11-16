import {GameAction} from "../../GameAction";
import {Player} from "../../../Player";

/**
 * TODO: Add JsDoc
 *
 * @author Hamza el Haouti
 */
export class DiceRollAction extends GameAction {
  public constructor(
    id: number,
    actor: Player,
    performedAt: Date,
    firstDiceValue: number,
    secondDiceValue: number
  ) {
    super(DiceRollAction.name, id, actor, performedAt);
    this._firstDiceValue = firstDiceValue;
    this._secondDiceValue = secondDiceValue;
  }

  private _firstDiceValue: number;

  public get firstDiceValue(): number {
    return this._firstDiceValue;
  }

  private _secondDiceValue: number;

  public get secondDiceValue(): number {
    return this._secondDiceValue;
  }

  public static trueCopy(action: DiceRollAction): DiceRollAction | null {
    return new DiceRollAction(
      action.id,
      Player.trueCopy(action.actor),
      new Date(action.performedAt),
      action.firstDiceValue,
      action.secondDiceValue
    );
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(), {
        "firstDiceValue": this.firstDiceValue,
        "secondDiceValue": this.secondDiceValue,
      });
  }

  public override toString(): string {
    return `${super.actor.user.username} rolled one ${this.firstDiceValue} and a ${this.secondDiceValue}`;
  }

}
