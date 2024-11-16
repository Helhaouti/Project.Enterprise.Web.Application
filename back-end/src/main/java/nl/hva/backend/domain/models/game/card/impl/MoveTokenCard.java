package nl.hva.backend.domain.models.game.card.impl;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.card.Card;

import javax.persistence.Entity;


/**
 * TODO JavaDoc
 *
 * @author Hamza el Haouti
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
public class MoveTokenCard extends Card {

  private boolean skipGo;
  private int distance;

  /**
   * TODO JavaDoc
   */
  public MoveTokenCard(
    String description,
    CardType type,
    boolean skipGo,
    int distance
  ) {
    super(description, type);
    this.skipGo = skipGo;
    this.distance = distance;
  }

}