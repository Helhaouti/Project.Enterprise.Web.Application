import {Location} from "../Location";

export class TaxLocation extends Location {
  private _name: string;
  private _amount: number;

  public constructor(
    id: number,
    position: number,
    description: string,
    name: string,
    amount: number
  ) {
    super(TaxLocation.name, id, position, description);
    this._name = name;
    this._amount = amount;
  }

  public static trueCopy(location: TaxLocation): TaxLocation | null {
    return new TaxLocation(
      location.id,
      location.position,
      location.description,
      location.name,
      location.amount,
    );
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(),
      {
        "name": this.name,
        "amount": this.amount,
      }
    );
  }

  public get name(): string {
    return this._name;
  }

  public get amount(): number {
    return this._amount;
  }

  public override toString(): string {
    return this.name;
  }

}
