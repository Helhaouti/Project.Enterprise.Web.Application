package nl.hva.backend.domain.models.game.board.location.locationImpl;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.board.GameBoard;
import nl.hva.backend.domain.models.game.board.location.Location;

import javax.persistence.Entity;


@Entity
@NoArgsConstructor
@Getter
@Setter
public class TaxLocation extends Location {

  private String name;
  private double amount;

  public TaxLocation(
    long id,
    int position,
    String description,
    GameBoard gameBoard,
    String name,
    double amount
  ) {
    super(id, position, description, gameBoard);
    this.name = name;
    this.amount = amount;
  }

}