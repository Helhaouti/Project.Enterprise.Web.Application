package nl.hva.backend.domain.models.game.action.impl.gamePlay;

import lombok.NoArgsConstructor;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl.ReceiveFreeMoneyAction;

import javax.persistence.Entity;


/**
 * Representation, of the action, of a player passing Go, position 1, of the game.
 *
 * @author Hamza el Haouti
 */
@Entity
@NoArgsConstructor
public class PassGoAction extends ReceiveFreeMoneyAction {

  /**
   * Constructor for the manual creation of an instance, that is intended to be persisted to JPA.
   *
   * @param player The player passing go, and who is entitled to amount of free money.
   * @param amount The amount to be added to the balance of the player.
   */
  public PassGoAction(
    Player player,
    double amount
  ) {
    super(player, amount);
  }

}