package nl.hva.backend.domain.models.game.action.impl.money;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.GameAction;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;


/**
 * An abstract representation, of the action, of money exchange among two parties within a GameSession,
 * with at least one being an instance of Player. The (fictional monopoly) bank being represented by null.
 *
 * @author Hamza el Haouti
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
public abstract class MoneyExchangeAction extends GameAction {

  @ManyToOne
  private Player recipient;

  private double amount;

  /**
   * Constructor for the manual creation of an instance, that is intended to be persisted to JPA.
   *
   * @param payee     The party paying, a Player instance, or null.
   * @param recipient The receiving party, a Player instance, or null.
   * @param amount    The amount, to be subtracted from the payee, and added to the balance of the recipient.
   */
  protected MoneyExchangeAction(
    Player payee,
    Player recipient,
    double amount
  ) {
    super(payee);
    this.recipient = recipient;
    this.amount = amount;
  }

}