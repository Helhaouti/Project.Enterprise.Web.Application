import {Card, CardType} from "../Card";
import {GameAsset} from "../../GameAsset";

export class JailBreakCard extends Card implements GameAsset {
  private _initialPurchasePrice: number;

  public constructor(
    id: number,
    description: string,
    type: CardType,
    initialPurchasePrice: number
  ) {
    super(JailBreakCard.name, id, description, type);
    this._initialPurchasePrice = initialPurchasePrice;
  }

  public static trueCopy(action: JailBreakCard): JailBreakCard | null {
    return new JailBreakCard(
      action.id,
      action.description,
      action.type,
      action.initialPurchasePrice
    );
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(),
      {
        "initialPurchasePrice": this.initialPurchasePrice
      }
    );
  }

  public get initialPurchasePrice(): number {
    return this._initialPurchasePrice;
  }

  public override toString(): string {
    return "Get-out-of-jail card";
  }

}
