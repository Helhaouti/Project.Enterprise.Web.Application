import {OwnableLocation} from "../OwnableLocation";

export class Utility extends OwnableLocation {
  private _name: string;
  private _diceRollRentFactor: number;
  private _diceRollRentFactorIfTwoAreOwned: number;

  public constructor(
    id: number,
    position: number,
    description: string,
    initialPurchasePrice: number,
    name: string,
    mortgageValue: number,
    diceRollRentFactor: number,
    diceRollRentFactorIfTwoAreOwned: number,
  ) {
    super(Utility.name, id, position, description, initialPurchasePrice, mortgageValue);
    this._name = name;
    this._diceRollRentFactor = diceRollRentFactor;
    this._diceRollRentFactorIfTwoAreOwned = diceRollRentFactorIfTwoAreOwned;
  }

  public static trueCopy(location: Utility): Utility | null {
    return new Utility(
      location.id,
      location.position,
      location.description,
      location.initialPurchasePrice,
      location.name,
      location.mortgageValue,
      location.diceRollRentFactor,
      location.diceRollRentFactorIfTwoAreOwned,
    );
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(),
      {
        "initialPurchasePrice": this.initialPurchasePrice,
        "name": this.name,
        "mortgageValue": this.mortgageValue,
        "diceRollRentFactor": this.diceRollRentFactor,
        "diceRollRentFactorIfTwoAreOwned": this.diceRollRentFactorIfTwoAreOwned,
      }
    );
  }

  public get name(): string {
    return this._name;
  }

  public get diceRollRentFactor(): number {
    return this._diceRollRentFactor;
  }

  public get diceRollRentFactorIfTwoAreOwned(): number {
    return this._diceRollRentFactorIfTwoAreOwned;
  }

  public override toString(): string {
    return this.name;
  }

}
