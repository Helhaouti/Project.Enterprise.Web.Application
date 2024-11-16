package nl.hva.backend.domain.models.game.card;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.board.GameBoard;
import nl.hva.backend.domain.models.game.board.location.Location;
import nl.hva.backend.domain.models.game.card.impl.FreeMoneyCard;
import nl.hva.backend.domain.models.game.card.impl.GoToJailCard;
import nl.hva.backend.domain.models.game.card.impl.JailBreakCard;
import nl.hva.backend.domain.models.game.card.impl.MoveTokenCard;
import nl.hva.backend.domain.models.game.card.impl.MoveTokenToPositionCard;
import nl.hva.backend.domain.models.game.card.impl.PayMoneyCard;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;


/**
 * TODO JavaDoc
 *
 * @author Hamza el Haouti
 */
// Lombok
@Getter
@Setter
@NoArgsConstructor
// JPA
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
// Jackson ORM config for inheritance.
@JsonTypeInfo(
  use = JsonTypeInfo.Id.NAME,
  include = JsonTypeInfo.As.PROPERTY,
  property = "classType"
)
@JsonSubTypes({
  @Type(value = FreeMoneyCard.class, name = "FreeMoneyCard"),
  @Type(value = GoToJailCard.class, name = "GoToJailCard"),
  @Type(value = JailBreakCard.class, name = "JailBreakCard"),
  @Type(value = MoveTokenCard.class, name = "MoveTokenCard"),
  @Type(value = MoveTokenToPositionCard.class, name = "MoveTokenToPositionCard"),
  @Type(value = PayMoneyCard.class, name = "PayMoneyCard"),
})
public abstract class Card {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  private String description;

  @Enumerated(EnumType.STRING)
  private CardType type;

  @ManyToOne
  @JsonBackReference
  private GameBoard gameBoard;

  /**
   * TODO JavaDoc
   */
  public Card(
    String description,
    CardType type
  ) {
    this.description = description;
    this.type = type;
  }

  public enum CardType {
    CHEST,
    CHANCE
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