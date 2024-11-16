package nl.hva.backend.domain.models.game.action.impl.property;

import lombok.NoArgsConstructor;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.impl.gamePlay.GameAssetBidAction;
import nl.hva.backend.domain.models.game.board.location.OwnableLocation;

import javax.persistence.Entity;


/**
 * Representation, of the action, of the bidding on an owned location within the game.
 *
 * @author Hamza el Haouti
 */
@Entity
@NoArgsConstructor
public class LocationBidAction extends GameAssetBidAction {

  /**
   * Constructor for the manual creation of an instance, that is intended to be persisted to JPA.
   *
   * @param actor The player bidding.
   * @param bid   The bid on the OwnableLocation.
   */
  public LocationBidAction(
    Player actor,
    OwnableLocation.OwnableLocationBid bid
  ) {
    super(actor, bid);
  }

  @Override
  public OwnableLocation.OwnableLocationBid getBid() {
    return (OwnableLocation.OwnableLocationBid) super.getBid();
  }

}