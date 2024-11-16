package nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl;

import lombok.NoArgsConstructor;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.impl.money.MoneyExchangeAction;

import javax.persistence.Entity;


/**
 * Representation, of the action, of a tax on skipping a turn, by for example not throwing dice, or picking a card.
 * This tax is paid by a player to the bank.
 *
 * @author Hamza el Haouti
 */
@Entity
@NoArgsConstructor
public class SkipTurnTaxAction extends MoneyExchangeAction {

  /**
   * Constructor for the manual creation of an instance, that is intended to be persisted to JPA.
   *
   * @param payee  The party paying, a Player instance.
   * @param amount The tax amount to be paid to the bank.
   */
  public SkipTurnTaxAction(
    Player payee,
    double amount
  ) {
    super(payee, null, amount);
  }

}