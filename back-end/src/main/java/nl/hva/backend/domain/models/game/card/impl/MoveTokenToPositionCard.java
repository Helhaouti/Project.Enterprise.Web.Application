package nl.hva.backend.domain.models.game.card.impl;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.card.Card;

import javax.persistence.Entity;


/**
 * TODO JavaDoc
 *
 * @author Haris Voloder
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
public class MoveTokenToPositionCard extends Card {

  private int toPosition;

  /**
   * TODO JavaDoc
   */
  public MoveTokenToPositionCard(
    String description,
    CardType type,
    int toPosition
  ) {
    super(description, type);
    this.toPosition = toPosition;
  }

}