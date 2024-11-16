package nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.impl.money.MoneyExchangeAction;
import nl.hva.backend.domain.models.game.board.location.OwnableLocation;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;


/**
 * A representation, of the action, of rent collection by an owner of an OwnableLocation within a GameSession,
 * from a Player that lands on it.
 *
 * @author Hamza el Haouti
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
public class RentCollectionAction extends MoneyExchangeAction {

  @ManyToOne
  private OwnableLocation location;

  /**
   * Constructor for the manual creation of an instance, that is intended to be persisted to JPA.
   *
   * @param renter   A Player instance, that landed on owned location.
   * @param landLord A player instance, that owns that the location.
   * @param amount   The rent, to be subtracted from the renter, and added to the balance of the landLord.
   */
  public RentCollectionAction(
    Player renter,
    Player landLord,
    double amount,
    OwnableLocation location
  ) {
    super(renter, landLord, amount);
    this.location = location;
  }

}