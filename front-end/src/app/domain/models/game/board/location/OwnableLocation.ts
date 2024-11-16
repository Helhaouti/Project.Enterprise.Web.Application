import {Location} from "./Location";
import {GameAsset} from "../../GameAsset";

/**
 * TODO: JsDoc
 *
 * @author Hamza el Haouti
 */
export enum OwnableLocationState {
  AVAILABLE = "Available for purchase",
  PURCHASED = "Purchased"
}

/**
 * TODO: JsDoc
 *
 * @author Hamza el Haouti
 */
export abstract class OwnableLocation extends Location implements GameAsset {
  private _initialPurchasePrice: number;
  private _mortgageValue: number;

  protected constructor(
    classType: string,
    id: number,
    position: number,
    description: string,
    initialPurchasePrice: number,
    mortgageValue: number,
  ) {
    super(classType, id, position, description);
    this._initialPurchasePrice = initialPurchasePrice;
    this._mortgageValue = mortgageValue;
  }

  public get initialPurchasePrice(): number {
    return this._initialPurchasePrice;
  }

  public get mortgageValue(): number {
    return this._mortgageValue;
  }

}
