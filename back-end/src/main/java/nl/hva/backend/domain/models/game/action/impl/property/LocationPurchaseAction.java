package nl.hva.backend.domain.models.game.action.impl.property;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl.AssetPurchaseAction;
import nl.hva.backend.domain.models.game.board.location.OwnableLocation;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;


/**
 * Representation, of the action, of purchasing a location within the game.
 *
 * @author Hamza el Haouti
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
public class LocationPurchaseAction extends AssetPurchaseAction {

  @ManyToOne
  private OwnableLocation asset;

  /**
   * Constructor for the manual creation of an instance, that is intended to be persisted to JPA.
   *
   * @param buyer         The player, or bank, who this property belongs to from now on.
   * @param previousOwner The player, or bank, who this property belonged to.
   * @param purchasePrice The cost of the purchase.
   * @param asset         The OwnableLocation being purchased.
   */
  public LocationPurchaseAction(
    Player buyer,
    Player previousOwner,
    double purchasePrice,
    OwnableLocation asset
  ) {
    super(buyer, previousOwner, purchasePrice);
    this.asset = asset;
  }

}