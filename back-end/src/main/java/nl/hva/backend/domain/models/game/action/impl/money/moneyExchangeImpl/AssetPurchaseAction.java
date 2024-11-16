package nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl;

import lombok.NoArgsConstructor;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.impl.money.MoneyExchangeAction;

import javax.persistence.Entity;


/**
 * An abstract representation, of the action, of an exchange of property between two parties within a GameSession,
 * with at least one being an instance of a Player. The (fictional monopoly) bank being represented by null.
 *
 * @author Hamza el Haouti
 */
@Entity
@NoArgsConstructor
public abstract class AssetPurchaseAction extends MoneyExchangeAction {

  /**
   * Constructor for the manual creation of an instance, that is intended to be persisted to JPA.
   *
   * @param newOwner      The player, or bank, who this property belongs to from now on.
   * @param previousOwner The player, or bank, who this property belonged to.
   * @param purchasePrice The cost of the purchase.
   */
  protected AssetPurchaseAction(
    Player newOwner,
    Player previousOwner,
    double purchasePrice
  ) {
    super(newOwner, previousOwner, purchasePrice);
  }

}