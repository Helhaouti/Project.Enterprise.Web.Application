import {GameAssetBidAction} from "../gamePlay/GameAssetBidAction";
import {Player} from "../../../Player";
import {JailBreakCardBid} from "../../../card/impl/JailBreakCardBid";

/**
 * TODO: JsDoc
 *
 * @author Hamza el Haouti
 */
export class CardBidAction extends GameAssetBidAction {

  public constructor(
    id: number,
    actor: Player,
    performedAt: Date,
    bid: JailBreakCardBid
  ) {
    super(CardBidAction.name, id, actor, performedAt, bid);
  }

  override get bid(): JailBreakCardBid {
    return <JailBreakCardBid>super.bid;
  }

  public static trueCopy(bid: CardBidAction): CardBidAction {
    return new CardBidAction(
      bid.id,
      Player.trueCopy(bid.actor),
      new Date(bid.performedAt),
      JailBreakCardBid.trueCopy(bid.bid),
    );
  }

}
