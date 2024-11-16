import {GameAction} from "../../GameAction";
import {GameAssetBid} from "../../../GameAssetBid";
import {Player} from "../../../Player";

/**
 * TODO: JsDoc
 *
 * @author Hamza el Haouti
 */
export abstract class GameAssetBidAction extends GameAction {
  protected constructor(
    classType: string,
    id: number,
    actor: Player,
    performedAt: Date,
    bid: GameAssetBid
  ) {
    super(classType, id, actor, performedAt);
    this._bid = bid;
  }

  private _bid: GameAssetBid;

  public get bid(): GameAssetBid {
    return this._bid;
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(), {
        "bid": this.bid.toJson(),
      });
  }

  public override toString(): string {
    return `${this.bid};`
  }

}
