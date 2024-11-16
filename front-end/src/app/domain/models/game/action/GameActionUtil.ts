import {CardUsageAction} from "./impl/card/CardUsageAction";
import {DrawCardAction} from "./impl/card/DrawCardAction";
import {JailBreakCardPurchaseAction} from "./impl/card/JailBreakCardPurchaseAction";
import {DeclareBankruptcyAction} from "./impl/gamePlay/DeclareBankruptcyAction";
import {DiceRollAction} from "./impl/gamePlay/DiceRollAction";
import {PlayerMoveAction} from "./impl/gamePlay/PlayerMoveAction";
import {StartGameAction} from "./impl/gamePlay/StartGameAction";
import {SwitchPlayerAction} from "./impl/gamePlay/SwitchPlayerAction";
import {WinGameAction} from "./impl/gamePlay/WinGameAction";
import {FreeFromJailAction} from "./impl/jail/FreeFromJailAction";
import {GoToJailAction} from "./impl/jail/GoToJailAction";
import {PayTaxAction} from "./impl/money/PayTaxAction";
import {ReceiveFreeMoneyAction} from "./impl/money/ReceiveFreeMoneyAction";
import {RentCollectionAction} from "./impl/money/RentCollectionAction";
import {GameAction} from "./GameAction";
import {LocationPurchaseAction} from "./impl/property/LocationPurchaseAction";
import {PropertyDevelopmentAction} from "./impl/money/PropertyDevelopmentAction";
import {SkipTurnTaxAction} from "./impl/money/SkipTurnTaxAction";
import {LocationBidAction} from "./impl/property/LocationBidAction";
import {DebtForeclosureAction} from "./impl/money/DebtForeclosureAction";
import {PassGoAction} from "./impl/gamePlay/PassGoAction";

export class GameActionUtil {
  private constructor() {
  }

  public static trueCopyArray(actions: any[]): GameAction[] {
    if (actions == undefined) return [];

    return actions
      .filter(action => action != null && action.classType != null)
      .map(GameActionUtil.trueCopy);
  }

  public static trueCopy(action: any): GameAction | null {
    switch (action.classType) {
      case CardUsageAction.name:
        return CardUsageAction.trueCopy(action);

      case PassGoAction.name:
        return PassGoAction.trueCopy(action);

      case DebtForeclosureAction.name:
        return DebtForeclosureAction.trueCopy(action);

      case DrawCardAction.name:
        return DrawCardAction.trueCopy(action);

      case JailBreakCardPurchaseAction.name:
        return JailBreakCardPurchaseAction.trueCopy(action);

      case DeclareBankruptcyAction.name:
        return DeclareBankruptcyAction.trueCopy(action);

      case DiceRollAction.name:
        return DiceRollAction.trueCopy(action);

      case PlayerMoveAction.name:
        return PlayerMoveAction.trueCopy(action);

      case StartGameAction.name:
        return StartGameAction.trueCopy(action);

      case SwitchPlayerAction.name:
        return SwitchPlayerAction.trueCopy(action);

      case WinGameAction.name:
        return WinGameAction.trueCopy(action);

      case FreeFromJailAction.name:
        return FreeFromJailAction.trueCopy(action);

      case GoToJailAction.name:
        return GoToJailAction.trueCopy(action);

      case PayTaxAction.name:
        return PayTaxAction.trueCopy(action);

      case SkipTurnTaxAction.name:
        return SkipTurnTaxAction.trueCopy(action);

      case LocationBidAction.name:
        return LocationBidAction.trueCopy(action);

      case ReceiveFreeMoneyAction.name:
        return ReceiveFreeMoneyAction.trueCopy(action);

      case RentCollectionAction.name:
        return RentCollectionAction.trueCopy(action);

      case LocationPurchaseAction.name:
        return LocationPurchaseAction.trueCopy(action);

      case PropertyDevelopmentAction.name:
        return PropertyDevelopmentAction.trueCopy(action);

      default:
        return null;
    }
  }

}
