package nl.hva.backend.domain.models.game.action.impl.gamePlay;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.GameAction;

import javax.persistence.Entity;


/**
 * TODO: Add JavaDoc
 *
 * @author Hamza el Haouti
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
public class DiceRollAction extends GameAction {

  private int firstDiceValue;
  private int secondDiceValue;

  public DiceRollAction(
    Player actor,
    int firstDiceValue,
    int secondDiceValue
  ) {
    super(actor);
    this.firstDiceValue = firstDiceValue;
    this.secondDiceValue = secondDiceValue;
  }

}