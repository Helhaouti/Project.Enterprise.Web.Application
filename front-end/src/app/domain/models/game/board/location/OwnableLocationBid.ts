import {GameAssetBid} from "../../GameAssetBid";
import {Player} from "../../Player";
import {OwnableLocation} from "./OwnableLocation";
import {LocationUtil} from "./LocationUtil";

/**
 * TODO: JsDoc
 *
 * @author Hamza el Haouti
 */
export class OwnableLocationBid extends GameAssetBid {
  public constructor(
    id: number,
    owner: Player,
    bidder: Player,
    amount: number,
    performedOn: Date,
    location: OwnableLocation
  ) {
    super(id, owner, bidder, amount, performedOn);
    this._location = location;
  }

  private _location: OwnableLocation;

  public get location(): OwnableLocation {
    return this._location;
  }

  public static trueCopy(bid: OwnableLocationBid): OwnableLocationBid {
    return new OwnableLocationBid(
      bid.id,
      Player.trueCopy(bid.owner),
      Player.trueCopy(bid.bidder),
      bid.amount,
      new Date(bid.performedOn),
      <OwnableLocation>LocationUtil.trueCopy(bid.location)
    );
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(),
      {
        "location": this.location.toJson()
      }
    );
  }

}
