package nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.impl.money.MoneyExchangeAction;

import javax.persistence.Entity;


/**
 * A representation, of the action, of a tax payment within a GameSession,
 * this, for example occurs when landing on TaxLocation on the GameBoard.
 *
 * @author Hamza el Haouti
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
public class PayTaxAction extends MoneyExchangeAction {

  /**
   * Constructor for the manual creation of an instance, that is intended to be persisted to JPA.
   *
   * @param payee  The party paying, a Player instance.
   * @param amount The amount, to be subtracted from the payee, and given to the bank.
   */
  public PayTaxAction(
    Player payee,
    double amount
  ) {
    super(payee, null, amount);
  }

}