package nl.hva.backend.domain.models.game.action.impl.gamePlay;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.GameAsset;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.GameAction;
import nl.hva.backend.domain.models.game.board.location.OwnableLocation;
import nl.hva.backend.domain.models.game.card.impl.JailBreakCard;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import java.util.List;


/**
 * Representation, of the action, of declaring a player bankrupt.
 * <p>
 * When a player is declared bankrupt all belongings and bid history of the player are removed. OwnableLocations are
 * then again put up for sale by the bank.
 *
 * @author Hamza el Haouti
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
public class DeclareBankruptcyAction extends GameAction {

  @ManyToMany
  private List<GameAsset.GameAssetBid> removedBids;

  @ManyToMany
  private List<OwnableLocation> removedOwnedLocations;

  @ManyToMany
  private List<JailBreakCard> removedOwnedJailBreakCard;

  private double removedMoney;

  private int removedPosition;

  /**
   * Constructor for the manual creation of an instance, that is intended to be persisted to JPA.
   *
   * @param actor The player performing this action.
   */
  public DeclareBankruptcyAction(
    Player actor,
    List<GameAsset.GameAssetBid> removedBids,
    List<OwnableLocation> removedOwnedLocations,
    List<JailBreakCard> removedOwnedJailBreakCard,
    double removedMoney,
    int removedPosition
  ) {
    super(actor);
    this.removedBids = removedBids;
    this.removedOwnedLocations = removedOwnedLocations;
    this.removedOwnedJailBreakCard = removedOwnedJailBreakCard;
    this.removedMoney = removedMoney;
    this.removedPosition = removedPosition;
  }

}