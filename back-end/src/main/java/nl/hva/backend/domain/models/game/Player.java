package nl.hva.backend.domain.models.game;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.board.location.Location;
import nl.hva.backend.domain.models.game.board.location.OwnableLocation;
import nl.hva.backend.domain.models.game.card.impl.JailBreakCard;
import nl.hva.backend.domain.models.user.User;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.function.Predicate;


@Entity
@Getter
@Setter
@NoArgsConstructor
public class Player {

  public final static Predicate<Player> IS_PLAYER_BANKRUPT_PREDICATE = Player::isBankrupt;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @ManyToOne
  @JsonBackReference
  private GameSession game;

  @ManyToOne
  private User user;

  //region state attributes
  private double money;

  /**
   * Board has 40 positions.
   * <p>
   * Pos 0: Placeholder for bankrupt players.
   * Pos 1: Go
   */
  private int position = 1;

  /**
   * 0: Meaning that the person is not in jail.
   * 1: First round in Jail.
   * 2: Second round in Jail.
   * ...
   */
  private int roundsInJail;

  private int turnNumber;

  private boolean gameAdmin;

  private boolean bankrupt;
  //endregion

  //region property attributes
  @ManyToMany
  private List<OwnableLocation> properties;

  @ManyToMany
  private List<JailBreakCard> cards;
  //endregion

  //region bids attributes
  @OneToMany
  private List<OwnableLocation.OwnableLocationBid> receivedLocationBids;
  @OneToMany
  private List<JailBreakCard.JailBreakCardBid> receivedJailBreakCardBids;
  @OneToMany
  private List<OwnableLocation.OwnableLocationBid> performedLocationBids;
  @OneToMany
  private List<JailBreakCard.JailBreakCardBid> performedJailBreakCardBids;
  //endregion

  //region addition to collection helper methods
  public void addReceivedBid(OwnableLocation.OwnableLocationBid bid) {
    if (bid == null) return;

    if (getReceivedLocationBids() == null
      || !(getReceivedLocationBids() instanceof ArrayList)
    ) setReceivedLocationBids(new ArrayList<>(Objects.requireNonNullElse(getReceivedLocationBids(), List.of())));

    getReceivedLocationBids().add(bid);
  }

  public void addReceivedBid(JailBreakCard.JailBreakCardBid bid) {
    if (bid == null) return;

    if (getReceivedJailBreakCardBids() == null
      || !(getReceivedJailBreakCardBids() instanceof ArrayList)
    ) setReceivedJailBreakCardBids(
      new ArrayList<>(Objects.requireNonNullElse(getReceivedJailBreakCardBids(), List.of())));

    getReceivedJailBreakCardBids().add(bid);
  }

  public void addPerformedBid(OwnableLocation.OwnableLocationBid bid) {
    if (bid == null) return;

    if (getPerformedLocationBids() == null
      || !(getPerformedLocationBids() instanceof ArrayList)
    ) setPerformedLocationBids(new ArrayList<>(Objects.requireNonNullElse(getPerformedLocationBids(), List.of())));

    getPerformedLocationBids().add(bid);
  }

  public void addPerformedBid(JailBreakCard.JailBreakCardBid bid) {
    if (bid == null) return;

    if (getPerformedJailBreakCardBids() == null
      || !(getPerformedJailBreakCardBids() instanceof ArrayList)
    ) setPerformedJailBreakCardBids(
      new ArrayList<>(Objects.requireNonNullElse(getPerformedJailBreakCardBids(), List.of())));

    getPerformedJailBreakCardBids().add(bid);
  }

  public void add(OwnableLocation location) {
    if (location == null) return;

    if (getProperties() == null
      || !(getProperties() instanceof ArrayList)
    ) setProperties(new ArrayList<>(Objects.requireNonNullElse(getProperties(), List.of())));

    getProperties().add(location);
  }

  public void add(JailBreakCard card) {
    if (card == null) return;

    if (getCards() == null
      || !(getCards() instanceof ArrayList)
    ) setCards(new ArrayList<>(Objects.requireNonNullElse(getCards(), List.of())));

    getCards().add(card);
  }
  //endregion

  public int compareRankTo(Player p2) {
    double p1NetWorth = this.getMoney()
      + this.getProperties()
      .stream()
      .mapToDouble(OwnableLocation::getInitialPurchasePrice)
      .sum();

    double p2NetWorth = p2.getMoney()
      + p2.getProperties()
      .stream()
      .mapToDouble(OwnableLocation::getInitialPurchasePrice)
      .sum();

    return Double.compare(p1NetWorth, p2NetWorth);
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Location location)) return false;
    return getId() == location.getId();
  }

  @Override
  public int hashCode() {
    return Long.hashCode(getId());
  }

}