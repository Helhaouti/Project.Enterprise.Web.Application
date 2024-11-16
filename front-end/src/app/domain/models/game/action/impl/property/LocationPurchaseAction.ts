import {GameAction} from "../../GameAction";
import {Player} from "../../../Player";
import {OwnableLocation} from "../../../board/location/OwnableLocation";
import {AssetPurchaseAction} from "../money/AssetPurchaseAction";
import {LocationUtil} from "../../../board/location/LocationUtil";

export class LocationPurchaseAction extends AssetPurchaseAction {
  private _asset: OwnableLocation;

  public constructor(
    id: number,
    buyer: Player,
    performedAt: Date,
    asset: OwnableLocation,
    previousOwner: Player,
    purchasePrice: number
  ) {
    super(LocationPurchaseAction.name, id, buyer, previousOwner, performedAt, purchasePrice);
    this._asset = asset;
  }

  public get asset(): OwnableLocation {
    return this._asset;
  }

  public static trueCopy(action: LocationPurchaseAction): GameAction | null {
    return new LocationPurchaseAction(
      action.id,
      Player.trueCopy(action.actor),
      new Date(action.performedAt),
      <OwnableLocation>LocationUtil.trueCopy(action.asset),
      action.recipient == null ? null : Player.trueCopy(action.recipient),
      action.amount,
    );
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(), {
        "asset": this.asset.toJson(),
      }
    );
  }

  public override toString(): string {
    return `${this.actor?.user.username} bought ${this.asset.toString()} from ${this.recipient == null ? "the bank" : this.recipient.user.username}`;
  }

}
