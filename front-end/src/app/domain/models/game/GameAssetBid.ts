import {Player} from "./Player";

/**
 * TODO: JsDoc
 *
 * @author Hamza el Haouti
 */
export abstract class GameAssetBid {
  protected constructor(
    id: number,
    owner: Player,
    bidder: Player,
    amount: number,
    performedOn: Date
  ) {
    this._id = id;
    this._owner = owner;
    this._bidder = bidder;
    this._amount = amount;
    this._performedOn = performedOn;
  }

  private _id: number;

  public get id(): number {
    return this._id;
  }

  private _owner: Player;

  public get owner(): Player {
    return this._owner;
  }

  private _bidder: Player;

  public get bidder(): Player {
    return this._bidder;
  }

  private _amount: number;

  public get amount(): number {
    return this._amount;
  }

  private _performedOn: Date;

  public get performedOn(): Date {
    return this._performedOn;
  }

  public toJson(): object {
    return {
      "id": this.id,
      "owner": this.owner.toJson(),
      "bidder": this.bidder.toJson(),
      "amount": this.amount,
      "performedOn": this.performedOn.toJSON()
    }
  }

}
