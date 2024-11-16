import {GameAssetBidAction} from "../gamePlay/GameAssetBidAction";
import {Player} from "../../../Player";
import {OwnableLocationBid} from "../../../board/location/OwnableLocationBid";

/**
 * Representation, of the action, of the bidding on an owned location within the game.
 *
 * @author Hamza el Haouti
 */
export class LocationBidAction extends GameAssetBidAction {

  public constructor(
    id: number,
    actor: Player,
    performedAt: Date,
    bid: OwnableLocationBid
  ) {
    super(LocationBidAction.name, id, actor, performedAt, bid);
  }

  public override get bid(): OwnableLocationBid {
    return <OwnableLocationBid>super.bid;
  }

  public static trueCopy(bid: LocationBidAction): LocationBidAction {
    return new LocationBidAction(
      bid.id,
      Player.trueCopy(bid.actor),
      new Date(bid.performedAt),
      OwnableLocationBid.trueCopy(bid.bid),
    );
  }

}
