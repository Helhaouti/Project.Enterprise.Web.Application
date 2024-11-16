package nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl;

import lombok.NoArgsConstructor;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.impl.money.MoneyExchangeAction;

import javax.persistence.Entity;


/**
 * A representation, of the action, of receiving free money within a GameSession.
 *
 * @author Hamza el Haouti
 */
@Entity
@NoArgsConstructor
public class ReceiveFreeMoneyAction extends MoneyExchangeAction {

  /**
   * Constructor for the manual creation of an instance, that is intended to be persisted to JPA.
   *
   * @param recipient The receiving party, a Player instance.
   * @param amount    The amount to be added to the balance of the recipient.
   */
  public ReceiveFreeMoneyAction(
    Player recipient,
    double amount
  ) {
    super(null, recipient, amount);
  }

}