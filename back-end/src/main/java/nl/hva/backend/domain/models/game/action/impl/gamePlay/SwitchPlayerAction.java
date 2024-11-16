package nl.hva.backend.domain.models.game.action.impl.gamePlay;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.GameAction;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
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
public class SwitchPlayerAction extends GameAction {

  @ManyToOne
  private Player newPlayer;

  private LocalDateTime turnEndsAt;

  public SwitchPlayerAction(
    Player actor,
    Player newPlayer,
    LocalDateTime turnEndsAt
  ) {
    super(actor);
    this.newPlayer = newPlayer;
    this.turnEndsAt = turnEndsAt;
  }

}