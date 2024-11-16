import {GameAction} from "../../GameAction";
import {Card} from "../../../card/Card";
import {Player} from "../../../Player";
import {CardUtil} from "../../../card/CardUtil";

/**
 * TODO: Add JsDoc
 *
 * @author Hamza el Haouti
 */
export class DrawCardAction extends GameAction {
  private _card: Card;

  constructor(
    id: number,
    actor: Player,
    performedAt: Date,
    card: Card,
  ) {
    super(DrawCardAction.name, id, actor, performedAt);
    this._card = card;
  }

  public static trueCopy(action: DrawCardAction): GameAction | null {
    return new DrawCardAction(
      action.id,
      Player.trueCopy(action.actor),
      new Date(action.performedAt),
      CardUtil.trueCopy(action.card),
    );
  }

  public get card() {
    return this._card;
  }

  public override toJson(): object {
    return Object.assign(super.toJson(), {
      "card": this.card.toJson()
    });
  }

  public toString(): string {
    return `${this.actor.user.username} picked ${this.card.toString()}`;
  }

}
