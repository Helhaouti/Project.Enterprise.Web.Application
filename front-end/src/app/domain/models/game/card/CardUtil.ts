import {FreeMoneyCard} from "./impl/FreeMoneyCard";
import {GoToJailCard} from "./impl/GoToJailCard";
import {JailBreakCard} from "./impl/JailBreakCard";
import {MoveTokenCard} from "./impl/MoveTokenCard";
import {PayMoneyCard} from "./impl/PayMoneyCard";
import {Card} from "./Card";
import {MoveTokenToPositionCard} from "./impl/MoveTokenToPositionCard";

export class CardUtil {
  private constructor() {
  }

  public static trueCopyArray(cards: any[]): Card[] {
    if (cards == undefined) return [];
    return cards
      .filter(card => card != null && card.classType != null)
      .map(CardUtil.trueCopy);
  }

  public static trueCopy(card: any): Card | null {
    switch (card.classType) {
      case FreeMoneyCard.name:
        return FreeMoneyCard.trueCopy(card);

      case GoToJailCard.name:
        return GoToJailCard.trueCopy(card);

      case JailBreakCard.name:
        return JailBreakCard.trueCopy(card);

      case MoveTokenCard.name:
        return MoveTokenCard.trueCopy(card);

      case MoveTokenToPositionCard.name:
        return MoveTokenToPositionCard.trueCopy(card);

      case PayMoneyCard.name:
        return PayMoneyCard.trueCopy(card);

      default:
        return null;
    }
  }

}
