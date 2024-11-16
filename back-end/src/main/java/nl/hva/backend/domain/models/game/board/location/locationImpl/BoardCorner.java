package nl.hva.backend.domain.models.game.board.location.locationImpl;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.board.GameBoard;
import nl.hva.backend.domain.models.game.board.location.Location;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;


@NoArgsConstructor
@Getter
@Setter
// JPA
@Entity
public class BoardCorner extends Location {

  public final static int DEFAULT_GO_LOCATION = 1;
  public final static int DEFAULT_JAIL_LOCATION = 11;
  public final static int DEFAULT_FREE_PARKING_LOCATION = 21;
  public final static int DEFAULT_GO_TO_JAIL_LOCATION = 31;

  @Enumerated(EnumType.STRING)
  private BoardCornerType type;

  public BoardCorner(
    long id,
    int position,
    String description,
    GameBoard gameBoard,
    BoardCornerType type
  ) {
    super(id, position, description, gameBoard);
    this.type = type;
  }

  public enum BoardCornerType {
    FREE_PARKING,
    GO,
    GO_TO_JAIL,
    JAIL
  }

}