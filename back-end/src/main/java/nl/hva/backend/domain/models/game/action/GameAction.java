package nl.hva.backend.domain.models.game.action;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.GameSession;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.impl.card.CardBidAction;
import nl.hva.backend.domain.models.game.action.impl.card.CardUsageAction;
import nl.hva.backend.domain.models.game.action.impl.card.DrawCardAction;
import nl.hva.backend.domain.models.game.action.impl.card.JailBreakCardPurchaseAction;
import nl.hva.backend.domain.models.game.action.impl.gamePlay.DeclareBankruptcyAction;
import nl.hva.backend.domain.models.game.action.impl.gamePlay.DiceRollAction;
import nl.hva.backend.domain.models.game.action.impl.gamePlay.PassGoAction;
import nl.hva.backend.domain.models.game.action.impl.gamePlay.PlayerMoveAction;
import nl.hva.backend.domain.models.game.action.impl.gamePlay.StartGameAction;
import nl.hva.backend.domain.models.game.action.impl.gamePlay.SwitchPlayerAction;
import nl.hva.backend.domain.models.game.action.impl.gamePlay.WinGameAction;
import nl.hva.backend.domain.models.game.action.impl.jail.FreeFromJailAction;
import nl.hva.backend.domain.models.game.action.impl.jail.GoToJailAction;
import nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl.DebtForeclosureAction;
import nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl.PayTaxAction;
import nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl.PropertyDevelopmentAction;
import nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl.ReceiveFreeMoneyAction;
import nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl.RentCollectionAction;
import nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl.SkipTurnTaxAction;
import nl.hva.backend.domain.models.game.action.impl.property.LocationBidAction;
import nl.hva.backend.domain.models.game.action.impl.property.LocationPurchaseAction;
import nl.hva.backend.domain.models.game.board.location.Location;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import java.time.LocalDateTime;


/**
 * Abstract representation of an action within a game.
 *
 * @author Hamza el Haouti
 */
// JPA
@Entity
@EntityListeners(AuditingEntityListener.class)
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)

// Lombok
@Getter
@Setter
@NoArgsConstructor

// Jackson ORM config
@JsonTypeInfo(
  use = JsonTypeInfo.Id.NAME,
  include = JsonTypeInfo.As.PROPERTY,
  property = "classType"
)
@JsonSubTypes({
  // Card deck related
  @JsonSubTypes.Type(value = CardUsageAction.class, name = "CardUsageAction"),
  @JsonSubTypes.Type(value = DrawCardAction.class, name = "DrawCardAction"),

  // Gameplay related
  @JsonSubTypes.Type(value = DeclareBankruptcyAction.class, name = "DeclareBankruptcyAction"),
  @JsonSubTypes.Type(value = DiceRollAction.class, name = "DiceRollAction"),
  @JsonSubTypes.Type(value = PlayerMoveAction.class, name = "PlayerMoveAction"),
  @JsonSubTypes.Type(value = StartGameAction.class, name = "StartGameAction"),
  @JsonSubTypes.Type(value = SwitchPlayerAction.class, name = "SwitchPlayerAction"),
  @JsonSubTypes.Type(value = WinGameAction.class, name = "WinGameAction"),
  @JsonSubTypes.Type(value = PassGoAction.class, name = "PassGoAction"),

  // Jail related
  @JsonSubTypes.Type(value = FreeFromJailAction.class, name = "FreeFromJailAction"),
  @JsonSubTypes.Type(value = GoToJailAction.class, name = "GoToJailAction"),

  // Money related
  @JsonSubTypes.Type(value = PayTaxAction.class, name = "PayTaxAction"),
  @JsonSubTypes.Type(value = ReceiveFreeMoneyAction.class, name = "ReceiveFreeMoneyAction"),
  @JsonSubTypes.Type(value = RentCollectionAction.class, name = "RentCollectionAction"),
  @JsonSubTypes.Type(value = SkipTurnTaxAction.class, name = "SkipTurnTaxAction"),
  @JsonSubTypes.Type(value = PropertyDevelopmentAction.class, name = "PropertyDevelopmentAction"),
  @JsonSubTypes.Type(value = LocationPurchaseAction.class, name = "LocationPurchaseAction"),
  @JsonSubTypes.Type(value = JailBreakCardPurchaseAction.class, name = "JailBreakCardPurchaseAction"),
  @JsonSubTypes.Type(value = DebtForeclosureAction.class, name = "DebtForeclosureAction"),

  // Bid related
  @JsonSubTypes.Type(value = CardBidAction.class, name = "CardBidAction"),
  @JsonSubTypes.Type(value = LocationBidAction.class, name = "LocationBidAction"),
})
public abstract class GameAction {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @ManyToOne
  private Player actor;

  @ManyToOne(optional = false)
  @JsonBackReference
  private GameSession gameSession;

  @CreatedDate
  private LocalDateTime performedAt;

  /**
   * Constructor for the manual creation of an instance, that is intended to be persisted to JPA.
   *
   * @param actor The player performing this action.
   */
  public GameAction(
    Player actor
  ) {
    this.actor = actor;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Location location)) return false;
    return getId() == location.getId();
  }

  @Override
  public int hashCode() {
    return (int) (getId() ^ (getId() >>> 32));
  }

}