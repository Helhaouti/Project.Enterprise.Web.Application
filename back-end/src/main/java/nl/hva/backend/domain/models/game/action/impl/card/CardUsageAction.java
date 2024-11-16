package nl.hva.backend.domain.models.game.action.impl.card;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.GameAction;
import nl.hva.backend.domain.models.game.card.Card;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;


@Entity
@Getter
@Setter
@NoArgsConstructor
public class CardUsageAction extends GameAction {

  @ManyToOne
  private Card card;

  public CardUsageAction(
    Player actor,
    Card card
  ) {
    super(actor);
    this.card = card;
  }

}