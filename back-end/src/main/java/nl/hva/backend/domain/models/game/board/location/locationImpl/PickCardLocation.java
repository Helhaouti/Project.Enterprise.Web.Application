package nl.hva.backend.domain.models.game.board.location.locationImpl;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.board.GameBoard;
import nl.hva.backend.domain.models.game.board.location.Location;
import nl.hva.backend.domain.models.game.card.Card;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;


@Entity
@NoArgsConstructor
@Getter
@Setter
public class PickCardLocation extends Location {

  @Enumerated(EnumType.STRING)
  private Card.CardType type;

  public PickCardLocation(
    long id,
    int position,
    String description,
    GameBoard gameBoard,
    Card.CardType type
  ) {
    super(id, position, description, gameBoard);
    this.type = type;
  }

}