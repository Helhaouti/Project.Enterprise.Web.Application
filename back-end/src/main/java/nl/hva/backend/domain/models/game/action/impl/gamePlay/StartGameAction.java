package nl.hva.backend.domain.models.game.action.impl.gamePlay;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.GameAction;

import javax.persistence.Entity;
import java.time.LocalDateTime;


/**
 * TODO: Add JavaDoc
 *
 * @author Hamza el Haouti
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
public class StartGameAction extends GameAction {

  private double startCapital;

  private LocalDateTime firstTurnEndsAt;

  public StartGameAction(
    Player actor,
    double startCapital,
    LocalDateTime firstTurnEndsAt
  ) {
    super(actor);
    this.startCapital = startCapital;
    this.firstTurnEndsAt = firstTurnEndsAt;
  }

}