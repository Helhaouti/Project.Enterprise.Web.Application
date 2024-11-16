import {Player} from "../../../Player";
import {OwnableLocation} from "../../../board/location/OwnableLocation";
import {MoneyExchangeAction} from "./MoneyExchangeAction";
import {LocationUtil} from "../../../board/location/LocationUtil";

/**
 * A representation, of the action, of rent collection by an owner of an OwnableLocation within a GameSession,
 * from a Player that lands on it.
 *
 * @author Hamza el Haouti
 */
export class RentCollectionAction extends MoneyExchangeAction {
  public constructor(
    id: number,
    renter: Player,
    performedAt: Date,
    amount: number,
    property: OwnableLocation,
    landLord: Player
  ) {
    super(RentCollectionAction.name, id, renter, performedAt, landLord, amount);
    this._location = property;
  }

  private _location: OwnableLocation;

  public get location(): OwnableLocation {
    return this._location;
  }

  public static trueCopy(action: RentCollectionAction): RentCollectionAction | null {
    return new RentCollectionAction(
      action.id,
      Player.trueCopy(action.actor),
      new Date(action.performedAt),
      action.amount,
      <OwnableLocation>LocationUtil.trueCopy(action.location),
      Player.trueCopy(action.recipient),
    );
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(), {
        "location": this.location.toJson(),
      }
    );
  }

  public override toString(): string {
    return `${this.recipient.user.username} collected $${this.amount} worth of rent, from ${this.actor.user.username}`
      + `, for landing on ${this.location.toString()}`;
  }

}
