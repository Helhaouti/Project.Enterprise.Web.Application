package nl.hva.backend.domain.models.game.action.impl.gamePlay;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.GameAsset;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.GameAction;
import nl.hva.backend.domain.models.game.action.impl.card.CardBidAction;
import nl.hva.backend.domain.models.game.action.impl.property.LocationBidAction;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;


/**
 * Abstract representation, of the action, of the bidding on asset within the game.
 *
 * @author Hamza el Haouti
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@JsonTypeInfo(
  use = JsonTypeInfo.Id.NAME,
  include = JsonTypeInfo.As.PROPERTY,
  property = "classType"
)
@JsonSubTypes({
  @JsonSubTypes.Type(value = CardBidAction.class, name = "CardBidAction"),
  @JsonSubTypes.Type(value = LocationBidAction.class, name = "LocationBidAction"),
})
public abstract class GameAssetBidAction extends GameAction {

  @ManyToOne
  GameAsset.GameAssetBid bid;

  /**
   * Constructor for the manual creation of an instance, that is intended to be persisted to JPA.
   *
   * @param actor The player bidding.
   * @param bid   The bid on the Asset.
   */
  protected GameAssetBidAction(
    Player actor,
    GameAsset.GameAssetBid bid
  ) {
    super(actor);
    this.bid = bid;
  }

}