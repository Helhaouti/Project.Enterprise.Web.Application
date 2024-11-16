package nl.hva.backend.domain.models.game.action.impl.card;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.GameAction;
import nl.hva.backend.domain.models.game.card.Card;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;


/**
 * TODO: Add JavaDoc
 *
 * @author Hamza el Haouti
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
public class DrawCardAction extends GameAction {

  @ManyToOne
  private Card card;

  public DrawCardAction(
    Player actor,
    Card card
  ) {
    super(actor);
    this.card = card;
  }

}