import {GameAssetBid} from "../../GameAssetBid";
import {Player} from "../../Player";
import {JailBreakCard} from "./JailBreakCard";

/**
 * TODO: JsDoc
 *
 * @author Hamza el Haouti
 */
export class JailBreakCardBid extends GameAssetBid {
  constructor(
    id: number,
    owner: Player,
    bidder: Player,
    amount: number,
    performedOn: Date,
    card: JailBreakCard
  ) {
    super(id, owner, bidder, amount, performedOn);
    this._card = card;
  }

  private _card: JailBreakCard;

  public get card(): JailBreakCard {
    return this._card;
  }

  public static trueCopy(bid: JailBreakCardBid): JailBreakCardBid {
    return new JailBreakCardBid(
      bid.id,
      bid.owner,
      bid.bidder,
      bid.amount,
      bid.performedOn,
      bid.card
    );
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(),
      {
        "card": this.card.toJson()
      }
    );
  }

  public override toString(): string {
    return `${this.bidder.user.username} bid $${this.amount} for the Get-out-jail card of ${this.owner.user.username}`;
  }

}
