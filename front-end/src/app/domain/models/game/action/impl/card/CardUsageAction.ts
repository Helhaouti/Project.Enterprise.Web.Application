import {GameAction} from "../../GameAction";
import {Card} from "../../../card/Card";
import {Player} from "../../../Player";
import {CardUtil} from "../../../card/CardUtil";

/**
 * TODO: JsDoc
 *
 * @author Hamza el Haouti
 */
export class CardUsageAction extends GameAction {
  private _card: Card;

  public constructor(
    id: number,
    actor: Player,
    performedAt: Date,
    card: Card
  ) {
    super(CardUsageAction.name, id, actor, performedAt);
    this._card = card;
  }

  public static trueCopy(action: CardUsageAction): CardUsageAction | null {
    return new CardUsageAction(
      action.id,
      Player.trueCopy(action.actor),
      new Date(action.performedAt),
      CardUtil.trueCopy(action.card),
    );
  }

  public override toJson(): object {
    return Object.assign(super.toJson(), {
      "card": this.card.toJson(),
    });
  }

  public get card() {
    return this._card;
  }

  public override toString(): string {
    return `${this.actor.user.username} used card: ${this.card.toString()}`;
  }

}
