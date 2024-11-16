import {GameAction} from "../../GameAction";
import {Player} from "../../../Player";
import {JailBreakCard} from "../../../card/impl/JailBreakCard";
import {AssetPurchaseAction} from "../money/AssetPurchaseAction";

/**
 * TODO: Add JsDoc
 *
 * @author Hamza el Haouti
 */
export class JailBreakCardPurchaseAction extends AssetPurchaseAction {
  public constructor(
    id: number,
    newOwner: Player,
    previousOwner: Player,
    performedAt: Date,
    purchasePrice: number,
    card: JailBreakCard
  ) {
    super(JailBreakCardPurchaseAction.name, id, newOwner, previousOwner, performedAt, purchasePrice);
    this._card = card;
  }

  private _card: JailBreakCard;

  public get card(): JailBreakCard {
    return this._card;
  }

  public static trueCopy(action: JailBreakCardPurchaseAction): GameAction | null {
    return new JailBreakCardPurchaseAction(
      action.id,
      Player.trueCopy(action.actor),
      Player.trueCopy(action.recipient),
      new Date(action.performedAt),
      action.amount,
      JailBreakCard.trueCopy(action.card)
    );
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(), {
        "card": this.card.toJson(),
      }
    );
  }

  public toString(): string {
    return `${this.actor.user.username} purchased a ${this.card.toString()} from ${this.recipient.user.username}`;
  }

}
