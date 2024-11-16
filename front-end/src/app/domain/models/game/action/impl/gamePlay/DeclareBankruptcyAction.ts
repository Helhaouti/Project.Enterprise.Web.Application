import {GameAction} from "../../GameAction";
import {Player} from "../../../Player";
import {GameAssetBid} from "../../../GameAssetBid";
import {OwnableLocation} from "../../../board/location/OwnableLocation";
import {JailBreakCard} from "../../../card/impl/JailBreakCard";
import {GameAssetBidUtil} from "../../../GameAssetBidUtil";
import {LocationUtil} from "../../../board/location/LocationUtil";
import {CardUtil} from "../../../card/CardUtil";

/**
 * TODO: Add JsDoc
 *
 * @author Hamza el Haouti
 */
export class DeclareBankruptcyAction extends GameAction {

  public constructor(
    id: number,
    actor: Player,
    performedAt: Date,
    removedBids: GameAssetBid[],
    removedOwnedLocations: OwnableLocation[],
    removedOwnedJailBreakCard: JailBreakCard[],
    removedMoney: number,
    removedPosition: number
  ) {
    super(DeclareBankruptcyAction.name, id, actor, performedAt);
    this._removedBids = removedBids;
    this._removedOwnedLocations = removedOwnedLocations;
    this._removedOwnedJailBreakCard = removedOwnedJailBreakCard;
    this._removedMoney = removedMoney;
    this._removedPosition = removedPosition;
  }

  private _removedBids: GameAssetBid[];

  get removedBids(): GameAssetBid[] {
    return this._removedBids;
  }

  private _removedOwnedLocations: OwnableLocation[];

  get removedOwnedLocations(): OwnableLocation[] {
    return this._removedOwnedLocations;
  }

  private _removedOwnedJailBreakCard: JailBreakCard[];

  get removedOwnedJailBreakCard(): JailBreakCard[] {
    return this._removedOwnedJailBreakCard;
  }

  private _removedMoney: number;

  get removedMoney(): number {
    return this._removedMoney;
  }

  private _removedPosition: number;

  get removedPosition(): number {
    return this._removedPosition;
  }

  public static trueCopy(action: DeclareBankruptcyAction): GameAction | null {
    return new DeclareBankruptcyAction(
      action.id,
      Player.trueCopy(action.actor),
      new Date(action.performedAt),
      action.removedBids.map(GameAssetBidUtil.trueCopy),
      action.removedOwnedLocations.map(loc => <OwnableLocation>LocationUtil.trueCopy(loc)),
      action.removedOwnedJailBreakCard.map(card => <JailBreakCard>CardUtil.trueCopy(card)),
      action.removedMoney,
      action.removedPosition
    );
  }

  public override toString(): string {
    return `${this.actor.user.username} was declared bankrupt.`;
  }

}
