package nl.hva.backend.domain.models.game.action.impl.jail;

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
public class FreeFromJailAction extends GameAction {

  public FreeFromJailAction(
    Player actor
  ) {
    super(actor);
  }

}