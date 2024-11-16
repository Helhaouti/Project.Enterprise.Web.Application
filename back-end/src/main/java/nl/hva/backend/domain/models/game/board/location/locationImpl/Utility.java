package nl.hva.backend.domain.models.game.board.location.locationImpl;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.board.GameBoard;
import nl.hva.backend.domain.models.game.board.location.OwnableLocation;

import javax.persistence.Entity;


@Entity
@NoArgsConstructor
@Getter
@Setter
public class Utility extends OwnableLocation {

  private String name;
  private double diceRollRentFactor;
  private double diceRollRentFactorIfTwoAreOwned;

  public Utility(
    long id,
    int position,
    String description,
    GameBoard gameBoard,
    double initialPurchasePrice,
    String name,
    double diceRollRentFactor,
    double diceRollRentFactorIfTwoAreOwned
  ) {
    super(id, position, description, gameBoard, initialPurchasePrice);
    this.name = name;
    this.diceRollRentFactor = diceRollRentFactor;
    this.diceRollRentFactorIfTwoAreOwned = diceRollRentFactorIfTwoAreOwned;
  }

}