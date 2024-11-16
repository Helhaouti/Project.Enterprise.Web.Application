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
public class GoToJailCard extends Card {

  private boolean skipGo;

  /**
   * TODO JavaDoc
   *
   * @param description
   * @param type
   * @param skipGo
   */
  public GoToJailCard(
    String description,
    CardType type,
    boolean skipGo
  ) {
    super(description, type);
    this.skipGo = skipGo;
  }

}