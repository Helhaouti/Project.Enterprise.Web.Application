package nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.impl.money.MoneyExchangeAction;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;


/**
 * Representation, of the action, of a foreclosure when a player defaults on debt. After this action the debtor needs to
 * be declared bankrupt.
 *
 * @author Hamza el Haouti
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
public class DebtForeclosureAction extends MoneyExchangeAction {

  @ManyToOne
  private MoneyExchangeAction reasonOfDebt;

  /**
   * Constructor for the manual creation of an instance, that is intended to be persisted to JPA.
   *
   * @param debtor          The player instance who owes debt.
   * @param creditor        The party who is owed money, either the bank, or a player.
   * @param amountAvailable The amount the debtor still can pay.
   * @param reasonOfDebt    Action, that resulted in the debt.
   */
  public DebtForeclosureAction(
    Player debtor,
    Player creditor,
    double amountAvailable,
    MoneyExchangeAction reasonOfDebt
  ) {
    super(debtor, creditor, amountAvailable);
    this.reasonOfDebt = reasonOfDebt;
  }

}