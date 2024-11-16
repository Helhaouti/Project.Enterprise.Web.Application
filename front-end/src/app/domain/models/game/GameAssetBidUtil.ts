import {JailBreakCardBid} from "./card/impl/JailBreakCardBid";
import {OwnableLocationBid} from "./board/location/OwnableLocationBid";
import {GameAssetBid} from "./GameAssetBid";

export class GameAssetBidUtil {
  private constructor() {
  }

  public static trueCopy(bid: any): GameAssetBid | null {
    switch (bid.classType) {
      case JailBreakCardBid.name:
        return JailBreakCardBid.trueCopy(bid);

      case OwnableLocationBid.name:
        return OwnableLocationBid.trueCopy(bid);

      default:
        return null;
    }
  }

}
