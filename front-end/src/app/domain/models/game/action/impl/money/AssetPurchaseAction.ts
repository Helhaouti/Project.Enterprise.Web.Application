import {Player} from "../../../Player";
import {MoneyExchangeAction} from "./MoneyExchangeAction";

/**
 * An abstract representation, of the action, of an exchange of property between two parties within a GameSession,
 * with at least one being an instance of a Player. The (fictional monopoly) bank being represented by null.
 *
 * @author Hamza el Haouti
 */
export abstract class AssetPurchaseAction extends MoneyExchangeAction {

  protected constructor(
    classType: string,
    id: number,
    newOwner: Player,
    previousOwner: Player,
    performedAt: Date,
    purchasePrice: number
  ) {
    super(classType, id, newOwner, performedAt, previousOwner, purchasePrice);
  }

}
