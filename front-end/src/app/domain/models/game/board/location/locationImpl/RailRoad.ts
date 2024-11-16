import {OwnableLocation} from "../OwnableLocation";

export class RailRoad extends OwnableLocation {
  private _name: string;
  private _rent: number;
  private _rentIfTwoAreOwned: number;
  private _rentIfThreeOwned: number;
  private _rentIfFourAreOwned: number;

  constructor(
    id: number,
    position: number,
    description: string,
    initialPurchasePrice: number,
    name: string,
    mortgageValue: number,
    rent: number,
    rentIfTwoAreOwned: number,
    rentIfThreeOwned: number,
    rentIfFourAreOwned: number
  ) {
    super(RailRoad.name, id, position, description, initialPurchasePrice, mortgageValue);
    this._name = name;
    this._rent = rent;
    this._rentIfTwoAreOwned = rentIfTwoAreOwned;
    this._rentIfThreeOwned = rentIfThreeOwned;
    this._rentIfFourAreOwned = rentIfFourAreOwned;
  }

  public static trueCopy(location: RailRoad): RailRoad {
    return new RailRoad(
      location.id,
      location.position,
      location.description,
      location.initialPurchasePrice,
      location.name,
      location.mortgageValue,
      location.rent,
      location.rentIfTwoAreOwned,
      location.rentIfThreeOwned,
      location.rentIfFourAreOwned,
    );
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(),
      {
        "initialPurchasePrice": this.initialPurchasePrice,
        "name": this.name,
        "mortgageValue": this.mortgageValue,
        "rent": this.rent,
        "rentIfTwoAreOwned": this.rentIfTwoAreOwned,
        "rentIfThreeOwned": this.rentIfThreeOwned,
        "rentIfFourAreOwned": this.rentIfFourAreOwned,
      }
    );
  }

  get name(): string {
    return this._name;
  }

  get rent(): number {
    return this._rent;
  }

  get rentIfTwoAreOwned(): number {
    return this._rentIfTwoAreOwned;
  }

  get rentIfThreeOwned(): number {
    return this._rentIfThreeOwned;
  }

  get rentIfFourAreOwned(): number {
    return this._rentIfFourAreOwned;
  }

  override toString(): string {
    return this.name;
  }
}
